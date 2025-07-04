import React, { useState, useEffect } from 'react';
import {
    Box,
    Typography,
    Card,
    CardContent,
    Button,
    Chip,
    Grid,
    Divider,
    Alert,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    List,
    ListItem,
    ListItemText,
    ListItemSecondaryAction,
    IconButton,
    Tab,
    Tabs,
    Badge,
} from '@mui/material';
import {
    AdminPanelSettings as AdminIcon,
    Schedule as PendingIcon,
    CheckCircle as ApproveIcon,
    Cancel as DenyIcon,
    Email as EmailIcon,
    Business as BusinessIcon,
    Person as PersonIcon,
    Domain as DomainIcon,
    Add as AddIcon,
    Delete as DeleteIcon,
    Group as GroupIcon,
    Visibility as ViewIcon,
} from '@mui/icons-material';

const AdminApprovalDashboard = ({ open, onClose }) => {
    const [currentTab, setCurrentTab] = useState(0);
    const [pendingRequests, setPendingRequests] = useState([]);
    const [approvedUsers, setApprovedUsers] = useState([]);
    const [allowedDomains, setAllowedDomains] = useState([
        'rochester.edu',
        'rit.edu',
        'localcompany.com',
        'trustedpartner.com'
    ]);
    const [selectedRequest, setSelectedRequest] = useState(null);
    const [showDetails, setShowDetails] = useState(false);
    const [newDomain, setNewDomain] = useState('');
    const [approvalMessage, setApprovalMessage] = useState('');

    // Mock data for demonstration
    useEffect(() => {
        setPendingRequests([
            {
                id: 1,
                firstName: 'John',
                lastName: 'Doe',
                email: 'john.doe@newcompany.com',
                company: 'New Company LLC',
                businessType: 'distributor',
                phone: '(555) 123-4567',
                address: '123 Main St, Rochester, NY 14623',
                requestReason: 'We are a new appliance parts distributor looking to expand our inventory',
                expectedVolume: 'medium',
                additionalUsers: [
                    { firstName: 'Jane', lastName: 'Manager', email: 'jane@newcompany.com', role: 'Manager' }
                ],
                submittedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
                domainStatus: 'manual_review'
            }
        ]);

        setApprovedUsers([
            {
                id: 3,
                name: 'Mike Johnson',
                email: 'mike@rochester.edu',
                company: 'University of Rochester',
                approvedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
                domainStatus: 'auto_approved'
            }
        ]);
    }, []);

    const handleApprove = (requestId, message = '') => {
        const request = pendingRequests.find(r => r.id === requestId);
        if (request) {
            const approvedUser = {
                ...request,
                id: Date.now(),
                name: `${request.firstName} ${request.lastName}`,
                approvedAt: new Date(),
                approvalMessage: message
            };

            setApprovedUsers(prev => [approvedUser, ...prev]);
            setPendingRequests(prev => prev.filter(r => r.id !== requestId));

            alert(`Approval email sent to ${request.email}`);
        }
        setShowDetails(false);
        setApprovalMessage('');
    };

    const handleDeny = (requestId, reason = '') => {
        const request = pendingRequests.find(r => r.id === requestId);
        if (request) {
            setPendingRequests(prev => prev.filter(r => r.id !== requestId));
            alert(`Denial email sent to ${request.email}`);
        }
        setShowDetails(false);
        setApprovalMessage('');
    };

    const addDomain = () => {
        if (newDomain && !allowedDomains.includes(newDomain)) {
            setAllowedDomains(prev => [...prev, newDomain]);
            setNewDomain('');
        }
    };

    const removeDomain = (domain) => {
        setAllowedDomains(prev => prev.filter(d => d !== domain));
    };

    const RequestCard = ({ request, showActions = true }) => (
        <Card variant="outlined" sx={{ mb: 2 }}>
            <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                    <Box>
                        <Typography variant="h6">
                            {request.firstName} {request.lastName}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            {request.email} • {request.company}
                        </Typography>
                        <Chip
                            label={request.businessType}
                            size="small"
                            sx={{ mt: 1 }}
                        />
                    </Box>
                    <Box sx={{ textAlign: 'right' }}>
                        <Typography variant="caption" color="text.secondary">
                            Submitted: {request.submittedAt?.toLocaleDateString()}
                        </Typography>
                        <br />
                        <Chip
                            label="Manual Review Required"
                            color="warning"
                            size="small"
                        />
                    </Box>
                </Box>

                <Typography variant="body2" sx={{ mb: 2 }}>
                    <strong>Request Reason:</strong> {request.requestReason}
                </Typography>

                <Typography variant="body2" sx={{ mb: 1 }}>
                    <strong>Address:</strong> {request.address}
                </Typography>

                {showActions && (
                    <Box sx={{ mt: 2, display: 'flex', gap: 1 }}>
                        <Button
                            variant="contained"
                            color="success"
                            startIcon={<ApproveIcon />}
                            onClick={() => {
                                setSelectedRequest(request);
                                setShowDetails(true);
                            }}
                        >
                            Approve
                        </Button>
                        <Button
                            variant="outlined"
                            color="error"
                            startIcon={<DenyIcon />}
                            onClick={() => handleDeny(request.id, 'Application denied after review')}
                        >
                            Deny
                        </Button>
                    </Box>
                )}
            </CardContent>
        </Card>
    );

    return (
        <Dialog open={open} onClose={onClose} maxWidth="lg" fullWidth>
            <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <AdminIcon color="primary" />
                Admin Approval Dashboard
            </DialogTitle>
            <DialogContent>
                <Tabs value={currentTab} onChange={(e, v) => setCurrentTab(v)} sx={{ mb: 3 }}>
                    <Tab
                        label={
                            <Badge badgeContent={pendingRequests.length} color="warning">
                                Pending Requests
                            </Badge>
                        }
                    />
                    <Tab
                        label={
                            <Badge badgeContent={approvedUsers.length} color="success">
                                Approved Users
                            </Badge>
                        }
                    />
                    <Tab label="Domain Management" />
                </Tabs>

                {/* Pending Requests Tab */}
                {currentTab === 0 && (
                    <Box>
                        <Alert severity="info" sx={{ mb: 2 }}>
                            <Typography variant="body2">
                                <strong>Pending Approval Queue:</strong> Review and approve/deny user registration requests.
                                Manual approval emails will be sent upon action.
                            </Typography>
                        </Alert>

                        {pendingRequests.length === 0 ? (
                            <Card variant="outlined">
                                <CardContent sx={{ textAlign: 'center', py: 4 }}>
                                    <PendingIcon sx={{ fontSize: 60, color: 'text.secondary', mb: 2 }} />
                                    <Typography variant="h6" color="text.secondary">
                                        No Pending Requests
                                    </Typography>
                                </CardContent>
                            </Card>
                        ) : (
                            pendingRequests.map(request => (
                                <RequestCard key={request.id} request={request} />
                            ))
                        )}
                    </Box>
                )}

                {/* Approved Users Tab */}
                {currentTab === 1 && (
                    <Box>
                        <Alert severity="success" sx={{ mb: 2 }}>
                            <Typography variant="body2">
                                <strong>Approved Users:</strong> Users with active accounts and access to the platform.
                            </Typography>
                        </Alert>

                        {approvedUsers.map(user => (
                            <Card key={user.id} variant="outlined" sx={{ mb: 2 }}>
                                <CardContent>
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <Box>
                                            <Typography variant="h6">{user.name}</Typography>
                                            <Typography variant="body2" color="text.secondary">
                                                {user.email} • {user.company}
                                            </Typography>
                                            <Typography variant="caption" color="text.secondary">
                                                Approved: {user.approvedAt?.toLocaleDateString()}
                                            </Typography>
                                        </Box>
                                        <Chip
                                            label="Active"
                                            color="success"
                                        />
                                    </Box>
                                </CardContent>
                            </Card>
                        ))}
                    </Box>
                )}

                {/* Domain Management Tab */}
                {currentTab === 2 && (
                    <Box>
                        <Alert severity="info" sx={{ mb: 2 }}>
                            <Typography variant="body2">
                                <strong>Domain Allowlist:</strong> Domains listed here will be automatically approved without manual review.
                            </Typography>
                        </Alert>

                        <Card variant="outlined" sx={{ mb: 2 }}>
                            <CardContent>
                                <Typography variant="h6" gutterBottom>
                                    Add New Allowed Domain
                                </Typography>
                                <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                                    <TextField
                                        value={newDomain}
                                        onChange={(e) => setNewDomain(e.target.value)}
                                        placeholder="company.com"
                                        size="small"
                                        sx={{ flexGrow: 1 }}
                                    />
                                    <Button
                                        variant="contained"
                                        startIcon={<AddIcon />}
                                        onClick={addDomain}
                                        disabled={!newDomain}
                                    >
                                        Add Domain
                                    </Button>
                                </Box>
                            </CardContent>
                        </Card>

                        <Typography variant="h6" gutterBottom>
                            Current Allowed Domains ({allowedDomains.length})
                        </Typography>
                        <List>
                            {allowedDomains.map(domain => (
                                <ListItem key={domain} divider>
                                    <DomainIcon sx={{ mr: 2, color: 'text.secondary' }} />
                                    <ListItemText
                                        primary={`@${domain}`}
                                        secondary="Users with this domain are auto-approved"
                                    />
                                    <ListItemSecondaryAction>
                                        <IconButton
                                            edge="end"
                                            onClick={() => removeDomain(domain)}
                                            color="error"
                                        >
                                            <DeleteIcon />
                                        </IconButton>
                                    </ListItemSecondaryAction>
                                </ListItem>
                            ))}
                        </List>
                    </Box>
                )}

                {/* Approval Details Dialog */}
                <Dialog open={showDetails} onClose={() => setShowDetails(false)} maxWidth="md" fullWidth>
                    <DialogTitle>
                        Approve Registration Request
                    </DialogTitle>
                    <DialogContent>
                        {selectedRequest && (
                            <Box>
                                <RequestCard request={selectedRequest} showActions={false} />

                                <TextField
                                    fullWidth
                                    multiline
                                    rows={3}
                                    label="Approval Message (Optional)"
                                    value={approvalMessage}
                                    onChange={(e) => setApprovalMessage(e.target.value)}
                                    placeholder="Welcome message or additional instructions..."
                                    sx={{ mt: 2 }}
                                />
                            </Box>
                        )}
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => setShowDetails(false)}>
                            Cancel
                        </Button>
                        {selectedRequest && (
                            <>
                                <Button
                                    color="error"
                                    onClick={() => handleDeny(selectedRequest.id, approvalMessage || 'Application denied after review')}
                                >
                                    Deny Request
                                </Button>
                                <Button
                                    variant="contained"
                                    color="success"
                                    onClick={() => handleApprove(selectedRequest.id, approvalMessage)}
                                >
                                    Approve Request
                                </Button>
                            </>
                        )}
                    </DialogActions>
                </Dialog>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Close Dashboard</Button>
            </DialogActions>
        </Dialog>
    );
};

export default AdminApprovalDashboard; 