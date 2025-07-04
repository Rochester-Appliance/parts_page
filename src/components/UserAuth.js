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
    Card,
    CardContent,
    List,
    ListItem,
    ListItemText,
    ListItemSecondaryAction,
    Accordion,
    AccordionSummary,
    AccordionDetails,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Switch,
    FormControlLabel,
    Tooltip,
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
    Security as SecurityIcon,
    AccountCircle as AccountIcon,
    Google as GoogleIcon,
    Add as AddIcon,
    Delete as DeleteIcon,
    ExpandMore as ExpandMoreIcon,
    AdminPanelSettings as AdminIcon,
    CheckCircle as ApprovedIcon,
    Schedule as PendingIcon,
    Cancel as DeniedIcon,
    Group as GroupIcon,
    Domain as DomainIcon,
    Gavel as ApprovalIcon,
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
        companyWebsite: '',
        businessType: '',
        address: '',
        city: '',
        state: '',
        zipCode: '',
        additionalUsers: [],
        requestReason: '',
        expectedVolume: ''
    });

    const [approvalStatus, setApprovalStatus] = useState(null); // 'pending', 'approved', 'denied'
    const [showGoogleAuth, setShowGoogleAuth] = useState(false);

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
                // Demo: Set parent account type for specific emails
                const isParentAccount = loginForm.email.includes('admin') ||
                    loginForm.email.includes('manager') ||
                    loginForm.email.includes('parent');

                const userData = {
                    id: Date.now(),
                    name: `${loginForm.email.split('@')[0]}`,
                    email: loginForm.email,
                    company: isParentAccount ? 'Demo Property Management Co.' : 'Rochester Appliance',
                    joinDate: new Date().toISOString(),
                    accountType: isParentAccount ? 'parent' : 'standard',
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
            // Mandatory field validation
            const requiredFields = [
                { field: 'email', label: 'Email address' },
                { field: 'password', label: 'Password' },
                { field: 'company', label: 'Company name' },
                { field: 'phone', label: 'Contact phone number' },
                { field: 'address', label: 'Primary shipping address' },
                { field: 'city', label: 'City' },
                { field: 'state', label: 'State' },
                { field: 'zipCode', label: 'ZIP code' },
                { field: 'businessType', label: 'Business type' },
                { field: 'requestReason', label: 'Request reason' }
            ];

            // Check for missing required fields
            const missingFields = requiredFields.filter(({ field }) => !registerForm[field]?.trim());
            if (missingFields.length > 0) {
                setError(`Please fill in all required fields: ${missingFields.map(f => f.label).join(', ')}`);
                setLoading(false);
                return;
            }

            // Email validation
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(registerForm.email)) {
                setError('Please enter a valid email address');
                setLoading(false);
                return;
            }

            // Phone validation (basic US phone number format)
            const phoneRegex = /^[\+]?[1-9]?[\W]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4}$/;
            if (!phoneRegex.test(registerForm.phone.replace(/\s/g, ''))) {
                setError('Please enter a valid phone number (e.g., (555) 123-4567)');
                setLoading(false);
                return;
            }

            // Password validation
            if (registerForm.password.length < 8) {
                setError('Password must be at least 8 characters long');
                setLoading(false);
                return;
            }

            if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(registerForm.password)) {
                setError('Password must contain at least one uppercase letter, one lowercase letter, and one number');
                setLoading(false);
                return;
            }

            if (registerForm.password !== registerForm.confirmPassword) {
                setError('Passwords do not match');
                setLoading(false);
                return;
            }

            // ZIP code validation (US format)
            const zipRegex = /^\d{5}(-\d{4})?$/;
            if (!zipRegex.test(registerForm.zipCode)) {
                setError('Please enter a valid ZIP code (e.g., 12345 or 12345-6789)');
                setLoading(false);
                return;
            }

            // Website validation if provided
            if (registerForm.companyWebsite && !/^https?:\/\/.+\..+/.test(registerForm.companyWebsite)) {
                setError('Please enter a valid website URL (e.g., https://company.com)');
                setLoading(false);
                return;
            }

            // Simulate API call for registration
            await new Promise(resolve => setTimeout(resolve, 1500));

            // Check if domain is on allowlist (simulate)
            const emailDomain = registerForm.email.split('@')[1].toLowerCase();
            const allowedDomains = ['rochester.edu', 'rit.edu', 'localcompany.com', 'trustedpartner.com']; // Demo allowlist
            const isAutoApproved = allowedDomains.includes(emailDomain);

            if (isAutoApproved) {
                // Auto-approved domains
                // Determine account type based on business type and expected volume
                const accountType = (registerForm.businessType === 'property_management' ||
                    registerForm.businessType === 'enterprise' ||
                    parseInt(registerForm.expectedVolume) >= 50) ? 'parent' : 'standard';

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
                    status: 'approved',
                    joinDate: new Date().toISOString(),
                    additionalUsers: registerForm.additionalUsers,
                    accountType: accountType
                };

                setUser(userData);
                setApprovalStatus('approved');
                onClose();
            } else {
                // Requires admin approval
                setApprovalStatus('pending');
                // Don't close modal, show pending state
            }


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

    const handleGoogleAuth = async () => {
        setLoading(true);
        try {
            // Simulate Google OAuth flow
            await new Promise(resolve => setTimeout(resolve, 2000));

            // Simulate Google user data
            const googleUser = {
                email: 'user@gmail.com',
                name: 'Google User',
                picture: 'https://via.placeholder.com/150'
            };

            // Pre-fill form with Google data
            setRegisterForm(prev => ({
                ...prev,
                email: googleUser.email,
                firstName: googleUser.name.split(' ')[0],
                lastName: googleUser.name.split(' ')[1] || ''
            }));

            setShowGoogleAuth(true);
            alert('Google account connected! Please complete the remaining required fields.');
        } catch (error) {
            setError('Google sign-in failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const addAdditionalUser = () => {
        const newUser = {
            id: Date.now(),
            email: '',
            firstName: '',
            lastName: '',
            role: '',
            location: '',
            phone: ''
        };
        setRegisterForm(prev => ({
            ...prev,
            additionalUsers: [...prev.additionalUsers, newUser]
        }));
    };

    const updateAdditionalUser = (userId, field, value) => {
        setRegisterForm(prev => ({
            ...prev,
            additionalUsers: prev.additionalUsers.map(user =>
                user.id === userId ? { ...user, [field]: value } : user
            )
        }));
    };

    const removeAdditionalUser = (userId) => {
        setRegisterForm(prev => ({
            ...prev,
            additionalUsers: prev.additionalUsers.filter(user => user.id !== userId)
        }));
    };

    const getApprovalStatusDisplay = () => {
        switch (approvalStatus) {
            case 'pending':
                return {
                    icon: <PendingIcon color="warning" />,
                    color: 'warning',
                    title: 'Registration Submitted - Pending Approval',
                    message: 'Your account registration has been submitted for review. An administrator will review your request and send approval confirmation via email within 1-2 business days.'
                };
            case 'approved':
                return {
                    icon: <ApprovedIcon color="success" />,
                    color: 'success',
                    title: 'Account Approved - Welcome!',
                    message: 'Your account has been approved and activated. You can now access all features.'
                };
            case 'denied':
                return {
                    icon: <DeniedIcon color="error" />,
                    color: 'error',
                    title: 'Registration Denied',
                    message: 'Unfortunately, your account request has been denied. Please contact support for more information.'
                };
            default:
                return null;
        }
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
                        <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center', mt: 1 }}>
                            <Chip
                                label={user.accountType === 'parent' ? 'Parent Account' : 'Customer'}
                                color={user.accountType === 'parent' ? 'secondary' : 'primary'}
                                size="small"
                            />
                            {user.accountType === 'parent' && (
                                <Chip
                                    label="Multi-Property"
                                    variant="outlined"
                                    size="small"
                                />
                            )}
                        </Box>
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
                    <Box>
                        {/* Show approval status if submitted */}
                        {approvalStatus && (
                            <Card sx={{ mb: 3 }}>
                                <CardContent>
                                    {(() => {
                                        const status = getApprovalStatusDisplay();
                                        return (
                                            <Box sx={{ textAlign: 'center' }}>
                                                <Box sx={{ mb: 2 }}>
                                                    {status.icon}
                                                </Box>
                                                <Typography variant="h6" gutterBottom>
                                                    {status.title}
                                                </Typography>
                                                <Typography variant="body2" color="text.secondary">
                                                    {status.message}
                                                </Typography>

                                                {approvalStatus === 'pending' && (
                                                    <Alert severity="info" sx={{ mt: 2 }}>
                                                        <Typography variant="body2">
                                                            <strong>What's Next?</strong>
                                                            <br />• You'll receive an email confirmation shortly
                                                            <br />• Our admin team will review your application
                                                            <br />• Approval notifications are sent manually
                                                            <br />• Check your email in 1-2 business days
                                                        </Typography>
                                                    </Alert>
                                                )}

                                                <Box sx={{ mt: 2 }}>
                                                    <Button
                                                        onClick={() => setApprovalStatus(null)}
                                                        variant="outlined"
                                                        sx={{ mr: 1 }}
                                                    >
                                                        Submit Another Request
                                                    </Button>
                                                    <Button onClick={onClose} variant="contained">
                                                        Close
                                                    </Button>
                                                </Box>
                                            </Box>
                                        );
                                    })()}
                                </CardContent>
                            </Card>
                        )}

                        {!approvalStatus && (
                            <Box component="form" onSubmit={handleRegisterSubmit}>
                                {/* Header Information */}
                                <Alert severity="info" sx={{ mb: 2 }}>
                                    <Typography variant="body2">
                                        <strong>Business Account Registration:</strong> This is a closed platform for approved business partners.
                                        Registration requires administrator approval unless your email domain is pre-approved.
                                    </Typography>
                                </Alert>

                                {/* Google OAuth Section */}
                                <Card variant="outlined" sx={{ mb: 3 }}>
                                    <CardContent>
                                        <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                            <GoogleIcon color="primary" />
                                            Quick Sign-Up with Google
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary" gutterBottom>
                                            Connect your Google account to auto-fill basic information
                                        </Typography>
                                        <Button
                                            variant="outlined"
                                            startIcon={<GoogleIcon />}
                                            onClick={handleGoogleAuth}
                                            disabled={loading}
                                            sx={{ mt: 1 }}
                                        >
                                            {showGoogleAuth ? 'Google Account Connected' : 'Continue with Google'}
                                        </Button>
                                        {showGoogleAuth && (
                                            <Chip
                                                label="Google account connected"
                                                color="success"
                                                size="small"
                                                sx={{ ml: 2 }}
                                            />
                                        )}
                                    </CardContent>
                                </Card>

                                <Grid container spacing={2}>
                                    <Grid item xs={12}>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                                            <AccountIcon color="action" />
                                            <Typography variant="subtitle2" color="text.secondary">
                                                Personal Information (Optional)
                                            </Typography>
                                        </Box>
                                    </Grid>
                                    <Grid item xs={6}>
                                        <TextField
                                            fullWidth
                                            label="First Name"
                                            value={registerForm.firstName}
                                            onChange={(e) => setRegisterForm({ ...registerForm, firstName: e.target.value })}
                                            helperText="Optional for personalized experience"
                                        />
                                    </Grid>
                                    <Grid item xs={6}>
                                        <TextField
                                            fullWidth
                                            label="Last Name"
                                            value={registerForm.lastName}
                                            onChange={(e) => setRegisterForm({ ...registerForm, lastName: e.target.value })}
                                            helperText="Optional for personalized experience"
                                        />
                                    </Grid>

                                    {/* Mandatory Fields Section */}
                                    <Grid item xs={12}>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1, mt: 1 }}>
                                            <SecurityIcon color="primary" />
                                            <Typography variant="subtitle2" sx={{ color: 'primary.main' }}>
                                                Account Security & Contact
                                            </Typography>
                                        </Box>
                                    </Grid>

                                    <Grid item xs={12}>
                                        <TextField
                                            fullWidth
                                            label="Email Address *"
                                            type="email"
                                            value={registerForm.email}
                                            onChange={(e) => setRegisterForm({ ...registerForm, email: e.target.value })}
                                            required
                                            error={registerForm.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(registerForm.email)}
                                            helperText={registerForm.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(registerForm.email) ? "Please enter a valid email address" : ""}
                                            InputProps={{
                                                startAdornment: <EmailIcon sx={{ mr: 1, color: 'action.active' }} />
                                            }}
                                        />
                                    </Grid>

                                    <Grid item xs={12}>
                                        <TextField
                                            fullWidth
                                            label="Password *"
                                            type={showPassword ? 'text' : 'password'}
                                            value={registerForm.password}
                                            onChange={(e) => setRegisterForm({ ...registerForm, password: e.target.value })}
                                            required
                                            error={registerForm.password && (registerForm.password.length < 8 || !/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(registerForm.password))}
                                            helperText={
                                                registerForm.password && registerForm.password.length < 8
                                                    ? "Password must be at least 8 characters"
                                                    : registerForm.password && !/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(registerForm.password)
                                                        ? "Password must contain uppercase, lowercase, and number"
                                                        : "Minimum 8 characters with uppercase, lowercase, and number"
                                            }
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
                                            label="Confirm Password *"
                                            type={showPassword ? 'text' : 'password'}
                                            value={registerForm.confirmPassword}
                                            onChange={(e) => setRegisterForm({ ...registerForm, confirmPassword: e.target.value })}
                                            required
                                            error={registerForm.confirmPassword && registerForm.password !== registerForm.confirmPassword}
                                            helperText={registerForm.confirmPassword && registerForm.password !== registerForm.confirmPassword ? "Passwords do not match" : ""}
                                        />
                                    </Grid>

                                    <Grid item xs={12}>
                                        <TextField
                                            fullWidth
                                            label="Company Name *"
                                            value={registerForm.company}
                                            onChange={(e) => setRegisterForm({ ...registerForm, company: e.target.value })}
                                            required
                                            InputProps={{
                                                startAdornment: <BusinessIcon sx={{ mr: 1, color: 'action.active' }} />
                                            }}
                                            helperText="Enter your business or organization name"
                                        />
                                    </Grid>

                                    <Grid item xs={12}>
                                        <TextField
                                            fullWidth
                                            label="Contact Phone Number *"
                                            value={registerForm.phone}
                                            onChange={(e) => setRegisterForm({ ...registerForm, phone: e.target.value })}
                                            required
                                            placeholder="(555) 123-4567"
                                            error={registerForm.phone && !/^[\+]?[1-9]?[\W]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4}$/.test(registerForm.phone.replace(/\s/g, ''))}
                                            helperText={
                                                registerForm.phone && !/^[\+]?[1-9]?[\W]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4}$/.test(registerForm.phone.replace(/\s/g, ''))
                                                    ? "Please enter a valid phone number"
                                                    : "Primary contact number for order updates"
                                            }
                                            InputProps={{
                                                startAdornment: <PhoneIcon sx={{ mr: 1, color: 'action.active' }} />
                                            }}
                                        />
                                    </Grid>

                                    {/* Primary Shipping Address Section */}
                                    <Grid item xs={12}>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1, mt: 2 }}>
                                            <LocationIcon color="primary" />
                                            <Typography variant="subtitle2" sx={{ color: 'primary.main' }}>
                                                Primary Shipping Address *
                                            </Typography>
                                        </Box>
                                        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                                            This will be your default delivery address for orders and parts shipments.
                                        </Typography>
                                    </Grid>

                                    <Grid item xs={12}>
                                        <TextField
                                            fullWidth
                                            label="Street Address *"
                                            value={registerForm.address}
                                            onChange={(e) => setRegisterForm({ ...registerForm, address: e.target.value })}
                                            required
                                            placeholder="123 Main Street, Suite 100"
                                            InputProps={{
                                                startAdornment: <LocationIcon sx={{ mr: 1, color: 'action.active' }} />
                                            }}
                                        />
                                    </Grid>

                                    <Grid item xs={6}>
                                        <TextField
                                            fullWidth
                                            label="City *"
                                            value={registerForm.city}
                                            onChange={(e) => setRegisterForm({ ...registerForm, city: e.target.value })}
                                            required
                                        />
                                    </Grid>

                                    <Grid item xs={3}>
                                        <TextField
                                            fullWidth
                                            label="State *"
                                            value={registerForm.state}
                                            onChange={(e) => setRegisterForm({ ...registerForm, state: e.target.value })}
                                            required
                                            placeholder="NY"
                                            inputProps={{ maxLength: 2, style: { textTransform: 'uppercase' } }}
                                        />
                                    </Grid>

                                    <Grid item xs={3}>
                                        <TextField
                                            fullWidth
                                            label="ZIP Code *"
                                            value={registerForm.zipCode}
                                            onChange={(e) => setRegisterForm({ ...registerForm, zipCode: e.target.value })}
                                            required
                                            placeholder="12345"
                                            error={registerForm.zipCode && !/^\d{5}(-\d{4})?$/.test(registerForm.zipCode)}
                                            helperText={registerForm.zipCode && !/^\d{5}(-\d{4})?$/.test(registerForm.zipCode) ? "Invalid ZIP code" : ""}
                                        />
                                    </Grid>
                                    {/* Business Details Section */}
                                    <Grid item xs={12}>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1, mt: 2 }}>
                                            <BusinessIcon color="primary" />
                                            <Typography variant="subtitle2" sx={{ color: 'primary.main' }}>
                                                Business Information *
                                            </Typography>
                                        </Box>
                                    </Grid>

                                    <Grid item xs={6}>
                                        <FormControl fullWidth required>
                                            <InputLabel>Business Type *</InputLabel>
                                            <Select
                                                value={registerForm.businessType}
                                                label="Business Type *"
                                                onChange={(e) => setRegisterForm({ ...registerForm, businessType: e.target.value })}
                                            >
                                                <MenuItem value="manufacturer">Manufacturer</MenuItem>
                                                <MenuItem value="distributor">Distributor</MenuItem>
                                                <MenuItem value="retailer">Retailer</MenuItem>
                                                <MenuItem value="service_provider">Service Provider</MenuItem>
                                                <MenuItem value="repair_shop">Repair Shop</MenuItem>
                                                <MenuItem value="institutional">Institutional</MenuItem>
                                                <MenuItem value="other">Other</MenuItem>
                                            </Select>
                                        </FormControl>
                                    </Grid>

                                    <Grid item xs={6}>
                                        <TextField
                                            fullWidth
                                            label="Company Website"
                                            value={registerForm.companyWebsite}
                                            onChange={(e) => setRegisterForm({ ...registerForm, companyWebsite: e.target.value })}
                                            placeholder="https://company.com"
                                            helperText="Optional - helps with domain verification"
                                        />
                                    </Grid>

                                    <Grid item xs={6}>
                                        <FormControl fullWidth required>
                                            <InputLabel>Expected Monthly Volume *</InputLabel>
                                            <Select
                                                value={registerForm.expectedVolume}
                                                label="Expected Monthly Volume *"
                                                onChange={(e) => setRegisterForm({ ...registerForm, expectedVolume: e.target.value })}
                                            >
                                                <MenuItem value="low">Low (1-10 orders)</MenuItem>
                                                <MenuItem value="medium">Medium (11-50 orders)</MenuItem>
                                                <MenuItem value="high">High (51-200 orders)</MenuItem>
                                                <MenuItem value="enterprise">Enterprise (200+ orders)</MenuItem>
                                            </Select>
                                        </FormControl>
                                    </Grid>

                                    <Grid item xs={6}>
                                        <TextField
                                            fullWidth
                                            label="Registration Request Reason *"
                                            value={registerForm.requestReason}
                                            onChange={(e) => setRegisterForm({ ...registerForm, requestReason: e.target.value })}
                                            required
                                            multiline
                                            rows={2}
                                            placeholder="Brief description of your business needs"
                                            helperText="Required for approval review"
                                        />
                                    </Grid>

                                    {/* Additional Users Section */}
                                    <Grid item xs={12}>
                                        <Divider sx={{ my: 2 }} />
                                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                <GroupIcon color="primary" />
                                                <Typography variant="subtitle2" sx={{ color: 'primary.main' }}>
                                                    Additional Team Members (Optional)
                                                </Typography>
                                            </Box>
                                            <Button
                                                variant="outlined"
                                                startIcon={<AddIcon />}
                                                onClick={addAdditionalUser}
                                                size="small"
                                            >
                                                Add User
                                            </Button>
                                        </Box>
                                        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                                            Add managers or employees who will need access to this account.
                                        </Typography>

                                        {registerForm.additionalUsers.map((user, index) => (
                                            <Card key={user.id} variant="outlined" sx={{ mb: 2 }}>
                                                <CardContent>
                                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                                                        <Typography variant="subtitle2">
                                                            Additional User #{index + 1}
                                                        </Typography>
                                                        <IconButton
                                                            onClick={() => removeAdditionalUser(user.id)}
                                                            size="small"
                                                            color="error"
                                                        >
                                                            <DeleteIcon />
                                                        </IconButton>
                                                    </Box>
                                                    <Grid container spacing={2}>
                                                        <Grid item xs={6}>
                                                            <TextField
                                                                fullWidth
                                                                label="First Name"
                                                                value={user.firstName}
                                                                onChange={(e) => updateAdditionalUser(user.id, 'firstName', e.target.value)}
                                                                size="small"
                                                            />
                                                        </Grid>
                                                        <Grid item xs={6}>
                                                            <TextField
                                                                fullWidth
                                                                label="Last Name"
                                                                value={user.lastName}
                                                                onChange={(e) => updateAdditionalUser(user.id, 'lastName', e.target.value)}
                                                                size="small"
                                                            />
                                                        </Grid>
                                                        <Grid item xs={6}>
                                                            <TextField
                                                                fullWidth
                                                                label="Email"
                                                                type="email"
                                                                value={user.email}
                                                                onChange={(e) => updateAdditionalUser(user.id, 'email', e.target.value)}
                                                                size="small"
                                                            />
                                                        </Grid>
                                                        <Grid item xs={6}>
                                                            <TextField
                                                                fullWidth
                                                                label="Phone"
                                                                value={user.phone}
                                                                onChange={(e) => updateAdditionalUser(user.id, 'phone', e.target.value)}
                                                                size="small"
                                                            />
                                                        </Grid>
                                                        <Grid item xs={6}>
                                                            <TextField
                                                                fullWidth
                                                                label="Role/Title"
                                                                value={user.role}
                                                                onChange={(e) => updateAdditionalUser(user.id, 'role', e.target.value)}
                                                                size="small"
                                                                placeholder="Manager, Technician, etc."
                                                            />
                                                        </Grid>
                                                        <Grid item xs={6}>
                                                            <TextField
                                                                fullWidth
                                                                label="Location/Branch"
                                                                value={user.location}
                                                                onChange={(e) => updateAdditionalUser(user.id, 'location', e.target.value)}
                                                                size="small"
                                                                placeholder="Main Office, Branch #2, etc."
                                                            />
                                                        </Grid>
                                                    </Grid>
                                                </CardContent>
                                            </Card>
                                        ))}
                                    </Grid>

                                    {/* Domain Allowlist Notice */}
                                    <Grid item xs={12}>
                                        <Alert severity="info" sx={{ mt: 2 }}>
                                            <Typography variant="body2">
                                                <strong><DomainIcon sx={{ mr: 1, verticalAlign: 'middle' }} />Auto-Approval Domains:</strong>
                                                <br />• @rochester.edu, @rit.edu, @localcompany.com, @trustedpartner.com
                                                <br />• Other domains require manual admin approval (1-2 business days)
                                                <br />• You'll receive email confirmation once your account is reviewed
                                            </Typography>
                                        </Alert>
                                    </Grid>
                                </Grid>

                                <Button
                                    type="submit"
                                    fullWidth
                                    variant="contained"
                                    sx={{ mt: 3, mb: 2 }}
                                    disabled={loading}
                                    size="large"
                                >
                                    {loading ? 'Submitting Registration...' : 'Submit Registration Request'}
                                </Button>

                                <Typography variant="body2" color="text.secondary" align="center" sx={{ mt: 2 }}>
                                    By creating an account, you agree to our Terms of Service and Privacy Policy.
                                    All information will be used solely for order processing and customer support.
                                </Typography>
                            </Box>
                        )}
                    </Box>
                )}
            </DialogContent>
        </Dialog>
    );
};

export default UserAuth; 