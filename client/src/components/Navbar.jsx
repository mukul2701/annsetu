import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

export default function Navbar({ activePage, setActivePage }) {
  const { user, logout, demoLogin } = useAuth();
  const { cart } = useCart();
  const cartItemCount = cart.reduce((sum, item) => sum + (item.quantity > 0 ? 1 : 0), 0);

  return (
    <nav className="navbar navbar-expand-lg ann-navbar">
      <div className="container">
        {/* Brand */}
        <a 
          className="ann-brand" 
          href="#home" 
          onClick={(e) => { e.preventDefault(); setActivePage('home'); }}
        >
          <span>🌾 AnnSetu</span>
          <span className="badge bg-success-subtle text-success fs-6 fw-normal px-2 py-1 ms-1 d-none d-sm-inline">
            अन्नदाता सेतु
          </span>
        </a>

        {/* Mobile toggle */}
        <button 
          className="navbar-toggler text-white border-secondary" 
          type="button" 
          data-bs-toggle="collapse" 
          data-bs-target="#navbarContent"
        >
          <span className="navbar-toggler-icon" style={{ filter: 'invert(1)' }}></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarContent">
          {/* Main Navigation */}
          <ul className="navbar-nav ms-auto align-items-lg-center">
            <li className="nav-item">
              <a 
                className={`ann-nav-link ${activePage === 'home' ? 'active' : ''}`}
                href="#home"
                onClick={(e) => { e.preventDefault(); setActivePage('home'); }}
              >
                Home
              </a>
            </li>

            <li className="nav-item">
              <a 
                className={`ann-nav-link ${activePage === 'marketplace' ? 'active' : ''}`}
                href="#marketplace"
                onClick={(e) => { e.preventDefault(); setActivePage('marketplace'); }}
              >
                <i className="fa-solid fa-store me-1"></i> Produce Market
              </a>
            </li>

            <li className="nav-item">
              <a 
                className={`ann-nav-link ${activePage === 'mandi' ? 'active' : ''}`}
                href="#mandi"
                onClick={(e) => { e.preventDefault(); setActivePage('mandi'); }}
              >
                <i className="fa-solid fa-chart-simple me-1"></i> Mandi Rates
              </a>
            </li>

            <li className="nav-item">
              <a 
                className={`ann-nav-link ${activePage === 'calculator' ? 'active' : ''}`}
                href="#calculator"
                onClick={(e) => { e.preventDefault(); setActivePage('calculator'); }}
              >
                <i className="fa-solid fa-calculator me-1"></i> Savings Calc
              </a>
            </li>

            <li className="nav-item">
              <a 
                className={`ann-nav-link ${activePage === 'about' ? 'active' : ''}`}
                href="#about"
                onClick={(e) => { e.preventDefault(); setActivePage('about'); }}
              >
                About
              </a>
            </li>

            {/* Cart Icon */}
            <li className="nav-item ms-lg-2">
              <button 
                className="btn btn-outline-warning position-relative rounded-pill px-3 py-1 text-white border-warning"
                onClick={() => setActivePage('cart')}
              >
                <i className="fa-solid fa-cart-shopping me-1 text-warning"></i> Cart
                {cartItemCount > 0 && (
                  <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                    {cartItemCount}
                  </span>
                )}
              </button>
            </li>

            {/* Auth Section */}
            {user ? (
              <li className="nav-item dropdown ms-lg-3 mt-2 mt-lg-0">
                <button 
                  className="btn btn-outline-light rounded-pill dropdown-toggle d-flex align-items-center gap-2 px-3 py-1"
                  type="button" 
                  data-bs-toggle="dropdown" 
                  aria-expanded="false"
                >
                  <img 
                    src={user.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100'} 
                    alt={user.name} 
                    className="rounded-circle"
                    style={{ width: '24px', height: '24px', objectFit: 'cover' }}
                  />
                  <span className="text-truncate" style={{ maxWidth: '120px' }}>{user.name}</span>
                  <span className={`role-pill ${user.role}`}>{user.role}</span>
                </button>
                <ul className="dropdown-menu dropdown-menu-end shadow">
                  <li>
                    <div className="dropdown-header">
                      <strong>{user.name}</strong>
                      <div className="small text-muted">{user.email}</div>
                    </div>
                  </li>
                  <li><hr className="dropdown-divider" /></li>
                  {user.role === 'farmer' && (
                    <li>
                      <button 
                        className="dropdown-item py-2"
                        onClick={() => setActivePage('farmer-dashboard')}
                      >
                        <i className="fa-solid fa-tractor me-2 text-success"></i> Farmer Dashboard
                      </button>
                    </li>
                  )}
                  {user.role === 'buyer' && (
                    <li>
                      <button 
                        className="dropdown-item py-2"
                        onClick={() => setActivePage('buyer-orders')}
                      >
                        <i className="fa-solid fa-boxes-stacked me-2 text-primary"></i> My Orders & Invoices
                      </button>
                    </li>
                  )}
                  <li>
                    <button 
                      className="dropdown-item py-2 text-danger"
                      onClick={() => { logout(); setActivePage('home'); }}
                    >
                      <i className="fa-solid fa-arrow-right-from-bracket me-2"></i> Sign Out
                    </button>
                  </li>
                </ul>
              </li>
            ) : (
              <li className="nav-item d-flex flex-wrap gap-2 ms-lg-3 mt-2 mt-lg-0">
                <button 
                  className="btn btn-sm btn-outline-light rounded-pill px-3"
                  onClick={() => setActivePage('login')}
                >
                  Sign In
                </button>
                <button 
                  className="btn btn-sm btn-success rounded-pill px-3 fw-semibold"
                  onClick={() => setActivePage('register')}
                >
                  Register
                </button>
              </li>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
}
