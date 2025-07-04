import React, { useState, useEffect } from 'react';
import { useCart } from '../contexts/CartContext';
import OrderTracking from './OrderTracking';
import './OrderHistory.css';

const OrderHistory = () => {
  const { orders } = useCart();
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortBy, setSortBy] = useState('newest');

  // Debug logging
  console.log('OrderHistory - orders from context:', orders);
  console.log('OrderHistory - filteredOrders:', filteredOrders);

  useEffect(() => {
    let filtered = orders || [];

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(order =>
        order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.items.some(item =>
          item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.partNumber.toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    }

    // Status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(order => order.status === statusFilter);
    }

    // Sort
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return new Date(b.orderDate) - new Date(a.orderDate);
        case 'oldest':
          return new Date(a.orderDate) - new Date(b.orderDate);
        case 'amount_high':
          return b.total - a.total;
        case 'amount_low':
          return a.total - b.total;
        default:
          return 0;
      }
    });

    setFilteredOrders(filtered);
  }, [orders, searchTerm, statusFilter, sortBy]);

  const getStatusBadge = (status) => {
    const statusConfig = {
      pending: { label: 'Pending', color: '#ff9800', icon: '⏳' },
      confirmed: { label: 'Confirmed', color: '#4caf50', icon: '✅' },
      processing: { label: 'Processing', color: '#2196f3', icon: '🔄' },
      parts_ready: { label: 'Parts Ready', color: '#9c27b0', icon: '📦' },
      shipped: { label: 'Shipped', color: '#ff5722', icon: '🚚' },
      out_for_delivery: { label: 'Out for Delivery', color: '#ff9800', icon: '🚛' },
      delivered: { label: 'Delivered', color: '#4caf50', icon: '✅' },
      installation_scheduled: { label: 'Install Scheduled', color: '#3f51b5', icon: '🔧' },
      installation_complete: { label: 'Install Complete', color: '#4caf50', icon: '✅' },
      cancelled: { label: 'Cancelled', color: '#f44336', icon: '❌' },
      returned: { label: 'Returned', color: '#795548', icon: '↩️' },
      partially_shipped: { label: 'Partially Shipped', color: '#ff9800', icon: '📦' },
      backordered: { label: 'Backordered', color: '#f44336', icon: '⏰' }
    };

    const config = statusConfig[status] || { label: status, color: '#9e9e9e', icon: '📋' };

    return (
      <span
        className="status-badge"
        style={{ backgroundColor: config.color, color: 'white', padding: '4px 8px', borderRadius: '4px', fontSize: '12px' }}
      >
        {config.icon} {config.label}
      </span>
    );
  };

  const handleReorder = (order) => {
    order.items.forEach(item => {
      console.log('Reordering item:', item);
    });
    alert('Items added to cart for reorder!');
  };

  return (
    <div className="order-history">
      <div className="order-history-header">
        <h2>Order History</h2>
        <div className="order-stats">
          <div className="stat-item">
            <span className="stat-number">{filteredOrders.length}</span>
            <span className="stat-label">Total Orders</span>
          </div>
        </div>
      </div>

      <div className="order-filters">
        <div className="search-box">
          <input
            type="text"
            placeholder="Search by order number, part name, or part number..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
          <span className="search-icon">🔍</span>
        </div>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="filter-select"
        >
          <option value="all">All Statuses</option>
          <option value="pending">Pending</option>
          <option value="confirmed">Confirmed</option>
          <option value="processing">Processing</option>
          <option value="shipped">Shipped</option>
          <option value="out_for_delivery">Out for Delivery</option>
          <option value="delivered">Delivered</option>
          <option value="installation_complete">Installation Complete</option>
          <option value="cancelled">Cancelled</option>
          <option value="returned">Returned</option>
          <option value="partially_shipped">Partially Shipped</option>
          <option value="backordered">Backordered</option>
        </select>

        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="filter-select"
        >
          <option value="newest">Newest First</option>
          <option value="oldest">Oldest First</option>
          <option value="amount_high">Highest Amount</option>
          <option value="amount_low">Lowest Amount</option>
        </select>
      </div>

      <div className="orders-list">
        {filteredOrders.length === 0 ? (
          <div className="no-orders">
            <div className="no-orders-icon">📦</div>
            <h3>No orders found</h3>
            <p>You haven't placed any orders yet.</p>
          </div>
        ) : (
          filteredOrders.map(order => (
            <div key={order.id} className="order-card">
              <div className="order-card-header">
                <div className="order-info">
                  <h3>Order #{order.orderNumber}</h3>
                  <p className="order-date">
                    Placed on {new Date(order.orderDate).toLocaleDateString()}
                  </p>
                </div>
                <div className="order-status">
                  {getStatusBadge(order.status)}
                </div>
              </div>

              <div className="order-card-content">
                <div className="order-items-preview">
                  <h4>Items ({order.items.length})</h4>
                  <div className="items-list">
                    {order.items.slice(0, 3).map(item => (
                      <div key={item.id} className="item-preview">
                        <div className="item-info">
                          <span className="item-name">{item.Description}</span>
                          <span className="item-part-number">{item.partNumber || item.Model_Number}</span>
                          <span className="item-quantity">Qty: {item.quantity}</span>
                        </div>
                      </div>
                    ))}
                    {order.items.length > 3 && (
                      <div className="more-items">
                        +{order.items.length - 3} more items
                      </div>
                    )}
                  </div>
                </div>

                <div className="order-summary">
                  <div className="summary-row total">
                    <span>Total:</span>
                    <span>${order.total.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              <div className="order-card-actions">
                <button
                  className="action-btn primary"
                  onClick={() => setSelectedOrder(order.id)}
                  style={{ backgroundColor: '#2196f3', color: 'white', padding: '8px 16px', border: 'none', borderRadius: '4px', cursor: 'pointer', marginRight: '8px' }}
                >
                  Track Order
                </button>

                <button
                  className="action-btn secondary"
                  onClick={() => handleReorder(order)}
                  style={{ backgroundColor: '#4caf50', color: 'white', padding: '8px 16px', border: 'none', borderRadius: '4px', cursor: 'pointer', marginRight: '8px' }}
                >
                  Reorder
                </button>

                <button
                  className="action-btn secondary"
                  onClick={() => console.log('Download invoice for', order.orderNumber)}
                  style={{ backgroundColor: '#ff9800', color: 'white', padding: '8px 16px', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                >
                  Invoice
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {selectedOrder && (
        <OrderTracking
          orderId={selectedOrder}
          onClose={() => setSelectedOrder(null)}
        />
      )}
    </div>
  );
};

export default OrderHistory;
