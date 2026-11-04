import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import MandiTicker from './components/MandiTicker';

import Home from './pages/Home';
import Marketplace from './pages/Marketplace';
import FarmerDashboard from './pages/FarmerDashboard';
import BuyerOrders from './pages/BuyerOrders';
import Cart from './pages/Cart';
import MandiRates from './pages/MandiRates';
import PriceSavingsCalc from './components/PriceSavingsCalc';
import AboutContact from './pages/AboutContact';
import Login from './pages/Login';
import Register from './pages/Register';

import { useCart } from './context/CartContext';
import { useAuth } from './context/AuthContext';

export default function App() {
  const [activePage, setActivePage] = useState('home');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [inquiryProduct, setInquiryProduct] = useState(null);
  const [inquiryMessage, setInquiryMessage] = useState('');
  const [inquirySent, setInquirySent] = useState(false);
  const [modalQty, setModalQty] = useState(10);

  const { addToCart } = useCart();
  const { user, token, demoLogin } = useAuth();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [activePage]);

  async function handleSendInquiry(e) {
    e.preventDefault();
    if (!user) {
      await demoLogin('buyer');
    }
    const currentToken = token || localStorage.getItem('annsetu_token');
    try {
      const res = await fetch('/api/inquiries', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${currentToken}`
        },
        body: JSON.stringify({
          productId: inquiryProduct._id,
          message: inquiryMessage
        })
      });
      const data = await res.json();
      if (data.success) {
        setInquirySent(true);
        setTimeout(() => {
          setInquirySent(false);
          setInquiryProduct(null);
          setInquiryMessage('');
        }, 2000);
      }
    } catch (err) {
      alert('Error sending inquiry');
    }
  }

  return (
    <div className="d-flex flex-column min-vh-100">
      {/* Real-time APMC Mandi Ticker Bar */}
      <MandiTicker />

      {/* Main Navbar */}
      <Navbar activePage={activePage} setActivePage={setActivePage} />

      {/* Page Routing */}
      <main className="flex-grow-1">
        {activePage === 'home' && (
          <Home 
            setActivePage={setActivePage} 
            onOpenInquiry={setInquiryProduct}
            onSelectProduct={setSelectedProduct}
          />
        )}

        {activePage === 'marketplace' && (
          <Marketplace 
            onOpenInquiry={setInquiryProduct}
            onSelectProduct={setSelectedProduct}
          />
        )}

        {activePage === 'farmer-dashboard' && (
          <FarmerDashboard setActivePage={setActivePage} />
        )}

        {activePage === 'buyer-orders' && (
          <BuyerOrders setActivePage={setActivePage} />
        )}

        {activePage === 'cart' && (
          <Cart setActivePage={setActivePage} />
        )}

        {activePage === 'mandi' && (
          <MandiRates setActivePage={setActivePage} />
        )}

        {activePage === 'calculator' && (
          <div className="py-5" style={{ background: '#f5f2e7', minHeight: '75vh' }}>
            <div className="container">
              <div className="text-center mb-4">
                <span className="badge bg-success-subtle text-success px-3 py-2 rounded-pill fs-6 fw-semibold mb-2">
                  TRANSPARENCY TOOL
                </span>
                <h2 className="display-6 fw-bold text-dark">Middleman Margin Breakdown</h2>
                <p className="text-muted mx-auto" style={{ maxWidth: '600px' }}>
                  Evaluate how directly bypassing wholesale mandis delivers +25% earnings to farmers and saves 20% for bulk buyers.
                </p>
              </div>
              <PriceSavingsCalc />
            </div>
          </div>
        )}

        {activePage === 'about' && (
          <AboutContact />
        )}

        {activePage === 'login' && (
          <Login setActivePage={setActivePage} />
        )}

        {activePage === 'register' && (
          <Register setActivePage={setActivePage} />
        )}
      </main>

      {/* Footer */}
      <Footer setActivePage={setActivePage} />

      {/* ================= PRODUCT DETAIL MODAL ================= */}
      {selectedProduct && (
        <div className="ann-modal-backdrop" onClick={() => setSelectedProduct(null)}>
          <div className="ann-modal-content p-4" onClick={e => e.stopPropagation()} style={{ maxWidth: '720px' }}>
            <div className="d-flex justify-content-between align-items-center mb-3">
              <span className="badge bg-success">{selectedProduct.category}</span>
              <button className="btn-close" onClick={() => setSelectedProduct(null)}></button>
            </div>

            <div className="row g-4">
              <div className="col-md-6">
                <img 
                  src={selectedProduct.images?.[0] || 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=600'} 
                  alt={selectedProduct.title} 
                  className="img-fluid rounded-4 shadow-sm w-100"
                  style={{ height: '260px', objectFit: 'cover' }}
                />
                <div className="mt-3 p-3 bg-light rounded-3 small">
                  <div><strong>Farmer:</strong> {selectedProduct.farmerName}</div>
                  <div><strong>Origin:</strong> {selectedProduct.location || selectedProduct.state}</div>
                  <div><strong>Harvest Date:</strong> {selectedProduct.harvestDate || 'Freshly Harvested'}</div>
                  <div><strong>Certification:</strong> {selectedProduct.isOrganic ? '100% Organic' : 'Standard Good Agri Practices'}</div>
                </div>
              </div>

              <div className="col-md-6 d-flex flex-column">
                <h4 className="fw-bold text-dark mb-1">{selectedProduct.title}</h4>
                <div className="text-muted small mb-2">{selectedProduct.variety}</div>

                <div className="d-flex align-items-baseline gap-2 mb-3">
                  <span className="display-6 fw-bold text-success">₹{selectedProduct.pricePerUnit}</span>
                  <span className="text-muted">/ {selectedProduct.unit}</span>
                  {selectedProduct.retailBenchmark && (
                    <span className="text-decoration-line-through text-muted small ms-auto">
                      Retail: ₹{selectedProduct.retailBenchmark}
                    </span>
                  )}
                </div>

                <p className="small text-secondary mb-3 flex-grow-1">
                  {selectedProduct.description}
                </p>

                <div className="p-3 bg-success-subtle rounded-3 text-success small mb-3">
                  <i className="fa-solid fa-seedling me-1"></i>
                  Stock Left: <strong>{selectedProduct.availableQuantity} {selectedProduct.unit}</strong> (Min order: {selectedProduct.minOrderQuantity || 1} {selectedProduct.unit})
                </div>

                <div className="d-flex align-items-center gap-2 mb-3">
                  <label className="small text-muted mb-0">Qty ({selectedProduct.unit}):</label>
                  <input 
                    type="number" 
                    className="form-control text-center" 
                    style={{ width: '90px' }}
                    min={selectedProduct.minOrderQuantity || 1}
                    max={selectedProduct.availableQuantity}
                    value={modalQty}
                    onChange={e => setModalQty(Math.max(1, Number(e.target.value)))}
                  />
                  <button 
                    className="btn btn-ann-primary w-100 py-2 fw-semibold"
                    onClick={() => {
                      addToCart(selectedProduct, modalQty);
                      setSelectedProduct(null);
                      setActivePage('cart');
                    }}
                  >
                    <i className="fa-solid fa-cart-shopping me-1"></i> Buy Now
                  </button>
                </div>

                <button 
                  className="btn btn-outline-success rounded-pill w-100"
                  onClick={() => {
                    const p = selectedProduct;
                    setSelectedProduct(null);
                    setInquiryProduct(p);
                  }}
                >
                  <i className="fa-solid fa-comments me-1"></i> Negotiate / Inquire Farmer
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ================= INQUIRY MODAL ================= */}
      {inquiryProduct && (
        <div className="ann-modal-backdrop" onClick={() => setInquiryProduct(null)}>
          <div className="ann-modal-content p-4" onClick={e => e.stopPropagation()} style={{ maxWidth: '520px' }}>
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h5 className="fw-bold mb-0">
                <i className="fa-solid fa-comments text-success me-2"></i>
                Direct Negotiation with {inquiryProduct.farmerName}
              </h5>
              <button className="btn-close" onClick={() => setInquiryProduct(null)}></button>
            </div>

            {inquirySent ? (
              <div className="alert alert-success text-center py-4 rounded-3">
                <div className="fs-2 mb-2">🌾</div>
                <h6 className="fw-bold">Inquiry Sent Directly to Farmer!</h6>
                <p className="small mb-0">The farmer will be notified and can respond with custom pricing or pickup options.</p>
              </div>
            ) : (
              <form onSubmit={handleSendInquiry}>
                <div className="p-3 bg-light rounded-3 mb-3 small">
                  <div><strong>Produce:</strong> {inquiryProduct.title}</div>
                  <div><strong>Listed Price:</strong> ₹{inquiryProduct.pricePerUnit} / {inquiryProduct.unit}</div>
                  <div><strong>Farm Location:</strong> {inquiryProduct.location || inquiryProduct.state}</div>
                </div>

                <div className="mb-3">
                  <label className="form-label small fw-semibold">Your Message / Bulk Price Offer:</label>
                  <textarea 
                    className="form-control" 
                    rows="4" 
                    required
                    placeholder="e.g. Namaste ji. I need 500 kg for direct dispatch to Delhi. Can we agree on ₹36/kg for immediate bank transfer?"
                    value={inquiryMessage}
                    onChange={e => setInquiryMessage(e.target.value)}
                  ></textarea>
                </div>

                <div className="d-flex justify-content-end gap-2">
                  <button type="button" className="btn btn-light" onClick={() => setInquiryProduct(null)}>
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-ann-primary">
                    Send Direct Message
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
