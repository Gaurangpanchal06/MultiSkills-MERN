// src/lib/api.js
// Central API client — all calls to the Express backend go through here.
// In dev:  http://localhost:5000
// In prod: https://your-api.railway.app

const BASE_URL = import.meta.env.VITE_API_URL;

// ── Helper: make authenticated requests ───
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

  if (!res.ok) {
    throw new Error(data.error || 'Something went wrong.');
  }

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

  // Google OAuth — redirects browser to backend which redirects to Google
  googleSignIn: () => {
    window.location.href = `${BASE_URL}/api/auth/google`;
  },
};

// ── Skills API ────────────────────────────
export const skillsAPI = {
  getAll: () => request('/api/skills'),

  add: (skillData) =>
    request('/api/skills', {
      method: 'POST',
      body:   JSON.stringify(skillData),
    }),

  delete: (id) =>
    request(`/api/skills/${id}`, {
      method: 'DELETE',
    }),
};
