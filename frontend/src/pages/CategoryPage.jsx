// src/pages/CategoryPage.jsx

import { useSkills } from '../hooks/useSkills';

const CATS = {
  Money:     { icon: '◈', color: 'var(--money)',     bg: 'var(--money-bg)',     border: 'var(--money-border)',     desc: 'Skills with income potential' },
  Soul:      { icon: '◎', color: 'var(--soul)',      bg: 'var(--soul-bg)',      border: 'var(--soul-border)',      desc: 'Peace, fulfillment, creativity' },
  Curiosity: { icon: '◇', color: 'var(--curiosity)', bg: 'var(--curiosity-bg)', border: 'var(--curiosity-border)', desc: 'Exploration & learning' },
};

export function CategoryPage({ category, onBack, onSelectSkill }) {
  const { byCategory } = useSkills();
  const skills = byCategory(category);
  const c = CATS[category];

  return (
    <div className="page">
      <div className="noise-overlay" />
      <div className="page-inner fade-up">

        <button onClick={onBack} style={{
          background: 'none', border: 'none', cursor: 'pointer',
          fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '0.18em',
          textTransform: 'uppercase', color: 'var(--text-muted)',
          marginBottom: 40, padding: 0,
          transition: 'color var(--transition)',
        }}
          onMouseEnter={e => e.target.style.color = 'var(--text)'}
          onMouseLeave={e => e.target.style.color = 'var(--text-muted)'}
        >
          ← Back
        </button>

        <div style={{ marginBottom: 40 }}>
          <div style={{ fontSize: 26, color: c.color, marginBottom: 10 }}>{c.icon}</div>
          <h2 style={{ fontSize: 34, fontWeight: 400, color: 'var(--text)', marginBottom: 6 }}>{category}</h2>
          <p style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--text-muted)', letterSpacing: '0.1em' }}>{c.desc}</p>
        </div>

        {skills.length === 0 ? (
          <p style={{ fontStyle: 'italic', color: 'var(--text-dim)', fontSize: 15 }}>
            No skills here yet. Add your first one.
          </p>
        ) : (
          <div>
            {skills.map(skill => (
              <div
                key={skill._id}
                onClick={() => onSelectSkill(skill)}
                style={{
                  padding: '16px 0 16px 20px',
                  borderLeft: `1px solid ${c.border}`,
                  marginBottom: 4,
                  cursor: 'pointer',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  transition: 'all var(--transition)',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.background = c.bg;
                  e.currentTarget.style.borderLeftColor = c.color;
                  e.currentTarget.style.paddingLeft = '24px';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.background = 'transparent';
                  e.currentTarget.style.borderLeftColor = c.border;
                  e.currentTarget.style.paddingLeft = '20px';
                }}
              >
                <span style={{ fontSize: 17, color: 'var(--text)' }}>{skill.skillName}</span>
                <span style={{ color: 'var(--text-dim)', fontSize: 18 }}>›</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}


export function SkillDetailPage({ skill, onBack, onDelete }) {
  const CATS_D = {
    Money:     { icon: '◈', color: 'var(--money)',     border: 'var(--money-border)' },
    Soul:      { icon: '◎', color: 'var(--soul)',      border: 'var(--soul-border)' },
    Curiosity: { icon: '◇', color: 'var(--curiosity)', border: 'var(--curiosity-border)' },
  };

  const c = CATS_D[skill.finalCategory] || CATS_D.Curiosity;

  return (
    <div className="page">
      <div className="noise-overlay" />
      <div className="page-inner fade-up">

        <button onClick={onBack} style={{
          background: 'none', border: 'none', cursor: 'pointer',
          fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '0.18em',
          textTransform: 'uppercase', color: 'var(--text-muted)',
          marginBottom: 40, padding: 0,
          transition: 'color var(--transition)',
        }}
          onMouseEnter={e => e.target.style.color = 'var(--text)'}
          onMouseLeave={e => e.target.style.color = 'var(--text-muted)'}
        >
          ← Back
        </button>

        <div style={{ borderLeft: `2px solid ${c.color}`, paddingLeft: 28 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
            <span style={{ color: c.color, fontSize: 14 }}>{c.icon}</span>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '0.18em', color: c.color, textTransform: 'uppercase' }}>
              {skill.finalCategory}
            </span>
            {skill.aiSuggestedCategory !== skill.finalCategory && (
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--text-dim)', letterSpacing: '0.1em' }}>
                (AI suggested: {skill.aiSuggestedCategory})
              </span>
            )}
          </div>

          <h2 style={{ fontSize: 36, fontWeight: 400, color: 'var(--text)', marginBottom: 24, letterSpacing: '-0.01em' }}>
            {skill.skillName}
          </h2>

          {skill.aiReason && (
            <p style={{
              fontSize: 15, color: 'var(--text-mid)',
              fontStyle: 'italic', lineHeight: 1.8,
              marginBottom: 28,
            }}>
              "{skill.aiReason}"
            </p>
          )}

          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--text-dim)', letterSpacing: '0.1em' }}>
            {new Date(skill.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
          </div>
        </div>

        <div style={{ marginTop: 48 }}>
          <button
            className="btn btn-danger"
            onClick={() => onDelete(skill._id)}
          >
            Delete Skill
          </button>
        </div>
      </div>
    </div>
  );
}
