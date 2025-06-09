const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function (app) {
    // Add body parser middleware for JSON
    app.use(require('express').json());

    // Proxy for DMI API
    app.use(
        '/api/dmi-proxy',
        createProxyMiddleware({
            target: 'https://dmidrs.com',
            changeOrigin: true,
            secure: true,
            timeout: 60000,
            proxyTimeout: 60000,
            pathRewrite: {
                '^/api/dmi-proxy': '',
            },
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36'
            },
            onProxyReq: (proxyReq, req, res) => {
                console.log(`[DMI Proxy] ${req.method} ${req.url} -> ${proxyReq.path}`);
            },
            onProxyRes: (proxyRes, req, res) => {
                console.log(`[DMI Proxy] Response: ${proxyRes.statusCode} from ${req.url}`);

                // Add CORS headers to the response
                proxyRes.headers['Access-Control-Allow-Origin'] = '*';
                proxyRes.headers['Access-Control-Allow-Methods'] = 'GET, POST, PUT, DELETE, OPTIONS';
                proxyRes.headers['Access-Control-Allow-Headers'] = 'Content-Type, Authorization';
            },
            onError: (err, req, res) => {
                console.error('[DMI Proxy] Error:', err.message);
                res.status(500).json({
                    error: 'Proxy error',
                    message: err.message
                });
            }
        })
    );

    // Proxy for V&V IPL API
    app.use(
        ['/api/vandv-ipl/get-diagrams', '/api/vandv-ipl/get-diagram-parts'],
        createProxyMiddleware({
            target: 'https://soapbeta.streamflow.ca',
            changeOrigin: true,
            secure: true,
            pathRewrite: function (path, req) {
                // Rewrite paths correctly
                const newPath = path.replace('/api/vandv-ipl', '/iplvandv');
                console.log(`[V&V Proxy] Rewriting ${path} to ${newPath}`);
                return newPath;
            },
            onProxyReq: (proxyReq, req, res) => {
                console.log(`[V&V Proxy] ${req.method} ${req.url}`);

                // Important: restream parsed body before proxying
                if (req.body) {
                    const bodyData = JSON.stringify(req.body);

                    // Update content-length header
                    proxyReq.setHeader('Content-Type', 'application/json');
                    proxyReq.setHeader('Content-Length', Buffer.byteLength(bodyData));

                    // Write out body
                    proxyReq.write(bodyData);
                }
            },
            onProxyRes: (proxyRes, req, res) => {
                console.log(`[V&V Proxy] Response: ${proxyRes.statusCode}`);
            },
            onError: (err, req, res) => {
                console.error('[V&V Proxy] Error:', err);
                res.status(500).json({
                    error: 'Proxy error',
                    message: err.message
                });
            }
        })
    );

    // You can add more proxy configurations here for other APIs if needed
    // Example for another API:
    /*
    app.use(
      '/api/other-service',
      createProxyMiddleware({
        target: 'https://other-api.com',
        changeOrigin: true,
        // ... other configurations
      })
    );
    */
}; 