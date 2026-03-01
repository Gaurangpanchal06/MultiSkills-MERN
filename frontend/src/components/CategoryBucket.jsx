// src/components/CategoryBucket.jsx
// Clickable category row showing icon, name, desc, and count.

const CATS = {
  Money:     { icon: '◈', color: 'var(--money)',     desc: 'Income potential' },
  Soul:      { icon: '◎', color: 'var(--soul)',      desc: 'Peace & fulfillment' },
  Curiosity: { icon: '◇', color: 'var(--curiosity)', desc: 'Exploration & learning' },
};

export default function CategoryBucket({ name, count, onClick }) {
  const c = CATS[name];

  return (
    <div
      onClick={() => count > 0 && onClick(name)}
      style={{
        padding: '20px 0',
        borderBottom: '1px solid var(--border)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        cursor: count > 0 ? 'pointer' : 'default',
        transition: 'padding-left var(--transition)',
      }}
      onMouseEnter={e => count > 0 && (e.currentTarget.style.paddingLeft = '6px')}
      onMouseLeave={e => (e.currentTarget.style.paddingLeft = '0')}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
        <span style={{ fontSize: 18, color: c.color }}>{c.icon}</span>
        <div>
          <div style={{ fontSize: 16, color: 'var(--text)', letterSpacing: '0.01em' }}>{name}</div>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--text-dim)', marginTop: 2, letterSpacing: '0.1em' }}>{c.desc}</div>
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <span style={{
          fontSize: 22, fontWeight: 300,
          color: count > 0 ? c.color : 'var(--text-dim)',
          transition: 'color 0.3s',
          fontFamily: 'var(--font-display)',
        }}>
          {count}
        </span>
        {count > 0 && <span style={{ color: 'var(--text-dim)', fontSize: 16 }}>›</span>}
      </div>
    </div>
  );
}
