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
        gap: '0.4rem',
        padding: '0.35rem 0.75rem',
        borderRadius: '30px',
        border: '1px solid var(--border-color)',
        backgroundColor: 'var(--bg-secondary)',
        color: 'var(--text-primary)',
        cursor: 'pointer',
        fontSize: '0.82rem',
        fontWeight: 600,
        transition: 'all 0.25s ease',
        minHeight: '36px',
        boxShadow: 'var(--shadow-sm)',
        ...style
      }}
    >
      {isDark ? (
        <>
          <Sun size={15} color="#FFB800" />
          <span>Light</span>
        </>
      ) : (
        <>
          <Moon size={15} color="#6366F1" />
          <span>Dark</span>
        </>
      )}
    </button>
  );
}
