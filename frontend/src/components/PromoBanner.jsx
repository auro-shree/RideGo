import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, Zap, Lock, ArrowRight, Star, Clock, CheckCircle2 } from 'lucide-react';

export default function PromoBanner({ topVehicle, onBrowseCatalog }) {
  const navigate = useNavigate();

  const handleAction = () => {
    if (onBrowseCatalog) {
      onBrowseCatalog();
    } else {
      navigate('/bikes');
    }
  };

  const bikeImageUrl = topVehicle?.imageUrl || 'https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?auto=format&fit=crop&w=1200&q=80';

  return (
    <section style={{ margin: '3.5rem 0', padding: '0 1rem' }}>
      <div 
        className="promo-banner-container"
        style={{
          maxWidth: '1350px',
          margin: '0 auto',
          backgroundColor: '#0B1426',
          backgroundImage: 'radial-gradient(circle at 80% 50%, #152442 0%, #0B1426 70%)',
          borderRadius: '24px',
          border: '1px solid rgba(255, 255, 255, 0.12)',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.4), 0 0 30px rgba(255, 184, 0, 0.12)',
          padding: '3.5rem 3.5rem',
          position: 'relative',
          overflow: 'hidden',
          color: '#FFFFFF'
        }}
      >
        {/* Background Subtle Geometric Circles */}
        <div style={{
          position: 'absolute',
          top: '-100px',
          right: '150px',
          width: '500px',
          height: '500px',
          borderRadius: '50%',
          border: '1px solid rgba(255, 184, 0, 0.08)',
          pointerEvents: 'none'
        }} />
        <div style={{
          position: 'absolute',
          bottom: '-150px',
          right: '50px',
          width: '600px',
          height: '600px',
          borderRadius: '50%',
          border: '1px solid rgba(255, 184, 0, 0.05)',
          pointerEvents: 'none'
        }} />

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(12, 1fr)',
          gap: '2.5rem',
          alignItems: 'center',
          position: 'relative',
          zIndex: 2
        }}>
          {/* LEFT COLUMN (Approx 7 cols) */}
          <div style={{ gridColumn: 'span 7' }} className="promo-left-col">
            <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', marginBottom: '1.25rem' }}>
              <div style={{
                width: '56px',
                height: '56px',
                borderRadius: '16px',
                backgroundColor: 'rgba(255, 184, 0, 0.14)',
                border: '1px solid rgba(255, 184, 0, 0.3)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 0 20px rgba(255, 184, 0, 0.2)',
                flexShrink: 0
              }}>
                <ShieldCheck size={28} color="#FFB800" />
              </div>

              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <span style={{
                    color: '#FFB800',
                    fontSize: '0.82rem',
                    fontWeight: 800,
                    letterSpacing: '1.5px',
                    textTransform: 'uppercase',
                    fontFamily: 'Outfit, sans-serif'
                  }}>
                    Handpicked For You
                  </span>
                  <div style={{ width: '40px', height: '2px', backgroundColor: '#FFB800', opacity: 0.8 }} />
                </div>
              </div>
            </div>

            {/* Main Heading */}
            <h2 style={{
              fontSize: 'clamp(2.2rem, 3.8vw, 3.2rem)',
              fontWeight: 800,
              lineHeight: 1.1,
              fontFamily: 'Outfit, sans-serif',
              marginBottom: '1rem',
              letterSpacing: '-0.02em',
              color: '#FFFFFF'
            }}>
              Top Rated Bikes,<br />
              <span style={{ color: '#FFB800' }}>Ready to Ride</span>
            </h2>

            {/* Supporting Description */}
            <p style={{
              fontSize: '1rem',
              lineHeight: 1.6,
              color: '#CBD5E1',
              maxWidth: '540px',
              marginBottom: '2rem'
            }}>
              Experience performance, comfort, and reliability with our top-rated bikes. Instant booking. No hidden charges.
            </p>

            {/* Compact Trust Indicators */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '1.5rem',
              flexWrap: 'wrap',
              paddingTop: '1rem',
              borderTop: '1px solid rgba(255, 255, 255, 0.1)'
            }}>
              {/* Item 1 */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <div style={{ width: '36px', height: '36px', borderRadius: '50%', border: '1px solid rgba(255, 184, 0, 0.4)', backgroundColor: 'rgba(255, 184, 0, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Star size={16} color="#FFB800" fill="#FFB800" />
                </div>
                <div>
                  <div style={{ fontWeight: 800, fontSize: '0.95rem', color: '#FFFFFF', lineHeight: 1.1 }}>10K+</div>
                  <div style={{ fontSize: '0.75rem', color: '#94A3B8' }}>Happy Riders</div>
                </div>
              </div>

              <div style={{ width: '1px', height: '28px', backgroundColor: 'rgba(255, 255, 255, 0.12)' }} className="desktop-only" />

              {/* Item 2 */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <div style={{ width: '36px', height: '36px', borderRadius: '50%', border: '1px solid rgba(255, 184, 0, 0.4)', backgroundColor: 'rgba(255, 184, 0, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Clock size={16} color="#FFB800" />
                </div>
                <div>
                  <div style={{ fontWeight: 800, fontSize: '0.95rem', color: '#FFFFFF', lineHeight: 1.1 }}>Instant</div>
                  <div style={{ fontSize: '0.75rem', color: '#94A3B8' }}>Quick Booking</div>
                </div>
              </div>

              <div style={{ width: '1px', height: '28px', backgroundColor: 'rgba(255, 255, 255, 0.12)' }} className="desktop-only" />

              {/* Item 3 */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <div style={{ width: '36px', height: '36px', borderRadius: '50%', border: '1px solid rgba(255, 184, 0, 0.4)', backgroundColor: 'rgba(255, 184, 0, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <CheckCircle2 size={16} color="#FFB800" />
                </div>
                <div>
                  <div style={{ fontWeight: 800, fontSize: '0.95rem', color: '#FFFFFF', lineHeight: 1.1 }}>100% Safe</div>
                  <div style={{ fontSize: '0.75rem', color: '#94A3B8' }}>Secure Rides</div>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN (Approx 5 cols) - Visual Focal Point */}
          <div style={{ gridColumn: 'span 5', position: 'relative' }} className="promo-right-col">
            {/* Glowing Yellow Halo Behind Motorcycle */}
            <div style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: '320px',
              height: '320px',
              borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(255, 184, 0, 0.35) 0%, rgba(255, 184, 0, 0.08) 60%, transparent 75%)',
              filter: 'blur(20px)',
              pointerEvents: 'none'
            }} />

            {/* Motorcycle Image */}
            <div style={{
              position: 'relative',
              width: '100%',
              height: '290px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '1.25rem'
            }}>
              <img 
                src={bikeImageUrl} 
                alt="Top Rated Bike" 
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'contain',
                  filter: 'drop-shadow(0 15px 25px rgba(0,0,0,0.6))',
                  transition: 'transform 0.4s ease'
                }}
                onError={(e) => {
                  e.target.src = 'https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?auto=format&fit=crop&w=1200&q=80';
                }}
              />
            </div>

            {/* Primary CTA Button */}
            <div style={{ textAlign: 'right' }}>
              <button
                type="button"
                onClick={handleAction}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.6rem',
                  height: '52px',
                  padding: '0 2rem',
                  borderRadius: '12px',
                  border: 'none',
                  backgroundColor: '#FFB800',
                  color: '#000000',
                  fontWeight: 800,
                  fontSize: '1rem',
                  fontFamily: 'Outfit, sans-serif',
                  cursor: 'pointer',
                  boxShadow: '0 8px 24px rgba(255, 184, 0, 0.4)',
                  transition: 'all 0.25s ease'
                }}
                className="promo-cta-btn"
              >
                <span>Browse Full Catalog</span>
                <ArrowRight size={18} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
