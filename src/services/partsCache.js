// Parts Cache Service
// Stores parts data from V&V IPL API for searching

class PartsCache {
    constructor() {
        this.cache = new Map();
        this.modelIdMap = new Map();
        this.lastUpdated = null;
        this.loadFromLocalStorage();
    }

    // Load cache from localStorage
    loadFromLocalStorage() {
        try {
            const savedCache = localStorage.getItem('partsCache');
            const savedModelMap = localStorage.getItem('modelIdMap');

            if (savedCache) {
                const data = JSON.parse(savedCache);
                this.cache = new Map(data.cache);
                this.lastUpdated = data.lastUpdated;
            }

            if (savedModelMap) {
                this.modelIdMap = new Map(JSON.parse(savedModelMap));
            }
        } catch (error) {
            console.error('Error loading parts cache:', error);
        }
    }

    // Save cache to localStorage
    saveToLocalStorage() {
        try {
            const cacheData = {
                cache: Array.from(this.cache.entries()),
                lastUpdated: this.lastUpdated
            };
            localStorage.setItem('partsCache', JSON.stringify(cacheData));
            localStorage.setItem('modelIdMap', JSON.stringify(Array.from(this.modelIdMap.entries())));
        } catch (error) {
            console.error('Error saving parts cache:', error);
        }
    }

    // Add model ID mapping
    addModelIdMapping(modelNumber, modelId) {
        this.modelIdMap.set(modelNumber.toUpperCase(), modelId);
        this.saveToLocalStorage();
    }

    // Get model ID from model number
    getModelId(modelNumber) {
        return this.modelIdMap.get(modelNumber.toUpperCase());
    }

    // Add parts for a model
    addPartsForModel(modelNumber, modelId, parts) {
        const key = `${modelNumber}_${modelId}`;

        // Store parts indexed by part number
        const existingParts = this.cache.get(key) || {};
        const updatedParts = { ...existingParts, ...parts };

        this.cache.set(key, updatedParts);

        // Also store model ID mapping
        this.addModelIdMapping(modelNumber, modelId);

        // Update timestamp
        this.lastUpdated = new Date().toISOString();
        this.saveToLocalStorage();

        console.log(`✅ Cached ${Object.keys(parts).length} parts for ${modelNumber}`);
    }

    // Get all parts for a model
    getPartsForModel(modelNumber, modelId) {
        const key = `${modelNumber}_${modelId}`;
        return this.cache.get(key) || {};
    }

    // Search parts across all cached models
    searchParts(searchTerm, manufacturer = null) {
        const results = [];
        const searchLower = searchTerm.toLowerCase();

        // Search through all cached models
        for (const [modelKey, parts] of this.cache.entries()) {
            const [modelNumber] = modelKey.split('_');

            // Filter by manufacturer if specified
            if (manufacturer && !modelNumber.startsWith(manufacturer)) {
                continue;
            }

            // Search through parts
            for (const [partNumber, partData] of Object.entries(parts)) {
                if (
                    partNumber.toLowerCase().includes(searchLower) ||
                    (partData.partDescription && partData.partDescription.toLowerCase().includes(searchLower))
                ) {
                    results.push({
                        ...partData,
                        modelNumber,
                        matchedOn: partNumber.toLowerCase().includes(searchLower) ? 'partNumber' : 'description'
                    });
                }
            }
        }

        // Sort by relevance (part number matches first)
        results.sort((a, b) => {
            if (a.matchedOn === 'partNumber' && b.matchedOn !== 'partNumber') return -1;
            if (a.matchedOn !== 'partNumber' && b.matchedOn === 'partNumber') return 1;
            return 0;
        });

        return results;
    }

    // Get cache statistics
    getStats() {
        let totalParts = 0;
        let totalModels = this.cache.size;

        for (const parts of this.cache.values()) {
            totalParts += Object.keys(parts).length;
        }

        return {
            totalModels,
            totalParts,
            lastUpdated: this.lastUpdated,
            modelIdMappings: this.modelIdMap.size
        };
    }

    // Clear cache
    clear() {
        this.cache.clear();
        this.lastUpdated = null;
        localStorage.removeItem('partsCache');
        console.log('Parts cache cleared');
    }

    // Get all cached model numbers
    getCachedModels() {
        const models = [];
        for (const key of this.cache.keys()) {
            const [modelNumber, modelId] = key.split('_');
            models.push({ modelNumber, modelId });
        }
        return models;
    }
}

// Create singleton instance
const partsCache = new PartsCache();

export default partsCache; 