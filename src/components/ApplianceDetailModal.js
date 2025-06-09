import React from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Box,
    Typography,
    Chip,
    Divider,
    Grid,
    Button,
    IconButton,
    Card,
    CardContent,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableRow,
    Paper,
    Fade,
    Slide,
} from '@mui/material';
import {
    Close as CloseIcon,
    Inventory2 as InventoryIcon,
    Info as InfoIcon,
    LocalShipping as ShippingIcon,
    AttachMoney as PriceIcon,
    Category as CategoryIcon,
    Business as BrandIcon,
    Schedule as TimeIcon,
    Straighten as DimensionsIcon,
    QrCode as QrCodeIcon,
    Build as BuildIcon,
    LocalOffer as OfferIcon,
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';

const StyledDialog = styled(Dialog)(({ theme }) => ({
    '& .MuiDialog-paper': {
        borderRadius: theme.spacing(2),
        maxWidth: '900px',
        width: '100%',
        margin: theme.spacing(2),
        maxHeight: '90vh',
    },
}));

const HeroCard = styled(Card)(({ theme }) => ({
    background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
    color: 'white',
    marginBottom: theme.spacing(3),
    '& .MuiCardContent-root': {
        padding: theme.spacing(3),
    },
}));

const InfoCard = styled(Card)(({ theme }) => ({
    height: '100%',
    transition: 'all 0.3s ease-in-out',
    '&:hover': {
        transform: 'translateY(-4px)',
        boxShadow: theme.shadows[8],
    },
}));

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

const ApplianceDetailModal = ({ open, onClose, appliance }) => {
    if (!appliance) return null;

    const formatPrice = (price) => {
        if (!price || price === '0.00') return 'Price on request';
        return `$${parseFloat(price).toFixed(2)}`;
    };

    const getAvailabilityColor = (available, hasStock) => {
        if (hasStock === 'Y' && parseInt(available) > 0) return 'success';
        if (parseInt(available) > 0) return 'warning';
        return 'error';
    };

    const getAvailabilityText = (available, hasStock, backordered, onOrder) => {
        const availableCount = parseInt(available) || 0;
        const backorderedCount = parseInt(backordered) || 0;
        const onOrderCount = parseInt(onOrder) || 0;

        if (hasStock === 'Y' && availableCount > 0) {
            return `${availableCount} in stock`;
        } else if (availableCount > 0) {
            return `${availableCount} available`;
        } else if (backorderedCount > 0) {
            return `${backorderedCount} backordered`;
        } else if (onOrderCount > 0) {
            return `${onOrderCount} on order`;
        } else {
            return 'Out of stock';
        }
    };

    const formatDimensions = (height, width, depth) => {
        const dimensions = [height, width, depth].filter(d => d && d.trim() !== '');
        if (dimensions.length === 0) return 'Not specified';
        return dimensions.join(' × ') + '"';
    };

    const formatDate = (dateString) => {
        if (!dateString || dateString === '//' || dateString === '//') {
            return 'TBD';
        }
        return dateString;
    };

    const inventoryData = [
        { label: 'Available', value: appliance.Available || '0' },
        { label: 'Backordered', value: appliance.Backordered || '0' },
        { label: 'On Order', value: appliance.On_Order || '0' },
        { label: 'In Transit', value: appliance.In_Transit || '0' },
    ];

    const pricingData = [
        { label: 'Deck Price', value: formatPrice(appliance.DeckPrice) },
        { label: 'LCNN Price', value: formatPrice(appliance.LCNN) },
        { label: 'STA', value: appliance.STA ? `$${appliance.STA}` : 'N/A' },
        { label: 'Commission Unit', value: appliance.Commission_Unit ? `$${appliance.Commission_Unit}` : 'N/A' },
    ];

    return (
        <StyledDialog
            open={open}
            onClose={onClose}
            TransitionComponent={Transition}
            maxWidth={false}
            fullWidth
        >
            <DialogTitle sx={{ p: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Typography variant="h5" component="div" sx={{ fontWeight: 700 }}>
                    Appliance Details
                </Typography>
                <IconButton
                    aria-label="close"
                    onClick={onClose}
                    sx={{ color: 'text.secondary' }}
                >
                    <CloseIcon />
                </IconButton>
            </DialogTitle>

            <DialogContent sx={{ p: 3 }}>
                {/* Hero Section */}
                <HeroCard elevation={4}>
                    <CardContent>
                        <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 3 }}>
                            <InventoryIcon sx={{ fontSize: 48, opacity: 0.9 }} />
                            <Box sx={{ flex: 1 }}>
                                <Typography variant="h4" component="h2" gutterBottom sx={{ fontWeight: 700 }}>
                                    {appliance.Model_Number}
                                </Typography>
                                <Typography variant="h6" sx={{ opacity: 0.9, mb: 2, lineHeight: 1.4 }}>
                                    {appliance.Description}
                                </Typography>
                                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                                    <Chip
                                        icon={<BrandIcon />}
                                        label={appliance.Brand}
                                        size="medium"
                                        sx={{ backgroundColor: 'rgba(255,255,255,0.2)', color: 'white' }}
                                    />
                                    <Chip
                                        icon={<InventoryIcon />}
                                        label={getAvailabilityText(
                                            appliance.Available,
                                            appliance.Has_Stock,
                                            appliance.Backordered,
                                            appliance.On_Order
                                        )}
                                        color={getAvailabilityColor(appliance.Available, appliance.Has_Stock)}
                                        size="medium"
                                    />
                                </Box>
                            </Box>
                        </Box>
                    </CardContent>
                </HeroCard>

                {/* Main Content Grid */}
                <Grid container spacing={3}>
                    {/* Inventory Information */}
                    <Grid item xs={12} md={6}>
                        <InfoCard>
                            <CardContent>
                                <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                    <InventoryIcon color="primary" />
                                    Inventory Status
                                </Typography>
                                <TableContainer>
                                    <Table size="small">
                                        <TableBody>
                                            {inventoryData.map((row) => (
                                                <TableRow key={row.label}>
                                                    <TableCell component="th" scope="row" sx={{ fontWeight: 500 }}>
                                                        {row.label}
                                                    </TableCell>
                                                    <TableCell align="right" sx={{ fontWeight: 600 }}>
                                                        {row.value}
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                            </CardContent>
                        </InfoCard>
                    </Grid>

                    {/* Pricing Information */}
                    <Grid item xs={12} md={6}>
                        <InfoCard>
                            <CardContent>
                                <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                    <PriceIcon color="primary" />
                                    Pricing Information
                                </Typography>
                                <TableContainer>
                                    <Table size="small">
                                        <TableBody>
                                            {pricingData.map((row) => (
                                                <TableRow key={row.label}>
                                                    <TableCell component="th" scope="row" sx={{ fontWeight: 500 }}>
                                                        {row.label}
                                                    </TableCell>
                                                    <TableCell align="right" sx={{ fontWeight: 600, color: 'primary.main' }}>
                                                        {row.value}
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                            </CardContent>
                        </InfoCard>
                    </Grid>

                    {/* Product Specifications */}
                    <Grid item xs={12} md={6}>
                        <InfoCard>
                            <CardContent>
                                <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                    <InfoIcon color="primary" />
                                    Specifications
                                </Typography>
                                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                                    {appliance.Category_Major && (
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                            <CategoryIcon fontSize="small" color="action" />
                                            <Typography variant="body2">
                                                <strong>Category:</strong> {appliance.Category_Major}
                                                {appliance.Category_Minor && ` - ${appliance.Category_Minor}`}
                                            </Typography>
                                        </Box>
                                    )}

                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                        <DimensionsIcon fontSize="small" color="action" />
                                        <Typography variant="body2">
                                            <strong>Dimensions:</strong> {formatDimensions(
                                                appliance.Height,
                                                appliance.Width,
                                                appliance.Depth
                                            )}
                                        </Typography>
                                    </Box>

                                    {appliance.UPC && appliance.UPC !== 'No UPC' && (
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                            <QrCodeIcon fontSize="small" color="action" />
                                            <Typography variant="body2">
                                                <strong>UPC:</strong> {appliance.UPC}
                                            </Typography>
                                        </Box>
                                    )}

                                    {appliance.Color && (
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                            <Typography variant="body2">
                                                <strong>Color:</strong> {appliance.Color}
                                            </Typography>
                                        </Box>
                                    )}
                                </Box>
                            </CardContent>
                        </InfoCard>
                    </Grid>

                    {/* Shipping & Logistics */}
                    <Grid item xs={12} md={6}>
                        <InfoCard>
                            <CardContent>
                                <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                    <ShippingIcon color="primary" />
                                    Shipping & Logistics
                                </Typography>
                                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                                    {appliance.Warehouse && (
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                            <ShippingIcon fontSize="small" color="action" />
                                            <Typography variant="body2">
                                                <strong>Warehouse:</strong> {appliance.Warehouse}
                                            </Typography>
                                        </Box>
                                    )}

                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                        <TimeIcon fontSize="small" color="action" />
                                        <Typography variant="body2">
                                            <strong>Next Delivery:</strong> {formatDate(appliance.Next_Truck_Date)}
                                        </Typography>
                                    </Box>

                                    {appliance.Vendor_Lead_Time && (
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                            <TimeIcon fontSize="small" color="action" />
                                            <Typography variant="body2">
                                                <strong>Lead Time:</strong> {appliance.Vendor_Lead_Time}
                                            </Typography>
                                        </Box>
                                    )}

                                    {appliance.Last_Synch_TS && (
                                        <Typography variant="caption" color="text.secondary" sx={{ fontStyle: 'italic' }}>
                                            Last updated: {appliance.Last_Synch_TS}
                                        </Typography>
                                    )}
                                </Box>
                            </CardContent>
                        </InfoCard>
                    </Grid>

                    {/* Additional Information */}
                    {(appliance.Serial_Number_Required === '1' || appliance.Order_Entry === '1' || appliance.Special_Order) && (
                        <Grid item xs={12}>
                            <InfoCard>
                                <CardContent>
                                    <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                        <BuildIcon color="primary" />
                                        Additional Information
                                    </Typography>
                                    <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                                        {appliance.Serial_Number_Required === '1' && (
                                            <Chip
                                                label="Serial Number Required"
                                                color="info"
                                                variant="outlined"
                                            />
                                        )}

                                        {appliance.Order_Entry === '1' && (
                                            <Chip
                                                label="Available for Order"
                                                color="success"
                                                variant="outlined"
                                            />
                                        )}

                                        {appliance.Special_Order === 'Y' && (
                                            <Chip
                                                label="Special Order Item"
                                                color="warning"
                                                variant="outlined"
                                            />
                                        )}

                                        {appliance.Allocation_Hold === '1' && (
                                            <Chip
                                                label="Allocation Hold"
                                                color="error"
                                                variant="outlined"
                                            />
                                        )}
                                    </Box>
                                </CardContent>
                            </InfoCard>
                        </Grid>
                    )}
                </Grid>
            </DialogContent>

            <DialogActions sx={{ p: 3, pt: 0 }}>
                <Button
                    onClick={onClose}
                    color="primary"
                    variant="outlined"
                    size="large"
                    sx={{ minWidth: 120 }}
                >
                    Close
                </Button>
                <Button
                    color="primary"
                    variant="contained"
                    size="large"
                    sx={{ minWidth: 120 }}
                    startIcon={<OfferIcon />}
                >
                    Request Quote
                </Button>
            </DialogActions>
        </StyledDialog>
    );
};

export default ApplianceDetailModal; 