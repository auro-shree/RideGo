import React from 'react';
import { Star, Fuel, Gauge, MapPin, ArrowRight } from 'lucide-react';

export default function BikeCard({ vehicle, onViewDetails }) {
  return (
    <div 
      className="card vehicle-listing-card" 
      style={{
        backgroundColor: 'var(--bg-card)',
        border: '1px solid var(--border-color)',
        borderRadius: '16px',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        position: 'relative',
        transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
        boxShadow: 'var(--shadow-sm)'
      }}
    >
      {/* Category Badge */}
      <span 
        style={{
          position: 'absolute',
          top: '12px',
          left: '12px',
          zIndex: 2,
          backgroundColor: 'rgba(15, 23, 42, 0.85)',
          backdropFilter: 'blur(8px)',
          WebkitBackdropFilter: 'blur(8px)',
          color: '#FFB800',
          fontSize: '0.72rem',
          fontWeight: 700,
          padding: '0.3rem 0.75rem',
          borderRadius: '20px',
          border: '1px solid rgba(255, 184, 0, 0.3)',
          letterSpacing: '0.02em'
        }}
      >
        {vehicle.categoryName || vehicle.vehicleType || 'Motorcycle'}
      </span>

      {/* Bike Image Container */}
      <div style={{
        position: 'relative',
        height: '210px',
        backgroundColor: 'var(--bg-primary)',
        overflow: 'hidden',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <img 
          src={vehicle.imageUrl} 
          alt={`${vehicle.brand} ${vehicle.model}`} 
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            transition: 'transform 0.4s ease'
          }}
          onError={(e) => {
            e.target.src = 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=800&q=80';
          }}
        />
      </div>

      {/* Card Content */}
      <div style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', flex: 1, color: 'var(--text-primary)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.65rem' }}>
          <div>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '0.2rem', fontFamily: 'Outfit, sans-serif' }}>
              {vehicle.brand} {vehicle.model}
            </h3>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
              <MapPin size={14} color="#FFB800" />
              <span>{vehicle.locationName || 'Koramangala, Bengaluru'}</span>
            </div>
          </div>

          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--text-primary)', fontFamily: 'Outfit, sans-serif', lineHeight: 1 }}>
              ₹{vehicle.pricePerDay}
              <span style={{ fontSize: '0.75rem', fontWeight: 500, color: 'var(--text-secondary)' }}>/day</span>
            </div>
            <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>
              ₹{vehicle.securityDeposit || 2000} deposit
            </div>
          </div>
        </div>

        {/* Specs Pills */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.6rem',
          flexWrap: 'wrap',
          margin: '0.85rem 0',
          padding: '0.6rem 0.75rem',
          backgroundColor: 'var(--bg-primary)',
          borderRadius: '10px',
          border: '1px solid var(--border-color)',
          fontSize: '0.78rem',
          color: 'var(--text-secondary)',
          fontWeight: 600
        }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
            <Gauge size={13} color="#FFB800" />
            {vehicle.engineCC > 0 ? `${vehicle.engineCC}cc` : 'EV'}
          </span>
          <span>•</span>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
            {vehicle.transmission}
          </span>
          <span>•</span>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
            <Fuel size={13} color="#FFB800" />
            {vehicle.fuelType}
          </span>
        </div>

        {/* Bottom Bar: Rating + CTA */}
        <div style={{ marginTop: 'auto', paddingTop: '0.75rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid var(--border-color)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            <Star size={16} fill="#F59E0B" color="#F59E0B" />
            <span style={{ fontWeight: 800, fontSize: '0.92rem', color: 'var(--text-primary)' }}>{vehicle.averageRating || 4.8}</span>
            <span style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>({vehicle.reviewCount || 128})</span>
          </div>

          <button 
            type="button"
            onClick={() => onViewDetails(vehicle)}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem',
              padding: '0.55rem 1.1rem',
              borderRadius: '10px',
              border: 'none',
              backgroundColor: '#FFB800',
              color: '#000000',
              fontWeight: 700,
              fontSize: '0.85rem',
              cursor: 'pointer',
              boxShadow: '0 3px 10px rgba(255, 184, 0, 0.3)',
              transition: 'all 0.2s ease'
            }}
            className="bike-card-cta"
          >
            <span>View Details</span>
            <ArrowRight size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}
