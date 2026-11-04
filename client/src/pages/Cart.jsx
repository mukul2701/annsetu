import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

export default function Cart({ setActivePage }) {
  const { cart, updateQuantity, removeFromCart, clearCart, subtotal, totalSavings } = useCart();
  const { user, token, demoLogin } = useAuth();

  const [deliveryType, setDeliveryType] = useState('Direct Farm Dispatch (Trucking)');
  const [paymentMethod, setPaymentMethod] = useState('UPI Online (Instant QR/Transfer)');
  const [address, setAddress] = useState({
    fullName: user?.name || 'Sunil Sharma',
    phone: user?.phone || '+91-9876543213',
    addressLine: user?.deliveryAddress || 'Shop 42, Block C, Wholesale Market',
    city: user?.district || 'New Delhi',
    state: user?.state || 'Delhi NCR',
    pincode: '110033'
  });
  const [placing, setPlacing] = useState(false);
  const [successOrder, setSuccessOrder] = useState(null);

  // Delivery fee calculation
  let deliveryFee = 350;
  if (deliveryType === 'Mandi Hub Pickup') deliveryFee = 150;
  if (deliveryType === 'Cold-Chain Express') deliveryFee = 750;

  const grandTotal = subtotal + deliveryFee;

  async function handleCheckout(e) {
    e.preventDefault();

    if (!user) {
      // Auto login as demo buyer so user isn't blocked
      await demoLogin('buyer');
    }

    setPlacing(true);
    try {
      const currentToken = token || localStorage.getItem('annsetu_token');
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${currentToken}`
        },
        body: JSON.stringify({
          items: cart.map(item => ({
            productId: item._id,
            quantity: item.quantity
          })),
          deliveryAddress: address,
          deliveryType,
          paymentMethod
        })
      });

      const data = await res.json();
      if (data.success && data.order) {
        clearCart();
        setSuccessOrder(data.order);
      } else {
        alert(data.message || 'Error placing order');
      }
    } catch (err) {
      alert('Failed to place order');
    } finally {
      setPlacing(false);
    }
  }

  if (successOrder) {
    return (
      <div className="py-5" style={{ background: '#f5f2e7', minHeight: '75vh' }}>
        <div className="container py-5 text-center">
          <div className="card shadow border-0 rounded-4 p-5 mx-auto bg-white" style={{ maxWidth: '580px' }}>
            <div className="display-4 text-success mb-3">
              <i className="fa-solid fa-circle-check"></i>
            </div>
            <h3 className="fw-bold text-dark mb-1">Wholesale Order Confirmed!</h3>
            <p className="text-muted">Order ID: <strong className="text-primary">{successOrder.orderNumber}</strong></p>
            <div className="p-3 bg-light rounded-3 my-3 text-start small">
              <div><strong>Farmer Dispatch:</strong> Directly notified to prepare batch</div>
              <div><strong>Delivery Type:</strong> {successOrder.deliveryType}</div>
              <div><strong>Total Amount:</strong> ₹{successOrder.grandTotal}</div>
              <div><strong>Payment Status:</strong> <span className="badge bg-success">{successOrder.paymentStatus}</span></div>
            </div>
            <div className="d-flex gap-2 justify-content-center">
              <button 
                className="btn btn-ann-primary"
                onClick={() => setActivePage('buyer-orders')}
              >
                Track Live Order
              </button>
              <button 
                className="btn btn-outline-secondary"
                onClick={() => setActivePage('marketplace')}
              >
                Continue Shopping
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (cart.length === 0) {
    return (
      <div className="py-5" style={{ background: '#fbf9f4', minHeight: '70vh' }}>
        <div className="container py-5 text-center">
          <div className="card shadow-sm border-0 rounded-4 p-5 mx-auto bg-white" style={{ maxWidth: '520px' }}>
            <div className="display-4 text-muted mb-3">🛒</div>
            <h3 className="fw-bold mb-2">Your Shopping Cart is Empty</h3>
            <p className="text-muted mb-4">
              Add direct farm produce, pulses, grains, or fruits from our verified farmers to enjoy wholesale pricing.
            </p>
            <button className="btn btn-ann-primary mx-auto" onClick={() => setActivePage('marketplace')}>
              <i className="fa-solid fa-store me-1"></i> Browse Produce Market
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="py-5" style={{ background: '#fbf9f4' }}>
      <div className="container">
        <h3 className="fw-bold mb-4 text-dark">
          <i className="fa-solid fa-cart-shopping text-success me-2"></i> Wholesale Cart & Direct Checkout
        </h3>

        <div className="row g-4">
          {/* Cart Items List */}
          <div className="col-lg-8">
            <div className="card shadow-sm border-0 rounded-4 p-4 bg-white mb-4">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h5 className="fw-bold mb-0">Produce Items ({cart.length})</h5>
                <button className="btn btn-sm text-danger btn-link text-decoration-none" onClick={clearCart}>
                  <i className="fa-solid fa-trash-can me-1"></i> Clear Cart
                </button>
              </div>

              <div className="table-responsive">
                <table className="table table-hover align-middle mb-0">
                  <thead className="table-light">
                    <tr>
                      <th>Produce</th>
                      <th>Farmer</th>
                      <th>Price / Unit</th>
                      <th>Quantity</th>
                      <th className="text-end">Subtotal</th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    {cart.map(item => (
                      <tr key={item._id}>
                        <td>
                          <div className="d-flex align-items-center gap-3">
                            <img 
                              src={item.images?.[0] || 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=100'} 
                              alt={item.title} 
                              className="rounded-3"
                              style={{ width: '50px', height: '50px', objectFit: 'cover' }}
                            />
                            <div>
                              <div className="fw-bold text-dark">{item.title}</div>
                              <small className="text-muted">{item.category}</small>
                            </div>
                          </div>
                        </td>
                        <td>
                          <small className="fw-semibold text-success">{item.farmerName}</small><br />
                          <small className="text-muted">{item.state}</small>
                        </td>
                        <td className="fw-bold text-dark">₹{item.pricePerUnit} / {item.unit}</td>
                        <td>
                          <div className="d-flex align-items-center gap-2">
                            <button 
                              className="btn btn-sm btn-outline-secondary px-2 py-0"
                              onClick={() => updateQuantity(item._id, item.quantity - 10)}
                            >
                              -
                            </button>
                            <span className="fw-bold small">{item.quantity} {item.unit}</span>
                            <button 
                              className="btn btn-sm btn-outline-secondary px-2 py-0"
                              onClick={() => updateQuantity(item._id, item.quantity + 10)}
                            >
                              +
                            </button>
                          </div>
                        </td>
                        <td className="text-end fw-bold text-success">
                          ₹{(item.pricePerUnit * item.quantity).toLocaleString('en-IN')}
                        </td>
                        <td className="text-end">
                          <button 
                            className="btn btn-sm text-muted btn-link"
                            onClick={() => removeFromCart(item._id)}
                          >
                            <i className="fa-solid fa-xmark"></i>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Delivery Address & Transport Mode */}
            <div className="card shadow-sm border-0 rounded-4 p-4 bg-white">
              <h5 className="fw-bold mb-3">Delivery & Transport Details</h5>
              <div className="row g-3">
                <div className="col-md-6">
                  <label className="form-label small fw-semibold">Delivery Mode</label>
                  <select 
                    className="form-select"
                    value={deliveryType}
                    onChange={e => setDeliveryType(e.target.value)}
                  >
                    <option value="Direct Farm Dispatch (Trucking)">Direct Farm Dispatch (Full/Shared Truck)</option>
                    <option value="Mandi Hub Pickup">Nearest APMC Mandi Hub Pickup (Self Logistics)</option>
                    <option value="Cold-Chain Express">Cold-Chain Reefer Express (Perishables)</option>
                  </select>
                </div>

                <div className="col-md-6">
                  <label className="form-label small fw-semibold">Payment Mode</label>
                  <select 
                    className="form-select"
                    value={paymentMethod}
                    onChange={e => setPaymentMethod(e.target.value)}
                  >
                    <option value="UPI Online (Instant QR/Transfer)">UPI Online (Instant 0% Fee)</option>
                    <option value="Cash on Delivery (COD)">Cash on Delivery / Mandi Weighment</option>
                    <option value="Bank RTGS / NEFT Direct">Bank RTGS / NEFT Direct to Farmer</option>
                  </select>
                </div>

                <div className="col-md-6">
                  <label className="form-label small fw-semibold">Contact Name</label>
                  <input 
                    type="text" 
                    className="form-control" 
                    value={address.fullName}
                    onChange={e => setAddress({ ...address, fullName: e.target.value })}
                  />
                </div>

                <div className="col-md-6">
                  <label className="form-label small fw-semibold">Contact Phone</label>
                  <input 
                    type="text" 
                    className="form-control" 
                    value={address.phone}
                    onChange={e => setAddress({ ...address, phone: e.target.value })}
                  />
                </div>

                <div className="col-12">
                  <label className="form-label small fw-semibold">Warehouse / Delivery Address</label>
                  <input 
                    type="text" 
                    className="form-control" 
                    value={address.addressLine}
                    onChange={e => setAddress({ ...address, addressLine: e.target.value })}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Bill Summary */}
          <div className="col-lg-4">
            <div className="card shadow-sm border-0 rounded-4 p-4 bg-white sticky-top" style={{ top: '90px' }}>
              <h5 className="fw-bold mb-3">Order Price Summary</h5>

              <div className="d-flex justify-content-between mb-2">
                <span className="text-muted">Produce Subtotal:</span>
                <span className="fw-semibold">₹{subtotal.toLocaleString('en-IN')}</span>
              </div>

              <div className="d-flex justify-content-between mb-2">
                <span className="text-muted">Direct Logistics:</span>
                <span className="fw-semibold">₹{deliveryFee}</span>
              </div>

              <div className="d-flex justify-content-between mb-2 text-success">
                <span>Middlemen Commission:</span>
                <span className="fw-bold">₹0 (Waved 100%)</span>
              </div>

              <div className="d-flex justify-content-between mb-3 text-success">
                <span>Direct Savings vs Retail:</span>
                <span className="fw-bold">-₹{totalSavings.toLocaleString('en-IN')}</span>
              </div>

              <hr />

              <div className="d-flex justify-content-between align-items-baseline mb-4">
                <span className="fw-bold fs-5">Grand Total:</span>
                <span className="fw-bold fs-4 text-success">₹{grandTotal.toLocaleString('en-IN')}</span>
              </div>

              <button 
                className="btn btn-ann-primary w-100 py-3 rounded-pill fw-bold"
                onClick={handleCheckout}
                disabled={placing}
              >
                {placing ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2"></span> Confirming Dispatch...
                  </>
                ) : (
                  <>
                    <i className="fa-solid fa-lock me-2"></i> Place Wholesale Order
                  </>
                )}
              </button>

              <div className="mt-3 text-center small text-muted">
                <i className="fa-solid fa-shield-halved text-success me-1"></i> 100% Protected Farmer Settlement Guarantee
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
