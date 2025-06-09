// Known V&V Model ID Mappings
// These are model numbers we've discovered the V&V model IDs for
// This helps bootstrap the parts search functionality

export const KNOWN_MODEL_MAPPINGS = {
    // Maytag Washers
    'MAV6000AWQ': '87048',
    'MAV6000AWW': '87048',

    // Add more mappings as we discover them
    // Format: 'MODEL_NUMBER': 'V&V_MODEL_ID'
};

// Function to initialize the cache with known mappings
export const initializeModelMappings = (vandvIplApi) => {
    let count = 0;

    Object.entries(KNOWN_MODEL_MAPPINGS).forEach(([modelNumber, modelId]) => {
        vandvIplApi.addModelIdMapping(modelNumber, modelId);
        count++;
    });

    console.log(`✅ Initialized ${count} model ID mappings`);
    return count;
}; 