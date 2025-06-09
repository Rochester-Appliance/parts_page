// Test script to verify DMI API is working with real data
import dmiApi from './services/dmiApi.js';

console.log('Testing DMI API connection...\n');

// Test 1: Get inventory
dmiApi.getInventory()
    .then(inventory => {
        console.log('✅ API Connection Successful!');
        console.log(`Total inventory items: ${inventory.length}`);

        // Show first 5 items as sample
        console.log('\nFirst 5 items from real inventory:');
        inventory.slice(0, 5).forEach(item => {
            console.log(`- ${item.Model_Number}: ${item.Description}`);
            console.log(`  Brand: ${item.Brand}, Price: $${item.DeckPrice}, Available: ${item.Available}`);
        });

        // Test 2: Search functionality
        console.log('\n\nTesting search for "WHIRLPOOL"...');
        return dmiApi.searchInventoryByModel('WHIRLPOOL');
    })
    .then(searchResults => {
        console.log(`Found ${searchResults.length} Whirlpool items`);
        searchResults.slice(0, 3).forEach(item => {
            console.log(`- ${item.Model_Number}: ${item.Description}`);
        });
    })
    .catch(error => {
        console.error('❌ API Error:', error.message);
        console.log('The application may be falling back to mock data.');
    }); 