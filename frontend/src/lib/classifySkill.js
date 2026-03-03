// src/lib/classifySkill.js
// Validates input, then calls Anthropic API to classify skill.

const FALLBACK_REASONS = {
  Money:     'This skill has strong income potential in professional markets.',
  Soul:      'This skill nurtures creativity, peace, and personal fulfillment.',
  Curiosity: 'This skill invites exploration and continuous learning.',
};

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
  'engineering', 'analytics', 'tableau', 'c++', 'c#', '.net',
  'ui', 'ux', 'design', 'develop', 'build', 'power bi',
];

const SOUL_KEYWORDS = [
  'meditat', 'yoga', 'mindful', 'breath', 'spiritual', 'prayer',
  'journaling', 'therapy', 'counseling', 'painting', 'drawing',
  'sketching', 'sculpt', 'pottery', 'knitting', 'sewing', 'singing',
  'dancing', 'cooking', 'baking', 'gardening', 'gratitude',
  'compassion', 'empathy', 'emotional', 'self care', 'wellness',
];

// ── Input validation ──────────────────────
// Returns an error string if input looks like gibberish/invalid,
// or null if the input is acceptable.
export function validateSkillInput(skillName) {
  const trimmed = skillName.trim();

  // Too short
  if (trimmed.length < 2) {
    return 'Please enter a skill name (at least 2 characters).';
  }

  // Too long
  if (trimmed.length > 80) {
    return 'Skill name is too long. Keep it under 80 characters.';
  }

  // Only numbers
  if (/^\d+$/.test(trimmed)) {
    return 'That doesn\'t look like a skill. Please enter a real skill name.';
  }

  // Only special characters / no letters at all
  if (!/[a-zA-Z]/.test(trimmed)) {
    return 'Please enter a valid skill name using letters.';
  }

  // Gibberish detection — checks for:
  // 1. Consonant clusters too long to be real words (e.g. "sfkjhds")
  // 2. Too many repeated characters (e.g. "aaaaaaa")
  // 3. Very low vowel ratio (real words have ~30%+ vowels)

  const lower = trimmed.toLowerCase().replace(/[^a-z]/g, '');

  if (lower.length >= 4) {
    // Check vowel ratio — real skills usually have at least 20% vowels
    const vowels = (lower.match(/[aeiou]/g) || []).length;
    const vowelRatio = vowels / lower.length;
    if (vowelRatio < 0.10 && lower.length > 5) {
      return 'That doesn\'t look like a real skill. Please check the spelling and try again.';
    }

    // Check for long consonant runs (6+ consonants in a row = gibberish)
    if (/[^aeiou]{6,}/.test(lower)) {
      return 'That doesn\'t look like a real skill. Please check the spelling and try again.';
    }

    // Check for repeated characters (e.g. "aaaaaaa", "hahaha")
    if (/(.)\1{3,}/.test(lower)) {
      return 'That doesn\'t look like a real skill. Please enter a valid skill name.';
    }

    // Check for keyboard mashing patterns (all from same keyboard row)
    const qwertyRow = 'qwertyuiop';
    const asdfRow   = 'asdfghjkl';
    const zxcvRow   = 'zxcvbnm';
    const isAllSameRow = (str) =>
      str.split('').every(c => qwertyRow.includes(c)) ||
      str.split('').every(c => asdfRow.includes(c)) ||
      str.split('').every(c => zxcvRow.includes(c));

    if (lower.length >= 5 && isAllSameRow(lower)) {
      return 'That looks like keyboard mashing. Please enter a real skill.';
    }
  }

  return null; // valid
}

// ── Main classification function ──────────
export async function classifySkill(skillName) {
  try {
    const res = await fetch('https://api.anthropic.com/v1/messages', {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model:      'claude-sonnet-4-20250514',
        max_tokens: 200,
        system: `You are a career and life skills classifier. Classify skills accurately.

CATEGORY DEFINITIONS:
- Money: Any technical skill, programming language, framework, professional tool, software,
  business skill, or craft that people commonly get PAID for. This includes ALL programming
  languages, frameworks, databases, design tools, marketing, accounting, writing, consulting,
  teaching, engineering, medicine, law, finance, etc.
- Soul: Skills pursued primarily for inner peace, emotional wellbeing, spiritual growth,
  creative self-expression or personal relationships. Examples: meditation, yoga, painting
  for joy, journaling, prayer, gardening, cooking for family.
- Curiosity: Skills driven by intellectual exploration or learning something new purely out
  of interest with no current income or emotional-wellness intent.

IMPORTANT RULES:
1. Any programming language or technology = Money
2. Any professional certification or business skill = Money
3. When in doubt between Money and Curiosity for a tech skill, always choose Money
4. Only classify as Soul if the skill is primarily about emotional or spiritual wellbeing
5. If the input is NOT a real skill (random letters, gibberish, nonsense), return:
   {"category":"invalid","reason":"Not a recognizable skill"}

Respond ONLY with valid JSON, no markdown:
{"category":"Money|Soul|Curiosity|invalid","reason":"one concise sentence under 20 words"}`,
        messages: [{ role: 'user', content: `Classify this skill: ${skillName}` }],
      }),
    });

    if (!res.ok) throw new Error(`API error ${res.status}`);

    const data   = await res.json();
    const text   = data.content?.map(b => b.text || '').join('') || '';
    const clean  = text.replace(/```json|```/g, '').trim();
    const parsed = JSON.parse(clean);

    // AI flagged it as not a real skill
    if (parsed.category === 'invalid') {
      return { error: 'That doesn\'t appear to be a real skill. Please check the spelling and try again.' };
    }

    if (!['Money', 'Soul', 'Curiosity'].includes(parsed.category)) {
      throw new Error('Invalid category returned');
    }

    return { category: parsed.category, reason: parsed.reason };

  } catch (err) {
    console.warn('[classifySkill] Falling back to heuristic:', err.message);

    const lower    = skillName.toLowerCase();
    let category   = 'Curiosity';

    if (MONEY_KEYWORDS.some(kw => lower.includes(kw))) category = 'Money';
    else if (SOUL_KEYWORDS.some(kw => lower.includes(kw))) category = 'Soul';

    return { category, reason: FALLBACK_REASONS[category] };
  }
}
