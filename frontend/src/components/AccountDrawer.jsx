// src/components/AccountDrawer.jsx
// ─────────────────────────────────────────────
// Slide-out panel showing user profile, stats,
// and sign-out button.
// ─────────────────────────────────────────────

import { useAuth } from '../context/AuthContext';
import { useSkills } from '../hooks/useSkills';

const CATS = {
  Money:     { icon: '◈', color: 'var(--money)' },
  Soul:      { icon: '◎', color: 'var(--soul)' },
  Curiosity: { icon: '◇', color: 'var(--curiosity)' },
};

export default function AccountDrawer({ open, onClose }) {
  const { user, displayName, avatarUrl, signOut } = useAuth();
  const { skills, byCategory } = useSkills();

  async function handleSignOut() {
    onClose();
    await signOut();
  }

  return (
    <>
      {/* Backdrop */}
      {open && (
        <div
          onClick={onClose}
          style={{
            position: 'fixed', inset: 0,
            background: 'rgba(14,14,15,0.5)',
            backdropFilter: 'blur(2px)',
            zIndex: 150,
            animation: 'fadeUp 0.2s ease both',
          }}
        />
      )}

      {/* Drawer panel */}
      <aside style={{
        position: 'fixed',
        top: 0, right: 0, bottom: 0,
        width: 300,
        background: 'var(--bg-elevated)',
        borderLeft: '1px solid var(--border-mid)',
        zIndex: 151,
        padding: '28px 28px 40px',
        display: 'flex',
        flexDirection: 'column',
        gap: 0,
        transform: open ? 'translateX(0)' : 'translateX(100%)',
        transition: 'transform 0.35s cubic-bezier(0.22,1,0.36,1)',
        overflowY: 'auto',
      }}>

        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 36 }}>
          <span className="label">Account</span>
          <button onClick={onClose} style={{
            background: 'none', border: 'none', cursor: 'pointer',
            color: 'var(--text-muted)', fontSize: 20, lineHeight: 1,
            padding: 4, transition: 'color var(--transition)',
          }}
            onMouseEnter={e => e.target.style.color = 'var(--text)'}
            onMouseLeave={e => e.target.style.color = 'var(--text-muted)'}
          >×</button>
        </div>

        {/* Avatar + Name */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 32 }}>
          <div style={{
            width: 48, height: 48,
            border: '1px solid var(--border-mid)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            background: 'var(--bg)',
            flexShrink: 0,
            overflow: 'hidden',
          }}>
            {avatarUrl
              ? <img src={avatarUrl} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              : <span style={{ color: 'var(--text-muted)', fontSize: 20, fontFamily: 'var(--font-display)' }}>
                  {displayName[0]?.toUpperCase()}
                </span>
            }
          </div>
          <div>
            <div style={{ fontSize: 17, color: 'var(--text)', marginBottom: 2 }}>{displayName}</div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--text-muted)', letterSpacing: '0.1em' }}>
              {user?.email}
            </div>
          </div>
        </div>

        <div className="divider" style={{ marginBottom: 28 }} />

        {/* Skill stats */}
        <div className="label" style={{ marginBottom: 16 }}>Your Map</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 32 }}>
          {Object.entries(CATS).map(([cat, c]) => {
            const count = byCategory(cat).length;
            return (
              <div key={cat} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <span style={{ color: c.color, fontSize: 14 }}>{c.icon}</span>
                  <span style={{ fontSize: 14, color: 'var(--text-mid)' }}>{cat}</span>
                </div>
                <span style={{
                  fontFamily: 'var(--font-mono)', fontSize: 12,
                  color: count > 0 ? c.color : 'var(--text-dim)',
                }}>{count}</span>
              </div>
            );
          })}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: 8, borderTop: '1px solid var(--border)' }}>
            <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>Total skills</span>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--text-mid)' }}>{skills.length}</span>
          </div>
        </div>

        {/* Member since */}
        {user?.created_at && (
          <div style={{ marginBottom: 32 }}>
            <div className="label" style={{ marginBottom: 8 }}>Member since</div>
            <div style={{ fontSize: 13, color: 'var(--text-mid)' }}>
              {new Date(user.created_at).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
            </div>
          </div>
        )}

        <div style={{ flex: 1 }} />

        {/* Sign out */}
        <button onClick={handleSignOut} className="btn btn-ghost" style={{ width: '100%', textAlign: 'center' }}>
          Sign Out
        </button>
      </aside>
    </>
  );
}
