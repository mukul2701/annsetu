import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';

export default function BuyerOrders({ setActivePage }) {
  const { user, token, demoLogin } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);

  useEffect(() => {
    if (token && user) {
      loadOrders();
    } else {
      setLoading(false);
    }
  }, [token, user]);

  async function loadOrders() {
    setLoading(true);
    try {
      const res = await fetch('/api/orders/buyer/mine', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success && data.orders) {
        setOrders(data.orders);
      }
    } catch (err) {
      console.warn(err);
    } finally {
      setLoading(false);
    }
  }

  if (!user) {
    return (
      <div className="py-5" style={{ background: '#f5f2e7', minHeight: '70vh' }}>
        <div className="container text-center py-5">
          <div className="card shadow-sm border-0 rounded-4 p-5 max-w-lg mx-auto bg-white" style={{ maxWidth: '520px' }}>
            <div className="fs-1 text-primary mb-2">📦</div>
            <h3 className="fw-bold mb-2">Track Wholesale Orders</h3>
            <p className="text-muted mb-4">
              Sign in to view your placed orders, live farm dispatch tracking, and digital tax invoices.
            </p>
            <div className="d-grid gap-2">
              <button 
                className="btn btn-ann-teal py-2"
                onClick={() => demoLogin('buyer').then(() => loadOrders())}
              >
                <i className="fa-solid fa-bolt me-1"></i> Quick Login as Demo Buyer (Sunil Sharma)
              </button>
              <button 
                className="btn btn-outline-secondary py-2"
                onClick={() => setActivePage('login')}
              >
                Sign In with Other Account
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="py-5" style={{ background: '#fbf9f4', minHeight: '75vh' }}>
      <div className="container">
        {/* Header */}
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div>
            <span className="badge bg-primary-subtle text-primary px-3 py-1 rounded-pill small fw-semibold">
              BUYER PROCUREMENT PORTAL
            </span>
            <h3 className="fw-bold mb-0 text-dark">My Orders & Farm Deliveries</h3>
          </div>
          <button className="btn btn-ann-primary" onClick={() => setActivePage('marketplace')}>
            <i className="fa-solid fa-store me-1"></i> Order More Produce
          </button>
        </div>

        {loading ? (
          <div className="text-center py-5">
            <div className="spinner-border text-primary" role="status"></div>
            <p className="mt-2 text-muted">Retrieving order tracking status...</p>
          </div>
        ) : orders.length === 0 ? (
          <div className="text-center py-5 card border-0 rounded-4 shadow-sm p-5 bg-white">
            <div className="fs-1 text-muted mb-2">🛒</div>
            <h4>No Orders Placed Yet</h4>
            <p className="text-muted">You haven't placed any produce orders yet. Explore our marketplace for fresh harvests.</p>
            <button className="btn btn-ann-primary mx-auto" onClick={() => setActivePage('marketplace')}>
              Browse Produce Marketplace
            </button>
          </div>
        ) : (
          <div className="row g-4">
            {orders.map(order => {
              const statusStep = {
                placed: 1,
                confirmed: 2,
                dispatched: 3,
                delivered: 4,
                cancelled: 0
              }[order.orderStatus] || 1;

              return (
                <div key={order._id} className="col-12">
                  <div className="card shadow-sm border-0 rounded-4 p-4 bg-white">
                    <div className="d-flex flex-wrap justify-content-between align-items-center border-bottom pb-3 mb-3">
                      <div>
                        <span className="fw-bold fs-5 text-dark me-3">{order.orderNumber}</span>
                        <span className="text-muted small">
                          Placed on {new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                        </span>
                      </div>
                      <div className="d-flex align-items-center gap-2 mt-2 mt-sm-0">
                        <span className={`badge px-3 py-2 text-uppercase fs-6 ${
                          order.orderStatus === 'delivered' ? 'bg-success' :
                          order.orderStatus === 'dispatched' ? 'bg-info text-dark' :
                          order.orderStatus === 'confirmed' ? 'bg-primary' : 'bg-warning text-dark'
                        }`}>
                          {order.orderStatus}
                        </span>
                        <button 
                          className="btn btn-sm btn-outline-secondary"
                          onClick={() => setSelectedOrder(order)}
                        >
                          <i className="fa-solid fa-file-invoice me-1"></i> View Invoice
                        </button>
                      </div>
                    </div>

                    {/* Tracking Progress Bar */}
                    <div className="my-3 px-2">
                      <div className="d-flex justify-content-between text-center position-relative mb-2">
                        <div className={`fw-semibold small ${statusStep >= 1 ? 'text-success' : 'text-muted'}`}>
                          <i className="fa-solid fa-circle-check me-1"></i> Placed
                        </div>
                        <div className={`fw-semibold small ${statusStep >= 2 ? 'text-success' : 'text-muted'}`}>
                          <i className="fa-solid fa-check-double me-1"></i> Farm Confirmed
                        </div>
                        <div className={`fw-semibold small ${statusStep >= 3 ? 'text-success' : 'text-muted'}`}>
                          <i className="fa-solid fa-truck-fast me-1"></i> Dispatched
                        </div>
                        <div className={`fw-semibold small ${statusStep >= 4 ? 'text-success' : 'text-muted'}`}>
                          <i className="fa-solid fa-house-chimney me-1"></i> Delivered
                        </div>
                      </div>
                      <div className="progress" style={{ height: '8px' }}>
                        <div 
                          className="progress-bar bg-success progress-bar-striped progress-bar-animated" 
                          role="progressbar" 
                          style={{ width: `${(statusStep / 4) * 100}%` }}
                        ></div>
                      </div>
                    </div>

                    {/* Order Items Table */}
                    <div className="table-responsive mt-3">
                      <table className="table table-sm table-borderless align-middle mb-0">
                        <tbody>
                          {order.items?.map((item, idx) => (
                            <tr key={idx}>
                              <td className="fw-semibold text-dark">{item.title}</td>
                              <td className="text-muted">Farmer: {item.farmerName}</td>
                              <td>{item.quantity} {item.unit} × ₹{item.unitPrice}</td>
                              <td className="text-end fw-bold">₹{item.total.toLocaleString('en-IN')}</td>
                            </tr>
                          ))}
                        </tbody>
                        <tfoot className="border-top">
                          <tr>
                            <td colSpan="3" className="text-end text-muted small">Transport & Logistics:</td>
                            <td className="text-end small">₹{order.deliveryFee || 0}</td>
                          </tr>
                          <tr>
                            <td colSpan="3" className="text-end fw-bold fs-6">Grand Total:</td>
                            <td className="text-end fw-bold fs-6 text-success">
                              ₹{(order.grandTotal || order.totalAmount).toLocaleString('en-IN')}
                            </td>
                          </tr>
                        </tfoot>
                      </table>
                    </div>

                    <div className="d-flex justify-content-between align-items-center mt-3 pt-2 border-top text-muted small">
                      <span>
                        <i className="fa-solid fa-location-dot me-1 text-danger"></i> 
                        Shipping to: {order.deliveryAddress?.addressLine || 'Wholesale Mandi Hub'}, {order.deliveryAddress?.city}
                      </span>
                      <span>
                        <i className="fa-solid fa-credit-card me-1 text-primary"></i> 
                        {order.paymentMethod} ({order.paymentStatus})
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* ================= INVOICE MODAL ================= */}
      {selectedOrder && (
        <div className="ann-modal-backdrop" onClick={() => setSelectedOrder(null)}>
          <div className="ann-modal-content p-4" onClick={e => e.stopPropagation()} style={{ maxWidth: '600px' }}>
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h4 className="fw-bold mb-0">🌾 AnnSetu Direct Tax Invoice</h4>
              <button className="btn-close" onClick={() => setSelectedOrder(null)}></button>
            </div>

            <div className="p-3 bg-light rounded-3 mb-3 small">
              <div className="row">
                <div className="col-6">
                  <strong>Invoice No:</strong> {selectedOrder.orderNumber}<br />
                  <strong>Date:</strong> {new Date(selectedOrder.createdAt).toLocaleDateString()}
                </div>
                <div className="col-6 text-end">
                  <strong>Payment:</strong> {selectedOrder.paymentMethod}<br />
                  <span className="badge bg-success">{selectedOrder.paymentStatus}</span>
                </div>
              </div>
            </div>

            <div className="table-responsive mb-3">
              <table className="table table-bordered small">
                <thead className="table-light">
                  <tr>
                    <th>Item Description</th>
                    <th>Qty</th>
                    <th>Rate</th>
                    <th className="text-end">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedOrder.items?.map((it, idx) => (
                    <tr key={idx}>
                      <td>{it.title}<br /><small className="text-muted">Farmer: {it.farmerName}</small></td>
                      <td>{it.quantity} {it.unit}</td>
                      <td>₹{it.unitPrice}</td>
                      <td className="text-end">₹{it.total}</td>
                    </tr>
                  ))}
                  <tr>
                    <td colSpan="3" className="text-end fw-semibold">Subtotal:</td>
                    <td className="text-end">₹{selectedOrder.totalAmount}</td>
                  </tr>
                  <tr>
                    <td colSpan="3" className="text-end fw-semibold">Direct Transport:</td>
                    <td className="text-end">₹{selectedOrder.deliveryFee || 0}</td>
                  </tr>
                  <tr className="table-success">
                    <td colSpan="3" className="text-end fw-bold">Total Paid:</td>
                    <td className="text-end fw-bold">₹{selectedOrder.grandTotal}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="text-center">
              <button className="btn btn-ann-primary" onClick={() => window.print()}>
                <i className="fa-solid fa-print me-1"></i> Print / Save Invoice
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
