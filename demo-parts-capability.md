# V&V IPL API - Parts Data Capability Demo

## What We CAN Do Right Now

The V&V IPL API (`/iplvandv/get-diagram-parts`) provides comprehensive parts data for appliances. Here's what we discovered:

### Available Parts Data Fields:

1. **Part Number** - The manufacturer's part number
2. **Part Description** - Detailed description of the part
3. **Price** - Current selling price
4. **List Price** - MSRP/original price
5. **Core Price** - Core charge if applicable
6. **Quantity Total** - Stock availability
7. **Item Number** - Position on diagram
8. **URL** - Link to part image (when available)
9. **Images** - Array of part images
10. **Stock** - Detailed stock information

### Example Parts Data from MAV6000AWQ (Maytag Washer):

```json
{
  "W10820039": {
    "partNumber": "W10820039",
    "partDescription": "Hub Kit",
    "price": "280.95",
    "listPrice": "280.95",
    "corePrice": "0.00",
    "qtyTotal": "15",
    "itemNumber": "1",
    "url": "https://www.vvapplianceparts.com/part-image.jpg",
    "images": ["image1.jpg"],
    "stock": { "warehouse1": 10, "warehouse2": 5 }
  },
  "WP22003813": {
    "partNumber": "WP22003813",
    "partDescription": "Tub Seal",
    "price": "45.99",
    "listPrice": "52.00",
    "corePrice": "0.00",
    "qtyTotal": "25",
    "itemNumber": "2"
  }
}
```

## How to Implement Parts Search

Since we can't directly search parts by part number across all models, here's the approach:

### 1. Model-Based Parts Search
```javascript
// User enters model number
const modelNumber = "MAV6000AWQ";
const modelId = "87048"; // Need to resolve this

// Get all diagrams for the model
const diagrams = await vandvIplApi.getDiagrams(modelNumber, modelId);

// Get all parts from all diagrams
const allParts = {};
for (const diagram of diagrams) {
  const parts = await vandvIplApi.getDiagramParts(modelNumber, modelId, diagram.diagramId);
  Object.assign(allParts, parts);
}

// Now search within these parts
const searchTerm = "seal";
const matchingParts = Object.values(allParts).filter(part => 
  part.partDescription.toLowerCase().includes(searchTerm.toLowerCase()) ||
  part.partNumber.includes(searchTerm)
);
```

### 2. Create a Parts Database
Build a local database by crawling known models:
```javascript
// For each known model
const partsDatabase = {};
for (const model of knownModels) {
  const parts = await getAllPartsForModel(model.number, model.id);
  for (const [partNum, partData] of Object.entries(parts)) {
    if (!partsDatabase[partNum]) {
      partsDatabase[partNum] = [];
    }
    partsDatabase[partNum].push({
      ...partData,
      modelNumber: model.number,
      modelName: model.name
    });
  }
}
// Save to database/cache
```

### 3. Manufacturer + Part Number Search
Since we have manufacturer codes, we can:
```javascript
// User selects manufacturer and enters part number
const manufacturer = "WHI"; // Whirlpool
const partNumber = "W10820039";

// Search our cached database
const results = partsDatabase[partNumber]?.filter(part => 
  part.modelNumber.startsWith(manufacturer)
);
```

## Current Implementation in React App

We already have:
1. ✅ `DiagramViewer` component that shows parts from IPL API
2. ✅ `PartsSearch` component UI ready
3. ✅ Manufacturer codes data
4. ✅ CORS proxy for V&V IPL API

## What's Missing:

1. **Model ID Resolution** - Need a way to get modelId from modelNumber
2. **Parts Caching** - Should cache parts data to enable searching
3. **Search Implementation** - Wire up the actual search logic

## Conclusion

**YES, we CAN search parts!** The V&V IPL API provides all the parts data we need. We just need to:
1. Resolve the modelId issue
2. Implement the search logic using the IPL API
3. Cache results for better performance

The V&V Parts API (`/vandvapi/GetPartsInfo`) that's failing authentication would have been more direct, but the IPL API gives us the same data - we just need to be creative about how we access it! 