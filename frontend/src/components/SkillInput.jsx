// src/components/SkillInput.jsx
// ─────────────────────────────────────────────
// Skill text input with Analyze button.
// Calls classifySkill and lifts result to parent.
// ─────────────────────────────────────────────

import { useState, useRef } from 'react';
import { classifySkill } from '../lib/classifySkill';

export default function SkillInput({ onResult }) {
  const [value,   setValue]   = useState('');
  const [loading, setLoading] = useState(false);
  const inputRef = useRef();

  async function handleAnalyze() {
    const skill = value.trim();
    if (!skill || loading) return;
    setLoading(true);
    const result = await classifySkill(skill);
    onResult({ skillName: skill, ...result });
    setValue('');
    setLoading(false);
    inputRef.current?.focus();
  }

  return (
    <div style={{ display: 'flex', alignItems: 'center', borderBottom: '1px solid var(--border-mid)' }}>
      <input
        ref={inputRef}
        className="input-line"
        style={{ borderBottom: 'none', flex: 1 }}
        value={value}
        onChange={e => setValue(e.target.value)}
        onKeyDown={e => e.key === 'Enter' && handleAnalyze()}
        placeholder="What skill is on your mind?"
        maxLength={80}
        autoFocus
      />
      <button
        className="btn"
        onClick={handleAnalyze}
        disabled={!value.trim() || loading}
        style={{
          padding: '14px 0 14px 20px',
          background: 'none',
          color: !value.trim() || loading ? 'var(--text-dim)' : 'var(--text)',
          border: 'none',
          flexShrink: 0,
        }}
      >
        {loading ? '···' : 'Analyze'}
      </button>
    </div>
  );
}
