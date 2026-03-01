// index.js — Express server entry point

require('dotenv').config();

const express        = require('express');
const cors           = require('cors');
const session        = require('express-session');
const connectDB      = require('./config/db');
const passport       = require('./config/passport');
const authRoutes     = require('./routes/auth');
const skillsRoutes   = require('./routes/skills');

const app  = express();
const PORT = process.env.PORT || 5000;

// ── Connect to MongoDB ────────────────────
connectDB();

// ── Middleware ────────────────────────────

// CORS — allow requests from your frontend only
app.use(cors({
  origin:      process.env.CLIENT_URL || 'http://localhost:3000',
  credentials: true,
}));

// Parse JSON request bodies
app.use(express.json());

// Session (needed for Passport Google OAuth flow)
app.use(session({
  secret:            process.env.SESSION_SECRET || 'dev_secret',
  resave:            false,
  saveUninitialized: false,
  cookie: {
    secure:   process.env.NODE_ENV === 'production',
    httpOnly: true,
    maxAge:   24 * 60 * 60 * 1000, // 1 day
  },
}));

// Passport initialization
app.use(passport.initialize());

// ── Routes ────────────────────────────────
app.use('/api/auth',   authRoutes);
app.use('/api/skills', skillsRoutes);

// ── Health check ──────────────────────────
// Vercel/Railway uses this to confirm the server is running
app.get('/api/health', (req, res) => {
  res.json({
    status:  'ok',
    message: 'MultiSkills API is running',
    env:     process.env.NODE_ENV || 'development',
  });
});

// ── 404 handler ───────────────────────────
app.use((req, res) => {
  res.status(404).json({ error: `Route ${req.method} ${req.url} not found.` });
});

// ── Global error handler ──────────────────
app.use((err, req, res, next) => {
  console.error('[Server Error]', err.message);
  res.status(500).json({ error: 'Internal server error.' });
});

// ── Start server ──────────────────────────
app.listen(PORT, () => {
  console.log(`MultiSkills API running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
});
