const axios = require('axios');

async function findTestableModels() {
    console.log('🔍 Finding testable models from DMI inventory...\n');

    try {
        // Get DMI inventory
        const response = await axios.get('https://dmidrs.com/dealers/dmirest/dmirest.php', {
            params: {
                format: 'json',
                resource: 'inventory',
                dealerid: '118215',
                restcode: 'DL67AJ19M2R0J'
            },
            timeout: 60000
        });

        const inventory = response.data;
        console.log(`✅ Loaded ${inventory.length} items\n`);

        // Group by brand and category
        const brandCategoryMap = {};

        inventory.forEach(item => {
            const brand = item.Brand || 'Unknown';
            const category = item.Category_Major || 'Unknown';
            const model = item.Model_Number;

            if (!brandCategoryMap[brand]) {
                brandCategoryMap[brand] = {};
            }
            if (!brandCategoryMap[brand][category]) {
                brandCategoryMap[brand][category] = [];
            }

            brandCategoryMap[brand][category].push(model);
        });

        // Show what we have
        console.log('📊 Inventory breakdown:\n');

        const testBrands = ['WHIRLPOOL', 'MAYTAG', 'KITCHENAID', 'AMANA', 'JENN-AIR'];
        const testCategories = ['Washers', 'Dryers', 'Refrigerators', 'Dishwashers', 'Ranges'];

        testBrands.forEach(brand => {
            if (brandCategoryMap[brand]) {
                console.log(`\n${brand}:`);
                testCategories.forEach(category => {
                    if (brandCategoryMap[brand][category]) {
                        const models = brandCategoryMap[brand][category];
                        console.log(`  ${category}: ${models.length} models`);
                        console.log(`    Examples: ${models.slice(0, 3).join(', ')}`);
                    }
                });
            }
        });

        // Look for specific model patterns that V&V might support
        console.log('\n\n🎯 Models that might work with V&V:\n');

        // Whirlpool washers (often start with WTW, WFW)
        const whirlpoolWashers = inventory
            .filter(item => item.Brand === 'WHIRLPOOL' && item.Category_Major === 'Washers')
            .map(item => item.Model_Number)
            .slice(0, 10);

        console.log('Whirlpool Washers:', whirlpoolWashers);

        // Whirlpool refrigerators (WRF, WRS, WRT)
        const whirlpoolRefrig = inventory
            .filter(item => item.Brand === 'WHIRLPOOL' && item.Category_Major === 'Refrigerators')
            .map(item => item.Model_Number)
            .filter(model => model.startsWith('WR'))
            .slice(0, 10);

        console.log('\nWhirlpool Refrigerators:', whirlpoolRefrig);

        // Create test model list
        console.log('\n\n💡 Models to test with V&V API:');

        const testModels = [
            ...whirlpoolWashers.slice(0, 3),
            ...whirlpoolRefrig.slice(0, 3)
        ];

        console.log(testModels);

        // Save to file for testing
        const modelData = {
            whirlpoolWashers: whirlpoolWashers,
            whirlpoolRefrigerators: whirlpoolRefrig,
            testModels: testModels,
            stats: {
                totalModels: inventory.length,
                brands: Object.keys(brandCategoryMap).length,
                timestamp: new Date().toISOString()
            }
        };

        require('fs').writeFileSync(
            'dmi-models-to-test.json',
            JSON.stringify(modelData, null, 2)
        );

        console.log('\n✅ Saved model data to dmi-models-to-test.json');

    } catch (error) {
        console.error('❌ Error:', error.message);
    }
}

findTestableModels(); 