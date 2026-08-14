import React, { useState } from 'react';
import { 
  SlidersHorizontal, RotateCcw, Star, Check, ChevronDown, ChevronUp, 
  Bike, Fuel, Zap, Gauge, Flame, Compass, Settings 
} from 'lucide-react';

export default function FilterSidebar({ filters, setFilters, onReset, isMobile = false, onCloseMobile }) {
  const [openSections, setOpenSections] = useState({
    category: true,
    fuel: true,
    transmission: true,
    rating: true
  });

  const categories = [
    { name: 'Sports Bikes', icon: Zap },
    { name: 'Cruiser Bikes', icon: Bike },
    { name: 'Scooters', icon: Compass },
    { name: 'Adventure', icon: Flame }
  ];

  const fuelTypes = [
    { name: 'Petrol', icon: Fuel },
    { name: 'Electric', icon: Zap }
  ];

  const transmissions = [
    { name: 'Manual', icon: Settings },
    { name: 'Automatic', icon: Gauge }
  ];

  const toggleSection = (section) => {
    setOpenSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  const toggleFilter = (type, val) => {
    setFilters(prev => {
      const current = prev[type] || [];
      const updated = current.includes(val) 
        ? current.filter(item => item !== val) 
        : [...current, val];
      return { ...prev, [type]: updated };
    });
  };

  const maxPriceVal = filters.maxPrice || 3000;
  const pricePercent = Math.min(100, Math.max(0, ((maxPriceVal - 400) / (3000 - 400)) * 100));

  return (
    <aside 
      className="filter-sidebar-card"
      style={{
        backgroundColor: 'var(--filter-bg, #090F1D)',
        border: '1px solid var(--filter-border, rgba(148, 163, 184, 0.20))',
        borderRadius: '20px',
        padding: '1.5rem',
        boxShadow: '0 10px 30px rgba(0,0,0,0.25)',
        color: 'var(--filter-text, #F8FAFC)',
        height: 'fit-content',
        transition: 'var(--transition)'
      }}
    >
      {/* 1. Header Row */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '1.35rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
          <div style={{
            backgroundColor: 'rgba(255, 184, 0, 0.15)',
            width: '36px',
            height: '36px',
            borderRadius: '10px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0
          }}>
            <SlidersHorizontal size={20} color="#FFB800" strokeWidth={2.5} />
          </div>
          <span style={{ fontSize: '1.25rem', fontWeight: 800, fontFamily: 'Outfit, sans-serif', color: 'var(--filter-text, #F8FAFC)' }}>
            Filters
          </span>
        </div>

        <button 
          onClick={onReset}
          type="button"
          aria-label="Clear All Filters"
          style={{
            background: 'transparent',
            border: '1px solid var(--filter-border, rgba(148, 163, 184, 0.25))',
            color: 'var(--filter-text-secondary, #CBD5E1)',
            cursor: 'pointer',
            fontSize: '0.82rem',
            fontWeight: 600,
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.4rem',
            padding: '0.35rem 0.85rem',
            borderRadius: '20px',
            transition: 'all 0.2s ease'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = '#FFB800';
            e.currentTarget.style.color = '#FFB800';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = 'var(--filter-border, rgba(148, 163, 184, 0.25))';
            e.currentTarget.style.color = 'var(--filter-text-secondary, #CBD5E1)';
          }}
        >
          <RotateCcw size={13} />
          <span>Clear All</span>
        </button>
      </div>

      <div style={{ height: '1px', backgroundColor: 'var(--filter-divider, rgba(148, 163, 184, 0.12))', marginBottom: '1.35rem' }} />

      {/* 2. Price Range */}
      <div style={{ marginBottom: '1.35rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.9rem', fontWeight: 700, marginBottom: '0.75rem' }}>
          <span style={{ color: 'var(--filter-text, #F8FAFC)' }}>Price Range</span>
          <span style={{
            color: '#FFB800',
            fontWeight: 800,
            fontSize: '0.88rem',
            fontFamily: 'Outfit, sans-serif'
          }}>
            Up to ₹{maxPriceVal}/day
          </span>
        </div>

        {/* Gradient Active Range Slider */}
        <div style={{ position: 'relative', margin: '0.5rem 0' }}>
          <input 
            type="range" 
            min="400" 
            max="3000" 
            step="100"
            value={maxPriceVal}
            onChange={(e) => setFilters(prev => ({ ...prev, maxPrice: parseInt(e.target.value) }))}
            aria-label="Price range slider"
            style={{
              width: '100%',
              accentColor: '#FFB800',
              cursor: 'pointer',
              height: '6px',
              borderRadius: '4px',
              background: `linear-gradient(to right, #FFB800 0%, #FFB800 ${pricePercent}%, #334155 ${pricePercent}%, #334155 100%)`,
              outline: 'none'
            }}
          />
        </div>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', color: 'var(--filter-text-muted, #94A3B8)', marginTop: '0.35rem', fontWeight: 600 }}>
          <span>₹400</span>
          <span>₹3000+</span>
        </div>
      </div>

      <div style={{ height: '1px', backgroundColor: 'var(--filter-divider, rgba(148, 163, 184, 0.12))', marginBottom: '1.35rem' }} />

      {/* 3. Category Section */}
      <div style={{ marginBottom: '1.25rem' }}>
        <div 
          onClick={() => toggleSection('category')}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            cursor: 'pointer',
            marginBottom: openSections.category ? '0.85rem' : '0'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <div style={{ width: '32px', height: '32px', borderRadius: '8px', backgroundColor: 'rgba(255, 184, 0, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <Bike size={16} color="#FFB800" />
            </div>
            <span style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--filter-text, #F8FAFC)', fontFamily: 'Outfit, sans-serif' }}>
              Category
            </span>
          </div>
          {openSections.category ? <ChevronUp size={18} color="var(--filter-text-secondary, #CBD5E1)" /> : <ChevronDown size={18} color="var(--filter-text-secondary, #CBD5E1)" />}
        </div>

        {openSections.category && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {categories.map(cat => {
              const ItemIcon = cat.icon;
              const isChecked = (filters.categories || []).includes(cat.name);
              return (
                <div
                  key={cat.name}
                  onClick={() => toggleFilter('categories', cat.name)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.75rem',
                    padding: '0.6rem 0.85rem',
                    borderRadius: '10px',
                    border: isChecked ? '1px solid #FFB800' : '1px solid var(--filter-border, rgba(148, 163, 184, 0.15))',
                    backgroundColor: isChecked ? 'rgba(255, 184, 0, 0.08)' : 'var(--filter-surface, #0E1626)',
                    cursor: 'pointer',
                    fontSize: '0.88rem',
                    fontWeight: isChecked ? 700 : 500,
                    color: isChecked ? '#FFFFFF' : 'var(--filter-text-secondary, #CBD5E1)',
                    transition: 'all 0.15s ease'
                  }}
                  onMouseEnter={(e) => {
                    if (!isChecked) e.currentTarget.style.backgroundColor = 'var(--filter-surface-hover, #162238)';
                  }}
                  onMouseLeave={(e) => {
                    if (!isChecked) e.currentTarget.style.backgroundColor = 'var(--filter-surface, #0E1626)';
                  }}
                >
                  <div style={{
                    width: '20px',
                    height: '20px',
                    borderRadius: '5px',
                    border: isChecked ? 'none' : '1.5px solid var(--filter-border, rgba(148, 163, 184, 0.3))',
                    backgroundColor: isChecked ? '#FFB800' : 'transparent',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                    transition: 'all 0.15s ease'
                  }}>
                    {isChecked && <Check size={13} color="#000000" strokeWidth={3} />}
                  </div>
                  <ItemIcon size={16} color="#FFB800" style={{ opacity: 0.9, flexShrink: 0 }} />
                  <span>{cat.name}</span>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <div style={{ height: '1px', backgroundColor: 'var(--filter-divider, rgba(148, 163, 184, 0.12))', marginBottom: '1.25rem' }} />

      {/* 4. Fuel Type Section */}
      <div style={{ marginBottom: '1.25rem' }}>
        <div 
          onClick={() => toggleSection('fuel')}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            cursor: 'pointer',
            marginBottom: openSections.fuel ? '0.85rem' : '0'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <div style={{ width: '32px', height: '32px', borderRadius: '8px', backgroundColor: 'rgba(255, 184, 0, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <Fuel size={16} color="#FFB800" />
            </div>
            <span style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--filter-text, #F8FAFC)', fontFamily: 'Outfit, sans-serif' }}>
              Fuel Type
            </span>
          </div>
          {openSections.fuel ? <ChevronUp size={18} color="var(--filter-text-secondary, #CBD5E1)" /> : <ChevronDown size={18} color="var(--filter-text-secondary, #CBD5E1)" />}
        </div>

        {openSections.fuel && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {fuelTypes.map(fuel => {
              const ItemIcon = fuel.icon;
              const isChecked = (filters.fuelTypes || []).includes(fuel.name);
              return (
                <div
                  key={fuel.name}
                  onClick={() => toggleFilter('fuelTypes', fuel.name)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.75rem',
                    padding: '0.6rem 0.85rem',
                    borderRadius: '10px',
                    border: isChecked ? '1px solid #FFB800' : '1px solid var(--filter-border, rgba(148, 163, 184, 0.15))',
                    backgroundColor: isChecked ? 'rgba(255, 184, 0, 0.08)' : 'var(--filter-surface, #0E1626)',
                    cursor: 'pointer',
                    fontSize: '0.88rem',
                    fontWeight: isChecked ? 700 : 500,
                    color: isChecked ? '#FFFFFF' : 'var(--filter-text-secondary, #CBD5E1)',
                    transition: 'all 0.15s ease'
                  }}
                  onMouseEnter={(e) => {
                    if (!isChecked) e.currentTarget.style.backgroundColor = 'var(--filter-surface-hover, #162238)';
                  }}
                  onMouseLeave={(e) => {
                    if (!isChecked) e.currentTarget.style.backgroundColor = 'var(--filter-surface, #0E1626)';
                  }}
                >
                  <div style={{
                    width: '20px',
                    height: '20px',
                    borderRadius: '5px',
                    border: isChecked ? 'none' : '1.5px solid var(--filter-border, rgba(148, 163, 184, 0.3))',
                    backgroundColor: isChecked ? '#FFB800' : 'transparent',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                    transition: 'all 0.15s ease'
                  }}>
                    {isChecked && <Check size={13} color="#000000" strokeWidth={3} />}
                  </div>
                  <ItemIcon size={16} color="#FFB800" style={{ opacity: 0.9, flexShrink: 0 }} />
                  <span>{fuel.name}</span>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <div style={{ height: '1px', backgroundColor: 'var(--filter-divider, rgba(148, 163, 184, 0.12))', marginBottom: '1.25rem' }} />

      {/* 5. Transmission Section */}
      <div style={{ marginBottom: '1.25rem' }}>
        <div 
          onClick={() => toggleSection('transmission')}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            cursor: 'pointer',
            marginBottom: openSections.transmission ? '0.85rem' : '0'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <div style={{ width: '32px', height: '32px', borderRadius: '8px', backgroundColor: 'rgba(255, 184, 0, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <Settings size={16} color="#FFB800" />
            </div>
            <span style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--filter-text, #F8FAFC)', fontFamily: 'Outfit, sans-serif' }}>
              Transmission
            </span>
          </div>
          {openSections.transmission ? <ChevronUp size={18} color="var(--filter-text-secondary, #CBD5E1)" /> : <ChevronDown size={18} color="var(--filter-text-secondary, #CBD5E1)" />}
        </div>

        {openSections.transmission && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {transmissions.map(trans => {
              const ItemIcon = trans.icon;
              const isChecked = (filters.transmissions || []).includes(trans.name);
              return (
                <div
                  key={trans.name}
                  onClick={() => toggleFilter('transmissions', trans.name)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.75rem',
                    padding: '0.6rem 0.85rem',
                    borderRadius: '10px',
                    border: isChecked ? '1px solid #FFB800' : '1px solid var(--filter-border, rgba(148, 163, 184, 0.15))',
                    backgroundColor: isChecked ? 'rgba(255, 184, 0, 0.08)' : 'var(--filter-surface, #0E1626)',
                    cursor: 'pointer',
                    fontSize: '0.88rem',
                    fontWeight: isChecked ? 700 : 500,
                    color: isChecked ? '#FFFFFF' : 'var(--filter-text-secondary, #CBD5E1)',
                    transition: 'all 0.15s ease'
                  }}
                  onMouseEnter={(e) => {
                    if (!isChecked) e.currentTarget.style.backgroundColor = 'var(--filter-surface-hover, #162238)';
                  }}
                  onMouseLeave={(e) => {
                    if (!isChecked) e.currentTarget.style.backgroundColor = 'var(--filter-surface, #0E1626)';
                  }}
                >
                  <div style={{
                    width: '20px',
                    height: '20px',
                    borderRadius: '5px',
                    border: isChecked ? 'none' : '1.5px solid var(--filter-border, rgba(148, 163, 184, 0.3))',
                    backgroundColor: isChecked ? '#FFB800' : 'transparent',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                    transition: 'all 0.15s ease'
                  }}>
                    {isChecked && <Check size={13} color="#000000" strokeWidth={3} />}
                  </div>
                  <ItemIcon size={16} color="#FFB800" style={{ opacity: 0.9, flexShrink: 0 }} />
                  <span>{trans.name}</span>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <div style={{ height: '1px', backgroundColor: 'var(--filter-divider, rgba(148, 163, 184, 0.12))', marginBottom: '1.25rem' }} />

      {/* 6. Rating Section */}
      <div>
        <div 
          onClick={() => toggleSection('rating')}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            cursor: 'pointer',
            marginBottom: openSections.rating ? '0.85rem' : '0'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <div style={{ width: '32px', height: '32px', borderRadius: '8px', backgroundColor: 'rgba(255, 184, 0, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <Star size={16} color="#FFB800" fill="#FFB800" />
            </div>
            <span style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--filter-text, #F8FAFC)', fontFamily: 'Outfit, sans-serif' }}>
              Rating
            </span>
          </div>
          {openSections.rating ? <ChevronUp size={18} color="var(--filter-text-secondary, #CBD5E1)" /> : <ChevronDown size={18} color="var(--filter-text-secondary, #CBD5E1)" />}
        </div>

        {openSections.rating && (
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
                    padding: '0.6rem 0.85rem',
                    borderRadius: '10px',
                    border: isSelected ? '1px solid #FFB800' : '1px solid var(--filter-border, rgba(148, 163, 184, 0.15))',
                    backgroundColor: isSelected ? 'rgba(255, 184, 0, 0.08)' : 'var(--filter-surface, #0E1626)',
                    cursor: 'pointer',
                    fontSize: '0.88rem',
                    fontWeight: isSelected ? 700 : 500,
                    color: isSelected ? '#FFFFFF' : 'var(--filter-text-secondary, #CBD5E1)',
                    transition: 'all 0.15s ease'
                  }}
                  onMouseEnter={(e) => {
                    if (!isSelected) e.currentTarget.style.backgroundColor = 'var(--filter-surface-hover, #162238)';
                  }}
                  onMouseLeave={(e) => {
                    if (!isSelected) e.currentTarget.style.backgroundColor = 'var(--filter-surface, #0E1626)';
                  }}
                >
                  <div style={{
                    width: '20px',
                    height: '20px',
                    borderRadius: '50%',
                    border: isSelected ? '2px solid #FFB800' : '1.5px solid var(--filter-border, rgba(148, 163, 184, 0.3))',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0
                  }}>
                    {isSelected && <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#FFB800' }} />}
                  </div>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
                    <Star size={15} fill="#FFB800" color="#FFB800" /> {rating} & above
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {isMobile && (
        <div style={{ marginTop: '1.5rem', paddingTop: '1rem', borderTop: '1px solid var(--filter-border, rgba(148, 163, 184, 0.15))', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
          <button 
            type="button" 
            onClick={onReset} 
            className="btn btn-outline btn-full"
            style={{ borderRadius: '10px', color: 'var(--filter-text, #F8FAFC)', borderColor: 'var(--filter-border, rgba(148, 163, 184, 0.25))' }}
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
    </aside>
  );
}
