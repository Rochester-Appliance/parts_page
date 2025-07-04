import React, { useState, useEffect } from 'react';
import {
    Box,
    Container,
    Typography,
    Tabs,
    Tab,
    Card,
    CardContent,
    Grid,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Button,
    IconButton,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Chip,
    Alert,
    Badge,
    Avatar,
    List,
    ListItem,
    ListItemText,
    ListItemSecondaryAction,
    Divider,
    Switch,
    FormControlLabel,
    Tooltip,
    Menu,
    Accordion,
    AccordionSummary,
    AccordionDetails,
    LinearProgress,
} from '@mui/material';
import {
    Dashboard as DashboardIcon,
    AccountTree as HierarchyIcon,
    Business as BusinessIcon,
    Person as PersonIcon,
    Add as AddIcon,
    Edit as EditIcon,
    Delete as DeleteIcon,
    Visibility as ViewIcon,
    ExpandMore as ExpandMoreIcon,
    SupervisorAccount as AdminIcon,
    Group as GroupIcon,
    Domain as DomainIcon,
    Settings as SettingsIcon,
    Assignment as AssignmentIcon,
    Security as SecurityIcon,
    TrendingUp as StatsIcon,
    Email as EmailIcon,
    Phone as PhoneIcon,
    LocationOn as LocationIcon,
    CheckCircle as ApprovedIcon,
    Cancel as DeniedIcon,
    Schedule as PendingIcon,
    MoreVert as MoreIcon,
    Close as CloseIcon,
} from '@mui/icons-material';
import { useCart } from '../contexts/CartContext';

const AdminConsole = ({ open, onClose }) => {
    const { user } = useCart();
    const [currentTab, setCurrentTab] = useState(0);
    const [selectedAccount, setSelectedAccount] = useState(null);
    const [showAccountDialog, setShowAccountDialog] = useState(false);
    const [showCompanyDialog, setShowCompanyDialog] = useState(false);
    const [accountMenuAnchor, setAccountMenuAnchor] = useState(null);
    const [companies, setCompanies] = useState([]);
    const [accounts, setAccounts] = useState([]);
    const [pendingApprovals, setPendingApprovals] = useState([]);

    // Mock data - in real app, this would come from APIs
    useEffect(() => {
        const mockCompanies = [
            {
                id: 1,
                name: 'Rochester Property Management',
                domain: 'rpm.com',
                type: 'property_management',
                parentAccountId: 101,
                childAccounts: 5,
                totalUsers: 12,
                monthlyVolume: '$15,000',
                status: 'active',
                taxExempt: true,
                negotiatedRates: true,
                createdDate: '2024-01-15'
            },
            {
                id: 2,
                name: 'University of Rochester',
                domain: 'rochester.edu',
                type: 'education',
                parentAccountId: 102,
                childAccounts: 8,
                totalUsers: 25,
                monthlyVolume: '$25,000',
                status: 'active',
                taxExempt: true,
                negotiatedRates: true,
                createdDate: '2023-09-01'
            },
            {
                id: 3,
                name: 'Local Restaurant Group',
                domain: 'localrestaurants.com',
                type: 'hospitality',
                parentAccountId: 103,
                childAccounts: 3,
                totalUsers: 8,
                monthlyVolume: '$8,500',
                status: 'active',
                taxExempt: false,
                negotiatedRates: true,
                createdDate: '2024-03-10'
            }
        ];

        const mockAccounts = [
            // Parent Accounts
            {
                id: 101,
                type: 'parent',
                companyId: 1,
                name: 'John Manager',
                email: 'john.manager@rpm.com',
                phone: '(585) 555-0101',
                title: 'Property Manager',
                status: 'approved',
                lastLogin: '2024-01-20T10:30:00Z',
                permissions: ['manage_children', 'view_reports', 'place_orders'],
                children: [
                    {
                        id: 201,
                        name: 'Downtown Office',
                        manager: 'Sarah Wilson',
                        email: 'sarah@rpm.com',
                        budget: 2000,
                        spent: 1250,
                        orders: 15
                    },
                    {
                        id: 202,
                        name: 'Eastside Complex',
                        manager: 'Mike Johnson',
                        email: 'mike@rpm.com',
                        budget: 3000,
                        spent: 2100,
                        orders: 22
                    }
                ]
            },
            {
                id: 102,
                type: 'parent',
                companyId: 2,
                name: 'Dr. Lisa Chen',
                email: 'lchen@rochester.edu',
                phone: '(585) 555-0102',
                title: 'Facilities Director',
                status: 'approved',
                lastLogin: '2024-01-19T14:15:00Z',
                permissions: ['manage_children', 'view_reports', 'place_orders', 'approve_budgets'],
                children: [
                    {
                        id: 203,
                        name: 'Medical Center',
                        manager: 'Robert Davis',
                        email: 'rdavis@rochester.edu',
                        budget: 5000,
                        spent: 3200,
                        orders: 28
                    },
                    {
                        id: 204,
                        name: 'Student Housing',
                        manager: 'Maria Garcia',
                        email: 'mgarcia@rochester.edu',
                        budget: 4000,
                        spent: 1800,
                        orders: 18
                    }
                ]
            }
        ];

        const mockPendingApprovals = [
            {
                id: 301,
                name: 'Tech Solutions Inc',
                contactName: 'David Smith',
                email: 'david@techsolutions.com',
                phone: '(585) 555-0201',
                businessType: 'technology',
                requestedVolume: 75,
                submittedDate: '2024-01-18T09:00:00Z',
                requestReason: 'Need parts for multiple office locations',
                accountType: 'parent'
            },
            {
                id: 302,
                name: 'Corner Cafe',
                contactName: 'Jennifer Brown',
                email: 'jen@cornercafe.com',
                phone: '(585) 555-0202',
                businessType: 'restaurant',
                requestedVolume: 25,
                submittedDate: '2024-01-17T11:30:00Z',
                requestReason: 'Kitchen equipment maintenance',
                accountType: 'standard'
            }
        ];

        setCompanies(mockCompanies);
        setAccounts(mockAccounts);
        setPendingApprovals(mockPendingApprovals);
    }, []);

    const handleTabChange = (event, newValue) => {
        setCurrentTab(newValue);
    };

    const handleApproveAccount = (accountId) => {
        setPendingApprovals(prev => prev.filter(acc => acc.id !== accountId));
        // In real app, would call API to approve
        alert(`Account approved and welcome email sent!`);
    };

    const handleDenyAccount = (accountId) => {
        setPendingApprovals(prev => prev.filter(acc => acc.id !== accountId));
        // In real app, would call API to deny
        alert(`Account denied and notification email sent.`);
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'approved': return 'success';
            case 'pending': return 'warning';
            case 'denied': return 'error';
            case 'active': return 'success';
            case 'inactive': return 'default';
            default: return 'default';
        }
    };

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD'
        }).format(amount);
    };

    // Dashboard Overview Tab
    const DashboardOverview = () => (
        <Grid container spacing={3}>
            {/* Key Metrics */}
            <Grid item xs={12} md={3}>
                <Card>
                    <CardContent sx={{ textAlign: 'center' }}>
                        <Typography variant="h3" color="primary">
                            {companies.length}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            Active Companies
                        </Typography>
                    </CardContent>
                </Card>
            </Grid>
            <Grid item xs={12} md={3}>
                <Card>
                    <CardContent sx={{ textAlign: 'center' }}>
                        <Typography variant="h3" color="success.main">
                            {accounts.length}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            Parent Accounts
                        </Typography>
                    </CardContent>
                </Card>
            </Grid>
            <Grid item xs={12} md={3}>
                <Card>
                    <CardContent sx={{ textAlign: 'center' }}>
                        <Typography variant="h3" color="info.main">
                            {accounts.reduce((sum, acc) => sum + acc.children?.length || 0, 0)}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            Child Accounts
                        </Typography>
                    </CardContent>
                </Card>
            </Grid>
            <Grid item xs={12} md={3}>
                <Card>
                    <CardContent sx={{ textAlign: 'center' }}>
                        <Badge badgeContent={pendingApprovals.length} color="error">
                            <Typography variant="h3" color="warning.main">
                                {pendingApprovals.length}
                            </Typography>
                        </Badge>
                        <Typography variant="body2" color="text.secondary">
                            Pending Approvals
                        </Typography>
                    </CardContent>
                </Card>
            </Grid>

            {/* Recent Activity */}
            <Grid item xs={12} md={8}>
                <Card>
                    <CardContent>
                        <Typography variant="h6" gutterBottom>
                            Recent Account Activity
                        </Typography>
                        <List>
                            {accounts.slice(0, 5).map((account) => (
                                <ListItem key={account.id}>
                                    <Avatar sx={{ mr: 2, bgcolor: 'primary.main' }}>
                                        {account.name.charAt(0)}
                                    </Avatar>
                                    <ListItemText
                                        primary={account.name}
                                        secondary={`Last login: ${new Date(account.lastLogin).toLocaleDateString()}`}
                                    />
                                    <Chip
                                        label={account.status}
                                        color={getStatusColor(account.status)}
                                        size="small"
                                    />
                                </ListItem>
                            ))}
                        </List>
                    </CardContent>
                </Card>
            </Grid>

            {/* Pending Approvals Quick View */}
            <Grid item xs={12} md={4}>
                <Card>
                    <CardContent>
                        <Typography variant="h6" gutterBottom>
                            Pending Approvals
                        </Typography>
                        {pendingApprovals.length === 0 ? (
                            <Typography variant="body2" color="text.secondary">
                                No pending approvals
                            </Typography>
                        ) : (
                            <List dense>
                                {pendingApprovals.map((approval) => (
                                    <ListItem key={approval.id}>
                                        <ListItemText
                                            primary={approval.name}
                                            secondary={approval.contactName}
                                        />
                                        <Chip
                                            label={approval.accountType}
                                            size="small"
                                            variant="outlined"
                                        />
                                    </ListItem>
                                ))}
                            </List>
                        )}
                    </CardContent>
                </Card>
            </Grid>
        </Grid>
    );

    // Company Management Tab
    const CompanyManagement = () => (
        <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
                <Typography variant="h5">Company Management</Typography>
                <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={() => setShowCompanyDialog(true)}
                >
                    Add Company
                </Button>
            </Box>

            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Company</TableCell>
                            <TableCell>Type</TableCell>
                            <TableCell>Domain</TableCell>
                            <TableCell>Accounts</TableCell>
                            <TableCell>Monthly Volume</TableCell>
                            <TableCell>Status</TableCell>
                            <TableCell>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {companies.map((company) => (
                            <TableRow key={company.id}>
                                <TableCell>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                        <Avatar sx={{ width: 32, height: 32, bgcolor: 'primary.main' }}>
                                            {company.name.charAt(0)}
                                        </Avatar>
                                        <Box>
                                            <Typography variant="subtitle2">
                                                {company.name}
                                            </Typography>
                                            <Typography variant="caption" color="text.secondary">
                                                ID: {company.id}
                                            </Typography>
                                        </Box>
                                    </Box>
                                </TableCell>
                                <TableCell>
                                    <Chip
                                        label={company.type.replace('_', ' ')}
                                        size="small"
                                        variant="outlined"
                                    />
                                </TableCell>
                                <TableCell>{company.domain}</TableCell>
                                <TableCell>
                                    <Box>
                                        <Typography variant="body2">
                                            {company.childAccounts} properties
                                        </Typography>
                                        <Typography variant="caption" color="text.secondary">
                                            {company.totalUsers} total users
                                        </Typography>
                                    </Box>
                                </TableCell>
                                <TableCell>{company.monthlyVolume}</TableCell>
                                <TableCell>
                                    <Chip
                                        label={company.status}
                                        color={getStatusColor(company.status)}
                                        size="small"
                                    />
                                </TableCell>
                                <TableCell>
                                    <IconButton size="small">
                                        <EditIcon />
                                    </IconButton>
                                    <IconButton size="small">
                                        <ViewIcon />
                                    </IconButton>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>
    );

    // Account Hierarchy Tab
    const AccountHierarchy = () => (
        <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
                <Typography variant="h5">Account Hierarchy</Typography>
                <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={() => setShowAccountDialog(true)}
                >
                    Create Parent Account
                </Button>
            </Box>

            {accounts.map((account) => (
                <Accordion key={account.id} sx={{ mb: 2 }}>
                    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, width: '100%' }}>
                            <Avatar sx={{ bgcolor: 'secondary.main' }}>
                                <AdminIcon />
                            </Avatar>
                            <Box sx={{ flexGrow: 1 }}>
                                <Typography variant="h6">
                                    {account.name} (Parent Account)
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    {account.email} • {account.children?.length || 0} child accounts
                                </Typography>
                            </Box>
                            <Chip
                                label={account.status}
                                color={getStatusColor(account.status)}
                                size="small"
                            />
                        </Box>
                    </AccordionSummary>
                    <AccordionDetails>
                        <Grid container spacing={2}>
                            {/* Parent Account Details */}
                            <Grid item xs={12} md={6}>
                                <Card variant="outlined">
                                    <CardContent>
                                        <Typography variant="subtitle1" gutterBottom>
                                            Parent Account Details
                                        </Typography>
                                        <List dense>
                                            <ListItem>
                                                <EmailIcon sx={{ mr: 1, color: 'action.active' }} />
                                                <ListItemText primary={account.email} />
                                            </ListItem>
                                            <ListItem>
                                                <PhoneIcon sx={{ mr: 1, color: 'action.active' }} />
                                                <ListItemText primary={account.phone} />
                                            </ListItem>
                                            <ListItem>
                                                <BusinessIcon sx={{ mr: 1, color: 'action.active' }} />
                                                <ListItemText primary={account.title} />
                                            </ListItem>
                                        </List>
                                        <Box sx={{ mt: 2 }}>
                                            <Typography variant="caption" color="text.secondary">
                                                Permissions:
                                            </Typography>
                                            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mt: 0.5 }}>
                                                {account.permissions.map(permission => (
                                                    <Chip
                                                        key={permission}
                                                        label={permission.replace('_', ' ')}
                                                        size="small"
                                                        variant="outlined"
                                                    />
                                                ))}
                                            </Box>
                                        </Box>
                                    </CardContent>
                                </Card>
                            </Grid>

                            {/* Child Accounts */}
                            <Grid item xs={12} md={6}>
                                <Card variant="outlined">
                                    <CardContent>
                                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                                            <Typography variant="subtitle1">
                                                Child Accounts ({account.children?.length || 0})
                                            </Typography>
                                            <Button size="small" startIcon={<AddIcon />}>
                                                Add Child
                                            </Button>
                                        </Box>
                                        {account.children?.map((child) => (
                                            <Card key={child.id} variant="outlined" sx={{ mb: 1, p: 2 }}>
                                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                    <Box>
                                                        <Typography variant="subtitle2">
                                                            {child.name}
                                                        </Typography>
                                                        <Typography variant="caption" color="text.secondary">
                                                            Manager: {child.manager}
                                                        </Typography>
                                                    </Box>
                                                    <Box sx={{ textAlign: 'right' }}>
                                                        <Typography variant="body2">
                                                            {formatCurrency(child.spent)} / {formatCurrency(child.budget)}
                                                        </Typography>
                                                        <LinearProgress
                                                            variant="determinate"
                                                            value={(child.spent / child.budget) * 100}
                                                            sx={{ width: 100, mt: 0.5 }}
                                                        />
                                                    </Box>
                                                </Box>
                                            </Card>
                                        ))}
                                    </CardContent>
                                </Card>
                            </Grid>
                        </Grid>
                    </AccordionDetails>
                </Accordion>
            ))}
        </Box>
    );

    // Pending Approvals Tab
    const PendingApprovals = () => (
        <Box>
            <Typography variant="h5" gutterBottom>
                Pending Account Approvals ({pendingApprovals.length})
            </Typography>

            {pendingApprovals.length === 0 ? (
                <Alert severity="info">
                    No pending approvals at this time.
                </Alert>
            ) : (
                <Grid container spacing={2}>
                    {pendingApprovals.map((approval) => (
                        <Grid item xs={12} md={6} key={approval.id}>
                            <Card>
                                <CardContent>
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                                        <Box>
                                            <Typography variant="h6">
                                                {approval.name}
                                            </Typography>
                                            <Chip
                                                label={`${approval.accountType} account`}
                                                size="small"
                                                color={approval.accountType === 'parent' ? 'secondary' : 'primary'}
                                            />
                                        </Box>
                                        <Chip
                                            label="PENDING"
                                            color="warning"
                                            size="small"
                                        />
                                    </Box>

                                    <List dense>
                                        <ListItem sx={{ px: 0 }}>
                                            <PersonIcon sx={{ mr: 1, color: 'action.active' }} />
                                            <ListItemText primary={approval.contactName} />
                                        </ListItem>
                                        <ListItem sx={{ px: 0 }}>
                                            <EmailIcon sx={{ mr: 1, color: 'action.active' }} />
                                            <ListItemText primary={approval.email} />
                                        </ListItem>
                                        <ListItem sx={{ px: 0 }}>
                                            <PhoneIcon sx={{ mr: 1, color: 'action.active' }} />
                                            <ListItemText primary={approval.phone} />
                                        </ListItem>
                                        <ListItem sx={{ px: 0 }}>
                                            <BusinessIcon sx={{ mr: 1, color: 'action.active' }} />
                                            <ListItemText primary={approval.businessType} />
                                        </ListItem>
                                    </List>

                                    <Alert severity="info" sx={{ mt: 2, mb: 2 }}>
                                        <Typography variant="body2">
                                            <strong>Request Reason:</strong> {approval.requestReason}
                                        </Typography>
                                        <Typography variant="body2">
                                            <strong>Expected Volume:</strong> ${approval.requestedVolume}/month
                                        </Typography>
                                        <Typography variant="body2">
                                            <strong>Submitted:</strong> {new Date(approval.submittedDate).toLocaleDateString()}
                                        </Typography>
                                    </Alert>

                                    <Box sx={{ display: 'flex', gap: 1 }}>
                                        <Button
                                            variant="contained"
                                            color="success"
                                            startIcon={<ApprovedIcon />}
                                            onClick={() => handleApproveAccount(approval.id)}
                                        >
                                            Approve
                                        </Button>
                                        <Button
                                            variant="outlined"
                                            color="error"
                                            startIcon={<DeniedIcon />}
                                            onClick={() => handleDenyAccount(approval.id)}
                                        >
                                            Deny
                                        </Button>
                                        <Button
                                            variant="outlined"
                                            startIcon={<EmailIcon />}
                                        >
                                            Contact
                                        </Button>
                                    </Box>
                                </CardContent>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            )}
        </Box>
    );

    const tabs = [
        { label: 'Dashboard', icon: <DashboardIcon />, component: <DashboardOverview /> },
        { label: 'Companies', icon: <BusinessIcon />, component: <CompanyManagement /> },
        { label: 'Account Hierarchy', icon: <HierarchyIcon />, component: <AccountHierarchy /> },
        { label: 'Pending Approvals', icon: <PendingIcon />, component: <PendingApprovals />, badge: pendingApprovals.length },
    ];

    return (
        <Dialog open={open} onClose={onClose} maxWidth="xl" fullWidth fullScreen>
            <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box>
                    <Typography variant="h4">Admin Console</Typography>
                    <Typography variant="subtitle1" color="text.secondary">
                        Comprehensive management of accounts, companies, and customer designations
                    </Typography>
                </Box>
                <IconButton onClick={onClose}>
                    <CloseIcon />
                </IconButton>
            </DialogTitle>

            <DialogContent sx={{ p: 0 }}>
                <Container maxWidth="xl" sx={{ py: 2 }}>
                    {/* Navigation Tabs */}
                    <Paper sx={{ mb: 3 }}>
                        <Tabs value={currentTab} onChange={handleTabChange} variant="scrollable" scrollButtons="auto">
                            {tabs.map((tab, index) => (
                                <Tab
                                    key={index}
                                    label={
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                            {tab.badge ? (
                                                <Badge badgeContent={tab.badge} color="error">
                                                    {tab.icon}
                                                </Badge>
                                            ) : (
                                                tab.icon
                                            )}
                                            {tab.label}
                                        </Box>
                                    }
                                />
                            ))}
                        </Tabs>
                    </Paper>

                    {/* Tab Content */}
                    <Box>
                        {tabs[currentTab]?.component}
                    </Box>
                </Container>
            </DialogContent>
        </Dialog>
    );
};

export default AdminConsole; 