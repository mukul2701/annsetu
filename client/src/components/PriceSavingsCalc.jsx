import React, { useState } from 'react';

export default function PriceSavingsCalc() {
  const [crop, setCrop] = useState('wheat');
  const [quantity, setQuantity] = useState(1000); // kg

  const cropData = {
    wheat: { name: 'Sharbati Wheat', farmerPrice: 38, mandiIntermediaryCost: 14, retailPrice: 52 },
    rice: { name: 'Basmati Rice', farmerPrice: 85, mandiIntermediaryCost: 32, retailPrice: 117 },
    onion: { name: 'Nashik Red Onion', farmerPrice: 24, mandiIntermediaryCost: 16, retailPrice: 40 },
    mango: { name: 'Alphonso Mango', farmerPrice: 140, mandiIntermediaryCost: 65, retailPrice: 205 },
    turmeric: { name: 'Lakadong Turmeric', farmerPrice: 220, mandiIntermediaryCost: 90, retailPrice: 310 }
  };

  const selected = cropData[crop];
  const traditionalTotal = selected.retailPrice * quantity;
  const annsetuTotal = selected.farmerPrice * quantity;
  const buyerSavings = traditionalTotal - annsetuTotal;
  const farmerExtraGain = Math.round(selected.farmerPrice * 0.22 * quantity);

  return (
    <div className="card shadow-sm border-0 rounded-4 overflow-hidden my-4" style={{ background: '#fff' }}>
      <div className="card-header text-white p-4" style={{ background: 'linear-gradient(135deg, #1b4332, #2d6a4f)' }}>
        <div className="d-flex align-items-center gap-3">
          <div className="p-3 bg-white bg-opacity-20 rounded-circle fs-3">
            🌾
          </div>
          <div>
            <h4 className="fw-bold mb-1">Middleman Elimination Calculator</h4>
            <p className="mb-0 opacity-75 small">
              See the real monetary impact of connecting farmers and buyers directly via AnnSetu.
            </p>
          </div>
        </div>
      </div>

      <div className="card-body p-4">
        <div className="row g-4 align-items-center">
          {/* Controls */}
          <div className="col-md-5">
            <label className="form-label fw-bold text-dark">Select Agricultural Commodity:</label>
            <select 
              className="form-select form-select-lg mb-4"
              value={crop}
              onChange={(e) => setCrop(e.target.value)}
            >
              <option value="wheat">🌾 Sharbati Wheat (Sehore)</option>
              <option value="rice">🍚 1121 Basmati Rice (Karnal)</option>
              <option value="onion">🧅 Red Onion (Nashik)</option>
              <option value="mango">🥭 Alphonso Mango (Ratnagiri)</option>
              <option value="turmeric">🌱 Lakadong Turmeric (Meghalaya)</option>
            </select>

            <label className="form-label fw-bold text-dark d-flex justify-content-between">
              <span>Procurement Volume:</span>
              <span className="text-success fw-bold">{quantity.toLocaleString('en-IN')} kg</span>
            </label>
            <input 
              type="range" 
              className="form-range" 
              min="100" 
              max="10000" 
              step="100"
              value={quantity}
              onChange={(e) => setQuantity(Number(e.target.value))}
            />
            <div className="d-flex justify-content-between small text-muted">
              <span>100 kg</span>
              <span>5,000 kg</span>
              <span>10,000 kg</span>
            </div>
          </div>

          {/* Results Comparison */}
          <div className="col-md-7">
            <div className="row g-3">
              {/* Buyer Savings */}
              <div className="col-sm-6">
                <div className="p-3 rounded-4 h-100" style={{ background: '#f0fdf4', border: '1.5px solid #86efac' }}>
                  <div className="small text-uppercase fw-bold text-success mb-1">
                    <i className="fa-solid fa-wallet me-1"></i> Buyer Direct Savings
                  </div>
                  <h3 className="fw-bold text-success mb-1">
                    ₹{buyerSavings.toLocaleString('en-IN')}
                  </h3>
                  <p className="small text-muted mb-0">
                    Saved by procuring direct at ₹{selected.farmerPrice}/kg instead of traditional middleman markups at ₹{selected.retailPrice}/kg.
                  </p>
                </div>
              </div>

              {/* Farmer Extra Income */}
              <div className="col-sm-6">
                <div className="p-3 rounded-4 h-100" style={{ background: '#fefce8', border: '1.5px solid #fef08a' }}>
                  <div className="small text-uppercase fw-bold text-warning-emphasis mb-1">
                    <i className="fa-solid fa-hand-holding-dollar me-1"></i> Farmer Direct Benefit
                  </div>
                  <h3 className="fw-bold text-dark mb-1">
                    +₹{farmerExtraGain.toLocaleString('en-IN')}
                  </h3>
                  <p className="small text-muted mb-0">
                    Direct payment received without APMC broker deductions, arbitrary weighment cuts, or credit delays.
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-3 p-3 bg-light rounded-3 d-flex align-items-center gap-2 text-muted small">
              <i className="fa-solid fa-circle-info text-primary fs-5"></i>
              <span>AnnSetu operates on a 0% commission model for Indian farmers. Direct payments go 100% to the producer.</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
