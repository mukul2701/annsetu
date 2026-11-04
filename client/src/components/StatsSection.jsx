import React, { useEffect, useState } from 'react';

export default function StatsSection() {
  const [stats, setStats] = useState({
    totalFarmers: 154,
    totalOrders: 218,
    totalBuyers: 126,
    activeMandiCount: 12
  });

  useEffect(() => {
    fetch('/api/analytics')
      .then(res => res.json())
      .then(data => {
        if (data.success && data.stats) {
          setStats(data.stats);
        }
      })
      .catch(err => console.warn('Analytics fetch error:', err));
  }, []);

  return (
    <section className="py-5" style={{ background: '#f8f9fa' }}>
      <div className="container">
        <div className="text-center mb-5">
          <span className="badge bg-success-subtle text-success px-3 py-2 rounded-pill fs-6 fw-semibold mb-2">
            TRANSFORMING AGRICULTURAL COMMERCE
          </span>
          <h2 className="display-6 fw-bold text-dark">
            Empowering Bharat's Annadatas
          </h2>
          <p className="text-muted mx-auto" style={{ maxWidth: '650px' }}>
            Real-time verified platform statistics across active agricultural belts in India.
          </p>
        </div>

        <div className="categories-container">
          {/* Farmers Box */}
          <div className="stat-box box2">
            <div className="stat-icon">
              <i className="fa-solid fa-face-smile"></i>
            </div>
            <h3>{stats.totalFarmers}+</h3>
            <h5>Verified Farmers</h5>
            <small className="opacity-75 mt-1">Earning 32% above APMC MSP</small>
          </div>

          {/* Orders Box */}
          <div className="stat-box box3">
            <div className="stat-icon">
              <i className="fa-solid fa-heart"></i>
            </div>
            <h3>{stats.totalOrders}+</h3>
            <h5>Direct Orders</h5>
            <small className="opacity-75 mt-1">Zero middlemen commission</small>
          </div>

          {/* Buyers Box */}
          <div className="stat-box box4">
            <div className="stat-icon">
              <i className="fa-solid fa-leaf"></i>
            </div>
            <h3>{stats.totalBuyers}+</h3>
            <h5>Wholesale Buyers</h5>
            <small className="opacity-75 mt-1">Supermarkets, exporters & mills</small>
          </div>

          {/* Mandis Box */}
          <div className="stat-box box5">
            <div className="stat-icon">
              <i className="fa-solid fa-scale-balanced"></i>
            </div>
            <h3>{stats.activeMandiCount || 10}+</h3>
            <h5>Connected Mandis</h5>
            <small className="opacity-75 mt-1">Live price benchmark updates</small>
          </div>
        </div>
      </div>
    </section>
  );
}
