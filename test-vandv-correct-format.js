const axios = require('axios');

// V&V API Configuration
const VANDV_CONFIG = {
    SANDBOX: {
        BASE_URL: 'https://soapbeta.streamflow.ca/vandvapi',
        USER: 'M4800',
        PASSWORD: 'testvandv1'
    },
    PRODUCTION: {
        BASE_URL: 'https://soap.streamflow.ca/vandvapi',
        USER: 'M1945',
        PASSWORD: '9dVxdym69mNs3G8'
    }
};

async function testVandVAPI() {
    console.log('🔍 Testing V&V API with correct format from documentation...\n');

    // Try production first
    const config = VANDV_CONFIG.PRODUCTION;
    const url = `${config.BASE_URL}/GetPartsInfo`;

    // Based on the Excel documentation, the structure should be exactly as shown
    const requestData = {
        "commonHeader": {
            "user": config.USER,
            "password": config.PASSWORD
        },
        "mfgCode": "SAM",
        "partNumber": "BN94-10751C"
    };

    try {
        console.log('📡 Production URL:', url);
        console.log('📦 Request Data:', JSON.stringify(requestData, null, 2));

        const response = await axios({
            method: 'POST',
            url: url,
            data: requestData,
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            timeout: 30000,
            validateStatus: function (status) {
                return status < 600; // Don't throw on any HTTP status
            }
        });

        console.log('\n📊 Response Status:', response.status);
        console.log('📋 Full Response Headers:', JSON.stringify(response.headers, null, 2));

        if (response.data) {
            console.log('\n📦 Response Data:');
            console.log(JSON.stringify(response.data, null, 2));

            // Check if we have the expected response structure
            if (response.data.return) {
                const returnData = response.data.return;
                if (returnData.retCode === '0') {
                    console.log('\n✅ SUCCESS! API call worked!');
                    if (returnData.partData) {
                        console.log('\n🎯 Part Information Found:');
                        console.log(JSON.stringify(returnData.partData, null, 2));
                    }
                } else {
                    console.log(`\n⚠️ API Error: ${returnData.retCode} - ${returnData.retMsg}`);
                }
            }
        }

    } catch (error) {
        console.error('\n❌ Request Error:', error.message);
        if (error.code) console.error('Error Code:', error.code);
        if (error.response) {
            console.error('Response Status:', error.response.status);
            console.error('Response Headers:', error.response.headers);
            console.error('Response Data:', JSON.stringify(error.response.data, null, 2));
        }
    }

    // Now try sandbox
    console.log('\n\n' + '='.repeat(80));
    console.log('\n🔄 Now testing SANDBOX environment...\n');

    const sandboxConfig = VANDV_CONFIG.SANDBOX;
    const sandboxUrl = `${sandboxConfig.BASE_URL}/GetPartsInfo`;

    const sandboxRequest = {
        "commonHeader": {
            "user": sandboxConfig.USER,
            "password": sandboxConfig.PASSWORD
        },
        "mfgCode": "SAM",
        "partNumber": "BN94-10751C"
    };

    try {
        console.log('📡 Sandbox URL:', sandboxUrl);
        console.log('📦 Request Data:', JSON.stringify(sandboxRequest, null, 2));

        const response = await axios({
            method: 'POST',
            url: sandboxUrl,
            data: sandboxRequest,
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            timeout: 30000,
            validateStatus: function (status) {
                return status < 600;
            }
        });

        console.log('\n📊 Response Status:', response.status);

        if (response.data) {
            console.log('\n📦 Response Data:');
            console.log(JSON.stringify(response.data, null, 2));

            if (response.data.return && response.data.return.retCode === '0') {
                console.log('\n✅ SANDBOX SUCCESS!');
            }
        }

    } catch (error) {
        console.error('\n❌ Sandbox Error:', error.message);
    }
}

// Also test without nested structure based on API response format
async function testAlternativeFormat() {
    console.log('\n\n' + '='.repeat(80));
    console.log('\n🔄 Testing alternative request format...\n');

    const config = VANDV_CONFIG.PRODUCTION;
    const url = `${config.BASE_URL}/GetPartsInfo`;

    // Try with the structure matching the response format
    const requestData = {
        "user": config.USER,
        "password": config.PASSWORD,
        "mfgCode": "SAM",
        "partNumber": "BN94-10751C"
    };

    try {
        const response = await axios.post(url, requestData, {
            headers: {
                'Content-Type': 'application/json'
            },
            validateStatus: (status) => status < 600
        });

        console.log('Response Status:', response.status);
        console.log('Response:', JSON.stringify(response.data, null, 2));

    } catch (error) {
        console.error('Error:', error.message);
    }
}

// Run all tests
async function runTests() {
    await testVandVAPI();
    await testAlternativeFormat();

    console.log('\n\n📝 Testing complete. Check the responses above.');
    console.log('\nIf still getting 401 errors, the credentials might need to be:');
    console.log('1. Activated by V&V');
    console.log('2. Associated with your IP address');
    console.log('3. Used with a different authentication method');
}

runTests(); 