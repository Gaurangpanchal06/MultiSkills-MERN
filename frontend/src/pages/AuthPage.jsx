// src/pages/AuthPage.jsx

import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { authAPI } from '../lib/api';

// mode can be: 'login' | 'register' | 'forgot' | 'reset'
export default function AuthPage() {
  const { signIn, signUp, signInWithGoogle, error, setError } = useAuth();

  const [mode,       setMode]       = useState('login');
  const [email,      setEmail]      = useState('');
  const [password,   setPassword]   = useState('');
  const [name,       setName]       = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [info,       setInfo]       = useState('');

  // Reset password
  const [resetToken,    setResetToken]    = useState('');
  const [newPassword,   setNewPassword]   = useState('');
  const [confirmPass,   setConfirmPass]   = useState('');

  // On mount — check if URL has ?reset_token=xxx (from email link)
  useState(() => {
    const params = new URLSearchParams(window.location.search);
    const token  = params.get('token');
    const page   = params.get('page');
    if (token && page === 'reset') {
      setResetToken(token);
      setMode('reset');
      window.history.replaceState({}, '', '/');
    }
  });

  function switchMode(m) {
    setMode(m);
    setError(null);
    setInfo('');
    setEmail('');
    setPassword('');
    setNewPassword('');
    setConfirmPass('');
  }

  // ── Login / Register submit ───────────────
  async function handleSubmit(e) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    setInfo('');

    if (mode === 'login') {
      await signIn(email, password);
    } else {
      const result = await signUp(email, password, name);
      if (result?.ok && result.needsConfirmation) {
        setInfo('Check your email for a confirmation link, then sign in.');
        setMode('login');
        setPassword('');
      }
    }
    setSubmitting(false);
  }

  // ── Forgot password submit ────────────────
  async function handleForgotSubmit(e) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    setInfo('');

    try {
      await authAPI.forgotPassword(email);
      setInfo('If that email is registered, a reset link has been sent. Check your inbox.');
    } catch (err) {
      setError(err.message);
    }
    setSubmitting(false);
  }

  // ── Reset password submit ─────────────────
  async function handleResetSubmit(e) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    setInfo('');

    if (newPassword !== confirmPass) {
      setError('Passwords do not match.');
      setSubmitting(false);
      return;
    }
    if (newPassword.length < 6) {
      setError('Password must be at least 6 characters.');
      setSubmitting(false);
      return;
    }

    try {
      await authAPI.resetPassword(resetToken, newPassword);
      setInfo('Password reset successfully. You can now sign in.');
      setMode('login');
    } catch (err) {
      setError(err.message);
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

  const focusStyle = e => e.target.style.borderBottomColor = 'rgba(232,228,220,0.35)';
  const blurStyle  = e => e.target.style.borderBottomColor = 'var(--border-mid)';

  return (
    <div className="page" style={{ justifyContent: 'center' }}>
      <div className="noise-overlay" />
      <div className="glow-blob" />

      <div style={{ width: '100%', maxWidth: 400, position: 'relative', zIndex: 1 }} className="fade-up">

        <div className="label" style={{ marginBottom: 8 }}>MultiSkills</div>

        {/* ── Forgot Password ─────────────────── */}
        {mode === 'forgot' && (
          <>
            <h2 style={{ fontSize: 28, fontWeight: 400, color: 'var(--text)', marginBottom: 12 }}>
              Forgot password?
            </h2>
            <p style={{ fontSize: 14, color: 'var(--text-muted)', marginBottom: 36, lineHeight: 1.7 }}>
              Enter your email and we'll send you a link to reset your password.
            </p>

            <form onSubmit={handleForgotSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              <input
                style={inputStyle}
                type="email"
                placeholder="Email address"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                onFocus={focusStyle}
                onBlur={blurStyle}
              />

              {error && <ErrorMsg>{error}</ErrorMsg>}
              {info  && <InfoMsg>{info}</InfoMsg>}

              <button
                type="submit"
                className="btn btn-primary"
                disabled={submitting}
                style={{ marginTop: 28, width: '100%' }}
              >
                {submitting ? '···' : 'Send Reset Link'}
              </button>
            </form>

            <div style={{ marginTop: 24, textAlign: 'center' }}>
              <button onClick={() => switchMode('login')} style={linkBtnStyle}>
                ← Back to Sign In
              </button>
            </div>
          </>
        )}

        {/* ── Reset Password ───────────────────── */}
        {mode === 'reset' && (
          <>
            <h2 style={{ fontSize: 28, fontWeight: 400, color: 'var(--text)', marginBottom: 12 }}>
              Set new password
            </h2>
            <p style={{ fontSize: 14, color: 'var(--text-muted)', marginBottom: 36, lineHeight: 1.7 }}>
              Choose a new password for your account.
            </p>

            <form onSubmit={handleResetSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              <input
                style={inputStyle}
                type="password"
                placeholder="New password (min. 6 characters)"
                value={newPassword}
                onChange={e => setNewPassword(e.target.value)}
                required
                onFocus={focusStyle}
                onBlur={blurStyle}
              />
              <input
                style={inputStyle}
                type="password"
                placeholder="Confirm new password"
                value={confirmPass}
                onChange={e => setConfirmPass(e.target.value)}
                required
                onFocus={focusStyle}
                onBlur={blurStyle}
              />

              {error && <ErrorMsg>{error}</ErrorMsg>}
              {info  && <InfoMsg>{info}</InfoMsg>}

              <button
                type="submit"
                className="btn btn-primary"
                disabled={submitting}
                style={{ marginTop: 28, width: '100%' }}
              >
                {submitting ? '···' : 'Reset Password'}
              </button>
            </form>
          </>
        )}

        {/* ── Login / Register ─────────────────── */}
        {(mode === 'login' || mode === 'register') && (
          <>
            <h2 style={{ fontSize: 28, fontWeight: 400, color: 'var(--text)', marginBottom: 40 }}>
              {mode === 'login' ? 'Welcome back.' : 'Create your account.'}
            </h2>

            {/* Google OAuth */}
            <button
              onClick={signInWithGoogle}
              style={{
                width: '100%', background: 'none',
                border: '1px solid var(--border-mid)',
                color: 'var(--text)', padding: '13px 20px', cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                gap: 12, fontFamily: 'var(--font-mono)', fontSize: 10,
                letterSpacing: '0.15em', textTransform: 'uppercase',
                transition: 'all var(--transition)', marginBottom: 28,
              }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(232,228,220,0.3)'; e.currentTarget.style.background = 'var(--bg-hover)'; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border-mid)'; e.currentTarget.style.background = 'none'; }}
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
                <input style={inputStyle} type="text" placeholder="Full name"
                  value={name} onChange={e => setName(e.target.value)}
                  onFocus={focusStyle} onBlur={blurStyle}
                />
              )}
              <input style={inputStyle} type="email" placeholder="Email address"
                value={email} onChange={e => setEmail(e.target.value)}
                required onFocus={focusStyle} onBlur={blurStyle}
              />
              <input style={inputStyle} type="password" placeholder="Password (min. 6 characters)"
                value={password} onChange={e => setPassword(e.target.value)}
                required minLength={6} onFocus={focusStyle} onBlur={blurStyle}
              />

              {error && <ErrorMsg>{error}</ErrorMsg>}
              {info  && <InfoMsg>{info}</InfoMsg>}

              {/* Forgot password link — only on login */}
              {mode === 'login' && (
                <div style={{ textAlign: 'right', marginTop: 8 }}>
                  <button
                    type="button"
                    onClick={() => switchMode('forgot')}
                    style={linkBtnStyle}
                  >
                    Forgot password?
                  </button>
                </div>
              )}

              <button
                type="submit"
                className="btn btn-primary"
                disabled={submitting}
                style={{ marginTop: 24, width: '100%' }}
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
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text)', fontSize: 13, fontFamily: 'inherit', textDecoration: 'underline', textUnderlineOffset: 3 }}
              >
                {mode === 'login' ? 'Register' : 'Sign in'}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

// ── Small helper components ───────────────
function ErrorMsg({ children }) {
  return (
    <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: '#e07070', letterSpacing: '0.1em', marginTop: 10, lineHeight: 1.6 }}>
      {children}
    </div>
  );
}

function InfoMsg({ children }) {
  return (
    <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--soul)', letterSpacing: '0.1em', marginTop: 10, lineHeight: 1.6 }}>
      {children}
    </div>
  );
}

const linkBtnStyle = {
  background: 'none', border: 'none', cursor: 'pointer',
  color: 'var(--text-muted)', fontSize: 12,
  fontFamily: 'var(--font-mono)', letterSpacing: '0.08em',
  transition: 'color 0.2s',
  textDecoration: 'none', padding: 0,
};

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
