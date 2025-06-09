import React, { useState } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Button,
    Box,
    Tab,
    Tabs,
    Typography,
    Alert,
    Grid,
    Divider,
    IconButton,
    Avatar,
    Chip,
} from '@mui/material';
import {
    Person as PersonIcon,
    Close as CloseIcon,
    Email as EmailIcon,
    Phone as PhoneIcon,
    Business as BusinessIcon,
    LocationOn as LocationIcon,
    Visibility,
    VisibilityOff,
} from '@mui/icons-material';
import { useCart } from '../contexts/CartContext';

const UserAuth = ({ open, onClose, defaultTab = 0 }) => {
    const { user, setUser, isLoggedIn, logout } = useCart();
    const [currentTab, setCurrentTab] = useState(defaultTab);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    // Form states
    const [loginForm, setLoginForm] = useState({
        email: '',
        password: ''
    });

    const [registerForm, setRegisterForm] = useState({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        confirmPassword: '',
        phone: '',
        company: '',
        address: '',
        city: '',
        state: '',
        zipCode: ''
    });

    const handleTabChange = (event, newValue) => {
        setCurrentTab(newValue);
        setError('');
    };

    const handleLoginSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            // Simulate API call - in real app, this would call a login API
            await new Promise(resolve => setTimeout(resolve, 1000));

            // For demo purposes, accept any email/password
            if (loginForm.email && loginForm.password) {
                const userData = {
                    id: Date.now(),
                    name: `${loginForm.email.split('@')[0]}`,
                    email: loginForm.email,
                    company: 'Rochester Appliance',
                    joinDate: new Date().toISOString(),
                    // This would come from the API in a real app
                };

                setUser(userData);
                onClose();
            } else {
                setError('Please enter both email and password');
            }
        } catch (err) {
            setError('Login failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleRegisterSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            // Validation
            if (registerForm.password !== registerForm.confirmPassword) {
                setError('Passwords do not match');
                setLoading(false);
                return;
            }

            if (registerForm.password.length < 6) {
                setError('Password must be at least 6 characters');
                setLoading(false);
                return;
            }

            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1500));

            const userData = {
                id: Date.now(),
                name: `${registerForm.firstName} ${registerForm.lastName}`,
                email: registerForm.email,
                phone: registerForm.phone,
                company: registerForm.company,
                address: {
                    street: registerForm.address,
                    city: registerForm.city,
                    state: registerForm.state,
                    zipCode: registerForm.zipCode
                },
                joinDate: new Date().toISOString(),
            };

            setUser(userData);
            onClose();
        } catch (err) {
            setError('Registration failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = () => {
        logout();
        onClose();
    };

    // If user is logged in, show profile
    if (isLoggedIn && user) {
        return (
            <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
                <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <PersonIcon />
                    User Profile
                    <IconButton
                        aria-label="close"
                        onClick={onClose}
                        sx={{ position: 'absolute', right: 8, top: 8 }}
                    >
                        <CloseIcon />
                    </IconButton>
                </DialogTitle>

                <DialogContent>
                    <Box sx={{ textAlign: 'center', mb: 3 }}>
                        <Avatar sx={{ width: 80, height: 80, mx: 'auto', mb: 2, bgcolor: 'primary.main' }}>
                            {user.name?.charAt(0).toUpperCase()}
                        </Avatar>
                        <Typography variant="h5">{user.name}</Typography>
                        <Chip
                            label="Customer"
                            color="primary"
                            size="small"
                            sx={{ mt: 1 }}
                        />
                    </Box>

                    <Divider sx={{ mb: 2 }} />

                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                                <EmailIcon color="action" />
                                <Typography variant="body1">{user.email}</Typography>
                            </Box>
                        </Grid>

                        {user.phone && (
                            <Grid item xs={12}>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                                    <PhoneIcon color="action" />
                                    <Typography variant="body1">{user.phone}</Typography>
                                </Box>
                            </Grid>
                        )}

                        {user.company && (
                            <Grid item xs={12}>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                                    <BusinessIcon color="action" />
                                    <Typography variant="body1">{user.company}</Typography>
                                </Box>
                            </Grid>
                        )}

                        {user.address && (
                            <Grid item xs={12}>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                                    <LocationIcon color="action" />
                                    <Typography variant="body1">
                                        {user.address.street}, {user.address.city}, {user.address.state} {user.address.zipCode}
                                    </Typography>
                                </Box>
                            </Grid>
                        )}

                        <Grid item xs={12}>
                            <Typography variant="caption" color="text.secondary">
                                Member since {new Date(user.joinDate).toLocaleDateString()}
                            </Typography>
                        </Grid>
                    </Grid>
                </DialogContent>

                <DialogActions sx={{ p: 3 }}>
                    <Button onClick={onClose} variant="outlined">
                        Close
                    </Button>
                    <Button onClick={handleLogout} color="error" variant="contained">
                        Logout
                    </Button>
                </DialogActions>
            </Dialog>
        );
    }

    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
            <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <PersonIcon />
                Account
                <IconButton
                    aria-label="close"
                    onClick={onClose}
                    sx={{ position: 'absolute', right: 8, top: 8 }}
                >
                    <CloseIcon />
                </IconButton>
            </DialogTitle>

            <DialogContent>
                <Tabs value={currentTab} onChange={handleTabChange} sx={{ mb: 3 }}>
                    <Tab label="Login" />
                    <Tab label="Create Account" />
                </Tabs>

                {error && (
                    <Alert severity="error" sx={{ mb: 2 }}>
                        {error}
                    </Alert>
                )}

                {/* Login Tab */}
                {currentTab === 0 && (
                    <Box component="form" onSubmit={handleLoginSubmit}>
                        <TextField
                            fullWidth
                            label="Email Address"
                            type="email"
                            value={loginForm.email}
                            onChange={(e) => setLoginForm({ ...loginForm, email: e.target.value })}
                            margin="normal"
                            required
                            autoComplete="email"
                        />

                        <TextField
                            fullWidth
                            label="Password"
                            type={showPassword ? 'text' : 'password'}
                            value={loginForm.password}
                            onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                            margin="normal"
                            required
                            autoComplete="current-password"
                            InputProps={{
                                endAdornment: (
                                    <IconButton
                                        onClick={() => setShowPassword(!showPassword)}
                                        edge="end"
                                    >
                                        {showPassword ? <VisibilityOff /> : <Visibility />}
                                    </IconButton>
                                )
                            }}
                        />

                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            sx={{ mt: 3, mb: 2 }}
                            disabled={loading}
                        >
                            {loading ? 'Signing In...' : 'Sign In'}
                        </Button>

                        <Typography variant="body2" color="text.secondary" align="center">
                            Demo: Use any email and password to login
                        </Typography>
                    </Box>
                )}

                {/* Register Tab */}
                {currentTab === 1 && (
                    <Box component="form" onSubmit={handleRegisterSubmit}>
                        <Grid container spacing={2}>
                            <Grid item xs={6}>
                                <TextField
                                    fullWidth
                                    label="First Name"
                                    value={registerForm.firstName}
                                    onChange={(e) => setRegisterForm({ ...registerForm, firstName: e.target.value })}
                                    required
                                />
                            </Grid>
                            <Grid item xs={6}>
                                <TextField
                                    fullWidth
                                    label="Last Name"
                                    value={registerForm.lastName}
                                    onChange={(e) => setRegisterForm({ ...registerForm, lastName: e.target.value })}
                                    required
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    label="Email Address"
                                    type="email"
                                    value={registerForm.email}
                                    onChange={(e) => setRegisterForm({ ...registerForm, email: e.target.value })}
                                    required
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    label="Phone Number"
                                    value={registerForm.phone}
                                    onChange={(e) => setRegisterForm({ ...registerForm, phone: e.target.value })}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    label="Company"
                                    value={registerForm.company}
                                    onChange={(e) => setRegisterForm({ ...registerForm, company: e.target.value })}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    label="Address"
                                    value={registerForm.address}
                                    onChange={(e) => setRegisterForm({ ...registerForm, address: e.target.value })}
                                />
                            </Grid>
                            <Grid item xs={6}>
                                <TextField
                                    fullWidth
                                    label="City"
                                    value={registerForm.city}
                                    onChange={(e) => setRegisterForm({ ...registerForm, city: e.target.value })}
                                />
                            </Grid>
                            <Grid item xs={3}>
                                <TextField
                                    fullWidth
                                    label="State"
                                    value={registerForm.state}
                                    onChange={(e) => setRegisterForm({ ...registerForm, state: e.target.value })}
                                />
                            </Grid>
                            <Grid item xs={3}>
                                <TextField
                                    fullWidth
                                    label="ZIP Code"
                                    value={registerForm.zipCode}
                                    onChange={(e) => setRegisterForm({ ...registerForm, zipCode: e.target.value })}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    label="Password"
                                    type={showPassword ? 'text' : 'password'}
                                    value={registerForm.password}
                                    onChange={(e) => setRegisterForm({ ...registerForm, password: e.target.value })}
                                    required
                                    InputProps={{
                                        endAdornment: (
                                            <IconButton
                                                onClick={() => setShowPassword(!showPassword)}
                                                edge="end"
                                            >
                                                {showPassword ? <VisibilityOff /> : <Visibility />}
                                            </IconButton>
                                        )
                                    }}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    label="Confirm Password"
                                    type={showPassword ? 'text' : 'password'}
                                    value={registerForm.confirmPassword}
                                    onChange={(e) => setRegisterForm({ ...registerForm, confirmPassword: e.target.value })}
                                    required
                                />
                            </Grid>
                        </Grid>

                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            sx={{ mt: 3, mb: 2 }}
                            disabled={loading}
                        >
                            {loading ? 'Creating Account...' : 'Create Account'}
                        </Button>
                    </Box>
                )}
            </DialogContent>
        </Dialog>
    );
};

export default UserAuth; 