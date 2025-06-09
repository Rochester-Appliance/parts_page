import React from 'react';
import {
    Card,
    CardContent,
    Typography,
    Box,
    Chip,
    Divider,
    Grid,
    IconButton,
    Tooltip,
    Button,
    ButtonGroup,
} from '@mui/material';
import {
    Inventory2 as InventoryIcon,
    Info as InfoIcon,
    LocalShipping as ShippingIcon,
    AttachMoney as PriceIcon,
    Category as CategoryIcon,
    Business as BrandIcon,
    Schedule as TimeIcon,
    AddShoppingCart as AddCartIcon,
    Check as CheckIcon,
} from '@mui/icons-material';
import { useCart } from '../contexts/CartContext';
import { styled } from '@mui/material/styles';

const StyledCard = styled(Card)(({ theme }) => ({
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    transition: 'all 0.3s ease-in-out',
    borderRadius: theme.spacing(2),
    overflow: 'hidden',
    position: 'relative',
    '&:hover': {
        transform: 'translateY(-8px)',
        boxShadow: '0 12px 40px rgba(0, 0, 0, 0.15)',
    },
    '&::before': {
        content: '""',
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: '4px',
        background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
    },
}));

const InfoRow = styled(Box)(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    marginBottom: theme.spacing(1),
    '& .MuiSvgIcon-root': {
        marginRight: theme.spacing(1),
        fontSize: '1.2rem',
        color: theme.palette.primary.main,
    },
}));

const ApplianceCard = ({ appliance, onViewDetails }) => {
    const { addToCart, isInCart, getItemQuantity } = useCart();
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
        if (dimensions.length === 0) return 'Dimensions not available';
        return `${dimensions.join(' × ')}"`;
    };

    const formatDate = (dateString) => {
        if (!dateString || dateString === '//' || dateString === '//') {
            return 'TBD';
        }
        return dateString;
    };

    return (
        <StyledCard>
            <CardContent sx={{ flexGrow: 1, p: 3 }}>
                {/* Header */}
                <Box sx={{ mb: 2 }}>
                    <Typography
                        variant="h5"
                        component="h2"
                        gutterBottom
                        sx={{
                            fontWeight: 700,
                            color: 'primary.main',
                            fontSize: '1.3rem',
                        }}
                    >
                        {appliance.Model_Number}
                    </Typography>

                    <Typography
                        variant="body1"
                        color="text.secondary"
                        sx={{
                            mb: 2,
                            lineHeight: 1.5,
                            display: '-webkit-box',
                            WebkitLineClamp: 3,
                            WebkitBoxOrient: 'vertical',
                            overflow: 'hidden',
                        }}
                    >
                        {appliance.Description}
                    </Typography>

                    <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 2 }}>
                        <Chip
                            icon={<BrandIcon />}
                            label={appliance.Brand}
                            color="primary"
                            variant="outlined"
                            size="small"
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
                            variant="filled"
                            size="small"
                        />
                    </Box>
                </Box>

                <Divider sx={{ my: 2 }} />

                {/* Details Grid */}
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <InfoRow>
                            <PriceIcon />
                            <Typography variant="body2">
                                <strong>Deck Price:</strong> {formatPrice(appliance.DeckPrice)}
                            </Typography>
                        </InfoRow>
                    </Grid>

                    {appliance.LCNN && appliance.LCNN !== '0.00' && (
                        <Grid item xs={12}>
                            <InfoRow>
                                <PriceIcon />
                                <Typography variant="body2">
                                    <strong>LCNN Price:</strong> {formatPrice(appliance.LCNN)}
                                </Typography>
                            </InfoRow>
                        </Grid>
                    )}

                    {(appliance.Category_Major || appliance.Category_Minor) && (
                        <Grid item xs={12}>
                            <InfoRow>
                                <CategoryIcon />
                                <Typography variant="body2">
                                    <strong>Category:</strong> {appliance.Category_Major}
                                    {appliance.Category_Minor && ` - ${appliance.Category_Minor}`}
                                </Typography>
                            </InfoRow>
                        </Grid>
                    )}

                    {(appliance.Height || appliance.Width || appliance.Depth) && (
                        <Grid item xs={12}>
                            <InfoRow>
                                <InfoIcon />
                                <Typography variant="body2">
                                    <strong>Dimensions:</strong> {formatDimensions(
                                        appliance.Height,
                                        appliance.Width,
                                        appliance.Depth
                                    )}
                                </Typography>
                            </InfoRow>
                        </Grid>
                    )}

                    {appliance.UPC && appliance.UPC !== 'No UPC' && (
                        <Grid item xs={12}>
                            <InfoRow>
                                <InfoIcon />
                                <Typography variant="body2" sx={{ fontSize: '0.85rem' }}>
                                    <strong>UPC:</strong> {appliance.UPC}
                                </Typography>
                            </InfoRow>
                        </Grid>
                    )}

                    {appliance.Warehouse && (
                        <Grid item xs={12}>
                            <InfoRow>
                                <ShippingIcon />
                                <Typography variant="body2">
                                    <strong>Warehouse:</strong> {appliance.Warehouse}
                                </Typography>
                            </InfoRow>
                        </Grid>
                    )}

                    {appliance.Next_Truck_Date && (
                        <Grid item xs={12}>
                            <InfoRow>
                                <TimeIcon />
                                <Typography variant="body2">
                                    <strong>Next Delivery:</strong> {formatDate(appliance.Next_Truck_Date)}
                                </Typography>
                            </InfoRow>
                        </Grid>
                    )}

                    {appliance.Last_Synch_TS && (
                        <Grid item xs={12}>
                            <Typography
                                variant="caption"
                                color="text.secondary"
                                sx={{ fontSize: '0.75rem', fontStyle: 'italic' }}
                            >
                                Last updated: {appliance.Last_Synch_TS}
                            </Typography>
                        </Grid>
                    )}
                </Grid>

                {/* Additional Info */}
                {(appliance.Serial_Number_Required === '1' || appliance.Order_Entry === '1') && (
                    <Box sx={{ mt: 2 }}>
                        <Divider sx={{ mb: 1 }} />
                        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                            {appliance.Serial_Number_Required === '1' && (
                                <Chip
                                    label="Serial # Required"
                                    size="small"
                                    color="info"
                                    variant="outlined"
                                />
                            )}

                            {appliance.Order_Entry === '1' && (
                                <Chip
                                    label="Available for Order"
                                    size="small"
                                    color="success"
                                    variant="outlined"
                                />
                            )}
                        </Box>
                    </Box>
                )}

                {/* Action Buttons */}
                <Box sx={{ mt: 3 }}>
                    <ButtonGroup
                        fullWidth
                        variant="contained"
                        sx={{
                            borderRadius: 2,
                            '& .MuiButton-root': {
                                textTransform: 'none',
                                fontWeight: 500,
                            }
                        }}
                    >
                        <Button
                            onClick={() => addToCart(appliance)}
                            startIcon={
                                isInCart(appliance.Model_Number) ? <CheckIcon /> : <AddCartIcon />
                            }
                            color={isInCart(appliance.Model_Number) ? "success" : "primary"}
                            disabled={
                                !appliance.Available ||
                                parseInt(appliance.Available) === 0 ||
                                !appliance.DeckPrice ||
                                appliance.DeckPrice === '0.00'
                            }
                        >
                            {isInCart(appliance.Model_Number)
                                ? `In Cart (${getItemQuantity(appliance.Model_Number)})`
                                : 'Add to Cart'
                            }
                        </Button>

                        {onViewDetails && (
                            <Button
                                onClick={() => onViewDetails(appliance)}
                                sx={{ minWidth: '120px' }}
                            >
                                View Details
                            </Button>
                        )}
                    </ButtonGroup>
                </Box>
            </CardContent>
        </StyledCard>
    );
};

export default ApplianceCard; 