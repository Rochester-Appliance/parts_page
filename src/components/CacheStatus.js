import React, { useState, useEffect } from 'react';
import {
    Box,
    Paper,
    Typography,
    Chip,
    Button,
    LinearProgress,
    Tooltip,
} from '@mui/material';
import {
    Speed as SpeedIcon,
    Cached as CachedIcon,
    Search as SearchIcon,
    Memory as MemoryIcon,
    Refresh as RefreshIcon,
} from '@mui/icons-material';
import dmiApi from '../services/dmiApi';

const CacheStatus = () => {
    const [cacheStatus, setCacheStatus] = useState(null);
    const [isRefreshing, setIsRefreshing] = useState(false);

    const updateCacheStatus = () => {
        const status = dmiApi.getCacheStatus();
        setCacheStatus(status);
    };

    useEffect(() => {
        updateCacheStatus();
        // Update every 5 seconds
        const interval = setInterval(updateCacheStatus, 5000);
        return () => clearInterval(interval);
    }, []);

    const handleClearCache = async () => {
        setIsRefreshing(true);
        dmiApi.clearCache();
        updateCacheStatus();
        setTimeout(() => {
            setIsRefreshing(false);
        }, 1000);
    };

    const handleTestLoad = async () => {
        setIsRefreshing(true);
        console.log('🧪 Testing inventory load...');
        try {
            const inventory = await dmiApi.getInventory();
            console.log('🧪 Test load complete. Inventory length:', inventory.length);
            if (inventory.length > 0) {
                console.log('🧪 Sample item:', inventory[0]);
            }
            updateCacheStatus();
        } catch (error) {
            console.error('🧪 Test load failed:', error);
        } finally {
            setIsRefreshing(false);
        }
    };

    const formatAge = (ageMs) => {
        if (!ageMs) return 'N/A';
        const seconds = Math.floor(ageMs / 1000);
        if (seconds < 60) return `${seconds}s`;
        const minutes = Math.floor(seconds / 60);
        if (minutes < 60) return `${minutes}m`;
        const hours = Math.floor(minutes / 60);
        return `${hours}h ${minutes % 60}m`;
    };

    if (!cacheStatus) return null;

    return (
        <Paper
            sx={{
                p: 2,
                backgroundColor: 'rgba(255, 255, 255, 0.9)',
                backdropFilter: 'blur(10px)',
                borderRadius: 2,
                position: 'fixed',
                bottom: 20,
                left: 20,
                maxWidth: 300,
                zIndex: 1000,
                boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
            }}
        >
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <SpeedIcon color="primary" sx={{ mr: 1 }} />
                <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                    Performance Monitor
                </Typography>
                <Tooltip title="Clear all caches">
                    <Button
                        size="small"
                        onClick={handleClearCache}
                        disabled={isRefreshing}
                        startIcon={<RefreshIcon />}
                    >
                        Clear
                    </Button>
                </Tooltip>
            </Box>

            {isRefreshing && <LinearProgress sx={{ mb: 2 }} />}

            <Box sx={{ mb: 2 }}>
                <Button
                    fullWidth
                    variant="outlined"
                    size="small"
                    onClick={handleTestLoad}
                    disabled={isRefreshing}
                >
                    Test Load Inventory
                </Button>
            </Box>

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <CachedIcon fontSize="small" color="action" />
                    <Typography variant="body2" sx={{ flexGrow: 1 }}>
                        Inventory Cache:
                    </Typography>
                    <Chip
                        label={cacheStatus.inventoryCached ? 'Active' : 'Empty'}
                        size="small"
                        color={cacheStatus.inventoryCached ? 'success' : 'default'}
                    />
                </Box>

                {cacheStatus.inventoryCached && (
                    <Typography variant="caption" color="text.secondary" sx={{ ml: 3 }}>
                        Age: {formatAge(cacheStatus.inventoryCacheAge)}
                    </Typography>
                )}

                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <SearchIcon fontSize="small" color="action" />
                    <Typography variant="body2" sx={{ flexGrow: 1 }}>
                        Search Cache:
                    </Typography>
                    <Chip
                        label={`${cacheStatus.searchCacheSize} queries`}
                        size="small"
                        color={cacheStatus.searchCacheSize > 0 ? 'info' : 'default'}
                    />
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <MemoryIcon fontSize="small" color="action" />
                    <Typography variant="body2" sx={{ flexGrow: 1 }}>
                        Search Index:
                    </Typography>
                    <Chip
                        label={cacheStatus.indexAvailable ? 'Built' : 'Not Ready'}
                        size="small"
                        color={cacheStatus.indexAvailable ? 'success' : 'warning'}
                    />
                </Box>

                {cacheStatus.indexAvailable && (
                    <Typography variant="caption" color="text.secondary" sx={{ ml: 3 }}>
                        Age: {formatAge(cacheStatus.indexAge)}
                    </Typography>
                )}

                <Typography variant="caption" color="text.secondary" sx={{ mt: 1 }}>
                    💡 Search is faster when cache is active
                </Typography>
            </Box>
        </Paper>
    );
};

export default CacheStatus; 