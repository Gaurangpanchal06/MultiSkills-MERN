// routes/auth.js
// Auth routes: signup, signin, google OAuth, me, signout

const express  = require('express');
const jwt      = require('jsonwebtoken');
const passport = require('passport');
const User     = require('../models/User');
const protect  = require('../middleware/auth');

const router = express.Router();

// ── Helper: generate JWT token ─────────────
function generateToken(userId) {
  return jwt.sign(
    { id: userId },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  );
}

// ── Helper: send token response ────────────
function sendToken(res, user, statusCode = 200) {
  const token = generateToken(user._id);
  res.status(statusCode).json({
    token,
    user: {
      id:        user._id,
      fullName:  user.fullName,
      email:     user.email,
      avatarUrl: user.avatarUrl,
      createdAt: user.createdAt,
    },
  });
}

// ── POST /api/auth/signup ─────────────────
// Register a new user with email + password
router.post('/signup', async (req, res) => {
  try {
    const { fullName, email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required.' });
    }
    if (password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters.' });
    }

    // Check if email already registered
    const existing = await User.findOne({ email: email.toLowerCase() });
    if (existing) {
      return res.status(400).json({ error: 'An account with this email already exists.' });
    }

    const user = await User.create({
      fullName: fullName || '',
      email:    email.toLowerCase(),
      password,
    });

    sendToken(res, user, 201);
  } catch (err) {
    console.error('[signup]', err.message);
    res.status(500).json({ error: 'Server error during signup.' });
  }
});

// ── POST /api/auth/signin ─────────────────
// Sign in with email + password
router.post('/signin', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required.' });
    }

    // Explicitly select password (hidden by default in schema)
    const user = await User.findOne({ email: email.toLowerCase() }).select('+password');

    if (!user || !user.password) {
      return res.status(401).json({ error: 'Invalid email or password.' });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid email or password.' });
    }

    sendToken(res, user);
  } catch (err) {
    console.error('[signin]', err.message);
    res.status(500).json({ error: 'Server error during signin.' });
  }
});

// ── GET /api/auth/google ──────────────────
// Redirect to Google consent screen
router.get('/google',
  passport.authenticate('google', {
    scope: ['profile', 'email'],
    session: false,
  })
);

// ── GET /api/auth/google/callback ─────────
// Google redirects here after authentication
router.get('/google/callback',
  passport.authenticate('google', {
    failureRedirect: `${process.env.CLIENT_URL}/auth?error=google_failed`,
    session: false,
  }),
  (req, res) => {
    // Generate JWT and redirect to frontend with token in URL
    const token = generateToken(req.user._id);
    res.redirect(`${process.env.CLIENT_URL}/auth/callback?token=${token}`);
  }
);

// ── GET /api/auth/me ──────────────────────
// Get current logged-in user (requires JWT)
router.get('/me', protect, (req, res) => {
  res.json({
    user: {
      id:        req.user._id,
      fullName:  req.user.fullName,
      email:     req.user.email,
      avatarUrl: req.user.avatarUrl,
      createdAt: req.user.createdAt,
    },
  });
});

module.exports = router;
