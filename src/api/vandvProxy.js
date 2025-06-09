// Simple server-side proxy for V&V API to avoid CORS
const axios = require('axios');

const VANDV_CONFIG = {
    BASE_URL: 'https://soapbeta.streamflow.ca/iplvandv',
    USERNAME: 'M1945',
    PASSWORD: '9dVxdym69mNs3G8'
};

// Proxy handler for V&V IPL API
async function vandvProxy(endpoint, data) {
    try {
        const url = `${VANDV_CONFIG.BASE_URL}/${endpoint}`;
        console.log(`[V&V Proxy] Calling ${url}`);

        // Add credentials to the request
        const requestData = {
            username: VANDV_CONFIG.USERNAME,
            password: VANDV_CONFIG.PASSWORD,
            ...data
        };

        const response = await axios.post(url, requestData, {
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            timeout: 30000
        });

        console.log(`[V&V Proxy] Success: ${response.status}`);
        return response.data;

    } catch (error) {
        console.error(`[V&V Proxy] Error:`, error.message);
        throw error;
    }
}

module.exports = { vandvProxy }; 