// src/context/AuthContext.jsx
// Auth state using JWT + our Express backend.
// Token stored in localStorage as 'ms_token'.

import { createContext, useContext, useEffect, useState } from 'react';
import { authAPI } from '../lib/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user,    setUser]    = useState(null);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState(null);

  // ── Restore session on mount ──────────────
  // If a token exists in localStorage, fetch the current user
  useEffect(() => {
    const token = localStorage.getItem('ms_token');
    if (!token) {
      setLoading(false);
      return;
    }

    authAPI.me()
      .then(({ user }) => setUser(user))
      .catch(() => {
        // Token is invalid or expired — clear it
        localStorage.removeItem('ms_token');
      })
      .finally(() => setLoading(false));
  }, []);

  // ── Handle Google OAuth callback ──────────
  // When Google redirects back to /auth/callback?token=xxx
  // we pick up the token from the URL and store it
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token  = params.get('token');
    const error  = params.get('error');

    if (error) {
      setError('Google sign-in failed. Please try again.');
      // Clean URL
      window.history.replaceState({}, '', '/');
      setLoading(false);
      return;
    }

    if (token) {
      localStorage.setItem('ms_token', token);
      // Clean token from URL immediately for security
      window.history.replaceState({}, '', '/');

      // Fetch user with the new token
      authAPI.me()
        .then(({ user }) => setUser(user))
        .catch(() => localStorage.removeItem('ms_token'))
        .finally(() => setLoading(false));
    }
  }, []);

  // ── Sign Up ───────────────────────────────
  async function signUp(email, password, fullName) {
    setError(null);
    try {
      const { token, user } = await authAPI.signup(fullName, email, password);
      localStorage.setItem('ms_token', token);
      setUser(user);
      return { ok: true };
    } catch (err) {
      setError(err.message);
      return { ok: false };
    }
  }

  // ── Sign In ───────────────────────────────
  async function signIn(email, password) {
    setError(null);
    try {
      const { token, user } = await authAPI.signin(email, password);
      localStorage.setItem('ms_token', token);
      setUser(user);
      return true;
    } catch (err) {
      setError(err.message);
      return false;
    }
  }

  // ── Google Sign In ────────────────────────
  function signInWithGoogle() {
    setError(null);
    authAPI.googleSignIn(); // redirects browser to backend
  }

  // ── Sign Out ──────────────────────────────
  function signOut() {
    localStorage.removeItem('ms_token');
    setUser(null);
  }

  const value = {
    user,
    loading,
    error,
    setError,
    signIn,
    signUp,
    signInWithGoogle,
    signOut,
    isAuthenticated: !!user,
    displayName: user?.fullName || user?.email?.split('@')[0] || 'User',
    avatarUrl:   user?.avatarUrl || null,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>');
  return ctx;
}
