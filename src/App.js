import React, { useState, useCallback } from 'react';
import {
    Box,
    Container,
    Typography,
    AppBar,
    Toolbar,
    IconButton,
    Paper,
    Alert,
    Snackbar,
    Fab,
    useTheme,
    useMediaQuery,
    Button,
    Badge,
    Chip,
} from '@mui/material';
import {
    Home as HomeIcon,
    Phone as PhoneIcon,
    KeyboardArrowUp as ScrollTopIcon,
    Person as PersonIcon,
    ShoppingCart as ShoppingCartIcon,
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';

// Components
import SearchToggle from './components/SearchToggle';
import SearchBar from './components/SearchBar';
import SearchResults from './components/SearchResults';
import ApplianceDetailModal from './components/ApplianceDetailModal';
import ConsumerProfileModal from './components/ConsumerProfileModal';
import CacheStatus from './components/CacheStatus';
import PartsSearch from './components/PartsSearch';
import Cart, { CartFab } from './components/Cart';
import UserAuth from './components/UserAuth';

// Services
import dmiApi from './services/dmiApi';
import vandvIplApi from './services/vandvIplApi';
import { initializeModelMappings } from './data/modelIdMappings';

// Context
import { CartProvider, useCart } from './contexts/CartContext';

const StyledAppBar = styled(AppBar)(({ theme }) => ({
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    backdropFilter: 'blur(10px)',
    color: theme.palette.primary.main,
    boxShadow: '0 2px 20px rgba(0, 0, 0, 0.1)',
    borderBottom: '1px solid rgba(255, 255, 255, 0.2)',
}));

const HeroSection = styled(Box)(({ theme }) => ({
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    minHeight: '60vh',
    display: 'flex',
    alignItems: 'center',
    position: 'relative',
    overflow: 'hidden',
    '&::before': {
        content: '""',
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'rgba(0, 0, 0, 0.3)',
        zIndex: 1,
    },
    '&::after': {
        content: '""',
        position: 'absolute',
        top: '-50%',
        left: '-50%',
        width: '200%',
        height: '200%',
        background: 'url("data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23ffffff" fill-opacity="0.1"%3E%3Ccircle cx="30" cy="30" r="4"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
        animation: 'float 20s infinite linear',
        zIndex: 0,
    },
    '@keyframes float': {
        '0%': { transform: 'translate(-50%, -50%) rotate(0deg)' },
        '100%': { transform: 'translate(-50%, -50%) rotate(360deg)' },
    },
}));

const ContentSection = styled(Box)(({ theme }) => ({
    position: 'relative',
    zIndex: 2,
    width: '100%',
}));

const ScrollToTopFab = styled(Fab)(({ theme }) => ({
    position: 'fixed',
    bottom: theme.spacing(2),
    right: theme.spacing(2),
    zIndex: 1000,
}));

// Add this to check data source
const getDataSourceInfo = () => {
    const config = dmiApi.getConfig ? dmiApi.getConfig() : { USE_MOCK: false };
    return config.USE_MOCK ? 'Mock Data' : 'Live DMI API';
};

function AppContent() {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));
    const { totalItems } = useCart();

    // State management
    const [searchMode, setSearchMode] = useState('appliances');
    const [searchResults, setSearchResults] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [notification, setNotification] = useState({ open: false, message: '', severity: 'info' });
    const [showScrollTop, setShowScrollTop] = useState(false);
    const [selectedAppliance, setSelectedAppliance] = useState(null);
    const [detailModalOpen, setDetailModalOpen] = useState(false);
    const [profileModalOpen, setProfileModalOpen] = useState(false);
    const [cartOpen, setCartOpen] = useState(false);
    const [authOpen, setAuthOpen] = useState(false);

    // Preload inventory on component mount
    React.useEffect(() => {
        console.log('🚀 App mounted, preloading inventory...');
        dmiApi.preloadInventory();

        // Initialize known model ID mappings
        initializeModelMappings(vandvIplApi);
    }, []);

    // Handle scroll to top button visibility
    React.useEffect(() => {
        const handleScroll = () => {
            setShowScrollTop(window.pageYOffset > 300);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    // Search handler with improved stability
    const handleSearch = useCallback(async (query) => {
        if (!query || query.length < 2) {
            // Only clear if we actually have results to avoid unnecessary updates
            if (searchResults.length > 0) {
                setSearchResults([]);
            }
            if (searchQuery) {
                setSearchQuery('');
            }
            return;
        }

        // Don't search if query hasn't changed
        if (query === searchQuery && !loading) {
            return;
        }

        setLoading(true);
        setError(null);
        setSearchQuery(query);

        try {
            if (searchMode === 'appliances') {
                const results = await dmiApi.searchInventoryByModel(query);

                // Only update results if component is still mounted and query is still current
                if (query === searchQuery || query.length >= 2) {
                    setSearchResults(results);

                    if (results.length === 0) {
                        showNotification(`No appliances found for "${query}"`, 'info');
                    } else {
                        showNotification(`Found ${results.length} appliances`, 'success');
                    }
                }
            } else {
                // Parts search - not implemented yet
                setSearchResults([]);
                showNotification('Parts search is coming soon!', 'info');
            }
        } catch (err) {
            console.error('Search error:', err);
            setError(err);
            setSearchResults([]);
            showNotification('Search failed. Please try again.', 'error');
        } finally {
            setLoading(false);
        }
    }, [searchMode, searchQuery, searchResults.length, loading]);

    // Retry handler
    const handleRetry = useCallback(() => {
        if (searchQuery) {
            handleSearch(searchQuery);
        }
    }, [handleSearch, searchQuery]);

    // Appliance selection handler
    const handleApplianceSelect = useCallback((appliance) => {
        console.log('Selected appliance:', appliance);
        setSelectedAppliance(appliance);
        setDetailModalOpen(true);
        showNotification(`Viewing details for ${appliance.Model_Number}`, 'info');
    }, []);

    // Modal close handler
    const handleDetailModalClose = useCallback(() => {
        setDetailModalOpen(false);
        setSelectedAppliance(null);
    }, []);

    // Search mode change handler
    const handleSearchModeChange = useCallback((newMode) => {
        setSearchMode(newMode);
        setSearchResults([]);
        setSearchQuery('');
        setError(null);
    }, []);

    // Notification helper
    const showNotification = useCallback((message, severity = 'info') => {
        setNotification({ open: true, message, severity });
    }, []);

    const closeNotification = useCallback(() => {
        setNotification(prev => ({ ...prev, open: false }));
    }, []);

    // Profile modal handlers
    const handleProfileModalOpen = useCallback(() => {
        setProfileModalOpen(true);
    }, []);

    const handleProfileModalClose = useCallback(() => {
        setProfileModalOpen(false);
    }, []);

    return (
        <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
            {/* App Bar */}
            <StyledAppBar position="fixed" elevation={0}>
                <Toolbar>
                    <IconButton
                        edge="start"
                        color="inherit"
                        aria-label="home"
                        onClick={scrollToTop}
                    >
                        <HomeIcon />
                    </IconButton>

                    <Typography
                        variant="h6"
                        component="div"
                        sx={{
                            flexGrow: 1,
                            fontWeight: 700,
                            background: 'linear-gradient(45deg, #1976d2, #f57c00)',
                            backgroundClip: 'text',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                        }}
                    >
                        Rochester Appliance | Parts Search
                    </Typography>

                    <Chip
                        label={getDataSourceInfo()}
                        color={getDataSourceInfo() === 'Live DMI API' ? 'success' : 'warning'}
                        size="small"
                        sx={{ mr: 2 }}
                    />

                    <Button
                        color="inherit"
                        startIcon={<PersonIcon />}
                        onClick={() => setAuthOpen(true)}
                        sx={{
                            mr: 1,
                            textTransform: 'none',
                            fontSize: '0.95rem',
                            display: { xs: 'none', sm: 'flex' }
                        }}
                    >
                        Account
                    </Button>

                    <IconButton
                        color="inherit"
                        aria-label="account"
                        onClick={() => setAuthOpen(true)}
                        sx={{ display: { xs: 'flex', sm: 'none' }, mr: 1 }}
                    >
                        <PersonIcon />
                    </IconButton>

                    <IconButton
                        color="inherit"
                        aria-label="cart"
                        onClick={() => setCartOpen(true)}
                        sx={{ mr: 1 }}
                    >
                        <Badge badgeContent={totalItems} color="error">
                            <ShoppingCartIcon />
                        </Badge>
                    </IconButton>

                    <IconButton
                        edge="end"
                        color="inherit"
                        aria-label="phone"
                        href="tel:585-272-9933"
                    >
                        <PhoneIcon />
                    </IconButton>
                </Toolbar>
            </StyledAppBar>

            {/* Hero Section */}
            <HeroSection>
                <ContentSection>
                    <Container maxWidth="lg">
                        <Box sx={{ textAlign: 'center', color: 'white', py: 8 }}>
                            <Typography
                                variant={isMobile ? 'h3' : 'h2'}
                                component="h1"
                                gutterBottom
                                sx={{
                                    fontWeight: 700,
                                    textShadow: '2px 2px 4px rgba(0,0,0,0.3)',
                                    mb: 3,
                                }}
                            >
                                Find Your Appliance Parts
                            </Typography>

                            <Typography
                                variant={isMobile ? 'h6' : 'h5'}
                                component="p"
                                sx={{
                                    fontWeight: 300,
                                    opacity: 0.9,
                                    mb: 6,
                                    maxWidth: 600,
                                    mx: 'auto',
                                }}
                            >
                                Search our comprehensive appliance inventory powered by DMI
                            </Typography>

                            {/* Search Toggle */}
                            <SearchToggle
                                searchMode={searchMode}
                                onSearchModeChange={handleSearchModeChange}
                                disabled={loading}
                            />

                            {/* Search Bar for Appliances */}
                            {searchMode === 'appliances' && (
                                <SearchBar
                                    onSearch={handleSearch}
                                    searchResults={searchResults}
                                    loading={loading}
                                    placeholder="Search by model number, brand, or description..."
                                    onResultSelect={handleApplianceSelect}
                                    forceClose={detailModalOpen}
                                />
                            )}

                            {/* Parts Search Component */}
                            {searchMode === 'parts' && (
                                <PartsSearch />
                            )}
                        </Box>
                    </Container>
                </ContentSection>
            </HeroSection>

            {/* Results Section - Only show for appliance search */}
            {searchMode === 'appliances' && (
                <Container maxWidth="lg" sx={{ py: 6, flexGrow: 1 }}>
                    <SearchResults
                        results={searchResults}
                        loading={loading}
                        error={error}
                        query={searchQuery}
                        onRetry={handleRetry}
                        onApplianceSelect={handleApplianceSelect}
                    />
                </Container>
            )}

            {/* Empty space for parts search to maintain layout */}
            {searchMode === 'parts' && (
                <Box sx={{ flexGrow: 1 }} />
            )}

            {/* Footer */}
            <Box
                component="footer"
                sx={{
                    py: 4,
                    backgroundColor: 'rgba(255, 255, 255, 0.9)',
                    backdropFilter: 'blur(10px)',
                    borderTop: '1px solid rgba(0, 0, 0, 0.1)',
                    mt: 'auto',
                }}
            >
                <Container maxWidth="lg">
                    <Box sx={{ textAlign: 'center' }}>
                        <Typography variant="body2" color="text.secondary" gutterBottom>
                            © 2024 Rochester Appliance | 900 Jefferson Rd. Rochester, NY 14623
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            Phone: (585) 272-9933 | Mon-Fri: 9:00am-6:00pm, Sat: 9:00am-4:00pm
                        </Typography>
                    </Box>
                </Container>
            </Box>

            {/* Scroll to Top Button */}
            {showScrollTop && (
                <ScrollToTopFab
                    color="primary"
                    size="medium"
                    onClick={scrollToTop}
                    aria-label="scroll to top"
                >
                    <ScrollTopIcon />
                </ScrollToTopFab>
            )}

            {/* Notification Snackbar */}
            <Snackbar
                open={notification.open}
                autoHideDuration={4000}
                onClose={closeNotification}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
            >
                <Alert
                    onClose={closeNotification}
                    severity={notification.severity}
                    variant="filled"
                    sx={{ width: '100%' }}
                >
                    {notification.message}
                </Alert>
            </Snackbar>

            {/* Appliance Detail Modal */}
            <ApplianceDetailModal
                open={detailModalOpen}
                onClose={handleDetailModalClose}
                appliance={selectedAppliance}
            />

            {/* Consumer Profile Modal */}
            <ConsumerProfileModal
                open={profileModalOpen}
                onClose={handleProfileModalClose}
            />

            {/* Cart Modal */}
            <Cart
                open={cartOpen}
                onClose={() => setCartOpen(false)}
            />

            {/* User Authentication Modal */}
            <UserAuth
                open={authOpen}
                onClose={() => setAuthOpen(false)}
            />

            {/* Floating Cart Button */}
            <CartFab onClick={() => setCartOpen(true)} />

            {/* Performance Monitor - Only show in development */}
            {process.env.NODE_ENV === 'development' && <CacheStatus />}
        </Box>
    );
}

// Main App component wrapped with CartProvider
function App() {
    return (
        <CartProvider>
            <AppContent />
        </CartProvider>
    );
}

export default App; 