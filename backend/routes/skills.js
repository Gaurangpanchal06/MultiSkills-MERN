// routes/skills.js
// Skills CRUD — all routes require JWT auth

const express = require('express');
const Skill   = require('../models/Skill');
const protect = require('../middleware/auth');

const router = express.Router();
router.use(protect);

// ── GET /api/skills ───────────────────────
router.get('/', async (req, res) => {
  try {
    const skills = await Skill.find({ userId: req.user._id })
      .sort({ createdAt: -1 });
    res.json({ skills });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch skills.' });
  }
});

// ── POST /api/skills ──────────────────────
router.post('/', async (req, res) => {
  try {
    const { skillName, aiSuggestedCategory, finalCategory, aiReason } = req.body;

    if (!skillName || !finalCategory) {
      return res.status(400).json({ error: 'skillName and finalCategory are required.' });
    }
    if (!['Money', 'Soul', 'Curiosity'].includes(finalCategory)) {
      return res.status(400).json({ error: 'finalCategory must be Money, Soul, or Curiosity.' });
    }

    const skill = await Skill.create({
      userId:              req.user._id,
      skillName:           skillName.trim(),
      aiSuggestedCategory: aiSuggestedCategory || finalCategory,
      finalCategory,
      aiReason:            aiReason || '',
      notes:               '',
    });

    res.status(201).json({ skill });
  } catch (err) {
    res.status(500).json({ error: 'Failed to add skill.' });
  }
});

// ── PUT /api/skills/:id/notes ─────────────
// Update the user's personal notes on a skill
router.put('/:id/notes', async (req, res) => {
  try {
    const { notes } = req.body;

    if (typeof notes !== 'string') {
      return res.status(400).json({ error: 'notes must be a string.' });
    }
    if (notes.length > 1000) {
      return res.status(400).json({ error: 'Notes cannot exceed 1000 characters.' });
    }

    const skill = await Skill.findOneAndUpdate(
      { _id: req.params.id, userId: req.user._id },
      { notes: notes.trim() },
      { new: true } // return updated document
    );

    if (!skill) {
      return res.status(404).json({ error: 'Skill not found.' });
    }

    res.json({ skill });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update notes.' });
  }
});

// ── DELETE /api/skills/:id ────────────────
router.delete('/:id', async (req, res) => {
  try {
    const skill = await Skill.findOne({ _id: req.params.id, userId: req.user._id });
    if (!skill) return res.status(404).json({ error: 'Skill not found.' });
    await skill.deleteOne();
    res.json({ message: 'Skill deleted.' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete skill.' });
  }
});

module.exports = router;
