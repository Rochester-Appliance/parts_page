import React, { useState } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Box,
    Typography,
    Avatar,
    Tabs,
    Tab,
    List,
    ListItem,
    ListItemText,
    ListItemAvatar,
    ListItemSecondaryAction,
    Chip,
    Paper,
    Divider,
    Grid,
    IconButton,
    Card,
    CardContent,
} from '@mui/material';
import {
    Timeline,
    TimelineItem,
    TimelineSeparator,
    TimelineConnector,
    TimelineContent,
    TimelineDot,
    TimelineOppositeContent,
} from '@mui/lab';
import {
    Close as CloseIcon,
    Person as PersonIcon,
    ShoppingCart as ShoppingCartIcon,
    History as HistoryIcon,
    Home as HomeIcon,
    Build as BuildIcon,
    LocalShipping as ShippingIcon,
    CheckCircle as CheckCircleIcon,
    Email as EmailIcon,
    Phone as PhoneIcon,
    LocationOn as LocationIcon,
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';

const StyledDialog = styled(Dialog)(({ theme }) => ({
    '& .MuiDialog-paper': {
        borderRadius: theme.spacing(2),
        maxWidth: '900px',
        width: '90%',
        maxHeight: '90vh',
    },
}));

const ProfileHeader = styled(Box)(({ theme }) => ({
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    padding: theme.spacing(4),
    color: 'white',
    position: 'relative',
}));

const TabPanel = ({ children, value, index, ...other }) => {
    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`profile-tabpanel-${index}`}
            aria-labelledby={`profile-tab-${index}`}
            {...other}
        >
            {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
        </div>
    );
};

const ConsumerProfileModal = ({ open, onClose }) => {
    const [tabValue, setTabValue] = useState(0);

    const handleTabChange = (event, newValue) => {
        setTabValue(newValue);
    };

    // Demo consumer data
    const consumerProfile = {
        name: 'John Anderson',
        email: 'john.anderson@email.com',
        phone: '(585) 555-0123',
        address: '123 Park Avenue, Rochester, NY 14607',
        memberSince: '2020',
        loyaltyPoints: 2847,
        preferredBrands: ['Whirlpool', 'LG', 'Samsung'],
        lastPurchase: '2 weeks ago',
    };

    // Demo purchase history
    const purchaseHistory = [
        {
            id: 'PO-2024-001',
            date: '2024-01-15',
            appliance: 'Whirlpool WRF535SWHZ Refrigerator',
            modelNumber: 'WRF535SWHZ',
            price: 1299.00,
            status: 'Delivered',
            warranty: '2 Year Extended',
        },
        {
            id: 'PO-2023-089',
            date: '2023-11-28',
            appliance: 'LG WM4000HWA Washer',
            modelNumber: 'WM4000HWA',
            price: 899.00,
            status: 'Delivered',
            warranty: '1 Year Standard',
        },
        {
            id: 'PO-2023-045',
            date: '2023-07-10',
            appliance: 'Samsung NE63A6511SS Range',
            modelNumber: 'NE63A6511SS',
            price: 749.00,
            status: 'Delivered',
            warranty: '3 Year Extended',
        },
        {
            id: 'PO-2022-112',
            date: '2022-12-05',
            appliance: 'Whirlpool WDT730PAHZ Dishwasher',
            modelNumber: 'WDT730PAHZ',
            price: 649.00,
            status: 'Delivered',
            warranty: '1 Year Standard',
        },
    ];

    // Demo service history
    const serviceHistory = [
        {
            date: '2024-01-20',
            type: 'Installation',
            appliance: 'Whirlpool Refrigerator',
            technician: 'Mike Thompson',
            status: 'Completed',
        },
        {
            date: '2023-12-15',
            type: 'Repair',
            appliance: 'LG Washer',
            issue: 'Door seal replacement',
            technician: 'Sarah Johnson',
            status: 'Completed',
        },
        {
            date: '2023-08-22',
            type: 'Maintenance',
            appliance: 'Samsung Range',
            technician: 'David Lee',
            status: 'Completed',
        },
    ];

    const getStatusColor = (status) => {
        switch (status) {
            case 'Delivered':
            case 'Completed':
                return 'success';
            case 'In Transit':
            case 'In Progress':
                return 'warning';
            case 'Processing':
                return 'info';
            default:
                return 'default';
        }
    };

    return (
        <StyledDialog open={open} onClose={onClose} fullWidth>
            <ProfileHeader>
                <IconButton
                    onClick={onClose}
                    sx={{
                        position: 'absolute',
                        right: 8,
                        top: 8,
                        color: 'white',
                    }}
                >
                    <CloseIcon />
                </IconButton>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                    <Avatar
                        sx={{
                            width: 80,
                            height: 80,
                            bgcolor: 'rgba(255, 255, 255, 0.2)',
                            border: '3px solid rgba(255, 255, 255, 0.4)',
                        }}
                    >
                        <PersonIcon sx={{ fontSize: 40 }} />
                    </Avatar>
                    <Box>
                        <Typography variant="h4" fontWeight="bold">
                            {consumerProfile.name}
                        </Typography>
                        <Typography variant="body1" sx={{ opacity: 0.9 }}>
                            Member since {consumerProfile.memberSince}
                        </Typography>
                        <Chip
                            label={`${consumerProfile.loyaltyPoints} Loyalty Points`}
                            sx={{
                                mt: 1,
                                bgcolor: 'rgba(255, 255, 255, 0.2)',
                                color: 'white',
                            }}
                        />
                    </Box>
                </Box>
            </ProfileHeader>

            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                <Tabs value={tabValue} onChange={handleTabChange} centered>
                    <Tab label="Profile" icon={<PersonIcon />} iconPosition="start" />
                    <Tab label="Purchase History" icon={<ShoppingCartIcon />} iconPosition="start" />
                    <Tab label="Service History" icon={<BuildIcon />} iconPosition="start" />
                </Tabs>
            </Box>

            <TabPanel value={tabValue} index={0}>
                <Grid container spacing={3}>
                    <Grid item xs={12} md={6}>
                        <Card variant="outlined">
                            <CardContent>
                                <Typography variant="h6" gutterBottom color="primary">
                                    Contact Information
                                </Typography>
                                <List dense>
                                    <ListItem>
                                        <ListItemAvatar>
                                            <EmailIcon color="action" />
                                        </ListItemAvatar>
                                        <ListItemText primary={consumerProfile.email} />
                                    </ListItem>
                                    <ListItem>
                                        <ListItemAvatar>
                                            <PhoneIcon color="action" />
                                        </ListItemAvatar>
                                        <ListItemText primary={consumerProfile.phone} />
                                    </ListItem>
                                    <ListItem>
                                        <ListItemAvatar>
                                            <LocationIcon color="action" />
                                        </ListItemAvatar>
                                        <ListItemText primary={consumerProfile.address} />
                                    </ListItem>
                                </List>
                            </CardContent>
                        </Card>
                    </Grid>

                    <Grid item xs={12} md={6}>
                        <Card variant="outlined">
                            <CardContent>
                                <Typography variant="h6" gutterBottom color="primary">
                                    Preferences
                                </Typography>
                                <Typography variant="body2" color="text.secondary" gutterBottom>
                                    Preferred Brands
                                </Typography>
                                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 2 }}>
                                    {consumerProfile.preferredBrands.map((brand) => (
                                        <Chip
                                            key={brand}
                                            label={brand}
                                            color="primary"
                                            variant="outlined"
                                        />
                                    ))}
                                </Box>
                                <Divider sx={{ my: 2 }} />
                                <Typography variant="body2" color="text.secondary">
                                    Last Purchase
                                </Typography>
                                <Typography variant="body1">
                                    {consumerProfile.lastPurchase}
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>
            </TabPanel>

            <TabPanel value={tabValue} index={1}>
                <List>
                    {purchaseHistory.map((purchase, index) => (
                        <React.Fragment key={purchase.id}>
                            <ListItem alignItems="flex-start">
                                <ListItemAvatar>
                                    <Avatar sx={{ bgcolor: 'primary.main' }}>
                                        <HomeIcon />
                                    </Avatar>
                                </ListItemAvatar>
                                <ListItemText
                                    primary={
                                        <Box>
                                            <Typography variant="subtitle1" fontWeight="bold">
                                                {purchase.appliance}
                                            </Typography>
                                            <Typography variant="caption" color="text.secondary">
                                                Order #{purchase.id} • {purchase.date}
                                            </Typography>
                                        </Box>
                                    }
                                    secondary={
                                        <Box sx={{ mt: 1 }}>
                                            <Typography variant="body2" color="text.secondary">
                                                Model: {purchase.modelNumber}
                                            </Typography>
                                            <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
                                                <Chip
                                                    size="small"
                                                    label={purchase.status}
                                                    color={getStatusColor(purchase.status)}
                                                />
                                                <Chip
                                                    size="small"
                                                    label={purchase.warranty}
                                                    variant="outlined"
                                                />
                                            </Box>
                                        </Box>
                                    }
                                />
                                <ListItemSecondaryAction>
                                    <Typography variant="h6" color="primary">
                                        ${purchase.price.toFixed(2)}
                                    </Typography>
                                </ListItemSecondaryAction>
                            </ListItem>
                            {index < purchaseHistory.length - 1 && <Divider variant="inset" component="li" />}
                        </React.Fragment>
                    ))}
                </List>
            </TabPanel>

            <TabPanel value={tabValue} index={2}>
                <Timeline position="alternate">
                    {serviceHistory.map((service, index) => (
                        <TimelineItem key={index}>
                            <TimelineOppositeContent color="text.secondary">
                                {service.date}
                            </TimelineOppositeContent>
                            <TimelineSeparator>
                                <TimelineDot color={getStatusColor(service.status)}>
                                    {service.type === 'Installation' && <ShippingIcon />}
                                    {service.type === 'Repair' && <BuildIcon />}
                                    {service.type === 'Maintenance' && <CheckCircleIcon />}
                                </TimelineDot>
                                {index < serviceHistory.length - 1 && <TimelineConnector />}
                            </TimelineSeparator>
                            <TimelineContent>
                                <Paper elevation={3} sx={{ p: 2 }}>
                                    <Typography variant="h6" component="h1">
                                        {service.type}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        {service.appliance}
                                    </Typography>
                                    {service.issue && (
                                        <Typography variant="body2" sx={{ mt: 1 }}>
                                            Issue: {service.issue}
                                        </Typography>
                                    )}
                                    <Typography variant="caption" display="block" sx={{ mt: 1 }}>
                                        Technician: {service.technician}
                                    </Typography>
                                    <Chip
                                        size="small"
                                        label={service.status}
                                        color={getStatusColor(service.status)}
                                        sx={{ mt: 1 }}
                                    />
                                </Paper>
                            </TimelineContent>
                        </TimelineItem>
                    ))}
                </Timeline>
            </TabPanel>

            <DialogActions sx={{ p: 2 }}>
                <Button onClick={onClose} variant="contained">
                    Close
                </Button>
            </DialogActions>
        </StyledDialog>
    );
};

export default ConsumerProfileModal; 