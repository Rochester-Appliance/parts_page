import React, { createContext, useContext, useReducer, useEffect } from 'react';

// Cart Context
const CartContext = createContext();

// Cart Actions
const CART_ACTIONS = {
    ADD_ITEM: 'ADD_ITEM',
    ADD_BULK_ITEMS: 'ADD_BULK_ITEMS',
    REMOVE_ITEM: 'REMOVE_ITEM',
    UPDATE_QUANTITY: 'UPDATE_QUANTITY',
    CLEAR_CART: 'CLEAR_CART',
    SET_USER: 'SET_USER',
    SET_SHIPPING_ADDRESS: 'SET_SHIPPING_ADDRESS',
    SET_PAYMENT_METHOD: 'SET_PAYMENT_METHOD',
    SET_DELIVERY_OPTION: 'SET_DELIVERY_OPTION',
    SET_INSTALLATION: 'SET_INSTALLATION',
    ADD_NOTIFICATION_REQUEST: 'ADD_NOTIFICATION_REQUEST',
    REMOVE_NOTIFICATION_REQUEST: 'REMOVE_NOTIFICATION_REQUEST',
    ADD_SERVICE_CALL_REQUEST: 'ADD_SERVICE_CALL_REQUEST',
    ADD_CHILD_ACCOUNT: 'ADD_CHILD_ACCOUNT',
    SWITCH_TO_CHILD_ACCOUNT: 'SWITCH_TO_CHILD_ACCOUNT',
    LOAD_CART: 'LOAD_CART',
    PLACE_ORDER: 'PLACE_ORDER',
    UPDATE_ORDER_STATUS: 'UPDATE_ORDER_STATUS',
    ADD_ORDER_NOTE: 'ADD_ORDER_NOTE',
    LOAD_ORDERS: 'LOAD_ORDERS'
};

// Initial State
const initialState = {
    items: [],
    user: null,
    shippingAddress: null,
    paymentMethod: null,
    deliveryOption: 'standard', // 'standard' or 'dropoff'
    flatDeliveryFee: 15.00, // Admin configurable
    installationRequested: false,
    installationFees: {
        'washing_machine': 150.00,
        'dryer': 125.00,
        'refrigerator': 200.00,
        'dishwasher': 175.00,
        'range': 225.00,
        'microwave': 75.00,
        'default': 100.00
    },
    notificationRequests: [], // For out-of-stock notifications
    serviceCallRequests: [], // For service call scheduling
    totalItems: 0,
    totalPrice: 0,
    deliveryFee: 0,
    installationFee: 0,
    finalTotal: 0,
    isLoggedIn: false,
    // Hierarchical account fields
    accountType: 'standard', // 'parent', 'child', or 'standard'
    parentAccountId: null,
    childAccounts: [],
    globalSettings: null, // Inherited from parent
    // Order management
    orders: [], // Array of placed orders
    currentOrderNumber: 1000 // Starting order number
};

// Cart Reducer
const cartReducer = (state, action) => {
    switch (action.type) {
        case CART_ACTIONS.ADD_ITEM: {
            const existingItemIndex = state.items.findIndex(
                item => (item.Model_Number === action.payload.Model_Number) ||
                    (action.payload.partNumber && item.partNumber === action.payload.partNumber)
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

            const totals = calculateTotals(newItems, state.deliveryOption, state.flatDeliveryFee, state.installationRequested, state.installationFees);
            return {
                ...state,
                items: newItems,
                ...totals
            };
        }

        case CART_ACTIONS.ADD_BULK_ITEMS: {
            let newItems = [...state.items];

            action.payload.forEach(newItem => {
                const existingItemIndex = newItems.findIndex(
                    item => (item.Model_Number === newItem.Model_Number) ||
                        (newItem.partNumber && item.partNumber === newItem.partNumber)
                );

                if (existingItemIndex >= 0) {
                    // Update existing item quantity
                    newItems[existingItemIndex] = {
                        ...newItems[existingItemIndex],
                        quantity: newItems[existingItemIndex].quantity + newItem.quantity
                    };
                } else {
                    // Add new item
                    newItems.push({ ...newItem });
                }
            });

            const totals = calculateTotals(newItems, state.deliveryOption, state.flatDeliveryFee, state.installationRequested, state.installationFees);
            return {
                ...state,
                items: newItems,
                ...totals
            };
        }

        case CART_ACTIONS.REMOVE_ITEM: {
            const newItems = state.items.filter(
                item => (item.Model_Number !== action.payload.Model_Number) &&
                    (!action.payload.partNumber || item.partNumber !== action.payload.partNumber)
            );
            const totals = calculateTotals(newItems, state.deliveryOption, state.flatDeliveryFee, state.installationRequested, state.installationFees);
            return {
                ...state,
                items: newItems,
                ...totals
            };
        }

        case CART_ACTIONS.UPDATE_QUANTITY: {
            const newItems = state.items.map(item =>
                (item.Model_Number === action.payload.Model_Number) ||
                    (action.payload.partNumber && item.partNumber === action.payload.partNumber)
                    ? { ...item, quantity: action.payload.quantity }
                    : item
            ).filter(item => item.quantity > 0); // Remove items with 0 quantity

            const totals = calculateTotals(newItems, state.deliveryOption, state.flatDeliveryFee, state.installationRequested, state.installationFees);
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
                totalPrice: 0,
                deliveryFee: 0,
                installationFee: 0,
                finalTotal: 0
            };
        }

        case CART_ACTIONS.SET_DELIVERY_OPTION: {
            // If installation is checked and dropoff is selected, uncheck installation
            const installationRequested = action.payload === 'dropoff' ? false : state.installationRequested;
            const totals = calculateTotals(
                state.items,
                action.payload,
                state.flatDeliveryFee,
                installationRequested,
                state.installationFees
            );
            return {
                ...state,
                deliveryOption: action.payload,
                installationRequested,
                ...totals
            };
        }

        case CART_ACTIONS.SET_INSTALLATION: {
            // If installation is checked, set delivery to standard
            const deliveryOption = action.payload ? 'standard' : state.deliveryOption;
            const totals = calculateTotals(
                state.items,
                deliveryOption,
                state.flatDeliveryFee,
                action.payload,
                state.installationFees
            );
            return {
                ...state,
                installationRequested: action.payload,
                deliveryOption,
                ...totals
            };
        }

        case CART_ACTIONS.ADD_NOTIFICATION_REQUEST: {
            const exists = state.notificationRequests.find(
                req => req.id === action.payload.id
            );
            if (exists) return state;

            return {
                ...state,
                notificationRequests: [...state.notificationRequests, action.payload]
            };
        }

        case CART_ACTIONS.REMOVE_NOTIFICATION_REQUEST: {
            return {
                ...state,
                notificationRequests: state.notificationRequests.filter(
                    req => req.id !== action.payload.id
                )
            };
        }

        case CART_ACTIONS.ADD_SERVICE_CALL_REQUEST: {
            return {
                ...state,
                serviceCallRequests: [...state.serviceCallRequests, action.payload]
            };
        }

        case CART_ACTIONS.ADD_CHILD_ACCOUNT: {
            return {
                ...state,
                childAccounts: [...state.childAccounts, action.payload]
            };
        }

        case CART_ACTIONS.SWITCH_TO_CHILD_ACCOUNT: {
            // When switching accounts, preserve parent settings but reset cart
            return {
                ...state,
                items: [],
                totalItems: 0,
                totalPrice: 0,
                deliveryFee: 0,
                installationFee: 0,
                finalTotal: 0,
                shippingAddress: action.payload.shippingAddress || null,
                // Preserve parent account settings if switching to child
                globalSettings: action.payload.globalSettings || state.globalSettings
            };
        }

        case CART_ACTIONS.SET_USER: {
            const user = action.payload;
            return {
                ...state,
                user: user,
                isLoggedIn: !!user,
                accountType: user?.accountType || 'standard',
                // If user is a parent account, initialize child accounts
                childAccounts: user?.accountType === 'parent' ? (user.childAccounts || []) : state.childAccounts
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
            const totals = calculateTotals(
                action.payload.items || [],
                action.payload.deliveryOption || 'standard',
                action.payload.flatDeliveryFee || 15.00,
                action.payload.installationRequested || false,
                action.payload.installationFees || state.installationFees
            );
            return {
                ...state,
                ...action.payload,
                ...totals
            };
        }

        case CART_ACTIONS.PLACE_ORDER: {
            const newOrder = {
                id: `order_${Date.now()}`,
                orderNumber: (state.currentOrderNumber + 1).toString(),
                orderDate: new Date().toISOString(),
                items: [...state.items],
                subtotal: state.totalPrice,
                deliveryFee: state.deliveryFee,
                installationFee: state.installationFee,
                total: state.finalTotal,
                status: 'pending',
                user: state.user,
                shippingAddress: state.shippingAddress,
                paymentMethod: state.paymentMethod,
                deliveryOption: state.deliveryOption,
                hasInstallation: state.installationRequested,
                hasDropOffDelivery: state.deliveryOption === 'dropoff',
                notes: [],
                shippingInfo: null,
                installationInfo: null,
                hasReturnRequest: false,
                ...action.payload
            };

            return {
                ...state,
                orders: [...state.orders, newOrder],
                currentOrderNumber: state.currentOrderNumber + 1,
                // Clear cart after placing order
                items: [],
                totalItems: 0,
                totalPrice: 0,
                deliveryFee: 0,
                installationFee: 0,
                finalTotal: 0,
                installationRequested: false
            };
        }

        case CART_ACTIONS.UPDATE_ORDER_STATUS: {
            return {
                ...state,
                orders: state.orders.map(order =>
                    order.id === action.payload.orderId
                        ? { ...order, status: action.payload.status, ...action.payload.additionalData }
                        : order
                )
            };
        }

        case CART_ACTIONS.ADD_ORDER_NOTE: {
            return {
                ...state,
                orders: state.orders.map(order =>
                    order.id === action.payload.orderId
                        ? {
                            ...order,
                            notes: [...(order.notes || []), {
                                id: `note_${Date.now()}`,
                                message: action.payload.note,
                                author: state.user?.email || 'Customer',
                                date: new Date().toISOString()
                            }]
                        }
                        : order
                )
            };
        }

        case CART_ACTIONS.LOAD_ORDERS: {
            return {
                ...state,
                orders: action.payload.orders || [],
                currentOrderNumber: action.payload.currentOrderNumber || state.currentOrderNumber
            };
        }

        default:
            return state;
    }
};

// Calculate cart totals
const calculateTotals = (items, deliveryOption = 'standard', flatDeliveryFee = 15.00, installationRequested = false, installationFees = {}) => {
    const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
    const totalPrice = items.reduce((sum, item) => {
        const price = parseFloat(item.price || 0);
        return sum + (price * item.quantity);
    }, 0);

    // Calculate delivery fee
    let deliveryFee = 0;
    if (totalItems > 0) {
        if (deliveryOption === 'dropoff') {
            // Check if all items are appliances (free drop-off for appliances)
            const hasNonAppliances = items.some(item => !item.isAppliance);
            deliveryFee = hasNonAppliances ? flatDeliveryFee : 0;
        } else {
            // Standard delivery - flat fee regardless of quantity
            deliveryFee = flatDeliveryFee;
        }
    }

    // Calculate installation fee
    let installationFee = 0;
    if (installationRequested && totalItems > 0) {
        // Calculate installation fee based on appliance types in cart
        items.forEach(item => {
            if (item.isAppliance) {
                const applianceType = getApplianceType(item);
                const fee = installationFees[applianceType] || installationFees.default || 100;
                installationFee += fee * item.quantity;
            }
        });
    }

    const finalTotal = totalPrice + deliveryFee + installationFee;

    return {
        totalItems,
        totalPrice: Math.round(totalPrice * 100) / 100,
        deliveryFee: Math.round(deliveryFee * 100) / 100,
        installationFee: Math.round(installationFee * 100) / 100,
        finalTotal: Math.round(finalTotal * 100) / 100
    };
};

// Helper function to determine appliance type from item data
const getApplianceType = (item) => {
    const description = (item.Description || '').toLowerCase();
    const category = (item.Category_Major || '').toLowerCase();

    if (description.includes('wash') || category.includes('wash')) return 'washing_machine';
    if (description.includes('dry') || category.includes('dry')) return 'dryer';
    if (description.includes('refriger') || category.includes('refriger')) return 'refrigerator';
    if (description.includes('dishwash') || category.includes('dishwash')) return 'dishwasher';
    if (description.includes('range') || category.includes('range')) return 'range';
    if (description.includes('microwave') || category.includes('microwave')) return 'microwave';

    return 'default';
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
            paymentMethod: state.paymentMethod,
            deliveryOption: state.deliveryOption,
            flatDeliveryFee: state.flatDeliveryFee,
            notificationRequests: state.notificationRequests
        };
        localStorage.setItem('rochester_appliance_cart', JSON.stringify(cartData));
    }, [state.items, state.shippingAddress, state.paymentMethod, state.deliveryOption, state.flatDeliveryFee, state.notificationRequests]);

    // Save user to localStorage whenever it changes
    useEffect(() => {
        if (state.user) {
            localStorage.setItem('rochester_appliance_user', JSON.stringify(state.user));
        } else {
            localStorage.removeItem('rochester_appliance_user');
        }
    }, [state.user]);

    // Cart Actions
    const addToCart = (item, quantity = 1) => {
        let cartItem;

        if (item.Model_Number) {
            // This is an appliance
            const rawPrice = item.DeckPrice || item.LCNN || '0';
            const numericPrice = parseFloat(rawPrice) || 0;

            cartItem = {
                Model_Number: item.Model_Number,
                Description: item.Description,
                Brand: item.Brand,
                price: numericPrice,
                availability: item.Availability_Status || item.Has_Stock,
                image: item.Image_URL,
                isAppliance: true,
                quantity
            };
        } else {
            // This is a part
            const numericPrice = parseFloat(item.price || item.Price || '0') || 0;

            cartItem = {
                partNumber: item.partNumber || item.PartNumber,
                Model_Number: item.partNumber || item.PartNumber, // For compatibility
                Description: item.description || item.Description,
                Brand: item.brand || item.Brand,
                price: numericPrice,
                availability: item.availability || item.qtyTotal > 0 ? 'Available' : 'Out of Stock',
                image: item.image || item.Image_URL,
                isAppliance: false,
                quantity
            };
        }

        console.log('Adding to cart - Item:', cartItem);
        dispatch({ type: CART_ACTIONS.ADD_ITEM, payload: cartItem });
    };

    const addBulkToCart = (items) => {
        const cartItems = items.map(item => {
            let cartItem;

            if (item.Model_Number) {
                // This is an appliance
                const rawPrice = item.DeckPrice || item.LCNN || '0';
                const numericPrice = parseFloat(rawPrice) || 0;

                cartItem = {
                    Model_Number: item.Model_Number,
                    Description: item.Description,
                    Brand: item.Brand,
                    price: numericPrice,
                    availability: item.Availability_Status || item.Has_Stock,
                    image: item.Image_URL,
                    isAppliance: true,
                    quantity: item.quantity || 1
                };
            } else {
                // This is a part
                const numericPrice = parseFloat(item.price || item.Price || '0') || 0;

                cartItem = {
                    partNumber: item.partNumber || item.PartNumber,
                    Model_Number: item.partNumber || item.PartNumber, // For compatibility
                    Description: item.description || item.Description,
                    Brand: item.brand || item.Brand,
                    price: numericPrice,
                    availability: item.availability || item.qtyTotal > 0 ? 'Available' : 'Out of Stock',
                    image: item.image || item.Image_URL,
                    isAppliance: false,
                    quantity: item.quantity || 1
                };
            }

            return cartItem;
        });

        console.log('Adding bulk items to cart:', cartItems);
        dispatch({ type: CART_ACTIONS.ADD_BULK_ITEMS, payload: cartItems });
    };

    const removeFromCart = (modelNumber, partNumber = null) => {
        dispatch({
            type: CART_ACTIONS.REMOVE_ITEM,
            payload: { Model_Number: modelNumber, partNumber }
        });
    };

    const updateQuantity = (modelNumber, quantity, partNumber = null) => {
        dispatch({
            type: CART_ACTIONS.UPDATE_QUANTITY,
            payload: { Model_Number: modelNumber, quantity, partNumber }
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

    const setDeliveryOption = (option) => {
        dispatch({ type: CART_ACTIONS.SET_DELIVERY_OPTION, payload: option });
    };

    const addNotificationRequest = (item) => {
        const request = {
            id: item.partNumber || item.Model_Number,
            email: state.user?.email || '',
            itemType: item.isAppliance ? 'appliance' : 'part',
            description: item.Description,
            partNumber: item.partNumber,
            modelNumber: item.Model_Number,
            requestedAt: new Date().toISOString()
        };
        dispatch({ type: CART_ACTIONS.ADD_NOTIFICATION_REQUEST, payload: request });
    };

    const removeNotificationRequest = (id) => {
        dispatch({ type: CART_ACTIONS.REMOVE_NOTIFICATION_REQUEST, payload: { id } });
    };

    const isInCart = (modelNumber, partNumber = null) => {
        return state.items.some(item =>
            (item.Model_Number === modelNumber) ||
            (partNumber && item.partNumber === partNumber)
        );
    };

    const getItemQuantity = (modelNumber, partNumber = null) => {
        const item = state.items.find(item =>
            (item.Model_Number === modelNumber) ||
            (partNumber && item.partNumber === partNumber)
        );
        return item ? item.quantity : 0;
    };

    const hasNotificationRequest = (id) => {
        return state.notificationRequests.some(req => req.id === id);
    };

    const setInstallation = (requested) => {
        dispatch({ type: CART_ACTIONS.SET_INSTALLATION, payload: requested });
    };

    const addServiceCallRequest = (request) => {
        const serviceCall = {
            id: Date.now(),
            ...request,
            submittedAt: new Date().toISOString(),
            status: 'pending'
        };
        dispatch({ type: CART_ACTIONS.ADD_SERVICE_CALL_REQUEST, payload: serviceCall });
    };

    const addChildAccount = (childData) => {
        const childAccount = {
            id: Date.now(),
            ...childData,
            parentAccountId: state.user?.id,
            createdAt: new Date().toISOString(),
            // Inherit parent settings
            globalSettings: {
                paymentMethod: state.paymentMethod,
                taxExempt: state.user?.taxExempt || false,
                negotiatedPrices: state.user?.negotiatedPrices || {}
            }
        };
        dispatch({ type: CART_ACTIONS.ADD_CHILD_ACCOUNT, payload: childAccount });
    };

    const switchToChildAccount = (childAccountId) => {
        const childAccount = state.childAccounts.find(child => child.id === childAccountId);
        if (childAccount) {
            dispatch({
                type: CART_ACTIONS.SWITCH_TO_CHILD_ACCOUNT,
                payload: childAccount
            });
        }
    };

    // Order Management Functions
    const placeOrder = (orderData = {}) => {
        if (state.items.length === 0) {
            throw new Error('Cannot place order with empty cart');
        }

        const shippingInfo = {
            carrier: 'FedEx',
            trackingNumber: `TRK${state.currentOrderNumber + 1}${Date.now().toString().slice(-4)}`,
            estimatedDelivery: getEstimatedDeliveryDate()
        };

        dispatch({
            type: CART_ACTIONS.PLACE_ORDER,
            payload: {
                shippingInfo,
                ...orderData
            }
        });

        return state.currentOrderNumber + 1;
    };

    const updateOrderStatus = (orderId, status, additionalData = {}) => {
        dispatch({
            type: CART_ACTIONS.UPDATE_ORDER_STATUS,
            payload: { orderId, status, additionalData }
        });
    };

    const addOrderNote = (orderId, note) => {
        dispatch({
            type: CART_ACTIONS.ADD_ORDER_NOTE,
            payload: { orderId, note }
        });
    };

    const getEstimatedDeliveryDate = () => {
        const now = new Date();
        const estimatedDays = state.installationRequested ? 7 : (state.deliveryOption === 'dropoff' ? 3 : 5);
        const estimatedDate = new Date(now);
        estimatedDate.setDate(now.getDate() + estimatedDays);
        return estimatedDate.toLocaleDateString();
    };

    // Load orders from localStorage
    useEffect(() => {
        // Always load sample orders for demo purposes
        // Clear any existing orders first to ensure demo data shows
        localStorage.removeItem('rochester_appliance_orders');

        import('../data/sampleOrdersData').then(({ createSampleOrders }) => {
            const sampleOrders = createSampleOrders();
            const orderData = {
                orders: sampleOrders,
                currentOrderNumber: 1005
            };
            console.log('Loading sample orders:', sampleOrders);
            dispatch({ type: CART_ACTIONS.LOAD_ORDERS, payload: orderData });
        }).catch(error => {
            console.error('Error loading sample orders:', error);
        });
    }, []);

    // Save orders to localStorage whenever they change
    useEffect(() => {
        const orderData = {
            orders: state.orders,
            currentOrderNumber: state.currentOrderNumber
        };
        localStorage.setItem('rochester_appliance_orders', JSON.stringify(orderData));
    }, [state.orders, state.currentOrderNumber]);

    const value = {
        // State
        ...state,

        // Actions
        addToCart,
        addBulkToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        setUser,
        logout,
        setShippingAddress,
        setPaymentMethod,
        setDeliveryOption,
        setInstallation,
        addNotificationRequest,
        removeNotificationRequest,
        addServiceCallRequest,
        addChildAccount,
        switchToChildAccount,
        isInCart,
        getItemQuantity,
        hasNotificationRequest,
        // Order Management
        placeOrder,
        updateOrderStatus,
        addOrderNote
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