const axios = require('axios');

async function testVandVProxy() {
    console.log('🔍 Testing V&V IPL Proxy...\n');

    // Test through our local proxy
    const proxyUrl = 'http://localhost:3000/api/vandv-ipl/get-diagrams';

    const requestData = {
        username: 'M1945',
        password: '9dVxdym69mNs3G8',
        modelNumber: 'MAV6000AWQ',
        modelId: '87048'
    };

    try {
        console.log('📡 Proxy URL:', proxyUrl);
        console.log('📦 Request Data:', JSON.stringify(requestData, null, 2));

        const response = await axios.post(proxyUrl, requestData, {
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            timeout: 30000
        });

        console.log('\n✅ Response Status:', response.status);
        console.log('📋 Response Headers:', response.headers);

        if (response.data) {
            console.log('\n📊 Response Data:');
            if (Array.isArray(response.data)) {
                console.log(`Found ${response.data.length} diagrams`);
                response.data.forEach((diagram, index) => {
                    console.log(`\nDiagram ${index + 1}:`);
                    console.log(`  Section: ${diagram.sectionName}`);
                    console.log(`  ID: ${diagram.diagramId}`);
                    console.log(`  Small Image: ${diagram.diagramSmallImage}`);
                    console.log(`  Large Image: ${diagram.diagramLargeImage}`);
                });
            } else {
                console.log(JSON.stringify(response.data, null, 2));
            }
        }

        console.log('\n🎉 V&V IPL Proxy is working correctly!');

        // Test parts endpoint
        console.log('\n\n' + '='.repeat(80));
        console.log('\n🔍 Testing Parts Endpoint...\n');

        const partsUrl = 'http://localhost:3000/api/vandv-ipl/get-diagram-parts';
        const partsRequest = {
            ...requestData,
            diagramId: '525454'
        };

        const partsResponse = await axios.post(partsUrl, partsRequest, {
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            timeout: 30000
        });

        if (partsResponse.data) {
            const partsCount = Object.keys(partsResponse.data).length;
            console.log(`✅ Found ${partsCount} parts for diagram 525454`);

            // Show first 3 parts as sample
            const partNumbers = Object.keys(partsResponse.data).slice(0, 3);
            partNumbers.forEach(partNum => {
                const part = partsResponse.data[partNum];
                console.log(`\nPart: ${part.partNumber}`);
                console.log(`  Description: ${part.partDescription}`);
                console.log(`  Price: $${part.price}`);
                console.log(`  Stock: ${part.qtyTotal}`);
            });
        }

    } catch (error) {
        console.error('\n❌ Error testing proxy:', error.message);
        if (error.response) {
            console.error('Response status:', error.response.status);
            console.error('Response data:', error.response.data);
        }
        console.log('\n💡 Make sure the React dev server is running on port 3000');
    }
}

testVandVProxy(); 