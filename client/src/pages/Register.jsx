import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';

export default function Register({ setActivePage }) {
  const { register, loading } = useAuth();
  const [role, setRole] = useState('farmer');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    state: 'Madhya Pradesh',
    district: '',
    village: '',
    businessName: '',
    businessType: ''
  });
  const [error, setError] = useState('');

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    try {
      const res = await register({
        ...formData,
        role
      });
      if (res.success) {
        if (role === 'farmer') setActivePage('farmer-dashboard');
        else setActivePage('marketplace');
      }
    } catch (err) {
      setError(err.message || 'Registration failed');
    }
  }

  return (
    <div className="py-5" style={{ background: '#f5f2e7' }}>
      <div className="container py-4">
        <div className="card shadow border-0 rounded-4 mx-auto p-4 p-md-5 bg-white" style={{ maxWidth: '580px' }}>
          <div className="text-center mb-4">
            <div className="fs-1 text-success mb-1">🌾</div>
            <h3 className="fw-bold text-dark">Join AnnSetu</h3>
            <p className="text-muted small">Create an account to start direct agricultural trading</p>
          </div>

          {/* Role Toggle */}
          <div className="btn-group w-100 mb-4 p-1 bg-light rounded-pill border" role="group">
            <button
              type="button"
              className={`btn rounded-pill fw-semibold ${role === 'farmer' ? 'btn-success text-white' : 'btn-light text-muted'}`}
              onClick={() => setRole('farmer')}
            >
              🌾 I am a Farmer (अन्नदाता)
            </button>
            <button
              type="button"
              className={`btn rounded-pill fw-semibold ${role === 'buyer' ? 'btn-primary text-white' : 'btn-light text-muted'}`}
              onClick={() => setRole('buyer')}
            >
              🛒 I am a Buyer / Wholesaler
            </button>
          </div>

          {error && (
            <div className="alert alert-danger py-2 small" role="alert">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="row g-3">
              <div className="col-12">
                <label className="form-label small fw-semibold">
                  {role === 'farmer' ? 'Farmer Full Name *' : 'Contact Person Name *'}
                </label>
                <input 
                  type="text" 
                  className="form-control" 
                  placeholder="e.g. Ramesh Patel"
                  required
                  value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                />
              </div>

              {role === 'buyer' && (
                <div className="col-12">
                  <label className="form-label small fw-semibold">Business / Supermarket Name</label>
                  <input 
                    type="text" 
                    className="form-control" 
                    placeholder="e.g. Patel Agro Foods Pvt Ltd"
                    value={formData.businessName}
                    onChange={e => setFormData({ ...formData, businessName: e.target.value })}
                  />
                </div>
              )}

              <div className="col-md-6">
                <label className="form-label small fw-semibold">Email Address *</label>
                <input 
                  type="email" 
                  className="form-control" 
                  placeholder="name@example.com"
                  required
                  value={formData.email}
                  onChange={e => setFormData({ ...formData, email: e.target.value })}
                />
              </div>

              <div className="col-md-6">
                <label className="form-label small fw-semibold">Mobile Number *</label>
                <input 
                  type="tel" 
                  className="form-control" 
                  placeholder="+91-9876543210"
                  required
                  value={formData.phone}
                  onChange={e => setFormData({ ...formData, phone: e.target.value })}
                />
              </div>

              <div className="col-md-6">
                <label className="form-label small fw-semibold">Password *</label>
                <input 
                  type="password" 
                  className="form-control" 
                  placeholder="Minimum 6 characters"
                  required
                  value={formData.password}
                  onChange={e => setFormData({ ...formData, password: e.target.value })}
                />
              </div>

              <div className="col-md-6">
                <label className="form-label small fw-semibold">State *</label>
                <select 
                  className="form-select"
                  value={formData.state}
                  onChange={e => setFormData({ ...formData, state: e.target.value })}
                >
                  <option value="Madhya Pradesh">Madhya Pradesh</option>
                  <option value="Punjab">Punjab</option>
                  <option value="Haryana">Haryana</option>
                  <option value="Maharashtra">Maharashtra</option>
                  <option value="Rajasthan">Rajasthan</option>
                  <option value="Gujarat">Gujarat</option>
                  <option value="Uttar Pradesh">Uttar Pradesh</option>
                  <option value="Himachal Pradesh">Himachal Pradesh</option>
                </select>
              </div>

              <div className="col-md-6">
                <label className="form-label small fw-semibold">District</label>
                <input 
                  type="text" 
                  className="form-control" 
                  placeholder="e.g. Sehore, Karnal"
                  value={formData.district}
                  onChange={e => setFormData({ ...formData, district: e.target.value })}
                />
              </div>

              <div className="col-md-6">
                <label className="form-label small fw-semibold">
                  {role === 'farmer' ? 'Village / Tehsil' : 'Mandi / City Area'}
                </label>
                <input 
                  type="text" 
                  className="form-control" 
                  placeholder={role === 'farmer' ? 'e.g. Ashta Gram' : 'e.g. Azadpur Mandi'}
                  value={formData.village}
                  onChange={e => setFormData({ ...formData, village: e.target.value })}
                />
              </div>

              <div className="col-12 mt-4">
                <button 
                  type="submit" 
                  className="btn btn-ann-primary w-100 py-3 fw-bold rounded-pill"
                  disabled={loading}
                >
                  {loading ? 'Creating Account...' : `Register as ${role === 'farmer' ? 'Farmer' : 'Wholesale Buyer'}`}
                </button>
              </div>
            </div>
          </form>

          <div className="text-center mt-4 pt-3 border-top small text-muted">
            Already have an AnnSetu account?{' '}
            <button 
              className="btn btn-link p-0 text-success fw-bold text-decoration-none"
              onClick={() => setActivePage('login')}
            >
              Sign In
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
