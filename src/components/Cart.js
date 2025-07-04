import React, { useState } from 'react';
import {
    Box,
    Card,
    CardContent,
    Typography,
    IconButton,
    Button,
    Grid,
    Divider,
    TextField,
    Alert,
    Chip,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    List,
    ListItem,
    ListItemText,
    ListItemSecondaryAction,
    Avatar,
    Tooltip,
    Fab,
    Badge,
} from '@mui/material';
import {
    ShoppingCart as CartIcon,
    Add as AddIcon,
    Remove as RemoveIcon,
    Delete as DeleteIcon,
    Close as CloseIcon,
    Payment as PaymentIcon,
    LocalShipping as ShippingIcon,
    Receipt as ReceiptIcon,
    ShoppingCartCheckout as CheckoutIcon,
    NotificationsActive as NotificationsIcon,
} from '@mui/icons-material';
import { useCart } from '../contexts/CartContext';
import DeliveryOptions from './DeliveryOptions';
import NotifyWhenAvailable from './NotifyWhenAvailable';

const Cart = ({ open, onClose }) => {
    const {
        items,
        totalItems,
        totalPrice,
        deliveryFee,
        installationFee,
        finalTotal,
        updateQuantity,
        removeFromCart,
        clearCart,
        isLoggedIn,
        user
    } = useCart();

    const [showCheckout, setShowCheckout] = useState(false);
    const [showNotifications, setShowNotifications] = useState(false);

    const handleQuantityChange = (item, newQuantity) => {
        const identifier = item.partNumber || item.Model_Number;
        if (newQuantity < 1) {
            removeFromCart(item.Model_Number, item.partNumber);
        } else {
            updateQuantity(item.Model_Number, newQuantity, item.partNumber);
        }
    };

    const formatPrice = (price) => {
        return `$${parseFloat(price || 0).toLocaleString('en-US', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        })}`;
    };

    const getAvailabilityColor = (status) => {
        switch (status?.toLowerCase()) {
            case 'in stock':
            case 'available':
                return 'success';
            case 'backordered':
                return 'warning';
            case 'out of stock':
                return 'error';
            default:
                return 'default';
        }
    };

    const handleCheckout = () => {
        if (!isLoggedIn) {
            alert('Please log in to proceed with checkout');
            return;
        }
        setShowCheckout(true);
    };

    if (items.length === 0) {
        return (
            <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
                <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <CartIcon />
                    Your Cart
                    <IconButton
                        aria-label="close"
                        onClick={onClose}
                        sx={{ position: 'absolute', right: 8, top: 8 }}
                    >
                        <CloseIcon />
                    </IconButton>
                </DialogTitle>
                <DialogContent>
                    <Box sx={{ textAlign: 'center', py: 4 }}>
                        <CartIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
                        <Typography variant="h6" color="text.secondary">
                            Your cart is empty
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                            Add some appliances to get started!
                        </Typography>
                    </Box>
                </DialogContent>
            </Dialog>
        );
    }

    return (
        <>
            <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
                <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <CartIcon />
                    Your Cart ({totalItems} {totalItems === 1 ? 'item' : 'items'})
                    <IconButton
                        aria-label="close"
                        onClick={onClose}
                        sx={{ position: 'absolute', right: 8, top: 8 }}
                    >
                        <CloseIcon />
                    </IconButton>
                </DialogTitle>

                <DialogContent>
                    <List>
                        {items.map((item, index) => (
                            <React.Fragment key={item.partNumber || item.Model_Number}>
                                <ListItem alignItems="flex-start" sx={{ py: 2 }}>
                                    <Avatar
                                        src={item.image}
                                        alt={item.Description}
                                        sx={{ width: 60, height: 60, mr: 2 }}
                                        variant="rounded"
                                    >
                                        {item.Brand?.[0] || (item.isAppliance ? 'A' : 'P')}
                                    </Avatar>

                                    <ListItemText
                                        primary={
                                            <Box>
                                                <Typography variant="h6" component="div">
                                                    {item.Description}
                                                </Typography>
                                                <Typography variant="body2" color="text.secondary">
                                                    {item.isAppliance
                                                        ? `Model: ${item.Model_Number}`
                                                        : `Part: ${item.partNumber || item.Model_Number}`
                                                    }
                                                </Typography>
                                                <Typography variant="body2" color="text.secondary">
                                                    Brand: {item.Brand}
                                                </Typography>
                                                <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
                                                    <Chip
                                                        label={item.availability || 'Available'}
                                                        color={getAvailabilityColor(item.availability)}
                                                        size="small"
                                                    />
                                                    <Chip
                                                        label={item.isAppliance ? 'Appliance' : 'Part'}
                                                        variant="outlined"
                                                        size="small"
                                                    />
                                                </Box>
                                            </Box>
                                        }
                                        secondary={
                                            <Box sx={{ mt: 2 }}>
                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                                                    <IconButton
                                                        size="small"
                                                        onClick={() => handleQuantityChange(item, item.quantity - 1)}
                                                        disabled={item.quantity <= 1}
                                                    >
                                                        <RemoveIcon />
                                                    </IconButton>

                                                    <TextField
                                                        size="small"
                                                        value={item.quantity}
                                                        onChange={(e) => {
                                                            const value = parseInt(e.target.value) || 1;
                                                            handleQuantityChange(item, value);
                                                        }}
                                                        inputProps={{
                                                            min: 1,
                                                            type: 'number',
                                                            style: { textAlign: 'center', width: '60px' }
                                                        }}
                                                    />

                                                    <IconButton
                                                        size="small"
                                                        onClick={() => handleQuantityChange(item, item.quantity + 1)}
                                                    >
                                                        <AddIcon />
                                                    </IconButton>

                                                    <Typography variant="body1" sx={{ ml: 2 }}>
                                                        {formatPrice(item.price)} each
                                                    </Typography>
                                                </Box>

                                                <Typography variant="h6" color="primary">
                                                    Subtotal: {formatPrice(item.price * item.quantity)}
                                                </Typography>
                                            </Box>
                                        }
                                    />

                                    <ListItemSecondaryAction>
                                        <Tooltip title="Remove from cart">
                                            <IconButton
                                                edge="end"
                                                aria-label="delete"
                                                onClick={() => removeFromCart(item.Model_Number, item.partNumber)}
                                                color="error"
                                            >
                                                <DeleteIcon />
                                            </IconButton>
                                        </Tooltip>
                                    </ListItemSecondaryAction>
                                </ListItem>

                                {index < items.length - 1 && <Divider />}
                            </React.Fragment>
                        ))}
                    </List>

                    <Divider sx={{ my: 2 }} />

                    {/* Delivery Options */}
                    <DeliveryOptions sx={{ mb: 2 }} />

                    <Card variant="outlined" sx={{ backgroundColor: 'rgba(25, 118, 210, 0.04)' }}>
                        <CardContent>
                            <Grid container spacing={2}>
                                <Grid item xs={12}>
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                        <Typography variant="body1">
                                            Items ({totalItems}):
                                        </Typography>
                                        <Typography variant="body1">
                                            {formatPrice(totalPrice)}
                                        </Typography>
                                    </Box>

                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                        <Typography variant="body1">
                                            Delivery:
                                        </Typography>
                                        <Typography variant="body1" color={deliveryFee === 0 ? 'success.main' : 'text.primary'}>
                                            {deliveryFee === 0 ? 'FREE' : formatPrice(deliveryFee)}
                                        </Typography>
                                    </Box>

                                    {installationFee > 0 && (
                                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                            <Typography variant="body1">
                                                Installation:
                                            </Typography>
                                            <Typography variant="body1">
                                                {formatPrice(installationFee)}
                                            </Typography>
                                        </Box>
                                    )}

                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                        <Typography variant="body1">
                                            Estimated Tax:
                                        </Typography>
                                        <Typography variant="body1">
                                            {formatPrice(totalPrice * 0.08)}
                                        </Typography>
                                    </Box>

                                    <Divider sx={{ my: 1 }} />

                                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                        <Typography variant="h6">
                                            Order Total:
                                        </Typography>
                                        <Typography variant="h6" color="primary">
                                            {formatPrice(finalTotal + (totalPrice * 0.08))}
                                        </Typography>
                                    </Box>
                                </Grid>
                            </Grid>
                        </CardContent>
                    </Card>

                    {!isLoggedIn && (
                        <Alert severity="info" sx={{ mt: 2 }}>
                            Please log in to proceed with checkout
                        </Alert>
                    )}
                </DialogContent>

                <DialogActions sx={{ p: 3, gap: 1 }}>
                    <Button
                        onClick={clearCart}
                        color="error"
                        variant="outlined"
                        startIcon={<DeleteIcon />}
                    >
                        Clear Cart
                    </Button>

                    <Button
                        onClick={() => setShowNotifications(true)}
                        variant="outlined"
                        startIcon={<NotificationsIcon />}
                    >
                        Notifications
                    </Button>

                    <Box sx={{ flexGrow: 1 }} />

                    <Button
                        onClick={onClose}
                        variant="outlined"
                    >
                        Continue Shopping
                    </Button>

                    <Button
                        onClick={handleCheckout}
                        variant="contained"
                        size="large"
                        startIcon={<CheckoutIcon />}
                        disabled={!isLoggedIn}
                    >
                        Proceed to Checkout
                    </Button>
                </DialogActions>
            </Dialog>

            {showCheckout && (
                <CheckoutDialog
                    open={showCheckout}
                    onClose={() => setShowCheckout(false)}
                />
            )}

            {/* Notification Management Dialog */}
            <NotifyWhenAvailable
                open={showNotifications}
                onClose={() => setShowNotifications(false)}
                showManageMode={true}
            />
        </>
    );
};

const CheckoutDialog = ({ open, onClose }) => {
    const {
        items,
        totalPrice,
        deliveryFee,
        installationFee,
        finalTotal,
        user,
        placeOrder,
        shippingAddress,
        paymentMethod,
        setShippingAddress,
        setPaymentMethod
    } = useCart();

    const [step, setStep] = useState(1);
    const [orderPlaced, setOrderPlaced] = useState(false);
    const [orderNumber, setOrderNumber] = useState(null);
    const [loading, setLoading] = useState(false);
    const [localShippingAddress, setLocalShippingAddress] = useState(shippingAddress || {
        name: user?.name || '',
        street: '',
        city: '',
        state: '',
        zip: '',
        phone: user?.phone || ''
    });
    const [localPaymentMethod, setLocalPaymentMethod] = useState(paymentMethod || 'credit_card');

    const handlePlaceOrder = async () => {
        setLoading(true);
        try {
            // Update context with shipping and payment info
            setShippingAddress(localShippingAddress);
            setPaymentMethod(localPaymentMethod);

            // Place the order
            const newOrderNumber = placeOrder({
                shippingAddress: localShippingAddress,
                paymentMethod: localPaymentMethod
            });

            setOrderNumber(newOrderNumber);
            setOrderPlaced(true);
        } catch (error) {
            console.error('Error placing order:', error);
            alert('Error placing order. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const formatPrice = (price) => {
        return `$${parseFloat(price || 0).toLocaleString('en-US', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        })}`;
    };

    if (orderPlaced) {
        return (
            <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
                <DialogTitle>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <CheckoutIcon />
                        Order Placed Successfully!
                    </Box>
                </DialogTitle>

                <DialogContent>
                    <Alert severity="success" sx={{ mb: 2 }}>
                        Your order has been placed successfully!
                    </Alert>

                    <Box sx={{ textAlign: 'center', py: 2 }}>
                        <Typography variant="h4" color="primary" gutterBottom>
                            Order #{orderNumber}
                        </Typography>
                        <Typography variant="body1" gutterBottom>
                            Total: {formatPrice(finalTotal + (totalPrice * 0.08))}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            Confirmation email sent to {user?.email}
                        </Typography>
                    </Box>

                    <Box sx={{ mt: 3 }}>
                        <Typography variant="h6" gutterBottom>What's Next?</Typography>
                        <Typography variant="body2" gutterBottom>
                            • You'll receive email updates as your order progresses
                        </Typography>
                        <Typography variant="body2" gutterBottom>
                            • Track your order anytime in Order History
                        </Typography>
                        <Typography variant="body2" gutterBottom>
                            • Installation appointments will be scheduled after delivery
                        </Typography>
                    </Box>
                </DialogContent>

                <DialogActions>
                    <Button onClick={onClose} variant="contained" fullWidth>
                        Continue Shopping
                    </Button>
                </DialogActions>
            </Dialog>
        );
    }

    return (
        <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
            <DialogTitle>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <ReceiptIcon />
                    Checkout - Step {step} of 3
                </Box>
            </DialogTitle>

            <DialogContent>
                {step === 1 && (
                    <Box>
                        <Typography variant="h6" gutterBottom>Shipping Address</Typography>
                        <Grid container spacing={2}>
                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    label="Full Name"
                                    value={localShippingAddress.name}
                                    onChange={(e) => setLocalShippingAddress({ ...localShippingAddress, name: e.target.value })}
                                    required
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    label="Street Address"
                                    value={localShippingAddress.street}
                                    onChange={(e) => setLocalShippingAddress({ ...localShippingAddress, street: e.target.value })}
                                    required
                                />
                            </Grid>
                            <Grid item xs={6}>
                                <TextField
                                    fullWidth
                                    label="City"
                                    value={localShippingAddress.city}
                                    onChange={(e) => setLocalShippingAddress({ ...localShippingAddress, city: e.target.value })}
                                    required
                                />
                            </Grid>
                            <Grid item xs={3}>
                                <TextField
                                    fullWidth
                                    label="State"
                                    value={localShippingAddress.state}
                                    onChange={(e) => setLocalShippingAddress({ ...localShippingAddress, state: e.target.value })}
                                    required
                                />
                            </Grid>
                            <Grid item xs={3}>
                                <TextField
                                    fullWidth
                                    label="ZIP Code"
                                    value={localShippingAddress.zip}
                                    onChange={(e) => setLocalShippingAddress({ ...localShippingAddress, zip: e.target.value })}
                                    required
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    label="Phone Number"
                                    value={localShippingAddress.phone}
                                    onChange={(e) => setLocalShippingAddress({ ...localShippingAddress, phone: e.target.value })}
                                    required
                                />
                            </Grid>
                        </Grid>
                    </Box>
                )}

                {step === 2 && (
                    <Box>
                        <Typography variant="h6" gutterBottom>Payment Method</Typography>
                        <Grid container spacing={2}>
                            <Grid item xs={12}>
                                <TextField
                                    select
                                    fullWidth
                                    label="Payment Method"
                                    value={localPaymentMethod}
                                    onChange={(e) => setLocalPaymentMethod(e.target.value)}
                                    SelectProps={{ native: true }}
                                >
                                    <option value="credit_card">Credit Card</option>
                                    <option value="corporate_account">Corporate Account</option>
                                    <option value="net_terms">Net Terms</option>
                                    <option value="purchase_order">Purchase Order</option>
                                </TextField>
                            </Grid>
                        </Grid>

                        <Alert severity="info" sx={{ mt: 2 }}>
                            Payment processing will be handled through our secure partner portal.
                        </Alert>
                    </Box>
                )}

                {step === 3 && (
                    <Box>
                        <Typography variant="h6" gutterBottom>Order Review</Typography>

                        <Card variant="outlined" sx={{ mb: 2 }}>
                            <CardContent>
                                <Typography variant="subtitle1" gutterBottom>Items ({items.length})</Typography>
                                {items.map((item, index) => (
                                    <Box key={index} sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                        <Typography variant="body2">
                                            {item.Description} (Qty: {item.quantity})
                                        </Typography>
                                        <Typography variant="body2">
                                            {formatPrice(item.price * item.quantity)}
                                        </Typography>
                                    </Box>
                                ))}
                            </CardContent>
                        </Card>

                        <Card variant="outlined" sx={{ mb: 2 }}>
                            <CardContent>
                                <Typography variant="subtitle1" gutterBottom>Shipping Address</Typography>
                                <Typography variant="body2">
                                    {localShippingAddress.name}<br />
                                    {localShippingAddress.street}<br />
                                    {localShippingAddress.city}, {localShippingAddress.state} {localShippingAddress.zip}<br />
                                    Phone: {localShippingAddress.phone}
                                </Typography>
                            </CardContent>
                        </Card>

                        <Card variant="outlined" sx={{ backgroundColor: 'rgba(25, 118, 210, 0.04)' }}>
                            <CardContent>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                    <Typography>Subtotal:</Typography>
                                    <Typography>{formatPrice(totalPrice)}</Typography>
                                </Box>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                    <Typography>Delivery:</Typography>
                                    <Typography>{deliveryFee === 0 ? 'FREE' : formatPrice(deliveryFee)}</Typography>
                                </Box>
                                {installationFee > 0 && (
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                        <Typography>Installation:</Typography>
                                        <Typography>{formatPrice(installationFee)}</Typography>
                                    </Box>
                                )}
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                    <Typography>Tax (8%):</Typography>
                                    <Typography>{formatPrice(totalPrice * 0.08)}</Typography>
                                </Box>
                                <Divider sx={{ my: 1 }} />
                                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <Typography variant="h6">Total:</Typography>
                                    <Typography variant="h6" color="primary">
                                        {formatPrice(finalTotal + (totalPrice * 0.08))}
                                    </Typography>
                                </Box>
                            </CardContent>
                        </Card>
                    </Box>
                )}
            </DialogContent>

            <DialogActions sx={{ p: 2 }}>
                <Button onClick={onClose}>Cancel</Button>

                {step > 1 && (
                    <Button onClick={() => setStep(step - 1)}>
                        Back
                    </Button>
                )}

                {step < 3 ? (
                    <Button
                        variant="contained"
                        onClick={() => setStep(step + 1)}
                        disabled={
                            (step === 1 && (!localShippingAddress.name || !localShippingAddress.street || !localShippingAddress.city)) ||
                            (step === 2 && !localPaymentMethod)
                        }
                    >
                        Next
                    </Button>
                ) : (
                    <Button
                        variant="contained"
                        onClick={handlePlaceOrder}
                        disabled={loading}
                        startIcon={loading ? null : <CheckoutIcon />}
                    >
                        {loading ? 'Placing Order...' : 'Place Order'}
                    </Button>
                )}
            </DialogActions>
        </Dialog>
    );
};

export const CartFab = ({ onClick }) => {
    const { totalItems } = useCart();

    return (
        <Fab
            color="primary"
            aria-label="cart"
            onClick={onClick}
            sx={{
                position: 'fixed',
                bottom: 16,
                right: 16,
                zIndex: 1000,
            }}
        >
            <Badge badgeContent={totalItems} color="error">
                <CartIcon />
            </Badge>
        </Fab>
    );
};

export default Cart; 