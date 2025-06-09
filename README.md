# Rochester Appliance Parts Search

A modern, responsive web application for searching appliance inventory using the DMI (Distributor Management Inc.) API. Built with React, Material-UI, and integrated with Rochester Appliance's branding.

## Features

### 🔍 **Smart Search**
- **Auto-suggestions**: Real-time search suggestions as you type
- **Fuzzy matching**: Find appliances even with partial model numbers
- **Multiple search criteria**: Search by model number, brand, or description
- **Debounced search**: Optimized API calls with 300ms delay

### 🎛️ **Search Modes**
- **Search Appliances**: Full DMI inventory search (functional)
- **Search Parts**: Parts-specific search (coming soon)
- **Toggle interface**: Easy switching between search modes

### 📱 **Modern UI/UX**
- **Material Design**: Clean, professional interface
- **Responsive**: Works perfectly on desktop, tablet, and mobile
- **Glass morphism**: Modern frosted glass aesthetic
- **Smooth animations**: Engaging micro-interactions
- **Rochester Appliance branding**: Matches company visual identity

### 📊 **Rich Appliance Data**
- Model numbers and descriptions
- Brand information
- Availability status (in stock, available, backordered)
- Pricing information (Deck Price, LCNN)
- Dimensions and specifications
- Warehouse and shipping information
- Category classification

### 🚀 **Performance**
- **Optimized loading**: Skeleton loading states
- **Error handling**: Graceful error recovery with retry options
- **Caching**: Efficient API response handling
- **Accessibility**: WCAG compliant interface

## Tech Stack

- **Frontend**: React 18, Material-UI 5
- **Styling**: Emotion, Material-UI theming
- **HTTP Client**: Axios
- **State Management**: React hooks
- **Build Tool**: Create React App
- **Icons**: Material Icons

## Installation

### Prerequisites
- Node.js 16+ 
- npm or yarn

### Setup

1. **Clone the repository**
```bash
git clone <repository-url>
cd rochester-appliance-parts-search
```

2. **Install dependencies**
```bash
npm install
# or
yarn install
```

3. **Configure DMI API credentials**

Edit `src/services/dmiApi.js` and replace the demo credentials:

```javascript
const DMI_CONFIG = {
  PRODUCTION_BASE_URL: 'https://dmidrs.com/dealers/dmirest',
  SANDBOX_BASE_URL: 'https://dmidrs.com/dealers_sb/dmirest',
  DEALER_ID: 'YOUR_ACTUAL_DEALER_ID', // Replace with your dealer ID
  REST_CODE: 'YOUR_ACTUAL_REST_CODE', // Replace with your rest code
};
```

4. **Start the development server**
```bash
npm start
# or
yarn start
```

The application will open at `http://localhost:3000`

## API Configuration

### DMI API Integration

The application integrates with the DMI DRS (Dealer Resource System) API. You'll need:

1. **Dealer ID**: Your unique dealer identifier
2. **Rest Code**: Your API access code
3. **Environment**: Choose between sandbox and production

### Supported DMI Endpoints

Currently implemented:
- ✅ **Inventory (GET)**: Search active appliance models
- ✅ **Inventory Changes (GET)**: Get recent inventory updates
- ⏳ **Order Status (POST)**: Check order status (ready for implementation)
- ⏳ **Open Orders (GET)**: View open orders (ready for implementation)

### API Features

- **Error handling**: Comprehensive error catching and user feedback
- **Request interceptors**: Automatic logging and debugging
- **Response caching**: Optimized for performance
- **Timeout handling**: 30-second timeout with retry options

## File Structure

```
src/
├── components/
│   ├── SearchBar.js          # Smart search with autocomplete
│   ├── SearchToggle.js       # Mode switching component
│   ├── ApplianceCard.js      # Individual appliance display
│   └── SearchResults.js      # Results grid with loading states
├── services/
│   └── dmiApi.js            # DMI API integration service
├── App.js                   # Main application component
└── index.js                 # React app entry point
```

## Customization

### Branding
The app uses Rochester Appliance's color scheme:
- **Primary**: Blue (#1976d2) - matches Rochester Appliance branding
- **Secondary**: Orange (#f57c00) - for accent elements
- **Background**: Gradient from light blue to purple

### Theme Customization
Edit `src/index.js` to modify the Material-UI theme:

```javascript
const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2', // Your primary color
    },
    secondary: {
      main: '#f57c00', // Your secondary color
    },
  },
});
```

### Search Behavior
Modify search parameters in `src/services/dmiApi.js`:

```javascript
// Adjust search sensitivity
const searchQuery = query.toLowerCase();
return inventory.filter(item => {
  // Customize search criteria here
});
```

## Development

### Available Scripts

- `npm start` - Start development server
- `npm build` - Build for production
- `npm test` - Run tests
- `npm eject` - Eject from Create React App

### Environment Variables

Create a `.env` file for environment-specific configuration:

```env
REACT_APP_DMI_DEALER_ID=your_dealer_id
REACT_APP_DMI_REST_CODE=your_rest_code
REACT_APP_ENVIRONMENT=sandbox
```

## Production Deployment

### Build for Production

```bash
npm run build
```

This creates an optimized build in the `build/` directory.

### Deployment Options

1. **Static Hosting**: Deploy to Netlify, Vercel, or AWS S3
2. **Traditional Hosting**: Upload build files to web server
3. **CDN**: Use CloudFront or similar for global distribution

### Environment Configuration

For production, update the API configuration:

```javascript
const BASE_URL = process.env.NODE_ENV === 'production' 
  ? DMI_CONFIG.PRODUCTION_BASE_URL 
  : DMI_CONFIG.SANDBOX_BASE_URL;
```

## API Usage Examples

### Basic Search
```javascript
import dmiApi from './services/dmiApi';

// Search for appliances
const results = await dmiApi.searchInventoryByModel('FFGC3026SS');

// Get all inventory
const inventory = await dmiApi.getInventory();

// Get inventory by brand
const brandInventory = await dmiApi.getInventory({ brand: 'FRIGIDAIRE' });
```

### Error Handling
```javascript
try {
  const results = await dmiApi.searchInventoryByModel(query);
  // Handle results
} catch (error) {
  console.error('Search failed:', error.message);
  // Show user-friendly error message
}
```

## Security Notes

⚠️ **Important**: 
- Keep your DMI API credentials secure
- Don't commit credentials to version control
- Use environment variables for sensitive data
- Implement proper CORS settings for production

## Support

For DMI API support, contact:
- DMI Support: [DMI Contact Information]

For application support:
- Rochester Appliance: (585) 272-9933
- Email: [contact email]

## License

© 2024 Rochester Appliance. All rights reserved.

---

**Rochester Appliance**  
900 Jefferson Rd.  
Rochester, NY 14623  
Phone: (585) 272-9933  
Hours: Mon-Fri 9:00am-6:00pm, Sat 9:00am-4:00pm 