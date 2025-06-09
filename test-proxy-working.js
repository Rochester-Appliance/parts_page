const axios = require('axios');

async function testProxy() {
    console.log('🔍 Testing V&V IPL Proxy...\n');

    // Wait for server to start
    console.log('⏳ Waiting for server to start...');
    await new Promise(resolve => setTimeout(resolve, 5000));

    try {
        // Test the proxy endpoint
        console.log('📡 Testing proxy at http://localhost:3000/api/vandv-ipl/get-diagrams');

        const response = await axios.post('http://localhost:3000/api/vandv-ipl/get-diagrams', {
            username: 'M1945',
            password: '9dVxdym69mNs3G8',
            modelNumber: 'MAV6000AWQ',
            modelId: '87048'
        }, {
            headers: {
                'Content-Type': 'application/json'
            }
        });

        console.log('✅ Proxy is working!');
        console.log(`📊 Found ${response.data.length} diagrams`);
        console.log('📋 First diagram:', response.data[0]);

        // Now test parts endpoint
        console.log('\n📡 Testing parts endpoint...');
        const partsResponse = await axios.post('http://localhost:3000/api/vandv-ipl/get-diagram-parts', {
            username: 'M1945',
            password: '9dVxdym69mNs3G8',
            modelNumber: 'MAV6000AWQ',
            modelId: '87048',
            diagramId: '525454'
        });

        const partsCount = Object.keys(partsResponse.data).length;
        console.log(`✅ Parts endpoint working! Found ${partsCount} parts`);

        // Show sample parts
        const sampleParts = Object.entries(partsResponse.data).slice(0, 3);
        console.log('\n📦 Sample parts:');
        sampleParts.forEach(([partNum, part]) => {
            console.log(`  ${partNum}: ${part.partDescription} - $${part.price}`);
        });

        console.log('\n🎉 Proxy is configured correctly! The app should work now.');

    } catch (error) {
        console.error('❌ Proxy test failed:', error.message);
        if (error.response) {
            console.error('Response status:', error.response.status);
            console.error('Response data:', error.response.data);
        }
        console.log('\n💡 Make sure:');
        console.log('1. The server is running on port 3000');
        console.log('2. The proxy configuration in setupProxy.js is correct');
        console.log('3. You restarted the server after proxy changes');
    }
}

testProxy(); 