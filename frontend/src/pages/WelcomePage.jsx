// src/pages/WelcomePage.jsx

export default function WelcomePage({ onStart }) {
  return (
    <div className="page" style={{ justifyContent: 'center' }}>
      <div className="noise-overlay" />
      <div className="glow-blob" />

      <div style={{ textAlign: 'center', maxWidth: 480, position: 'relative', zIndex: 1 }}>
        <div className="label fade-up" style={{ marginBottom: 48 }}>MultiSkills</div>

        <h1 className="fade-up fade-up-delay-1" style={{
          fontSize: 'clamp(30px, 5vw, 52px)',
          fontWeight: 400,
          lineHeight: 1.15,
          color: 'var(--text)',
          marginBottom: 16,
          letterSpacing: '-0.02em',
        }}>
          What skills are<br />shaping your life?
        </h1>

        <p className="fade-up fade-up-delay-2" style={{
          color: 'var(--text-muted)',
          fontSize: 15,
          marginBottom: 56,
          letterSpacing: '0.02em',
        }}>
          Understand yourself through your abilities.
        </p>

        <button
          className="btn btn-ghost fade-up fade-up-delay-3"
          onClick={onStart}
          style={{ padding: '14px 48px', fontSize: 11 }}
        >
          Begin
        </button>

        {/* Category symbols */}
        <div className="fade-up fade-up-delay-4" style={{
          marginTop: 80,
          display: 'flex',
          justifyContent: 'center',
          gap: 40,
        }}>
          {[
            { icon: '◈', label: 'Money',     color: 'var(--money)' },
            { icon: '◎', label: 'Soul',      color: 'var(--soul)' },
            { icon: '◇', label: 'Curiosity', color: 'var(--curiosity)' },
          ].map(c => (
            <div key={c.label} style={{ textAlign: 'center', opacity: 0.45 }}>
              <div style={{ fontSize: 22, color: c.color, marginBottom: 6 }}>{c.icon}</div>
              <div className="label" style={{ fontSize: 9 }}>{c.label}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
