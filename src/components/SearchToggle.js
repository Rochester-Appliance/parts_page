import React from 'react';
import {
    ToggleButtonGroup,
    ToggleButton,
    Box,
    Paper,
    Typography,
} from '@mui/material';
import {
    Build as PartsIcon,
    Kitchen as ApplianceIcon,
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';

const StyledToggleButtonGroup = styled(ToggleButtonGroup)(({ theme }) => ({
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: theme.spacing(2),
    padding: theme.spacing(0.5),
    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
    backdropFilter: 'blur(10px)',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    '& .MuiToggleButton-root': {
        border: 'none',
        borderRadius: theme.spacing(1.5),
        padding: theme.spacing(1.5, 3),
        margin: theme.spacing(0.25),
        fontWeight: 500,
        fontSize: '1rem',
        textTransform: 'none',
        transition: 'all 0.3s ease-in-out',
        minWidth: 140,
        '&.Mui-selected': {
            backgroundColor: theme.palette.primary.main,
            color: 'white',
            boxShadow: '0 4px 20px rgba(25, 118, 210, 0.3)',
            transform: 'translateY(-1px)',
            '&:hover': {
                backgroundColor: theme.palette.primary.dark,
            },
        },
        '&:not(.Mui-selected)': {
            color: theme.palette.text.secondary,
            '&:hover': {
                backgroundColor: 'rgba(25, 118, 210, 0.04)',
                transform: 'translateY(-1px)',
            },
        },
    },
}));

const SearchToggle = ({ searchMode, onSearchModeChange, disabled }) => {
    const handleChange = (event, newMode) => {
        if (newMode !== null) {
            onSearchModeChange(newMode);
        }
    };

    return (
        <Box sx={{ mb: 4, textAlign: 'center' }}>
            <ToggleButtonGroup
                value={searchMode}
                exclusive
                onChange={handleChange}
                aria-label="search mode"
                disabled={disabled}
                sx={{
                    backgroundColor: 'rgba(255, 255, 255, 0.9)',
                    '& .MuiToggleButton-root': {
                        px: 4,
                        py: 1.5,
                        color: 'text.primary',
                        '&.Mui-selected': {
                            backgroundColor: 'primary.main',
                            color: 'white',
                            '&:hover': {
                                backgroundColor: 'primary.dark',
                            },
                        },
                    },
                }}
            >
                <ToggleButton value="appliances" aria-label="search appliances">
                    <ApplianceIcon sx={{ mr: 1 }} />
                    <Box sx={{ textAlign: 'left' }}>
                        <Typography variant="button" display="block">
                            Appliances
                        </Typography>
                        <Typography variant="caption" display="block" sx={{ opacity: 0.8 }}>
                            Search complete units (DMI)
                        </Typography>
                    </Box>
                </ToggleButton>
                <ToggleButton value="parts" aria-label="search parts">
                    <PartsIcon sx={{ mr: 1 }} />
                    <Box sx={{ textAlign: 'left' }}>
                        <Typography variant="button" display="block">
                            Parts
                        </Typography>
                        <Typography variant="caption" display="block" sx={{ opacity: 0.8 }}>
                            Search repair parts (V&V)
                        </Typography>
                    </Box>
                </ToggleButton>
            </ToggleButtonGroup>

            {/* Help text */}
            <Typography variant="body2" sx={{ mt: 2, opacity: 0.8 }}>
                {searchMode === 'appliances'
                    ? 'Search for complete appliances by model number, brand, or description'
                    : 'Search for specific repair parts by manufacturer and part number'
                }
            </Typography>
        </Box>
    );
};

export default SearchToggle; 