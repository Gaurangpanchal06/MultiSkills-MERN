// src/components/Navbar.jsx
// ─────────────────────────────────────────────
// Top navigation bar with brand name + account icon.
// Account icon opens the AccountDrawer.
// ─────────────────────────────────────────────

import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import AccountDrawer from './AccountDrawer';

export default function Navbar() {
  const { isAuthenticated } = useAuth();
  const [drawerOpen, setDrawerOpen] = useState(false);

  return (
    <>
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0,
        zIndex: 100,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '20px 28px',
        borderBottom: '1px solid rgba(232,228,220,0.05)',
        background: 'rgba(14,14,15,0.8)',
        backdropFilter: 'blur(12px)',
      }}>
        {/* Brand */}
        <span style={{
          fontFamily: 'var(--font-mono)',
          fontSize: 10,
          letterSpacing: '0.22em',
          textTransform: 'uppercase',
          color: 'var(--text-muted)',
        }}>
          MultiSkills
        </span>

        {/* Account Icon */}
        {isAuthenticated && (
          <button
            onClick={() => setDrawerOpen(true)}
            aria-label="Open account"
            style={{
              background: 'none',
              border: '1px solid var(--border-mid)',
              cursor: 'pointer',
              width: 34, height: 34,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: 'var(--text-muted)',
              transition: 'all var(--transition)',
              borderRadius: 0,
            }}
            onMouseEnter={e => {
              e.currentTarget.style.borderColor = 'rgba(232,228,220,0.3)';
              e.currentTarget.style.color = 'var(--text)';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.borderColor = 'var(--border-mid)';
              e.currentTarget.style.color = 'var(--text-muted)';
            }}
          >
            <AccountIcon />
          </button>
        )}
      </nav>

      <AccountDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} />
    </>
  );
}

function AccountIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <circle cx="12" cy="8" r="4" />
      <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
    </svg>
  );
}
