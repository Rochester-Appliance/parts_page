import React from 'react';
import {
    Box,
    Grid,
    Typography,
    CircularProgress,
    Alert,
    Paper,
    Button,
    Fade,
    Skeleton,
} from '@mui/material';
import {
    SearchOff as NoResultsIcon,
    Refresh as RefreshIcon,
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import ApplianceCard from './ApplianceCard';

const StyledPaper = styled(Paper)(({ theme }) => ({
    padding: theme.spacing(4),
    textAlign: 'center',
    borderRadius: theme.spacing(2),
    background: 'rgba(255, 255, 255, 0.9)',
    backdropFilter: 'blur(10px)',
    border: '1px solid rgba(255, 255, 255, 0.2)',
}));

const LoadingContainer = styled(Box)(({ theme }) => ({
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 200,
    gap: theme.spacing(2),
}));

const SearchResults = ({
    results = [],
    loading = false,
    error = null,
    query = '',
    onRetry,
    onApplianceSelect
}) => {
    const renderLoadingSkeleton = () => (
        <Grid container spacing={3}>
            {[...Array(6)].map((_, index) => (
                <Grid item xs={12} sm={6} lg={4} key={index}>
                    <Fade in timeout={200 + index * 100}>
                        <Paper sx={{ p: 3, borderRadius: 2 }}>
                            <Skeleton variant="text" height={40} sx={{ mb: 1 }} />
                            <Skeleton variant="text" height={20} width="80%" sx={{ mb: 2 }} />
                            <Skeleton variant="text" height={16} sx={{ mb: 1 }} />
                            <Skeleton variant="text" height={16} sx={{ mb: 1 }} />
                            <Skeleton variant="text" height={16} width="60%" sx={{ mb: 2 }} />
                            <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                                <Skeleton variant="rectangular" width={80} height={24} />
                                <Skeleton variant="rectangular" width={100} height={24} />
                            </Box>
                            <Skeleton variant="rectangular" height={120} />
                        </Paper>
                    </Fade>
                </Grid>
            ))}
        </Grid>
    );

    const renderError = () => (
        <StyledPaper elevation={3}>
            <Alert
                severity="error"
                sx={{
                    mb: 2,
                    backgroundColor: 'transparent',
                    border: '1px solid',
                    borderColor: 'error.main',
                }}
            >
                <Typography variant="h6" gutterBottom>
                    Search Error
                </Typography>
                <Typography variant="body2">
                    {error?.message || 'An error occurred while searching. Please try again.'}
                </Typography>
            </Alert>

            {onRetry && (
                <Button
                    variant="contained"
                    color="error"
                    startIcon={<RefreshIcon />}
                    onClick={onRetry}
                    sx={{
                        mt: 2,
                        borderRadius: 2,
                        textTransform: 'none',
                        fontWeight: 500,
                    }}
                >
                    Try Again
                </Button>
            )}
        </StyledPaper>
    );

    const renderNoResults = () => (
        <StyledPaper elevation={3}>
            <NoResultsIcon
                sx={{
                    fontSize: 64,
                    color: 'text.secondary',
                    mb: 2
                }}
            />
            <Typography variant="h5" gutterBottom color="text.secondary">
                No appliances found
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
                {query
                    ? `No results found for "${query}". Try a different search term.`
                    : 'Start typing to search our appliance inventory.'
                }
            </Typography>

            {query && (
                <Box sx={{ mt: 3 }}>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                        Search suggestions:
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        • Try searching by model number (e.g., "FFGC3026SS")<br />
                        • Use brand names (e.g., "Frigidaire", "GE", "Whirlpool")<br />
                        • Search by appliance type (e.g., "dishwasher", "refrigerator")<br />
                        • Check your spelling and try broader terms
                    </Typography>
                </Box>
            )}
        </StyledPaper>
    );

    const renderResults = () => (
        <Box>
            <Box sx={{ mb: 3, textAlign: 'center' }}>
                <Typography variant="h6" color="text.secondary">
                    Found {results.length} appliance{results.length !== 1 ? 's' : ''}
                    {query && (
                        <span> for "{query}"</span>
                    )}
                </Typography>
            </Box>

            <Grid container spacing={3}>
                {results.map((appliance, index) => (
                    <Grid item xs={12} sm={6} lg={4} key={appliance.Model_Number || index}>
                        <Fade in timeout={200 + index * 50}>
                            <Box>
                                <ApplianceCard
                                    appliance={appliance}
                                    onViewDetails={onApplianceSelect}
                                />
                            </Box>
                        </Fade>
                    </Grid>
                ))}
            </Grid>
        </Box>
    );

    // Main render logic
    if (loading) {
        return (
            <Fade in>
                <Box>
                    {renderLoadingSkeleton()}
                </Box>
            </Fade>
        );
    }

    if (error) {
        return (
            <Fade in>
                <Box>
                    {renderError()}
                </Box>
            </Fade>
        );
    }

    if (!results || results.length === 0) {
        return (
            <Fade in>
                <Box>
                    {renderNoResults()}
                </Box>
            </Fade>
        );
    }

    return (
        <Fade in>
            <Box>
                {renderResults()}
            </Box>
        </Fade>
    );
};

export default SearchResults; 