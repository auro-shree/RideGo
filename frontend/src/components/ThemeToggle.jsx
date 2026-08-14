import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

export default function ThemeToggle({ className = '', style = {} }) {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
      className={`theme-toggle-btn ${className}`}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '0.45rem',
        padding: '0.4rem 0.85rem',
        borderRadius: '30px',
        border: '1px solid var(--border-color)',
        backgroundColor: 'var(--bg-secondary)',
        color: 'var(--text-primary)',
        cursor: 'pointer',
        fontSize: '0.82rem',
        fontWeight: 700,
        height: '40px',
        minWidth: '92px',
        transition: 'all 0.2s ease',
        boxShadow: 'var(--shadow-sm)',
        ...style
      }}
    >
      {isDark ? (
        <>
          <Moon size={15} color="#FFB800" fill="#FFB800" />
          <span>Dark</span>
        </>
      ) : (
        <>
          <Sun size={15} color="#F59E0B" fill="#F59E0B" />
          <span>Light</span>
        </>
      )}
    </button>
  );
}
