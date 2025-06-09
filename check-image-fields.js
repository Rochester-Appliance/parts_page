// Script to check if image fields are available in DMI API response
const axios = require('axios');

async function checkImageFields() {
    console.log('🔍 Checking DMI API for image fields...\n');

    const proxyUrl = 'http://localhost:3000/api/dmi-proxy/dealers/dmirest/dmirest.php?format=json&resource=inventory&dealerid=118215&restcode=DL67AJ19M2R0J';

    try {
        console.log('📡 Fetching inventory data...');
        const response = await axios.get(proxyUrl, {
            timeout: 60000,
            validateStatus: function (status) {
                return status < 500;
            }
        });

        if (response.data && Array.isArray(response.data) && response.data.length > 0) {
            console.log(`✅ Received ${response.data.length} items\n`);

            // Get first few items to analyze
            const sampleItems = response.data.slice(0, 5);

            console.log('📋 Analyzing fields in the API response:\n');

            // Check first item's fields
            const firstItem = response.data[0];
            const allFields = Object.keys(firstItem);

            console.log(`Total fields available: ${allFields.length}`);
            console.log('All fields:', allFields.join(', '));

            // Look for image-related fields
            const imageRelatedFields = allFields.filter(field =>
                field.toLowerCase().includes('image') ||
                field.toLowerCase().includes('photo') ||
                field.toLowerCase().includes('picture') ||
                field.toLowerCase().includes('img') ||
                field.toLowerCase().includes('url') ||
                field.toLowerCase().includes('link')
            );

            if (imageRelatedFields.length > 0) {
                console.log('\n🖼️  Potential image-related fields found:');
                imageRelatedFields.forEach(field => {
                    console.log(`- ${field}: ${firstItem[field]}`);
                });

                // Check multiple items to see if these fields have values
                console.log('\n📊 Checking image field values in multiple items:');
                sampleItems.forEach((item, index) => {
                    console.log(`\nItem ${index + 1} (${item.Model_Number}):`);
                    imageRelatedFields.forEach(field => {
                        if (item[field] && item[field].trim() !== '') {
                            console.log(`  ${field}: ${item[field]}`);
                        }
                    });
                });
            } else {
                console.log('\n❌ No obvious image-related fields found in the API response.');

                // Let's check for any URL-like values in any field
                console.log('\n🔍 Searching for URL-like values in all fields...');
                let urlFieldsFound = false;

                allFields.forEach(field => {
                    const value = firstItem[field];
                    if (value && typeof value === 'string' &&
                        (value.includes('http') || value.includes('www') || value.includes('.jpg') || value.includes('.png'))) {
                        console.log(`  ${field}: ${value}`);
                        urlFieldsFound = true;
                    }
                });

                if (!urlFieldsFound) {
                    console.log('  No URL-like values found in any fields.');
                }
            }

            // Display sample item structure
            console.log('\n📄 Sample item structure:');
            console.log(JSON.stringify(sampleItems[0], null, 2));

        } else {
            console.log('❌ No data received or data is not in expected format');
        }

    } catch (error) {
        console.error('❌ Error checking API:', error.message);
        console.log('\n💡 Make sure the React dev server is running on port 3000');
    }
}

checkImageFields(); 