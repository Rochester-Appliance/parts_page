const axios = require('axios');

async function testVandVModels() {
    console.log('🔍 Testing model numbers with V&V API...\n');

    // Common appliance model patterns to test
    const testModels = [
        // Whirlpool patterns
        'WRF555SDFZ', 'WRS325SDHZ', 'WRT518SZFM',
        'WTW5000DW', 'WTW4816FW', 'WFW5620HW',
        'WDF520PADM', 'WDT730PAHZ',

        // Maytag patterns  
        'MAV6000AWW', 'MAV6000AWQ', 'MAV7000AWW',
        'MED5500FW', 'MGD5500FW',
        'MDB4949SHZ', 'MDB7959SKZ',

        // KitchenAid patterns
        'KDTE334GPS', 'KDFE104HPS',
        'KRFF305ESS', 'KRMF706ESS',

        // GE patterns
        'GTW465ASNWW', 'GTD42EASJWW',
        'GDF630PSMSS', 'GDP630PYRFS',

        // Samsung patterns
        'WF45R6100AW', 'DVE45R6100W',
        'RF28R7351SR', 'RF23M8070SR',

        // LG patterns
        'WM3900HWA', 'DLE3500W',
        'LDF5545ST', 'LDT5678SS'
    ];

    const workingModels = [];

    for (const modelNumber of testModels) {
        process.stdout.write(`Testing ${modelNumber}... `);

        try {
            // Try to get diagrams without modelId first
            const response = await axios.post('https://soapbeta.streamflow.ca/iplvandv/get-diagrams', {
                username: 'M1945',
                password: '9dVxdym69mNs3G8',
                modelNumber: modelNumber,
                modelId: '' // Try empty first
            }, {
                timeout: 10000
            });

            if (response.data && Array.isArray(response.data) && response.data.length > 0) {
                console.log(`✅ WORKS! Found ${response.data.length} diagrams`);
                workingModels.push({
                    modelNumber,
                    diagramCount: response.data.length,
                    sampleDiagram: response.data[0]
                });
            } else if (response.data && response.data.error) {
                // Try to extract modelId from error or try common patterns
                console.log(`❌ Error: ${response.data.error}`);
            } else {
                console.log('❌ No diagrams found');
            }

        } catch (error) {
            if (error.response && error.response.data) {
                console.log(`❌ API Error: ${JSON.stringify(error.response.data).substring(0, 50)}...`);
            } else {
                console.log(`❌ Network error`);
            }
        }

        // Small delay to not overwhelm the API
        await new Promise(resolve => setTimeout(resolve, 500));
    }

    console.log('\n\n✅ Summary of working models:\n');

    if (workingModels.length > 0) {
        workingModels.forEach(model => {
            console.log(`${model.modelNumber}:`);
            console.log(`  - ${model.diagramCount} diagrams`);
            console.log(`  - First diagram: ${model.sampleDiagram.sectionName}`);
            console.log('');
        });

        // Save working models
        require('fs').writeFileSync(
            'working-vandv-models.json',
            JSON.stringify(workingModels, null, 2)
        );

        console.log(`\n💾 Saved ${workingModels.length} working models to working-vandv-models.json`);
    } else {
        console.log('No working models found. The V&V API might require specific model IDs.');

        // Try with a known working model/ID pair
        console.log('\n🔄 Testing with known working model MAV6000AWQ + ID 87048...');

        try {
            const response = await axios.post('https://soapbeta.streamflow.ca/iplvandv/get-diagrams', {
                username: 'M1945',
                password: '9dVxdym69mNs3G8',
                modelNumber: 'MAV6000AWQ',
                modelId: '87048'
            });

            if (response.data && Array.isArray(response.data)) {
                console.log(`✅ Success! Found ${response.data.length} diagrams`);
                console.log('\n⚠️  The V&V API requires both modelNumber AND modelId to work.');
                console.log('We need to find a way to get model IDs for other models.');
            }
        } catch (error) {
            console.log('❌ Even the known model failed. API might be down.');
        }
    }
}

testVandVModels(); 