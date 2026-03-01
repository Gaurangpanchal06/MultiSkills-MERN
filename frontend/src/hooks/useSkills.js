// src/hooks/useSkills.js
// Skill CRUD using the Express REST API

import { useState, useEffect, useCallback } from 'react';
import { skillsAPI } from '../lib/api';
import { useAuth }   from '../context/AuthContext';

export function useSkills() {
  const { user } = useAuth();
  const [skills,  setSkills]  = useState([]);
  const [loading, setLoading] = useState(false);

  // ── Fetch all skills for user ─────────────
  const fetchSkills = useCallback(async () => {
    if (!user) { setSkills([]); return; }
    setLoading(true);
    try {
      const { skills } = await skillsAPI.getAll();
      setSkills(skills);
    } catch (err) {
      console.error('[useSkills] fetch error:', err.message);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => { fetchSkills(); }, [fetchSkills]);

  // ── Add skill ─────────────────────────────
  async function addSkill({ skillName, aiSuggestedCategory, finalCategory, aiReason }) {
    try {
      const { skill } = await skillsAPI.add({
        skillName,
        aiSuggestedCategory,
        finalCategory,
        aiReason,
      });
      setSkills(prev => [skill, ...prev]);
      return skill;
    } catch (err) {
      console.error('[useSkills] add error:', err.message);
      return null;
    }
  }

  // ── Delete skill ──────────────────────────
  async function deleteSkill(id) {
    try {
      await skillsAPI.delete(id);
      setSkills(prev => prev.filter(s => s._id !== id));
    } catch (err) {
      console.error('[useSkills] delete error:', err.message);
    }
  }

  // ── Filter by category ────────────────────
  function byCategory(cat) {
    return skills.filter(s => s.finalCategory === cat);
  }

  return { skills, loading, addSkill, deleteSkill, byCategory, refetch: fetchSkills };
}
