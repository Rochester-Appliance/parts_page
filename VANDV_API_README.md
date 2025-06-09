# V&V API Integration Guide

## Overview

The V&V API is a **parts ordering and information system** that provides two main functionalities:

1. **GetPartsInfo** - Retrieve detailed information about appliance parts
2. **CreatePartOrder** - Create purchase orders for parts

**Important**: This API does **NOT** provide product images. It focuses on parts inventory, pricing, and ordering.

## API Credentials

### Production Environment
- **Base URL**: `https://soap.streamflow.ca/vandvapi/`
- **Username**: `M1945`
- **Password**: `9dVxdym69mNs3G8`
- **Bearer Token**: `am9obkBleGFtcGxlLmNvbTphYmMxMjM=`

### Sandbox/Testing Environment
- **Base URL**: `https://soapbeta.streamflow.ca/vandvapi/`
- **Username**: `M4800`
- **Password**: `testvandv1`

## API Endpoints

### 1. GetPartsInfo
**Purpose**: Get detailed information about a specific part

**Endpoint**: 
- Production: `https://soap.streamflow.ca/vandvapi/GetPartsInfo`
- Sandbox: `https://soapbeta.streamflow.ca/vandvapi/GetPartsInfo`

**Request Structure**:
```json
{
  "commonHeader": {
    "user": "M1945",
    "password": "9dVxdym69mNs3G8"
  },
  "mfgCode": "SAM",  // Manufacturer code (e.g., SAM for Samsung)
  "partNumber": "BN94-10751C"  // Part number
}
```

**Response Structure**:
```json
{
  "commonResult": {
    "code": "0",
    "codeDesc": "Success",
    "msgID": "",
    "retCode": "0",
    "retMsg": ""
  },
  "partData": {
    "partNumber": "BN94-10751C",
    "mfgCode": "SAM",
    "subbed": "N",  // Substitution available
    "partDescription": "MAIN BOARD ASSEMBLY",
    "quantityOnHand": "15",
    "retailPrice": "299.99",
    "partPrice": "189.99",
    "corePrice": "0.00",
    "totalPrice": "189.99",
    "discontinued": "0",
    "dropShipOnly": "0",
    "refrigerant": "0",
    "hazmat": "0",
    "oversize": "0",
    "availableLocation": {
      "locationId": "101",
      "countryCode": "US",
      "locationName": "New Jersey",
      "availableQuantity": "15"
    }
  },
  "subPartData": []  // Substitute parts if available
}
```

### 2. CreatePartOrder
**Purpose**: Create a purchase order for parts

**Endpoint**:
- Production: `https://soap.streamflow.ca/vandvapi/CreatePartOrder`
- Sandbox: `https://soapbeta.streamflow.ca/vandvapi/CreatePartOrder`

**Request Structure**:
```json
{
  "ImportSet": {
    "commonHeader": {
      "user": "M1945",
      "password": "9dVxdym69mNs3G8"
    },
    "poHeader": {
      "poNumber": "1231231360",
      "shippingMethod": "UPS",  // UPS, UP2, UP1
      "shipFrom": "101",
      "poType": "1",  // 1: Stock Keeping, 2: Pending Repair, 5: Forecasting
      "shipAddress": {
        "addressFlag": "Y",
        "customerName": "Rochester Appliance",
        "address": "900 Jefferson Rd",
        "city": "Rochester",
        "state": "NY",
        "zip": "14623",
        "country": "US"
      }
    },
    "poLine": [
      {
        "lineNumber": "1",
        "mfgCode": "SAM",
        "partNumber": "BN94-10751C",
        "quantity": "1"
      }
    ]
  }
}
```

## Key Features

### What This API Provides:
- ✅ Part numbers and descriptions
- ✅ Real-time inventory levels
- ✅ Pricing information (retail, dealer, core prices)
- ✅ Availability by location
- ✅ Substitute part suggestions
- ✅ Part attributes (hazmat, oversize, discontinued, etc.)
- ✅ Order creation and management

### What This API Does NOT Provide:
- ❌ Product/part images
- ❌ Repair manuals or documentation
- ❌ Appliance model information
- ❌ Customer reviews or ratings

## Shipping Methods
- `UPS`: FedEx Ground
- `UP2`: FedEx 2nd Day Air
- `UP1`: FedEx Overnight

## Error Codes
- `201`: Invalid Token or Username/Password
- `202`: Duplicate Order
- `210`: Invalid Part
- `211`: Invalid mfgCode
- `220`: Part Not Available for Sale
- `230`: Order does not exist
- `231`: Order cannot be cancelled
- `232`: Invalid Shipping Method
- `233`: Order has been cancelled
- `234`: Invalid Ship From Location Code
- `300`: See line remark

## Integration Notes

1. **Authentication**: Use Basic Auth with provided credentials
2. **Rate Limits**: No limits currently set, but monitored
3. **IP Whitelisting**: Not required at this time
4. **Data Format**: JSON request/response
5. **Character Encoding**: UTF-8

## Manufacturer Codes
The API uses manufacturer codes (like `SAM` for Samsung). A complete list should be provided by V&V for your account.

## Important Considerations

1. This is a **parts-only** API - it doesn't provide information about complete appliances
2. No image URLs are provided - you'll need to source product images elsewhere
3. The API is designed for B2B parts ordering, not consumer-facing applications
4. Always use the sandbox environment for testing to avoid affecting real inventory

## Next Steps for Integration

1. Test the `GetPartsInfo` endpoint with known part numbers
2. Verify pricing and availability data
3. Test order creation in sandbox before production
4. Implement error handling for all possible error codes
5. Consider caching part information to reduce API calls 