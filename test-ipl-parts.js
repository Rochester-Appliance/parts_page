const axios = require('axios');

async function testIplParts() {
    try {
        console.log('Starting test...');
        const url = 'http://localhost:3000/api/vandv-ipl/get-diagram-parts';
        console.log('URL:', url);

        const requestData = {
            username: 'M1945',
            password: '9dVxdym69mNs3G8',
            modelNumber: 'MAV6000AWQ',
            modelId: '87048',
            diagramId: '525454'
        };
        console.log('Request data:', requestData);

        // Test with a known model
        const response = await axios.post(url, requestData, {
            timeout: 30000,
            headers: {
                'Content-Type': 'application/json'
            }
        });

        console.log('\n✅ V&V IPL API - Parts Data Available:\n');

        const parts = response.data;
        const partNumbers = Object.keys(parts).slice(0, 5); // Show first 5 parts

        partNumbers.forEach(partNum => {
            const part = parts[partNum];
            console.log(`Part Number: ${partNum}`);
            console.log(`  Description: ${part.partDescription}`);
            console.log(`  Price: $${part.price}`);
            console.log(`  List Price: $${part.listPrice}`);
            console.log(`  Stock: ${part.qtyTotal}`);
            console.log(`  Has Image: ${part.url ? 'Yes' : 'No'}`);
            console.log('---');
        });

        console.log(`\nTotal parts available: ${Object.keys(parts).length}`);
        console.log('\n🎯 This means we CAN search parts using the IPL API!');
        console.log('We just need to:');
        console.log('1. Get the modelId for a given model number');
        console.log('2. Fetch all diagrams for that model');
        console.log('3. Fetch all parts from all diagrams');
        console.log('4. Search/filter those parts by part number or description');

    } catch (error) {
        console.error('Error:', error.message || error);
        if (error.response) {
            console.error('Response status:', error.response.status);
            console.error('Response data:', JSON.stringify(error.response.data).substring(0, 200));
        }
        if (error.code) {
            console.error('Error code:', error.code);
        }
    }
}

testIplParts(); 