// routes/skills.js
// Skills CRUD — all routes require JWT auth

const express = require('express');
const Skill   = require('../models/Skill');
const protect = require('../middleware/auth');

const router = express.Router();

// All skill routes are protected
router.use(protect);

// ── GET /api/skills ───────────────────────
// Get all skills for the logged-in user
router.get('/', async (req, res) => {
  try {
    const skills = await Skill.find({ userId: req.user._id })
      .sort({ createdAt: -1 }); // newest first
    res.json({ skills });
  } catch (err) {
    console.error('[GET /skills]', err.message);
    res.status(500).json({ error: 'Failed to fetch skills.' });
  }
});

// ── POST /api/skills ──────────────────────
// Add a new skill
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
    });

    res.status(201).json({ skill });
  } catch (err) {
    console.error('[POST /skills]', err.message);
    res.status(500).json({ error: 'Failed to add skill.' });
  }
});

// ── DELETE /api/skills/:id ────────────────
// Delete a skill (only if it belongs to the user)
router.delete('/:id', async (req, res) => {
  try {
    const skill = await Skill.findOne({
      _id:    req.params.id,
      userId: req.user._id, // Security: ensure user owns this skill
    });

    if (!skill) {
      return res.status(404).json({ error: 'Skill not found.' });
    }

    await skill.deleteOne();
    res.json({ message: 'Skill deleted.' });
  } catch (err) {
    console.error('[DELETE /skills]', err.message);
    res.status(500).json({ error: 'Failed to delete skill.' });
  }
});

module.exports = router;
