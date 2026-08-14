import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Bike, ShieldCheck, Lock, Mail, AlertCircle, ArrowLeft } from 'lucide-react';
import { loginUser } from '../services/api';
import ThemeToggle from '../components/ThemeToggle';

export default function AdminLoginPage({ onLoginSuccess }) {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setIsLoading(true);

    try {
      const response = await loginUser(email, password);
      const user = response.user || response;
      const roles = user.roles || (user.role ? [user.role] : []);
      const isAdmin = roles.includes('ROLE_ADMIN');

      if (!isAdmin) {
        setErrorMessage('Admin access required. This account does not have administrator privileges.');
        setIsLoading(false);
        return;
      }

      if (response.accessToken) {
        localStorage.setItem('ridego_token', response.accessToken);
      }
      localStorage.setItem('ridego_user', JSON.stringify(user));
      
      if (onLoginSuccess) {
        onLoginSuccess(user);
      }
      navigate('/admin');
    } catch (err) {
      setErrorMessage(err.response?.data?.message || 'Authentication failed. Please verify admin credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: 'var(--bg-primary)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '2rem 1rem',
      color: 'var(--text-primary)',
      position: 'relative'
    }}>
      <div style={{ position: 'absolute', top: '1.5rem', right: '1.5rem', zIndex: 10 }}>
        <ThemeToggle />
      </div>

      <div style={{
        width: 'calc(100% - 2rem)',
        maxWidth: '440px',
        backgroundColor: 'var(--bg-card)',
        border: '1px solid var(--border-color)',
        borderRadius: '16px',
        border: '1px solid #2A3447',
        padding: '1.75rem',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)'
      }}>
        {/* Header Branding */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{
            backgroundColor: '#FFB800',
            width: '54px',
            height: '54px',
            borderRadius: '14px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 1.25rem',
            boxShadow: '0 8px 20px rgba(255, 184, 0, 0.3)'
          }}>
            <Bike size={32} color="#000000" strokeWidth={2.5} />
          </div>

          <h2 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#FFFFFF', marginBottom: '0.35rem', fontFamily: 'Outfit, sans-serif' }}>
            Ride<span style={{ color: '#FFB800' }}>Go</span> Admin Portal
          </h2>
          <p style={{ fontSize: '0.88rem', color: '#94A3B8' }}>
            Sign in with administrator credentials to manage fleet, bookings, and operations.
          </p>
        </div>

        {/* Error Alert */}
        {errorMessage && (
          <div style={{
            padding: '0.85rem 1rem',
            backgroundColor: '#451A1A',
            border: '1px solid #7F1D1D',
            borderRadius: '10px',
            color: '#FCA5A5',
            fontSize: '0.85rem',
            marginBottom: '1.5rem',
            display: 'flex',
            alignItems: 'flex-start',
            gap: '0.6rem'
          }}>
            <AlertCircle size={18} color="#FCA5A5" style={{ flexShrink: 0, marginTop: '2px' }} />
            <div>{errorMessage}</div>
          </div>
        )}

        {/* Admin Login Form */}
        <form onSubmit={handleSubmit}>
          <div className="form-group" style={{ marginBottom: '1.25rem' }}>
            <label className="form-label" style={{ color: '#CBD5E1', fontSize: '0.88rem', fontWeight: 600, marginBottom: '0.4rem', display: 'block' }}>
              Administrator Email
            </label>
            <div style={{ position: 'relative' }}>
              <Mail size={18} color="#64748B" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }} />
              <input 
                type="email" 
                placeholder="admin@ridego.com" 
                value={email} 
                onChange={e => setEmail(e.target.value)} 
                className="form-control" 
                style={{
                  backgroundColor: '#0F141F',
                  borderColor: '#334155',
                  color: '#FFFFFF',
                  paddingLeft: '2.75rem',
                  height: '46px',
                  borderRadius: '10px',
                  width: '100%'
                }} 
                required 
              />
            </div>
          </div>

          <div className="form-group" style={{ marginBottom: '1.25rem' }}>
            <label className="form-label" style={{ color: '#CBD5E1', fontSize: '0.88rem', fontWeight: 600, marginBottom: '0.4rem', display: 'block' }}>
              Password
            </label>
            <div style={{ position: 'relative' }}>
              <Lock size={18} color="#64748B" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }} />
              <input 
                type="password" 
                placeholder="••••••••" 
                value={password} 
                onChange={e => setPassword(e.target.value)} 
                className="form-control" 
                style={{
                  backgroundColor: '#0F141F',
                  borderColor: '#334155',
                  color: '#FFFFFF',
                  paddingLeft: '2.75rem',
                  height: '46px',
                  borderRadius: '10px',
                  width: '100%'
                }} 
                required 
              />
            </div>
          </div>

          <div style={{ margin: '0.5rem 0 1.5rem', padding: '0.65rem 0.85rem', backgroundColor: '#141A26', borderRadius: '8px', border: '1px solid #2A3447', fontSize: '0.78rem', color: '#94A3B8' }}>
            🛡️ Local dev admin credentials: <strong style={{ color: '#FFB800' }}>admin@ridego.com</strong> / <strong style={{ color: '#FFB800' }}>admin123</strong>
          </div>

          <button 
            type="submit" 
            disabled={isLoading} 
            className="btn btn-full" 
            style={{
              backgroundColor: '#FFB800',
              color: '#000000',
              fontWeight: 700,
              height: '46px',
              borderRadius: '10px',
              border: 'none',
              fontSize: '0.95rem',
              cursor: isLoading ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem'
            }}
          >
            <ShieldCheck size={18} color="#000" />
            {isLoading ? 'Authenticating...' : 'Sign In'}
          </button>
        </form>

        <div style={{ marginTop: '1.75rem', paddingTop: '1.25rem', borderTop: '1px solid #2A3447', textAlign: 'center' }}>
          <Link 
            to="/" 
            style={{
              color: '#94A3B8',
              fontSize: '0.85rem',
              textDecoration: 'none',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem',
              fontWeight: 500
            }}
          >
            <ArrowLeft size={16} />
            Back to Customer Portal
          </Link>
        </div>
      </div>
    </div>
  );
}
