import React, { useState } from 'react';
import {
    Box,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Checkbox,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TextField,
    Typography,
    Chip,
    IconButton,
    Alert,
    FormControlLabel,
    Paper,
} from '@mui/material';
import {
    Close as CloseIcon,
    ShoppingCart as CartIcon,
    Add as AddIcon,
    Remove as RemoveIcon,
    SelectAll as SelectAllIcon,
} from '@mui/icons-material';
import { useCart } from '../contexts/CartContext';

const BulkAddDialog = ({ open, onClose, parts = [], modelNumber }) => {
    const { addBulkToCart } = useCart();
    const [selectedParts, setSelectedParts] = useState({});
    const [quantities, setQuantities] = useState({});

    // Initialize quantities for each part
    React.useEffect(() => {
        if (parts.length > 0) {
            const initialQuantities = {};
            parts.forEach(part => {
                initialQuantities[part.partNumber] = 1;
            });
            setQuantities(initialQuantities);
        }
    }, [parts]);

    const handleSelectPart = (partNumber, selected) => {
        setSelectedParts(prev => ({
            ...prev,
            [partNumber]: selected
        }));
    };

    const handleSelectAll = () => {
        const allSelected = Object.keys(selectedParts).length === parts.length &&
            Object.values(selectedParts).every(Boolean);

        if (allSelected) {
            // Deselect all
            setSelectedParts({});
        } else {
            // Select all
            const newSelected = {};
            parts.forEach(part => {
                newSelected[part.partNumber] = true;
            });
            setSelectedParts(newSelected);
        }
    };

    const handleQuantityChange = (partNumber, quantity) => {
        setQuantities(prev => ({
            ...prev,
            [partNumber]: Math.max(1, quantity)
        }));
    };

    const handleAddToCart = () => {
        const selectedPartsToAdd = parts
            .filter(part => selectedParts[part.partNumber])
            .map(part => ({
                ...part,
                quantity: quantities[part.partNumber] || 1
            }));

        if (selectedPartsToAdd.length === 0) {
            alert('Please select at least one part to add to cart.');
            return;
        }

        addBulkToCart(selectedPartsToAdd);

        // Reset selections
        setSelectedParts({});

        alert(`Added ${selectedPartsToAdd.length} parts to cart!`);
        onClose();
    };

    const selectedCount = Object.values(selectedParts).filter(Boolean).length;
    const totalPrice = parts
        .filter(part => selectedParts[part.partNumber])
        .reduce((sum, part) => {
            const quantity = quantities[part.partNumber] || 1;
            const price = parseFloat(part.price || 0);
            return sum + (price * quantity);
        }, 0);

    const formatPrice = (price) => {
        return `$${parseFloat(price || 0).toFixed(2)}`;
    };

    const getStockStatus = (part) => {
        const qty = parseInt(part.qtyTotal) || 0;
        if (qty > 10) return { label: 'In Stock', color: 'success' };
        if (qty > 0) return { label: `Only ${qty} left`, color: 'warning' };
        return { label: 'Out of Stock', color: 'error' };
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="lg" fullWidth>
            <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <CartIcon color="primary" />
                Bulk Add Parts to Cart
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
                {parts.length === 0 ? (
                    <Alert severity="info">
                        No parts available for bulk selection.
                    </Alert>
                ) : (
                    <>
                        {/* Selection Summary */}
                        <Box sx={{ mb: 2, p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
                            <Typography variant="h6" gutterBottom>
                                Selection Summary
                            </Typography>
                            <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                                <Typography variant="body2">
                                    <strong>{selectedCount}</strong> of <strong>{parts.length}</strong> parts selected
                                </Typography>
                                <Typography variant="body2">
                                    Total: <strong>{formatPrice(totalPrice)}</strong>
                                </Typography>
                                <Button
                                    size="small"
                                    variant="outlined"
                                    startIcon={<SelectAllIcon />}
                                    onClick={handleSelectAll}
                                >
                                    {Object.values(selectedParts).every(Boolean) && selectedCount === parts.length
                                        ? 'Deselect All'
                                        : 'Select All'
                                    }
                                </Button>
                            </Box>
                        </Box>

                        {/* Parts Table */}
                        <TableContainer component={Paper} sx={{ maxHeight: 400 }}>
                            <Table stickyHeader>
                                <TableHead>
                                    <TableRow>
                                        <TableCell padding="checkbox">
                                            <FormControlLabel
                                                control={
                                                    <Checkbox
                                                        checked={selectedCount === parts.length && parts.length > 0}
                                                        indeterminate={selectedCount > 0 && selectedCount < parts.length}
                                                        onChange={handleSelectAll}
                                                    />
                                                }
                                                label=""
                                            />
                                        </TableCell>
                                        <TableCell>Part Number</TableCell>
                                        <TableCell>Description</TableCell>
                                        <TableCell>Price</TableCell>
                                        <TableCell>Stock</TableCell>
                                        <TableCell>Quantity</TableCell>
                                        <TableCell>Subtotal</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {parts.map((part) => {
                                        const isSelected = selectedParts[part.partNumber] || false;
                                        const quantity = quantities[part.partNumber] || 1;
                                        const price = parseFloat(part.price || 0);
                                        const subtotal = price * quantity;
                                        const stockStatus = getStockStatus(part);

                                        return (
                                            <TableRow
                                                key={part.partNumber}
                                                selected={isSelected}
                                                sx={{
                                                    '&:hover': {
                                                        bgcolor: 'action.hover',
                                                        cursor: 'pointer'
                                                    }
                                                }}
                                                onClick={() => handleSelectPart(part.partNumber, !isSelected)}
                                            >
                                                <TableCell padding="checkbox">
                                                    <Checkbox
                                                        checked={isSelected}
                                                        onChange={(e) => {
                                                            e.stopPropagation();
                                                            handleSelectPart(part.partNumber, e.target.checked);
                                                        }}
                                                    />
                                                </TableCell>
                                                <TableCell>
                                                    <Typography variant="body2" fontWeight="medium">
                                                        {part.partNumber}
                                                    </Typography>
                                                </TableCell>
                                                <TableCell>
                                                    <Typography variant="body2">
                                                        {part.description}
                                                    </Typography>
                                                </TableCell>
                                                <TableCell>
                                                    <Typography variant="body2">
                                                        {formatPrice(price)}
                                                    </Typography>
                                                </TableCell>
                                                <TableCell>
                                                    <Chip
                                                        label={stockStatus.label}
                                                        color={stockStatus.color}
                                                        size="small"
                                                    />
                                                </TableCell>
                                                <TableCell>
                                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                        <IconButton
                                                            size="small"
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                handleQuantityChange(part.partNumber, quantity - 1);
                                                            }}
                                                            disabled={quantity <= 1}
                                                        >
                                                            <RemoveIcon />
                                                        </IconButton>
                                                        <TextField
                                                            size="small"
                                                            value={quantity}
                                                            onChange={(e) => {
                                                                e.stopPropagation();
                                                                const value = parseInt(e.target.value) || 1;
                                                                handleQuantityChange(part.partNumber, value);
                                                            }}
                                                            inputProps={{
                                                                min: 1,
                                                                type: 'number',
                                                                style: { textAlign: 'center', width: '60px' }
                                                            }}
                                                        />
                                                        <IconButton
                                                            size="small"
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                handleQuantityChange(part.partNumber, quantity + 1);
                                                            }}
                                                        >
                                                            <AddIcon />
                                                        </IconButton>
                                                    </Box>
                                                </TableCell>
                                                <TableCell>
                                                    <Typography variant="body2" fontWeight="medium">
                                                        {formatPrice(subtotal)}
                                                    </Typography>
                                                </TableCell>
                                            </TableRow>
                                        );
                                    })}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </>
                )}
            </DialogContent>

            <DialogActions sx={{ p: 2, gap: 1 }}>
                <Button onClick={onClose}>Cancel</Button>
                <Button
                    variant="contained"
                    startIcon={<CartIcon />}
                    onClick={handleAddToCart}
                    disabled={selectedCount === 0}
                >
                    Add {selectedCount} Part{selectedCount !== 1 ? 's' : ''} to Cart
                    {selectedCount > 0 && ` (${formatPrice(totalPrice)})`}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default BulkAddDialog; 