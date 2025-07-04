import React, { useState } from 'react';
import {
    Box,
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Typography,
    Accordion,
    AccordionSummary,
    AccordionDetails,
    Card,
    CardContent,
    IconButton,
    TextField,
    InputAdornment,
    List,
    ListItem,
    ListItemText,
    ListItemIcon,
    Chip,
    Grid,
    Alert,
    CircularProgress,
} from '@mui/material';
import {
    ExpandMore as ExpandMoreIcon,
    Close as CloseIcon,
    Search as SearchIcon,
    Help as HelpIcon,
    Build as BuildIcon,
    Warning as WarningIcon,
    CheckCircle as CheckCircleIcon,
    Info as InfoIcon,
    Lightbulb as LightbulbIcon,
} from '@mui/icons-material';

// Pre-loaded common symptoms data
const COMMON_SYMPTOMS = {
    'Washing Machine': [
        {
            symptom: 'Not draining properly',
            causes: [
                'Clogged drain hose',
                'Blocked pump filter',
                'Faulty drain pump',
                'Lint buildup in drain'
            ],
            solutions: [
                'Check and clean drain hose',
                'Clean pump filter',
                'Inspect drain pump for debris',
                'Run cleaning cycle with vinegar'
            ],
            parts: ['Drain Pump', 'Drain Hose', 'Pump Filter']
        },
        {
            symptom: 'Not spinning',
            causes: [
                'Unbalanced load',
                'Worn drive belt',
                'Faulty lid switch',
                'Motor coupling broken'
            ],
            solutions: [
                'Redistribute clothes evenly',
                'Replace drive belt',
                'Test and replace lid switch',
                'Replace motor coupling'
            ],
            parts: ['Drive Belt', 'Lid Switch', 'Motor Coupling']
        },
        {
            symptom: 'Leaking water',
            causes: [
                'Worn door seal',
                'Loose hose connections',
                'Cracked tub',
                'Faulty water pump'
            ],
            solutions: [
                'Replace door seal/gasket',
                'Tighten hose connections',
                'Inspect tub for cracks',
                'Replace water pump'
            ],
            parts: ['Door Seal', 'Water Pump', 'Hose Clamps']
        }
    ],
    'Dryer': [
        {
            symptom: 'Not heating',
            causes: [
                'Blown thermal fuse',
                'Faulty heating element',
                'Bad gas valve solenoid',
                'Clogged exhaust vent'
            ],
            solutions: [
                'Replace thermal fuse',
                'Test and replace heating element',
                'Replace gas valve solenoid',
                'Clean exhaust vent system'
            ],
            parts: ['Thermal Fuse', 'Heating Element', 'Gas Valve Solenoid']
        },
        {
            symptom: 'Takes too long to dry',
            causes: [
                'Clogged lint filter',
                'Blocked exhaust vent',
                'Worn door seal',
                'Faulty moisture sensor'
            ],
            solutions: [
                'Clean lint filter thoroughly',
                'Clean exhaust vent system',
                'Replace door seal',
                'Clean or replace moisture sensor'
            ],
            parts: ['Lint Filter', 'Door Seal', 'Moisture Sensor']
        }
    ],
    'Refrigerator': [
        {
            symptom: 'Not cooling properly',
            causes: [
                'Dirty condenser coils',
                'Faulty compressor',
                'Low refrigerant',
                'Blocked air vents'
            ],
            solutions: [
                'Clean condenser coils',
                'Test compressor operation',
                'Check for refrigerant leaks',
                'Clear air vents of obstructions'
            ],
            parts: ['Condenser Coils', 'Compressor', 'Fan Motor']
        },
        {
            symptom: 'Water leaking inside',
            causes: [
                'Clogged defrost drain',
                'Faulty water filter',
                'Damaged water line',
                'Ice maker issues'
            ],
            solutions: [
                'Clear defrost drain',
                'Replace water filter',
                'Check water line connections',
                'Service ice maker'
            ],
            parts: ['Water Filter', 'Defrost Drain', 'Water Line']
        }
    ],
    'Dishwasher': [
        {
            symptom: 'Not cleaning dishes properly',
            causes: [
                'Clogged spray arms',
                'Dirty filter',
                'Faulty wash pump motor',
                'Incorrect detergent'
            ],
            solutions: [
                'Clean spray arm holes',
                'Clean or replace filter',
                'Test wash pump motor',
                'Use proper detergent amount'
            ],
            parts: ['Spray Arms', 'Filter Assembly', 'Wash Pump Motor']
        }
    ]
};

const CommonSymptoms = ({ applianceType, modelNumber, onClose, open = false }) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [loading, setLoading] = useState(false);
    const [searchResults, setSearchResults] = useState([]);
    const [selectedSymptom, setSelectedSymptom] = useState(null);

    // Get symptoms for the appliance type
    const getApplianceSymptoms = () => {
        // Try to match appliance type from common categories
        const categories = Object.keys(COMMON_SYMPTOMS);
        const matchedCategory = categories.find(category =>
            applianceType?.toLowerCase().includes(category.toLowerCase()) ||
            category.toLowerCase().includes(applianceType?.toLowerCase())
        );

        return COMMON_SYMPTOMS[matchedCategory] || [];
    };

    const symptoms = getApplianceSymptoms();

    // AI-driven search simulation
    const handleAISearch = async () => {
        if (!searchQuery.trim()) return;

        setLoading(true);
        setSearchResults([]);

        // Simulate API call delay
        setTimeout(() => {
            // Simple keyword matching across all symptoms
            const allSymptoms = Object.values(COMMON_SYMPTOMS).flat();
            const results = allSymptoms.filter(symptom =>
                symptom.symptom.toLowerCase().includes(searchQuery.toLowerCase()) ||
                symptom.causes.some(cause => cause.toLowerCase().includes(searchQuery.toLowerCase())) ||
                symptom.solutions.some(solution => solution.toLowerCase().includes(searchQuery.toLowerCase()))
            );

            setSearchResults(results);
            setLoading(false);
        }, 1000);
    };

    const handleKeyPress = (event) => {
        if (event.key === 'Enter') {
            handleAISearch();
        }
    };

    const getSeverityIcon = (symptom) => {
        if (symptom.toLowerCase().includes('not') || symptom.toLowerCase().includes('leak')) {
            return <WarningIcon color="error" />;
        }
        if (symptom.toLowerCase().includes('slow') || symptom.toLowerCase().includes('long')) {
            return <InfoIcon color="warning" />;
        }
        return <HelpIcon color="primary" />;
    };

    return (
        <Dialog
            open={open}
            onClose={onClose}
            maxWidth="md"
            fullWidth
            PaperProps={{ sx: { maxHeight: '90vh' } }}
        >
            <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <LightbulbIcon color="primary" />
                Common Symptoms & Solutions
                {modelNumber && (
                    <Chip
                        label={`Model: ${modelNumber}`}
                        variant="outlined"
                        size="small"
                        sx={{ ml: 1 }}
                    />
                )}
                <IconButton
                    aria-label="close"
                    onClick={onClose}
                    sx={{ position: 'absolute', right: 8, top: 8 }}
                >
                    <CloseIcon />
                </IconButton>
            </DialogTitle>

            <DialogContent>
                {/* AI Search Section */}
                <Card sx={{ mb: 3 }}>
                    <CardContent>
                        <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <SearchIcon color="primary" />
                            AI-Powered Symptom Search
                        </Typography>
                        <Typography variant="body2" color="text.secondary" gutterBottom>
                            Describe your appliance issue and get instant solutions
                        </Typography>

                        <Box sx={{ display: 'flex', gap: 1, mt: 2 }}>
                            <TextField
                                fullWidth
                                placeholder="e.g., 'washing machine won't drain' or 'dryer not heating'"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                onKeyPress={handleKeyPress}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <SearchIcon />
                                        </InputAdornment>
                                    ),
                                }}
                            />
                            <Button
                                variant="contained"
                                onClick={handleAISearch}
                                disabled={loading || !searchQuery.trim()}
                                sx={{ minWidth: 100 }}
                            >
                                {loading ? <CircularProgress size={20} /> : 'Search'}
                            </Button>
                        </Box>

                        {/* Search Results */}
                        {searchResults.length > 0 && (
                            <Box sx={{ mt: 2 }}>
                                <Typography variant="subtitle2" gutterBottom>
                                    Search Results ({searchResults.length} found)
                                </Typography>
                                {searchResults.map((result, index) => (
                                    <Accordion key={index} sx={{ mt: 1 }}>
                                        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                {getSeverityIcon(result.symptom)}
                                                <Typography variant="subtitle1">
                                                    {result.symptom}
                                                </Typography>
                                            </Box>
                                        </AccordionSummary>
                                        <AccordionDetails>
                                            <Grid container spacing={2}>
                                                <Grid item xs={12} md={4}>
                                                    <Typography variant="subtitle2" gutterBottom>
                                                        Possible Causes:
                                                    </Typography>
                                                    <List dense>
                                                        {result.causes.map((cause, idx) => (
                                                            <ListItem key={idx}>
                                                                <ListItemText primary={cause} />
                                                            </ListItem>
                                                        ))}
                                                    </List>
                                                </Grid>
                                                <Grid item xs={12} md={4}>
                                                    <Typography variant="subtitle2" gutterBottom>
                                                        Solutions:
                                                    </Typography>
                                                    <List dense>
                                                        {result.solutions.map((solution, idx) => (
                                                            <ListItem key={idx}>
                                                                <ListItemIcon>
                                                                    <CheckCircleIcon color="success" fontSize="small" />
                                                                </ListItemIcon>
                                                                <ListItemText primary={solution} />
                                                            </ListItem>
                                                        ))}
                                                    </List>
                                                </Grid>
                                                <Grid item xs={12} md={4}>
                                                    <Typography variant="subtitle2" gutterBottom>
                                                        Common Parts Needed:
                                                    </Typography>
                                                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                                        {result.parts.map((part, idx) => (
                                                            <Chip
                                                                key={idx}
                                                                label={part}
                                                                size="small"
                                                                variant="outlined"
                                                                icon={<BuildIcon />}
                                                            />
                                                        ))}
                                                    </Box>
                                                </Grid>
                                            </Grid>
                                        </AccordionDetails>
                                    </Accordion>
                                ))}
                            </Box>
                        )}
                    </CardContent>
                </Card>

                {/* Pre-loaded Symptoms */}
                {symptoms.length > 0 && (
                    <Box>
                        <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <HelpIcon color="primary" />
                            Common Issues for {applianceType}
                        </Typography>

                        {symptoms.map((symptom, index) => (
                            <Accordion key={index} sx={{ mt: 1 }}>
                                <AccordionSummary
                                    expandIcon={<ExpandMoreIcon />}
                                    onClick={() => setSelectedSymptom(symptom)}
                                >
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                        {getSeverityIcon(symptom.symptom)}
                                        <Typography variant="subtitle1">
                                            {symptom.symptom}
                                        </Typography>
                                    </Box>
                                </AccordionSummary>
                                <AccordionDetails>
                                    <Grid container spacing={2}>
                                        <Grid item xs={12} md={4}>
                                            <Typography variant="subtitle2" gutterBottom>
                                                Possible Causes:
                                            </Typography>
                                            <List dense>
                                                {symptom.causes.map((cause, idx) => (
                                                    <ListItem key={idx}>
                                                        <ListItemText primary={cause} />
                                                    </ListItem>
                                                ))}
                                            </List>
                                        </Grid>
                                        <Grid item xs={12} md={4}>
                                            <Typography variant="subtitle2" gutterBottom>
                                                Solutions:
                                            </Typography>
                                            <List dense>
                                                {symptom.solutions.map((solution, idx) => (
                                                    <ListItem key={idx}>
                                                        <ListItemIcon>
                                                            <CheckCircleIcon color="success" fontSize="small" />
                                                        </ListItemIcon>
                                                        <ListItemText primary={solution} />
                                                    </ListItem>
                                                ))}
                                            </List>
                                        </Grid>
                                        <Grid item xs={12} md={4}>
                                            <Typography variant="subtitle2" gutterBottom>
                                                Common Parts Needed:
                                            </Typography>
                                            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                                {symptom.parts.map((part, idx) => (
                                                    <Chip
                                                        key={idx}
                                                        label={part}
                                                        size="small"
                                                        variant="outlined"
                                                        icon={<BuildIcon />}
                                                    />
                                                ))}
                                            </Box>
                                        </Grid>
                                    </Grid>
                                </AccordionDetails>
                            </Accordion>
                        ))}
                    </Box>
                )}

                {symptoms.length === 0 && searchResults.length === 0 && (
                    <Alert severity="info">
                        <Typography variant="body2">
                            No specific symptoms found for "{applianceType}".
                            Try using the AI search above to find solutions for your specific issue.
                        </Typography>
                    </Alert>
                )}
            </DialogContent>

            <DialogActions>
                <Button onClick={onClose}>Close</Button>
                <Button
                    variant="contained"
                    onClick={() => window.open('https://www.youtube.com/results?search_query=appliance+repair+' + applianceType, '_blank')}
                >
                    Watch Repair Videos
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default CommonSymptoms; 