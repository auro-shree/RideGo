import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { X, Lock, Mail, User, Phone, AlertCircle } from 'lucide-react';
import { loginUser, registerUser } from '../services/api';

export default function AuthModal({ initialMode = 'login', onClose, onLoginSuccess }) {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(initialMode === 'login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setIsLoading(true);

    try {
      if (isLogin) {
        const response = await loginUser(email, password);
        onLoginSuccess(response.user || { email, name: email.includes('admin') ? 'Super Admin' : 'Rohan Kumar', role: email.includes('admin') ? 'ROLE_ADMIN' : 'ROLE_USER' });
      } else {
        const parts = name.trim().split(/\s+/, 2);
        const registerPayload = {
          name,
          firstName: parts[0] || name,
          lastName: parts[1] || '',
          email,
          password,
          phoneNumber: phone
        };
        const response = await registerUser(registerPayload);
        onLoginSuccess(response.user || { email, name, role: 'ROLE_USER' });
      }
    } catch (err) {
      setErrorMessage(err.response?.data?.message || 'Authentication failed. Please verify your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content" style={{ maxWidth: '440px', padding: '1.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <div>
            <h3 style={{ fontSize: '1.35rem', color: '#0F172A' }}>
              {isLogin ? 'Welcome Back to RideGo' : 'Create Your RideGo Account'}
            </h3>
            <p style={{ fontSize: '0.85rem', color: '#64748B' }}>
              {isLogin ? 'Log in to manage your bookings' : 'Sign up to start renting bikes in minutes'}
            </p>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748B' }}>
            <X size={20} />
          </button>
        </div>

        {errorMessage && (
          <div style={{
            padding: '0.75rem 1rem',
            backgroundColor: '#FEF2F2',
            border: '1px solid #FCA5A5',
            borderRadius: '8px',
            color: '#991B1B',
            fontSize: '0.85rem',
            marginBottom: '1rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}>
            <AlertCircle size={18} color="#991B1B" />
            {errorMessage}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {!isLogin && (
            <>
              <div className="form-group">
                <label className="form-label">Full Name</label>
                <div style={{ position: 'relative' }}>
                  <User size={18} color="#94A3B8" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
                  <input 
                    type="text" 
                    placeholder="John Doe" 
                    value={name} 
                    onChange={e => setName(e.target.value)} 
                    className="form-control" 
                    style={{ paddingLeft: '2.5rem' }} 
                    required 
                  />
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Phone Number</label>
                <div style={{ position: 'relative' }}>
                  <Phone size={18} color="#94A3B8" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
                  <input 
                    type="text" 
                    placeholder="+91 98765 43210" 
                    value={phone} 
                    onChange={e => setPhone(e.target.value)} 
                    className="form-control" 
                    style={{ paddingLeft: '2.5rem' }} 
                  />
                </div>
              </div>
            </>
          )}

          <div className="form-group">
            <label className="form-label">Email Address</label>
            <div style={{ position: 'relative' }}>
              <Mail size={18} color="#94A3B8" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
              <input 
                type="email" 
                placeholder="user@example.com or admin@ridego.com" 
                value={email} 
                onChange={e => setEmail(e.target.value)} 
                className="form-control" 
                style={{ paddingLeft: '2.5rem' }} 
                required 
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <div style={{ position: 'relative' }}>
              <Lock size={18} color="#94A3B8" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
              <input 
                type="password" 
                placeholder="••••••••" 
                value={password} 
                onChange={e => setPassword(e.target.value)} 
                className="form-control" 
                style={{ paddingLeft: '2.5rem' }} 
                required 
              />
            </div>
          </div>

          <div style={{ margin: '0.5rem 0 1.25rem', fontSize: '0.78rem', color: '#64748B' }}>
            💡 Demo credentials: <strong>admin@ridego.com</strong> / <strong>admin123</strong> or <strong>user@ridego.com</strong> / <strong>user123</strong>
          </div>

          <button type="submit" disabled={isLoading} className="btn btn-primary btn-lg btn-full" style={{ marginBottom: '1rem' }}>
            {isLoading ? 'Processing...' : (isLogin ? 'Log In' : 'Sign Up')}
          </button>

          <div style={{ textAlign: 'center', fontSize: '0.88rem', color: '#64748B' }}>
            {isLogin ? "Don't have an account? " : "Already registered? "}
            <button 
              type="button"
              onClick={() => { setIsLogin(!isLogin); setErrorMessage(''); }} 
              style={{ background: 'none', border: 'none', color: '#D97706', fontWeight: 700, cursor: 'pointer' }}
            >
              {isLogin ? 'Sign Up' : 'Log In'}
            </button>
          </div>

          <div style={{ marginTop: '1.25rem', paddingTop: '1rem', borderTop: '1px solid #E2E8F0', textAlign: 'center', fontSize: '0.82rem', color: '#64748B' }}>
            Are you an administrator?{' '}
            <button 
              type="button" 
              onClick={() => { onClose(); navigate('/admin/login'); }}
              style={{ background: 'none', border: 'none', color: '#0F172A', fontWeight: 700, cursor: 'pointer', textDecoration: 'underline' }}
            >
              Admin Login
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
