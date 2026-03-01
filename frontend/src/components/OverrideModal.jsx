// src/components/OverrideModal.jsx

const CATS = [
  { name: 'Money',     icon: '◈', color: 'var(--money)',     bg: 'var(--money-bg)',     border: 'var(--money-border)',     desc: 'Skills with income potential' },
  { name: 'Soul',      icon: '◎', color: 'var(--soul)',      bg: 'var(--soul-bg)',      border: 'var(--soul-border)',      desc: 'Peace, fulfillment, creativity' },
  { name: 'Curiosity', icon: '◇', color: 'var(--curiosity)', bg: 'var(--curiosity-bg)', border: 'var(--curiosity-border)', desc: 'Exploration & learning' },
];

export default function OverrideModal({ onSelect, onClose }) {
  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-box" onClick={e => e.stopPropagation()}>
        <div className="label" style={{ marginBottom: 28 }}>Choose Category</div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 32 }}>
          {CATS.map(c => (
            <button
              key={c.name}
              onClick={() => onSelect(c.name)}
              style={{
                background: 'none',
                border: `1px solid ${c.border}`,
                color: 'var(--text)',
                padding: '16px 20px',
                textAlign: 'left',
                cursor: 'pointer',
                fontFamily: 'var(--font-display)',
                display: 'flex',
                alignItems: 'center',
                gap: 14,
                transition: 'background var(--transition)',
              }}
              onMouseEnter={e => e.currentTarget.style.background = c.bg}
              onMouseLeave={e => e.currentTarget.style.background = 'none'}
            >
              <span style={{ fontSize: 18, color: c.color, flexShrink: 0 }}>{c.icon}</span>
              <div>
                <div style={{ fontSize: 16, marginBottom: 2 }}>{c.name}</div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--text-muted)', letterSpacing: '0.1em' }}>{c.desc}</div>
              </div>
            </button>
          ))}
        </div>

        <button onClick={onClose} className="btn" style={{ background: 'none', border: 'none', color: 'var(--text-muted)', padding: '8px 0' }}>
          Cancel
        </button>
      </div>
    </div>
  );
}
