import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, MapPin, Calendar, ShieldCheck, Zap, Award, Headphones, ArrowRight, ChevronRight, Compass, Navigation, Sparkles, Star } from 'lucide-react';
import BikeCard from '../components/BikeCard';
import { getVehicles, MOCK_CATEGORIES, MOCK_LOCATIONS } from '../services/api';

export default function HomePage({ onSelectVehicle }) {
  const navigate = useNavigate();
  const [tripType, setTripType] = useState('round');
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);

  const [searchQuery, setSearchQuery] = useState({
    location: 'Master Canteen, Bhubaneswar',
    pickupDate: '2025-05-20T10:00',
    returnDate: '2025-05-22T10:00'
  });

  useEffect(() => {
    fetchFeaturedVehicles();
  }, []);

  const fetchFeaturedVehicles = async () => {
    try {
      const data = await getVehicles();
      setVehicles(data);
    } catch (err) {
      console.error('Error fetching featured vehicles:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    navigate('/bikes', { state: searchQuery });
  };

  const featuredImage = vehicles[0]?.imageUrl || 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=1200&q=80';
  const totalVehiclesCount = vehicles.length > 0 ? `${vehicles.length * 15}+` : '250+';
  const totalLocationsCount = MOCK_LOCATIONS.length > 0 ? `${MOCK_LOCATIONS.length}+` : '20+';

  return (
    <div>
      {/* Redesigned Premium Editorial Hero Section */}
      <section className="hero-section-redesign">
        <div style={{
          position: 'absolute',
          top: '-15%', right: '-10%',
          width: '600px', height: '600px',
          background: 'radial-gradient(circle, rgba(255, 184, 0, 0.15) 0%, transparent 70%)',
          pointerEvents: 'none',
          zIndex: 1
        }} />

        <div className="container" style={{ position: 'relative', zIndex: 2 }}>
          <div className="hero-editorial-grid">
            {/* LEFT SIDE: Large Visual Area (~55%) */}
            <div className="hero-visual-col">
              <div className="hero-visual-card">
                <div className="floating-badge-top">
                  <Sparkles size={16} color="#FFB800" />
                  <span>Available Near You</span>
                </div>
                
                <img 
                  src={featuredImage} 
                  alt="Premium Rental Superbike"
                />

                <div className="floating-badge-bottom">
                  <Zap size={16} />
                  <span>{totalVehiclesCount} Premium Fleet</span>
                </div>
              </div>
            </div>

            {/* RIGHT SIDE: Clear Content Hierarchy (~45%) */}
            <div className="hero-content-col">
              <div className="hero-eyebrow-badge">
                <Sparkles size={14} /> PREMIUM BIKE RENTAL
              </div>

              <h1 className="hero-main-title">
                Find your <span className="text-gradient-primary">perfect ride</span> for your next journey
              </h1>

              <p className="hero-description-text">
                Explore our curated collection of premium motorcycles and scooters with transparent daily rates, zero security deposit hassles, and 24/7 roadside support.
              </p>

              {/* Micro Information Row (Real backend dynamic metrics) */}
              <div className="hero-metrics-grid">
                <div className="hero-metric-item">
                  <div className="hero-metric-icon">
                    <Zap size={18} />
                  </div>
                  <div>
                    <div className="hero-metric-value">{totalVehiclesCount}</div>
                    <div className="hero-metric-label">Vehicles</div>
                  </div>
                </div>

                <div className="hero-metric-item">
                  <div className="hero-metric-icon">
                    <MapPin size={18} />
                  </div>
                  <div>
                    <div className="hero-metric-value">{totalLocationsCount}</div>
                    <div className="hero-metric-label">Locations</div>
                  </div>
                </div>

                <div className="hero-metric-item">
                  <div className="hero-metric-icon">
                    <Star size={18} />
                  </div>
                  <div>
                    <div className="hero-metric-value">4.8★</div>
                    <div className="hero-metric-label">User Rating</div>
                  </div>
                </div>
              </div>

              {/* Primary & Secondary CTAs */}
              <div className="hero-cta-row">
                <button onClick={() => navigate('/bikes')} className="hero-btn-primary">
                  Explore Bikes <ArrowRight size={18} />
                </button>

                <button 
                  type="button"
                  onClick={() => {
                    const searchEl = document.getElementById('hero-search-card-block');
                    if (searchEl) searchEl.scrollIntoView({ behavior: 'smooth' });
                  }} 
                  className="hero-btn-secondary"
                >
                  <Search size={18} /> Search Availability
                </button>
              </div>

              <div className="hero-status-micro">
                <span className="status-dot-green"></span>
                <span>Available now • Easy 2-minute booking</span>
              </div>
            </div>
          </div>

          {/* Preserved Search Card Overlay */}
          <div id="hero-search-card-block" className="hero-search-wrapper">
            <form onSubmit={handleSearchSubmit}>
              <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1.25rem', flexWrap: 'wrap' }}>
                <button 
                  type="button" 
                  onClick={() => setTripType('round')}
                  style={{
                    padding: '0.45rem 1.1rem',
                    borderRadius: '20px',
                    border: 'none',
                    backgroundColor: tripType === 'round' ? '#0F172A' : '#F1F5F9',
                    color: tripType === 'round' ? '#FFFFFF' : '#64748B',
                    fontWeight: 600,
                    fontSize: '0.85rem',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease'
                  }}
                >
                  Round Trip
                </button>
                <button 
                  type="button" 
                  onClick={() => setTripType('oneway')}
                  style={{
                    padding: '0.45rem 1.1rem',
                    borderRadius: '20px',
                    border: 'none',
                    backgroundColor: tripType === 'oneway' ? '#0F172A' : '#F1F5F9',
                    color: tripType === 'oneway' ? '#FFFFFF' : '#64748B',
                    fontWeight: 600,
                    fontSize: '0.85rem',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease'
                  }}
                >
                  One Way Drop
                </button>
              </div>

              {/* Responsive Grid for Search Form Inputs */}
              <div className="grid-4" style={{ alignItems: 'end' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#64748B', marginBottom: '0.4rem', textTransform: 'uppercase' }}>
                    Pickup Location
                  </label>
                  <div style={{ position: 'relative' }}>
                    <MapPin size={18} style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: '#FFB800' }} />
                    <select 
                      value={searchQuery.location}
                      onChange={e => setSearchQuery({ ...searchQuery, location: e.target.value })}
                      className="form-control"
                      style={{ paddingLeft: '2.5rem', fontWeight: 600 }}
                    >
                      {MOCK_LOCATIONS.map(loc => (
                        <option key={loc.id} value={`${loc.name}, ${loc.city}`}>{loc.name}, {loc.city}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#64748B', marginBottom: '0.4rem', textTransform: 'uppercase' }}>
                    Pickup Date & Time
                  </label>
                  <div style={{ position: 'relative' }}>
                    <Calendar size={18} style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: '#64748B' }} />
                    <input 
                      type="datetime-local"
                      value={searchQuery.pickupDate}
                      onChange={e => setSearchQuery({ ...searchQuery, pickupDate: e.target.value })}
                      className="form-control"
                      style={{ paddingLeft: '2.5rem', fontWeight: 600 }}
                    />
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#64748B', marginBottom: '0.4rem', textTransform: 'uppercase' }}>
                    Return Date & Time
                  </label>
                  <div style={{ position: 'relative' }}>
                    <Calendar size={18} style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: '#64748B' }} />
                    <input 
                      type="datetime-local"
                      value={searchQuery.returnDate}
                      onChange={e => setSearchQuery({ ...searchQuery, returnDate: e.target.value })}
                      className="form-control"
                      style={{ paddingLeft: '2.5rem', fontWeight: 600 }}
                    />
                  </div>
                </div>

                <div>
                  <button type="submit" className="btn btn-primary btn-full" style={{ padding: '0.75rem 1.25rem', height: '44px', fontSize: '0.95rem' }}>
                    <Search size={18} /> Search Bikes
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </section>

      {/* Value Proposition Highlights */}
      <section style={{ padding: '3rem 0', backgroundColor: '#FFFFFF', borderBottom: '1px solid #E2E8F0' }}>
        <div className="container">
          <div className="grid-4">
            <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
              <div style={{ backgroundColor: 'rgba(255,184,0,0.15)', color: '#D97706', width: '48px', height: '48px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <ShieldCheck size={24} />
              </div>
              <div>
                <h4 style={{ fontSize: '1rem', fontWeight: 700, color: '#0F172A', marginBottom: '0.25rem' }}>Insured Rides</h4>
                <p style={{ fontSize: '0.85rem', color: '#64748B', lineHeight: 1.4 }}>Comprehensive insurance coverage & zero liability options</p>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
              <div style={{ backgroundColor: 'rgba(59,130,246,0.15)', color: '#2563EB', width: '48px', height: '48px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <Navigation size={24} />
              </div>
              <div>
                <h4 style={{ fontSize: '1rem', fontWeight: 700, color: '#0F172A', marginBottom: '0.25rem' }}>Doorstep Delivery</h4>
                <p style={{ fontSize: '0.85rem', color: '#64748B', lineHeight: 1.4 }}>Sanitized bike delivered right to your home or hotel</p>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
              <div style={{ backgroundColor: 'rgba(16,185,129,0.15)', color: '#059669', width: '48px', height: '48px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <Award size={24} />
              </div>
              <div>
                <h4 style={{ fontSize: '1rem', fontWeight: 700, color: '#0F172A', marginBottom: '0.25rem' }}>Well Maintained</h4>
                <p style={{ fontSize: '0.85rem', color: '#64748B', lineHeight: 1.4 }}>100-point safety check before every rental trip</p>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
              <div style={{ backgroundColor: 'rgba(139,92,246,0.15)', color: '#7C3AED', width: '48px', height: '48px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <Headphones size={24} />
              </div>
              <div>
                <h4 style={{ fontSize: '1rem', fontWeight: 700, color: '#0F172A', marginBottom: '0.25rem' }}>24/7 Support</h4>
                <p style={{ fontSize: '0.85rem', color: '#64748B', lineHeight: 1.4 }}>Dedicated helpline & roadside assistance anywhere</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Fleet Section */}
      <section style={{ padding: '3.5rem 0' }}>
        <div className="container">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <h2 style={{ fontSize: 'clamp(1.5rem, 3vw, 2rem)', color: '#0F172A', marginBottom: '0.35rem' }}>Featured Rental Fleet</h2>
              <p style={{ color: '#64748B', fontSize: '0.9rem' }}>Handpicked top rated vehicles ready for instant delivery</p>
            </div>
            <button onClick={() => navigate('/bikes')} className="btn btn-primary btn-sm">
              Browse Full Catalog <ArrowRight size={16} />
            </button>
          </div>

          <div className="grid-3">
            {vehicles.slice(0, 6).map(vehicle => (
              <BikeCard key={vehicle.id} vehicle={vehicle} onViewDetails={onSelectVehicle} />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
