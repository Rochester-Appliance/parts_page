const axios = require('axios');

async function extractModelNumbers() {
    console.log('🔍 Extracting model numbers from DMI API...\n');

    try {
        // Call the DMI API
        const response = await axios.get('https://dmidrs.com/dealers/dmirest/dmirest.php', {
            params: {
                format: 'json',
                resource: 'inventory',
                dealerid: '118215',
                restcode: 'DL67AJ19M2R0J'
            },
            timeout: 60000
        });

        console.log(`✅ Received ${response.data.length} items from DMI API`);

        // Extract unique model numbers
        const modelNumbers = new Set();
        const brandModelMap = {};

        response.data.forEach(item => {
            if (item.Model_Number) {
                modelNumbers.add(item.Model_Number);

                // Group by brand
                const brand = item.Brand || 'Unknown';
                if (!brandModelMap[brand]) {
                    brandModelMap[brand] = new Set();
                }
                brandModelMap[brand].add(item.Model_Number);
            }
        });

        console.log(`\n📊 Found ${modelNumbers.size} unique model numbers\n`);

        // Show sample models by brand
        console.log('📋 Sample models by brand:\n');

        const majorBrands = ['WHIRLPOOL', 'MAYTAG', 'KITCHENAID', 'GE', 'SAMSUNG', 'LG', 'FRIGIDAIRE'];

        majorBrands.forEach(brand => {
            if (brandModelMap[brand]) {
                const models = Array.from(brandModelMap[brand]);
                console.log(`${brand}: ${models.length} models`);
                console.log(`  Examples: ${models.slice(0, 5).join(', ')}`);
                console.log('');
            }
        });

        // Find models that might have V&V data (common appliance models)
        console.log('🎯 Common appliance models that might have V&V parts data:\n');

        const commonPrefixes = ['WRF', 'WRS', 'WRT', 'MAV', 'MED', 'MGD', 'KDTE', 'KDFE', 'GDF', 'GDP'];
        const potentialModels = [];

        modelNumbers.forEach(model => {
            commonPrefixes.forEach(prefix => {
                if (model.startsWith(prefix)) {
                    potentialModels.push(model);
                }
            });
        });

        console.log(`Found ${potentialModels.length} potential models with common prefixes`);
        console.log('Examples:', potentialModels.slice(0, 20).join(', '));

        // Create a mapping file
        console.log('\n💾 Creating model mappings for the app...\n');

        const mappingsToAdd = {};

        // Add some Maytag washers (MAV prefix)
        const maytags = Array.from(modelNumbers).filter(m => m.startsWith('MAV')).slice(0, 10);
        maytags.forEach(model => {
            // We don't know the V&V IDs yet, but we can prepare the structure
            mappingsToAdd[model] = null; // Will need to be filled with actual V&V model IDs
        });

        console.log('Sample Maytag models to investigate:');
        console.log(maytags);

        return {
            totalModels: modelNumbers.size,
            brandModelMap: Object.fromEntries(
                Object.entries(brandModelMap).map(([brand, models]) => [brand, Array.from(models)])
            ),
            potentialModels
        };

    } catch (error) {
        console.error('❌ Error:', error.message);
    }
}

extractModelNumbers(); 