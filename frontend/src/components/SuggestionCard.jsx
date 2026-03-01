// src/components/SuggestionCard.jsx
// ─────────────────────────────────────────────
// Shows the AI classification result with
// Confirm / Change / Dismiss actions.
// ─────────────────────────────────────────────

import { useState } from 'react';
import OverrideModal from './OverrideModal';

const CATS = {
  Money:     { icon: '◈', color: 'var(--money)',     bg: 'var(--money-bg)',     border: 'var(--money-border)' },
  Soul:      { icon: '◎', color: 'var(--soul)',      bg: 'var(--soul-bg)',      border: 'var(--soul-border)' },
  Curiosity: { icon: '◇', color: 'var(--curiosity)', bg: 'var(--curiosity-bg)', border: 'var(--curiosity-border)' },
};

export default function SuggestionCard({ skillName, category, reason, onConfirm, onDismiss }) {
  const [showOverride, setShowOverride] = useState(false);
  const cat = CATS[category] || CATS.Curiosity;

  return (
    <>
      <div style={{
        padding: '28px',
        border: `1px solid ${cat.border}`,
        background: cat.bg,
        animation: 'fadeUp 0.35s ease both',
        marginBottom: 40,
      }}>
        {/* Label */}
        <div className="label" style={{ marginBottom: 20 }}>AI Suggestion</div>

        {/* Skill + Category */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
          <div>
            <div style={{ fontSize: 24, color: 'var(--text)', marginBottom: 8 }}>{skillName}</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ fontSize: 16, color: cat.color }}>{cat.icon}</span>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: '0.15em', color: cat.color }}>
                {category}
              </span>
            </div>
          </div>
        </div>

        {/* Reason */}
        <p style={{
          fontSize: 14, color: 'var(--text-mid)',
          fontStyle: 'italic', lineHeight: 1.7,
          marginBottom: 24,
          borderLeft: `2px solid ${cat.border}`,
          paddingLeft: 14,
        }}>
          "{reason}"
        </p>

        {/* Actions */}
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
          <button
            className="btn"
            onClick={() => onConfirm(category)}
            style={{ background: cat.color, color: '#0E0E0F', border: 'none' }}
          >
            Confirm
          </button>
          <button className="btn btn-ghost" onClick={() => setShowOverride(true)}>
            Change
          </button>
          <button
            onClick={onDismiss}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-dim)', fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '0.15em', textTransform: 'uppercase', padding: '12px 8px' }}
          >
            Dismiss
          </button>
        </div>
      </div>

      {showOverride && (
        <OverrideModal
          onSelect={(cat) => { onConfirm(cat); setShowOverride(false); }}
          onClose={() => setShowOverride(false)}
        />
      )}
    </>
  );
}
