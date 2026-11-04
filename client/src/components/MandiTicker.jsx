import React, { useEffect, useState } from 'react';

export default function MandiTicker() {
  const [rates, setRates] = useState([]);

  useEffect(() => {
    fetch('/api/mandi')
      .then(res => res.json())
      .then(data => {
        if (data.success && data.rates) {
          setRates(data.rates);
        }
      })
      .catch(err => console.warn('Mandi rates fetch error:', err));
  }, []);

  if (!rates.length) return null;

  // Duplicate for seamless infinite scroll
  const scrollItems = [...rates, ...rates];

  return (
    <div className="mandi-ticker-bar">
      <div className="ticker-label">
        <i className="fa-solid fa-chart-line"></i> LIVE APMC MANDI
      </div>
      <div className="ticker-track">
        {scrollItems.map((rate, index) => (
          <div key={`${rate._id}-${index}`} className="ticker-item">
            <span className="fw-semibold text-white">{rate.commodity}</span>
            <span className="text-secondary">({rate.mandi})</span>
            <span className="text-warning fw-bold">₹{rate.modalPrice}/{rate.unit}</span>
            <span className={rate.trend === 'up' ? 'trend-up' : rate.trend === 'down' ? 'trend-down' : 'trend-stable'}>
              {rate.trend === 'up' && <i className="fa-solid fa-arrow-trend-up"></i>}
              {rate.trend === 'down' && <i className="fa-solid fa-arrow-trend-down"></i>}
              {rate.trend === 'stable' && <i className="fa-solid fa-minus"></i>}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
