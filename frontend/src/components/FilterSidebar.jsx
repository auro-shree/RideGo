import React from 'react';
import { SlidersHorizontal, RotateCcw, Star } from 'lucide-react';

export default function FilterSidebar({ filters, setFilters, onReset }) {
  const categories = ['Sports Bikes', 'Cruiser Bikes', 'Scooters', 'Adventure'];
  const fuelTypes = ['Petrol', 'Electric'];
  const transmissions = ['Manual', 'Automatic'];

  const toggleFilter = (type, val) => {
    setFilters(prev => {
      const current = prev[type] || [];
      const updated = current.includes(val) 
        ? current.filter(item => item !== val) 
        : [...current, val];
      return { ...prev, [type]: updated };
    });
  };

  return (
    <div className="card" style={{ padding: '1.5rem', height: 'fit-content' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', paddingBottom: '0.85rem', borderBottom: '1px solid #E2E8F0' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '1.1rem', fontWeight: 700, color: '#0F172A' }}>
          <SlidersHorizontal size={18} color="#FFB800" />
          Filters
        </div>
        <button 
          onClick={onReset}
          style={{ background: 'none', border: 'none', color: '#64748B', cursor: 'pointer', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.25rem' }}
        >
          <RotateCcw size={14} /> Clear All
        </button>
      </div>

      {/* Price Range */}
      <div style={{ marginBottom: '1.75rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', fontWeight: 600, color: '#0F172A', marginBottom: '0.5rem' }}>
          <span>Price Range</span>
          <span style={{ color: '#FFB800', fontWeight: 700 }}>Up to ₹{filters.maxPrice || 3000}/day</span>
        </div>
        <input 
          type="range" 
          min="400" 
          max="3000" 
          step="100"
          value={filters.maxPrice || 3000}
          onChange={(e) => setFilters(prev => ({ ...prev, maxPrice: parseInt(e.target.value) }))}
          style={{ width: '100%', accentColor: '#FFB800', cursor: 'pointer' }}
        />
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: '#94A3B8', marginTop: '0.25rem' }}>
          <span>₹400</span>
          <span>₹3000+</span>
        </div>
      </div>

      {/* Categories */}
      <div style={{ marginBottom: '1.75rem' }}>
        <h4 style={{ fontSize: '0.9rem', color: '#0F172A', marginBottom: '0.75rem' }}>Category</h4>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
          {categories.map(cat => (
            <label key={cat} style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', cursor: 'pointer', fontSize: '0.88rem', color: '#475569' }}>
              <input 
                type="checkbox"
                checked={(filters.categories || []).includes(cat)}
                onChange={() => toggleFilter('categories', cat)}
                style={{ width: '16px', height: '16px', accentColor: '#FFB800' }}
              />
              {cat}
            </label>
          ))}
        </div>
      </div>

      {/* Fuel Type */}
      <div style={{ marginBottom: '1.75rem' }}>
        <h4 style={{ fontSize: '0.9rem', color: '#0F172A', marginBottom: '0.75rem' }}>Fuel Type</h4>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
          {fuelTypes.map(fuel => (
            <label key={fuel} style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', cursor: 'pointer', fontSize: '0.88rem', color: '#475569' }}>
              <input 
                type="checkbox"
                checked={(filters.fuelTypes || []).includes(fuel)}
                onChange={() => toggleFilter('fuelTypes', fuel)}
                style={{ width: '16px', height: '16px', accentColor: '#FFB800' }}
              />
              {fuel}
            </label>
          ))}
        </div>
      </div>

      {/* Transmission */}
      <div style={{ marginBottom: '1.75rem' }}>
        <h4 style={{ fontSize: '0.9rem', color: '#0F172A', marginBottom: '0.75rem' }}>Transmission</h4>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
          {transmissions.map(trans => (
            <label key={trans} style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', cursor: 'pointer', fontSize: '0.88rem', color: '#475569' }}>
              <input 
                type="checkbox"
                checked={(filters.transmissions || []).includes(trans)}
                onChange={() => toggleFilter('transmissions', trans)}
                style={{ width: '16px', height: '16px', accentColor: '#FFB800' }}
              />
              {trans}
            </label>
          ))}
        </div>
      </div>

      {/* Rating */}
      <div>
        <h4 style={{ fontSize: '0.9rem', color: '#0F172A', marginBottom: '0.75rem' }}>Rating</h4>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          {[4.5, 4.0, 3.5].map(rating => (
            <label key={rating} style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', cursor: 'pointer', fontSize: '0.88rem', color: '#475569' }}>
              <input 
                type="radio"
                name="ratingFilter"
                checked={filters.minRating === rating}
                onChange={() => setFilters(prev => ({ ...prev, minRating: rating }))}
                style={{ accentColor: '#FFB800' }}
              />
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                <Star size={14} fill="#F59E0B" color="#F59E0B" /> {rating} & above
              </span>
            </label>
          ))}
        </div>
      </div>
    </div>
  );
}
