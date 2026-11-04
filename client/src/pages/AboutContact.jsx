import React, { useState } from 'react';

export default function AboutContact() {
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', phone: '', message: '' });

  function handleSubmit(e) {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setForm({ name: '', email: '', phone: '', message: '' });
    }, 4000);
  }

  return (
    <div className="py-5" style={{ background: '#fbf9f4' }}>
      <div className="container">
        {/* About Section */}
        <div className="card shadow-sm border-0 rounded-4 p-5 mb-5 bg-white">
          <div className="row align-items-center g-5">
            <div className="col-lg-6">
              <span className="badge bg-success-subtle text-success px-3 py-2 rounded-pill fs-6 fw-semibold mb-3">
                OUR SACRED MISSION
              </span>
              <h2 className="display-6 fw-bold text-dark mb-3">
                AnnSetu: Bridge of Trust Between Annadata & Buyer
              </h2>
              <p className="lead text-muted">
                India's agricultural value chain has historically been constrained by 4 to 6 layers of middlemen, commission agents (Arhtiyas), and speculative brokers.
              </p>
              <p className="text-secondary">
                Farmers end up getting only 30% to 40% of the final consumer price, while wholesale buyers pay high inflated markups with uncertain quality. <strong>AnnSetu</strong> solves this through modern technology:
              </p>
              <ul className="list-unstyled text-dark">
                <li className="mb-2"><i className="fa-solid fa-check-circle text-success me-2"></i> <strong>Direct Price Discovery:</strong> Fair transparent pricing based on real-time APMC data.</li>
                <li className="mb-2"><i className="fa-solid fa-check-circle text-success me-2"></i> <strong>Zero Commission Deduction:</strong> 100% of the farmer's price reaches the farmer.</li>
                <li className="mb-2"><i className="fa-solid fa-check-circle text-success me-2"></i> <strong>Farm-Gate Quality Assurance:</strong> Verified harvest dates, organic certification, and moisture standards.</li>
              </ul>
            </div>
            <div className="col-lg-6">
              <img 
                src="https://images.unsplash.com/photo-1595974482597-4b8da8879bc5?w=800&auto=format&fit=crop&q=80" 
                alt="Indian Agriculture" 
                className="img-fluid rounded-4 shadow"
              />
            </div>
          </div>
        </div>

        {/* Contact Us Section */}
        <div className="row g-4">
          <div className="col-lg-5">
            <div className="card shadow-sm border-0 rounded-4 p-4 h-100 bg-white">
              <h4 className="fw-bold mb-3 text-dark">Get in Touch with AnnSetu</h4>
              <p className="text-muted small mb-4">
                Have questions about listing your harvest, bulk procurement logistics, or APMC mandi data? Reach our farmer support desk.
              </p>

              <div className="d-flex align-items-center gap-3 mb-3 p-3 bg-light rounded-3">
                <div className="fs-3 text-success"><i className="fa-solid fa-envelope"></i></div>
                <div>
                  <div className="text-muted small">Support Email</div>
                  <strong className="text-dark">info@annsetu.com</strong>
                </div>
              </div>

              <div className="d-flex align-items-center gap-3 mb-3 p-3 bg-light rounded-3">
                <div className="fs-3 text-primary"><i className="fa-solid fa-phone"></i></div>
                <div>
                  <div className="text-muted small">Farmer Helpline</div>
                  <strong className="text-dark">+91-9876543210</strong>
                </div>
              </div>

              <div className="d-flex align-items-center gap-3 p-3 bg-light rounded-3">
                <div className="fs-3 text-warning"><i className="fa-solid fa-location-dot"></i></div>
                <div>
                  <div className="text-muted small">Operational Regional Hubs</div>
                  <strong className="text-dark">Punjab, MP, Maharashtra, Delhi NCR</strong>
                </div>
              </div>
            </div>
          </div>

          <div className="col-lg-7">
            <div className="card shadow-sm border-0 rounded-4 p-4 p-md-5 bg-white">
              <h4 className="fw-bold mb-3 text-dark">Send an Agricultural Query</h4>

              {submitted ? (
                <div className="alert alert-success p-4 rounded-3 text-center">
                  <div className="fs-2 mb-2">🌾</div>
                  <h5>Dhanyawad! Your message has been received.</h5>
                  <p className="mb-0 small">An AnnSetu agricultural representative will contact you within 24 hours.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit}>
                  <div className="row g-3">
                    <div className="col-md-6">
                      <label className="form-label small fw-semibold">Your Name *</label>
                      <input 
                        type="text" 
                        className="form-control" 
                        required
                        value={form.name}
                        onChange={e => setForm({ ...form, name: e.target.value })}
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label small fw-semibold">Phone Number *</label>
                      <input 
                        type="tel" 
                        className="form-control" 
                        required
                        value={form.phone}
                        onChange={e => setForm({ ...form, phone: e.target.value })}
                      />
                    </div>
                    <div className="col-12">
                      <label className="form-label small fw-semibold">Email Address</label>
                      <input 
                        type="email" 
                        className="form-control" 
                        value={form.email}
                        onChange={e => setForm({ ...form, email: e.target.value })}
                      />
                    </div>
                    <div className="col-12">
                      <label className="form-label small fw-semibold">Message / Query *</label>
                      <textarea 
                        className="form-control" 
                        rows="4" 
                        required
                        placeholder="Inquire about onboarding your farm, bulk commodity order, or mandi integration..."
                        value={form.message}
                        onChange={e => setForm({ ...form, message: e.target.value })}
                      ></textarea>
                    </div>
                    <div className="col-12">
                      <button type="submit" className="btn btn-ann-primary py-2 px-4 rounded-pill">
                        Submit Query <i className="fa-solid fa-paper-plane ms-1"></i>
                      </button>
                    </div>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
