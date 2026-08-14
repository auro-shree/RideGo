import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import BikesPage from './pages/BikesPage';
import BikeDetailPage from './pages/BikeDetailPage';
import UserDashboardPage from './pages/UserDashboardPage';
import AdminDashboardPage from './pages/AdminDashboardPage';
import AdminLoginPage from './pages/AdminLoginPage';
import CheckoutModal from './components/CheckoutModal';
import AuthModal from './components/AuthModal';

const checkIsAdmin = (user) => {
  if (!user) return false;
  const roles = user.roles || (user.role ? [user.role] : []);
  return roles.includes('ROLE_ADMIN');
};

function AdminRouteGuard({ currentUser, onLogout, onExitAdmin }) {
  const navigate = useNavigate();
  const isAdmin = checkIsAdmin(currentUser);

  if (!currentUser) {
    return (
      <div style={{ minHeight: '100vh', backgroundColor: '#0F141F', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#FFF', padding: '2rem' }}>
        <div style={{ textAlign: 'center', maxWidth: '400px', backgroundColor: '#1E2434', padding: '2.5rem', borderRadius: '16px', border: '1px solid #2A3447' }}>
          <h2 style={{ fontSize: '1.4rem', color: '#FFF', marginBottom: '0.75rem' }}>Authentication Required</h2>
          <p style={{ fontSize: '0.9rem', color: '#94A3B8', marginBottom: '1.5rem' }}>
            Please log in with administrator credentials to access the RideGo Admin Portal.
          </p>
          <button onClick={() => navigate('/admin/login')} className="btn btn-primary btn-full" style={{ backgroundColor: '#FFB800', color: '#000', fontWeight: 700, padding: '0.75rem', borderRadius: '10px' }}>
            Go to Admin Login
          </button>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div style={{ minHeight: '100vh', backgroundColor: '#0F141F', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#FFF', padding: '2rem' }}>
        <div style={{ textAlign: 'center', maxWidth: '440px', backgroundColor: '#1E2434', padding: '2.5rem', borderRadius: '16px', border: '1px solid #7F1D1D' }}>
          <div style={{ backgroundColor: '#451A1A', width: '56px', height: '56px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.25rem' }}>
            <span style={{ fontSize: '1.8rem' }}>🚫</span>
          </div>
          <h2 style={{ fontSize: '1.4rem', color: '#FCA5A5', marginBottom: '0.75rem' }}>Access Denied</h2>
          <p style={{ fontSize: '0.9rem', color: '#94A3B8', marginBottom: '1.5rem' }}>
            Administrator privileges required. Your customer account (<strong style={{ color: '#FFF' }}>{currentUser.email}</strong>) does not have access to the Admin Portal.
          </p>
          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <button onClick={() => navigate('/dashboard')} className="btn btn-primary" style={{ flex: 1, backgroundColor: '#FFB800', color: '#000', fontWeight: 700, padding: '0.65rem', borderRadius: '8px' }}>
              Customer Dashboard
            </button>
            <button onClick={() => navigate('/admin/login')} className="btn btn-secondary" style={{ flex: 1, backgroundColor: '#2A3447', color: '#FFF', padding: '0.65rem', borderRadius: '8px' }}>
              Switch Account
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <AdminDashboardPage 
      currentUser={currentUser} 
      onLogout={onLogout} 
      onExitAdmin={onExitAdmin} 
    />
  );
}

function AppContent() {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState(() => {
    const saved = localStorage.getItem('ridego_user');
    return saved ? JSON.parse(saved) : null;
  });

  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [showCheckout, setShowCheckout] = useState(false);
  const [authModalConfig, setAuthModalConfig] = useState(null); // { mode: 'login' | 'signup' }

  const handleLogout = () => {
    localStorage.removeItem('ridego_token');
    localStorage.removeItem('ridego_user');
    setCurrentUser(null);
    navigate('/admin/login');
  };

  const handleLoginSuccess = (user) => {
    setCurrentUser(user);
    localStorage.setItem('ridego_user', JSON.stringify(user));
    setAuthModalConfig(null);
    const roles = user.roles || (user.role ? [user.role] : []);
    if (roles.includes('ROLE_ADMIN')) {
      navigate('/admin');
    } else {
      navigate('/dashboard');
    }
  };

  const handleAdminLoginSuccess = (user) => {
    setCurrentUser(user);
    localStorage.setItem('ridego_user', JSON.stringify(user));
    navigate('/admin');
  };

  const handleSelectVehicle = (vehicle) => {
    setSelectedVehicle(vehicle);
    navigate(`/bike/${vehicle.id}`);
  };

  const handleInitiateBooking = (bookingData) => {
    if (!currentUser) {
      setAuthModalConfig({ mode: 'login' });
      return;
    }
    setShowCheckout(true);
  };

  return (
    <div className="app-container">
      <Routes>
        {/* Admin Login Route */}
        <Route 
          path="/admin/login" 
          element={
            <AdminLoginPage onLoginSuccess={handleAdminLoginSuccess} />
          } 
        />

        {/* Admin Dashboard Protected Route */}
        <Route 
          path="/admin" 
          element={
            <AdminRouteGuard 
              currentUser={currentUser} 
              onLogout={handleLogout} 
              onExitAdmin={() => navigate('/')} 
            />
          } 
        />

        {/* Public & Customer Routes */}
        <Route 
          path="*" 
          element={
            <>
              <Navbar 
                currentUser={currentUser} 
                onLogout={handleLogout} 
                openAuthModal={(mode) => setAuthModalConfig({ mode })} 
              />
              
              <main className="main-content">
                <Routes>
                  <Route path="/" element={<HomePage onSelectVehicle={handleSelectVehicle} />} />
                  <Route path="/bikes" element={<BikesPage onSelectVehicle={handleSelectVehicle} />} />
                  <Route 
                    path="/bike/:id" 
                    element={
                      <BikeDetailPage 
                        vehicle={selectedVehicle} 
                        onBack={() => navigate('/bikes')} 
                        onBookNow={handleInitiateBooking} 
                      />
                    } 
                  />
                  <Route 
                    path="/dashboard" 
                    element={
                      <UserDashboardPage currentUser={currentUser} onLogout={handleLogout} />
                    } 
                  />
                </Routes>
              </main>

              <Footer />
            </>
          } 
        />
      </Routes>

      {/* Checkout Modal */}
      {showCheckout && selectedVehicle && (
        <CheckoutModal 
          vehicle={selectedVehicle} 
          onClose={() => setShowCheckout(false)} 
          onSuccess={() => {
            setShowCheckout(false);
            navigate('/dashboard');
          }} 
        />
      )}

      {/* Login / Signup Auth Modal */}
      {authModalConfig && (
        <AuthModal 
          initialMode={authModalConfig.mode} 
          onClose={() => setAuthModalConfig(null)} 
          onLoginSuccess={handleLoginSuccess} 
        />
      )}
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <AppContent />
      </BrowserRouter>
    </ThemeProvider>
  );
}
