import React, { createContext, useContext, useReducer, useEffect } from 'react';

// Cart Context
const CartContext = createContext();

// Cart Actions
const CART_ACTIONS = {
    ADD_ITEM: 'ADD_ITEM',
    REMOVE_ITEM: 'REMOVE_ITEM',
    UPDATE_QUANTITY: 'UPDATE_QUANTITY',
    CLEAR_CART: 'CLEAR_CART',
    SET_USER: 'SET_USER',
    SET_SHIPPING_ADDRESS: 'SET_SHIPPING_ADDRESS',
    SET_PAYMENT_METHOD: 'SET_PAYMENT_METHOD',
    LOAD_CART: 'LOAD_CART'
};

// Initial State
const initialState = {
    items: [],
    user: null,
    shippingAddress: null,
    paymentMethod: null,
    totalItems: 0,
    totalPrice: 0,
    isLoggedIn: false
};

// Cart Reducer
const cartReducer = (state, action) => {
    switch (action.type) {
        case CART_ACTIONS.ADD_ITEM: {
            const existingItemIndex = state.items.findIndex(
                item => item.Model_Number === action.payload.Model_Number
            );

            let newItems;
            if (existingItemIndex >= 0) {
                // Update existing item quantity
                newItems = state.items.map((item, index) =>
                    index === existingItemIndex
                        ? { ...item, quantity: item.quantity + action.payload.quantity }
                        : item
                );
            } else {
                // Add new item
                newItems = [...state.items, { ...action.payload }];
            }

            const totals = calculateTotals(newItems);
            return {
                ...state,
                items: newItems,
                ...totals
            };
        }

        case CART_ACTIONS.REMOVE_ITEM: {
            const newItems = state.items.filter(
                item => item.Model_Number !== action.payload.Model_Number
            );
            const totals = calculateTotals(newItems);
            return {
                ...state,
                items: newItems,
                ...totals
            };
        }

        case CART_ACTIONS.UPDATE_QUANTITY: {
            const newItems = state.items.map(item =>
                item.Model_Number === action.payload.Model_Number
                    ? { ...item, quantity: action.payload.quantity }
                    : item
            ).filter(item => item.quantity > 0); // Remove items with 0 quantity

            const totals = calculateTotals(newItems);
            return {
                ...state,
                items: newItems,
                ...totals
            };
        }

        case CART_ACTIONS.CLEAR_CART: {
            return {
                ...state,
                items: [],
                totalItems: 0,
                totalPrice: 0
            };
        }

        case CART_ACTIONS.SET_USER: {
            return {
                ...state,
                user: action.payload,
                isLoggedIn: !!action.payload
            };
        }

        case CART_ACTIONS.SET_SHIPPING_ADDRESS: {
            return {
                ...state,
                shippingAddress: action.payload
            };
        }

        case CART_ACTIONS.SET_PAYMENT_METHOD: {
            return {
                ...state,
                paymentMethod: action.payload
            };
        }

        case CART_ACTIONS.LOAD_CART: {
            const totals = calculateTotals(action.payload.items || []);
            return {
                ...state,
                ...action.payload,
                ...totals
            };
        }

        default:
            return state;
    }
};

// Calculate cart totals
const calculateTotals = (items) => {
    const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
    const totalPrice = items.reduce((sum, item) => {
        const price = parseFloat(item.price || 0);
        return sum + (price * item.quantity);
    }, 0);

    return {
        totalItems,
        totalPrice: Math.round(totalPrice * 100) / 100 // Round to 2 decimal places
    };
};

// Cart Provider Component
export const CartProvider = ({ children }) => {
    const [state, dispatch] = useReducer(cartReducer, initialState);

    // Load cart from localStorage on mount
    useEffect(() => {
        const savedCart = localStorage.getItem('rochester_appliance_cart');
        const savedUser = localStorage.getItem('rochester_appliance_user');

        if (savedCart) {
            try {
                const cartData = JSON.parse(savedCart);
                dispatch({ type: CART_ACTIONS.LOAD_CART, payload: cartData });
            } catch (error) {
                console.error('Error loading cart from localStorage:', error);
            }
        }

        if (savedUser) {
            try {
                const userData = JSON.parse(savedUser);
                dispatch({ type: CART_ACTIONS.SET_USER, payload: userData });
            } catch (error) {
                console.error('Error loading user from localStorage:', error);
            }
        }
    }, []);

    // Save cart to localStorage whenever it changes
    useEffect(() => {
        const cartData = {
            items: state.items,
            shippingAddress: state.shippingAddress,
            paymentMethod: state.paymentMethod
        };
        localStorage.setItem('rochester_appliance_cart', JSON.stringify(cartData));
    }, [state.items, state.shippingAddress, state.paymentMethod]);

    // Save user to localStorage whenever it changes
    useEffect(() => {
        if (state.user) {
            localStorage.setItem('rochester_appliance_user', JSON.stringify(state.user));
        } else {
            localStorage.removeItem('rochester_appliance_user');
        }
    }, [state.user]);

    // Cart Actions
    const addToCart = (appliance, quantity = 1) => {
        // Get the best available price and convert to number
        const rawPrice = appliance.DeckPrice || appliance.LCNN || '0';
        const numericPrice = parseFloat(rawPrice) || 0;

        const cartItem = {
            Model_Number: appliance.Model_Number,
            Description: appliance.Description,
            Brand: appliance.Brand,
            price: numericPrice,
            availability: appliance.Availability_Status || appliance.Has_Stock,
            image: appliance.Image_URL,
            quantity
        };

        console.log('Adding to cart - Raw price:', rawPrice, 'Numeric price:', numericPrice);
        console.log('Cart item:', cartItem);
        dispatch({ type: CART_ACTIONS.ADD_ITEM, payload: cartItem });
    };

    const removeFromCart = (modelNumber) => {
        dispatch({ type: CART_ACTIONS.REMOVE_ITEM, payload: { Model_Number: modelNumber } });
    };

    const updateQuantity = (modelNumber, quantity) => {
        dispatch({
            type: CART_ACTIONS.UPDATE_QUANTITY,
            payload: { Model_Number: modelNumber, quantity }
        });
    };

    const clearCart = () => {
        dispatch({ type: CART_ACTIONS.CLEAR_CART });
    };

    const setUser = (user) => {
        dispatch({ type: CART_ACTIONS.SET_USER, payload: user });
    };

    const logout = () => {
        dispatch({ type: CART_ACTIONS.SET_USER, payload: null });
        localStorage.removeItem('rochester_appliance_user');
    };

    const setShippingAddress = (address) => {
        dispatch({ type: CART_ACTIONS.SET_SHIPPING_ADDRESS, payload: address });
    };

    const setPaymentMethod = (method) => {
        dispatch({ type: CART_ACTIONS.SET_PAYMENT_METHOD, payload: method });
    };

    const isInCart = (modelNumber) => {
        return state.items.some(item => item.Model_Number === modelNumber);
    };

    const getItemQuantity = (modelNumber) => {
        const item = state.items.find(item => item.Model_Number === modelNumber);
        return item ? item.quantity : 0;
    };

    const value = {
        // State
        ...state,

        // Actions
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        setUser,
        logout,
        setShippingAddress,
        setPaymentMethod,
        isInCart,
        getItemQuantity
    };

    return (
        <CartContext.Provider value={value}>
            {children}
        </CartContext.Provider>
    );
};

// Custom hook to use cart context
export const useCart = () => {
    const context = useContext(CartContext);
    if (!context) {
        throw new Error('useCart must be used within a CartProvider');
    }
    return context;
};

export default CartContext; 