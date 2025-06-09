import React, { useState, useEffect } from 'react';
import {
    Box,
    Card,
    CardContent,
    Typography,
    Tabs,
    Tab,
    Grid,
    List,
    ListItem,
    ListItemText,
    ListItemAvatar,
    Avatar,
    Chip,
    IconButton,
    Dialog,
    DialogContent,
    CircularProgress,
    Alert,
    Button,
    Divider,
    Paper,
    Tooltip,
} from '@mui/material';
import {
    ZoomIn as ZoomInIcon,
    Close as CloseIcon,
    Build as BuildIcon,
    AttachMoney as MoneyIcon,
    Inventory as InventoryIcon,
    Image as ImageIcon,
    ShoppingCart as CartIcon,
} from '@mui/icons-material';
import vandvIplApi from '../services/vandvIplApi';

const DiagramViewer = ({ modelNumber, modelId, onClose }) => {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedTab, setSelectedTab] = useState(0);
    const [diagrams, setDiagrams] = useState([]);
    const [partsByDiagram, setPartsByDiagram] = useState({});
    const [selectedDiagram, setSelectedDiagram] = useState(null);
    const [zoomedImage, setZoomedImage] = useState(null);

    useEffect(() => {
        if (modelNumber && modelId) {
            loadDiagramData();
        }
    }, [modelNumber, modelId]);

    const loadDiagramData = async () => {
        setLoading(true);
        setError(null);

        try {
            const data = await vandvIplApi.getCompleteModelData(modelNumber, modelId);

            if (data.diagrams.length === 0) {
                setError('No diagrams found for this model');
            } else {
                setDiagrams(data.diagrams);
                setPartsByDiagram(data.partsByDiagram);
                setSelectedDiagram(data.diagrams[0]);

                // Save the successful modelId mapping for future use
                vandvIplApi.addModelIdMapping(modelNumber, modelId);
                console.log(`✅ Saved model ID mapping: ${modelNumber} → ${modelId}`);
            }
        } catch (err) {
            console.error('Error loading diagram data:', err);
            setError('Failed to load diagram data');
        } finally {
            setLoading(false);
        }
    };

    const handleTabChange = (event, newValue) => {
        setSelectedTab(newValue);
        setSelectedDiagram(diagrams[newValue]);
    };

    const formatPrice = (price) => {
        return `$${parseFloat(price).toFixed(2)}`;
    };

    const getStockStatus = (part) => {
        const qty = parseInt(part.qtyTotal) || 0;
        if (qty > 10) return { label: 'In Stock', color: 'success' };
        if (qty > 0) return { label: `Only ${qty} left`, color: 'warning' };
        return { label: 'Out of Stock', color: 'error' };
    };

    if (!modelNumber || !modelId) {
        return (
            <Alert severity="warning">
                Model ID is required to view diagrams. This feature requires both model number and V&V model ID.
            </Alert>
        );
    }

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
                <CircularProgress />
            </Box>
        );
    }

    if (error) {
        return (
            <Alert severity="error" sx={{ m: 2 }}>
                {error}
            </Alert>
        );
    }

    const currentParts = selectedDiagram ? partsByDiagram[selectedDiagram.diagramId] || {} : {};
    const partsArray = Object.values(currentParts).map(part => vandvIplApi.formatPartData(part));

    return (
        <Box sx={{ width: '100%', height: '100%' }}>
            {/* Header */}
            <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>
                <Typography variant="h6" component="div" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <BuildIcon color="primary" />
                    Repair Diagrams - {modelNumber}
                </Typography>
            </Box>

            {/* Tabs for different diagram sections */}
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                <Tabs
                    value={selectedTab}
                    onChange={handleTabChange}
                    variant="scrollable"
                    scrollButtons="auto"
                >
                    {diagrams.map((diagram, index) => (
                        <Tab
                            key={diagram.diagramId}
                            label={diagram.sectionName}
                            icon={<ImageIcon />}
                            iconPosition="start"
                        />
                    ))}
                </Tabs>
            </Box>

            {/* Main Content */}
            <Grid container sx={{ height: 'calc(100% - 120px)' }}>
                {/* Diagram Image */}
                <Grid item xs={12} md={7} sx={{ p: 2 }}>
                    <Card sx={{ height: '100%' }}>
                        <CardContent sx={{ height: '100%', position: 'relative' }}>
                            {selectedDiagram && (
                                <>
                                    <Box
                                        component="img"
                                        src={selectedDiagram.diagramLargeImage}
                                        alt={selectedDiagram.sectionName}
                                        sx={{
                                            width: '100%',
                                            height: '100%',
                                            objectFit: 'contain',
                                            cursor: 'zoom-in',
                                        }}
                                        onClick={() => setZoomedImage(selectedDiagram.diagramLargeImage)}
                                    />
                                    <Tooltip title="Click to zoom">
                                        <IconButton
                                            sx={{
                                                position: 'absolute',
                                                top: 8,
                                                right: 8,
                                                backgroundColor: 'rgba(255,255,255,0.8)',
                                            }}
                                            onClick={() => setZoomedImage(selectedDiagram.diagramLargeImage)}
                                        >
                                            <ZoomInIcon />
                                        </IconButton>
                                    </Tooltip>
                                </>
                            )}
                        </CardContent>
                    </Card>
                </Grid>

                {/* Parts List */}
                <Grid item xs={12} md={5} sx={{ p: 2, height: '100%', overflow: 'auto' }}>
                    <Paper sx={{ p: 2 }}>
                        <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <InventoryIcon color="primary" />
                            Parts List ({partsArray.length} items)
                        </Typography>
                        <Divider sx={{ mb: 2 }} />

                        <List>
                            {partsArray.map((part, index) => {
                                const stockStatus = getStockStatus(part);
                                return (
                                    <React.Fragment key={part.partNumber}>
                                        <ListItem alignItems="flex-start">
                                            <ListItemAvatar>
                                                <Avatar sx={{ bgcolor: 'primary.light' }}>
                                                    {part.itemNumber || index + 1}
                                                </Avatar>
                                            </ListItemAvatar>
                                            <ListItemText
                                                primary={
                                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                        <Typography variant="subtitle1" component="span">
                                                            {part.partNumber}
                                                        </Typography>
                                                        <Chip
                                                            label={stockStatus.label}
                                                            color={stockStatus.color}
                                                            size="small"
                                                        />
                                                    </Box>
                                                }
                                                secondary={
                                                    <>
                                                        <Typography variant="body2" color="text.secondary" gutterBottom>
                                                            {part.description}
                                                        </Typography>
                                                        <Box sx={{ display: 'flex', gap: 2, mt: 1 }}>
                                                            <Chip
                                                                icon={<MoneyIcon />}
                                                                label={formatPrice(part.price)}
                                                                size="small"
                                                                color="primary"
                                                                variant="outlined"
                                                            />
                                                            {part.listPrice > part.price && (
                                                                <Chip
                                                                    label={`List: ${formatPrice(part.listPrice)}`}
                                                                    size="small"
                                                                    sx={{ textDecoration: 'line-through' }}
                                                                />
                                                            )}
                                                        </Box>
                                                        {part.images.length > 0 && (
                                                            <Button
                                                                size="small"
                                                                startIcon={<ImageIcon />}
                                                                sx={{ mt: 1 }}
                                                                onClick={() => setZoomedImage(part.images[0])}
                                                            >
                                                                View Part Image
                                                            </Button>
                                                        )}
                                                    </>
                                                }
                                            />
                                        </ListItem>
                                        {index < partsArray.length - 1 && <Divider variant="inset" component="li" />}
                                    </React.Fragment>
                                );
                            })}
                        </List>
                    </Paper>
                </Grid>
            </Grid>

            {/* Zoomed Image Dialog */}
            <Dialog
                open={!!zoomedImage}
                onClose={() => setZoomedImage(null)}
                maxWidth="xl"
                fullWidth
            >
                <DialogContent sx={{ position: 'relative', p: 0 }}>
                    <IconButton
                        onClick={() => setZoomedImage(null)}
                        sx={{
                            position: 'absolute',
                            right: 8,
                            top: 8,
                            backgroundColor: 'rgba(255,255,255,0.8)',
                            zIndex: 1,
                        }}
                    >
                        <CloseIcon />
                    </IconButton>
                    <Box
                        component="img"
                        src={zoomedImage}
                        alt="Zoomed view"
                        sx={{
                            width: '100%',
                            height: 'auto',
                            maxHeight: '90vh',
                            objectFit: 'contain',
                        }}
                    />
                </DialogContent>
            </Dialog>
        </Box>
    );
};

export default DiagramViewer; 