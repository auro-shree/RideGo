import React, { useState, useEffect, useMemo } from 'react';
import { Search, MapPin, ChevronRight, RefreshCw, SlidersHorizontal, X, ArrowRight, Sparkles, Filter, Bike } from 'lucide-react';
import FilterSidebar from '../components/FilterSidebar';
import BikeCard from '../components/BikeCard';
import PromoBanner from '../components/PromoBanner';
import { getVehicles } from '../services/api';

export default function BikesPage({ onSelectVehicle }) {
  const [vehicles, setVehicles] = useState([]);
  const [allVehicles, setAllVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCity, setSelectedCity] = useState('All Locations');
  
  const [filters, setFilters] = useState({
    maxPrice: 3000,
    categories: [],
    fuelTypes: [],
    transmissions: [],
    minRating: 0
  });
  const [sortBy, setSortBy] = useState('price-low');

  useEffect(() => {
    fetchVehicles();
  }, [filters, sortBy, searchQuery, selectedCity]);

  const fetchVehicles = async () => {
    setLoading(true);
    try {
      let rawData = await getVehicles();
      setAllVehicles(rawData);
      let data = [...rawData];

      // Client-side Search Query Filter
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        data = data.filter(v => 
          (v.brand && v.brand.toLowerCase().includes(query)) ||
          (v.model && v.model.toLowerCase().includes(query)) ||
          (v.categoryName && v.categoryName.toLowerCase().includes(query)) ||
          (v.vehicleType && v.vehicleType.toLowerCase().includes(query))
        );
      }

      // City Location Filter
      if (selectedCity !== 'All Locations') {
        data = data.filter(v => 
          (v.locationName && v.locationName.toLowerCase().includes(selectedCity.toLowerCase())) ||
          (v.city && v.city.toLowerCase().includes(selectedCity.toLowerCase()))
        );
      }

      // Max Price Filter
      if (filters.maxPrice) {
        data = data.filter(v => (v.pricePerDay || 799) <= filters.maxPrice);
      }

      // Categories Filter
      if (filters.categories && filters.categories.length > 0) {
        data = data.filter(v => filters.categories.includes(v.categoryName || v.vehicleType));
      }

      // Fuel Types Filter
      if (filters.fuelTypes && filters.fuelTypes.length > 0) {
        data = data.filter(v => filters.fuelTypes.includes(v.fuelType));
      }

      // Transmissions Filter
      if (filters.transmissions && filters.transmissions.length > 0) {
        data = data.filter(v => filters.transmissions.includes(v.transmission));
      }

      // Min Rating Filter
      if (filters.minRating) {
        data = data.filter(v => (v.averageRating || 4.5) >= filters.minRating);
      }

      // Sorting
      if (sortBy === 'price-low') {
        data.sort((a, b) => (a.pricePerDay || 0) - (b.pricePerDay || 0));
      } else if (sortBy === 'price-high') {
        data.sort((a, b) => (b.pricePerDay || 0) - (a.pricePerDay || 0));
      } else if (sortBy === 'rating') {
        data.sort((a, b) => (b.averageRating || 0) - (a.averageRating || 0));
      }

      setVehicles(data);
    } catch (err) {
      console.error('Error fetching bikes:', err);
    } finally {
      setLoading(false);
    }
  };

  const resetFilters = () => {
    setFilters({ maxPrice: 3000, categories: [], fuelTypes: [], transmissions: [], minRating: 0 });
    setSearchQuery('');
    setSelectedCity('All Locations');
  };

  // Recommended vehicles list (top 3 highest rated)
  const recommendedVehicles = useMemo(() => {
    if (!allVehicles.length) return [];
    return [...allVehicles]
      .sort((a, b) => (b.averageRating || 4.5) - (a.averageRating || 4.5))
      .slice(0, 3);
  }, [allVehicles]);

  return (
    <div style={{ backgroundColor: 'var(--bg-primary)', minHeight: '100vh', color: 'var(--text-primary)', transition: 'var(--transition)' }}>
      
      {/* 1. Page Hero Banner Header */}
      <section style={{
        backgroundColor: 'var(--bg-secondary)',
        borderBottom: '1px solid var(--border-color)',
        padding: '2.5rem 0 2rem',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div className="container">
          {/* Breadcrumb Navigation */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>
            <span style={{ cursor: 'pointer' }}>Home</span>
            <ChevronRight size={14} />
            <span style={{ color: 'var(--text-primary)', fontWeight: 700 }}>Explore Fleet</span>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '1.5rem', marginBottom: '1.75rem' }}>
            <div>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', backgroundColor: 'rgba(255, 184, 0, 0.12)', color: '#FFB800', padding: '0.3rem 0.8rem', borderRadius: '30px', fontSize: '0.78rem', fontWeight: 800, letterSpacing: '0.04em', marginBottom: '0.65rem' }}>
                <Sparkles size={14} /> PREMIUM BIKE RENTALS
              </div>
              <h1 style={{ fontSize: '2.2rem', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.02em', margin: 0, fontFamily: 'Outfit, sans-serif' }}>
                Find Your Perfect Ride
              </h1>
              <p style={{ fontSize: '0.98rem', color: 'var(--text-secondary)', marginTop: '0.4rem', margin: 0, maxWidth: '560px' }}>
                Choose from our verified fleet of cruisers, sports bikes, and electric scooters with instant online booking.
              </p>
            </div>

            {/* Quick Search & Location Inputs Bar */}
            <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', width: '100%', maxWidth: '520px' }}>
              <div style={{ position: 'relative', flex: 1, minWidth: '220px' }}>
                <Search size={17} style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
                <input 
                  type="text" 
                  placeholder="Search bike model, brand..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.65rem 0.85rem 0.65rem 2.4rem',
                    borderRadius: '10px',
                    border: '1px solid var(--border-color)',
                    backgroundColor: 'var(--bg-primary)',
                    color: 'var(--text-primary)',
                    fontSize: '0.9rem',
                    outline: 'none'
                  }}
                />
              </div>

              <select
                value={selectedCity}
                onChange={(e) => setSelectedCity(e.target.value)}
                style={{
                  padding: '0.65rem 1rem',
                  borderRadius: '10px',
                  border: '1px solid var(--border-color)',
                  backgroundColor: 'var(--bg-primary)',
                  color: 'var(--text-primary)',
                  fontSize: '0.9rem',
                  fontWeight: 600,
                  outline: 'none',
                  cursor: 'pointer'
                }}
              >
                <option value="All Locations">📍 All Locations</option>
                <option value="Bengaluru">Bengaluru</option>
                <option value="Bhubaneswar">Bhubaneswar</option>
              </select>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Main Catalog Grid Section */}
      <section style={{ padding: '2rem 0 4rem' }}>
        <div className="container">
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'minmax(0, 1fr)',
            gap: '1.75rem'
          }}>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: '1.75rem',
              alignItems: 'start'
            }}>
              
              {/* Desktop Filter Sidebar Column */}
              <div className="desktop-only" style={{ width: '290px', flexShrink: 0 }}>
                <FilterSidebar 
                  filters={filters} 
                  setFilters={setFilters} 
                  onReset={resetFilters} 
                />
              </div>

              {/* Main Vehicle Listing Column */}
              <div style={{ flex: 1, minWidth: 0 }}>
                
                {/* Results Header / Sort Control Bar */}
                <div style={{
                  backgroundColor: 'var(--bg-card)',
                  border: '1px solid var(--border-color)',
                  borderRadius: '14px',
                  padding: '1rem 1.25rem',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '1.5rem',
                  flexWrap: 'wrap',
                  gap: '1rem',
                  boxShadow: 'var(--shadow-sm)'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    {/* Mobile Filters Trigger Button */}
                    <button 
                      type="button"
                      onClick={() => setShowMobileFilters(true)}
                      className="mobile-only"
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.45rem',
                        padding: '0.5rem 0.9rem',
                        borderRadius: '8px',
                        border: '1px solid var(--border-color)',
                        backgroundColor: 'var(--bg-primary)',
                        color: 'var(--text-primary)',
                        fontWeight: 700,
                        fontSize: '0.85rem',
                        cursor: 'pointer'
                      }}
                    >
                      <SlidersHorizontal size={16} color="#FFB800" />
                      <span>Filters</span>
                    </button>

                    <span style={{ fontWeight: 800, color: 'var(--text-primary)', fontSize: '1.05rem', fontFamily: 'Outfit, sans-serif' }}>
                      {vehicles.length} {vehicles.length === 1 ? 'Bike Available' : 'Bikes Available'}
                    </span>
                  </div>

                  {/* Sort By Dropdown */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                    <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Sort By:</span>
                    <select 
                      value={sortBy} 
                      onChange={e => setSortBy(e.target.value)}
                      style={{
                        padding: '0.45rem 0.85rem',
                        borderRadius: '8px',
                        border: '1px solid var(--border-color)',
                        fontSize: '0.85rem',
                        fontWeight: 700,
                        color: 'var(--text-primary)',
                        backgroundColor: 'var(--bg-primary)',
                        minHeight: '38px',
                        outline: 'none',
                        cursor: 'pointer'
                      }}
                    >
                      <option value="price-low">Price: Low to High</option>
                      <option value="price-high">Price: High to Low</option>
                      <option value="rating">Highest Rated</option>
                    </select>
                  </div>
                </div>

                {/* Vehicles Rendering Grid */}
                {loading ? (
                  <div style={{ padding: '4rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
                    <RefreshCw size={30} className="spin" style={{ margin: '0 auto 0.75rem', color: '#FFB800' }} />
                    <div style={{ fontWeight: 600, fontSize: '0.95rem' }}>Fetching live fleet from PostgreSQL database...</div>
                  </div>
                ) : vehicles.length === 0 ? (
                  /* Compact Polished Empty State */
                  <div 
                    style={{
                      backgroundColor: 'var(--bg-card)',
                      border: '1px solid var(--border-color)',
                      borderRadius: '16px',
                      padding: '2.5rem 1.5rem',
                      textAlign: 'center',
                      boxShadow: 'var(--shadow-sm)',
                      maxWidth: '540px',
                      margin: '0 auto'
                    }}
                  >
                    <div style={{
                      width: '64px',
                      height: '64px',
                      borderRadius: '50%',
                      backgroundColor: 'rgba(255, 184, 0, 0.12)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      margin: '0 auto 1.25rem'
                    }}>
                      <Search size={28} color="#FFB800" />
                    </div>
                    <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '0.4rem', fontFamily: 'Outfit, sans-serif' }}>
                      No bikes found
                    </h3>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', marginBottom: '1.5rem', lineHeight: 1.5 }}>
                      No vehicles match your selected filter criteria. Try broadening your price range or category filters.
                    </p>
                    <button 
                      type="button"
                      onClick={resetFilters}
                      style={{
                        padding: '0.65rem 1.4rem',
                        borderRadius: '10px',
                        border: 'none',
                        backgroundColor: '#FFB800',
                        color: '#000000',
                        fontWeight: 700,
                        fontSize: '0.9rem',
                        cursor: 'pointer',
                        boxShadow: '0 4px 12px rgba(255, 184, 0, 0.3)',
                        transition: 'all 0.2s ease'
                      }}
                    >
                      Reset All Filters
                    </button>
                  </div>
                ) : (
                  <div className="grid-3" style={{ gap: '1.5rem' }}>
                    {vehicles.map(vehicle => (
                      <BikeCard key={vehicle.id} vehicle={vehicle} onViewDetails={onSelectVehicle} />
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* 3. Bottom Promotional Banner Section */}
          <PromoBanner 
            topVehicle={recommendedVehicles[0]} 
            onBrowseCatalog={resetFilters} 
          />
        </div>
      </section>

      {/* 4. Mobile Sliding Filter Drawer */}
      {showMobileFilters && (
        <>
          <div 
            onClick={() => setShowMobileFilters(false)}
            style={{
              position: 'fixed',
              inset: 0,
              backgroundColor: 'rgba(15, 23, 42, 0.65)',
              backdropFilter: 'blur(4px)',
              zIndex: 998
            }}
            className="mobile-only"
          />

          <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            bottom: 0,
            width: '85%',
            maxWidth: '340px',
            backgroundColor: 'var(--bg-secondary)',
            zIndex: 999,
            display: 'flex',
            flexDirection: 'column',
            boxShadow: '10px 0 30px rgba(0,0,0,0.25)',
            overflowY: 'auto',
            padding: '1.5rem 1.25rem'
          }} className="mobile-only">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', paddingBottom: '0.85rem', borderBottom: '1px solid var(--border-color)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 800, fontSize: '1.1rem' }}>
                <SlidersHorizontal size={18} color="#FFB800" />
                <span>Filters</span>
              </div>
              <button 
                onClick={() => setShowMobileFilters(false)}
                style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}
              >
                <X size={22} />
              </button>
            </div>

            <FilterSidebar 
              filters={filters} 
              setFilters={setFilters} 
              onReset={resetFilters} 
              isMobile={true}
              onCloseMobile={() => setShowMobileFilters(false)}
            />
          </div>
        </>
      )}
    </div>
  );
}
