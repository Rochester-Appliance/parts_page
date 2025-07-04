// Sample orders for demonstration
export const createSampleOrders = () => {
  console.log('Creating sample orders...');
  const sampleOrders = [
    {
      id: 'order_1701234567890',
      orderNumber: '1001',
      orderDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), // 5 days ago
      items: [
        {
          id: 'item_1',
          Model_Number: 'WTW5000DW',
          Description: 'Whirlpool Top Load Washer - White',
          Brand: 'Whirlpool',
          price: 649.99,
          quantity: 1,
          availability: 'Delivered',
          isAppliance: true,
          partNumber: null,
          status: 'delivered'
        },
        {
          id: 'item_2',
          Model_Number: 'W10130913',
          Description: 'Washer Drain Pump Assembly',
          Brand: 'Whirlpool',
          price: 89.95,
          quantity: 1,
          availability: 'In Stock',
          isAppliance: false,
          partNumber: 'W10130913',
          status: 'delivered'
        },
        {
          id: 'item_3',
          Model_Number: 'W10464464',
          Description: 'Washer Lid Switch',
          Brand: 'Whirlpool',
          price: 34.99,
          quantity: 2,
          availability: 'In Stock',
          isAppliance: false,
          partNumber: 'W10464464',
          status: 'delivered'
        }
      ],
      subtotal: 809.92,
      deliveryFee: 15.00,
      installationFee: 150.00,
      total: 974.92,
      status: 'delivered',
      user: { email: 'demo@example.com', name: 'Demo User' },
      shippingAddress: {
        name: 'Demo User',
        street: '123 Main Street',
        city: 'Rochester',
        state: 'NY',
        zip: '14623',
        phone: '(585) 555-0123'
      },
      paymentMethod: 'credit_card',
      deliveryOption: 'standard',
      hasInstallation: true,
      hasDropOffDelivery: false,
      shippingInfo: {
        carrier: 'FedEx',
        trackingNumber: 'TRK10011234',
        estimatedDelivery: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toLocaleDateString(),
        actualDelivery: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toLocaleDateString()
      },
      installationInfo: {
        technicianName: 'Mike Johnson',
        scheduledDate: new Date().toLocaleDateString(),
        timeWindow: '8 AM - 12 PM',
        completedDate: new Date().toLocaleDateString(),
        notes: 'Installation completed successfully. All parts working properly.'
      },
      trackingEvents: [
        {
          id: 'event_1',
          timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
          status: 'pending',
          title: 'Order Placed',
          description: 'Your order has been received and payment verified.',
          location: 'Rochester Appliance'
        },
        {
          id: 'event_2',
          timestamp: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
          status: 'confirmed',
          title: 'Order Confirmed',
          description: 'All items confirmed in stock and order processing started.',
          location: 'Rochester Appliance'
        },
        {
          id: 'event_3',
          timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
          status: 'processing',
          title: 'Items Gathered',
          description: 'All items collected from warehouse and prepared for shipment.',
          location: 'Rochester Appliance Warehouse'
        },
        {
          id: 'event_4',
          timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
          status: 'shipped',
          title: 'Package Shipped',
          description: 'Package picked up by FedEx and on route to destination.',
          location: 'Rochester, NY'
        },
        {
          id: 'event_5',
          timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
          status: 'delivered',
          title: 'Package Delivered',
          description: 'Package successfully delivered to customer address.',
          location: 'Rochester, NY'
        },
        {
          id: 'event_6',
          timestamp: new Date().toISOString(),
          status: 'installation_complete',
          title: 'Installation Complete',
          description: 'Washer installed and tested successfully. Customer training provided.',
          location: 'Customer Location'
        }
      ],
      notes: [
        {
          id: 'note_1',
          message: 'Order confirmed and payment processed successfully. Installation scheduled.',
          author: 'System',
          date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString()
        },
        {
          id: 'note_2',
          message: 'Items shipped via FedEx. Customer notified with tracking information.',
          author: 'Shipping Dept',
          date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString()
        },
        {
          id: 'note_3',
          message: 'Installation completed successfully. Customer very satisfied with service.',
          author: 'Tech: Mike Johnson',
          date: new Date().toISOString()
        }
      ],
      hasReturnRequest: false
    },
    {
      id: 'order_1701234567891',
      orderNumber: '1002',
      orderDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days ago
      items: [
        {
          id: 'item_3',
          Model_Number: 'WRS325SDHZ',
          Description: 'Whirlpool 25 cu ft Side-by-Side Refrigerator - Stainless Steel',
          Brand: 'Whirlpool',
          price: 1299.99,
          quantity: 1,
          availability: 'In Transit',
          isAppliance: true,
          partNumber: null,
          status: 'out_for_delivery'
        },
        {
          id: 'item_4',
          Model_Number: 'W10295370A',
          Description: 'Refrigerator Water Filter (2-Pack)',
          Brand: 'Whirlpool',
          price: 89.99,
          quantity: 1,
          availability: 'In Transit',
          isAppliance: false,
          partNumber: 'W10295370A',
          status: 'out_for_delivery'
        }
      ],
      subtotal: 1389.98,
      deliveryFee: 0, // Free drop-off for appliances
      installationFee: 0,
      total: 1389.98,
      status: 'out_for_delivery',
      user: { email: 'demo@example.com', name: 'Demo User' },
      shippingAddress: {
        name: 'Demo User',
        street: '123 Main Street',
        city: 'Rochester',
        state: 'NY',
        zip: '14623',
        phone: '(585) 555-0123'
      },
      paymentMethod: 'corporate_account',
      deliveryOption: 'dropoff',
      hasInstallation: false,
      hasDropOffDelivery: true,
      shippingInfo: {
        carrier: 'FedEx',
        trackingNumber: 'TRK10025678',
        estimatedDelivery: new Date().toLocaleDateString()
      },
      trackingEvents: [
        {
          id: 'event_7',
          timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
          status: 'pending',
          title: 'Order Placed',
          description: 'Large appliance order received and corporate account verified.',
          location: 'Rochester Appliance'
        },
        {
          id: 'event_8',
          timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
          status: 'shipped',
          title: 'Appliance Dispatched',
          description: 'Refrigerator loaded for drop-off delivery.',
          location: 'Rochester Appliance Warehouse'
        },
        {
          id: 'event_9',
          timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
          status: 'out_for_delivery',
          title: 'Out for Delivery',
          description: 'Delivery truck en route to customer location.',
          location: 'Rochester, NY'
        }
      ],
      notes: [
        {
          id: 'note_4',
          message: 'Large appliance order - scheduled for drop-off delivery.',
          author: 'Shipping Dept',
          date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
        },
        {
          id: 'note_5',
          message: 'Delivery truck dispatched. Customer will receive call 30 minutes before arrival.',
          author: 'Delivery Team',
          date: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString()
        }
      ],
      hasReturnRequest: false
    },
    {
      id: 'order_1701234567892',
      orderNumber: '1003',
      orderDate: new Date().toISOString(), // Today
      items: [
        {
          id: 'item_5',
          Model_Number: 'W10295370A',
          Description: 'Refrigerator Water Filter',
          Brand: 'Whirlpool',
          price: 49.99,
          quantity: 2,
          availability: 'Processing',
          isAppliance: false,
          partNumber: 'W10295370A',
          status: 'processing'
        },
        {
          id: 'item_6',
          Model_Number: 'W10311524',
          Description: 'Dryer Lint Screen',
          Brand: 'Whirlpool',
          price: 24.95,
          quantity: 1,
          availability: 'Processing',
          isAppliance: false,
          partNumber: 'W10311524',
          status: 'processing'
        },
        {
          id: 'item_7',
          Model_Number: 'WPW10348269',
          Description: 'Dishwasher Upper Rack Assembly',
          Brand: 'Whirlpool',
          price: 129.99,
          quantity: 1,
          availability: 'Processing',
          isAppliance: false,
          partNumber: 'WPW10348269',
          status: 'processing'
        }
      ],
      subtotal: 254.92,
      deliveryFee: 15.00,
      installationFee: 0,
      total: 269.92,
      status: 'processing',
      user: { email: 'demo@example.com', name: 'Demo User' },
      shippingAddress: {
        name: 'Demo User',
        street: '123 Main Street',
        city: 'Rochester',
        state: 'NY',
        zip: '14623',
        phone: '(585) 555-0123'
      },
      paymentMethod: 'credit_card',
      deliveryOption: 'standard',
      hasInstallation: false,
      hasDropOffDelivery: false,
      shippingInfo: null,
      trackingEvents: [
        {
          id: 'event_10',
          timestamp: new Date().toISOString(),
          status: 'pending',
          title: 'Order Received',
          description: 'Order received and payment verification in progress.',
          location: 'Rochester Appliance'
        },
        {
          id: 'event_11',
          timestamp: new Date(Date.now() + 30 * 60 * 1000).toISOString(),
          status: 'confirmed',
          title: 'Payment Verified',
          description: 'Payment confirmed. Order moved to processing queue.',
          location: 'Rochester Appliance'
        }
      ],
      notes: [
        {
          id: 'note_6',
          message: 'Order received and payment verified. Processing parts order.',
          author: 'System',
          date: new Date().toISOString()
        }
      ],
      hasReturnRequest: false
    },
    {
      id: 'order_1701234567893',
      orderNumber: '1004',
      orderDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(), // 1 week ago
      items: [
        {
          id: 'item_8',
          Model_Number: 'WED4815EW',
          Description: 'Whirlpool Electric Dryer - White',
          Brand: 'Whirlpool',
          price: 549.99,
          quantity: 1,
          availability: 'Returned',
          isAppliance: true,
          partNumber: null,
          status: 'returned'
        }
      ],
      subtotal: 549.99,
      deliveryFee: 15.00,
      installationFee: 125.00,
      total: 689.99,
      status: 'returned',
      user: { email: 'demo@example.com', name: 'Demo User' },
      shippingAddress: {
        name: 'Demo User',
        street: '123 Main Street',
        city: 'Rochester',
        state: 'NY',
        zip: '14623',
        phone: '(585) 555-0123'
      },
      paymentMethod: 'credit_card',
      deliveryOption: 'standard',
      hasInstallation: true,
      hasDropOffDelivery: false,
      shippingInfo: {
        carrier: 'FedEx',
        trackingNumber: 'TRK10034567',
        estimatedDelivery: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toLocaleDateString(),
        actualDelivery: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toLocaleDateString()
      },
      trackingEvents: [
        {
          id: 'event_12',
          timestamp: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
          status: 'pending',
          title: 'Order Placed',
          description: 'Dryer order placed with installation service.',
          location: 'Rochester Appliance'
        },
        {
          id: 'event_13',
          timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
          status: 'shipped',
          title: 'Dryer Shipped',
          description: 'Dryer dispatched for delivery.',
          location: 'Rochester Appliance'
        },
        {
          id: 'event_14',
          timestamp: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
          status: 'delivered',
          title: 'Dryer Delivered',
          description: 'Dryer delivered and installation attempted.',
          location: 'Customer Location'
        },
        {
          id: 'event_15',
          timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
          status: 'returned',
          title: 'Return Processed',
          description: 'Dryer returned due to incompatible electrical requirements.',
          location: 'Rochester Appliance'
        }
      ],
      notes: [
        {
          id: 'note_7',
          message: 'Customer requested return due to electrical incompatibility (240V required, customer has 120V).',
          author: 'Tech: Sarah Wilson',
          date: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString()
        },
        {
          id: 'note_8',
          message: 'Return approved. Full refund processed. Customer advised on electrical requirements.',
          author: 'Customer Service',
          date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
        }
      ],
      hasReturnRequest: true,
      returnInfo: {
        reason: 'Electrical incompatibility',
        requestedDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
        processedDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        refundAmount: 689.99
      }
    },
    {
      id: 'order_1701234567894',
      orderNumber: '1005',
      orderDate: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(), // 10 days ago
      items: [
        {
          id: 'item_9',
          Model_Number: 'W10276645',
          Description: 'Dishwasher Control Board',
          Brand: 'Whirlpool',
          price: 189.99,
          quantity: 1,
          availability: 'Backordered',
          isAppliance: false,
          partNumber: 'W10276645',
          status: 'backordered'
        },
        {
          id: 'item_10',
          Model_Number: 'W10300218',
          Description: 'Dishwasher Spray Arm',
          Brand: 'Whirlpool',
          price: 45.99,
          quantity: 1,
          availability: 'Delivered',
          isAppliance: false,
          partNumber: 'W10300218',
          status: 'delivered'
        }
      ],
      subtotal: 235.98,
      deliveryFee: 15.00,
      installationFee: 0,
      total: 250.98,
      status: 'partially_shipped',
      user: { email: 'demo@example.com', name: 'Demo User' },
      shippingAddress: {
        name: 'Demo User',
        street: '123 Main Street',
        city: 'Rochester',
        state: 'NY',
        zip: '14623',
        phone: '(585) 555-0123'
      },
      paymentMethod: 'net_terms',
      deliveryOption: 'standard',
      hasInstallation: false,
      hasDropOffDelivery: false,
      shippingInfo: {
        carrier: 'FedEx',
        trackingNumber: 'TRK10045678',
        estimatedDelivery: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toLocaleDateString()
      },
      trackingEvents: [
        {
          id: 'event_16',
          timestamp: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
          status: 'pending',
          title: 'Order Placed',
          description: 'Dishwasher parts order placed on Net Terms.',
          location: 'Rochester Appliance'
        },
        {
          id: 'event_17',
          timestamp: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(),
          status: 'partially_shipped',
          title: 'Partial Shipment',
          description: 'Spray arm shipped. Control board backordered - ETA 3-5 business days.',
          location: 'Rochester Appliance'
        }
      ],
      notes: [
        {
          id: 'note_9',
          message: 'Control board temporarily out of stock. Customer notified of delay.',
          author: 'Parts Dept',
          date: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString()
        },
        {
          id: 'note_10',
          message: 'Spray arm delivered successfully. Awaiting control board arrival.',
          author: 'Shipping Dept',
          date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()
        }
      ],
      hasReturnRequest: false,
      backorderInfo: {
        items: ['W10276645'],
        estimatedArrival: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toLocaleDateString(),
        supplier: 'Whirlpool Direct'
      }
    }
  ];

  console.log('Sample orders created:', sampleOrders.length);
  return sampleOrders;
};

export default createSampleOrders;
