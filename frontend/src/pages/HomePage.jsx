import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, MapPin, Calendar, ShieldCheck, Zap, Award, Headphones, ArrowRight, ChevronRight, Compass, Navigation } from 'lucide-react';
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

  return (
    <div>
      {/* Hero Section */}
      <section style={{
        position: 'relative',
        minHeight: '480px',
        background: 'linear-gradient(135deg, #0C1017 0%, #1A2333 100%)',
        color: '#FFFFFF',
        padding: '3rem 0 5rem',
        overflow: 'hidden'
      }}>
        <div style={{
          position: 'absolute',
          top: 0, right: 0, bottom: 0, left: 0,
          backgroundImage: 'radial-gradient(circle at 80% 20%, rgba(255,184,0,0.12) 0%, transparent 50%)',
          pointerEvents: 'none'
        }} />

        <div className="container" style={{ position: 'relative', zIndex: 2 }}>
          <div style={{ maxWidth: '680px', marginBottom: '2.5rem' }}>
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              backgroundColor: 'rgba(255,184,0,0.12)',
              border: '1px solid rgba(255,184,0,0.3)',
              color: '#FFB800',
              padding: '0.35rem 0.85rem',
              borderRadius: '20px',
              fontSize: '0.82rem',
              fontWeight: 700,
              marginBottom: '1rem'
            }}>
              <Zap size={14} /> Premier Self-Drive Bike Rental Network
            </div>
            
            <h1 style={{
              fontSize: 'clamp(1.8rem, 4.5vw, 3.2rem)',
              fontWeight: 800,
              lineHeight: 1.15,
              letterSpacing: '-0.02em',
              marginBottom: '1rem'
            }}>
              Rent Top Superbikes & City Scooters On Demand
            </h1>
            
            <p style={{
              fontSize: 'clamp(0.95rem, 2vw, 1.1rem)',
              color: '#94A3B8',
              lineHeight: 1.6
            }}>
              Zero security deposit hassles, instant doorstep delivery, 24/7 roadside assistance, and transparent daily & hourly rates across 15+ major cities.
            </p>
          </div>

          {/* Search Card Overlay */}
          <div style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '16px',
            padding: '1.5rem',
            boxShadow: '0 20px 40px -15px rgba(0,0,0,0.3)',
            color: '#0F172A'
          }}>
            <form onSubmit={handleSearchSubmit}>
              <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1.25rem', flexWrap: 'wrap' }}>
                <button 
                  type="button" 
                  onClick={() => setTripType('round')}
                  style={{
                    padding: '0.4rem 1rem',
                    borderRadius: '20px',
                    border: 'none',
                    backgroundColor: tripType === 'round' ? '#0F172A' : '#F1F5F9',
                    color: tripType === 'round' ? '#FFFFFF' : '#64748B',
                    fontWeight: 600,
                    fontSize: '0.85rem',
                    cursor: 'pointer'
                  }}
                >
                  Round Trip
                </button>
                <button 
                  type="button" 
                  onClick={() => setTripType('oneway')}
                  style={{
                    padding: '0.4rem 1rem',
                    borderRadius: '20px',
                    border: 'none',
                    backgroundColor: tripType === 'oneway' ? '#0F172A' : '#F1F5F9',
                    color: tripType === 'oneway' ? '#FFFFFF' : '#64748B',
                    fontWeight: 600,
                    fontSize: '0.85rem',
                    cursor: 'pointer'
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
                    <Search size={18} /> Find Bikes
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
