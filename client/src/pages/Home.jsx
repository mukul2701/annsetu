import React, { useEffect, useState } from 'react';
import StatsSection from '../components/StatsSection';
import PriceSavingsCalc from '../components/PriceSavingsCalc';
import ProductCard from '../components/ProductCard';
import { useAuth } from '../context/AuthContext';

export default function Home({ setActivePage, onOpenInquiry, onSelectProduct }) {
  const { user, demoLogin } = useAuth();
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/products')
      .then(res => res.json())
      .then(data => {
        if (data.success && data.products) {
          setFeaturedProducts(data.products.slice(0, 4));
        }
      })
      .catch(err => console.warn(err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      {/* ================= HERO SECTION ================= */}
      <section className="hero-wrapper">
        <div className="hero-overlay"></div>
        <div className="hero-content">
          <span className="badge bg-warning text-dark px-3 py-2 rounded-pill fs-6 fw-bold mb-3 shadow">
            🌾 Direct Agricultural Bridge
          </span>
          <h1>
            AnnSetu: <span>Redefining Agriculture</span>
          </h1>
          <p>
            At <strong>AnnSetu</strong>, we are dedicated to empowering farmers and transforming
            the agricultural value chain. By eliminating middlemen and introducing direct,
            transparent, and technology-enabled market access, we ensure that farmers receive
            the true value of their produce.
          </p>

          <div className="d-flex flex-wrap justify-content-center gap-3">
            <button 
              className="role-btn farmer-role"
              onClick={() => {
                if (user?.role === 'farmer') {
                  setActivePage('farmer-dashboard');
                } else if (!user) {
                  demoLogin('farmer').then(() => setActivePage('farmer-dashboard'));
                } else {
                  setActivePage('farmer-dashboard');
                }
              }}
            >
              🌾 Enter as Farmer
            </button>

            <button 
              className="role-btn buyer-role"
              onClick={() => setActivePage('marketplace')}
            >
              🛒 Explore Produce Market
            </button>
          </div>
        </div>
      </section>

      {/* ================= ROLE SELECTION SECTION ================= */}
      <section className="role-section">
        <div className="container">
          <div className="text-center mb-4">
            <h2 className="display-6 fw-bold text-success mb-2">Choose Your Role</h2>
            <p className="text-muted">Direct interface customized for Indian farmers and wholesale buyers</p>
          </div>

          <div className="d-flex justify-content-center">
            <div className="role-box">
              <div className="text-start" style={{ maxWidth: '320px' }}>
                <h5 className="fw-bold text-success mb-1">🌾 Are you a Farmer?</h5>
                <p className="small text-muted mb-3">
                  List your harvested crops, set your own fair price, connect with verified buyers nationwide, and receive 100% direct payments.
                </p>
                <button 
                  className="role-btn farmer-role py-2 px-4 fs-6"
                  onClick={() => {
                    if (user?.role === 'farmer') {
                      setActivePage('farmer-dashboard');
                    } else if (!user) {
                      demoLogin('farmer').then(() => setActivePage('farmer-dashboard'));
                    } else {
                      setActivePage('farmer-dashboard');
                    }
                  }}
                >
                  🌾 Farmer Portal
                </button>
              </div>

              <div className="vr d-none d-md-block my-2 text-secondary"></div>

              <div className="text-start" style={{ maxWidth: '320px' }}>
                <h5 className="fw-bold text-primary mb-1">🛒 Are you a Buyer?</h5>
                <p className="small text-muted mb-3">
                  Procure verified farm-fresh grains, pulses, fruits, and vegetables directly from source at 15-25% lower prices than retail mandis.
                </p>
                <button 
                  className="role-btn buyer-role py-2 px-4 fs-6"
                  onClick={() => setActivePage('marketplace')}
                >
                  🛒 Buyer Marketplace
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= STATS SECTION ================= */}
      <StatsSection />

      {/* ================= FEATURED PRODUCE ================= */}
      <section className="py-5 bg-white">
        <div className="container">
          <div className="d-flex flex-wrap justify-content-between align-items-end mb-4">
            <div>
              <span className="badge bg-success-subtle text-success px-3 py-2 rounded-pill fs-6 fw-semibold mb-2">
                FRESH FROM TODAY'S HARVEST
              </span>
              <h2 className="fw-bold text-dark mb-1">Featured Produce from Verified Farmers</h2>
              <p className="text-muted mb-0">Grade-A produce ready for dispatch with zero mandi commission</p>
            </div>
            <button 
              className="btn btn-ann-secondary mt-3 mt-sm-0"
              onClick={() => setActivePage('marketplace')}
            >
              View All Produce <i className="fa-solid fa-arrow-right ms-1"></i>
            </button>
          </div>

          <div className="row g-4">
            {featuredProducts.map(prod => (
              <div key={prod._id} className="col-lg-3 col-md-6 col-sm-12">
                <ProductCard 
                  product={prod}
                  onOpenInquiry={onOpenInquiry}
                  onSelectProduct={onSelectProduct}
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= SAVINGS CALCULATOR ================= */}
      <section className="py-5" style={{ background: '#f5f2e7' }}>
        <div className="container">
          <div className="text-center mb-4">
            <span className="badge bg-warning-subtle text-warning-emphasis px-3 py-2 rounded-pill fs-6 fw-semibold mb-2">
              TRANSPARENT VALUE CHAIN
            </span>
            <h2 className="fw-bold text-dark">How Much Do You Save With AnnSetu?</h2>
            <p className="text-muted mx-auto" style={{ maxWidth: '600px' }}>
              Eliminating intermediaries translates to higher revenue for farmers and lower procurement costs for buyers.
            </p>
          </div>
          <PriceSavingsCalc />
        </div>
      </section>

      {/* ================= HOW IT WORKS ================= */}
      <section className="py-5 bg-white">
        <div className="container">
          <div className="text-center mb-5">
            <span className="badge bg-success-subtle text-success px-3 py-2 rounded-pill fs-6 fw-semibold mb-2">
              SIMPLE 3-STEP PROCESS
            </span>
            <h2 className="fw-bold text-dark">How AnnSetu Operates</h2>
            <p className="text-muted">A seamless, tech-enabled bridge linking farm gate to buyer destination</p>
          </div>

          <div className="row g-4 text-center">
            <div className="col-md-4">
              <div className="p-4 rounded-4 h-100 bg-light border border-light-subtle">
                <div className="fs-1 text-success mb-3">
                  <i className="fa-solid fa-seedling"></i>
                </div>
                <h5 className="fw-bold">1. Farmer Lists Crop</h5>
                <p className="text-muted small">
                  The farmer lists harvested crop details, quantity, photos, and desired price directly from their phone.
                </p>
              </div>
            </div>

            <div className="col-md-4">
              <div className="p-4 rounded-4 h-100 bg-light border border-light-subtle">
                <div className="fs-1 text-primary mb-3">
                  <i className="fa-solid fa-handshake"></i>
                </div>
                <h5 className="fw-bold">2. Direct Negotiation & Order</h5>
                <p className="text-muted small">
                  Wholesalers and buyers browse live produce, compare with APMC mandi rates, negotiate directly, and place orders.
                </p>
              </div>
            </div>

            <div className="col-md-4">
              <div className="p-4 rounded-4 h-100 bg-light border border-light-subtle">
                <div className="fs-1 text-warning mb-3">
                  <i className="fa-solid fa-truck-fast"></i>
                </div>
                <h5 className="fw-bold">3. Dispatch & Direct Settlement</h5>
                <p className="text-muted small">
                  Produce is verified and dispatched directly from farm. Payments are settled transparently with 0% middleman deduction.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
