import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';

export default function FarmerDashboard({ setActivePage }) {
  const { user, token, demoLogin } = useAuth();
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [inquiries, setInquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [replyModal, setReplyModal] = useState(null);
  const [replyText, setReplyText] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // New Produce Form State
  const [formData, setFormData] = useState({
    title: '',
    category: 'Grains & Cereals',
    variety: '',
    description: '',
    pricePerUnit: '',
    unit: 'kg',
    availableQuantity: '',
    minOrderQuantity: '10',
    harvestDate: new Date().toISOString().split('T')[0],
    isOrganic: false,
    state: user?.state || 'Madhya Pradesh',
    location: '',
    imageUrl: ''
  });

  useEffect(() => {
    if (token && user?.role === 'farmer') {
      loadFarmerData();
    } else {
      setLoading(false);
    }
  }, [token, user]);

  async function loadFarmerData() {
    setLoading(true);
    try {
      const [prodRes, orderRes, inqRes] = await Promise.all([
        fetch('/api/products/farmer/mine', { headers: { Authorization: `Bearer ${token}` } }),
        fetch('/api/orders/farmer/mine', { headers: { Authorization: `Bearer ${token}` } }),
        fetch('/api/inquiries/mine', { headers: { Authorization: `Bearer ${token}` } })
      ]);

      const [prodData, orderData, inqData] = await Promise.all([
        prodRes.json(),
        orderRes.json(),
        inqRes.json()
      ]);

      if (prodData.success) setProducts(prodData.products || []);
      if (orderData.success) setOrders(orderData.orders || []);
      if (inqData.success) setInquiries(inqData.inquiries || []);
    } catch (err) {
      console.warn('Farmer data load error:', err);
    } finally {
      setLoading(false);
    }
  }

  async function handleAddProduce(e) {
    e.preventDefault();
    setSubmitting(true);
    try {
      const payload = {
        ...formData,
        pricePerUnit: Number(formData.pricePerUnit),
        availableQuantity: Number(formData.availableQuantity),
        minOrderQuantity: Number(formData.minOrderQuantity),
        images: formData.imageUrl ? [formData.imageUrl] : undefined
      };

      const res = await fetch('/api/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (data.success) {
        setShowAddModal(false);
        setFormData({
          title: '',
          category: 'Grains & Cereals',
          variety: '',
          description: '',
          pricePerUnit: '',
          unit: 'kg',
          availableQuantity: '',
          minOrderQuantity: '10',
          harvestDate: new Date().toISOString().split('T')[0],
          isOrganic: false,
          state: user?.state || 'Madhya Pradesh',
          location: '',
          imageUrl: ''
        });
        loadFarmerData();
      } else {
        alert(data.message || 'Error adding produce');
      }
    } catch (err) {
      alert('Error creating listing');
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDeleteProduct(id) {
    if (!confirm('Are you sure you want to delete this produce listing?')) return;
    try {
      const res = await fetch(`/api/products/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        loadFarmerData();
      }
    } catch (err) {
      console.warn(err);
    }
  }

  async function handleUpdateOrderStatus(orderId, status) {
    try {
      const res = await fetch(`/api/orders/${orderId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ status })
      });
      const data = await res.json();
      if (data.success) {
        loadFarmerData();
      }
    } catch (err) {
      console.warn(err);
    }
  }

  async function handleSendReply(e) {
    e.preventDefault();
    if (!replyModal || !replyText.trim()) return;
    try {
      const res = await fetch(`/api/inquiries/${replyModal._id}/reply`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ replyText })
      });
      const data = await res.json();
      if (data.success) {
        setReplyModal(null);
        setReplyText('');
        loadFarmerData();
      }
    } catch (err) {
      console.warn(err);
    }
  }

  if (!user || user.role !== 'farmer') {
    return (
      <div className="py-5" style={{ background: '#f5f2e7', minHeight: '70vh' }}>
        <div className="container text-center py-5">
          <div className="card shadow-sm border-0 rounded-4 p-5 max-w-lg mx-auto bg-white" style={{ maxWidth: '520px' }}>
            <div className="fs-1 text-success mb-2">🌾</div>
            <h3 className="fw-bold mb-2">Farmer Portal Access</h3>
            <p className="text-muted mb-4">
              Please sign in as a verified farmer to manage your produce listings, track incoming wholesale orders, and view earnings.
            </p>
            <div className="d-grid gap-2">
              <button 
                className="btn btn-ann-primary py-2"
                onClick={() => demoLogin('farmer').then(() => loadFarmerData())}
              >
                <i className="fa-solid fa-bolt me-1"></i> Quick Login as Demo Farmer (Ramesh Patel)
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

  // Calculate Farmer Metrics
  const totalSales = orders.reduce((sum, o) => sum + (o.grandTotal || 0), 0);
  const activeListings = products.length;
  const pendingOrders = orders.filter(o => o.orderStatus !== 'delivered' && o.orderStatus !== 'cancelled').length;

  return (
    <div className="py-5" style={{ background: '#fbf9f4' }}>
      <div className="container">
        {/* Welcome Header */}
        <div className="card shadow-sm border-0 rounded-4 p-4 mb-4 bg-white">
          <div className="row align-items-center">
            <div className="col-md-8">
              <div className="d-flex align-items-center gap-3">
                <img 
                  src={user.avatar || 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=150'} 
                  alt={user.name} 
                  className="rounded-circle border border-success border-2"
                  style={{ width: '64px', height: '64px', objectFit: 'cover' }}
                />
                <div>
                  <h3 className="fw-bold mb-0 text-dark">
                    Namaste, {user.name}! 🌾
                  </h3>
                  <div className="text-muted small mt-1">
                    <span className="badge bg-success-subtle text-success me-2">Verified Farmer</span>
                    <span><i className="fa-solid fa-location-dot text-danger me-1"></i> {user.village || user.district || 'Sehore'}, {user.state}</span>
                    <span className="ms-3"><i className="fa-solid fa-phone text-muted me-1"></i> {user.phone}</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-md-4 text-md-end mt-3 mt-md-0">
              <button 
                className="btn btn-ann-primary shadow-sm"
                onClick={() => setShowAddModal(true)}
              >
                <i className="fa-solid fa-plus me-1"></i> List New Harvest
              </button>
            </div>
          </div>
        </div>

        {/* Metrics Row */}
        <div className="row g-4 mb-5">
          <div className="col-md-3 col-sm-6">
            <div className="card border-0 shadow-sm rounded-4 p-4 text-white" style={{ background: 'linear-gradient(135deg, #1b4332, #2d6a4f)' }}>
              <div className="small text-uppercase opacity-75">Gross Sales</div>
              <h3 className="fw-bold mb-1">₹{totalSales.toLocaleString('en-IN')}</h3>
              <small className="opacity-75">100% Direct to Bank</small>
            </div>
          </div>

          <div className="col-md-3 col-sm-6">
            <div className="card border-0 shadow-sm rounded-4 p-4 text-white" style={{ background: 'linear-gradient(135deg, #b4885b, #d4a778)' }}>
              <div className="small text-uppercase opacity-75">Active Listings</div>
              <h3 className="fw-bold mb-1">{activeListings} Crops</h3>
              <small className="opacity-75">Live on Marketplace</small>
            </div>
          </div>

          <div className="col-md-3 col-sm-6">
            <div className="card border-0 shadow-sm rounded-4 p-4 text-white" style={{ background: 'linear-gradient(135deg, #0284c7, #38bdf8)' }}>
              <div className="small text-uppercase opacity-75">Pending Orders</div>
              <h3 className="fw-bold mb-1">{pendingOrders}</h3>
              <small className="opacity-75">Action required</small>
            </div>
          </div>

          <div className="col-md-3 col-sm-6">
            <div className="card border-0 shadow-sm rounded-4 p-4 text-white" style={{ background: 'linear-gradient(135deg, #9b2148, #c43864)' }}>
              <div className="small text-uppercase opacity-75">Buyer Inquiries</div>
              <h3 className="fw-bold mb-1">{inquiries.length}</h3>
              <small className="opacity-75">Direct negotiations</small>
            </div>
          </div>
        </div>

        {/* Produce Inventory Table */}
        <div className="card shadow-sm border-0 rounded-4 p-4 mb-5 bg-white">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h4 className="fw-bold mb-0">My Produce Listings</h4>
            <button className="btn btn-sm btn-outline-success" onClick={() => setShowAddModal(true)}>
              <i className="fa-solid fa-plus me-1"></i> Add Produce
            </button>
          </div>

          {products.length === 0 ? (
            <div className="text-center py-4 text-muted">
              You haven't listed any produce yet. Click "List New Harvest" to start selling.
            </div>
          ) : (
            <div className="table-responsive">
              <table className="table table-hover align-middle mb-0">
                <thead className="table-light">
                  <tr>
                    <th>Produce</th>
                    <th>Category</th>
                    <th>Price / Unit</th>
                    <th>Stock Available</th>
                    <th>Harvest Date</th>
                    <th>Organic</th>
                    <th>Status</th>
                    <th className="text-end">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map(p => (
                    <tr key={p._id}>
                      <td>
                        <div className="d-flex align-items-center gap-3">
                          <img 
                            src={p.images?.[0] || 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=100'} 
                            alt={p.title} 
                            className="rounded-3"
                            style={{ width: '48px', height: '48px', objectFit: 'cover' }}
                          />
                          <div>
                            <div className="fw-bold text-dark">{p.title}</div>
                            <small className="text-muted">{p.variety || 'Standard grade'}</small>
                          </div>
                        </div>
                      </td>
                      <td><span className="badge bg-light text-dark border">{p.category}</span></td>
                      <td className="fw-bold text-success">₹{p.pricePerUnit} / {p.unit}</td>
                      <td>{p.availableQuantity} {p.unit}</td>
                      <td>{p.harvestDate || 'Fresh'}</td>
                      <td>
                        {p.isOrganic ? (
                          <span className="badge bg-success">Organic</span>
                        ) : (
                          <span className="badge bg-light text-muted">Standard</span>
                        )}
                      </td>
                      <td>
                        <span className={`badge ${p.status === 'available' ? 'bg-success' : 'bg-secondary'}`}>
                          {p.status}
                        </span>
                      </td>
                      <td className="text-end">
                        <button 
                          className="btn btn-sm btn-outline-danger"
                          title="Delete Listing"
                          onClick={() => handleDeleteProduct(p._id)}
                        >
                          <i className="fa-solid fa-trash"></i>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Incoming Orders Section */}
        <div className="card shadow-sm border-0 rounded-4 p-4 mb-5 bg-white">
          <h4 className="fw-bold mb-3">Incoming Wholesale Orders</h4>
          {orders.length === 0 ? (
            <p className="text-muted">No orders received yet.</p>
          ) : (
            <div className="table-responsive">
              <table className="table table-hover align-middle mb-0">
                <thead className="table-light">
                  <tr>
                    <th>Order #</th>
                    <th>Buyer</th>
                    <th>Items Ordered</th>
                    <th>Total</th>
                    <th>Payment</th>
                    <th>Status</th>
                    <th>Update Status</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map(o => (
                    <tr key={o._id}>
                      <td className="fw-bold text-primary">{o.orderNumber}</td>
                      <td>
                        <div className="fw-semibold">{o.buyerName}</div>
                        <small className="text-muted">{o.buyerPhone}</small>
                      </td>
                      <td>
                        {o.items?.map((it, idx) => (
                          <div key={idx} className="small">
                            {it.title} ({it.quantity} {it.unit})
                          </div>
                        ))}
                      </td>
                      <td className="fw-bold text-success">₹{o.grandTotal}</td>
                      <td>
                        <span className={`badge ${o.paymentStatus === 'paid' ? 'bg-success' : 'bg-warning text-dark'}`}>
                          {o.paymentStatus}
                        </span>
                      </td>
                      <td>
                        <span className="badge bg-info text-dark text-capitalize">{o.orderStatus}</span>
                      </td>
                      <td>
                        <select 
                          className="form-select form-select-sm"
                          value={o.orderStatus}
                          onChange={(e) => handleUpdateOrderStatus(o._id, e.target.value)}
                        >
                          <option value="placed">Placed</option>
                          <option value="confirmed">Confirmed / Accept</option>
                          <option value="dispatched">Dispatched</option>
                          <option value="delivered">Delivered</option>
                          <option value="cancelled">Cancelled</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Buyer Inquiries Section */}
        <div className="card shadow-sm border-0 rounded-4 p-4 bg-white">
          <h4 className="fw-bold mb-3">Direct Inquiries from Buyers</h4>
          {inquiries.length === 0 ? (
            <p className="text-muted">No buyer inquiries yet.</p>
          ) : (
            <div className="list-group list-group-flush">
              {inquiries.map(inq => (
                <div key={inq._id} className="list-group-item py-3 px-0">
                  <div className="d-flex justify-content-between align-items-center mb-1">
                    <span className="fw-bold text-dark">{inq.productTitle}</span>
                    <span className="badge bg-light text-muted border">{new Date(inq.createdAt).toLocaleDateString()}</span>
                  </div>
                  <div className="small text-muted mb-2">
                    From <strong>{inq.buyerName}</strong> ({inq.buyerPhone})
                  </div>
                  <div className="p-3 bg-light rounded-3 mb-2 small text-dark">
                    "{inq.message}"
                  </div>
                  {inq.farmerReply ? (
                    <div className="p-2 bg-success-subtle text-success rounded-3 small">
                      <strong>Your Reply:</strong> "{inq.farmerReply}"
                    </div>
                  ) : (
                    <button 
                      className="btn btn-sm btn-outline-success"
                      onClick={() => { setReplyModal(inq); setReplyText(''); }}
                    >
                      <i className="fa-solid fa-reply me-1"></i> Send Reply
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ================= ADD PRODUCE MODAL ================= */}
      {showAddModal && (
        <div className="ann-modal-backdrop" onClick={() => setShowAddModal(false)}>
          <div className="ann-modal-content p-4" onClick={e => e.stopPropagation()}>
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h4 className="fw-bold mb-0">🌾 List New Harvest Produce</h4>
              <button className="btn-close" onClick={() => setShowAddModal(false)}></button>
            </div>

            <form onSubmit={handleAddProduce}>
              <div className="row g-3">
                <div className="col-12">
                  <label className="form-label fw-semibold small">Produce / Crop Title *</label>
                  <input 
                    type="text" 
                    className="form-control" 
                    placeholder="e.g. Pure Desi Sharbati Wheat"
                    required
                    value={formData.title}
                    onChange={e => setFormData({ ...formData, title: e.target.value })}
                  />
                </div>

                <div className="col-md-6">
                  <label className="form-label fw-semibold small">Category *</label>
                  <select 
                    className="form-select"
                    value={formData.category}
                    onChange={e => setFormData({ ...formData, category: e.target.value })}
                  >
                    <option value="Grains & Cereals">Grains & Cereals</option>
                    <option value="Pulses">Pulses</option>
                    <option value="Vegetables">Vegetables</option>
                    <option value="Fruits">Fruits</option>
                    <option value="Spices & Herbs">Spices & Herbs</option>
                    <option value="Dairy & Organic">Dairy & Organic</option>
                  </select>
                </div>

                <div className="col-md-6">
                  <label className="form-label fw-semibold small">Variety / Seed Strain</label>
                  <input 
                    type="text" 
                    className="form-control" 
                    placeholder="e.g. C-306, Pusa 1121"
                    value={formData.variety}
                    onChange={e => setFormData({ ...formData, variety: e.target.value })}
                  />
                </div>

                <div className="col-md-6">
                  <label className="form-label fw-semibold small">Price per Unit (₹) *</label>
                  <div className="input-group">
                    <span className="input-group-text">₹</span>
                    <input 
                      type="number" 
                      className="form-control" 
                      placeholder="e.g. 38"
                      required
                      value={formData.pricePerUnit}
                      onChange={e => setFormData({ ...formData, pricePerUnit: e.target.value })}
                    />
                    <select 
                      className="form-select" 
                      style={{ maxWidth: '85px' }}
                      value={formData.unit}
                      onChange={e => setFormData({ ...formData, unit: e.target.value })}
                    >
                      <option value="kg">kg</option>
                      <option value="quintal">qtl</option>
                      <option value="ton">ton</option>
                    </select>
                  </div>
                </div>

                <div className="col-md-6">
                  <label className="form-label fw-semibold small">Available Quantity *</label>
                  <input 
                    type="number" 
                    className="form-control" 
                    placeholder="e.g. 2000"
                    required
                    value={formData.availableQuantity}
                    onChange={e => setFormData({ ...formData, availableQuantity: e.target.value })}
                  />
                </div>

                <div className="col-md-6">
                  <label className="form-label fw-semibold small">Minimum Order Quantity</label>
                  <input 
                    type="number" 
                    className="form-control" 
                    placeholder="10"
                    value={formData.minOrderQuantity}
                    onChange={e => setFormData({ ...formData, minOrderQuantity: e.target.value })}
                  />
                </div>

                <div className="col-md-6">
                  <label className="form-label fw-semibold small">Harvest Date</label>
                  <input 
                    type="date" 
                    className="form-control" 
                    value={formData.harvestDate}
                    onChange={e => setFormData({ ...formData, harvestDate: e.target.value })}
                  />
                </div>

                <div className="col-md-6">
                  <label className="form-label fw-semibold small">State *</label>
                  <input 
                    type="text" 
                    className="form-control" 
                    value={formData.state}
                    onChange={e => setFormData({ ...formData, state: e.target.value })}
                  />
                </div>

                <div className="col-md-6">
                  <label className="form-label fw-semibold small">Farm / Mandi Location</label>
                  <input 
                    type="text" 
                    className="form-control" 
                    placeholder="Village, Mandi Hub"
                    value={formData.location}
                    onChange={e => setFormData({ ...formData, location: e.target.value })}
                  />
                </div>

                <div className="col-12">
                  <label className="form-label fw-semibold small">Produce Image URL (Optional)</label>
                  <input 
                    type="url" 
                    className="form-control" 
                    placeholder="https://..."
                    value={formData.imageUrl}
                    onChange={e => setFormData({ ...formData, imageUrl: e.target.value })}
                  />
                  <small className="text-muted">Leave empty to use high quality auto-matched produce photo.</small>
                </div>

                <div className="col-12">
                  <label className="form-label fw-semibold small">Description</label>
                  <textarea 
                    className="form-control" 
                    rows="3" 
                    placeholder="Mention grading, moisture content, organic practices..."
                    value={formData.description}
                    onChange={e => setFormData({ ...formData, description: e.target.value })}
                  ></textarea>
                </div>

                <div className="col-12">
                  <div className="form-check">
                    <input 
                      type="checkbox" 
                      className="form-check-input" 
                      id="orgModalCheck"
                      checked={formData.isOrganic}
                      onChange={e => setFormData({ ...formData, isOrganic: e.target.checked })}
                    />
                    <label className="form-check-label fw-semibold text-success" htmlFor="orgModalCheck">
                      Certified Organic / Zero Chemical Residue
                    </label>
                  </div>
                </div>

                <div className="col-12 d-flex justify-content-end gap-2 mt-4">
                  <button type="button" className="btn btn-light" onClick={() => setShowAddModal(false)}>
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-ann-primary" disabled={submitting}>
                    {submitting ? 'Publishing...' : 'Publish Produce Listing'}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= REPLY INQUIRY MODAL ================= */}
      {replyModal && (
        <div className="ann-modal-backdrop" onClick={() => setReplyModal(null)}>
          <div className="ann-modal-content p-4" onClick={e => e.stopPropagation()}>
            <h5 className="fw-bold mb-2">Reply to {replyModal.buyerName}</h5>
            <div className="p-3 bg-light rounded-3 mb-3 small text-muted">
              "{replyModal.message}"
            </div>
            <form onSubmit={handleSendReply}>
              <div className="mb-3">
                <label className="form-label fw-semibold small">Your Offer / Response:</label>
                <textarea 
                  className="form-control" 
                  rows="3" 
                  placeholder="Type your price quotation or pickup details..."
                  required
                  value={replyText}
                  onChange={e => setReplyText(e.target.value)}
                ></textarea>
              </div>
              <div className="d-flex justify-content-end gap-2">
                <button type="button" className="btn btn-light" onClick={() => setReplyModal(null)}>Cancel</button>
                <button type="submit" className="btn btn-ann-primary">Send Direct Reply</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
