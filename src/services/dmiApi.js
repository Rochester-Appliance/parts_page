import axios from 'axios';

// DMI API Configuration
const DMI_CONFIG = {
    DEALER_ID: '118215',
    REST_CODE: 'DL67AJ19M2R0J',
    // Use different URLs based on environment
    BASE_URL: process.env.NODE_ENV === 'production'
        ? 'https://thingproxy.freeboard.io/fetch/https://dmidrs.com/dealers/dmirest'
        : '/api/dmi-proxy/dealers/dmirest',
    SANDBOX_URL: process.env.NODE_ENV === 'production'
        ? 'https://thingproxy.freeboard.io/fetch/https://dmidrs.com/dealers_sb/dmirest'
        : '/api/dmi-proxy/dealers_sb/dmirest',
    USE_SANDBOX: false, // Set to true for testing
    USE_MOCK: false // Set to true to use mock data
};

// Enhanced cache system
let inventoryCache = null;
let cacheTimestamp = null;
const CACHE_DURATION = 60 * 60 * 1000; // 60 minutes - longer cache for slow APIs

// Search cache to store recent search results
const searchCache = new Map();
const SEARCH_CACHE_DURATION = 20 * 60 * 1000; // 20 minutes - longer search cache
const MAX_SEARCH_CACHE_SIZE = 100;

// Loading state
let isLoadingInventory = false;
let loadingPromise = null;

// Pre-indexed search data for faster lookups
let searchIndex = null;
let indexTimestamp = null;

// Log which environment we're using
console.log(`DMI API Environment: ${process.env.NODE_ENV || 'development'}`);
console.log(`DMI Base URL: ${DMI_CONFIG.BASE_URL}`);

// Create axios instance with default config
const apiClient = axios.create({
    timeout: 180000, // Increased to 3 minutes for slow APIs
    headers: {
        'Content-Type': 'application/json',
    }
});

// Request interceptor for debugging
apiClient.interceptors.request.use(request => {
    console.log('DMI API Request:', request);
    return request;
}, error => {
    console.error('DMI API Request Error:', error);
    return Promise.reject(error);
});

// Response interceptor for debugging
apiClient.interceptors.response.use(response => {
    console.log('DMI API Response:', response);
    return response;
}, error => {
    console.error('DMI API Response Error:', error);
    return Promise.reject(error);
});

// Helper function to build URL with credentials
const buildUrl = (resource, additionalParams = {}) => {
    const baseUrl = DMI_CONFIG.USE_SANDBOX ? DMI_CONFIG.SANDBOX_URL : DMI_CONFIG.BASE_URL;
    const params = new URLSearchParams({
        format: 'json',
        resource: resource,
        dealerid: DMI_CONFIG.DEALER_ID,
        restcode: DMI_CONFIG.REST_CODE,
        ...additionalParams
    });

    return `${baseUrl}/dmirest.php?${params.toString()}`;
};

// Helper function to build POST URL
const buildPostUrl = (resource) => {
    const baseUrl = DMI_CONFIG.USE_SANDBOX ? DMI_CONFIG.SANDBOX_URL : DMI_CONFIG.BASE_URL;
    const params = new URLSearchParams({
        format: 'json',
        resource: resource,
        dealerid: DMI_CONFIG.DEALER_ID,
        restcode: DMI_CONFIG.REST_CODE
    });

    return `${baseUrl}/dmirest/dmirest_api.php?${params.toString()}`;
};

// Helper function to create search index
const createSearchIndex = (inventory) => {
    const index = {
        byModel: new Map(),
        byBrand: new Map(),
        byDescription: new Map(),
        byCategory: new Map(),
        allItems: inventory
    };

    inventory.forEach(item => {
        // Index by model number
        if (item.Model_Number) {
            const modelLower = item.Model_Number.toLowerCase();
            // Store by full model and by parts
            index.byModel.set(modelLower, item);

            // Also index by model parts for partial matches
            const modelParts = modelLower.split(/[\s-_]+/);
            modelParts.forEach(part => {
                if (part.length > 2) {
                    if (!index.byModel.has(part)) {
                        index.byModel.set(part, []);
                    }
                    const items = index.byModel.get(part);
                    if (Array.isArray(items)) {
                        items.push(item);
                    }
                }
            });
        }

        // Index by brand
        if (item.Brand) {
            const brandLower = item.Brand.toLowerCase();
            if (!index.byBrand.has(brandLower)) {
                index.byBrand.set(brandLower, []);
            }
            index.byBrand.get(brandLower).push(item);
        }

        // Index by description words
        if (item.Description) {
            const words = item.Description.toLowerCase().split(/\s+/);
            words.forEach(word => {
                if (word.length > 3) {
                    if (!index.byDescription.has(word)) {
                        index.byDescription.set(word, []);
                    }
                    index.byDescription.get(word).push(item);
                }
            });
        }

        // Index by category
        if (item.Category_Major) {
            const categoryLower = item.Category_Major.toLowerCase();
            if (!index.byCategory.has(categoryLower)) {
                index.byCategory.set(categoryLower, []);
            }
            index.byCategory.get(categoryLower).push(item);
        }
    });

    return index;
};

// Helper function to search using index
const searchWithIndex = (searchTerm, index) => {
    const searchLower = searchTerm.toLowerCase();
    const resultSet = new Set();

    // Exact model match has highest priority
    if (index.byModel.has(searchLower)) {
        const item = index.byModel.get(searchLower);
        if (!Array.isArray(item)) {
            resultSet.add(item);
        }
    }

    // Search in model parts
    const searchParts = searchLower.split(/[\s-_]+/);
    searchParts.forEach(part => {
        if (part.length > 2 && index.byModel.has(part)) {
            const items = index.byModel.get(part);
            if (Array.isArray(items)) {
                items.forEach(item => resultSet.add(item));
            }
        }
    });

    // Search in brands
    if (index.byBrand.has(searchLower)) {
        index.byBrand.get(searchLower).forEach(item => resultSet.add(item));
    }

    // Search in description words
    const words = searchLower.split(/\s+/);
    words.forEach(word => {
        if (word.length > 3 && index.byDescription.has(word)) {
            index.byDescription.get(word).forEach(item => resultSet.add(item));
        }
    });

    // Search in categories
    if (index.byCategory.has(searchLower)) {
        index.byCategory.get(searchLower).forEach(item => resultSet.add(item));
    }

    // Also do a fallback substring search on items not yet found
    if (resultSet.size < 50) {
        index.allItems.forEach(item => {
            if (!resultSet.has(item)) {
                const modelMatch = item.Model_Number && item.Model_Number.toLowerCase().includes(searchLower);
                const descMatch = item.Description && item.Description.toLowerCase().includes(searchLower);
                const brandMatch = item.Brand && item.Brand.toLowerCase().includes(searchLower);

                if (modelMatch || descMatch || brandMatch) {
                    resultSet.add(item);
                }
            }
        });
    }

    return Array.from(resultSet);
};

// DMI API Service
const dmiApi = {
    // Preload inventory (call this on app start)
    async preloadInventory() {
        if (inventoryCache && cacheTimestamp && (Date.now() - cacheTimestamp < CACHE_DURATION)) {
            console.log('📦 Inventory already cached');
            return;
        }

        console.log('🔄 Preloading inventory in background...');
        // Don't await, let it load in background
        this.getInventory().catch(err => {
            console.error('Failed to preload inventory:', err);
        });
    },

    // Get full inventory with improved caching
    async getInventory(params = {}) {
        if (DMI_CONFIG.USE_MOCK) {
            console.log('🔄 Mock mode is enabled but no mock data available');
            return [];
        }

        // Check cache first
        if (inventoryCache && cacheTimestamp && (Date.now() - cacheTimestamp < CACHE_DURATION)) {
            console.log('📦 Using cached inventory data');
            return inventoryCache;
        }

        // If already loading, return the existing promise
        if (isLoadingInventory && loadingPromise) {
            console.log('⏳ Inventory is already being loaded, waiting...');
            return loadingPromise;
        }

        isLoadingInventory = true;

        loadingPromise = (async () => {
            try {
                const url = buildUrl('inventory', params);
                console.log('🌐 Fetching real inventory from DMI API...');
                console.log('API URL:', url);
                console.log('⏱️ This may take up to 3 minutes - please wait...');

                const startTime = Date.now();
                const response = await apiClient.get(url);
                const endTime = Date.now();
                console.log(`⚡ API responded in ${((endTime - startTime) / 1000).toFixed(2)} seconds`);

                console.log('📡 API Response status:', response.status);
                console.log('📡 API Response data type:', typeof response.data);
                console.log('📡 API Response is array:', Array.isArray(response.data));

                // Check if response.data is actually the inventory array
                let inventoryData = response.data;

                // Sometimes APIs wrap data in an object
                if (response.data && !Array.isArray(response.data)) {
                    console.log('⚠️ Response data is not an array, checking for wrapped data...');
                    console.log('Response keys:', Object.keys(response.data));

                    // Check common wrapper patterns
                    if (response.data.data && Array.isArray(response.data.data)) {
                        inventoryData = response.data.data;
                    } else if (response.data.items && Array.isArray(response.data.items)) {
                        inventoryData = response.data.items;
                    } else if (response.data.inventory && Array.isArray(response.data.inventory)) {
                        inventoryData = response.data.inventory;
                    } else {
                        console.error('❌ Unexpected response format:', response.data);
                        return [];
                    }
                }

                // Cache the response
                inventoryCache = inventoryData;
                cacheTimestamp = Date.now();

                // Create search index
                console.log('🔍 Creating search index...');
                searchIndex = createSearchIndex(inventoryData);
                indexTimestamp = Date.now();

                console.log(`✅ Received ${inventoryData.length} items from DMI API`);
                console.log('Sample items:', inventoryData.slice(0, 3));

                return inventoryData;
            } catch (error) {
                console.error('❌ Error fetching inventory:', error);
                // Return empty array if API fails
                console.log('⚠️ API error, returning empty array');
                return [];
            } finally {
                isLoadingInventory = false;
                loadingPromise = null;
            }
        })();

        return loadingPromise;
    },

    // Get inventory changes since timestamp
    async getInventoryChanges(lastUpdate) {
        if (DMI_CONFIG.USE_MOCK) {
            return [];
        }

        try {
            const url = buildUrl('inventorychanges', { lastupdate: lastUpdate });
            const response = await apiClient.get(url);
            return response.data;
        } catch (error) {
            console.error('Error fetching inventory changes:', error);
            throw error;
        }
    },

    // Optimized search with caching and indexing
    async searchInventoryByModel(searchTerm) {
        if (!searchTerm || searchTerm.length < 2) {
            console.log('❌ Search term too short:', searchTerm);
            return [];
        }

        console.log('🔍 Starting search for:', searchTerm);

        // Check search cache first
        const cacheKey = searchTerm.toLowerCase();
        const cachedResult = searchCache.get(cacheKey);
        if (cachedResult && (Date.now() - cachedResult.timestamp < SEARCH_CACHE_DURATION)) {
            console.log('🎯 Using cached search results for:', searchTerm);
            return cachedResult.results;
        }

        try {
            // Check if we have inventory data at all
            if (!inventoryCache && !searchIndex) {
                console.log('⚠️ No inventory data available, fetching...');
                await this.getInventory();
            }

            // Use indexed search if available and fresh
            if (searchIndex && indexTimestamp && (Date.now() - indexTimestamp < CACHE_DURATION)) {
                console.log('⚡ Using indexed search for:', searchTerm);
                console.log('📊 Search index stats:', {
                    modelEntries: searchIndex.byModel.size,
                    brandEntries: searchIndex.byBrand.size,
                    totalItems: searchIndex.allItems.length
                });

                const results = searchWithIndex(searchTerm, searchIndex);
                console.log(`📦 Index search found ${results.length} results`);

                // Sort results to prioritize exact matches
                const searchLower = searchTerm.toLowerCase();
                const sorted = results.sort((a, b) => {
                    const aModelExact = a.Model_Number && a.Model_Number.toLowerCase() === searchLower;
                    const bModelExact = b.Model_Number && b.Model_Number.toLowerCase() === searchLower;

                    if (aModelExact && !bModelExact) return -1;
                    if (!aModelExact && bModelExact) return 1;

                    const aModelStarts = a.Model_Number && a.Model_Number.toLowerCase().startsWith(searchLower);
                    const bModelStarts = b.Model_Number && b.Model_Number.toLowerCase().startsWith(searchLower);

                    if (aModelStarts && !bModelStarts) return -1;
                    if (!aModelStarts && bModelStarts) return 1;

                    return 0;
                });

                const limitedResults = sorted.slice(0, 50);

                // Cache the search results
                searchCache.set(cacheKey, {
                    results: limitedResults,
                    timestamp: Date.now()
                });

                // Clean up old cache entries if too many
                if (searchCache.size > MAX_SEARCH_CACHE_SIZE) {
                    const oldestKey = searchCache.keys().next().value;
                    searchCache.delete(oldestKey);
                }

                return limitedResults;
            }

            // Fallback to regular search if index not available
            console.log('🔍 Using regular search (no index) for:', searchTerm);
            const inventory = await this.getInventory();
            console.log(`📊 Inventory has ${inventory.length} items`);

            if (inventory.length === 0) {
                console.log('❌ No inventory data available');
                return [];
            }

            const searchLower = searchTerm.toLowerCase();

            // Filter results based on model number, description, or brand
            const filtered = inventory.filter(item => {
                const modelMatch = item.Model_Number && item.Model_Number.toLowerCase().includes(searchLower);
                const descMatch = item.Description && item.Description.toLowerCase().includes(searchLower);
                const brandMatch = item.Brand && item.Brand.toLowerCase().includes(searchLower);
                const categoryMatch = item.Category_Major && item.Category_Major.toLowerCase().includes(searchLower);

                return modelMatch || descMatch || brandMatch || categoryMatch;
            });

            console.log(`📦 Regular search found ${filtered.length} results`);

            // Sort results to prioritize exact matches and model number matches
            const sorted = filtered.sort((a, b) => {
                const aModelExact = a.Model_Number && a.Model_Number.toLowerCase() === searchLower;
                const bModelExact = b.Model_Number && b.Model_Number.toLowerCase() === searchLower;

                if (aModelExact && !bModelExact) return -1;
                if (!aModelExact && bModelExact) return 1;

                const aModelStarts = a.Model_Number && a.Model_Number.toLowerCase().startsWith(searchLower);
                const bModelStarts = b.Model_Number && b.Model_Number.toLowerCase().startsWith(searchLower);

                if (aModelStarts && !bModelStarts) return -1;
                if (!aModelStarts && bModelStarts) return 1;

                return 0;
            });

            // Limit results for performance
            const limitedResults = sorted.slice(0, 50);

            // Cache the results
            searchCache.set(cacheKey, {
                results: limitedResults,
                timestamp: Date.now()
            });

            return limitedResults;
        } catch (error) {
            console.error('Error searching inventory:', error);
            // Return empty array on error
            return [];
        }
    },

    // Get inventory by brand
    async getInventoryByBrand(brandCode) {
        if (DMI_CONFIG.USE_MOCK) {
            return [];
        }

        try {
            const url = buildUrl('inventory', { brand: brandCode });
            const response = await apiClient.get(url);
            return response.data;
        } catch (error) {
            console.error('Error fetching inventory by brand:', error);
            throw error;
        }
    },

    // Get order status
    async getOrderStatus(orderCriteria) {
        if (DMI_CONFIG.USE_MOCK) {
            return [];
        }

        try {
            const url = buildUrl('orderstatus');
            const response = await apiClient.post(url, orderCriteria);
            return response.data;
        } catch (error) {
            console.error('Error fetching order status:', error);
            throw error;
        }
    },

    // Get open orders
    async getOpenOrders(params = {}) {
        if (DMI_CONFIG.USE_MOCK) {
            return [];
        }

        try {
            const url = buildUrl('openorders', params);
            const response = await apiClient.get(url);
            return response.data;
        } catch (error) {
            console.error('Error fetching open orders:', error);
            throw error;
        }
    },

    // Get open backorders
    async getOpenBackorders(params = {}) {
        if (DMI_CONFIG.USE_MOCK) {
            return [];
        }

        try {
            const url = buildUrl('openbackorders', params);
            const response = await apiClient.get(url);
            return response.data;
        } catch (error) {
            console.error('Error fetching open backorders:', error);
            throw error;
        }
    },

    // Get invoice details
    async getInvoiceDetail(params = {}) {
        if (DMI_CONFIG.USE_MOCK) {
            return [];
        }

        try {
            const url = buildUrl('invoicedetail', params);
            const response = await apiClient.get(url);
            return response.data;
        } catch (error) {
            console.error('Error fetching invoice detail:', error);
            throw error;
        }
    },

    // Create new order
    async createNewOrder(orderData) {
        if (DMI_CONFIG.USE_MOCK) {
            return {
                Result: 'OK',
                Transaction_ID: 'MOCK_' + Date.now(),
                DMI_Order_ID: Math.floor(Math.random() * 100000),
                ...orderData[0].orderheader
            };
        }

        try {
            const url = buildPostUrl('neworder');
            const response = await apiClient.post(url, orderData);
            return response.data;
        } catch (error) {
            console.error('Error creating new order:', error);
            throw error;
        }
    },

    // Add new order line
    async addNewOrderLine(orderLineData) {
        if (DMI_CONFIG.USE_MOCK) {
            return {
                Result: 'OK',
                Transaction_ID: 'MOCK_' + Date.now(),
                ...orderLineData[0]
            };
        }

        try {
            const url = buildPostUrl('neworderline');
            const response = await apiClient.post(url, orderLineData);
            return response.data;
        } catch (error) {
            console.error('Error adding new order line:', error);
            throw error;
        }
    },

    // Change order
    async changeOrder(changeData) {
        if (DMI_CONFIG.USE_MOCK) {
            return {
                Result: 'OK',
                Transaction_ID: 'MOCK_' + Date.now(),
                ...changeData[0]
            };
        }

        try {
            const url = buildPostUrl('changeorder');
            const response = await apiClient.post(url, changeData);
            return response.data;
        } catch (error) {
            console.error('Error changing order:', error);
            throw error;
        }
    },

    // Change order item
    async changeOrderItem(changeData) {
        if (DMI_CONFIG.USE_MOCK) {
            return {
                Result: 'OK',
                Transaction_ID: 'MOCK_' + Date.now(),
                ...changeData[0]
            };
        }

        try {
            const url = buildPostUrl('changeorderitem');
            const response = await apiClient.post(url, changeData);
            return response.data;
        } catch (error) {
            console.error('Error changing order item:', error);
            throw error;
        }
    },

    // Utility function to format price
    formatPrice(price) {
        if (!price || price === '0.00') return 'Call for price';
        return `$${parseFloat(price).toFixed(2)}`;
    },

    // Utility function to check availability
    checkAvailability(item) {
        const available = parseInt(item.Available) || 0;
        const hasStock = item.Has_Stock === 'Y';
        const backordered = parseInt(item.Backordered) || 0;
        const onOrder = parseInt(item.On_Order) || 0;
        const inTransit = parseInt(item.In_Transit) || 0;

        if (hasStock && available > 0) {
            return { status: 'In Stock', quantity: available, color: 'success' };
        } else if (available > 0) {
            return { status: 'Available', quantity: available, color: 'warning' };
        } else if (inTransit > 0) {
            return { status: 'In Transit', quantity: inTransit, color: 'info' };
        } else if (onOrder > 0) {
            return { status: 'On Order', quantity: onOrder, color: 'info' };
        } else if (backordered > 0) {
            return { status: 'Backordered', quantity: backordered, color: 'error' };
        } else {
            return { status: 'Out of Stock', quantity: 0, color: 'error' };
        }
    },

    // Clear all caches
    clearCache() {
        inventoryCache = null;
        cacheTimestamp = null;
        searchCache.clear();
        searchIndex = null;
        indexTimestamp = null;
        console.log('🧹 All caches cleared');
    },

    // Get cache status
    getCacheStatus() {
        return {
            inventoryCached: !!inventoryCache,
            inventoryCacheAge: cacheTimestamp ? Date.now() - cacheTimestamp : null,
            searchCacheSize: searchCache.size,
            indexAvailable: !!searchIndex,
            indexAge: indexTimestamp ? Date.now() - indexTimestamp : null
        };
    },

    // Get config for debugging
    getConfig() {
        return DMI_CONFIG;
    },

    // Export buildUrl for testing
    buildUrl
};

export default dmiApi; 