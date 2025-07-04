import React, { useState } from 'react';
import {
    Box,
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Typography,
    Checkbox,
    FormControlLabel,
    Alert,
    IconButton,
    Chip,
    List,
    ListItem,
    ListItemText,
    ListItemSecondaryAction,
    Divider,
} from '@mui/material';
import {
    Close as CloseIcon,
    NotificationsActive as NotificationsIcon,
    Email as EmailIcon,
    Delete as DeleteIcon,
    CheckCircle as CheckCircleIcon,
} from '@mui/icons-material';
import { useCart } from '../contexts/CartContext';

const NotifyWhenAvailable = ({
    open,
    onClose,
    item = null,
    showManageMode = false
}) => {
    const {
        user,
        addNotificationRequest,
        removeNotificationRequest,
        notificationRequests,
        hasNotificationRequest
    } = useCart();

    const [email, setEmail] = useState(user?.email || '');
    const [agreedToNotifications, setAgreedToNotifications] = useState(false);
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    const handleSubmit = async () => {
        if (!email.trim()) {
            alert('Please enter your email address.');
            return;
        }

        if (!agreedToNotifications) {
            alert('Please agree to receive email notifications.');
            return;
        }

        if (!item) {
            alert('No item selected for notification.');
            return;
        }

        setLoading(true);

        try {
            // Add notification request
            addNotificationRequest({
                ...item,
                email: email.trim()
            });

            // Simulate API call to backend
            setTimeout(() => {
                setSuccess(true);
                setLoading(false);

                setTimeout(() => {
                    setSuccess(false);
                    onClose();
                }, 2000);
            }, 1000);

        } catch (error) {
            console.error('Error setting up notification:', error);
            alert('Failed to set up notification. Please try again.');
            setLoading(false);
        }
    };

    const handleRemoveRequest = (requestId) => {
        removeNotificationRequest(requestId);
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    if (showManageMode) {
        // Manage existing notification requests
        return (
            <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
                <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <NotificationsIcon color="primary" />
                    Manage Notification Requests
                    <IconButton
                        aria-label="close"
                        onClick={onClose}
                        sx={{ position: 'absolute', right: 8, top: 8 }}
                    >
                        <CloseIcon />
                    </IconButton>
                </DialogTitle>

                <DialogContent>
                    {notificationRequests.length === 0 ? (
                        <Alert severity="info">
                            You have no active notification requests.
                        </Alert>
                    ) : (
                        <>
                            <Typography variant="body2" color="text.secondary" gutterBottom>
                                You will receive email notifications when these items become available:
                            </Typography>

                            <List>
                                {notificationRequests.map((request, index) => (
                                    <React.Fragment key={request.id}>
                                        <ListItem>
                                            <ListItemText
                                                primary={
                                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                        <Typography variant="subtitle2">
                                                            {request.description}
                                                        </Typography>
                                                        <Chip
                                                            label={request.itemType}
                                                            size="small"
                                                            variant="outlined"
                                                        />
                                                    </Box>
                                                }
                                                secondary={
                                                    <Box>
                                                        <Typography variant="body2" color="text.secondary">
                                                            {request.itemType === 'part'
                                                                ? `Part: ${request.partNumber}`
                                                                : `Model: ${request.modelNumber}`
                                                            }
                                                        </Typography>
                                                        <Typography variant="body2" color="text.secondary">
                                                            Email: {request.email}
                                                        </Typography>
                                                        <Typography variant="body2" color="text.secondary">
                                                            Requested: {formatDate(request.requestedAt)}
                                                        </Typography>
                                                    </Box>
                                                }
                                            />
                                            <ListItemSecondaryAction>
                                                <IconButton
                                                    edge="end"
                                                    aria-label="delete"
                                                    onClick={() => handleRemoveRequest(request.id)}
                                                    color="error"
                                                >
                                                    <DeleteIcon />
                                                </IconButton>
                                            </ListItemSecondaryAction>
                                        </ListItem>
                                        {index < notificationRequests.length - 1 && <Divider />}
                                    </React.Fragment>
                                ))}
                            </List>
                        </>
                    )}
                </DialogContent>

                <DialogActions>
                    <Button onClick={onClose}>Close</Button>
                </DialogActions>
            </Dialog>
        );
    }

    // Single item notification setup
    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
            <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <NotificationsIcon color="primary" />
                Notify Me When Available
                <IconButton
                    aria-label="close"
                    onClick={onClose}
                    sx={{ position: 'absolute', right: 8, top: 8 }}
                >
                    <CloseIcon />
                </IconButton>
            </DialogTitle>

            <DialogContent>
                {success ? (
                    <Alert
                        severity="success"
                        icon={<CheckCircleIcon />}
                        sx={{ mb: 2 }}
                    >
                        <Typography variant="h6" gutterBottom>
                            Notification Set Up Successfully!
                        </Typography>
                        <Typography variant="body2">
                            We'll email you as soon as "{item?.Description}" becomes available.
                        </Typography>
                    </Alert>
                ) : (
                    <>
                        {item && (
                            <Box sx={{ mb: 3, p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
                                <Typography variant="h6" gutterBottom>
                                    {item.Description}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    {item.partNumber ? `Part Number: ${item.partNumber}` : `Model: ${item.Model_Number}`}
                                </Typography>
                                <Chip
                                    label="Out of Stock"
                                    color="error"
                                    size="small"
                                    sx={{ mt: 1 }}
                                />
                            </Box>
                        )}

                        <Typography variant="body1" gutterBottom>
                            Get notified as soon as this item is back in stock!
                        </Typography>

                        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                            We'll send you an email notification immediately when this item becomes available for purchase.
                        </Typography>

                        <TextField
                            fullWidth
                            label="Email Address"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Enter your email address"
                            InputProps={{
                                startAdornment: <EmailIcon sx={{ mr: 1, color: 'text.secondary' }} />
                            }}
                            sx={{ mb: 2 }}
                            required
                        />

                        <FormControlLabel
                            control={
                                <Checkbox
                                    checked={agreedToNotifications}
                                    onChange={(e) => setAgreedToNotifications(e.target.checked)}
                                />
                            }
                            label={
                                <Typography variant="body2">
                                    I agree to receive email notifications when this item becomes available.
                                    I can unsubscribe at any time.
                                </Typography>
                            }
                            sx={{ mb: 2 }}
                        />

                        {item && hasNotificationRequest(item.partNumber || item.Model_Number) && (
                            <Alert severity="info" sx={{ mb: 2 }}>
                                You already have a notification request for this item.
                            </Alert>
                        )}

                        <Alert severity="info">
                            <Typography variant="body2">
                                <strong>Privacy Notice:</strong> Your email will only be used to notify you about this specific item's availability.
                                We won't send marketing emails or share your information with third parties.
                            </Typography>
                        </Alert>
                    </>
                )}
            </DialogContent>

            <DialogActions>
                <Button onClick={onClose}>
                    {success ? 'Close' : 'Cancel'}
                </Button>
                {!success && (
                    <Button
                        variant="contained"
                        onClick={handleSubmit}
                        disabled={loading || !email.trim() || !agreedToNotifications ||
                            (item && hasNotificationRequest(item.partNumber || item.Model_Number))}
                        startIcon={loading ? null : <NotificationsIcon />}
                    >
                        {loading ? 'Setting up...' : 'Notify Me'}
                    </Button>
                )}
            </DialogActions>
        </Dialog>
    );
};

export default NotifyWhenAvailable; 