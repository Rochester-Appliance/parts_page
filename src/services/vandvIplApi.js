import axios from 'axios';
import partsCache from './partsCache';

// V&V IPL API Configuration
const IPL_CONFIG = {
    // Use different URLs based on environment
    BASE_URL: process.env.NODE_ENV === 'production'
        ? 'https://thingproxy.freeboard.io/fetch/https://soapbeta.streamflow.ca/iplvandv'
        : '/api/vandv-ipl', // Using our local proxy in development
    USERNAME: 'M1945',
    PASSWORD: '9dVxdym69mNs3G8'
};

// Log which environment we're using
console.log(`V&V IPL API Environment: ${process.env.NODE_ENV || 'development'}`);
console.log(`V&V IPL Base URL: ${IPL_CONFIG.BASE_URL}`);

// Create axios instance
const apiClient = axios.create({
    timeout: 300000, // Increase to 5 minutes (300 seconds)
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    }
});

// Request interceptor for debugging
apiClient.interceptors.request.use(request => {
    console.log('V&V IPL API Request:', {
        url: request.url,
        method: request.method,
        data: request.data,
        headers: request.headers
    });
    return request;
}, error => {
    console.error('V&V IPL API Request Error:', error);
    return Promise.reject(error);
});

// Response interceptor for debugging
apiClient.interceptors.response.use(response => {
    console.log('V&V IPL API Response:', {
        status: response.status,
        data: response.data,
        headers: response.headers
    });
    return response;
}, error => {
    console.error('V&V IPL API Response Error:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
        code: error.code
    });

    // Check for CORS error
    if (error.message === 'Network Error' && !error.response) {
        console.error('⚠️ CORS Error: The V&V API is blocking requests from the browser.');
        console.error('💡 Solution: We need to use the proxy or run this from a server.');
    }

    return Promise.reject(error);
});

// V&V IPL API Service
const vandvIplApi = {
    /**
     * Get diagrams for a specific model
     * @param {string} modelNumber - The appliance model number
     * @param {string} modelId - The V&V model ID (required)
     * @returns {Promise<Array>} Array of diagram objects
     */
    async getDiagrams(modelNumber, modelId) {
        if (!modelNumber || !modelId) {
            console.error('Both modelNumber and modelId are required');
            return [];
        }

        try {
            const endpoint = process.env.NODE_ENV === 'production'
                ? `${IPL_CONFIG.BASE_URL}/get-diagrams`
                : `${IPL_CONFIG.BASE_URL}/get-diagrams`;

            const response = await apiClient.post(endpoint, {
                username: IPL_CONFIG.USERNAME,
                password: IPL_CONFIG.PASSWORD,
                modelNumber: modelNumber,
                modelId: modelId
            });

            if (response.data && Array.isArray(response.data)) {
                console.log(`✅ Found ${response.data.length} diagrams for model ${modelNumber}`);
                return response.data;
            } else if (response.data && response.data.error) {
                console.error('API Error:', response.data.error);
                return [];
            }

            return [];
        } catch (error) {
            console.error('Error fetching diagrams:', error);
            return [];
        }
    },

    /**
     * Get parts for a specific diagram
     * @param {string} modelNumber - The appliance model number
     * @param {string} modelId - The V&V model ID
     * @param {string} diagramId - The diagram ID
     * @returns {Promise<Object>} Object with part numbers as keys
     */
    async getDiagramParts(modelNumber, modelId, diagramId) {
        if (!modelNumber || !modelId || !diagramId) {
            console.error('modelNumber, modelId, and diagramId are all required');
            return {};
        }

        try {
            const endpoint = process.env.NODE_ENV === 'production'
                ? `${IPL_CONFIG.BASE_URL}/get-diagram-parts`
                : `${IPL_CONFIG.BASE_URL}/get-diagram-parts`;

            const response = await apiClient.post(endpoint, {
                username: IPL_CONFIG.USERNAME,
                password: IPL_CONFIG.PASSWORD,
                modelNumber: modelNumber,
                modelId: modelId,
                diagramId: diagramId.toString()
            });

            if (response.data && typeof response.data === 'object') {
                const partsCount = Object.keys(response.data).length;
                console.log(`✅ Found ${partsCount} parts for diagram ${diagramId}`);

                // Cache the parts data
                partsCache.addPartsForModel(modelNumber, modelId, response.data);

                return response.data;
            }

            return {};
        } catch (error) {
            console.error('Error fetching diagram parts:', error);
            return {};
        }
    },

    /**
     * Get all diagrams and parts for a model (combined call)
     * @param {string} modelNumber - The appliance model number
     * @param {string} modelId - The V&V model ID
     * @returns {Promise<Object>} Object with diagrams and their parts
     */
    async getCompleteModelData(modelNumber, modelId) {
        try {
            // Check if we have cached data first
            const cachedParts = partsCache.getPartsForModel(modelNumber, modelId);
            if (Object.keys(cachedParts).length > 0) {
                console.log(`📦 Using cached parts data for ${modelNumber}`);
            }

            // First get all diagrams
            const diagrams = await this.getDiagrams(modelNumber, modelId);

            if (diagrams.length === 0) {
                return { diagrams: [], parts: {} };
            }

            // Then get parts for each diagram
            const partsPromises = diagrams.map(diagram =>
                this.getDiagramParts(modelNumber, modelId, diagram.diagramId)
                    .then(parts => ({ diagramId: diagram.diagramId, parts }))
            );

            const partsResults = await Promise.all(partsPromises);

            // Organize parts by diagram ID
            const partsByDiagram = {};
            partsResults.forEach(result => {
                partsByDiagram[result.diagramId] = result.parts;
            });

            return {
                diagrams: diagrams,
                partsByDiagram: partsByDiagram
            };
        } catch (error) {
            console.error('Error fetching complete model data:', error);
            return { diagrams: [], partsByDiagram: {} };
        }
    },

    /**
     * Format part data for display
     * @param {Object} part - Raw part data from API
     * @returns {Object} Formatted part data
     */
    formatPartData(part) {
        return {
            partNumber: part.partNumber || '',
            description: part.partDescription || '',
            price: parseFloat(part.price) || 0,
            listPrice: parseFloat(part.listPrice) || 0,
            corePrice: parseFloat(part.corePrice) || 0,
            quantity: parseInt(part.qtyTotal) || 0,
            itemNumber: part.itemNumber || '',
            url: part.url || '',
            images: Array.isArray(part.images) ? part.images : (part.images ? [part.images] : []),
            stock: part.stock || {},
            inStock: parseInt(part.qtyTotal) > 0
        };
    },

    /**
     * Search for parts using cached data and IPL API
     * @param {string} searchTerm - Part number or description to search
     * @param {string} manufacturer - Optional manufacturer code filter
     * @returns {Promise<Array>} Array of matching parts
     */
    async searchParts(searchTerm, manufacturer = null) {
        // First search in cache
        const cachedResults = partsCache.searchParts(searchTerm, manufacturer);

        if (cachedResults.length > 0) {
            console.log(`📦 Found ${cachedResults.length} parts in cache`);
            return cachedResults.map(part => this.formatPartData(part));
        }

        // If no cached results and we have a model number-like search
        if (searchTerm.length > 5) {
            // Check if it might be a model number
            const modelId = partsCache.getModelId(searchTerm);
            if (modelId) {
                // Fetch parts for this model
                const data = await this.getCompleteModelData(searchTerm, modelId);

                // Now search again in the newly cached data
                const newResults = partsCache.searchParts(searchTerm, manufacturer);
                return newResults.map(part => this.formatPartData(part));
            }
        }

        return [];
    },

    /**
     * Get model ID from cache or attempt to resolve it
     * @param {string} modelNumber - The model number to look up
     * @returns {string|null} The model ID if found
     */
    getModelId(modelNumber) {
        return partsCache.getModelId(modelNumber);
    },

    /**
     * Manually add a model ID mapping
     * @param {string} modelNumber - The model number
     * @param {string} modelId - The V&V model ID
     */
    addModelIdMapping(modelNumber, modelId) {
        partsCache.addModelIdMapping(modelNumber, modelId);
    },

    /**
     * Get cache statistics
     * @returns {Object} Cache statistics
     */
    getCacheStats() {
        return partsCache.getStats();
    }
};

export default vandvIplApi; 