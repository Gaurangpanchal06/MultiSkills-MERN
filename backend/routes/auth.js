// routes/auth.js

const express    = require('express');
const jwt        = require('jsonwebtoken');
const crypto     = require('crypto');
const nodemailer = require('nodemailer');
const passport   = require('passport');
const User       = require('../models/User');
const protect    = require('../middleware/auth');

const router = express.Router();

// ── Helper: generate JWT ──────────────────
function generateToken(userId) {
  return jwt.sign(
    { id: userId },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  );
}

// ── Helper: send token response ───────────
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

// ── Helper: send email ────────────────────
async function sendEmail({ to, subject, html }) {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS, // Gmail App Password
    },
  });

  await transporter.sendMail({
    from: `"MultiSkills" <${process.env.EMAIL_USER}>`,
    to,
    subject,
    html,
  });
}

// ── POST /api/auth/signup ─────────────────
router.post('/signup', async (req, res) => {
  try {
    const { fullName, email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required.' });
    }
    if (password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters.' });
    }

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
router.post('/signin', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required.' });
    }

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

// ── POST /api/auth/forgot-password ────────
// Sends a password reset email
router.post('/forgot-password', async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ error: 'Email is required.' });
    }

    const user = await User.findOne({ email: email.toLowerCase() })
      .select('+resetPasswordToken +resetPasswordExpires');

    // Always return success even if email not found — security best practice
    // (don't reveal which emails are registered)
    if (!user) {
      return res.json({ message: 'If that email exists, a reset link has been sent.' });
    }

    // Google-only accounts have no password to reset
    if (user.googleId && !user.password) {
      return res.status(400).json({ error: 'This account uses Google Sign-In. No password to reset.' });
    }

    // Generate a secure random token
    const resetToken = crypto.randomBytes(32).toString('hex');

    // Save hashed version to DB (never store raw tokens)
    user.resetPasswordToken   = crypto.createHash('sha256').update(resetToken).digest('hex');
    user.resetPasswordExpires = Date.now() + 60 * 60 * 1000; // 1 hour
    await user.save({ validateBeforeSave: false });

    // Build reset URL — points to frontend
    const resetUrl = `${process.env.CLIENT_URL}/reset-password?token=${resetToken}`;

    try {
      await sendEmail({
        to:      user.email,
        subject: 'MultiSkills — Reset your password',
        html: `
          <div style="font-family: monospace; max-width: 480px; margin: 0 auto; padding: 40px; background: #0E0E0F; color: #E8E4DC;">
            <p style="font-size: 11px; letter-spacing: 0.2em; text-transform: uppercase; color: #787068; margin-bottom: 32px;">MultiSkills</p>
            <h2 style="font-weight: 400; font-size: 24px; margin-bottom: 16px; color: #F0EDE6;">Reset your password</h2>
            <p style="color: #B0AAA2; line-height: 1.7; margin-bottom: 32px;">
              You requested a password reset. Click the button below to set a new password.
              This link expires in 1 hour.
            </p>
            <a href="${resetUrl}"
               style="display: inline-block; background: #F0EDE6; color: #0E0E0F; padding: 14px 32px;
                      text-decoration: none; font-size: 11px; letter-spacing: 0.16em;
                      text-transform: uppercase; font-family: monospace;">
              Reset Password
            </a>
            <p style="color: #4a4540; font-size: 11px; margin-top: 32px; line-height: 1.6;">
              If you didn't request this, ignore this email. Your password won't change.
            </p>
          </div>
        `,
      });

      res.json({ message: 'If that email exists, a reset link has been sent.' });
    } catch (emailErr) {
      // If email fails, clear the token so user can try again
      user.resetPasswordToken   = undefined;
      user.resetPasswordExpires = undefined;
      await user.save({ validateBeforeSave: false });
      console.error('[forgot-password] Email error:', emailErr.message);
      res.status(500).json({ error: 'Failed to send email. Please try again.' });
    }
  } catch (err) {
    console.error('[forgot-password]', err.message);
    res.status(500).json({ error: 'Server error.' });
  }
});

// ── POST /api/auth/reset-password ─────────
// Sets a new password using the reset token
router.post('/reset-password', async (req, res) => {
  try {
    const { token, password } = req.body;

    if (!token || !password) {
      return res.status(400).json({ error: 'Token and new password are required.' });
    }
    if (password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters.' });
    }

    // Hash the incoming token and compare with stored hash
    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

    const user = await User.findOne({
      resetPasswordToken:   hashedToken,
      resetPasswordExpires: { $gt: Date.now() }, // not expired
    }).select('+resetPasswordToken +resetPasswordExpires');

    if (!user) {
      return res.status(400).json({ error: 'Reset link is invalid or has expired.' });
    }

    // Set new password — pre-save hook will hash it
    user.password             = password;
    user.resetPasswordToken   = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    res.json({ message: 'Password reset successful. You can now sign in.' });
  } catch (err) {
    console.error('[reset-password]', err.message);
    res.status(500).json({ error: 'Server error.' });
  }
});

// ── GET /api/auth/google ──────────────────
router.get('/google',
  passport.authenticate('google', { scope: ['profile', 'email'], session: false })
);

// ── GET /api/auth/google/callback ─────────
router.get('/google/callback',
  passport.authenticate('google', {
    failureRedirect: `${process.env.CLIENT_URL}/auth?error=google_failed`,
    session: false,
  }),
  (req, res) => {
    const token = generateToken(req.user._id);
    res.redirect(`${process.env.CLIENT_URL}/auth/callback?token=${token}`);
  }
);

// ── GET /api/auth/me ──────────────────────
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
