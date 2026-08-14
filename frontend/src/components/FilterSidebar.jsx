import React from 'react';
import { SlidersHorizontal, RotateCcw, Star, Check } from 'lucide-react';

export default function FilterSidebar({ filters, setFilters, onReset, isMobile = false, onCloseMobile }) {
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
    <div 
      className="filter-sidebar-card"
      style={{
        backgroundColor: 'var(--bg-card)',
        border: '1px solid var(--border-color)',
        borderRadius: '18px',
        padding: '1.5rem',
        boxShadow: 'var(--shadow-sm)',
        color: 'var(--text-primary)',
        height: 'fit-content',
        transition: 'var(--transition)'
      }}
    >
      {/* Sidebar Header */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '1.5rem',
        paddingBottom: '1rem',
        borderBottom: '1px solid var(--border-color)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', fontSize: '1.15rem', fontWeight: 800, fontFamily: 'Outfit, sans-serif' }}>
          <SlidersHorizontal size={20} color="#FFB800" />
          Filters
        </div>
        <button 
          onClick={onReset}
          type="button"
          style={{
            background: 'transparent',
            border: 'none',
            color: 'var(--text-secondary)',
            cursor: 'pointer',
            fontSize: '0.85rem',
            fontWeight: 600,
            display: 'flex',
            alignItems: 'center',
            gap: '0.35rem',
            padding: '0.2rem 0.5rem',
            borderRadius: '6px',
            transition: 'all 0.2s ease'
          }}
          onMouseEnter={(e) => e.currentTarget.style.color = '#FFB800'}
          onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-secondary)'}
        >
          <RotateCcw size={14} /> Clear All
        </button>
      </div>

      {/* 1. Price Range */}
      <div style={{ marginBottom: '1.75rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.9rem', fontWeight: 700, marginBottom: '0.65rem' }}>
          <span>Price Range</span>
          <span style={{
            backgroundColor: 'rgba(255, 184, 0, 0.15)',
            color: '#FFB800',
            padding: '0.2rem 0.65rem',
            borderRadius: '20px',
            fontSize: '0.82rem',
            fontWeight: 700
          }}>
            Up to ₹{filters.maxPrice || 3000}/day
          </span>
        </div>
        
        <input 
          type="range" 
          min="400" 
          max="3000" 
          step="100"
          value={filters.maxPrice || 3000}
          onChange={(e) => setFilters(prev => ({ ...prev, maxPrice: parseInt(e.target.value) }))}
          style={{
            width: '100%',
            accentColor: '#FFB800',
            cursor: 'pointer',
            height: '6px',
            borderRadius: '4px'
          }}
        />
        
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', color: 'var(--text-secondary)', marginTop: '0.35rem', fontWeight: 600 }}>
          <span>₹400</span>
          <span>₹3,000+</span>
        </div>
      </div>

      {/* 2. Category Filter */}
      <div style={{ marginBottom: '1.75rem' }}>
        <h4 style={{ fontSize: '0.9rem', fontWeight: 700, marginBottom: '0.75rem', color: 'var(--text-primary)' }}>
          Category
        </h4>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          {categories.map(cat => {
            const isChecked = (filters.categories || []).includes(cat);
            return (
              <div
                key={cat}
                onClick={() => toggleFilter('categories', cat)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  padding: '0.55rem 0.75rem',
                  borderRadius: '10px',
                  border: isChecked ? '1px solid #FFB800' : '1px solid var(--border-color)',
                  backgroundColor: isChecked ? 'rgba(255, 184, 0, 0.1)' : 'var(--bg-primary)',
                  cursor: 'pointer',
                  fontSize: '0.88rem',
                  fontWeight: isChecked ? 700 : 500,
                  color: isChecked ? 'var(--text-primary)' : 'var(--text-secondary)',
                  transition: 'all 0.15s ease'
                }}
              >
                <div style={{
                  width: '18px',
                  height: '18px',
                  borderRadius: '4px',
                  border: isChecked ? 'none' : '1.5px solid var(--border-color)',
                  backgroundColor: isChecked ? '#FFB800' : 'transparent',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}>
                  {isChecked && <Check size={13} color="#000000" strokeWidth={3} />}
                </div>
                <span>{cat}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* 3. Fuel Type */}
      <div style={{ marginBottom: '1.75rem' }}>
        <h4 style={{ fontSize: '0.9rem', fontWeight: 700, marginBottom: '0.75rem', color: 'var(--text-primary)' }}>
          Fuel Type
        </h4>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          {fuelTypes.map(fuel => {
            const isChecked = (filters.fuelTypes || []).includes(fuel);
            return (
              <div
                key={fuel}
                onClick={() => toggleFilter('fuelTypes', fuel)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  padding: '0.55rem 0.75rem',
                  borderRadius: '10px',
                  border: isChecked ? '1px solid #FFB800' : '1px solid var(--border-color)',
                  backgroundColor: isChecked ? 'rgba(255, 184, 0, 0.1)' : 'var(--bg-primary)',
                  cursor: 'pointer',
                  fontSize: '0.88rem',
                  fontWeight: isChecked ? 700 : 500,
                  color: isChecked ? 'var(--text-primary)' : 'var(--text-secondary)',
                  transition: 'all 0.15s ease'
                }}
              >
                <div style={{
                  width: '18px',
                  height: '18px',
                  borderRadius: '4px',
                  border: isChecked ? 'none' : '1.5px solid var(--border-color)',
                  backgroundColor: isChecked ? '#FFB800' : 'transparent',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}>
                  {isChecked && <Check size={13} color="#000000" strokeWidth={3} />}
                </div>
                <span>{fuel}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* 4. Transmission */}
      <div style={{ marginBottom: '1.75rem' }}>
        <h4 style={{ fontSize: '0.9rem', fontWeight: 700, marginBottom: '0.75rem', color: 'var(--text-primary)' }}>
          Transmission
        </h4>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          {transmissions.map(trans => {
            const isChecked = (filters.transmissions || []).includes(trans);
            return (
              <div
                key={trans}
                onClick={() => toggleFilter('transmissions', trans)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  padding: '0.55rem 0.75rem',
                  borderRadius: '10px',
                  border: isChecked ? '1px solid #FFB800' : '1px solid var(--border-color)',
                  backgroundColor: isChecked ? 'rgba(255, 184, 0, 0.1)' : 'var(--bg-primary)',
                  cursor: 'pointer',
                  fontSize: '0.88rem',
                  fontWeight: isChecked ? 700 : 500,
                  color: isChecked ? 'var(--text-primary)' : 'var(--text-secondary)',
                  transition: 'all 0.15s ease'
                }}
              >
                <div style={{
                  width: '18px',
                  height: '18px',
                  borderRadius: '4px',
                  border: isChecked ? 'none' : '1.5px solid var(--border-color)',
                  backgroundColor: isChecked ? '#FFB800' : 'transparent',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}>
                  {isChecked && <Check size={13} color="#000000" strokeWidth={3} />}
                </div>
                <span>{trans}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* 5. Rating Filter */}
      <div>
        <h4 style={{ fontSize: '0.9rem', fontWeight: 700, marginBottom: '0.75rem', color: 'var(--text-primary)' }}>
          Rating
        </h4>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          {[4.5, 4.0, 3.5].map(rating => {
            const isSelected = filters.minRating === rating;
            return (
              <div
                key={rating}
                onClick={() => setFilters(prev => ({ ...prev, minRating: isSelected ? 0 : rating }))}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  padding: '0.55rem 0.75rem',
                  borderRadius: '10px',
                  border: isSelected ? '1px solid #FFB800' : '1px solid var(--border-color)',
                  backgroundColor: isSelected ? 'rgba(255, 184, 0, 0.1)' : 'var(--bg-primary)',
                  cursor: 'pointer',
                  fontSize: '0.88rem',
                  fontWeight: isSelected ? 700 : 500,
                  color: isSelected ? 'var(--text-primary)' : 'var(--text-secondary)',
                  transition: 'all 0.15s ease'
                }}
              >
                <div style={{
                  width: '18px',
                  height: '18px',
                  borderRadius: '50%',
                  border: isSelected ? '2px solid #FFB800' : '1.5px solid var(--border-color)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}>
                  {isSelected && <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#FFB800' }} />}
                </div>
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                  <Star size={14} fill="#F59E0B" color="#F59E0B" /> {rating} & above
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {isMobile && (
        <div style={{ marginTop: '1.5rem', paddingTop: '1rem', borderTop: '1px solid var(--border-color)', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
          <button 
            type="button" 
            onClick={onReset} 
            className="btn btn-outline btn-full"
            style={{ borderRadius: '10px' }}
          >
            Clear All
          </button>
          <button 
            type="button" 
            onClick={onCloseMobile} 
            className="btn btn-primary btn-full"
            style={{ borderRadius: '10px' }}
          >
            Apply Filters
          </button>
        </div>
      )}
    </div>
  );
}
