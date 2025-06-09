const axios = require('axios');

// V&V IPL API Configuration
const IPL_CONFIG = {
    SANDBOX_BASE: 'https://soapbeta.streamflow.ca/iplvandv',
    PRODUCTION_BASE: 'https://soap.streamflow.ca/iplvandv', // Assuming production follows same pattern
    USERNAME: 'M1945',
    PASSWORD: '9dVxdym69mNs3G8' // Note: there was a space in your password, removing it
};

async function testGetDiagrams() {
    console.log('🔍 Testing V&V IPL API - Get Diagrams...\n');

    const url = `${IPL_CONFIG.SANDBOX_BASE}/get-diagrams`;

    const requestData = {
        "username": IPL_CONFIG.USERNAME,
        "password": IPL_CONFIG.PASSWORD,
        "modelNumber": "MAV6000AWQ",
        "modelId": "87048"
    };

    try {
        console.log('📡 URL:', url);
        console.log('📦 Request:', JSON.stringify(requestData, null, 2));

        const response = await axios.post(url, requestData, {
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            timeout: 30000,
            validateStatus: (status) => status < 600
        });

        console.log('\n✅ Response Status:', response.status);
        console.log('📋 Response Headers:', JSON.stringify(response.headers, null, 2));

        if (response.data) {
            console.log('\n📊 Response Data:');
            console.log(JSON.stringify(response.data, null, 2));

            // If successful, check what diagrams are available
            if (response.status === 200 && response.data) {
                if (Array.isArray(response.data)) {
                    console.log(`\n🎯 Found ${response.data.length} diagrams for model MAV6000AWQ`);
                    response.data.forEach((diagram, index) => {
                        console.log(`\nDiagram ${index + 1}:`, diagram);
                    });
                } else if (response.data.diagrams) {
                    console.log(`\n🎯 Found ${response.data.diagrams.length} diagrams`);
                }
            }
        }

        return response.data;

    } catch (error) {
        console.error('\n❌ Error:', error.message);
        if (error.response) {
            console.error('Response:', JSON.stringify(error.response.data, null, 2));
        }
        return null;
    }
}

async function testGetDiagramParts() {
    console.log('\n\n' + '='.repeat(80));
    console.log('\n🔍 Testing V&V IPL API - Get Diagram Parts...\n');

    const url = `${IPL_CONFIG.SANDBOX_BASE}/get-diagram-parts`;

    const requestData = {
        "username": IPL_CONFIG.USERNAME,
        "password": IPL_CONFIG.PASSWORD,
        "modelNumber": "MAV6000AWQ",
        "modelId": "87048",
        "diagramId": "525454"
    };

    try {
        console.log('📡 URL:', url);
        console.log('📦 Request:', JSON.stringify(requestData, null, 2));

        const response = await axios.post(url, requestData, {
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            timeout: 30000,
            validateStatus: (status) => status < 600
        });

        console.log('\n✅ Response Status:', response.status);

        if (response.data) {
            console.log('\n📊 Response Data:');
            console.log(JSON.stringify(response.data, null, 2));

            // Check if we got parts data
            if (response.status === 200 && response.data) {
                if (Array.isArray(response.data)) {
                    console.log(`\n🔧 Found ${response.data.length} parts in diagram 525454`);
                } else if (response.data.parts) {
                    console.log(`\n🔧 Found ${response.data.parts.length} parts`);
                }
            }
        }

    } catch (error) {
        console.error('\n❌ Error:', error.message);
        if (error.response) {
            console.error('Response:', JSON.stringify(error.response.data, null, 2));
        }
    }
}

async function testWithDifferentModel() {
    console.log('\n\n' + '='.repeat(80));
    console.log('\n🔄 Testing with a different model number...\n');

    // Try without modelId to see if it works
    const url = `${IPL_CONFIG.SANDBOX_BASE}/get-diagrams`;

    const requestData = {
        "username": IPL_CONFIG.USERNAME,
        "password": IPL_CONFIG.PASSWORD,
        "modelNumber": "WTW4616FW2" // Random Whirlpool model
    };

    try {
        console.log('📡 Testing without modelId...');
        console.log('📦 Request:', JSON.stringify(requestData, null, 2));

        const response = await axios.post(url, requestData, {
            headers: {
                'Content-Type': 'application/json'
            },
            validateStatus: (status) => status < 600
        });

        console.log('Response Status:', response.status);
        if (response.data) {
            console.log('Response:', JSON.stringify(response.data, null, 2));
        }

    } catch (error) {
        console.error('Error:', error.message);
    }
}

// Run all tests
async function runAllTests() {
    console.log('🚀 V&V IPL (Illustrated Parts List) API Test\n');
    console.log('This API provides:');
    console.log('✅ Exploded view diagrams for appliances');
    console.log('✅ Parts lists for each diagram');
    console.log('✅ Visual repair documentation\n');

    await testGetDiagrams();
    await testGetDiagramParts();
    await testWithDifferentModel();

    console.log('\n\n📝 Summary:');
    console.log('The IPL API is separate from the parts ordering API');
    console.log('It provides the visual diagrams and parts breakdowns');
    console.log('This is what you need for repair documentation!');
}

runAllTests(); 