// src/hooks/useSkills.js

import { useState, useEffect, useCallback } from 'react';
import { skillsAPI } from '../lib/api';
import { useAuth }   from '../context/AuthContext';

export function useSkills() {
  const { user } = useAuth();
  const [skills,  setSkills]  = useState([]);
  const [loading, setLoading] = useState(false);

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

  async function addSkill({ skillName, aiSuggestedCategory, finalCategory, aiReason }) {
    try {
      const { skill } = await skillsAPI.add({ skillName, aiSuggestedCategory, finalCategory, aiReason });
      setSkills(prev => [skill, ...prev]);
      return skill;
    } catch (err) {
      console.error('[useSkills] add error:', err.message);
      return null;
    }
  }

  async function updateNotes(id, notes) {
    try {
      const { skill } = await skillsAPI.updateNotes(id, notes);
      setSkills(prev => prev.map(s => s._id === id ? skill : s));
      return skill;
    } catch (err) {
      console.error('[useSkills] updateNotes error:', err.message);
      return null;
    }
  }

  async function deleteSkill(id) {
    try {
      await skillsAPI.delete(id);
      setSkills(prev => prev.filter(s => s._id !== id));
    } catch (err) {
      console.error('[useSkills] delete error:', err.message);
    }
  }

  function byCategory(cat) {
    return skills.filter(s => s.finalCategory === cat);
  }

  return { skills, loading, addSkill, updateNotes, deleteSkill, byCategory, refetch: fetchSkills };
}
