import React, { useState } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Box,
    Typography,
    TextField,
    Button,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Alert,
    Grid,
    Card,
    CardContent,
    Chip,
    List,
    ListItem,
    ListItemText,
    ListItemIcon,
    IconButton,
} from '@mui/material';
import {
    Build as ServiceIcon,
    Close as CloseIcon,
    Schedule as ScheduleIcon,
    Description as DescriptionIcon,
    Home as AddressIcon,
    Phone as PhoneIcon,
    CheckCircle as SuccessIcon,
    Warning as WarningIcon,
    Info as InfoIcon,
} from '@mui/icons-material';
import { useCart } from '../contexts/CartContext';

const ServiceCallScheduler = ({ open, onClose }) => {
    const { user, shippingAddress, addServiceCallRequest } = useCart();
    const [formData, setFormData] = useState({
        applianceType: '',
        modelNumber: '',
        symptom: '',
        preferredDate: '',
        preferredTime: '',
        alternateDate: '',
        alternateTime: '',
        contactPhone: user?.phone || '',
        serviceAddress: shippingAddress?.street || '',
        serviceCity: shippingAddress?.city || '',
        serviceState: shippingAddress?.state || '',
        serviceZip: shippingAddress?.zipCode || '',
        additionalNotes: ''
    });
    const [submitted, setSubmitted] = useState(false);
    const [error, setError] = useState('');

    const applianceTypes = [
        { value: 'washing_machine', label: 'Washing Machine' },
        { value: 'dryer', label: 'Dryer' },
        { value: 'refrigerator', label: 'Refrigerator' },
        { value: 'dishwasher', label: 'Dishwasher' },
        { value: 'range', label: 'Range/Oven' },
        { value: 'microwave', label: 'Microwave' },
        { value: 'freezer', label: 'Freezer' },
        { value: 'other', label: 'Other' }
    ];

    const commonSymptoms = {
        washing_machine: [
            'Not draining',
            'Not spinning',
            'Leaking water',
            'Making loud noise',
            'Not starting'
        ],
        dryer: [
            'Not heating',
            'Taking too long to dry',
            'Making loud noise',
            'Not tumbling',
            'Not starting'
        ],
        refrigerator: [
            'Not cooling',
            'Making loud noise',
            'Water leaking',
            'Ice maker not working',
            'Temperature issues'
        ],
        dishwasher: [
            'Not cleaning properly',
            'Not draining',
            'Leaking water',
            'Not starting',
            'Door not closing'
        ]
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setError('');

        // Validation
        const requiredFields = [
            'applianceType',
            'symptom',
            'preferredDate',
            'preferredTime',
            'contactPhone',
            'serviceAddress',
            'serviceCity',
            'serviceState',
            'serviceZip'
        ];

        const missingFields = requiredFields.filter(field => !formData[field]);
        if (missingFields.length > 0) {
            setError('Please fill in all required fields');
            return;
        }

        // Submit service call request
        addServiceCallRequest({
            ...formData,
            customerName: user?.name || `${user?.firstName} ${user?.lastName}`,
            customerEmail: user?.email,
            companyName: user?.company
        });

        setSubmitted(true);
    };

    const handleFieldChange = (field, value) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    if (submitted) {
        return (
            <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
                <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <SuccessIcon color="success" />
                    Service Call Scheduled
                    <IconButton
                        aria-label="close"
                        onClick={onClose}
                        sx={{ position: 'absolute', right: 8, top: 8 }}
                    >
                        <CloseIcon />
                    </IconButton>
                </DialogTitle>
                <DialogContent>
                    <Alert severity="success" sx={{ mb: 2 }}>
                        Your service call request has been submitted successfully!
                    </Alert>

                    <Card variant="outlined">
                        <CardContent>
                            <Typography variant="h6" gutterBottom>
                                Request Summary
                            </Typography>
                            <List dense>
                                <ListItem>
                                    <ListItemText
                                        primary="Appliance Type"
                                        secondary={applianceTypes.find(a => a.value === formData.applianceType)?.label}
                                    />
                                </ListItem>
                                <ListItem>
                                    <ListItemText
                                        primary="Issue Description"
                                        secondary={formData.symptom}
                                    />
                                </ListItem>
                                <ListItem>
                                    <ListItemText
                                        primary="Preferred Service Date"
                                        secondary={`${formData.preferredDate} at ${formData.preferredTime}`}
                                    />
                                </ListItem>
                                {formData.alternateDate && (
                                    <ListItem>
                                        <ListItemText
                                            primary="Alternate Date"
                                            secondary={`${formData.alternateDate} at ${formData.alternateTime}`}
                                        />
                                    </ListItem>
                                )}
                            </List>
                        </CardContent>
                    </Card>

                    <Alert severity="info" sx={{ mt: 2 }}>
                        <Typography variant="body2">
                            <strong>What's Next?</strong>
                            <br />• A service technician will contact you within 24 hours
                            <br />• You'll receive a confirmation email shortly
                            <br />• Service call fee will be waived for warranty-covered repairs
                        </Typography>
                    </Alert>
                </DialogContent>
                <DialogActions>
                    <Button onClick={onClose} variant="contained">
                        Close
                    </Button>
                </DialogActions>
            </Dialog>
        );
    }

    return (
        <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
            <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <ServiceIcon color="primary" />
                Schedule Service Call
                <IconButton
                    aria-label="close"
                    onClick={onClose}
                    sx={{ position: 'absolute', right: 8, top: 8 }}
                >
                    <CloseIcon />
                </IconButton>
            </DialogTitle>

            <form onSubmit={handleSubmit}>
                <DialogContent>
                    <Alert severity="info" sx={{ mb: 3 }}>
                        <Typography variant="body2">
                            Schedule a service call for your appliance repair needs. Our certified technicians
                            will diagnose and fix the issue at your location.
                        </Typography>
                    </Alert>

                    {error && (
                        <Alert severity="error" sx={{ mb: 2 }}>
                            {error}
                        </Alert>
                    )}

                    <Grid container spacing={3}>
                        {/* Appliance Information */}
                        <Grid item xs={12}>
                            <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <InfoIcon color="primary" />
                                Appliance Information
                            </Typography>
                        </Grid>

                        <Grid item xs={12} sm={6}>
                            <FormControl fullWidth required>
                                <InputLabel>Appliance Type</InputLabel>
                                <Select
                                    value={formData.applianceType}
                                    label="Appliance Type"
                                    onChange={(e) => handleFieldChange('applianceType', e.target.value)}
                                >
                                    {applianceTypes.map(type => (
                                        <MenuItem key={type.value} value={type.value}>
                                            {type.label}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>

                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Model Number (Optional)"
                                value={formData.modelNumber}
                                onChange={(e) => handleFieldChange('modelNumber', e.target.value)}
                                helperText="If known, helps technician prepare"
                            />
                        </Grid>

                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                required
                                label="Describe the Problem"
                                value={formData.symptom}
                                onChange={(e) => handleFieldChange('symptom', e.target.value)}
                                multiline
                                rows={3}
                                placeholder="Please describe what's wrong with your appliance..."
                            />

                            {formData.applianceType && commonSymptoms[formData.applianceType] && (
                                <Box sx={{ mt: 1 }}>
                                    <Typography variant="caption" color="text.secondary">
                                        Common issues:
                                    </Typography>
                                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mt: 0.5 }}>
                                        {commonSymptoms[formData.applianceType].map(symptom => (
                                            <Chip
                                                key={symptom}
                                                label={symptom}
                                                size="small"
                                                variant="outlined"
                                                onClick={() => handleFieldChange('symptom', symptom)}
                                            />
                                        ))}
                                    </Box>
                                </Box>
                            )}
                        </Grid>

                        {/* Schedule Information */}
                        <Grid item xs={12}>
                            <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 2 }}>
                                <ScheduleIcon color="primary" />
                                Preferred Schedule
                            </Typography>
                        </Grid>

                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                required
                                type="date"
                                label="Preferred Date"
                                value={formData.preferredDate}
                                onChange={(e) => handleFieldChange('preferredDate', e.target.value)}
                                InputLabelProps={{ shrink: true }}
                                inputProps={{ min: new Date().toISOString().split('T')[0] }}
                            />
                        </Grid>

                        <Grid item xs={12} sm={6}>
                            <FormControl fullWidth required>
                                <InputLabel>Preferred Time</InputLabel>
                                <Select
                                    value={formData.preferredTime}
                                    label="Preferred Time"
                                    onChange={(e) => handleFieldChange('preferredTime', e.target.value)}
                                >
                                    <MenuItem value="morning">Morning (8AM - 12PM)</MenuItem>
                                    <MenuItem value="afternoon">Afternoon (12PM - 5PM)</MenuItem>
                                    <MenuItem value="evening">Evening (5PM - 8PM)</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>

                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                type="date"
                                label="Alternate Date (Optional)"
                                value={formData.alternateDate}
                                onChange={(e) => handleFieldChange('alternateDate', e.target.value)}
                                InputLabelProps={{ shrink: true }}
                                inputProps={{ min: new Date().toISOString().split('T')[0] }}
                            />
                        </Grid>

                        <Grid item xs={12} sm={6}>
                            <FormControl fullWidth disabled={!formData.alternateDate}>
                                <InputLabel>Alternate Time</InputLabel>
                                <Select
                                    value={formData.alternateTime}
                                    label="Alternate Time"
                                    onChange={(e) => handleFieldChange('alternateTime', e.target.value)}
                                >
                                    <MenuItem value="morning">Morning (8AM - 12PM)</MenuItem>
                                    <MenuItem value="afternoon">Afternoon (12PM - 5PM)</MenuItem>
                                    <MenuItem value="evening">Evening (5PM - 8PM)</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>

                        {/* Contact Information */}
                        <Grid item xs={12}>
                            <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 2 }}>
                                <AddressIcon color="primary" />
                                Service Location
                            </Typography>
                        </Grid>

                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                required
                                label="Contact Phone"
                                value={formData.contactPhone}
                                onChange={(e) => handleFieldChange('contactPhone', e.target.value)}
                                InputProps={{
                                    startAdornment: <PhoneIcon sx={{ mr: 1, color: 'action.active' }} />
                                }}
                            />
                        </Grid>

                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                required
                                label="Service Address"
                                value={formData.serviceAddress}
                                onChange={(e) => handleFieldChange('serviceAddress', e.target.value)}
                                placeholder="Street address where service is needed"
                            />
                        </Grid>

                        <Grid item xs={6}>
                            <TextField
                                fullWidth
                                required
                                label="City"
                                value={formData.serviceCity}
                                onChange={(e) => handleFieldChange('serviceCity', e.target.value)}
                            />
                        </Grid>

                        <Grid item xs={3}>
                            <TextField
                                fullWidth
                                required
                                label="State"
                                value={formData.serviceState}
                                onChange={(e) => handleFieldChange('serviceState', e.target.value)}
                                inputProps={{ maxLength: 2 }}
                            />
                        </Grid>

                        <Grid item xs={3}>
                            <TextField
                                fullWidth
                                required
                                label="ZIP Code"
                                value={formData.serviceZip}
                                onChange={(e) => handleFieldChange('serviceZip', e.target.value)}
                            />
                        </Grid>

                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Additional Notes (Optional)"
                                value={formData.additionalNotes}
                                onChange={(e) => handleFieldChange('additionalNotes', e.target.value)}
                                multiline
                                rows={2}
                                placeholder="Any additional information that might help our technician..."
                            />
                        </Grid>
                    </Grid>

                    <Alert severity="warning" sx={{ mt: 3 }}>
                        <Typography variant="body2">
                            <strong>Service Call Fee:</strong> $75 diagnostic fee (waived if repair is performed).
                            Additional charges apply for parts and labor.
                        </Typography>
                    </Alert>
                </DialogContent>

                <DialogActions sx={{ p: 3 }}>
                    <Button onClick={onClose}>
                        Cancel
                    </Button>
                    <Button
                        type="submit"
                        variant="contained"
                        startIcon={<ServiceIcon />}
                    >
                        Schedule Service Call
                    </Button>
                </DialogActions>
            </form>
        </Dialog>
    );
};

export default ServiceCallScheduler; 