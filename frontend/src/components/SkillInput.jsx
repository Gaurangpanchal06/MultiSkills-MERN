// src/components/SkillInput.jsx

import { useState, useRef } from 'react';
import { classifySkill, validateSkillInput } from '../lib/classifySkill';

export default function SkillInput({ onResult }) {
  const [value,        setValue]        = useState('');
  const [loading,      setLoading]      = useState(false);
  const [inputError,   setInputError]   = useState('');
  const inputRef = useRef();

  async function handleAnalyze() {
    const skill = value.trim();
    if (!skill || loading) return;

    setInputError('');

    // Step 1 — local validation (fast, no API call)
    const validationError = validateSkillInput(skill);
    if (validationError) {
      setInputError(validationError);
      return;
    }

    // Step 2 — AI classification
    setLoading(true);
    const result = await classifySkill(skill);
    setLoading(false);

    // AI returned an error (invalid skill detected)
    if (result.error) {
      setInputError(result.error);
      return;
    }

    onResult({ skillName: skill, ...result });
    setValue('');
    setInputError('');
    inputRef.current?.focus();
  }

  function handleChange(e) {
    setValue(e.target.value);
    if (inputError) setInputError(''); // clear error as user types
  }

  return (
    <div>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        borderBottom: `1px solid ${inputError ? 'rgba(220,90,90,0.5)' : 'var(--border-mid)'}`,
        transition: 'border-color var(--transition)',
      }}>
        <input
          ref={inputRef}
          className="input-line"
          style={{ borderBottom: 'none', flex: 1 }}
          value={value}
          onChange={handleChange}
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

      {/* Validation error */}
      {inputError && (
        <div style={{
          fontFamily: 'var(--font-mono)',
          fontSize: 10,
          color: '#e07070',
          letterSpacing: '0.1em',
          lineHeight: 1.6,
          marginTop: 10,
          display: 'flex',
          alignItems: 'flex-start',
          gap: 8,
        }}>
          <span style={{ flexShrink: 0 }}>⚠</span>
          <span>{inputError}</span>
        </div>
      )}
    </div>
  );
}
