import React, { useEffect, useState } from 'react';

export default function MandiRates({ setActivePage }) {
  const [rates, setRates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [state, setState] = useState('All');

  useEffect(() => {
    fetchRates();
  }, [state]);

  function fetchRates() {
    setLoading(true);
    const params = new URLSearchParams();
    if (state !== 'All') params.append('state', state);
    if (search.trim()) params.append('search', search.trim());

    fetch(`/api/mandi?${params.toString()}`)
      .then(res => res.json())
      .then(data => {
        if (data.success && data.rates) {
          setRates(data.rates);
        }
      })
      .catch(err => console.warn(err))
      .finally(() => setLoading(false));
  }

  function handleSearch(e) {
    e.preventDefault();
    fetchRates();
  }

  return (
    <div className="py-5" style={{ background: '#fbf9f4' }}>
      <div className="container">
        {/* Header */}
        <div className="text-center mb-5">
          <span className="badge bg-warning-subtle text-warning-emphasis px-3 py-2 rounded-pill fs-6 fw-semibold mb-2">
            APMC REAL-TIME BENCHMARKS
          </span>
          <h2 className="display-6 fw-bold text-dark">
            Live Mandi Market Rates Explorer
          </h2>
          <p className="text-muted mx-auto" style={{ maxWidth: '650px' }}>
            Reference daily modal market rates across Indian APMCs. Farmers and wholesale buyers can evaluate fair market valuation before transacting on AnnSetu.
          </p>
        </div>

        {/* Filter Card */}
        <div className="card shadow-sm border-0 rounded-4 p-4 mb-4 bg-white">
          <form onSubmit={handleSearch} className="row g-3">
            <div className="col-md-7">
              <div className="input-group">
                <span className="input-group-text bg-light border-end-0">
                  <i className="fa-solid fa-magnifying-glass text-muted"></i>
                </span>
                <input 
                  type="text" 
                  className="form-control bg-light border-start-0" 
                  placeholder="Search commodity or mandi (e.g. Wheat, Basmati, Lasalgaon)..."
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                />
                <button type="submit" className="btn btn-ann-primary">Search</button>
              </div>
            </div>

            <div className="col-md-5">
              <select 
                className="form-select bg-light"
                value={state}
                onChange={e => setState(e.target.value)}
              >
                <option value="All">All Agricultural States</option>
                <option value="Madhya Pradesh">Madhya Pradesh</option>
                <option value="Haryana">Haryana</option>
                <option value="Punjab">Punjab</option>
                <option value="Maharashtra">Maharashtra</option>
                <option value="Rajasthan">Rajasthan</option>
                <option value="Gujarat">Gujarat</option>
                <option value="Uttar Pradesh">Uttar Pradesh</option>
              </select>
            </div>
          </form>
        </div>

        {/* Rates Table */}
        <div className="card shadow-sm border-0 rounded-4 overflow-hidden bg-white">
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0">
              <thead className="table-dark">
                <tr>
                  <th>Commodity</th>
                  <th>Category</th>
                  <th>APMC Mandi</th>
                  <th>State</th>
                  <th>Min Price</th>
                  <th>Max Price</th>
                  <th>Modal Benchmark</th>
                  <th>Daily Trend</th>
                  <th className="text-end">AnnSetu Action</th>
                </tr>
              </thead>
              <tbody>
                {rates.map(r => (
                  <tr key={r._id}>
                    <td className="fw-bold text-dark">{r.commodity}</td>
                    <td><span className="badge bg-light text-muted border">{r.category}</span></td>
                    <td className="fw-semibold text-primary">{r.mandi}</td>
                    <td>{r.state}</td>
                    <td className="text-muted">₹{r.minPrice}</td>
                    <td className="text-muted">₹{r.maxPrice}</td>
                    <td className="fw-bold text-success fs-6">
                      ₹{r.modalPrice} <small className="text-muted fw-normal">/{r.unit}</small>
                    </td>
                    <td>
                      <span className={`badge ${
                        r.trend === 'up' ? 'bg-success-subtle text-success' :
                        r.trend === 'down' ? 'bg-danger-subtle text-danger' : 'bg-secondary-subtle text-secondary'
                      }`}>
                        {r.trend === 'up' && <><i className="fa-solid fa-arrow-trend-up me-1"></i> Rising</>}
                        {r.trend === 'down' && <><i className="fa-solid fa-arrow-trend-down me-1"></i> Softening</>}
                        {r.trend === 'stable' && <><i className="fa-solid fa-minus me-1"></i> Stable</>}
                      </span>
                    </td>
                    <td className="text-end">
                      <button 
                        className="btn btn-sm btn-outline-success rounded-pill"
                        onClick={() => setActivePage('marketplace')}
                      >
                        Trade on AnnSetu
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
