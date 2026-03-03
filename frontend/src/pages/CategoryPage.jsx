// src/pages/CategoryPage.jsx

import { useState } from 'react';
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
          marginBottom: 40, padding: 0, transition: 'color var(--transition)',
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
                <div>
                  <span style={{ fontSize: 17, color: 'var(--text)' }}>{skill.skillName}</span>
                  {skill.notes && (
                    <div style={{
                      fontFamily: 'var(--font-mono)', fontSize: 9,
                      color: 'var(--text-muted)', letterSpacing: '0.08em',
                      marginTop: 4,
                    }}>
                      ✎ has notes
                    </div>
                  )}
                </div>
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
  const { updateNotes } = useSkills();

  const CATS_D = {
    Money:     { icon: '◈', color: 'var(--money)',     border: 'var(--money-border)' },
    Soul:      { icon: '◎', color: 'var(--soul)',      border: 'var(--soul-border)' },
    Curiosity: { icon: '◇', color: 'var(--curiosity)', border: 'var(--curiosity-border)' },
  };

  const c = CATS_D[skill.finalCategory] || CATS_D.Curiosity;

  // Notes state — edit mode toggle
  const [notes,       setNotes]       = useState(skill.notes || '');
  const [editingNotes, setEditingNotes] = useState(false);
  const [savingNotes,  setSavingNotes]  = useState(false);
  const [notesSaved,   setNotesSaved]   = useState(false);

  async function handleSaveNotes() {
    setSavingNotes(true);
    await updateNotes(skill._id, notes);
    setSavingNotes(false);
    setEditingNotes(false);
    setNotesSaved(true);
    setTimeout(() => setNotesSaved(false), 2000);
  }

  function handleCancelNotes() {
    setNotes(skill.notes || '');
    setEditingNotes(false);
  }

  return (
    <div className="page">
      <div className="noise-overlay" />
      <div className="page-inner fade-up">

        <button onClick={onBack} style={{
          background: 'none', border: 'none', cursor: 'pointer',
          fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '0.18em',
          textTransform: 'uppercase', color: 'var(--text-muted)',
          marginBottom: 40, padding: 0, transition: 'color var(--transition)',
        }}
          onMouseEnter={e => e.target.style.color = 'var(--text)'}
          onMouseLeave={e => e.target.style.color = 'var(--text-muted)'}
        >
          ← Back
        </button>

        {/* Skill header */}
        <div style={{ borderLeft: `2px solid ${c.color}`, paddingLeft: 28, marginBottom: 48 }}>
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
              fontStyle: 'italic', lineHeight: 1.8, marginBottom: 16,
            }}>
              "{skill.aiReason}"
            </p>
          )}

          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--text-dim)', letterSpacing: '0.1em' }}>
            {new Date(skill.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
          </div>
        </div>

        {/* ── Notes Section ─────────────────────── */}
        <div style={{ marginBottom: 48 }}>
          <div style={{
            display: 'flex', alignItems: 'center',
            justifyContent: 'space-between', marginBottom: 14,
          }}>
            <div className="label" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span>My Notes</span>
              {notesSaved && (
                <span style={{ color: 'var(--soul)', fontSize: 9, letterSpacing: '0.1em' }}>
                  ✓ Saved
                </span>
              )}
            </div>
            {!editingNotes && (
              <button
                onClick={() => setEditingNotes(true)}
                style={{
                  background: 'none', border: 'none', cursor: 'pointer',
                  fontFamily: 'var(--font-mono)', fontSize: 9,
                  letterSpacing: '0.15em', textTransform: 'uppercase',
                  color: 'var(--text-muted)', transition: 'color var(--transition)',
                  padding: 0,
                }}
                onMouseEnter={e => e.target.style.color = 'var(--text)'}
                onMouseLeave={e => e.target.style.color = 'var(--text-muted)'}
              >
                {notes ? 'Edit' : '+ Add note'}
              </button>
            )}
          </div>

          {editingNotes ? (
            // ── Edit mode ──────────────────────────
            <div>
              <textarea
                value={notes}
                onChange={e => setNotes(e.target.value)}
                maxLength={1000}
                autoFocus
                placeholder="Write your personal notes about this skill — goals, resources, progress..."
                style={{
                  width: '100%',
                  background: 'var(--bg-elevated)',
                  border: '1px solid var(--border-mid)',
                  outline: 'none',
                  color: 'var(--text)',
                  fontFamily: 'var(--font-display)',
                  fontSize: 15,
                  padding: '14px 16px',
                  lineHeight: 1.7,
                  resize: 'vertical',
                  minHeight: 120,
                  caretColor: c.color,
                  transition: 'border-color var(--transition)',
                  boxSizing: 'border-box',
                }}
                onFocus={e => e.target.style.borderColor = 'rgba(232,228,220,0.35)'}
                onBlur={e  => e.target.style.borderColor = 'var(--border-mid)'}
              />
              <div style={{
                display: 'flex', justifyContent: 'space-between',
                alignItems: 'center', marginTop: 10,
              }}>
                <span style={{
                  fontFamily: 'var(--font-mono)', fontSize: 9,
                  color: notes.length > 900 ? '#e07070' : 'var(--text-dim)',
                  letterSpacing: '0.1em',
                }}>
                  {notes.length} / 1000
                </span>
                <div style={{ display: 'flex', gap: 10 }}>
                  <button
                    onClick={handleCancelNotes}
                    className="btn btn-ghost"
                    style={{ padding: '10px 20px', fontSize: 10 }}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSaveNotes}
                    disabled={savingNotes}
                    className="btn btn-primary"
                    style={{ padding: '10px 20px', fontSize: 10 }}
                  >
                    {savingNotes ? '···' : 'Save'}
                  </button>
                </div>
              </div>
            </div>
          ) : (
            // ── View mode ──────────────────────────
            notes ? (
              <p style={{
                fontSize: 15, color: 'var(--text-mid)',
                lineHeight: 1.8, whiteSpace: 'pre-wrap',
              }}>
                {notes}
              </p>
            ) : (
              <p style={{
                fontSize: 14, color: 'var(--text-dim)',
                fontStyle: 'italic', lineHeight: 1.7,
              }}>
                No notes yet. Click "+ Add note" to write something.
              </p>
            )
          )}
        </div>

        {/* Delete */}
        <div style={{ marginTop: 8 }}>
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
