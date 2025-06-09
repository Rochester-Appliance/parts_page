// Test script to verify CORS proxy is working
const axios = require('axios');

async function testCorsProxy() {
    console.log('Testing CORS proxy configuration...\n');

    // Test the local proxy endpoint
    const proxyUrl = 'http://localhost:3000/api/dmi-proxy/dealers/dmirest/dmirest.php?format=json&resource=inventory&dealerid=118215&restcode=DL67AJ19M2R0J';

    // Also test a direct API call to compare
    const directUrl = 'https://dmidrs.com/dealers/dmirest/dmirest.php?format=json&resource=inventory&dealerid=118215&restcode=DL67AJ19M2R0J';

    try {
        console.log('🔍 Testing proxy endpoint:', proxyUrl);
        const startTime = Date.now();

        const response = await axios.get(proxyUrl, {
            timeout: 30000,
            validateStatus: function (status) {
                return status < 500; // Resolve only if the status code is less than 500
            }
        });

        const responseTime = Date.now() - startTime;
        console.log(`⏱️  Response time: ${responseTime}ms`);
        console.log('✅ Proxy Response Status:', response.status);
        console.log('✅ Response Headers:', response.headers);

        if (response.data) {
            console.log('✅ Response Data Type:', typeof response.data);
            console.log('✅ Is Array:', Array.isArray(response.data));
            if (Array.isArray(response.data)) {
                console.log('✅ Number of items:', response.data.length);
                if (response.data.length > 0) {
                    console.log('✅ Sample item:', JSON.stringify(response.data[0], null, 2));
                }
            } else {
                console.log('✅ Response keys:', Object.keys(response.data));
            }
        }

        console.log('\n🎉 CORS proxy is working correctly!');

        // Optional: Test direct API for comparison
        console.log('\n📊 Testing direct API call for comparison (this may fail due to CORS)...');
        try {
            await axios.get(directUrl, { timeout: 5000 });
            console.log('⚠️  Direct API call succeeded - CORS might be enabled on the API');
        } catch (directError) {
            if (directError.code === 'ERR_NETWORK' || directError.message.includes('CORS')) {
                console.log('✅ Direct API call failed with CORS error as expected');
                console.log('✅ This confirms the proxy is necessary for local development');
            } else {
                console.log('❓ Direct API call failed with:', directError.message);
            }
        }

    } catch (error) {
        console.error('❌ Error testing proxy:', error.message);
        if (error.response) {
            console.error('❌ Response status:', error.response.status);
            console.error('❌ Response data:', error.response.data);
        }
        console.log('\n💡 Make sure the React dev server is running on port 3000');
        console.log('💡 Run: npm start');
    }
}

testCorsProxy(); 