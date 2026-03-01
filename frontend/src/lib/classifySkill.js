// src/lib/classifySkill.js
// ─────────────────────────────────────────────
// Calls Anthropic API to classify a skill into
// Money | Soul | Curiosity
// ─────────────────────────────────────────────

const FALLBACK_REASONS = {
  Money:     'This skill has strong income potential in professional markets.',
  Soul:      'This skill nurtures creativity, peace, and personal fulfillment.',
  Curiosity: 'This skill invites exploration and continuous learning.',
};

// Skills that are clearly Money — tech, professional, business
const MONEY_KEYWORDS = [
  'java', 'python', 'javascript', 'typescript', 'react', 'angular', 'vue',
  'node', 'express', 'sql', 'mysql', 'postgres', 'mongodb', 'redis',
  'docker', 'kubernetes', 'git', 'linux', 'aws', 'azure', 'gcp',
  'flutter', 'swift', 'kotlin', 'ruby', 'php', 'spring', 'django',
  'laravel', 'tensorflow', 'pytorch', 'machine learning', 'deep learning',
  'data science', 'blockchain', 'cybersecurity', 'cloud', 'devops',
  'agile', 'scrum', 'excel', 'powerpoint', 'photoshop', 'figma',
  'illustrator', 'premiere', 'video edit', 'web dev', 'mobile dev',
  'marketing', 'seo', 'copywrite', 'content', 'social media',
  'accounting', 'finance', 'invest', 'trading', 'consulting',
  'management', 'project', 'sales', 'coding', 'programming',
  'engineering', 'architecture', 'analytics', 'tableau', 'c++', 'c#',
  '.net', 'ui', 'ux', 'design', 'develop', 'build', 'power bi',
];

// Skills that are clearly Soul — wellbeing, mindfulness, creative expression
const SOUL_KEYWORDS = [
  'meditat', 'yoga', 'mindful', 'breath', 'spiritual', 'prayer',
  'journaling', 'therapy', 'counseling', 'painting', 'drawing',
  'sketching', 'sculpt', 'pottery', 'knitting', 'sewing', 'singing',
  'dancing', 'cooking for', 'baking', 'gardening', 'gratitude',
  'compassion', 'empathy', 'emotional', 'self care', 'wellness',
];

export async function classifySkill(skillName) {
  try {
    const res = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 200,
        system: `You are a career and life skills classifier. Classify skills accurately.

CATEGORY DEFINITIONS:
- Money: Any technical skill, programming language, framework, professional tool, software, 
  business skill, or craft that people commonly get PAID for. This includes ALL programming 
  languages (Java, Python, JavaScript, etc.), frameworks, databases, design tools, marketing, 
  accounting, writing, consulting, teaching, engineering, medicine, law, finance, etc.
- Soul: Skills pursued primarily for inner peace, emotional wellbeing, spiritual growth, 
  creative self-expression or personal relationships. Examples: meditation, yoga, painting 
  for joy, journaling, prayer, gardening, cooking for family.
- Curiosity: Skills driven by intellectual exploration or learning something new purely out 
  of interest with no current income or emotional-wellness intent.

IMPORTANT RULES:
1. Any programming language or technology (Java, Python, C++, React, SQL, etc.) = Money
2. Any professional certification or business skill = Money
3. When in doubt between Money and Curiosity for a tech skill, always choose Money
4. Only classify as Soul if the skill is primarily about emotional or spiritual wellbeing

Respond ONLY with valid JSON, no markdown, no extra text:
{"category":"Money|Soul|Curiosity","reason":"one concise sentence under 20 words"}`,
        messages: [{ role: 'user', content: `Classify this skill: ${skillName}` }],
      }),
    });

    if (!res.ok) throw new Error(`API error ${res.status}`);

    const data = await res.json();
    const text = data.content?.map(b => b.text || '').join('') || '';
    const clean = text.replace(/```json|```/g, '').trim();
    const parsed = JSON.parse(clean);

    if (!['Money', 'Soul', 'Curiosity'].includes(parsed.category)) {
      throw new Error('Invalid category returned');
    }

    return { category: parsed.category, reason: parsed.reason };

  } catch (err) {
    console.warn('[classifySkill] Falling back to heuristic:', err.message);

    const lower = skillName.toLowerCase();
    let category = 'Curiosity';

    if (MONEY_KEYWORDS.some(kw => lower.includes(kw))) {
      category = 'Money';
    } else if (SOUL_KEYWORDS.some(kw => lower.includes(kw))) {
      category = 'Soul';
    }

    return { category, reason: FALLBACK_REASONS[category] };
  }
}
