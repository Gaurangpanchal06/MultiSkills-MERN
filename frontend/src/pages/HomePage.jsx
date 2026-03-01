// src/pages/HomePage.jsx

import { useState } from 'react';
import SkillInput from '../components/SkillInput';
import SuggestionCard from '../components/SuggestionCard';
import CategoryBucket from '../components/CategoryBucket';
import { useSkills } from '../hooks/useSkills';
import { useAuth } from '../context/AuthContext';

export default function HomePage({ onViewCategory }) {
  const { displayName } = useAuth();
  const { skills, addSkill, byCategory } = useSkills();

  const [pending, setPending] = useState(null);
  // pending = { skillName, category, reason }

  async function handleResult(result) {
    setPending(result);
  }

  async function handleConfirm(finalCategory) {
    if (!pending) return;
    await addSkill({
      skillName:            pending.skillName,
      aiSuggestedCategory:  pending.category,
      finalCategory,
      aiReason:             pending.reason,
    });
    setPending(null);
  }

  return (
    <div className="page">
      <div className="noise-overlay" />
      <div className="glow-blob" />

      <div className="page-inner">
        {/* Greeting */}
        <div className="fade-up" style={{ marginBottom: 48, paddingTop: 12 }}>
          <p style={{ fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--text-dim)', marginBottom: 6 }}>
            Welcome back
          </p>
          <h1 style={{ fontSize: 28, fontWeight: 400, color: 'var(--text)' }}>
            {displayName}
          </h1>
        </div>

        {/* Input */}
        <div className="fade-up fade-up-delay-1" style={{ marginBottom: pending ? 0 : 48 }}>
          <SkillInput onResult={handleResult} />
        </div>

        {/* AI Suggestion */}
        {pending && (
          <div style={{ marginTop: 24 }}>
            <SuggestionCard
              skillName={pending.skillName}
              category={pending.category}
              reason={pending.reason}
              onConfirm={handleConfirm}
              onDismiss={() => setPending(null)}
            />
          </div>
        )}

        {/* Category Buckets */}
        <div className="fade-up fade-up-delay-2">
          {['Money', 'Soul', 'Curiosity'].map(cat => (
            <CategoryBucket
              key={cat}
              name={cat}
              count={byCategory(cat).length}
              onClick={onViewCategory}
            />
          ))}
        </div>

        {/* Footer */}
        <div style={{ marginTop: 40, fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--text-dim)', letterSpacing: '0.15em', textAlign: 'center' }}>
          {skills.length} skill{skills.length !== 1 ? 's' : ''} mapped
        </div>
      </div>
    </div>
  );
}
