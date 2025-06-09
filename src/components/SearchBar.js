import React, { useState, useEffect, useRef } from 'react';
import {
    TextField,
    Autocomplete,
    Box,
    Typography,
    Chip,
    Card,
    CardContent,
    CircularProgress,
    IconButton,
    InputAdornment,
} from '@mui/material';
import {
    Search as SearchIcon,
    Clear as ClearIcon,
    Inventory as InventoryIcon,
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import debounce from 'lodash.debounce';

const StyledAutocomplete = styled(Autocomplete)(({ theme }) => ({
    '& .MuiOutlinedInput-root': {
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        borderRadius: theme.spacing(2),
        backdropFilter: 'blur(10px)',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
        border: '1px solid rgba(255, 255, 255, 0.2)',
        transition: 'all 0.3s ease-in-out',
        '&:hover': {
            boxShadow: '0 12px 40px rgba(0, 0, 0, 0.15)',
            transform: 'translateY(-2px)',
        },
        '&.Mui-focused': {
            boxShadow: '0 12px 40px rgba(25, 118, 210, 0.2)',
            borderColor: theme.palette.primary.main,
        },
    },
    '& .MuiOutlinedInput-input': {
        fontSize: '1.1rem',
        padding: theme.spacing(2),
    },
    '& .MuiAutocomplete-listbox': {
        maxHeight: '400px',
    },
}));

const OptionCard = styled(Card)(({ theme }) => ({
    margin: theme.spacing(0.5, 0),
    cursor: 'pointer',
    transition: 'all 0.2s ease-in-out',
    '&:hover': {
        transform: 'translateX(8px)',
        boxShadow: theme.shadows[4],
    },
}));

const SearchBar = ({
    onSearch,
    searchResults = [],
    loading = false,
    placeholder = "Search for appliance models...",
    onResultSelect,
    forceClose = false
}) => {
    const [inputValue, setInputValue] = useState('');
    const [value, setValue] = useState(null);
    const [open, setOpen] = useState(false);
    const [localResults, setLocalResults] = useState([]);
    const searchRef = useRef(null);

    // Debounced search function with improved stability
    const debouncedSearch = debounce((query) => {
        if (query && query.length >= 2) {
            onSearch(query);
        }
    }, 400); // Increased debounce time for more stability

    useEffect(() => {
        if (inputValue.length >= 2) {
            debouncedSearch(inputValue);
        } else {
            // Clear results immediately when query is too short
            setLocalResults([]);
            setOpen(false);
        }
        return () => {
            debouncedSearch.cancel();
        };
    }, [inputValue, debouncedSearch]);

    // Update local results when search results change, with debouncing
    useEffect(() => {
        const timer = setTimeout(() => {
            setLocalResults(searchResults);
        }, 50); // Small delay to smooth out updates

        return () => clearTimeout(timer);
    }, [searchResults]);

    // Auto-open dropdown when we have local results - more stable logic
    useEffect(() => {
        if (localResults.length > 0 && inputValue.length >= 2 && !forceClose) {
            setOpen(true);
        } else if (inputValue.length < 2 || forceClose) {
            setOpen(false);
        }
    }, [localResults.length, inputValue.length, forceClose]);

    // Force close dropdown when forceClose prop is true
    useEffect(() => {
        if (forceClose) {
            setOpen(false);
            setValue(null); // Also clear selection when modal opens
        }
    }, [forceClose]);

    const handleInputChange = (event, newInputValue) => {
        setInputValue(newInputValue);
        // Clear selection when typing
        if (value && newInputValue !== value.Model_Number) {
            setValue(null);
        }
    };

    const handleChange = (event, newValue) => {
        setValue(newValue);
        if (newValue && onResultSelect) {
            setOpen(false); // Close dropdown when item is selected
            onResultSelect(newValue);
        }
    };

    const handleClear = () => {
        setInputValue('');
        setValue(null);
        setLocalResults([]);
        setOpen(false);
        if (searchRef.current) {
            searchRef.current.focus();
        }
    };

    // Handle keyboard events
    const handleKeyDown = (event) => {
        if (event.key === 'Escape') {
            setOpen(false);
            setValue(null);
        }
    };

    const formatPrice = (price) => {
        if (!price || price === '0.00') return 'Price on request';
        return `$${parseFloat(price).toFixed(2)}`;
    };

    const getAvailabilityColor = (available, hasStock) => {
        if (hasStock === 'Y' && parseInt(available) > 0) return 'success';
        if (parseInt(available) > 0) return 'warning';
        return 'error';
    };

    const getAvailabilityText = (available, hasStock) => {
        if (hasStock === 'Y' && parseInt(available) > 0) return `${available} in stock`;
        if (parseInt(available) > 0) return `${available} available`;
        return 'Out of stock';
    };

    return (
        <Box sx={{ width: '100%', maxWidth: 800, mx: 'auto' }}>
            <StyledAutocomplete
                ref={searchRef}
                open={open}
                onOpen={() => {
                    if (inputValue.length >= 2 && localResults.length > 0) {
                        setOpen(true);
                    }
                }}
                onClose={() => setOpen(false)}
                value={value}
                onChange={handleChange}
                inputValue={inputValue}
                onInputChange={handleInputChange}
                options={localResults}
                getOptionLabel={(option) => option.Model_Number || ''}
                isOptionEqualToValue={(option, value) => option.Model_Number === value.Model_Number}
                loading={loading}
                filterOptions={(x) => x} // Don't filter - we do this on the server side
                renderInput={(params) => (
                    <TextField
                        {...params}
                        placeholder={placeholder}
                        variant="outlined"
                        fullWidth
                        onKeyDown={handleKeyDown}
                        InputProps={{
                            ...params.InputProps,
                            startAdornment: (
                                <InputAdornment position="start">
                                    <SearchIcon color="primary" sx={{ fontSize: 28 }} />
                                </InputAdornment>
                            ),
                            endAdornment: (
                                <InputAdornment position="end">
                                    {loading && <CircularProgress color="primary" size={20} />}
                                    {inputValue && (
                                        <IconButton onClick={handleClear} edge="end" size="small">
                                            <ClearIcon />
                                        </IconButton>
                                    )}
                                </InputAdornment>
                            ),
                        }}
                        sx={{
                            '& .MuiInputLabel-root': {
                                fontSize: '1.1rem',
                            },
                        }}
                    />
                )}
                renderOption={(props, option) => (
                    <Box component="li" {...props} sx={{ p: 0 }}>
                        <OptionCard variant="outlined" sx={{ width: '100%', m: 1 }}>
                            <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
                                <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                                    <InventoryIcon color="primary" sx={{ mt: 0.5, flexShrink: 0 }} />
                                    <Box sx={{ flex: 1, minWidth: 0 }}>
                                        <Typography
                                            variant="h6"
                                            component="div"
                                            sx={{
                                                fontWeight: 600,
                                                color: 'primary.main',
                                                fontSize: '1rem',
                                                mb: 0.5
                                            }}
                                        >
                                            {option.Model_Number}
                                        </Typography>

                                        <Typography
                                            variant="body2"
                                            color="text.secondary"
                                            sx={{
                                                mb: 1,
                                                display: '-webkit-box',
                                                WebkitLineClamp: 2,
                                                WebkitBoxOrient: 'vertical',
                                                overflow: 'hidden',
                                            }}
                                        >
                                            {option.Description}
                                        </Typography>

                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
                                            <Chip
                                                label={option.Brand}
                                                size="small"
                                                color="primary"
                                                variant="outlined"
                                            />

                                            <Chip
                                                label={getAvailabilityText(option.Available, option.Has_Stock)}
                                                size="small"
                                                color={getAvailabilityColor(option.Available, option.Has_Stock)}
                                                variant="filled"
                                            />

                                            {option.DeckPrice && (
                                                <Chip
                                                    label={formatPrice(option.DeckPrice)}
                                                    size="small"
                                                    color="secondary"
                                                    variant="outlined"
                                                />
                                            )}
                                        </Box>

                                        {option.Category_Major && (
                                            <Typography
                                                variant="caption"
                                                color="text.secondary"
                                                sx={{ mt: 0.5, display: 'block' }}
                                            >
                                                Category: {option.Category_Major}
                                                {option.Category_Minor && ` - ${option.Category_Minor}`}
                                            </Typography>
                                        )}
                                    </Box>
                                </Box>
                            </CardContent>
                        </OptionCard>
                    </Box>
                )}
                noOptionsText={
                    inputValue.length < 2
                        ? "Type at least 2 characters to search..."
                        : loading
                            ? "Searching..."
                            : "No appliances found"
                }
                loadingText="Searching appliances..."
                sx={{ mb: 2 }}
            />
        </Box>
    );
};

export default SearchBar; 