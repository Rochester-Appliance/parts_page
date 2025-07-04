import React, { useState } from 'react';
import {
    Box,
    Card,
    CardContent,
    Typography,
    Button,
    Grid,
    List,
    ListItem,
    ListItemText,
    ListItemSecondaryAction,
    IconButton,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Chip,
    Alert,
    Avatar,
    Divider,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Switch,
    FormControlLabel,
    Tooltip,
    Badge,
} from '@mui/material';
import {
    AccountTree as HierarchyIcon,
    Add as AddIcon,
    Edit as EditIcon,
    Delete as DeleteIcon,
    Business as BusinessIcon,
    LocationOn as LocationIcon,
    Phone as PhoneIcon,
    Email as EmailIcon,
    Person as PersonIcon,
    Settings as SettingsIcon,
    SwapHoriz as SwitchIcon,
    AttachMoney as MoneyIcon,
    Receipt as TaxIcon,
    CreditCard as PaymentIcon,
} from '@mui/icons-material';
import { useCart } from '../contexts/CartContext';

const HierarchicalAccountManager = () => {
    const {
        user,
        accountType,
        childAccounts,
        addChildAccount,
        switchToChildAccount,
        globalSettings
    } = useCart();

    const [showAddDialog, setShowAddDialog] = useState(false);
    const [selectedChild, setSelectedChild] = useState(null);
    const [currentAccountId, setCurrentAccountId] = useState('parent');

    const [childForm, setChildForm] = useState({
        name: '',
        location: '',
        manager: '',
        managerEmail: '',
        managerPhone: '',
        address: '',
        city: '',
        state: '',
        zipCode: '',
        budget: '',
        taxExempt: false
    });

    const handleAddChild = () => {
        if (!childForm.name || !childForm.location || !childForm.manager) {
            alert('Please fill in all required fields');
            return;
        }

        addChildAccount({
            ...childForm,
            type: 'property',
            status: 'active'
        });

        // Reset form
        setChildForm({
            name: '',
            location: '',
            manager: '',
            managerEmail: '',
            managerPhone: '',
            address: '',
            city: '',
            state: '',
            zipCode: '',
            budget: '',
            taxExempt: false
        });

        setShowAddDialog(false);
    };

    const handleSwitchAccount = (accountId) => {
        if (accountId === 'parent') {
            // Switch back to parent account
            setCurrentAccountId('parent');
            // In real implementation, would clear child-specific data
        } else {
            switchToChildAccount(accountId);
            setCurrentAccountId(accountId);
        }
    };

    const getAccountStats = () => {
        return {
            totalChildren: childAccounts.length,
            totalBudget: childAccounts.reduce((sum, child) => sum + (parseFloat(child.budget) || 0), 0),
            activeAccounts: childAccounts.filter(child => child.status === 'active').length
        };
    };

    const stats = getAccountStats();

    // Only show for parent accounts
    if (accountType !== 'parent') {
        return null;
    }

    return (
        <Box>
            {/* Header */}
            <Card sx={{ mb: 3 }}>
                <CardContent>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                        <Typography variant="h5" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <HierarchyIcon color="primary" />
                            Account Management
                        </Typography>
                        <Button
                            variant="contained"
                            startIcon={<AddIcon />}
                            onClick={() => setShowAddDialog(true)}
                        >
                            Add Child Account
                        </Button>
                    </Box>

                    {/* Account Stats */}
                    <Grid container spacing={2}>
                        <Grid item xs={12} md={4}>
                            <Box sx={{ textAlign: 'center' }}>
                                <Typography variant="h3" color="primary">
                                    {stats.totalChildren}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    Child Accounts
                                </Typography>
                            </Box>
                        </Grid>
                        <Grid item xs={12} md={4}>
                            <Box sx={{ textAlign: 'center' }}>
                                <Typography variant="h3" color="success.main">
                                    ${stats.totalBudget.toFixed(2)}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    Total Monthly Budget
                                </Typography>
                            </Box>
                        </Grid>
                        <Grid item xs={12} md={4}>
                            <Box sx={{ textAlign: 'center' }}>
                                <Typography variant="h3" color="info.main">
                                    {stats.activeAccounts}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    Active Accounts
                                </Typography>
                            </Box>
                        </Grid>
                    </Grid>
                </CardContent>
            </Card>

            {/* Current Account Indicator */}
            <Alert severity="info" sx={{ mb: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Typography>
                        Currently viewing: <strong>{currentAccountId === 'parent' ? 'Parent Account' : `Child Account - ${childAccounts.find(c => c.id === currentAccountId)?.name}`}</strong>
                    </Typography>
                    {currentAccountId !== 'parent' && (
                        <Button
                            size="small"
                            startIcon={<SwitchIcon />}
                            onClick={() => handleSwitchAccount('parent')}
                        >
                            Switch to Parent
                        </Button>
                    )}
                </Box>
            </Alert>

            {/* Global Settings */}
            <Card sx={{ mb: 3 }}>
                <CardContent>
                    <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <SettingsIcon color="primary" />
                        Global Settings (Inherited by All Child Accounts)
                    </Typography>
                    <Grid container spacing={2} sx={{ mt: 1 }}>
                        <Grid item xs={12} md={4}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <PaymentIcon color="action" />
                                <Box>
                                    <Typography variant="body2" color="text.secondary">
                                        Payment Method
                                    </Typography>
                                    <Typography variant="body1">
                                        {globalSettings?.paymentMethod || 'Net 30 Terms'}
                                    </Typography>
                                </Box>
                            </Box>
                        </Grid>
                        <Grid item xs={12} md={4}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <TaxIcon color="action" />
                                <Box>
                                    <Typography variant="body2" color="text.secondary">
                                        Tax Status
                                    </Typography>
                                    <Typography variant="body1">
                                        {globalSettings?.taxExempt ? 'Tax Exempt' : 'Standard Tax'}
                                    </Typography>
                                </Box>
                            </Box>
                        </Grid>
                        <Grid item xs={12} md={4}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <MoneyIcon color="action" />
                                <Box>
                                    <Typography variant="body2" color="text.secondary">
                                        Price List
                                    </Typography>
                                    <Typography variant="body1">
                                        Negotiated Corporate Rates
                                    </Typography>
                                </Box>
                            </Box>
                        </Grid>
                    </Grid>
                </CardContent>
            </Card>

            {/* Child Accounts List */}
            <Card>
                <CardContent>
                    <Typography variant="h6" gutterBottom>
                        Child Accounts ({childAccounts.length})
                    </Typography>

                    {childAccounts.length === 0 ? (
                        <Box sx={{ textAlign: 'center', py: 4 }}>
                            <BusinessIcon sx={{ fontSize: 60, color: 'text.secondary', mb: 2 }} />
                            <Typography variant="h6" color="text.secondary">
                                No Child Accounts Yet
                            </Typography>
                            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                                Create property-level sub-accounts to track spending separately
                            </Typography>
                            <Button
                                variant="outlined"
                                startIcon={<AddIcon />}
                                onClick={() => setShowAddDialog(true)}
                            >
                                Create First Child Account
                            </Button>
                        </Box>
                    ) : (
                        <List>
                            {childAccounts.map((child, index) => (
                                <React.Fragment key={child.id}>
                                    <ListItem>
                                        <Avatar sx={{ bgcolor: 'primary.main', mr: 2 }}>
                                            {child.name.charAt(0)}
                                        </Avatar>
                                        <ListItemText
                                            primary={
                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                    <Typography variant="subtitle1">
                                                        {child.name}
                                                    </Typography>
                                                    <Chip
                                                        label={child.location}
                                                        size="small"
                                                        variant="outlined"
                                                    />
                                                    {child.status === 'active' ? (
                                                        <Chip label="Active" size="small" color="success" />
                                                    ) : (
                                                        <Chip label="Inactive" size="small" color="default" />
                                                    )}
                                                </Box>
                                            }
                                            secondary={
                                                <Box>
                                                    <Typography variant="body2" color="text.secondary">
                                                        Manager: {child.manager} • {child.managerEmail}
                                                    </Typography>
                                                    <Typography variant="body2" color="text.secondary">
                                                        Budget: ${child.budget || '0'}/month •
                                                        Address: {child.address}, {child.city}, {child.state} {child.zipCode}
                                                    </Typography>
                                                </Box>
                                            }
                                        />
                                        <ListItemSecondaryAction>
                                            <Tooltip title="Switch to this account">
                                                <IconButton
                                                    onClick={() => handleSwitchAccount(child.id)}
                                                    color="primary"
                                                >
                                                    <SwitchIcon />
                                                </IconButton>
                                            </Tooltip>
                                            <Tooltip title="Edit account">
                                                <IconButton onClick={() => setSelectedChild(child)}>
                                                    <EditIcon />
                                                </IconButton>
                                            </Tooltip>
                                        </ListItemSecondaryAction>
                                    </ListItem>
                                    {index < childAccounts.length - 1 && <Divider />}
                                </React.Fragment>
                            ))}
                        </List>
                    )}
                </CardContent>
            </Card>

            {/* Add Child Account Dialog */}
            <Dialog open={showAddDialog} onClose={() => setShowAddDialog(false)} maxWidth="md" fullWidth>
                <DialogTitle>
                    Add Child Account
                </DialogTitle>
                <DialogContent>
                    <Alert severity="info" sx={{ mb: 2 }}>
                        Child accounts inherit payment terms, tax status, and negotiated pricing from the parent account.
                        Each child maintains its own cart, budget, and shipping address.
                    </Alert>

                    <Grid container spacing={2} sx={{ mt: 1 }}>
                        <Grid item xs={12} md={6}>
                            <TextField
                                fullWidth
                                required
                                label="Property/Location Name"
                                value={childForm.name}
                                onChange={(e) => setChildForm({ ...childForm, name: e.target.value })}
                                placeholder="e.g., Downtown Office"
                            />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <TextField
                                fullWidth
                                required
                                label="Location Identifier"
                                value={childForm.location}
                                onChange={(e) => setChildForm({ ...childForm, location: e.target.value })}
                                placeholder="e.g., Building A"
                            />
                        </Grid>

                        <Grid item xs={12}>
                            <Typography variant="subtitle2" sx={{ mb: 1 }}>
                                Property Manager Information
                            </Typography>
                        </Grid>

                        <Grid item xs={12} md={4}>
                            <TextField
                                fullWidth
                                required
                                label="Manager Name"
                                value={childForm.manager}
                                onChange={(e) => setChildForm({ ...childForm, manager: e.target.value })}
                                InputProps={{
                                    startAdornment: <PersonIcon sx={{ mr: 1, color: 'action.active' }} />
                                }}
                            />
                        </Grid>
                        <Grid item xs={12} md={4}>
                            <TextField
                                fullWidth
                                label="Manager Email"
                                type="email"
                                value={childForm.managerEmail}
                                onChange={(e) => setChildForm({ ...childForm, managerEmail: e.target.value })}
                                InputProps={{
                                    startAdornment: <EmailIcon sx={{ mr: 1, color: 'action.active' }} />
                                }}
                            />
                        </Grid>
                        <Grid item xs={12} md={4}>
                            <TextField
                                fullWidth
                                label="Manager Phone"
                                value={childForm.managerPhone}
                                onChange={(e) => setChildForm({ ...childForm, managerPhone: e.target.value })}
                                InputProps={{
                                    startAdornment: <PhoneIcon sx={{ mr: 1, color: 'action.active' }} />
                                }}
                            />
                        </Grid>

                        <Grid item xs={12}>
                            <Typography variant="subtitle2" sx={{ mb: 1, mt: 1 }}>
                                Shipping Address
                            </Typography>
                        </Grid>

                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Street Address"
                                value={childForm.address}
                                onChange={(e) => setChildForm({ ...childForm, address: e.target.value })}
                                InputProps={{
                                    startAdornment: <LocationIcon sx={{ mr: 1, color: 'action.active' }} />
                                }}
                            />
                        </Grid>
                        <Grid item xs={12} md={5}>
                            <TextField
                                fullWidth
                                label="City"
                                value={childForm.city}
                                onChange={(e) => setChildForm({ ...childForm, city: e.target.value })}
                            />
                        </Grid>
                        <Grid item xs={12} md={3}>
                            <TextField
                                fullWidth
                                label="State"
                                value={childForm.state}
                                onChange={(e) => setChildForm({ ...childForm, state: e.target.value })}
                                inputProps={{ maxLength: 2 }}
                            />
                        </Grid>
                        <Grid item xs={12} md={4}>
                            <TextField
                                fullWidth
                                label="ZIP Code"
                                value={childForm.zipCode}
                                onChange={(e) => setChildForm({ ...childForm, zipCode: e.target.value })}
                            />
                        </Grid>

                        <Grid item xs={12}>
                            <Typography variant="subtitle2" sx={{ mb: 1, mt: 1 }}>
                                Budget & Settings
                            </Typography>
                        </Grid>

                        <Grid item xs={12} md={6}>
                            <TextField
                                fullWidth
                                label="Monthly Budget"
                                type="number"
                                value={childForm.budget}
                                onChange={(e) => setChildForm({ ...childForm, budget: e.target.value })}
                                InputProps={{
                                    startAdornment: <MoneyIcon sx={{ mr: 1, color: 'action.active' }} />
                                }}
                                helperText="Optional spending limit for this location"
                            />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <FormControlLabel
                                control={
                                    <Switch
                                        checked={childForm.taxExempt}
                                        onChange={(e) => setChildForm({ ...childForm, taxExempt: e.target.checked })}
                                    />
                                }
                                label="Override Tax Exempt Status"
                            />
                        </Grid>
                    </Grid>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setShowAddDialog(false)}>
                        Cancel
                    </Button>
                    <Button
                        variant="contained"
                        onClick={handleAddChild}
                        startIcon={<AddIcon />}
                    >
                        Create Child Account
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default HierarchicalAccountManager; 