import React from 'react';
import { Bike, Phone, Mail, MapPin, Globe, Share2, MessageSquare } from 'lucide-react';

export default function Footer() {
  return (
    <footer style={{ backgroundColor: '#0F141F', color: '#94A3B8', paddingTop: '3.5rem', paddingBottom: '2rem' }}>
      <div className="container">
        <div className="grid-4" style={{ marginBottom: '2.5rem' }}>
          {/* Brand Info */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
              <div style={{
                backgroundColor: '#FFB800',
                width: '36px',
                height: '36px',
                borderRadius: '10px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}>
                <Bike size={22} color="#000000" strokeWidth={2.5} />
              </div>
              <span style={{ fontSize: '1.4rem', fontWeight: 800, color: '#FFFFFF', fontFamily: 'Outfit, sans-serif' }}>
                Ride<span style={{ color: '#FFB800' }}>Go</span>
              </span>
            </div>
            <p style={{ fontSize: '0.88rem', lineHeight: 1.6, marginBottom: '1.25rem' }}>
              Premium bike rental and booking platform. Effortless urban commuting and weekend road adventures.
            </p>
            <div style={{ display: 'flex', gap: '0.75rem' }}>
              {[Globe, Share2, MessageSquare].map((Icon, idx) => (
                <div key={idx} style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '50%',
                  background: '#1E2434',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#FFFFFF',
                  cursor: 'pointer'
                }}>
                  <Icon size={18} />
                </div>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 style={{ color: '#FFFFFF', fontSize: '1rem', marginBottom: '1rem' }}>Quick Links</h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.65rem', fontSize: '0.88rem' }}>
              <li><a href="#" style={{ color: 'inherit', textDecoration: 'none' }}>Popular Categories</a></li>
              <li><a href="#" style={{ color: 'inherit', textDecoration: 'none' }}>Cruiser Bikes</a></li>
              <li><a href="#" style={{ color: 'inherit', textDecoration: 'none' }}>Sports Fleet</a></li>
              <li><a href="#" style={{ color: 'inherit', textDecoration: 'none' }}>Electric Scooters</a></li>
              <li><a href="#" style={{ color: 'inherit', textDecoration: 'none' }}>Tariffs & Deposit Policy</a></li>
            </ul>
          </div>

          {/* Customer Support */}
          <div>
            <h4 style={{ color: '#FFFFFF', fontSize: '1rem', marginBottom: '1rem' }}>Customer Support</h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.65rem', fontSize: '0.88rem' }}>
              <li><a href="#" style={{ color: 'inherit', textDecoration: 'none' }}>Help Center & FAQs</a></li>
              <li><a href="#" style={{ color: 'inherit', textDecoration: 'none' }}>Terms & Conditions</a></li>
              <li><a href="#" style={{ color: 'inherit', textDecoration: 'none' }}>Privacy Policy</a></li>
              <li><a href="#" style={{ color: 'inherit', textDecoration: 'none' }}>Insurance Coverage</a></li>
              <li><a href="#" style={{ color: 'inherit', textDecoration: 'none' }}>Roadside Assistance</a></li>
            </ul>
          </div>

          {/* Contact Information */}
          <div>
            <h4 style={{ color: '#FFFFFF', fontSize: '1rem', marginBottom: '1rem' }}>Contact Us</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.88rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <MapPin size={18} color="#FFB800" style={{ flexShrink: 0 }} />
                <span>Master Canteen, Bhubaneswar</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <Phone size={18} color="#FFB800" style={{ flexShrink: 0 }} />
                <span>+91 76068 30679</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <Mail size={18} color="#FFB800" style={{ flexShrink: 0 }} />
                <span style={{ wordBreak: 'break-all' }}>auroshree.as@gmail.com</span>
              </div>
            </div>
          </div>
        </div>

        <div style={{
          borderTop: '1px solid #1E2434',
          paddingTop: '1.5rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1rem',
          fontSize: '0.82rem'
        }}>
          <div>© {new Date().getFullYear()} RideGo Technologies Inc. All rights reserved.</div>
          <div style={{ display: 'flex', gap: '1.25rem', flexWrap: 'wrap' }}>
            <span>Security Verified</span>
            <span>SSL 256-bit Encrypted</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
