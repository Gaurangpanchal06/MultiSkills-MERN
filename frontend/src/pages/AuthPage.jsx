// src/pages/AuthPage.jsx
// ─────────────────────────────────────────────
// Login + Register screen.
// Handles email confirmation flow for Supabase v2.
// ─────────────────────────────────────────────

import { useState } from 'react';
import { useAuth } from '../context/AuthContext';

export default function AuthPage() {
  const { signIn, signUp, signInWithGoogle, error, setError } = useAuth();

  const [mode,       setMode]       = useState('login');
  const [email,      setEmail]      = useState('');
  const [password,   setPassword]   = useState('');
  const [name,       setName]       = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [info,       setInfo]       = useState(''); // non-error feedback

  function switchMode(m) {
    setMode(m);
    setError(null);
    setInfo('');
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    setInfo('');

    if (mode === 'login') {
      await signIn(email, password);
      // On success, AuthContext updates user → App.jsx redirects to home
    } else {
      const result = await signUp(email, password, name);
      if (result?.ok) {
        if (result.needsConfirmation) {
          // Email confirmation is ON in Supabase — user must confirm first
          setInfo('Check your email for a confirmation link, then sign in.');
          setMode('login');
          setPassword('');
        }
        // If needsConfirmation is false, session is set → app redirects automatically
      }
    }
    setSubmitting(false);
  }

  const inputStyle = {
    width: '100%',
    background: 'none',
    border: 'none',
    borderBottom: '1px solid var(--border-mid)',
    outline: 'none',
    color: 'var(--text)',
    fontFamily: 'var(--font-display)',
    fontSize: 16,
    padding: '13px 0',
    caretColor: 'var(--curiosity)',
    transition: 'border-color var(--transition)',
  };

  return (
    <div className="page" style={{ justifyContent: 'center' }}>
      <div className="noise-overlay" />
      <div className="glow-blob" />

      <div style={{ width: '100%', maxWidth: 400, position: 'relative', zIndex: 1 }} className="fade-up">

        {/* Title */}
        <div className="label" style={{ marginBottom: 8 }}>MultiSkills</div>
        <h2 style={{ fontSize: 28, fontWeight: 400, color: 'var(--text)', marginBottom: 40 }}>
          {mode === 'login' ? 'Welcome back.' : 'Create your account.'}
        </h2>

        {/* Google OAuth */}
        <button
          onClick={signInWithGoogle}
          style={{
            width: '100%',
            background: 'none',
            border: '1px solid var(--border-mid)',
            color: 'var(--text)',
            padding: '13px 20px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 12,
            fontFamily: 'var(--font-mono)',
            fontSize: 10,
            letterSpacing: '0.15em',
            textTransform: 'uppercase',
            transition: 'all var(--transition)',
            marginBottom: 28,
          }}
          onMouseEnter={e => {
            e.currentTarget.style.borderColor = 'rgba(232,228,220,0.3)';
            e.currentTarget.style.background = 'var(--bg-hover)';
          }}
          onMouseLeave={e => {
            e.currentTarget.style.borderColor = 'var(--border-mid)';
            e.currentTarget.style.background = 'none';
          }}
        >
          <GoogleIcon />
          Continue with Google
        </button>

        {/* Divider */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 28 }}>
          <div className="divider" />
          <span className="label" style={{ whiteSpace: 'nowrap', fontSize: 9 }}>or email</span>
          <div className="divider" />
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>

          {mode === 'register' && (
            <input
              style={inputStyle}
              type="text"
              placeholder="Full name"
              value={name}
              onChange={e => setName(e.target.value)}
              onFocus={e => e.target.style.borderBottomColor = 'rgba(232,228,220,0.35)'}
              onBlur={e  => e.target.style.borderBottomColor = 'var(--border-mid)'}
            />
          )}

          <input
            style={inputStyle}
            type="email"
            placeholder="Email address"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
            onFocus={e => e.target.style.borderBottomColor = 'rgba(232,228,220,0.35)'}
            onBlur={e  => e.target.style.borderBottomColor = 'var(--border-mid)'}
          />

          <input
            style={inputStyle}
            type="password"
            placeholder="Password (min. 6 characters)"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
            minLength={6}
            onFocus={e => e.target.style.borderBottomColor = 'rgba(232,228,220,0.35)'}
            onBlur={e  => e.target.style.borderBottomColor = 'var(--border-mid)'}
          />

          {/* Error message */}
          {error && (
            <div style={{
              fontFamily: 'var(--font-mono)', fontSize: 10,
              color: '#e07070', letterSpacing: '0.1em', marginTop: 10,
              lineHeight: 1.6,
            }}>
              {error}
            </div>
          )}

          {/* Info / success message */}
          {info && (
            <div style={{
              fontFamily: 'var(--font-mono)', fontSize: 10,
              color: 'var(--soul)', letterSpacing: '0.1em', marginTop: 10,
              lineHeight: 1.6,
            }}>
              {info}
            </div>
          )}

          <button
            type="submit"
            className="btn btn-primary"
            disabled={submitting}
            style={{ marginTop: 28, width: '100%' }}
          >
            {submitting ? '···' : mode === 'login' ? 'Sign In' : 'Create Account'}
          </button>
        </form>

        {/* Switch mode */}
        <div style={{ marginTop: 28, textAlign: 'center' }}>
          <span style={{ fontSize: 13, color: 'var(--text-muted)' }}>
            {mode === 'login' ? "Don't have an account? " : 'Already have an account? '}
          </span>
          <button
            onClick={() => switchMode(mode === 'login' ? 'register' : 'login')}
            style={{
              background: 'none', border: 'none', cursor: 'pointer',
              color: 'var(--text)', fontSize: 13, fontFamily: 'inherit',
              textDecoration: 'underline', textUnderlineOffset: 3,
            }}
          >
            {mode === 'login' ? 'Register' : 'Sign in'}
          </button>
        </div>

      </div>
    </div>
  );
}

function GoogleIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24">
      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
    </svg>
  );
}
