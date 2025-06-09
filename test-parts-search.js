const axios = require('axios');

// Mock the parts cache for testing
class MockPartsCache {
    constructor() {
        this.cache = new Map();
        this.modelIdMap = new Map();
    }

    addModelIdMapping(modelNumber, modelId) {
        this.modelIdMap.set(modelNumber.toUpperCase(), modelId);
        console.log(`📝 Mapped ${modelNumber} → ${modelId}`);
    }

    getModelId(modelNumber) {
        return this.modelIdMap.get(modelNumber.toUpperCase());
    }

    addPartsForModel(modelNumber, modelId, parts) {
        const key = `${modelNumber}_${modelId}`;
        this.cache.set(key, parts);
        console.log(`💾 Cached ${Object.keys(parts).length} parts for ${modelNumber}`);
    }

    searchParts(searchTerm, manufacturer = null) {
        const results = [];
        const searchLower = searchTerm.toLowerCase();

        for (const [modelKey, parts] of this.cache.entries()) {
            const [modelNumber] = modelKey.split('_');

            if (manufacturer && !modelNumber.startsWith(manufacturer)) {
                continue;
            }

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

        return results;
    }
}

async function testPartsSearch() {
    const cache = new MockPartsCache();

    console.log('\n🔍 Testing Parts Search with Caching\n');

    // Step 1: Add known model mapping
    cache.addModelIdMapping('MAV6000AWQ', '87048');

    // Step 2: Simulate fetching parts from IPL API
    console.log('\n📡 Fetching parts from V&V IPL API...');

    // Mock parts data (in real app, this comes from API)
    const mockParts = {
        'W10820039': {
            partNumber: 'W10820039',
            partDescription: 'Hub Kit',
            price: '280.95',
            listPrice: '280.95',
            qtyTotal: '15'
        },
        'WP22003813': {
            partNumber: 'WP22003813',
            partDescription: 'Tub Seal',
            price: '45.99',
            listPrice: '52.00',
            qtyTotal: '25'
        },
        'W10919003': {
            partNumber: 'W10919003',
            partDescription: 'Washer Basket',
            price: '189.99',
            listPrice: '210.00',
            qtyTotal: '5'
        },
        'W11025157': {
            partNumber: 'W11025157',
            partDescription: 'Suspension Rod Kit',
            price: '89.99',
            listPrice: '95.00',
            qtyTotal: '12'
        }
    };

    // Add to cache
    cache.addPartsForModel('MAV6000AWQ', '87048', mockParts);

    // Step 3: Test searching
    console.log('\n🔎 Testing Search Scenarios:\n');

    // Search by part number
    console.log('1. Search for "W10820039":');
    let results = cache.searchParts('W10820039');
    console.log(`   Found ${results.length} result(s)`);
    results.forEach(part => {
        console.log(`   - ${part.partNumber}: ${part.partDescription} ($${part.price})`);
    });

    // Search by description
    console.log('\n2. Search for "seal":');
    results = cache.searchParts('seal');
    console.log(`   Found ${results.length} result(s)`);
    results.forEach(part => {
        console.log(`   - ${part.partNumber}: ${part.partDescription} ($${part.price}) [Matched: ${part.matchedOn}]`);
    });

    // Search with manufacturer filter
    console.log('\n3. Search for "kit" with MAV (Maytag) filter:');
    results = cache.searchParts('kit', 'MAV');
    console.log(`   Found ${results.length} result(s)`);
    results.forEach(part => {
        console.log(`   - ${part.partNumber}: ${part.partDescription} from ${part.modelNumber}`);
    });

    // Search with no results
    console.log('\n4. Search for "motor":');
    results = cache.searchParts('motor');
    console.log(`   Found ${results.length} result(s)`);

    console.log('\n✅ Parts search demonstration complete!');
    console.log('\n📌 Key Points:');
    console.log('   - Parts are cached as we fetch them from the IPL API');
    console.log('   - Search works on both part numbers and descriptions');
    console.log('   - Can filter by manufacturer');
    console.log('   - The more models viewed, the better the search becomes');
}

testPartsSearch(); 