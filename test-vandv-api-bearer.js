const axios = require('axios');

// V&V API Configuration with Bearer Token
const BEARER_TOKEN = 'am9obkBleGFtcGxlLmNvbTphYmMxMjM=';

async function testWithBearerToken() {
    console.log('🔍 Testing V&V API with Bearer Token...\n');

    const url = 'https://soap.streamflow.ca/vandvapi/GetPartsInfo';

    // Test with a Samsung part number
    const requestData = {
        mfgCode: 'SAM',
        partNumber: 'BN94-10751C'
    };

    try {
        console.log('📡 Request URL:', url);
        console.log('🔑 Using Bearer Token');
        console.log('📦 Request Data:', JSON.stringify(requestData, null, 2));

        const response = await axios.post(url, requestData, {
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': `Bearer ${BEARER_TOKEN}`
            },
            timeout: 30000
        });

        console.log('\n✅ Response Status:', response.status);
        console.log('📋 Response Data:', JSON.stringify(response.data, null, 2));

    } catch (error) {
        console.error('\n❌ Error with Bearer token:', error.message);
        if (error.response) {
            console.error('Response status:', error.response.status);
            console.error('Response data:', JSON.stringify(error.response.data, null, 2));
        }
    }
}

async function testWithBasicAuth() {
    console.log('\n\n🔍 Testing V&V API with Basic Auth...\n');

    const url = 'https://soap.streamflow.ca/vandvapi/GetPartsInfo';
    const username = 'M1945';
    const password = '9dVxdym69mNs3G8';

    // Create Basic Auth token
    const basicAuth = Buffer.from(`${username}:${password}`).toString('base64');

    const requestData = {
        mfgCode: 'SAM',
        partNumber: 'BN94-10751C'
    };

    try {
        console.log('📡 Request URL:', url);
        console.log('🔑 Using Basic Auth');
        console.log('📦 Request Data:', JSON.stringify(requestData, null, 2));

        const response = await axios.post(url, requestData, {
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': `Basic ${basicAuth}`
            },
            timeout: 30000
        });

        console.log('\n✅ Response Status:', response.status);
        console.log('📋 Response Data:', JSON.stringify(response.data, null, 2));

    } catch (error) {
        console.error('\n❌ Error with Basic Auth:', error.message);
        if (error.response) {
            console.error('Response status:', error.response.status);
            console.error('Response data:', JSON.stringify(error.response.data, null, 2));
        }
    }
}

async function testDifferentRequestFormat() {
    console.log('\n\n🔍 Testing with different request format...\n');

    const url = 'https://soap.streamflow.ca/vandvapi/GetPartsInfo';

    // Try without commonHeader wrapper
    const requestData = {
        user: 'M1945',
        password: '9dVxdym69mNs3G8',
        mfgCode: 'SAM',
        partNumber: 'BN94-10751C'
    };

    try {
        console.log('📡 Request URL:', url);
        console.log('📦 Request Data (flat structure):', JSON.stringify(requestData, null, 2));

        const response = await axios.post(url, requestData, {
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            timeout: 30000
        });

        console.log('\n✅ Response Status:', response.status);
        console.log('📋 Response Data:', JSON.stringify(response.data, null, 2));

    } catch (error) {
        console.error('\n❌ Error with flat structure:', error.message);
        if (error.response) {
            console.error('Response status:', error.response.status);
            console.error('Response data:', JSON.stringify(error.response.data, null, 2));
        }
    }
}

// Run all tests
async function runAllTests() {
    await testWithBearerToken();
    await testWithBasicAuth();
    await testDifferentRequestFormat();

    console.log('\n\n📝 Note: The V&V API credentials might need to be verified with the provider.');
    console.log('The API is returning 401 Unauthorized errors with all authentication methods tried.');
}

runAllTests(); 