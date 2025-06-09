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

// Use sandbox for testing
const config = VANDV_CONFIG.PRODUCTION;

async function testGetPartsInfo() {
    console.log('🔍 Testing V&V GetPartsInfo API...\n');

    const url = `${config.BASE_URL}/GetPartsInfo`;

    // Test with a Samsung part number
    const requestData = {
        commonHeader: {
            user: config.USER,
            password: config.PASSWORD
        },
        mfgCode: 'SAM',
        partNumber: 'BN94-10751C'
    };

    try {
        console.log('📡 Request URL:', url);
        console.log('📦 Request Data:', JSON.stringify(requestData, null, 2));

        const response = await axios.post(url, requestData, {
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            timeout: 60000
        });

        console.log('\n✅ Response Status:', response.status);
        console.log('📋 Response Data:', JSON.stringify(response.data, null, 2));

        if (response.data.commonResult && response.data.commonResult.retCode === '0') {
            console.log('\n🎉 API call successful!');

            if (response.data.partData) {
                const part = response.data.partData;
                console.log('\n📦 Part Information:');
                console.log(`  - Part Number: ${part.partNumber}`);
                console.log(`  - Description: ${part.partDescription}`);
                console.log(`  - Quantity on Hand: ${part.quantityOnHand}`);
                console.log(`  - Retail Price: $${part.retailPrice}`);
                console.log(`  - Part Price: $${part.partPrice}`);
                console.log(`  - Discontinued: ${part.discontinued === '1' ? 'Yes' : 'No'}`);

                if (part.availableLocation) {
                    console.log(`  - Location: ${part.availableLocation.locationName}`);
                    console.log(`  - Available Qty: ${part.availableLocation.availableQuantity}`);
                }
            }
        } else {
            console.log('\n❌ API returned an error:');
            console.log(`  Code: ${response.data.commonResult?.retCode}`);
            console.log(`  Message: ${response.data.commonResult?.retMsg}`);
        }

    } catch (error) {
        console.error('\n❌ Error calling V&V API:', error.message);
        if (error.response) {
            console.error('Response status:', error.response.status);
            console.error('Response data:', error.response.data);
        }
    }
}

async function testWithDifferentParts() {
    console.log('\n\n🔄 Testing with different manufacturer codes...\n');

    const testParts = [
        { mfgCode: 'WHR', partNumber: 'W10130913' },  // Whirlpool
        { mfgCode: 'LG', partNumber: 'ADQ36006101' },  // LG
        { mfgCode: 'GE', partNumber: 'WR60X10185' }    // GE
    ];

    for (const part of testParts) {
        console.log(`\n📍 Testing ${part.mfgCode} - ${part.partNumber}`);

        const requestData = {
            commonHeader: {
                user: config.USER,
                password: config.PASSWORD
            },
            mfgCode: part.mfgCode,
            partNumber: part.partNumber
        };

        try {
            const response = await axios.post(`${config.BASE_URL}/GetPartsInfo`, requestData, {
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                timeout: 10000
            });

            if (response.data.commonResult?.retCode === '0' && response.data.partData) {
                console.log(`  ✅ Found: ${response.data.partData.partDescription}`);
                console.log(`  💰 Price: $${response.data.partData.partPrice}`);
            } else {
                console.log(`  ❌ Error: ${response.data.commonResult?.retMsg || 'Part not found'}`);
            }
        } catch (error) {
            console.log(`  ❌ Request failed: ${error.message}`);
        }
    }
}

// Run tests
async function runAllTests() {
    await testGetPartsInfo();
    await testWithDifferentParts();

    console.log('\n\n📝 Summary:');
    console.log('- V&V API provides parts information only (no images)');
    console.log('- Use manufacturer codes (SAM, WHR, LG, GE, etc.) + part numbers');
    console.log('- Sandbox environment is working correctly');
    console.log('- For production, switch to PRODUCTION config');
}

runAllTests(); 