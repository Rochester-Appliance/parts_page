// V&V Manufacturer Code Mappings
export const MANUFACTURER_CODES = {
    'ACM': 'ACME MIAMI',
    'AIR': 'CARRIER',
    'ALL': 'ALLDOLLY',
    'AME': 'AMERICAN METAL FILTER',
    'APR': 'APRILAIRE',
    'ATX': 'ATEX TOOLS',
    'AQD': 'AQUAFLOW',
    'BRA': 'BRAEBURN',
    'BIN': 'BROWN STOVE',
    'BRO': 'BROAN',
    'BRY': 'BRYANT',
    'BSH': 'BOSCH',
    'CAP': 'COOL AIR PRODUCTS',
    'CAR': 'CAROL CABLE',
    'CHR': 'CHROMALOX',
    'COE': 'COLEMAN MANUFACTURED PARTS',
    'COL': 'COLEMAN',
    'DUP': 'DUPAGE',
    'DUR': 'DURAFLOW',
    'EAT': 'EATON GAS VALVES',
    'EMR': 'EMERSON',
    'ERP': 'ERP',
    'ESC': 'ESCORT',
    'EUR': 'EUREKA',
    'EVP': 'EVERPURE',
    'EZF': 'EAZYPOWER',
    'FAS': 'FASCO',
    'FED': 'FEDDERS',
    'FLO': 'EZ-FLO',
    'FRI': 'FREON',
    'FRG': 'FRIGIDAIRE',
    'GAL': 'GAS CONNECTORS',
    'GAT': 'GATES',
    'GDM': 'GOODMAN',
    'GEM': 'GEMLINE',
    'GEN': 'GENERAL ELECTRIC',
    'GEO': 'MICROWAVE PARTS',
    'GLS': 'GLASFLOSS FILTERS',
    'GRN': 'GREENWALD',
    'HAR': 'HARRIS SOLDERS',
    'HON': 'HONEYWELL',
    'HOR': 'HORTON',
    'HRP': 'HARPER WYMAN',
    'HRT': 'HARTELL',
    'ICM': 'ICM CONTROLS',
    'ICS': 'INTERNATIONAL COMM SRLY',
    'ILE': 'IN SINK ERATOR',
    'JOG': 'JOHN GUEST',
    'LAN': 'LAMBRO',
    'LEN': 'LENNOX',
    'LG': 'LG APPLIANCE PARTS',
    'LIT': 'LITTLE GIANT PUMPS',
    'LKI': 'LEKGION SUPPLY',
    'LOB': 'LOBRIGHT',
    'LUX': 'LUXAIRE',
    'MAL': 'MA-LINE',
    'MAN': 'MANITOWOC',
    'MAR': 'MARS',
    'MAS': 'MASTERCOOL',
    'MAY': 'MAYTAG',
    'MCM': 'MUSIC CITY METALS',
    'MET': 'ME NEURAL INDUSTRIES INC',
    'MID': 'MIDWEST',
    'MIS': 'MISCELLANEOUS',
    'NEL': 'NELCO INC',
    'NUA': 'NU-AIR',
    'NUT': 'NUTONE',
    'PAC': 'PACKARD',
    'PEE': 'PEERLESS',
    'RBN': 'ROBINAIR',
    'RBS': 'ROBERTSHAW',
    'RED': 'RED TEK',
    'RPC': 'REPCO',
    'RTS': 'RECTORSEAL',
    'SAM': 'SAMSUNG',
    'SEN': 'SENSIBLE PRODUCTS',
    'SPA': 'SPACE GUARD',
    'SPE': 'SPEED QUEEN',
    'STA': 'STATE WATER HEATERS',
    'STH': 'STEWART HALL',
    'SUB': 'SUB-ZERO',
    'SUP': 'SEALED UNIT PARTS',
    'TEL': 'TELEDYNE-STILLMAN',
    'TRA': 'TRANE',
    'TRI': 'TRI-DIM FILTER CORP',
    'ULI': 'U-LINE CORP',
    'UNI': 'UNIVERSAL',
    'USI': 'USI',
    'UNV': 'UNIVERSAL TECHNOLOGIES',
    'VAL': 'VAL-U',
    'VAN': 'VANCO',
    'VNT': 'VENT MATERIAL',
    'WAT': 'WATSCO',
    'WEL': 'WELBUILT',
    'WHI': 'WHIRLPOOL',
    'WHR': 'WHITE-ROGERS',
    'YEL': 'YELLOW JACKET',
    'YTS': 'YATES'
};

// Reverse mapping for looking up codes by manufacturer name
export const MANUFACTURER_NAMES_TO_CODES = Object.entries(MANUFACTURER_CODES).reduce((acc, [code, name]) => {
    acc[name] = code;
    return acc;
}, {});

// Common brand mappings (for DMI to V&V conversion)
export const BRAND_TO_MANUFACTURER_CODE = {
    'WHIRLPOOL': 'WHI',
    'MAYTAG': 'MAY',
    'SAMSUNG': 'SAM',
    'LG': 'LG',
    'GE': 'GEN',
    'FRIGIDAIRE': 'FRG',
    'BOSCH': 'BSH',
    'CARRIER': 'AIR',
    'BRYANT': 'BRY',
    'COLEMAN': 'COL',
    'TRANE': 'TRA',
    'LENNOX': 'LEN',
    'HONEYWELL': 'HON',
    'GOODMAN': 'GDM'
};

// Helper function to get manufacturer code from brand name
export function getManufacturerCode(brand) {
    if (!brand) return null;

    const upperBrand = brand.toUpperCase();

    // First check direct brand mapping
    if (BRAND_TO_MANUFACTURER_CODE[upperBrand]) {
        return BRAND_TO_MANUFACTURER_CODE[upperBrand];
    }

    // Then check manufacturer names
    for (const [name, code] of Object.entries(MANUFACTURER_NAMES_TO_CODES)) {
        if (name.includes(upperBrand) || upperBrand.includes(name)) {
            return code;
        }
    }

    return null;
} 