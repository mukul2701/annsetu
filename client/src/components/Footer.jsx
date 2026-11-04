import React from 'react';

export default function Footer({ setActivePage }) {
  return (
    <footer className="ann-footer">
      <div className="container">
        <div className="row g-4">
          <div className="col-lg-4 col-md-6">
            <h5 className="d-flex align-items-center gap-2">
              🌾 AnnSetu
            </h5>
            <p className="mb-3">
              AnnSetu is dedicated to empowering Indian farmers and transforming the agricultural value chain. 
              By eliminating middlemen and introducing direct, transparent, and technology-enabled market access, 
              we ensure that farmers receive the true value of their produce.
            </p>
            <div className="d-flex gap-3 fs-5">
              <a href="#social" className="text-white-50"><i className="fa-brands fa-facebook"></i></a>
              <a href="#social" className="text-white-50"><i className="fa-brands fa-whatsapp"></i></a>
              <a href="#social" className="text-white-50"><i className="fa-brands fa-x-twitter"></i></a>
              <a href="#social" className="text-white-50"><i className="fa-brands fa-youtube"></i></a>
            </div>
          </div>

          <div className="col-lg-2 col-md-6 col-6">
            <h5>Quick Links</h5>
            <ul className="list-unstyled">
              <li className="mb-2">
                <a href="#home" onClick={(e) => { e.preventDefault(); setActivePage('home'); }}>Home</a>
              </li>
              <li className="mb-2">
                <a href="#market" onClick={(e) => { e.preventDefault(); setActivePage('marketplace'); }}>Produce Market</a>
              </li>
              <li className="mb-2">
                <a href="#mandi" onClick={(e) => { e.preventDefault(); setActivePage('mandi'); }}>Live Mandi Rates</a>
              </li>
              <li className="mb-2">
                <a href="#calc" onClick={(e) => { e.preventDefault(); setActivePage('calculator'); }}>Savings Calculator</a>
              </li>
              <li className="mb-2">
                <a href="#about" onClick={(e) => { e.preventDefault(); setActivePage('about'); }}>About Mission</a>
              </li>
            </ul>
          </div>

          <div className="col-lg-2 col-md-6 col-6">
            <h5>Roles</h5>
            <ul className="list-unstyled">
              <li className="mb-2">
                <a href="#farmer" onClick={(e) => { e.preventDefault(); setActivePage('farmer-dashboard'); }}>🌾 Farmer Dashboard</a>
              </li>
              <li className="mb-2">
                <a href="#buyer" onClick={(e) => { e.preventDefault(); setActivePage('marketplace'); }}>🛒 Wholesale Buyer</a>
              </li>
              <li className="mb-2">
                <a href="#orders" onClick={(e) => { e.preventDefault(); setActivePage('buyer-orders'); }}>📦 Order Tracking</a>
              </li>
              <li className="mb-2">
                <a href="#cart" onClick={(e) => { e.preventDefault(); setActivePage('cart'); }}>🛍️ Shopping Cart</a>
              </li>
            </ul>
          </div>

          <div className="col-lg-4 col-md-6">
            <h5>Direct Contact</h5>
            <p className="mb-2">
              <i className="fa-solid fa-envelope me-2 text-warning"></i>
              <strong>Email:</strong> info@annsetu.com
            </p>
            <p className="mb-2">
              <i className="fa-solid fa-phone me-2 text-warning"></i>
              <strong>Phone:</strong> +91-9876543210
            </p>
            <p className="mb-2">
              <i className="fa-solid fa-location-dot me-2 text-warning"></i>
              <strong>Hubs:</strong> Punjab, Madhya Pradesh, Maharashtra, Delhi NCR
            </p>
            <div className="p-2 mt-3 rounded bg-dark border border-secondary border-opacity-25 small text-white-50">
              <i className="fa-solid fa-shield-halved text-success me-1"></i> 100% Verified Farmers & Transparent Pricing
            </div>
          </div>
        </div>

        <hr />

        <div className="d-flex flex-wrap justify-content-between align-items-center small text-muted">
          <p className="mb-0">
            &copy; 2025 AnnSetu | Connecting Farmers & Buyers. Built with MERN Stack.
          </p>
          <div>
            <span className="me-3">Crafted for Bharat's Agricultural Future</span>
            <span>Made with <i className="fa-solid fa-heart text-danger"></i></span>
          </div>
        </div>
      </div>
    </footer>
  );
}
