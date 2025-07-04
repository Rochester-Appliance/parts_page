import React from 'react';
import {
    Box,
    Card,
    CardContent,
    Typography,
    RadioGroup,
    FormControlLabel,
    Radio,
    Alert,
    Chip,
    Divider,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    Checkbox,
    Tooltip,
} from '@mui/material';
import {
    LocalShipping as ShippingIcon,
    Home as HomeIcon,
    CheckCircle as CheckCircleIcon,
    Info as InfoIcon,
    Build as InstallIcon,
    AttachMoney as MoneyIcon,
} from '@mui/icons-material';
import { useCart } from '../contexts/CartContext';

const DeliveryOptions = ({ sx = {} }) => {
    const {
        deliveryOption,
        setDeliveryOption,
        flatDeliveryFee,
        deliveryFee,
        installationRequested,
        setInstallation,
        installationFee,
        installationFees,
        items
    } = useCart();

    const handleDeliveryChange = (event) => {
        setDeliveryOption(event.target.value);
    };

    // Check if cart contains only appliances
    const hasOnlyAppliances = items.length > 0 && items.every(item => item.isAppliance);
    const hasAppliances = items.some(item => item.isAppliance);
    const hasParts = items.some(item => !item.isAppliance);

    const formatPrice = (price) => {
        return `$${parseFloat(price || 0).toFixed(2)}`;
    };

    return (
        <Card sx={{ ...sx }}>
            <CardContent>
                <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <ShippingIcon color="primary" />
                    Delivery Options
                </Typography>

                <RadioGroup
                    value={deliveryOption}
                    onChange={handleDeliveryChange}
                >
                    {/* Standard Delivery */}
                    <Card variant="outlined" sx={{ mb: 2, bgcolor: deliveryOption === 'standard' ? 'action.selected' : 'background.paper' }}>
                        <CardContent sx={{ p: 2 }}>
                            <FormControlLabel
                                value="standard"
                                control={<Radio />}
                                label={
                                    <Box sx={{ ml: 1 }}>
                                        <Typography variant="subtitle1" fontWeight="medium">
                                            Standard Delivery
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            Delivered to your doorstep
                                        </Typography>
                                    </Box>
                                }
                                sx={{ width: '100%', m: 0 }}
                            />

                            <Box sx={{ mt: 2 }}>
                                <Typography variant="body2" fontWeight="medium" color="primary">
                                    Flat Rate: {formatPrice(flatDeliveryFee)}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    One flat fee per order, regardless of quantity
                                </Typography>

                                <List dense sx={{ mt: 1 }}>
                                    <ListItem sx={{ pl: 0 }}>
                                        <ListItemIcon sx={{ minWidth: 24 }}>
                                            <CheckCircleIcon color="success" fontSize="small" />
                                        </ListItemIcon>
                                        <ListItemText
                                            primary="Delivered within 3-5 business days"
                                            primaryTypographyProps={{ variant: 'body2' }}
                                        />
                                    </ListItem>
                                    <ListItem sx={{ pl: 0 }}>
                                        <ListItemIcon sx={{ minWidth: 24 }}>
                                            <CheckCircleIcon color="success" fontSize="small" />
                                        </ListItemIcon>
                                        <ListItemText
                                            primary="Signature required for delivery"
                                            primaryTypographyProps={{ variant: 'body2' }}
                                        />
                                    </ListItem>
                                </List>
                            </Box>
                        </CardContent>
                    </Card>

                    {/* Drop-off Delivery */}
                    <Card variant="outlined" sx={{ mb: 2, bgcolor: deliveryOption === 'dropoff' ? 'action.selected' : 'background.paper' }}>
                        <CardContent sx={{ p: 2 }}>
                            <FormControlLabel
                                value="dropoff"
                                control={<Radio />}
                                label={
                                    <Box sx={{ ml: 1 }}>
                                        <Typography variant="subtitle1" fontWeight="medium">
                                            Drop-off Delivery
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            Delivered outside or in garage
                                        </Typography>
                                    </Box>
                                }
                                sx={{ width: '100%', m: 0 }}
                            />

                            <Box sx={{ mt: 2 }}>
                                {hasOnlyAppliances ? (
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                                        <Typography variant="body2" fontWeight="medium" color="success.main">
                                            FREE
                                        </Typography>
                                        <Chip
                                            label="Appliances Only"
                                            size="small"
                                            color="success"
                                            variant="outlined"
                                        />
                                    </Box>
                                ) : hasParts ? (
                                    <Typography variant="body2" fontWeight="medium" color="primary">
                                        Flat Rate: {formatPrice(flatDeliveryFee)}
                                    </Typography>
                                ) : (
                                    <Typography variant="body2" fontWeight="medium" color="primary">
                                        Flat Rate: {formatPrice(flatDeliveryFee)}
                                    </Typography>
                                )}

                                <Typography variant="body2" color="text.secondary">
                                    Specify "Drop off outside or in garage" for drop off delivery
                                </Typography>

                                <List dense sx={{ mt: 1 }}>
                                    <ListItem sx={{ pl: 0 }}>
                                        <ListItemIcon sx={{ minWidth: 24 }}>
                                            <CheckCircleIcon color="success" fontSize="small" />
                                        </ListItemIcon>
                                        <ListItemText
                                            primary="Left at specified location"
                                            primaryTypographyProps={{ variant: 'body2' }}
                                        />
                                    </ListItem>
                                    <ListItem sx={{ pl: 0 }}>
                                        <ListItemIcon sx={{ minWidth: 24 }}>
                                            <CheckCircleIcon color="success" fontSize="small" />
                                        </ListItemIcon>
                                        <ListItemText
                                            primary="No signature required"
                                            primaryTypographyProps={{ variant: 'body2' }}
                                        />
                                    </ListItem>
                                    <ListItem sx={{ pl: 0 }}>
                                        <ListItemIcon sx={{ minWidth: 24 }}>
                                            <CheckCircleIcon color="success" fontSize="small" />
                                        </ListItemIcon>
                                        <ListItemText
                                            primary="Photo confirmation of delivery"
                                            primaryTypographyProps={{ variant: 'body2' }}
                                        />
                                    </ListItem>
                                </List>
                            </Box>
                        </CardContent>
                    </Card>
                </RadioGroup>

                {/* Installation Option */}
                {items.some(item => item.isAppliance) && (
                    <>
                        <Divider sx={{ my: 2 }} />
                        <Card variant="outlined" sx={{ bgcolor: installationRequested ? 'action.selected' : 'background.paper' }}>
                            <CardContent sx={{ p: 2 }}>
                                <FormControlLabel
                                    control={
                                        <Checkbox
                                            checked={installationRequested}
                                            onChange={(e) => setInstallation(e.target.checked)}
                                            disabled={deliveryOption === 'dropoff'}
                                        />
                                    }
                                    label={
                                        <Box sx={{ ml: 1 }}>
                                            <Typography variant="subtitle1" fontWeight="medium" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                <InstallIcon color="primary" />
                                                Professional Installation
                                            </Typography>
                                            <Typography variant="body2" color="text.secondary">
                                                Expert installation by certified technicians
                                            </Typography>
                                        </Box>
                                    }
                                    sx={{ width: '100%', m: 0 }}
                                />

                                {installationRequested && (
                                    <Box sx={{ mt: 2, ml: 4 }}>
                                        <Typography variant="body2" fontWeight="medium" color="primary">
                                            Installation Fee: {formatPrice(installationFee)}
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                                            Includes removal of old appliance and basic hookup
                                        </Typography>

                                        <List dense sx={{ mt: 1 }}>
                                            <ListItem sx={{ pl: 0 }}>
                                                <ListItemIcon sx={{ minWidth: 24 }}>
                                                    <CheckCircleIcon color="success" fontSize="small" />
                                                </ListItemIcon>
                                                <ListItemText
                                                    primary="Professional certified installers"
                                                    primaryTypographyProps={{ variant: 'body2' }}
                                                />
                                            </ListItem>
                                            <ListItem sx={{ pl: 0 }}>
                                                <ListItemIcon sx={{ minWidth: 24 }}>
                                                    <CheckCircleIcon color="success" fontSize="small" />
                                                </ListItemIcon>
                                                <ListItemText
                                                    primary="Old appliance removal included"
                                                    primaryTypographyProps={{ variant: 'body2' }}
                                                />
                                            </ListItem>
                                            <ListItem sx={{ pl: 0 }}>
                                                <ListItemIcon sx={{ minWidth: 24 }}>
                                                    <CheckCircleIcon color="success" fontSize="small" />
                                                </ListItemIcon>
                                                <ListItemText
                                                    primary="Basic hookup and testing"
                                                    primaryTypographyProps={{ variant: 'body2' }}
                                                />
                                            </ListItem>
                                        </List>

                                        {/* Installation pricing breakdown */}
                                        <Box sx={{ mt: 2, p: 1, bgcolor: 'grey.50', borderRadius: 1 }}>
                                            <Typography variant="caption" color="text.secondary">
                                                Installation fees by appliance type:
                                            </Typography>
                                            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 0.5 }}>
                                                <Chip label="Washing Machine: $150" size="small" variant="outlined" />
                                                <Chip label="Dryer: $125" size="small" variant="outlined" />
                                                <Chip label="Refrigerator: $200" size="small" variant="outlined" />
                                                <Chip label="Dishwasher: $175" size="small" variant="outlined" />
                                                <Chip label="Range: $225" size="small" variant="outlined" />
                                            </Box>
                                        </Box>
                                    </Box>
                                )}

                                {deliveryOption === 'dropoff' && (
                                    <Alert severity="warning" sx={{ mt: 2 }}>
                                        <Typography variant="body2">
                                            Installation service is not available with drop-off delivery.
                                            Please select standard delivery for professional installation.
                                        </Typography>
                                    </Alert>
                                )}
                            </CardContent>
                        </Card>
                    </>
                )}

                {/* Current Fees Display */}
                <Divider sx={{ my: 2 }} />
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Typography variant="subtitle2">
                            Delivery Fee:
                        </Typography>
                        <Typography variant="subtitle1" fontWeight="medium" color="primary">
                            {deliveryFee === 0 ? 'FREE' : formatPrice(deliveryFee)}
                        </Typography>
                    </Box>
                    {installationRequested && (
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Typography variant="subtitle2">
                                Installation Fee:
                            </Typography>
                            <Typography variant="subtitle1" fontWeight="medium" color="primary">
                                {formatPrice(installationFee)}
                            </Typography>
                        </Box>
                    )}
                </Box>

                {/* Special Offers/Notices */}
                {hasOnlyAppliances && deliveryOption === 'dropoff' && (
                    <Alert severity="success" sx={{ mt: 2 }} icon={<HomeIcon />}>
                        <Typography variant="body2">
                            <strong>Free Drop-off Delivery!</strong> All appliances qualify for free drop-off delivery.
                        </Typography>
                    </Alert>
                )}

                {hasParts && hasAppliances && deliveryOption === 'dropoff' && (
                    <Alert severity="info" sx={{ mt: 2 }} icon={<InfoIcon />}>
                        <Typography variant="body2">
                            Your order contains both appliances and parts. Drop-off delivery fee applies because of the parts in your order.
                        </Typography>
                    </Alert>
                )}

                <Alert severity="info" sx={{ mt: 2 }}>
                    <Typography variant="body2">
                        <strong>Flat Rate Delivery:</strong> One delivery charge per order, no matter how many items you purchase.
                        Add more items to your cart without increasing delivery costs!
                    </Typography>
                </Alert>
            </CardContent>
        </Card>
    );
};

export default DeliveryOptions; 