# Parts Search Implementation

## Overview

We've successfully implemented parts search functionality using the V&V IPL (Illustrated Parts List) API with local caching. This allows users to search for appliance parts by part number or description, with optional manufacturer filtering.

## How It Works

### 1. Data Source: V&V IPL API
- Uses `/iplvandv/get-diagram-parts` endpoint
- Provides comprehensive parts data including:
  - Part numbers and descriptions
  - Pricing (retail and list prices)
  - Stock quantities
  - Part images (when available)
  - Item numbers (position on diagram)

### 2. Caching Strategy
- **Local Storage Cache**: Parts data is cached in browser localStorage
- **Progressive Enhancement**: Cache grows as users view more appliance diagrams
- **Model ID Mapping**: Stores modelNumber → modelId mappings for future lookups
- **Persistent**: Cache survives browser refreshes

### 3. Search Algorithm
```javascript
// Search flow:
1. Check cache for matching parts (by part number or description)
2. Filter by manufacturer if specified
3. Sort results (part number matches ranked higher)
4. Return formatted results with match indicators
```

## Implementation Details

### New Files Created

1. **`src/services/partsCache.js`**
   - Singleton cache service
   - Handles localStorage persistence
   - Provides search functionality
   - Manages model ID mappings

2. **`src/data/modelIdMappings.js`**
   - Known model ID mappings
   - Bootstrap function for initial mappings
   - Expandable as we discover more models

### Updated Files

1. **`src/services/vandvIplApi.js`**
   - Added `searchParts()` method
   - Integrated cache on data fetch
   - Added model ID management methods

2. **`src/components/PartsSearch.js`**
   - Complete UI implementation
   - Real-time cache statistics
   - Search with manufacturer filtering
   - Results display with pricing and stock

3. **`src/components/DiagramViewer.js`**
   - Saves successful model ID mappings
   - Contributes to cache growth

4. **`src/App.js`**
   - Initializes known model mappings on startup

## Features

### ✅ Implemented
- Part number search
- Description search
- Manufacturer filtering
- Cache persistence
- Real-time cache stats
- Price display (retail & list)
- Stock status indicators
- Part images (when available)
- Match type indicators

### 🔄 Progressive Enhancement
- Cache grows with usage
- More models = better search
- Automatic model ID learning

## Usage Examples

### Basic Part Search
```
User enters: "W10820039"
Results: Hub Kit - $280.95 (15 in stock)
```

### Description Search
```
User enters: "seal"
Results: All parts with "seal" in description
```

### Filtered Search
```
Manufacturer: Whirlpool (WHI)
Search: "motor"
Results: Only Whirlpool motor parts
```

## Current Limitations

1. **Model ID Requirement**: Need V&V model ID to fetch parts for a model
2. **Initial Cache**: Empty until users view diagrams
3. **No Direct API**: Using IPL API creatively instead of dedicated parts search

## Future Enhancements

1. **Bulk Cache Loading**: Pre-populate cache with common models
2. **Model ID Resolver**: Find a way to lookup model IDs automatically
3. **Export/Import Cache**: Share cache between users
4. **Advanced Search**: Regular expressions, multiple terms
5. **Search History**: Remember recent searches

## Testing

Run the test script to see the implementation in action:
```bash
node test-parts-search.js
```

## Cache Management

### View Cache Stats
- Displayed in PartsSearch component
- Shows total parts and models cached

### Clear Cache
```javascript
// In browser console:
localStorage.removeItem('partsCache');
localStorage.removeItem('modelIdMap');
```

### Export Cache (for debugging)
```javascript
// In browser console:
const cache = JSON.parse(localStorage.getItem('partsCache'));
console.log(cache);
```

## Success Metrics

- ✅ Parts searchable by number or description
- ✅ Results include pricing and availability
- ✅ Cache persists between sessions
- ✅ Search works offline (for cached data)
- ✅ Progressive enhancement as cache grows

## Conclusion

We've successfully implemented a robust parts search system using the V&V IPL API. While not as direct as a dedicated parts search API, our solution provides excellent functionality with the added benefit of local caching for improved performance and offline capability. 