import React from 'react';

export default function GradientAccentLine({ style = {}, className = '' }) {
  return (
    <div 
      className={`gradient-accent-line ${className}`}
      style={{
        width: '100%',
        height: '2px',
        background: 'linear-gradient(90deg, #C026FF 0%, #6366F1 50%, #22D3EE 100%)',
        backgroundSize: '200% 100%',
        boxShadow: '0 0 8px rgba(99, 102, 241, 0.4)',
        zIndex: 10,
        pointerEvents: 'none',
        ...style
      }}
      aria-hidden="true"
    />
  );
}
