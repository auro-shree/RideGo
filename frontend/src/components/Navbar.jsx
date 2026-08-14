import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Bike, Bell, User, LogOut, ShieldCheck, Search, Menu, X, 
  Home, Calendar, Heart, CreditCard, HelpCircle, Tag, MapPin 
} from 'lucide-react';
import ThemeToggle from './ThemeToggle';

export default function Navbar({ currentUser, onLogout, openAuthModal }) {
  const navigate = useNavigate();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  useEffect(() => {
    if (isDrawerOpen) {
      document.body.classList.add('body-scroll-lock');
    } else {
      document.body.classList.remove('body-scroll-lock');
    }
    return () => {
      document.body.classList.remove('body-scroll-lock');
    };
  }, [isDrawerOpen]);

  const handleNavClick = (path) => {
    setIsDrawerOpen(false);
    if (path) navigate(path);
  };

  return (
    <header style={{
      backgroundColor: 'var(--bg-secondary)',
      borderBottom: '1px solid var(--border-color)',
      position: 'sticky',
      top: 0,
      zIndex: 100,
      transition: 'var(--transition)'
    }}>
      <div className="container" style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: '74px'
      }}>
        {/* Brand Logo */}
        <Link to="/" onClick={() => setIsDrawerOpen(false)} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', textDecoration: 'none' }}>
          <div style={{
            backgroundColor: '#FFB800',
            width: '42px',
            height: '42px',
            borderRadius: '12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 12px rgba(255, 184, 0, 0.4)',
            flexShrink: 0
          }}>
            <Bike size={26} color="#000000" strokeWidth={2.5} />
          </div>
          <div>
            <div style={{ fontSize: '1.45rem', fontWeight: '800', color: 'var(--text-primary)', lineHeight: 1.1, fontFamily: 'Outfit, sans-serif' }}>
              Ride<span style={{ color: '#E5A400' }}>Go</span>
            </div>
            <div style={{ fontSize: '0.65rem', color: 'var(--text-secondary)', fontWeight: 600, letterSpacing: '0.04em' }}>
              RIDE MORE, WORRY LESS
            </div>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="desktop-only" style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
          <Link to="/" style={{ color: 'var(--text-primary)', fontWeight: 600, textDecoration: 'none', fontSize: '0.95rem' }}>Home</Link>
          <Link to="/bikes" style={{ color: 'var(--text-secondary)', fontWeight: 600, textDecoration: 'none', fontSize: '0.95rem' }}>Bikes</Link>
          <Link to="/locations" style={{ color: 'var(--text-secondary)', fontWeight: 600, textDecoration: 'none', fontSize: '0.95rem' }}>Locations</Link>
          <Link to="/offers" style={{ color: 'var(--text-secondary)', fontWeight: 600, textDecoration: 'none', fontSize: '0.95rem' }}>Offers</Link>
          <Link to="/about" style={{ color: 'var(--text-secondary)', fontWeight: 600, textDecoration: 'none', fontSize: '0.95rem' }}>About Us</Link>
        </nav>

        {/* Desktop Actions / Theme Toggle / Profile */}
        <div className="desktop-only nav-actions" style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <ThemeToggle />

          {/* Circular Notification Button (44px x 44px) */}
          <button 
            type="button"
            aria-label="Notifications"
            title="Notifications"
            style={{
              position: 'relative',
              width: '44px',
              height: '44px',
              borderRadius: '50%',
              border: '1px solid var(--border-color)',
              backgroundColor: 'var(--bg-primary)',
              color: 'var(--text-secondary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              flexShrink: 0
            }}
          >
            <Bell size={19} />
            <span style={{
              position: 'absolute',
              top: '10px',
              right: '10px',
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              backgroundColor: '#EF4444',
              boxShadow: '0 0 6px #EF4444'
            }} />
          </button>

          {currentUser ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              {currentUser.role === 'ROLE_ADMIN' ? (
                <button 
                  onClick={() => navigate('/admin')}
                  className="btn btn-dark"
                  style={{ height: '44px', padding: '0 1.25rem', borderRadius: '10px', display: 'inline-flex', alignItems: 'center', gap: '0.5rem', fontWeight: 700 }}
                >
                  <ShieldCheck size={18} color="#FFB800" />
                  Admin Panel
                </button>
              ) : (
                <button 
                  onClick={() => navigate('/dashboard')}
                  className="btn btn-outline"
                  style={{ height: '44px', padding: '0 1.1rem', borderRadius: '10px', display: 'inline-flex', alignItems: 'center', gap: '0.5rem', fontWeight: 600, borderColor: 'var(--border-color)', color: 'var(--text-primary)' }}
                >
                  {currentUser.profileImageUrl ? (
                    <img 
                      src={currentUser.profileImageUrl} 
                      alt="Avatar" 
                      style={{ width: '28px', height: '28px', borderRadius: '50%', objectFit: 'cover' }} 
                    />
                  ) : (
                    <User size={18} />
                  )}
                  {currentUser.name || 'My Profile'}
                </button>
              )}
              
              <button 
                onClick={onLogout}
                title="Logout"
                aria-label="Logout"
                style={{
                  width: '44px',
                  height: '44px',
                  borderRadius: '50%',
                  border: '1px solid var(--border-color)',
                  backgroundColor: 'var(--bg-primary)',
                  color: '#EF4444',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  flexShrink: 0
                }}
              >
                <LogOut size={18} />
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <button 
                onClick={() => openAuthModal('login')} 
                style={{
                  height: '44px',
                  padding: '0 1.25rem',
                  borderRadius: '10px',
                  border: '1px solid var(--border-color)',
                  backgroundColor: 'transparent',
                  color: 'var(--text-primary)',
                  fontWeight: 600,
                  fontSize: '0.9rem',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  whiteSpace: 'nowrap'
                }}
              >
                Log In
              </button>

              <button 
                onClick={() => openAuthModal('register')} 
                style={{
                  height: '44px',
                  padding: '0 1.4rem',
                  borderRadius: '10px',
                  border: 'none',
                  backgroundColor: '#FFB800',
                  color: '#000000',
                  fontWeight: 700,
                  fontSize: '0.9rem',
                  cursor: 'pointer',
                  boxShadow: '0 4px 14px rgba(255, 184, 0, 0.35)',
                  transition: 'all 0.2s ease',
                  whiteSpace: 'nowrap'
                }}
              >
                Sign Up
              </button>
            </div>
          )}
        </div>

        {/* Mobile Controls (Theme Toggle & Hamburger Menu) */}
        <div className="mobile-only" style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
          <ThemeToggle />
          <button 
            onClick={() => setIsDrawerOpen(!isDrawerOpen)}
            style={{
              background: 'var(--bg-primary)',
              border: '1px solid var(--border-color)',
              borderRadius: '10px',
              width: '44px',
              height: '44px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              color: 'var(--text-primary)'
            }}
            aria-label="Toggle navigation menu"
          >
            {isDrawerOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Overlay Backdrop */}
      {isDrawerOpen && (
        <div 
          onClick={() => setIsDrawerOpen(false)}
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(15, 23, 42, 0.6)',
            backdropFilter: 'blur(4px)',
            zIndex: 998
          }}
          className="mobile-only"
        />
      )}

      {/* Mobile Navigation Drawer */}
      <div 
        style={{
          position: 'fixed',
          top: 0,
          right: 0,
          bottom: 0,
          width: '82%',
          maxWidth: '320px',
          backgroundColor: 'var(--bg-secondary)',
          zIndex: 999,
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '-10px 0 30px rgba(0,0,0,0.2)',
          transform: isDrawerOpen ? 'translateX(0)' : 'translateX(100%)',
          transition: 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          padding: '1.5rem 1.25rem'
        }}
        className="mobile-only"
      >
        {/* Drawer Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingBottom: '1.25rem', borderBottom: '1px solid var(--border-color)', marginBottom: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <div style={{ backgroundColor: '#FFB800', width: '36px', height: '36px', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Bike size={22} color="#000" strokeWidth={2.5} />
            </div>
            <span style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-primary)', fontFamily: 'Outfit, sans-serif' }}>
              Ride<span style={{ color: '#E5A400' }}>Go</span>
            </span>
          </div>

          <button 
            onClick={() => setIsDrawerOpen(false)}
            style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', padding: '0.4rem' }}
          >
            <X size={22} />
          </button>
        </div>

        {/* User Card if logged in */}
        {currentUser && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            padding: '0.85rem',
            backgroundColor: 'var(--bg-primary)',
            borderRadius: '10px',
            marginBottom: '1.25rem',
            border: '1px solid var(--border-color)'
          }}>
            <div style={{
              width: '40px', height: '40px', borderRadius: '50%', backgroundColor: '#FFB800', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, color: '#000', flexShrink: 0
            }}>
              {currentUser.profileImageUrl ? (
                <img src={currentUser.profileImageUrl} alt="Avatar" style={{ width: '40px', height: '40px', borderRadius: '50%', objectFit: 'cover' }} />
              ) : (
                currentUser.name ? currentUser.name[0] : 'U'
              )}
            </div>
            <div style={{ minWidth: 0 }}>
              <div style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {currentUser.name || 'User Account'}
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {currentUser.email}
              </div>
            </div>
          </div>
        )}

        {/* Drawer Links */}
        <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
          <button 
            onClick={() => handleNavClick('/')}
            style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem', borderRadius: '8px', border: 'none', backgroundColor: 'transparent', color: 'var(--text-primary)', fontWeight: 600, fontSize: '0.95rem', cursor: 'pointer', textAlign: 'left' }}
          >
            <Home size={18} color="#FFB800" /> Home
          </button>
          
          <button 
            onClick={() => handleNavClick('/bikes')}
            style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem', borderRadius: '8px', border: 'none', backgroundColor: 'transparent', color: 'var(--text-primary)', fontWeight: 600, fontSize: '0.95rem', cursor: 'pointer', textAlign: 'left' }}
          >
            <Bike size={18} color="#FFB800" /> Browse Bikes
          </button>

          {currentUser && (
            <button 
              onClick={() => handleNavClick('/dashboard')}
              style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem', borderRadius: '8px', border: 'none', backgroundColor: 'transparent', color: 'var(--text-primary)', fontWeight: 600, fontSize: '0.95rem', cursor: 'pointer', textAlign: 'left' }}
            >
              <Calendar size={18} color="#FFB800" /> My Bookings & Profile
            </button>
          )}

          {currentUser?.role === 'ROLE_ADMIN' && (
            <button 
              onClick={() => handleNavClick('/admin')}
              style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem', borderRadius: '8px', border: 'none', backgroundColor: 'var(--bg-primary)', color: 'var(--text-primary)', fontWeight: 700, fontSize: '0.95rem', cursor: 'pointer', textAlign: 'left', marginTop: '0.5rem' }}
            >
              <ShieldCheck size={18} color="#FFB800" /> Admin Control Panel
            </button>
          )}
        </div>

        {/* Drawer Bottom Actions */}
        <div style={{ paddingTop: '1rem', borderTop: '1px solid var(--border-color)', marginTop: 'auto' }}>
          {currentUser ? (
            <button 
              onClick={() => { setIsDrawerOpen(false); onLogout(); }}
              className="btn btn-secondary btn-full"
              style={{ gap: '0.5rem', color: '#EF4444' }}
            >
              <LogOut size={18} /> Logout
            </button>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <button 
                onClick={() => { setIsDrawerOpen(false); openAuthModal('login'); }}
                className="btn btn-outline btn-full"
              >
                Log In
              </button>
              <button 
                onClick={() => { setIsDrawerOpen(false); openAuthModal('register'); }}
                className="btn btn-primary btn-full"
              >
                Sign Up
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
