import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

export default function ProductCard({ product, onOpenInquiry, onSelectProduct }) {
  const { addToCart } = useCart();
  const { user } = useAuth();
  const [qty, setQty] = useState(product.minOrderQuantity || 10);
  const [added, setAdded] = useState(false);

  const img = product.images?.[0] || 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=600';
  const savingsPct = product.retailBenchmark 
    ? Math.round(((product.retailBenchmark - product.pricePerUnit) / product.retailBenchmark) * 100)
    : 25;

  function handleAdd() {
    addToCart(product, qty);
    setAdded(true);
    setTimeout(() => setAdded(false), 1800);
  }

  return (
    <div className="produce-card">
      <div className="produce-img-wrap" style={{ cursor: 'pointer' }} onClick={() => onSelectProduct?.(product)}>
        <img src={img} alt={product.title} loading="lazy" />
        <span className="produce-badge">
          {product.category}
        </span>
        {product.isOrganic && (
          <span className="organic-badge">
            <i className="fa-solid fa-certificate me-1"></i> 100% Organic
          </span>
        )}
      </div>

      <div className="produce-body">
        <h5 
          className="produce-title" 
          title={product.title}
          style={{ cursor: 'pointer' }}
          onClick={() => onSelectProduct?.(product)}
        >
          {product.title}
        </h5>

        <div className="produce-meta">
          <span><i className="fa-solid fa-user-check text-success me-1"></i> {product.farmerName}</span>
          <span><i className="fa-solid fa-location-dot text-danger me-1"></i> {product.state}</span>
        </div>

        {/* Pricing */}
        <div className="d-flex align-items-baseline gap-2 mb-2">
          <span className="fs-3 fw-bold text-success">₹{product.pricePerUnit}</span>
          <span className="text-muted fs-6">/ {product.unit || 'kg'}</span>
          {product.retailBenchmark > product.pricePerUnit && (
            <span className="text-decoration-line-through text-muted small ms-auto">
              Retail: ₹{product.retailBenchmark}
            </span>
          )}
        </div>

        {/* Middleman Savings Pill */}
        <div className="price-comparison-pill">
          <span><i className="fa-solid fa-tag me-1"></i> Direct from Farm</span>
          <span className="fw-bold">{savingsPct}% cheaper than retail</span>
        </div>

        <div className="small text-muted mb-3 d-flex justify-content-between">
          <span>Available: <strong>{product.availableQuantity} {product.unit}</strong></span>
          <span>Min: <strong>{product.minOrderQuantity || 1} {product.unit}</strong></span>
        </div>

        {/* Actions */}
        <div className="mt-auto pt-2 border-top">
          <div className="d-flex align-items-center gap-2 mb-2">
            <label className="small text-muted mb-0">Qty ({product.unit}):</label>
            <input 
              type="number" 
              className="form-control form-control-sm text-center" 
              style={{ width: '85px' }}
              min={product.minOrderQuantity || 1}
              max={product.availableQuantity}
              value={qty}
              onChange={(e) => setQty(Math.max(product.minOrderQuantity || 1, Number(e.target.value)))}
            />
            <button 
              className={`btn btn-sm w-100 fw-semibold rounded-pill ${added ? 'btn-success' : 'btn-ann-primary'}`}
              onClick={handleAdd}
              disabled={product.availableQuantity <= 0}
            >
              {added ? (
                <>
                  <i className="fa-solid fa-check me-1"></i> Added
                </>
              ) : product.availableQuantity <= 0 ? (
                'Sold Out'
              ) : (
                <>
                  <i className="fa-solid fa-cart-plus me-1"></i> Add to Cart
                </>
              )}
            </button>
          </div>

          <div className="d-flex gap-2">
            <button 
              className="btn btn-sm btn-outline-secondary rounded-pill w-100"
              onClick={() => onSelectProduct?.(product)}
            >
              <i className="fa-solid fa-eye me-1"></i> Details
            </button>
            <button 
              className="btn btn-sm btn-outline-success rounded-pill w-100"
              onClick={() => onOpenInquiry?.(product)}
            >
              <i className="fa-solid fa-comments me-1"></i> Inquire
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
