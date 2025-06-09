const XLSX = require('xlsx');
const fs = require('fs');

// Read the Excel file
const workbook = XLSX.readFile('VandV-API.xlsx');

console.log('📊 VandV API Documentation Analysis\n');
console.log('Sheet names:', workbook.SheetNames);
console.log('\n' + '='.repeat(80) + '\n');

// Read each sheet
workbook.SheetNames.forEach((sheetName, index) => {
    console.log(`📋 Sheet ${index + 1}: ${sheetName}`);
    console.log('-'.repeat(40));

    const worksheet = workbook.Sheets[sheetName];
    const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

    // Display first 20 rows or all if less
    const rowsToShow = Math.min(jsonData.length, 20);

    for (let i = 0; i < rowsToShow; i++) {
        const row = jsonData[i];
        if (row && row.length > 0) {
            console.log(`Row ${i + 1}:`, row.filter(cell => cell !== undefined).join(' | '));
        }
    }

    if (jsonData.length > 20) {
        console.log(`... and ${jsonData.length - 20} more rows`);
    }

    console.log('\n' + '='.repeat(80) + '\n');
});

// Also save as JSON for easier analysis
const allData = {};
workbook.SheetNames.forEach(sheetName => {
    const worksheet = workbook.Sheets[sheetName];
    allData[sheetName] = XLSX.utils.sheet_to_json(worksheet);
});

fs.writeFileSync('vandv-api-data.json', JSON.stringify(allData, null, 2));
console.log('💾 Saved complete data to vandv-api-data.json for further analysis'); 