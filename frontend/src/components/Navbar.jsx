import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Bike, Bell, User, LogOut, ShieldCheck, Search, Menu, X, 
  Home, Calendar, Heart, CreditCard, HelpCircle, Tag, MapPin 
} from 'lucide-react';

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
      backgroundColor: '#FFFFFF',
      borderBottom: '1px solid #E2E8F0',
      position: 'sticky',
      top: 0,
      zIndex: 100
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
            <div style={{ fontSize: '1.45rem', fontWeight: '800', color: '#0F172A', lineHeight: 1.1, fontFamily: 'Outfit, sans-serif' }}>
              Ride<span style={{ color: '#E5A400' }}>Go</span>
            </div>
            <div style={{ fontSize: '0.65rem', color: '#64748B', fontWeight: 600, letterSpacing: '0.04em' }}>
              RIDE MORE, WORRY LESS
            </div>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="desktop-only" style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
          <Link to="/" style={{ color: '#0F172A', fontWeight: 600, textDecoration: 'none', fontSize: '0.95rem' }}>Home</Link>
          <Link to="/bikes" style={{ color: '#475569', fontWeight: 600, textDecoration: 'none', fontSize: '0.95rem' }}>Bikes</Link>
          <Link to="/locations" style={{ color: '#475569', fontWeight: 600, textDecoration: 'none', fontSize: '0.95rem' }}>Locations</Link>
          <Link to="/offers" style={{ color: '#475569', fontWeight: 600, textDecoration: 'none', fontSize: '0.95rem' }}>Offers</Link>
          <Link to="/about" style={{ color: '#475569', fontWeight: 600, textDecoration: 'none', fontSize: '0.95rem' }}>About Us</Link>
        </nav>

        {/* Desktop Actions / Profile */}
        <div className="desktop-only" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <button style={{
            background: '#F1F5F9',
            border: 'none',
            borderRadius: '50%',
            width: '40px',
            height: '40px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            color: '#475569'
          }}>
            <Bell size={19} />
          </button>

          {currentUser ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              {currentUser.role === 'ROLE_ADMIN' ? (
                <button 
                  onClick={() => navigate('/admin')}
                  className="btn btn-dark btn-sm"
                  style={{ gap: '0.4rem' }}
                >
                  <ShieldCheck size={16} color="#FFB800" />
                  Admin Panel
                </button>
              ) : (
                <button 
                  onClick={() => navigate('/dashboard')}
                  className="btn btn-outline btn-sm"
                  style={{ gap: '0.4rem', padding: currentUser.profileImageUrl ? '0.2rem 0.6rem 0.2rem 0.2rem' : undefined }}
                >
                  {currentUser.profileImageUrl ? (
                    <img 
                      src={currentUser.profileImageUrl} 
                      alt="Avatar" 
                      style={{ width: '26px', height: '26px', borderRadius: '50%', objectFit: 'cover' }} 
                    />
                  ) : (
                    <User size={16} />
                  )}
                  {currentUser.name || 'My Profile'}
                </button>
              )}
              
              <button 
                onClick={onLogout}
                className="btn btn-secondary btn-sm"
                title="Logout"
                style={{ padding: '0.4rem' }}
              >
                <LogOut size={16} />
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <button 
                onClick={() => openAuthModal('login')} 
                className="btn btn-outline btn-sm"
              >
                Login
              </button>
              <button 
                onClick={() => openAuthModal('signup')} 
                className="btn btn-primary btn-sm"
              >
                Sign Up
              </button>
            </div>
          )}
        </div>

        {/* Mobile Controls (Hamburger Toggle) */}
        <div className="mobile-only" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <button 
            onClick={() => setIsDrawerOpen(!isDrawerOpen)}
            style={{
              background: '#F1F5F9',
              border: 'none',
              borderRadius: '8px',
              width: '44px',
              height: '44px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              color: '#0F172A'
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
          backgroundColor: '#FFFFFF',
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
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingBottom: '1.25rem', borderBottom: '1px solid #E2E8F0', marginBottom: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <div style={{ backgroundColor: '#FFB800', width: '36px', height: '36px', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Bike size={22} color="#000" strokeWidth={2.5} />
            </div>
            <span style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0F172A', fontFamily: 'Outfit, sans-serif' }}>
              Ride<span style={{ color: '#E5A400' }}>Go</span>
            </span>
          </div>
          <button 
            onClick={() => setIsDrawerOpen(false)}
            style={{ background: 'none', border: 'none', color: '#64748B', cursor: 'pointer', padding: '0.4rem' }}
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
            backgroundColor: '#F8FAFC',
            borderRadius: '10px',
            marginBottom: '1.25rem',
            border: '1px solid #E2E8F0'
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
              <div style={{ fontWeight: 700, fontSize: '0.9rem', color: '#0F172A', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {currentUser.name || 'User Account'}
              </div>
              <div style={{ fontSize: '0.75rem', color: '#64748B', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {currentUser.email}
              </div>
            </div>
          </div>
        )}

        {/* Drawer Links */}
        <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
          <button 
            onClick={() => handleNavClick('/')}
            style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem', borderRadius: '8px', border: 'none', backgroundColor: 'transparent', color: '#0F172A', fontWeight: 600, fontSize: '0.95rem', cursor: 'pointer', textAlign: 'left' }}
          >
            <Home size={18} color="#FFB800" /> Home
          </button>
          
          <button 
            onClick={() => handleNavClick('/bikes')}
            style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem', borderRadius: '8px', border: 'none', backgroundColor: 'transparent', color: '#0F172A', fontWeight: 600, fontSize: '0.95rem', cursor: 'pointer', textAlign: 'left' }}
          >
            <Bike size={18} color="#FFB800" /> Browse Bikes
          </button>

          {currentUser && (
            <button 
              onClick={() => handleNavClick('/dashboard')}
              style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem', borderRadius: '8px', border: 'none', backgroundColor: 'transparent', color: '#0F172A', fontWeight: 600, fontSize: '0.95rem', cursor: 'pointer', textAlign: 'left' }}
            >
              <Calendar size={18} color="#FFB800" /> My Bookings & Profile
            </button>
          )}

          {currentUser?.role === 'ROLE_ADMIN' && (
            <button 
              onClick={() => handleNavClick('/admin')}
              style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem', borderRadius: '8px', border: 'none', backgroundColor: '#0F172A', color: '#FFFFFF', fontWeight: 700, fontSize: '0.95rem', cursor: 'pointer', textAlign: 'left', marginTop: '0.5rem' }}
            >
              <ShieldCheck size={18} color="#FFB800" /> Admin Control Panel
            </button>
          )}
        </div>

        {/* Drawer Bottom Actions */}
        <div style={{ paddingTop: '1rem', borderTop: '1px solid #E2E8F0', marginTop: 'auto' }}>
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
                Login
              </button>
              <button 
                onClick={() => { setIsDrawerOpen(false); openAuthModal('signup'); }}
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
