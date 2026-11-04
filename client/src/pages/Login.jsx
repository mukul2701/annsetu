import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';

export default function Login({ setActivePage }) {
  const { login, demoLogin, loading } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    try {
      const res = await login(email, password);
      if (res.success) {
        if (res.user.role === 'farmer') setActivePage('farmer-dashboard');
        else setActivePage('marketplace');
      }
    } catch (err) {
      setError(err.message || 'Login failed. Please check credentials.');
    }
  }

  async function handleDemo(role) {
    setError('');
    try {
      const res = await demoLogin(role);
      if (res.success) {
        if (role === 'farmer') setActivePage('farmer-dashboard');
        else if (role === 'buyer') setActivePage('marketplace');
        else setActivePage('marketplace');
      }
    } catch (err) {
      setError(err.message || 'Demo login failed');
    }
  }

  return (
    <div className="py-5" style={{ background: '#f5f2e7', minHeight: '80vh' }}>
      <div className="container py-4">
        <div className="card shadow border-0 rounded-4 mx-auto p-4 p-md-5 bg-white" style={{ maxWidth: '480px' }}>
          <div className="text-center mb-4">
            <div className="fs-1 text-success mb-1">🌾</div>
            <h3 className="fw-bold text-dark">Welcome to AnnSetu</h3>
            <p className="text-muted small">Connecting Farmers & Wholesale Buyers Directly</p>
          </div>

          {/* Quick 1-Click Demo Logins */}
          <div className="p-3 bg-light rounded-4 mb-4 border border-success-subtle">
            <div className="small fw-bold text-success mb-2 text-center text-uppercase">
              ⚡ Instant 1-Click Demo Test Logins
            </div>
            <div className="d-grid gap-2">
              <button 
                type="button" 
                className="btn btn-sm btn-outline-success fw-semibold text-start d-flex justify-content-between align-items-center py-2 px-3 bg-white"
                onClick={() => handleDemo('farmer')}
                disabled={loading}
              >
                <span>🌾 Login as Demo Farmer (Ramesh Patel)</span>
                <i className="fa-solid fa-arrow-right small"></i>
              </button>
              <button 
                type="button" 
                className="btn btn-sm btn-outline-primary fw-semibold text-start d-flex justify-content-between align-items-center py-2 px-3 bg-white"
                onClick={() => handleDemo('buyer')}
                disabled={loading}
              >
                <span>🛒 Login as Demo Buyer (Sunil Sharma)</span>
                <i className="fa-solid fa-arrow-right small"></i>
              </button>
            </div>
          </div>

          <div className="text-center text-muted small my-3 position-relative">
            <span className="bg-white px-3 position-relative" style={{ zIndex: 1 }}>or sign in with email</span>
            <hr className="position-absolute w-100 top-50 start-0 m-0" />
          </div>

          {error && (
            <div className="alert alert-danger py-2 small" role="alert">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label small fw-semibold">Email Address</label>
              <input 
                type="email" 
                className="form-control" 
                placeholder="name@example.com"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
              />
            </div>

            <div className="mb-4">
              <label className="form-label small fw-semibold">Password</label>
              <input 
                type="password" 
                className="form-control" 
                placeholder="••••••••"
                required
                value={password}
                onChange={e => setPassword(e.target.value)}
              />
            </div>

            <button 
              type="submit" 
              className="btn btn-ann-primary w-100 py-2 fw-semibold rounded-pill"
              disabled={loading}
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <div className="text-center mt-4 pt-3 border-top small text-muted">
            Don't have an AnnSetu account?{' '}
            <button 
              className="btn btn-link p-0 text-success fw-bold text-decoration-none"
              onClick={() => setActivePage('register')}
            >
              Register Here
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
