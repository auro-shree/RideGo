import React from 'react';
import { Star, Fuel, Gauge, Shield, MapPin, ChevronRight } from 'lucide-react';

export default function BikeCard({ vehicle, onViewDetails }) {
  return (
    <div className="card" style={{
      overflow: 'hidden',
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
      position: 'relative'
    }}>
      {/* Category Badge */}
      <span className="badge badge-category" style={{
        position: 'absolute',
        top: '12px',
        left: '12px',
        zIndex: 2,
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
      }}>
        {vehicle.categoryName || vehicle.vehicleType}
      </span>

      {/* Bike Image Container */}
      <div style={{
        position: 'relative',
        height: '210px',
        backgroundColor: '#F8FAFC',
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
            transition: 'transform 0.3s ease'
          }}
          onError={(e) => {
            e.target.src = 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=800&q=80';
          }}
        />
      </div>

      {/* Card Content */}
      <div style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', flex: 1 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
          <div>
            <h3 style={{ fontSize: '1.15rem', color: '#0F172A', marginBottom: '0.2rem' }}>
              {vehicle.brand} {vehicle.model}
            </h3>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.8rem', color: '#64748B' }}>
              <MapPin size={14} color="#64748B" />
              <span>{vehicle.locationName || 'Koramangala, Bengaluru'}</span>
            </div>
          </div>

          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0F172A', fontFamily: 'Outfit, sans-serif' }}>
              ₹{vehicle.pricePerDay}
              <span style={{ fontSize: '0.75rem', fontWeight: 500, color: '#64748B' }}>/day</span>
            </div>
            <div style={{ fontSize: '0.7rem', color: '#94A3B8' }}>
              ₹{vehicle.securityDeposit || 2000} deposit
            </div>
          </div>
        </div>

        {/* Specs Pills */}
        <div style={{
          display: 'flex',
          gap: '0.5rem',
          flexWrap: 'wrap',
          margin: '0.85rem 0',
          padding: '0.5rem',
          background: '#F8FAFC',
          borderRadius: '8px',
          fontSize: '0.78rem',
          color: '#475569'
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
        <div style={{ marginTop: 'auto', paddingTop: '0.75rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
            <Star size={16} fill="#F59E0B" color="#F59E0B" />
            <span style={{ fontWeight: 700, fontSize: '0.9rem', color: '#0F172A' }}>{vehicle.averageRating || 4.6}</span>
            <span style={{ fontSize: '0.8rem', color: '#94A3B8' }}>({vehicle.reviewCount || 128})</span>
          </div>

          <button 
            onClick={() => onViewDetails(vehicle)}
            className="btn btn-primary btn-sm"
          >
            View Details
          </button>
        </div>
      </div>
    </div>
  );
}
