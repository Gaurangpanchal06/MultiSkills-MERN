// models/User.js — Mongoose schema for users

const mongoose = require('mongoose');
const bcrypt   = require('bcryptjs');

const UserSchema = new mongoose.Schema(
  {
    fullName: {
      type:    String,
      trim:    true,
      default: '',
    },
    email: {
      type:      String,
      required:  true,
      unique:    true,
      lowercase: true,
      trim:      true,
    },
    password: {
      type:   String,
      select: false, // Never return password in queries by default
    },
    googleId: {
      type:   String,
      sparse: true,
    },
    avatarUrl: {
      type:    String,
      default: '',
    },
    // ── Password reset fields ─────────────────
    resetPasswordToken: {
      type:   String,
      select: false,
    },
    resetPasswordExpires: {
      type:   Date,
      select: false,
    },
  },
  {
    timestamps: true,
  }
);

// Hash password before saving
UserSchema.pre('save', async function (next) {
  if (!this.isModified('password') || !this.password) return next();
  const salt    = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

UserSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', UserSchema);
