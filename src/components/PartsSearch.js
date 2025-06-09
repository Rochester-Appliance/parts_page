import React, { useState, useCallback, useEffect } from 'react';
import {
    Box,
    TextField,
    InputAdornment,
    IconButton,
    Paper,
    Typography,
    CircularProgress,
    Alert,
    Grid,
    Card,
    CardContent,
    Chip,
    Button,
    Autocomplete,
    Tooltip,
    LinearProgress,
    CardMedia,
    Dialog,
    DialogContent,
    DialogTitle,
} from '@mui/material';
import {
    Search as SearchIcon,
    Clear as ClearIcon,
    Build as BuildIcon,
    AttachMoney as MoneyIcon,
    Inventory as InventoryIcon,
    Cached as CachedIcon,
    Info as InfoIcon,
    Download as DownloadIcon,
    Image as ImageIcon,
    ZoomIn as ZoomInIcon,
    Close as CloseIcon,
} from '@mui/icons-material';
import { MANUFACTURER_CODES, getManufacturerCode } from '../data/manufacturerCodes';
import vandvIplApi from '../services/vandvIplApi';
import { loadSamplePartsIntoCache } from '../data/samplePartsData';
import { SAMPLE_DIAGRAMS_DATA } from '../data/sampleDiagramsData';
import partsCache from '../services/partsCache';

const PartsSearch = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedManufacturer, setSelectedManufacturer] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [searchResults, setSearchResults] = useState([]);
    const [cacheStats, setCacheStats] = useState(null);
    const [diagrams, setDiagrams] = useState([]);
    const [selectedDiagram, setSelectedDiagram] = useState(null);
    const [zoomedImage, setZoomedImage] = useState(null);

    // Convert manufacturer codes to options for autocomplete
    const manufacturerOptions = Object.entries(MANUFACTURER_CODES).map(([code, name]) => ({
        code,
        name,
        label: `${name} (${code})`
    }));

    // Load cache stats on mount
    useEffect(() => {
        updateCacheStats();
    }, []);

    const updateCacheStats = () => {
        const stats = vandvIplApi.getCacheStats();
        setCacheStats(stats);
    };

    const handleSearch = useCallback(async () => {
        if (!searchQuery.trim()) {
            setError('Please enter a part number or description');
            return;
        }

        setLoading(true);
        setError(null);
        setSearchResults([]);

        try {
            // Search using the IPL API with cache
            const results = await vandvIplApi.searchParts(
                searchQuery,
                selectedManufacturer?.code || null
            );

            setSearchResults(results);
            updateCacheStats(); // Update stats after search

            if (results.length === 0) {
                // Check if it might be a model number without modelId
                if (searchQuery.match(/^[A-Z0-9]{6,}$/)) {
                    setError(
                        `"${searchQuery}" looks like a model number. To search for parts:\n` +
                        `1. First, search for this model in the "Appliances" tab\n` +
                        `2. Click "View Diagrams" to load its parts\n` +
                        `3. Then search for specific part numbers or descriptions here\n\n` +
                        `Or click "Load Sample Data" above to try the search feature.`
                    );
                } else {
                    setError(`No parts found matching "${searchQuery}"`);
                }
            }

        } catch (err) {
            console.error('Parts search error:', err);
            setError('Failed to search parts. Please try again.');
        } finally {
            setLoading(false);
        }
    }, [searchQuery, selectedManufacturer]);

    const handleKeyPress = (event) => {
        if (event.key === 'Enter') {
            handleSearch();
        }
    };

    const clearSearch = () => {
        setSearchQuery('');
        setSearchResults([]);
        setError(null);
    };

    const formatPrice = (price) => {
        return `$${price.toFixed(2)}`;
    };

    const getStockStatus = (quantity) => {
        if (quantity > 10) return { label: 'In Stock', color: 'success' };
        if (quantity > 0) return { label: `Only ${quantity} left`, color: 'warning' };
        return { label: 'Out of Stock', color: 'error' };
    };

    // Load sample data for testing
    const loadSampleData = async () => {
        setLoading(true);
        setError(null);
        try {
            console.log('Loading sample data...');

            // Show a message that this might take time
            setError('⏳ Connecting to V&V API... This may take up to 30 seconds. Please wait...');

            // First, ensure we have the model ID mapping
            vandvIplApi.addModelIdMapping('MAV6000AWQ', '87048');

            // Try to fetch diagrams first
            console.log('Fetching diagrams for MAV6000AWQ...');
            const diagramsData = await vandvIplApi.getDiagrams('MAV6000AWQ', '87048');

            if (diagramsData.length === 0) {
                throw new Error('No diagrams found');
            }

            console.log(`Found ${diagramsData.length} diagrams`);
            setDiagrams(diagramsData);
            setSelectedDiagram(diagramsData[0]);
            setError('⏳ Loading parts data... Almost done...');

            // Fetch parts for the first diagram
            const firstDiagram = diagramsData[0];
            console.log(`Fetching parts for diagram ${firstDiagram.diagramId}...`);
            const parts = await vandvIplApi.getDiagramParts('MAV6000AWQ', '87048', firstDiagram.diagramId);

            const partsCount = Object.keys(parts).length;
            console.log(`Loaded ${partsCount} parts`);

            updateCacheStats();

            if (partsCount > 0) {
                // Show some example parts
                const exampleParts = Object.keys(parts).slice(0, 3).join(', ');
                setError(null);
                alert(`✅ Sample data loaded!\n\nLoaded ${partsCount} parts from MAV6000AWQ.\n\nTry searching for:\n- Part numbers: ${exampleParts}\n- Descriptions: "seal", "kit", "basket"`);
            } else {
                throw new Error('No parts found in the diagram');
            }
        } catch (err) {
            console.error('Error loading from API:', err);

            // Check if it's a timeout
            if (err.code === 'ECONNABORTED' || err.message.includes('timeout')) {
                console.log('API timeout - loading pre-fetched data instead');
            }

            // Fallback: Load pre-fetched sample data
            console.log('Loading pre-fetched sample data as fallback...');
            const partsCount = loadSamplePartsIntoCache(partsCache);
            updateCacheStats();

            // Add sample diagram data
            setDiagrams(SAMPLE_DIAGRAMS_DATA);
            setSelectedDiagram(SAMPLE_DIAGRAMS_DATA[0]);

            setError(null);
            alert(
                `✅ Sample data loaded (from cache)!\n\n` +
                `Loaded ${partsCount} parts for MAV6000AWQ.\n` +
                `Also loaded ${SAMPLE_DIAGRAMS_DATA.length} exploded view diagrams.\n\n` +
                `Try searching for:\n` +
                `- Part numbers: 200961, W10820039, WP22003813\n` +
                `- Descriptions: "seal", "motor", "spring", "kit"`
            );
        } finally {
            setLoading(false);
        }
    };

    const showNotification = (message, severity) => {
        // You can implement a snackbar here if needed
        if (severity === 'success') {
            console.log('✅', message);
        } else {
            console.log('❌', message);
        }
    };

    return (
        <Box sx={{ width: '100%', maxWidth: 1200, mx: 'auto' }}>
            <Grid container spacing={3}>
                {/* Left side - Search and Results */}
                <Grid item xs={12} md={diagrams.length > 0 ? 7 : 12}>
                    <Paper
                        sx={{
                            p: 3,
                            borderRadius: 2,
                            backgroundColor: 'rgba(255, 255, 255, 0.9)',
                            backdropFilter: 'blur(10px)',
                        }}
                    >
                        <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <BuildIcon color="primary" />
                            Search Appliance Parts
                        </Typography>

                        {/* Cache Status */}
                        {cacheStats && (
                            <Box sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1, justifyContent: 'space-between' }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                    <CachedIcon fontSize="small" color="action" />
                                    <Typography variant="caption" color="text.secondary">
                                        Cache: {cacheStats.totalParts} parts from {cacheStats.totalModels} models
                                        {cacheStats.lastUpdated && ` • Updated ${new Date(cacheStats.lastUpdated).toLocaleTimeString()}`}
                                    </Typography>
                                </Box>
                                <Button
                                    size="small"
                                    variant="outlined"
                                    startIcon={<DownloadIcon />}
                                    onClick={loadSampleData}
                                    disabled={loading}
                                >
                                    Load Sample Data
                                </Button>
                            </Box>
                        )}

                        <Grid container spacing={2} sx={{ mt: 1 }}>
                            {/* Manufacturer Selection */}
                            <Grid item xs={12} md={4}>
                                <Autocomplete
                                    value={selectedManufacturer}
                                    onChange={(event, newValue) => setSelectedManufacturer(newValue)}
                                    options={manufacturerOptions}
                                    getOptionLabel={(option) => option.label}
                                    renderInput={(params) => (
                                        <TextField
                                            {...params}
                                            label="Manufacturer (Optional)"
                                            variant="outlined"
                                            fullWidth
                                            placeholder="All manufacturers..."
                                        />
                                    )}
                                />
                            </Grid>

                            {/* Part Number Search */}
                            <Grid item xs={12} md={8}>
                                <TextField
                                    fullWidth
                                    variant="outlined"
                                    placeholder="Enter part number or description..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    onKeyPress={handleKeyPress}
                                    disabled={loading}
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <SearchIcon color="action" />
                                            </InputAdornment>
                                        ),
                                        endAdornment: searchQuery && (
                                            <InputAdornment position="end">
                                                <IconButton
                                                    onClick={clearSearch}
                                                    edge="end"
                                                    size="small"
                                                >
                                                    <ClearIcon />
                                                </IconButton>
                                            </InputAdornment>
                                        ),
                                    }}
                                />
                            </Grid>
                        </Grid>

                        <Button
                            variant="contained"
                            color="primary"
                            onClick={handleSearch}
                            disabled={loading || !searchQuery}
                            startIcon={loading ? <CircularProgress size={20} /> : <SearchIcon />}
                            sx={{ mt: 2 }}
                            fullWidth
                        >
                            {loading ? 'Searching...' : 'Search Parts'}
                        </Button>

                        {error && (
                            <Alert
                                severity={error.startsWith('⏳') ? 'info' : 'error'}
                                sx={{ mt: 2, whiteSpace: 'pre-line' }}
                            >
                                {error}
                            </Alert>
                        )}

                        {/* Search Results */}
                        {searchResults.length > 0 && (
                            <Box sx={{ mt: 3 }}>
                                <Typography variant="h6" gutterBottom>
                                    Search Results ({searchResults.length})
                                </Typography>
                                <Grid container spacing={2}>
                                    {searchResults.map((part, index) => {
                                        const stockStatus = getStockStatus(part.quantity);
                                        return (
                                            <Grid item xs={12} key={`${part.partNumber}-${index}`}>
                                                <Card>
                                                    <CardContent>
                                                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                                                            <Box sx={{ flex: 1 }}>
                                                                <Typography variant="h6">
                                                                    {part.partNumber}
                                                                </Typography>
                                                                <Typography variant="body2" color="text.secondary" gutterBottom>
                                                                    {part.description}
                                                                </Typography>
                                                                {part.modelNumber && (
                                                                    <Typography variant="caption" color="text.secondary">
                                                                        From model: {part.modelNumber}
                                                                    </Typography>
                                                                )}
                                                                <Box sx={{ display: 'flex', gap: 1, mt: 1, flexWrap: 'wrap' }}>
                                                                    <Chip
                                                                        icon={<MoneyIcon />}
                                                                        label={formatPrice(part.price)}
                                                                        color="primary"
                                                                        size="small"
                                                                    />
                                                                    {part.listPrice > part.price && (
                                                                        <Chip
                                                                            label={`List: ${formatPrice(part.listPrice)}`}
                                                                            size="small"
                                                                            sx={{ textDecoration: 'line-through' }}
                                                                        />
                                                                    )}
                                                                    <Chip
                                                                        icon={<InventoryIcon />}
                                                                        label={stockStatus.label}
                                                                        color={stockStatus.color}
                                                                        size="small"
                                                                    />
                                                                    {part.matchedOn && (
                                                                        <Chip
                                                                            label={`Matched: ${part.matchedOn}`}
                                                                            size="small"
                                                                            variant="outlined"
                                                                        />
                                                                    )}
                                                                </Box>
                                                            </Box>
                                                            {part.images && part.images.length > 0 && (
                                                                <Box
                                                                    component="img"
                                                                    src={part.images[0]}
                                                                    alt={part.partNumber}
                                                                    sx={{
                                                                        width: 80,
                                                                        height: 80,
                                                                        objectFit: 'contain',
                                                                        ml: 2,
                                                                        borderRadius: 1,
                                                                        border: '1px solid',
                                                                        borderColor: 'divider',
                                                                    }}
                                                                />
                                                            )}
                                                        </Box>
                                                    </CardContent>
                                                </Card>
                                            </Grid>
                                        );
                                    })}
                                </Grid>
                            </Box>
                        )}

                        {/* Info about how it works */}
                        <Alert severity="info" sx={{ mt: 3 }} icon={<InfoIcon />}>
                            <Typography variant="body2">
                                <strong>How it works:</strong> Parts search uses the V&V IPL (Illustrated Parts List) API.
                                As you view appliance diagrams, parts data is cached locally for faster searching.
                                The more models you explore, the more comprehensive your search results become.
                            </Typography>
                        </Alert>
                    </Paper>
                </Grid>

                {/* Right side - Diagrams */}
                {diagrams.length > 0 && (
                    <Grid item xs={12} md={5}>
                        <Paper
                            sx={{
                                p: 3,
                                borderRadius: 2,
                                backgroundColor: 'rgba(255, 255, 255, 0.9)',
                                backdropFilter: 'blur(10px)',
                            }}
                        >
                            <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <ImageIcon color="primary" />
                                Exploded View Diagrams
                            </Typography>

                            {/* Diagram Selection */}
                            <Box sx={{ mb: 2 }}>
                                <Grid container spacing={1}>
                                    {diagrams.map((diagram) => (
                                        <Grid item key={diagram.diagramId}>
                                            <Chip
                                                label={diagram.sectionName}
                                                onClick={() => setSelectedDiagram(diagram)}
                                                color={selectedDiagram?.diagramId === diagram.diagramId ? 'primary' : 'default'}
                                                variant={selectedDiagram?.diagramId === diagram.diagramId ? 'filled' : 'outlined'}
                                            />
                                        </Grid>
                                    ))}
                                </Grid>
                            </Box>

                            {/* Selected Diagram */}
                            {selectedDiagram && (
                                <Card>
                                    <CardMedia
                                        component="img"
                                        image={selectedDiagram.diagramLargeImage}
                                        alt={selectedDiagram.sectionName}
                                        sx={{
                                            cursor: 'zoom-in',
                                            maxHeight: 400,
                                            objectFit: 'contain',
                                        }}
                                        onClick={() => setZoomedImage(selectedDiagram.diagramLargeImage)}
                                    />
                                    <CardContent>
                                        <Typography variant="subtitle1" gutterBottom>
                                            {selectedDiagram.sectionName}
                                        </Typography>
                                        <Button
                                            size="small"
                                            startIcon={<ZoomInIcon />}
                                            onClick={() => setZoomedImage(selectedDiagram.diagramLargeImage)}
                                        >
                                            Click to zoom
                                        </Button>
                                    </CardContent>
                                </Card>
                            )}
                        </Paper>
                    </Grid>
                )}
            </Grid>

            {/* Zoomed Image Dialog */}
            <Dialog
                open={!!zoomedImage}
                onClose={() => setZoomedImage(null)}
                maxWidth="xl"
                fullWidth
            >
                <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="h6">Diagram View</Typography>
                    <IconButton onClick={() => setZoomedImage(null)}>
                        <CloseIcon />
                    </IconButton>
                </DialogTitle>
                <DialogContent sx={{ p: 0 }}>
                    <Box
                        component="img"
                        src={zoomedImage}
                        alt="Zoomed diagram"
                        sx={{
                            width: '100%',
                            height: 'auto',
                            maxHeight: '80vh',
                            objectFit: 'contain',
                        }}
                    />
                </DialogContent>
            </Dialog>
        </Box>
    );
};

export default PartsSearch; 