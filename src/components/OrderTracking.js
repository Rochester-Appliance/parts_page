import React, { useState, useEffect } from 'react';
import { useCart } from '../contexts/CartContext';
import './OrderTracking.css';

const OrderTracking = ({ orderId, onClose }) => {
  const { orders, updateOrderStatus } = useCart();
  const [order, setOrder] = useState(null);
  const [newNote, setNewNote] = useState('');
  const [showReturnDialog, setShowReturnDialog] = useState(false);
  const [selectedReturnItems, setSelectedReturnItems] = useState([]);

  useEffect(() => {
    if (orderId && orders) {
      const foundOrder = orders.find(o => o.id === orderId);
      setOrder(foundOrder);
    }
  }, [orderId, orders]);

  const getStatusIcon = (status) => {
    const icons = {
      'pending': '⏳',
      'confirmed': '✅',
      'processing': '🔄',
      'parts_ready': '📦',
      'shipped': '🚚',
      'out_for_delivery': '🚛',
      'delivered': '✅',
      'installation_scheduled': '🔧',
      'installation_complete': '✅',
      'cancelled': '❌',
      'returned': '↩️',
      'partially_shipped': '📦',
      'backordered': '⏰'
    };
    return icons[status] || '📋';
  };

  const getStatusColor = (status) => {
    const colors = {
      'pending': '#ff9800',
      'confirmed': '#4caf50',
      'processing': '#2196f3',
      'parts_ready': '#9c27b0',
      'shipped': '#ff5722',
      'out_for_delivery': '#ff9800',
      'delivered': '#4caf50',
      'installation_scheduled': '#3f51b5',
      'installation_complete': '#4caf50',
      'cancelled': '#f44336',
      'returned': '#795548',
      'partially_shipped': '#ff9800',
      'backordered': '#f44336'
    };
    return colors[status] || '#9e9e9e';
  };

  const formatDateTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  const addOrderNote = (orderId, note) => {
    if (newNote.trim() && order) {
      // In a real app, this would call the context method
      console.log('Adding note:', note);
      setNewNote('');
    }
  };

  const handleAddNote = () => {
    if (newNote.trim() && order) {
      addOrderNote(order.id, newNote.trim());
      setNewNote('');
    }
  };

  if (!order) {
    return (
      <div className="order-tracking-overlay">
        <div className="order-tracking-modal">
          <div className="order-tracking-header">
            <h2>Order Not Found</h2>
            <button onClick={onClose} className="close-btn">&times;</button>
          </div>
          <p>Order {orderId} could not be found.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="order-tracking-overlay">
      <div className="order-tracking-modal">
        <div className="order-tracking-header">
          <h2>Order Tracking - #{order.orderNumber}</h2>
          <button onClick={onClose} className="close-btn">&times;</button>
        </div>

        <div className="order-tracking-content">
          {/* Order Summary */}
          <div className="order-summary-section">
            <h3>Order Summary</h3>
            <div className="order-summary-grid">
              <div className="summary-item">
                <label>Order Number:</label>
                <span>{order.orderNumber}</span>
              </div>
              <div className="summary-item">
                <label>Order Date:</label>
                <span>{new Date(order.orderDate).toLocaleDateString()}</span>
              </div>
              <div className="summary-item">
                <label>Total Amount:</label>
                <span>${order.total.toFixed(2)}</span>
              </div>
              <div className="summary-item">
                <label>Status:</label>
                <span style={{ color: getStatusColor(order.status) }}>
                  {getStatusIcon(order.status)} {order.status.replace('_', ' ').toUpperCase()}
                </span>
              </div>
              <div className="summary-item">
                <label>Payment Method:</label>
                <span>{order.paymentMethod?.replace('_', ' ').toUpperCase() || 'Credit Card'}</span>
              </div>
              <div className="summary-item">
                <label>Delivery Method:</label>
                <span>
                  {order.hasInstallation ? 'Installation Service' :
                    order.hasDropOffDelivery ? 'Drop-off Delivery' : 'Standard Shipping'}
                </span>
              </div>
            </div>
          </div>

          {/* Tracking Timeline */}
          {order.trackingEvents && order.trackingEvents.length > 0 && (
            <div className="tracking-timeline-section">
              <h3>Tracking Timeline</h3>
              <div className="tracking-timeline">
                {order.trackingEvents.map((event, index) => (
                  <div key={event.id} className="timeline-event">
                    <div className="timeline-marker" style={{ backgroundColor: getStatusColor(event.status) }}>
                      {getStatusIcon(event.status)}
                    </div>
                    <div className="timeline-content">
                      <div className="timeline-header">
                        <h4>{event.title}</h4>
                        <span className="timeline-time">{formatDateTime(event.timestamp)}</span>
                      </div>
                      <p>{event.description}</p>
                      <span className="timeline-location">📍 {event.location}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Shipping Information */}
          {order.shippingInfo && (
            <div className="shipping-info-section">
              <h3>Shipping Information</h3>
              <div className="shipping-details">
                <div className="shipping-item">
                  <label>Carrier:</label>
                  <span>{order.shippingInfo.carrier}</span>
                </div>
                <div className="shipping-item">
                  <label>Tracking Number:</label>
                  <span>{order.shippingInfo.trackingNumber}</span>
                </div>
                <div className="shipping-item">
                  <label>Estimated Delivery:</label>
                  <span>{order.shippingInfo.estimatedDelivery}</span>
                </div>
                {order.shippingInfo.actualDelivery && (
                  <div className="shipping-item">
                    <label>Actual Delivery:</label>
                    <span>{order.shippingInfo.actualDelivery}</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Installation Information */}
          {order.hasInstallation && order.installationInfo && (
            <div className="installation-section">
              <h3>Installation Service</h3>
              <div className="installation-details">
                <div className="installation-item">
                  <label>Technician:</label>
                  <span>{order.installationInfo.technicianName}</span>
                </div>
                <div className="installation-item">
                  <label>Scheduled Date:</label>
                  <span>{order.installationInfo.scheduledDate}</span>
                </div>
                <div className="installation-item">
                  <label>Time Window:</label>
                  <span>{order.installationInfo.timeWindow}</span>
                </div>
                {order.installationInfo.completedDate && (
                  <div className="installation-item">
                    <label>Completed Date:</label>
                    <span>{order.installationInfo.completedDate}</span>
                  </div>
                )}
                <div className="installation-item">
                  <label>Installation Fee:</label>
                  <span>${order.installationFee?.toFixed(2) || '0.00'}</span>
                </div>
                {order.installationInfo.notes && (
                  <div className="installation-item full-width">
                    <label>Installation Notes:</label>
                    <span>{order.installationInfo.notes}</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Backorder Information */}
          {order.backorderInfo && (
            <div className="backorder-section">
              <h3>Backorder Information</h3>
              <div className="backorder-details">
                <div className="backorder-item">
                  <label>Backordered Items:</label>
                  <span>{order.backorderInfo.items.join(', ')}</span>
                </div>
                <div className="backorder-item">
                  <label>Estimated Arrival:</label>
                  <span>{order.backorderInfo.estimatedArrival}</span>
                </div>
                <div className="backorder-item">
                  <label>Supplier:</label>
                  <span>{order.backorderInfo.supplier}</span>
                </div>
              </div>
            </div>
          )}

          {/* Return Information */}
          {order.returnInfo && (
            <div className="return-section">
              <h3>Return Information</h3>
              <div className="return-details">
                <div className="return-item">
                  <label>Return Reason:</label>
                  <span>{order.returnInfo.reason}</span>
                </div>
                <div className="return-item">
                  <label>Requested Date:</label>
                  <span>{new Date(order.returnInfo.requestedDate).toLocaleDateString()}</span>
                </div>
                <div className="return-item">
                  <label>Processed Date:</label>
                  <span>{new Date(order.returnInfo.processedDate).toLocaleDateString()}</span>
                </div>
                <div className="return-item">
                  <label>Refund Amount:</label>
                  <span>${order.returnInfo.refundAmount.toFixed(2)}</span>
                </div>
              </div>
            </div>
          )}

          {/* Order Items */}
          <div className="order-items-section">
            <h3>Order Items ({order.items.length})</h3>
            <div className="order-items-list">
              {order.items.map(item => (
                <div key={item.id} className="order-item">
                  <div className="item-details">
                    <h4>{item.Description}</h4>
                    <p>Part Number: {item.partNumber || item.Model_Number}</p>
                    <p>Brand: {item.Brand}</p>
                    <p>Qty: {item.quantity}</p>
                    <div className="item-status">
                      <span
                        className="status-badge"
                        style={{ backgroundColor: getStatusColor(item.status), color: 'white' }}
                      >
                        {getStatusIcon(item.status)} {item.status?.replace('_', ' ').toUpperCase()}
                      </span>
                    </div>
                  </div>
                  <div className="item-price">
                    <span>${(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Order Notes */}
          {order.notes && order.notes.length > 0 && (
            <div className="order-notes-section">
              <h3>Order Notes</h3>
              <div className="notes-list">
                {order.notes.map((note, index) => (
                  <div key={index} className="order-note">
                    <div className="note-header">
                      <span className="note-author">{note.author}</span>
                      <span className="note-date">{formatDateTime(note.date)}</span>
                    </div>
                    <p>{note.message}</p>
                  </div>
                ))}
              </div>

              <div className="add-note">
                <textarea
                  value={newNote}
                  onChange={(e) => setNewNote(e.target.value)}
                  placeholder="Add a note about this order..."
                  rows="3"
                />
                <button
                  onClick={handleAddNote}
                  disabled={!newNote.trim()}
                  className="add-note-btn"
                >
                  Add Note
                </button>
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="order-actions">
            <button
              className="action-btn contact-support"
              onClick={() => window.open('mailto:support@rochester-appliance.com?subject=Order ' + order.orderNumber)}
            >
              📧 Contact Support
            </button>

            {order.shippingInfo?.trackingNumber && (
              <button
                className="action-btn track-package"
                onClick={() => window.open(`https://www.fedex.com/tracking?trknbr=${order.shippingInfo.trackingNumber}`)}
              >
                📦 Track Package
              </button>
            )}

            <button
              className="action-btn download-invoice"
              onClick={() => console.log('Download invoice for', order.orderNumber)}
            >
              📄 Download Invoice
            </button>

            {(order.status === 'delivered' || order.status === 'installation_complete') && !order.hasReturnRequest && (
              <button
                className="action-btn return-order"
                onClick={() => setShowReturnDialog(true)}
              >
                ↩️ Request Return
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderTracking;
