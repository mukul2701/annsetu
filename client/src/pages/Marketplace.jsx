import React, { useEffect, useState } from 'react';
import ProductCard from '../components/ProductCard';

export default function Marketplace({ onOpenInquiry, onSelectProduct }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [state, setState] = useState('All');
  const [organic, setOrganic] = useState(false);
  const [sort, setSort] = useState('newest');

  const categories = [
    'All',
    'Grains & Cereals',
    'Pulses',
    'Vegetables',
    'Fruits',
    'Spices & Herbs',
    'Dairy & Organic'
  ];

  const states = [
    'All',
    'Punjab',
    'Madhya Pradesh',
    'Maharashtra',
    'Himachal Pradesh',
    'Gujarat',
    'Rajasthan',
    'Meghalaya',
    'Uttar Pradesh'
  ];

  useEffect(() => {
    fetchProducts();
  }, [category, state, organic, sort]);

  function fetchProducts() {
    setLoading(true);
    const params = new URLSearchParams();
    if (category !== 'All') params.append('category', category);
    if (state !== 'All') params.append('state', state);
    if (organic) params.append('organic', 'true');
    if (search.trim()) params.append('search', search.trim());
    if (sort) params.append('sort', sort);

    fetch(`/api/products?${params.toString()}`)
      .then(res => res.json())
      .then(data => {
        if (data.success && data.products) {
          setProducts(data.products);
        }
      })
      .catch(err => console.warn(err))
      .finally(() => setLoading(false));
  }

  function handleSearchSubmit(e) {
    e.preventDefault();
    fetchProducts();
  }

  return (
    <div className="py-5" style={{ background: '#fbf9f4' }}>
      <div className="container">
        {/* Header */}
        <div className="text-center mb-5">
          <span className="badge bg-success-subtle text-success px-3 py-2 rounded-pill fs-6 fw-semibold mb-2">
            DIRECT AGRICULTURAL MARKETPLACE
          </span>
          <h2 className="display-6 fw-bold text-dark">
            Procure Farm-Fresh Produce Direct from Source
          </h2>
          <p className="text-muted mx-auto" style={{ maxWidth: '650px' }}>
            Browse verified listings from farmers across India. Compare APMC benchmark prices, review farm locations, and buy direct without middleman markups.
          </p>
        </div>

        {/* Filter & Search Bar */}
        <div className="card shadow-sm border-0 rounded-4 p-4 mb-4 bg-white">
          <form onSubmit={handleSearchSubmit} className="row g-3">
            {/* Search Input */}
            <div className="col-lg-5 col-md-12">
              <div className="input-group">
                <span className="input-group-text bg-light border-end-0">
                  <i className="fa-solid fa-magnifying-glass text-muted"></i>
                </span>
                <input 
                  type="text" 
                  className="form-control bg-light border-start-0" 
                  placeholder="Search wheat, basmati, mango, farmer name..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
                <button type="submit" className="btn btn-ann-primary">
                  Search
                </button>
              </div>
            </div>

            {/* State Filter */}
            <div className="col-lg-3 col-md-4 col-sm-6">
              <select 
                className="form-select bg-light"
                value={state}
                onChange={(e) => setState(e.target.value)}
              >
                <option value="All">All States (India-wide)</option>
                {states.filter(s => s !== 'All').map(s => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>

            {/* Sort Filter */}
            <div className="col-lg-2 col-md-4 col-sm-6">
              <select 
                className="form-select bg-light"
                value={sort}
                onChange={(e) => setSort(e.target.value)}
              >
                <option value="newest">Newest First</option>
                <option value="price_asc">Price: Low to High</option>
                <option value="price_desc">Price: High to Low</option>
                <option value="rating">Highest Rated</option>
              </select>
            </div>

            {/* Organic Toggle */}
            <div className="col-lg-2 col-md-4 col-sm-12 d-flex align-items-center">
              <div className="form-check form-switch">
                <input 
                  className="form-check-input" 
                  type="checkbox" 
                  id="organicCheck"
                  checked={organic}
                  onChange={(e) => setOrganic(e.target.checked)}
                />
                <label className="form-check-label fw-semibold small text-success" htmlFor="organicCheck">
                  🌿 100% Organic Only
                </label>
              </div>
            </div>
          </form>

          {/* Category Pills */}
          <div className="d-flex flex-wrap gap-2 mt-4 pt-3 border-top">
            <span className="small text-muted align-self-center me-2 fw-semibold">Category:</span>
            {categories.map(cat => (
              <button
                key={cat}
                type="button"
                className={`btn btn-sm rounded-pill px-3 ${category === cat ? 'btn-success fw-bold' : 'btn-outline-secondary'}`}
                onClick={() => setCategory(cat)}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Results Count */}
        <div className="d-flex justify-content-between align-items-center mb-3">
          <span className="text-muted small">
            Showing <strong>{products.length}</strong> fresh agricultural listings
          </span>
          {(category !== 'All' || state !== 'All' || organic || search) && (
            <button 
              className="btn btn-sm btn-link text-decoration-none text-danger p-0"
              onClick={() => {
                setCategory('All');
                setState('All');
                setOrganic(false);
                setSearch('');
              }}
            >
              <i className="fa-solid fa-xmark me-1"></i> Clear Filters
            </button>
          )}
        </div>

        {/* Product Grid */}
        {loading ? (
          <div className="text-center py-5">
            <div className="spinner-border text-success" role="status"></div>
            <p className="mt-3 text-muted">Loading fresh farm produce...</p>
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-5 card border-0 rounded-4 shadow-sm p-5 bg-white">
            <div className="fs-1 text-muted mb-2">🌾</div>
            <h4>No Produce Found</h4>
            <p className="text-muted">No produce matches your selected criteria. Try adjusting your search or category filters.</p>
            <button 
              className="btn btn-ann-secondary mx-auto"
              onClick={() => {
                setCategory('All');
                setState('All');
                setOrganic(false);
                setSearch('');
              }}
            >
              Reset All Filters
            </button>
          </div>
        ) : (
          <div className="row g-4">
            {products.map(prod => (
              <div key={prod._id} className="col-lg-3 col-md-6 col-sm-12">
                <ProductCard 
                  product={prod}
                  onOpenInquiry={onOpenInquiry}
                  onSelectProduct={onSelectProduct}
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
