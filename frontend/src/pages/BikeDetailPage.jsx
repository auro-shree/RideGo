import React, { useState } from 'react';
import { ArrowLeft, Star, ShieldCheck, Zap, Fuel, Gauge, Award, Calendar, MapPin, CheckCircle, Info, Heart } from 'lucide-react';

export default function BikeDetailPage({ vehicle, onBack, onBookNow }) {
  const [pickupDate, setPickupDate] = useState('2025-05-20T10:00');
  const [returnDate, setReturnDate] = useState('2025-05-22T10:00');
  const [activePhotoUrl, setActivePhotoUrl] = useState(vehicle?.imageUrl);

  if (!vehicle) return null;

  const currentDisplayPhoto = activePhotoUrl || vehicle.imageUrl;
  const galleryImages = vehicle.images && vehicle.images.length > 0
    ? vehicle.images
    : [{ id: 1, imageUrl: vehicle.imageUrl, isPrimary: true }];

  const days = 2;
  const pricePerDay = vehicle.pricePerDay || 799;
  const rentTotal = pricePerDay * days;
  const securityDeposit = vehicle.securityDeposit || 2000;
  const taxesAndFees = 288;
  const grandTotal = rentTotal + securityDeposit + taxesAndFees;

  return (
    <div style={{ padding: '1.5rem 0 4rem', backgroundColor: '#F8FAFC', minHeight: '90vh' }}>
      <div className="container">
        {/* Top Back Navigation */}
        <button 
          onClick={onBack}
          style={{
            background: 'none',
            border: 'none',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            color: '#64748B',
            fontWeight: 600,
            cursor: 'pointer',
            marginBottom: '1.25rem',
            fontSize: '0.9rem',
            minHeight: '44px'
          }}
        >
          <ArrowLeft size={18} /> Back to Search Results
        </button>

        {/* Responsive Two-Column / Single-Column Layout */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '1.75rem',
          alignItems: 'flex-start'
        }}>
          {/* Left Column: Gallery & Details */}
          <div style={{ minWidth: 0 }}>
            {/* Main Image Showcase & Gallery Thumbnails */}
            <div className="card" style={{ padding: '1rem', overflow: 'hidden', marginBottom: '1.5rem' }}>
              <img 
                src={currentDisplayPhoto} 
                alt={`${vehicle.brand} ${vehicle.model}`}
                style={{
                  width: '100%',
                  height: 'clamp(240px, 45vh, 380px)',
                  objectFit: 'cover',
                  borderRadius: '12px',
                  transition: 'all 0.3s ease'
                }}
              />

              {/* Gallery Thumbnails */}
              {galleryImages.length > 1 && (
                <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1rem', overflowX: 'auto', paddingBottom: '0.5rem', WebkitOverflowScrolling: 'touch' }}>
                  {galleryImages.map((img, idx) => (
                    <img 
                      key={img.id || idx}
                      src={img.imageUrl}
                      alt={`Gallery view ${idx + 1}`}
                      onClick={() => setActivePhotoUrl(img.imageUrl)}
                      style={{
                        width: '80px',
                        height: '60px',
                        borderRadius: '8px',
                        objectFit: 'cover',
                        cursor: 'pointer',
                        flexShrink: 0,
                        border: currentDisplayPhoto === img.imageUrl ? '3px solid #FFB800' : '1px solid #CBD5E1',
                        transition: 'all 0.2s ease'
                      }}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Overview & Description */}
            <div className="card" style={{ padding: '1.5rem', marginBottom: '1.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.75rem' }}>
                <div>
                  <span className="badge badge-category" style={{ marginBottom: '0.5rem' }}>
                    {vehicle.categoryName || vehicle.vehicleType}
                  </span>
                  <h1 style={{ fontSize: 'clamp(1.5rem, 3.5vw, 2.2rem)', color: '#0F172A', marginBottom: '0.35rem' }}>
                    {vehicle.brand} {vehicle.model}
                  </h1>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: '#64748B', fontSize: '0.88rem', flexWrap: 'wrap' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                      <Star size={16} fill="#F59E0B" color="#F59E0B" />
                      <strong style={{ color: '#0F172A' }}>{vehicle.averageRating || 4.6}</strong> ({vehicle.reviewCount || 128} reviews)
                    </div>
                    <span>•</span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                      <MapPin size={16} color="#FFB800" />
                      {vehicle.locationName || 'Koramangala, Bengaluru'}
                    </div>
                  </div>
                </div>

                <button style={{ background: '#F1F5F9', border: 'none', borderRadius: '50%', width: '42px', height: '42px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', flexShrink: 0 }}>
                  <Heart size={20} color="#64748B" />
                </button>
              </div>

              <p style={{ color: '#475569', fontSize: '0.95rem', lineHeight: 1.6, marginBottom: '1.5rem' }}>
                {vehicle.description || 'The Royal Enfield Classic 350 is a timeless motorcycling icon built with modern engineering, refined engine smooth power delivery, and ultra-comfortable posture for long highway trips and daily city rides.'}
              </p>

              {/* Technical Specifications Bar */}
              <h3 style={{ fontSize: '1.05rem', color: '#0F172A', marginBottom: '0.85rem' }}>Vehicle Specifications</h3>
              <div className="grid-4" style={{ gap: '0.85rem', marginBottom: '1.5rem' }}>
                <div style={{ padding: '0.85rem', background: '#F8FAFC', borderRadius: '10px' }}>
                  <div style={{ fontSize: '0.75rem', color: '#64748B' }}>Engine Capacity</div>
                  <strong style={{ fontSize: '0.92rem', color: '#0F172A' }}>{vehicle.engineCC > 0 ? `${vehicle.engineCC} cc` : 'Electric Motor'}</strong>
                </div>
                <div style={{ padding: '0.85rem', background: '#F8FAFC', borderRadius: '10px' }}>
                  <div style={{ fontSize: '0.75rem', color: '#64748B' }}>Fuel Type</div>
                  <strong style={{ fontSize: '0.92rem', color: '#0F172A' }}>{vehicle.fuelType}</strong>
                </div>
                <div style={{ padding: '0.85rem', background: '#F8FAFC', borderRadius: '10px' }}>
                  <div style={{ fontSize: '0.75rem', color: '#64748B' }}>Transmission</div>
                  <strong style={{ fontSize: '0.92rem', color: '#0F172A' }}>{vehicle.transmission}</strong>
                </div>
                <div style={{ padding: '0.85rem', background: '#F8FAFC', borderRadius: '10px' }}>
                  <div style={{ fontSize: '0.75rem', color: '#64748B' }}>Mileage / Range</div>
                  <strong style={{ fontSize: '0.92rem', color: '#0F172A' }}>{vehicle.mileage} km/l</strong>
                </div>
              </div>

              {/* Included Features Badges */}
              <h3 style={{ fontSize: '1.05rem', color: '#0F172A', marginBottom: '0.85rem' }}>Included Features</h3>
              <div style={{ display: 'flex', gap: '0.65rem', flexWrap: 'wrap' }}>
                {['Dual-Channel ABS', 'Mobile Charging Dock', 'USB Port', 'Side Stand Engine Cut-Off', 'Complimentary Helmet'].map((feat, idx) => (
                  <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', background: '#F1F5F9', padding: '0.35rem 0.75rem', borderRadius: '20px', fontSize: '0.82rem', color: '#334155', fontWeight: 600 }}>
                    <CheckCircle size={14} color="#059669" />
                    {feat}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Pricing & Booking Widget */}
          <div className="card" style={{ padding: '1.5rem', minWidth: 0 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '1.25rem', paddingBottom: '1rem', borderBottom: '1px solid #E2E8F0', flexWrap: 'wrap', gap: '0.5rem' }}>
              <div>
                <span style={{ fontSize: '1.75rem', fontWeight: 800, color: '#0F172A', fontFamily: 'Outfit, sans-serif' }}>
                  ₹{pricePerDay}
                </span>
                <span style={{ color: '#64748B', fontSize: '0.88rem' }}> / day</span>
              </div>
              <div style={{ fontSize: '0.78rem', color: '#64748B' }}>
                ₹{securityDeposit} refundable deposit
              </div>
            </div>

            {/* Date Time Picker */}
            <div style={{ marginBottom: '1.25rem' }}>
              <h4 style={{ fontSize: '0.88rem', color: '#0F172A', marginBottom: '0.75rem' }}>Select Rental Dates</h4>
              <div className="form-group">
                <label className="form-label">Pickup Date & Time</label>
                <input 
                  type="datetime-local" 
                  value={pickupDate} 
                  onChange={(e) => setPickupDate(e.target.value)} 
                  className="form-control" 
                />
              </div>
              <div className="form-group">
                <label className="form-label">Return Date & Time</label>
                <input 
                  type="datetime-local" 
                  value={returnDate} 
                  onChange={(e) => setReturnDate(e.target.value)} 
                  className="form-control" 
                />
              </div>
            </div>

            {/* Estimated Price Breakup */}
            <div style={{ background: '#F8FAFC', borderRadius: '12px', padding: '1rem', marginBottom: '1.25rem', fontSize: '0.88rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', color: '#475569' }}>
                <span>₹{pricePerDay} × {days} days</span>
                <span>₹{rentTotal}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', color: '#475569' }}>
                <span>Refundable Security Deposit</span>
                <span>₹{securityDeposit}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', color: '#475569' }}>
                <span>Taxes & GST (18%)</span>
                <span>₹{taxesAndFees}</span>
              </div>
              <div style={{ borderTop: '1px solid #E2E8F0', paddingTop: '0.75rem', marginTop: '0.5rem', display: 'flex', justifyContent: 'space-between', fontWeight: 800, fontSize: '1.1rem', color: '#0F172A' }}>
                <span>Total Amount</span>
                <span>₹{grandTotal}</span>
              </div>
            </div>

            <button 
              onClick={() => onBookNow({ vehicle, pickupDate, returnDate })}
              className="btn btn-primary btn-lg btn-full"
              style={{ marginBottom: '1rem' }}
            >
              Continue to Book
            </button>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', fontSize: '0.78rem', color: '#64748B', textAlign: 'center' }}>
              <ShieldCheck size={16} color="#059669" style={{ flexShrink: 0 }} />
              <span>Instant Confirmation & Free Cancellation</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
