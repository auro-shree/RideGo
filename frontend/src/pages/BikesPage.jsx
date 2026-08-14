import React, { useState, useEffect } from 'react';
import { Search, MapPin, Grid, List, ChevronRight, RefreshCw, SlidersHorizontal, X } from 'lucide-react';
import FilterSidebar from '../components/FilterSidebar';
import BikeCard from '../components/BikeCard';
import { getVehicles } from '../services/api';

export default function BikesPage({ onSelectVehicle }) {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showMobileFilters, setShowMobileFilters] = useState(false);
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
  }, [filters, sortBy]);

  const fetchVehicles = async () => {
    setLoading(true);
    try {
      let data = await getVehicles();

      // Apply client-side filters
      if (filters.maxPrice) {
        data = data.filter(v => (v.pricePerDay || 799) <= filters.maxPrice);
      }
      if (filters.categories && filters.categories.length > 0) {
        data = data.filter(v => filters.categories.includes(v.categoryName || v.vehicleType));
      }
      if (filters.fuelTypes && filters.fuelTypes.length > 0) {
        data = data.filter(v => filters.fuelTypes.includes(v.fuelType));
      }
      if (filters.transmissions && filters.transmissions.length > 0) {
        data = data.filter(v => filters.transmissions.includes(v.transmission));
      }
      if (filters.minRating) {
        data = data.filter(v => (v.averageRating || 4.5) >= filters.minRating);
      }

      // Sort
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
  };

  return (
    <div style={{ backgroundColor: '#F8FAFC', minHeight: '100vh', padding: '1.5rem 0 4rem' }}>
      <div className="container">
        {/* Breadcrumb */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', color: '#64748B', marginBottom: '1.25rem' }}>
          <span>Home</span>
          <ChevronRight size={14} />
          <span style={{ color: '#0F172A', fontWeight: 600 }}>Explore Fleet</span>
        </div>

        {/* Main Content Layout Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'minmax(0, 1fr)',
          gap: '1.5rem'
        }}>
          {/* Desktop & Collapsible Mobile Filter Sidebar */}
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '1.5rem'
          }}>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
              gap: '1.5rem',
              alignItems: 'start'
            }}>
              {/* Filter Sidebar Component */}
              <div style={{
                display: showMobileFilters ? 'block' : undefined
              }} className={!showMobileFilters ? 'desktop-only' : undefined}>
                <FilterSidebar 
                  filters={filters} 
                  setFilters={setFilters} 
                  onReset={resetFilters} 
                />
              </div>

              {/* Fleet Catalog Column */}
              <div style={{ minWidth: 0 }}>
                {/* Header / Sort Bar */}
                <div style={{
                  backgroundColor: '#FFFFFF',
                  border: '1px solid #E2E8F0',
                  borderRadius: '12px',
                  padding: '1rem 1.25rem',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '1.25rem',
                  flexWrap: 'wrap',
                  gap: '0.75rem'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    {/* Mobile Toggle Filter Button */}
                    <button 
                      onClick={() => setShowMobileFilters(!showMobileFilters)}
                      className="btn btn-outline btn-sm mobile-only"
                      style={{ gap: '0.4rem' }}
                    >
                      <SlidersHorizontal size={16} color="#FFB800" />
                      {showMobileFilters ? 'Hide Filters' : 'Filters'}
                    </button>
                    <span style={{ fontWeight: 700, color: '#0F172A', fontSize: '0.95rem' }}>
                      {vehicles.length} bikes available
                    </span>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span style={{ fontSize: '0.85rem', color: '#64748B' }}>Sort By:</span>
                    <select 
                      value={sortBy} 
                      onChange={e => setSortBy(e.target.value)}
                      style={{
                        padding: '0.4rem 0.8rem',
                        borderRadius: '8px',
                        border: '1px solid #E2E8F0',
                        fontSize: '0.85rem',
                        fontWeight: 600,
                        color: '#0F172A',
                        backgroundColor: '#F8FAFC',
                        minHeight: '38px'
                      }}
                    >
                      <option value="price-low">Price: Low to High</option>
                      <option value="price-high">Price: High to Low</option>
                      <option value="rating">Highest Rated</option>
                    </select>
                  </div>
                </div>

                {/* Vehicle Cards Grid */}
                {loading ? (
                  <div style={{ padding: '4rem', textAlign: 'center', color: '#64748B' }}>
                    <RefreshCw size={28} className="spin" style={{ margin: '0 auto 0.5rem' }} />
                    <div>Loading fleet from PostgreSQL database...</div>
                  </div>
                ) : vehicles.length === 0 ? (
                  <div style={{
                    backgroundColor: '#FFFFFF',
                    border: '1px solid #E2E8F0',
                    borderRadius: '12px',
                    padding: '3rem 1.5rem',
                    textAlign: 'center'
                  }}>
                    <Search size={40} color="#94A3B8" style={{ marginBottom: '1rem' }} />
                    <h3 style={{ fontSize: '1.2rem', color: '#0F172A', marginBottom: '0.5rem' }}>No bikes match your selected filters</h3>
                    <p style={{ color: '#64748B', fontSize: '0.88rem', marginBottom: '1.25rem' }}>Try clearing filters to see all available rental vehicles</p>
                    <button 
                      onClick={resetFilters}
                      className="btn btn-primary"
                    >
                      Reset All Filters
                    </button>
                  </div>
                ) : (
                  <div className="grid-3">
                    {vehicles.map(vehicle => (
                      <BikeCard key={vehicle.id} vehicle={vehicle} onViewDetails={onSelectVehicle} />
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
