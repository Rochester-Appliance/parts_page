# CORS Proxy Setup for Local Development

This project includes a CORS proxy configuration to allow local development with the DMI API without running into CORS (Cross-Origin Resource Sharing) issues.

## How It Works

The proxy is configured using `http-proxy-middleware` in the `src/setupProxy.js` file. When you make requests to `/api/dmi-proxy/*`, they are automatically forwarded to `https://dmidrs.com/*` with proper CORS headers added.

## Setup

1. **Install Dependencies** (already done):
   ```bash
   npm install --save-dev http-proxy-middleware
   ```

2. **Start the Development Server**:
   ```bash
   npm start
   ```
   The proxy is automatically loaded when you start the React development server.

## Usage

### In Your Code

Instead of calling the DMI API directly:
```javascript
// ❌ Don't do this - will cause CORS errors
const response = await axios.get('https://dmidrs.com/dealers/dmirest/dmirest.php?...');
```

Use the proxy endpoint:
```javascript
// ✅ Do this - uses the local proxy
const response = await axios.get('/api/dmi-proxy/dealers/dmirest/dmirest.php?...');
```

### Testing the Proxy

To test if the proxy is working correctly:

```bash
node test-cors.js
```

This will:
- Test the proxy endpoint
- Show response time and data
- Compare with direct API calls
- Confirm the proxy is working correctly

## Proxy Configuration

The proxy is configured in `src/setupProxy.js` with:

- **Target**: `https://dmidrs.com`
- **Path Rewrite**: Removes `/api/dmi-proxy` prefix
- **CORS Headers**: Automatically added to responses
- **Logging**: Requests and responses are logged to console
- **Error Handling**: Proxy errors return proper error responses

## Benefits

1. **No CORS Issues**: Develop locally without browser CORS restrictions
2. **Better Debugging**: All API calls are logged in the console
3. **Faster Development**: No need to deploy to test API integration
4. **Security**: API credentials stay on the server side in production

## Production Deployment

Remember that this proxy only works in development. For production:

1. Deploy your API calls through a backend server
2. Configure proper CORS headers on your server
3. Use environment variables for API endpoints

## Troubleshooting

1. **Proxy not working**: Make sure the React dev server is running on port 3000
2. **API errors**: Check the console logs for detailed error messages
3. **Slow responses**: The proxy adds minimal overhead, check your network connection

## Additional Proxy Options

You can add more proxies for other APIs in `src/setupProxy.js`:

```javascript
app.use(
  '/api/other-service',
  createProxyMiddleware({
    target: 'https://other-api.com',
    changeOrigin: true,
    // ... other options
  })
);
``` 