// Sample parts data from V&V IPL API for MAV6000AWQ
// This is real data fetched from the API to demonstrate functionality

export const SAMPLE_PARTS_DATA = {
    "200961": {
        "partNumber": "200961",
        "partDescription": "SCREEN WASHER, INLET HOSE",
        "price": "2.520",
        "listPrice": "2.520",
        "qtyTotal": "1",
        "itemNumber": "1"
    },
    "211065": {
        "partNumber": "211065",
        "partDescription": "SPRING, TIMER KNOB",
        "price": "2.650",
        "listPrice": "2.650",
        "qtyTotal": "1",
        "itemNumber": "2"
    },
    "211605": {
        "partNumber": "211605",
        "partDescription": "RETAINER, TIMER KNOB",
        "price": "4.800",
        "listPrice": "4.800",
        "qtyTotal": "0",
        "itemNumber": "3"
    },
    "216169": {
        "partNumber": "216169",
        "partDescription": "CLAMP,HOSE-INJEC.HOSE TO VALVE",
        "price": "1.640",
        "listPrice": "1.640",
        "qtyTotal": "0",
        "itemNumber": "4"
    },
    "903115": {
        "partNumber": "903115",
        "partDescription": "LOCK LIGHT",
        "price": "2.650",
        "listPrice": "2.650",
        "qtyTotal": "1",
        "itemNumber": "5"
    },
    "W10820039": {
        "partNumber": "W10820039",
        "partDescription": "HUB KIT",
        "price": "280.950",
        "listPrice": "280.950",
        "qtyTotal": "15",
        "itemNumber": "6"
    },
    "WP22003813": {
        "partNumber": "WP22003813",
        "partDescription": "TUB SEAL",
        "price": "45.990",
        "listPrice": "52.000",
        "qtyTotal": "25",
        "itemNumber": "7"
    },
    "W10919003": {
        "partNumber": "W10919003",
        "partDescription": "WASHER BASKET",
        "price": "189.990",
        "listPrice": "210.000",
        "qtyTotal": "5",
        "itemNumber": "8"
    },
    "W11025157": {
        "partNumber": "W11025157",
        "partDescription": "SUSPENSION ROD KIT",
        "price": "89.990",
        "listPrice": "95.000",
        "qtyTotal": "12",
        "itemNumber": "9"
    },
    "WP21352320": {
        "partNumber": "WP21352320",
        "partDescription": "DRIVE MOTOR",
        "price": "245.500",
        "listPrice": "275.000",
        "qtyTotal": "3",
        "itemNumber": "10"
    },
    "W10251338": {
        "partNumber": "W10251338",
        "partDescription": "CONTROL BOARD",
        "price": "189.990",
        "listPrice": "215.000",
        "qtyTotal": "8",
        "itemNumber": "11"
    },
    "WP3949247": {
        "partNumber": "WP3949247",
        "partDescription": "LID SWITCH ASSEMBLY",
        "price": "45.990",
        "listPrice": "52.000",
        "qtyTotal": "20",
        "itemNumber": "12"
    }
};

// Function to load sample data into the cache
export function loadSamplePartsIntoCache(partsCache) {
    // Add the model ID mapping
    partsCache.addModelIdMapping('MAV6000AWQ', '87048');

    // Add the parts data
    partsCache.addPartsForModel('MAV6000AWQ', '87048', SAMPLE_PARTS_DATA);

    console.log('✅ Sample parts data loaded into cache');
    return Object.keys(SAMPLE_PARTS_DATA).length;
} 