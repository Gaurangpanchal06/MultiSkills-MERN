// models/Skill.js — Mongoose schema for skills

const mongoose = require('mongoose');

const SkillSchema = new mongoose.Schema(
  {
    userId: {
      type:     mongoose.Schema.Types.ObjectId,
      ref:      'User',
      required: true,
      index:    true, // Fast lookup by user
    },
    skillName: {
      type:     String,
      required: true,
      trim:     true,
    },
    aiSuggestedCategory: {
      type: String,
      enum: ['Money', 'Soul', 'Curiosity'],
    },
    finalCategory: {
      type:     String,
      required: true,
      enum:     ['Money', 'Soul', 'Curiosity'],
    },
    aiReason: {
      type:    String,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Skill', SkillSchema);
