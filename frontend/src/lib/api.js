// src/lib/api.js
// Central API client — all calls to the Express backend go through here.

const BASE_URL = import.meta.env.VITE_API_URL;

async function request(endpoint, options = {}) {
  const token = localStorage.getItem('ms_token');

  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
    ...options,
  };

  const res  = await fetch(`${BASE_URL}${endpoint}`, config);
  const data = await res.json();

  if (!res.ok) throw new Error(data.error || 'Something went wrong.');
  return data;
}

// ── Auth API ──────────────────────────────
export const authAPI = {
  signup: (fullName, email, password) =>
    request('/api/auth/signup', {
      method: 'POST',
      body:   JSON.stringify({ fullName, email, password }),
    }),

  signin: (email, password) =>
    request('/api/auth/signin', {
      method: 'POST',
      body:   JSON.stringify({ email, password }),
    }),

  me: () => request('/api/auth/me'),

  googleSignIn: () => {
    window.location.href = `${BASE_URL}/api/auth/google`;
  },

  forgotPassword: (email) =>
    request('/api/auth/forgot-password', {
      method: 'POST',
      body:   JSON.stringify({ email }),
    }),

  resetPassword: (token, password) =>
    request('/api/auth/reset-password', {
      method: 'POST',
      body:   JSON.stringify({ token, password }),
    }),
};

// ── Skills API ────────────────────────────
export const skillsAPI = {
  getAll: () => request('/api/skills'),

  add: (skillData) =>
    request('/api/skills', {
      method: 'POST',
      body:   JSON.stringify(skillData),
    }),

  updateNotes: (id, notes) =>
    request(`/api/skills/${id}/notes`, {
      method: 'PUT',
      body:   JSON.stringify({ notes }),
    }),

  delete: (id) =>
    request(`/api/skills/${id}`, { method: 'DELETE' }),
};
