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
} from '@mui/icons-material';
import { useCart } from '../contexts/CartContext';

const Cart = ({ open, onClose }) => {
    const {
        items,
        totalItems,
        totalPrice,
        updateQuantity,
        removeFromCart,
        clearCart,
        isLoggedIn,
        user
    } = useCart();

    const [showCheckout, setShowCheckout] = useState(false);

    const handleQuantityChange = (modelNumber, newQuantity) => {
        if (newQuantity < 1) {
            removeFromCart(modelNumber);
        } else {
            updateQuantity(modelNumber, newQuantity);
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
                            <React.Fragment key={item.Model_Number}>
                                <ListItem alignItems="flex-start" sx={{ py: 2 }}>
                                    <Avatar
                                        src={item.image}
                                        alt={item.Description}
                                        sx={{ width: 60, height: 60, mr: 2 }}
                                        variant="rounded"
                                    >
                                        {item.Brand?.[0]}
                                    </Avatar>

                                    <ListItemText
                                        primary={
                                            <Box>
                                                <Typography variant="h6" component="div">
                                                    {item.Description}
                                                </Typography>
                                                <Typography variant="body2" color="text.secondary">
                                                    Model: {item.Model_Number}
                                                </Typography>
                                                <Typography variant="body2" color="text.secondary">
                                                    Brand: {item.Brand}
                                                </Typography>
                                                <Chip
                                                    label={item.availability || 'Available'}
                                                    color={getAvailabilityColor(item.availability)}
                                                    size="small"
                                                    sx={{ mt: 1 }}
                                                />
                                            </Box>
                                        }
                                        secondary={
                                            <Box sx={{ mt: 2 }}>
                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                                                    <IconButton
                                                        size="small"
                                                        onClick={() => handleQuantityChange(item.Model_Number, item.quantity - 1)}
                                                        disabled={item.quantity <= 1}
                                                    >
                                                        <RemoveIcon />
                                                    </IconButton>

                                                    <TextField
                                                        size="small"
                                                        value={item.quantity}
                                                        onChange={(e) => {
                                                            const value = parseInt(e.target.value) || 1;
                                                            handleQuantityChange(item.Model_Number, value);
                                                        }}
                                                        inputProps={{
                                                            min: 1,
                                                            type: 'number',
                                                            style: { textAlign: 'center', width: '60px' }
                                                        }}
                                                    />

                                                    <IconButton
                                                        size="small"
                                                        onClick={() => handleQuantityChange(item.Model_Number, item.quantity + 1)}
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
                                                onClick={() => removeFromCart(item.Model_Number)}
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
                                            Estimated Tax:
                                        </Typography>
                                        <Typography variant="body1">
                                            {formatPrice(totalPrice * 0.08)}
                                        </Typography>
                                    </Box>

                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                        <Typography variant="body1">
                                            Shipping:
                                        </Typography>
                                        <Typography variant="body1">
                                            TBD at checkout
                                        </Typography>
                                    </Box>

                                    <Divider sx={{ my: 1 }} />

                                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                        <Typography variant="h6">
                                            Estimated Total:
                                        </Typography>
                                        <Typography variant="h6" color="primary">
                                            {formatPrice(totalPrice + (totalPrice * 0.08))}
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
        </>
    );
};

const CheckoutDialog = ({ open, onClose }) => {
    const { items, totalPrice, user } = useCart();

    return (
        <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
            <DialogTitle>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <ReceiptIcon />
                    Checkout
                </Box>
            </DialogTitle>

            <DialogContent>
                <Alert severity="info">
                    Checkout functionality is coming soon! This will integrate with the DMI API to place orders.
                </Alert>

                <Box sx={{ mt: 2 }}>
                    <Typography variant="h6">Order Summary</Typography>
                    <Typography>Items: {items.length}</Typography>
                    <Typography>Total: ${totalPrice.toFixed(2)}</Typography>
                    <Typography>Customer: {user?.name || 'N/A'}</Typography>
                </Box>
            </DialogContent>

            <DialogActions>
                <Button onClick={onClose}>Back to Cart</Button>
                <Button variant="contained" disabled>
                    Place Order (Coming Soon)
                </Button>
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