const axios = require('axios');

async function populateCache() {
    console.log('🔄 Populating parts cache with real V&V data...\n');

    const modelNumber = 'MAV6000AWQ';
    const modelId = '87048';

    try {
        // Step 1: Get diagrams
        console.log(`📡 Fetching diagrams for ${modelNumber}...`);
        const diagramsResponse = await axios.post('https://soapbeta.streamflow.ca/iplvandv/get-diagrams', {
            username: 'M1945',
            password: '9dVxdym69mNs3G8',
            modelNumber: modelNumber,
            modelId: modelId
        });

        const diagrams = diagramsResponse.data;
        console.log(`✅ Found ${diagrams.length} diagrams\n`);

        // Step 2: Get parts for each diagram
        const allParts = {};
        for (const diagram of diagrams) {
            console.log(`📦 Fetching parts for ${diagram.sectionName}...`);

            const partsResponse = await axios.post('https://soapbeta.streamflow.ca/iplvandv/get-diagram-parts', {
                username: 'M1945',
                password: '9dVxdym69mNs3G8',
                modelNumber: modelNumber,
                modelId: modelId,
                diagramId: diagram.diagramId.toString()
            });

            const parts = partsResponse.data;
            const partsCount = Object.keys(parts).length;
            console.log(`   Found ${partsCount} parts`);

            // Merge parts
            Object.assign(allParts, parts);
        }

        console.log(`\n✅ Total parts collected: ${Object.keys(allParts).length}`);

        // Step 3: Show sample parts for testing
        console.log('\n📋 Sample parts for testing:');
        const sampleParts = Object.entries(allParts).slice(0, 5);
        sampleParts.forEach(([partNum, part]) => {
            console.log(`\n${partNum}:`);
            console.log(`  Description: ${part.partDescription}`);
            console.log(`  Price: $${part.price}`);
            console.log(`  Stock: ${part.qtyTotal}`);
        });

        console.log('\n💡 To use this data in the app:');
        console.log('1. The app needs to call these same endpoints through the proxy');
        console.log('2. Or we need to fix the proxy configuration');
        console.log('3. The data structure is correct and ready to use');

    } catch (error) {
        console.error('❌ Error:', error.message);
        if (error.response) {
            console.error('Response:', error.response.data);
        }
    }
}

populateCache(); 