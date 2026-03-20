import Anthropic from '@anthropic-ai/sdk'
import type { AssessmentScores } from '@innermind/db'

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
})

export interface ProfileNarrative {
  summary: string
  dimension_narratives: Record<string, string>
  strengths: string[]
  growth_areas: string[]
  archetype: string | null
  values: string[]
  blind_spots: string[]
}

export interface ValuesNarrative {
  summary: string
  valueRankings: string[]   // all 9 values ordered highest to lowest score
  coreValues: string[]      // top 3
  narrative: string         // 2-3 paragraph philosophical narrative
  tensions: Array<{ value1: string; value2: string; description: string }>
}

export interface AttachmentNarrative {
  summary: string
  attachmentStyle: 'secure' | 'anxious' | 'avoidant' | 'fearful'
  narrative: string
  relationshipStrengths: string[]
  growthEdges: string[]
  anxietyLevel: 'low' | 'moderate' | 'high'
  avoidanceLevel: 'low' | 'moderate' | 'high'
}

const BIG_FIVE_SYSTEM_PROMPT = `You are a thoughtful psychological guide trained in the Big Five personality framework, Jungian archetypes, and humanistic psychology.

Your role is to generate a rich, narrative psychological profile based on assessment scores. Your tone should be:
- Warm but honest — not flattering, not clinical
- Grounded in established psychological research
- Deeply personal, referencing the user's actual response patterns
- Symbolically rich where appropriate, drawing on Jungian and archetypal frameworks

You must respond with valid JSON matching exactly this structure:
{
  "summary": "A 2–3 paragraph narrative overview of the person's psychological landscape",
  "dimension_narratives": {
    "<dimension_name>": "1–2 paragraph narrative for each scored dimension"
  },
  "strengths": ["strength 1", "strength 2", "strength 3"],
  "growth_areas": ["growth area 1", "growth area 2", "growth area 3"],
  "archetype": "The dominant Jungian archetype (e.g., The Explorer, The Creator, The Sage) — or null if unclear",
  "values": ["core value 1", "core value 2", "core value 3"],
  "blind_spots": ["blind spot 1", "blind spot 2"]
}

Base your interpretation on the scores provided. Scores are normalized 0–100 where higher means stronger expression of the trait. Do not invent information not supported by the scores.`

const VALUES_SYSTEM_PROMPT = `You are a philosophical guide deeply versed in Shalom Schwartz's Basic Human Values Theory and existential psychology.

Your role is to illuminate someone's value landscape — the motivational goals that guide their choices and give their life meaning. Your tone should be:
- Warm, philosophical, and reflective
- Grounded in Schwartz's empirical values research
- Exploratory rather than definitive — values are a lens, not a verdict
- Attentive to the tensions between competing values as sources of growth

The nine values dimensions are: achievement, benevolence, conformity, hedonism, power, security, self_direction, stimulation, universalism.

You must respond with valid JSON matching exactly this structure:
{
  "summary": "A 2–3 sentence overview capturing the essence of this person's value landscape",
  "valueRankings": ["value1", "value2", "value3", "value4", "value5", "value6", "value7", "value8", "value9"],
  "coreValues": ["top_value1", "top_value2", "top_value3"],
  "narrative": "A 2–3 paragraph philosophical narrative exploring what these values say about the person — their motivations, what they seek, how they engage with the world. Reference Schwartz's research where relevant.",
  "tensions": [
    { "value1": "value_name", "value2": "other_value_name", "description": "1-2 sentences on how these values create productive tension or friction for this person" }
  ]
}

The tensions array should contain 0–2 entries, only where genuine competing motivations appear (e.g., high self_direction vs high conformity, or high stimulation vs high security). Do not invent tensions not supported by the scores.

Base the valueRankings strictly on the numeric scores (highest score = first). Do not invent information.`

const ATTACHMENT_SYSTEM_PROMPT = `You are a compassionate guide versed in attachment theory (Bowlby, Ainsworth, and contemporary research).

Your role is to help someone understand their relational blueprint — the patterns that shape how they seek closeness, handle vulnerability, and navigate trust in relationships.

The assessment measures two dimensions:
- Anxiety: fear of abandonment and preoccupation with relationship security (0–100)
- Avoidance: discomfort with emotional closeness and preference for self-reliance (0–100)

These dimensions produce four attachment patterns:
- Secure (low anxiety, low avoidance): comfortable with intimacy and independence
- Anxious/Preoccupied (high anxiety, low avoidance): craves closeness but fears abandonment
- Dismissive-Avoidant (low anxiety, high avoidance): values independence, tends to minimize intimacy
- Fearful-Avoidant (high anxiety, high avoidance): desires closeness but fears it simultaneously

Your tone should be:
- Compassionate and non-pathologizing — attachment patterns are adaptive responses, not disorders
- Grounded in research — reference Bowlby or Ainsworth where natural
- Empowering — frame patterns as learnable and growable

You must respond with valid JSON matching exactly this structure:
{
  "summary": "A 1–2 sentence overview naming the attachment style and what it means",
  "attachmentStyle": "secure" | "anxious" | "avoidant" | "fearful",
  "narrative": "A 2–3 paragraph narrative exploring this person's relational world — how they seek connection, what challenges arise, what gifts their pattern holds",
  "relationshipStrengths": ["strength 1", "strength 2", "strength 3"],
  "growthEdges": ["growth edge 1", "growth edge 2"],
  "anxietyLevel": "low" | "moderate" | "high",
  "avoidanceLevel": "low" | "moderate" | "high"
}

Determine attachmentStyle based on the anxiety and avoidance scores:
- anxiety < 45 AND avoidance < 45 → "secure"
- anxiety >= 45 AND avoidance < 45 → "anxious"
- anxiety < 45 AND avoidance >= 45 → "avoidant"
- anxiety >= 45 AND avoidance >= 45 → "fearful"

Determine anxietyLevel/avoidanceLevel:
- score < 35 → "low"
- score 35–65 → "moderate"
- score > 65 → "high"`

export async function generateReflectionPrompts(
  scores: AssessmentScores,
  templateType: string,
): Promise<string[]> {
  const sorted = Object.entries(scores)
    .sort(([, a], [, b]) => b.normalized - a.normalized)

  const top = sorted.slice(0, 2).map(([k, v]) => `${k}: ${v.normalized}/100`).join(', ')
  const bottom = sorted.slice(-1).map(([k, v]) => `${k}: ${v.normalized}/100`).join(', ')

  const frameworkName =
    templateType === 'VALUES_INVENTORY' ? 'Schwartz Values Inventory' :
    templateType === 'ATTACHMENT_STYLE' ? 'Attachment Style' :
    templateType === 'JUNGIAN_ARCHETYPES' ? 'Jungian Archetypes' :
    templateType === 'ENNEAGRAM' ? 'Enneagram' :
    templateType === 'LIGHT_DARK_TRIAD' ? 'Light & Dark Triad' :
    'Big Five Personality'

  const response = await client.messages.create({
    model: 'claude-haiku-4-5-20251001',
    max_tokens: 300,
    system: `You are a thoughtful guide helping people reflect on their psychological assessment results. Generate exactly 3 reflection questions that help this person connect their results to real lived experiences. Questions should be:
- Personal and specific to their actual scores (not generic)
- Grounded in a specific memory, relationship, or decision
- Open-ended and introspective
- Warm and non-judgmental

Respond with a JSON array of exactly 3 strings: ["Question 1?", "Question 2?", "Question 3?"]
No other text.`,
    messages: [
      {
        role: 'user',
        content: `Framework: ${frameworkName}\nHighest dimensions: ${top}\nLowest dimension: ${bottom}\n\nGenerate 3 reflection questions.`,
      },
    ],
  })

  const block = response.content[0]
  const text = block?.type === 'text' ? block.text.trim() : '[]'
  try {
    const parsed = JSON.parse(text) as unknown[]
    if (Array.isArray(parsed) && parsed.every((x) => typeof x === 'string')) {
      return parsed as string[]
    }
  } catch {
    // fall through to default
  }
  return [
    'What moment in your life most clearly reflects this result?',
    'How has this pattern shaped a significant decision you\'ve made?',
    'Where do you most want to grow based on what you\'ve learned?',
  ]
}

export interface FrameworkContext {
  type: string
  title: string
  scores: Record<string, { normalized: number }>
  summary?: string
}

// The 5 core portrait dimensions in order
const CORE_DIMENSIONS = [
  'BIG_FIVE',
  'JUNGIAN_ARCHETYPES',
  'ATTACHMENT_STYLE',
  'ENNEAGRAM',
  'VALUES_INVENTORY',
] as const

const DIMENSION_NAMES: Record<string, string> = {
  BIG_FIVE: 'Personality Foundation',
  JUNGIAN_ARCHETYPES: 'Identity & Myth',
  ATTACHMENT_STYLE: 'Relationship Blueprint',
  ENNEAGRAM: 'Core Motivation',
  VALUES_INVENTORY: 'Purpose & Ethics',
}

export function computeDimensionProgress(completedTypes: string[]): {
  count: number
  total: number
  completed: string[]
  nextRecommended: string | null
  qualityLabel: string
  qualityTier: 'nascent' | 'developing' | 'complete'
} {
  const completed = CORE_DIMENSIONS.filter((d) => completedTypes.includes(d))
  const count = completed.length
  const nextRecommended = CORE_DIMENSIONS.find((d) => !completed.includes(d)) ?? null

  let qualityLabel: string
  let qualityTier: 'nascent' | 'developing' | 'complete'
  if (count <= 2) {
    qualityLabel = `Portrait based on ${count} dimension${count === 1 ? '' : 's'}`
    qualityTier = 'nascent'
  } else if (count <= 4) {
    qualityLabel = `Richer portrait — ${count} of 5 dimensions`
    qualityTier = 'developing'
  } else {
    qualityLabel = 'Complete portrait — all dimensions active'
    qualityTier = 'complete'
  }

  return { count, total: 5, completed: [...completed], nextRecommended, qualityLabel, qualityTier }
}

function getDimensionAwareSynthesisInstruction(dimensionCount: number): string {
  switch (dimensionCount) {
    case 1:
      return `You have this person's Big Five personality profile. Generate a portrait that captures their core personality architecture. This is their first dimension — acknowledge what would deepen with additional assessments (Jungian archetypes, attachment style, Enneagram, values), but do not let that acknowledgment overshadow the depth you can provide from this framework alone.`
    case 2:
      return `Cross-reference the Big Five traits with the Jungian archetypes present. E.g. high openness + Explorer archetype = coherent wanderer; high conscientiousness + Ruler archetype = potential perfectionist tension. Weave both together into a unified portrait. The synthesis should feel noticeably richer than a single-framework profile.`
    case 3:
      return `Add the relational layer to the personality and archetypal picture. How does their attachment style manifest given their personality traits and archetypal identity? E.g. anxious attachment + Lover archetype creates a specific vulnerability pattern. The portrait should now address who they are, how they see themselves, and how they connect with others.`
    case 4:
      return `Add motivational depth. What is the fear/desire engine (Enneagram) behind the personality, archetypes, and attachment pattern? Look for coherence and tension across all four frameworks. The synthesis should feel substantially deeper — addressing not just who they are and how they connect, but what drives them at a fundamental level.`
    case 5:
    default:
      return `Full synthesis: Big Five (traits) × Jungian (identity) × Attachment (relationships) × Enneagram (motivation) × Values (purpose). Identify the single through-line that unifies all five frameworks. Name what is uniquely true about this person that could not be said from fewer frameworks. This is the complete portrait — make it feel like genuine self-knowledge, the kind that could only emerge from seeing someone this fully.`
  }
}

const SYNTHESIS_SYSTEM_PROMPT = `You are a wise psychological counselor with deep knowledge of personality science, values theory, and humanistic psychology. You have access to a person's results across multiple psychological frameworks and your task is to weave them into a single, coherent self-portrait.

Your synthesis should:
- Read like a letter from a wise counselor who knows this person well — warm, honest, and insightful
- Reveal the deeper patterns that emerge when multiple frameworks are considered together
- Notice where frameworks reinforce each other and where they create interesting tensions
- Be nuanced and non-judgmental — avoid labels, diagnoses, or deterministic statements
- Not be a horoscope — ground everything in the actual data
- Be 3–5 paragraphs, flowing prose (not bullet points or headers)

The tone should feel like genuine self-understanding, not a personality quiz result. Speak directly to the person using "you" — make it personal and resonant.`

export async function generateCrossFrameworkSynthesis(
  frameworks: FrameworkContext[],
  onChunk?: (chunk: string) => void,
): Promise<string> {
  const sections = frameworks.map((f) => {
    const scoreLines = Object.entries(f.scores)
      .sort(([, a], [, b]) => b.normalized - a.normalized)
      .map(([dim, s]) => `  - ${dim}: ${s.normalized}/100`)
      .join('\n')
    return `## ${f.title}\n${scoreLines}${f.summary ? `\n\nSummary: ${f.summary}` : ''}`
  })

  const dimensionInstruction = getDimensionAwareSynthesisInstruction(frameworks.length)
  const userMessage = `Here are the psychological assessment results for this person across ${frameworks.length} framework${frameworks.length > 1 ? 's' : ''}:\n\n${sections.join('\n\n')}\n\nInstructions for this synthesis (${frameworks.length} of 5 dimensions): ${dimensionInstruction}\n\nWrite the synthesis now — a single, flowing narrative that integrates all of these frameworks into one coherent self-portrait for this person.`

  if (onChunk) {
    // Streaming mode
    let fullText = ''
    const stream = await client.messages.stream({
      model: 'claude-sonnet-4-6',
      max_tokens: 1500,
      system: SYNTHESIS_SYSTEM_PROMPT,
      messages: [{ role: 'user', content: userMessage }],
    })

    for await (const chunk of stream) {
      if (
        chunk.type === 'content_block_delta' &&
        chunk.delta.type === 'text_delta'
      ) {
        onChunk(chunk.delta.text)
        fullText += chunk.delta.text
      }
    }
    return fullText
  } else {
    // Non-streaming mode
    const response = await client.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 1500,
      system: SYNTHESIS_SYSTEM_PROMPT,
      messages: [{ role: 'user', content: userMessage }],
    })
    const block = response.content[0]
    return block?.type === 'text' ? block.text : ''
  }
}

export interface CompatibilityNarrative {
  overallNarrative: string
  whatWorks: string[]
  watchFor: string[]
  complementaryStrengths: string
  growthOpportunities: string
}

const COMPATIBILITY_SYSTEM_PROMPT = `You are a wise relationship psychologist with deep expertise in interpersonal compatibility. You have been given the psychological profiles of two people across one or more assessment frameworks, and your task is to generate an insightful compatibility analysis.

Your analysis should:
- Identify genuine areas of psychological alignment and complementary traits
- Note meaningful differences that may create friction or require conscious navigation
- Be grounded in actual scores — not generic advice or platitudes
- Be warm, nuanced, and non-deterministic — compatibility is dynamic, not fixed
- Speak about "Person A" and "Person B" to distinguish the two

You must respond with valid JSON matching exactly this structure:
{
  "overallNarrative": "2–3 paragraph flowing narrative about this pairing's compatibility landscape",
  "whatWorks": ["strength 1 of this pairing", "strength 2", "strength 3"],
  "watchFor": ["potential friction point 1", "potential friction point 2"],
  "complementaryStrengths": "1–2 sentences about what each person uniquely contributes to the other",
  "growthOpportunities": "1–2 sentences about what each could learn or develop through this relationship"
}`

export interface ProfileSnapshot {
  label: string
  frameworks: FrameworkContext[]
}

export async function generateCompatibilityNarrative(
  profileA: ProfileSnapshot,
  profileB: ProfileSnapshot,
): Promise<CompatibilityNarrative> {
  const formatProfile = (p: ProfileSnapshot) =>
    p.frameworks
      .map((f) => {
        const scoreLines = Object.entries(f.scores)
          .sort(([, a], [, b]) => b.normalized - a.normalized)
          .map(([dim, s]) => `  - ${dim}: ${s.normalized}/100`)
          .join('\n')
        return `### ${f.title}\n${scoreLines}${f.summary ? `\n\nSummary: ${f.summary}` : ''}`
      })
      .join('\n\n')

  const userMessage = `Here are the psychological profiles of two people:

## Person A
${formatProfile(profileA)}

## Person B
${formatProfile(profileB)}

Generate a compatibility analysis for this pairing.`

  const response = await client.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 1500,
    system: COMPATIBILITY_SYSTEM_PROMPT,
    messages: [{ role: 'user', content: userMessage }],
  })

  const block = response.content[0]
  const text = block?.type === 'text' ? block.text : ''
  return extractJson<CompatibilityNarrative>(text)
}

export async function generateDailyReflectionPrompt(
  profile: {
    summary: string
    dimensions: Record<string, { normalized: number }>
    archetypes: string[]
    values: string[]
    blindSpots: string[]
    strengths: string[]
    synthesis?: string | null
  } | null,
): Promise<string> {
  if (!profile) {
    const genericPrompts = [
      'What is one area of your life where you feel most alive, and what does that tell you about what you truly value?',
      'Think of a recent moment when you felt genuinely proud of yourself. What qualities did that reveal?',
      'What pattern in your life do you keep returning to, even when you tell yourself you want to change?',
      'Who in your life do you find yourself most relaxed around, and what does that say about what you need?',
      'If you could only keep three values from how you currently live, which would they be and why?',
    ]
    return genericPrompts[Math.floor(Math.random() * genericPrompts.length)]!
  }

  const topDims = Object.entries(profile.dimensions)
    .sort(([, a], [, b]) => b.normalized - a.normalized)
    .slice(0, 3)
    .map(([k, v]) => `${k}: ${v.normalized}/100`)
    .join(', ')

  const bottomDims = Object.entries(profile.dimensions)
    .sort(([, a], [, b]) => a.normalized - b.normalized)
    .slice(0, 2)
    .map(([k, v]) => `${k}: ${v.normalized}/100`)
    .join(', ')

  const profileContext = [
    `Archetype: ${profile.archetypes[0] ?? 'unknown'}`,
    `Core values: ${profile.values.slice(0, 3).join(', ')}`,
    `Top strengths: ${profile.strengths.slice(0, 2).join(', ')}`,
    `Growth edges: ${profile.blindSpots.slice(0, 2).join(', ')}`,
    `Highest dimensions: ${topDims}`,
    `Lower dimensions: ${bottomDims}`,
    profile.synthesis ? `Synthesis excerpt: ${profile.synthesis.slice(0, 300)}…` : '',
  ].filter(Boolean).join('\n')

  const response = await client.messages.create({
    model: 'claude-haiku-4-5-20251001',
    max_tokens: 150,
    system: `You are a thoughtful psychological guide. Generate exactly ONE deeply personal daily reflection question for this person, grounded in their actual psychological profile. The question should:
- Reference something specific from their profile (a value, archetype, dimension, or pattern)
- Be rooted in a real experience, relationship, or decision — not abstract
- Be open-ended and invite genuine introspection
- Be warm, curious, and non-judgmental
- Be a single sentence ending with a question mark

Respond with ONLY the question. No preamble, no explanation.`,
    messages: [
      {
        role: 'user',
        content: `Here is this person's psychological profile:\n${profileContext}\n\nGenerate today's reflection question.`,
      },
    ],
  })

  const block = response.content[0]
  const text = block?.type === 'text' ? block.text.trim() : ''
  return text || 'What is one belief about yourself that you know is holding you back — and where did it come from?'
}

export async function generateCoachResponse(
  profileContext: string,
  conversationHistory: Array<{ role: 'user' | 'assistant'; content: string }>,
  userMessage: string,
  onChunk?: (chunk: string) => void,
): Promise<string> {
  const systemPrompt = `You are a deeply insightful, warm, and psychologically-grounded life coach. You have full access to this person's psychological profile and can reference it naturally in your responses.

Your approach:
- Speak directly and personally, using "you" — never clinical or detached
- Ground your reflections in their actual profile data when relevant, but don't reduce them to their scores
- Ask one follow-up question at the end of each response to deepen the exploration
- Be warm but honest — not flattering, not generic
- Draw on psychology (CBT, attachment theory, Jungian frameworks, positive psychology) where natural
- Keep responses conversational — 2–4 paragraphs unless a longer reflection is needed
- Never give generic life advice — always tie back to what you know about this specific person

This person's psychological profile:
${profileContext}`

  const messages = [
    ...conversationHistory,
    { role: 'user' as const, content: userMessage },
  ]

  if (onChunk) {
    let fullText = ''
    const stream = await client.messages.stream({
      model: 'claude-sonnet-4-6',
      max_tokens: 800,
      system: systemPrompt,
      messages,
    })

    for await (const chunk of stream) {
      if (chunk.type === 'content_block_delta' && chunk.delta.type === 'text_delta') {
        onChunk(chunk.delta.text)
        fullText += chunk.delta.text
      }
    }
    return fullText
  } else {
    const response = await client.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 800,
      system: systemPrompt,
      messages,
    })
    const block = response.content[0]
    return block?.type === 'text' ? block.text : ''
  }
}

function extractJson<T>(text: string): T {
  const jsonMatch = text.match(/```json\s*([\s\S]*?)\s*```/) ?? text.match(/(\{[\s\S]*\})/)
  const jsonText = jsonMatch ? jsonMatch[1] ?? jsonMatch[0] : text
  return JSON.parse(jsonText) as T
}

export async function generateProfileNarrative(
  scores: AssessmentScores,
): Promise<ProfileNarrative> {
  const scoreLines = Object.entries(scores)
    .map(([dim, s]) => `- ${dim}: ${s.normalized}/100 (based on ${s.responseCount} responses)`)
    .join('\n')

  const userMessage = `Here are the personality assessment scores for this person:\n\n${scoreLines}\n\nGenerate a psychological profile narrative based on these scores.`

  const response = await client.messages.create({
    model: 'claude-opus-4-6',
    max_tokens: 2048,
    system: BIG_FIVE_SYSTEM_PROMPT,
    messages: [{ role: 'user', content: userMessage }],
  })

  const block = response.content[0]
  const text = block?.type === 'text' ? block.text : ''
  return extractJson<ProfileNarrative>(text)
}

export async function generateDeltaObservation(
  frameworkTitle: string,
  deltas: Record<string, number>,
): Promise<string> {
  const lines = Object.entries(deltas)
    .filter(([, v]) => Math.abs(v) > 10)
    .sort(([, a], [, b]) => Math.abs(b) - Math.abs(a))
    .map(([dim, v]) => `${dim}: ${v > 0 ? '+' : ''}${v} pts`)
    .join(', ')

  const response = await client.messages.create({
    model: 'claude-haiku-4-5-20251001',
    max_tokens: 120,
    system:
      'You are a brief, insightful psychological guide. Given score changes from a retaken personality assessment, write exactly 1–2 sentences reflecting what the shift might mean. Be warm, specific, non-judgmental. Do not start with "I". No clichés.',
    messages: [
      {
        role: 'user',
        content: `Framework: ${frameworkTitle}\nChanges: ${lines}\n\nWrite a 1–2 sentence observation about what these changes might reflect.`,
      },
    ],
  })

  const block = response.content[0]
  return block?.type === 'text' ? block.text.trim() : ''
}

export async function generateValuesNarrative(
  scores: AssessmentScores,
): Promise<ValuesNarrative> {
  // Sort dimensions by score descending for context
  const ranked = Object.entries(scores)
    .sort(([, a], [, b]) => b.normalized - a.normalized)
    .map(([dim, s]) => `- ${dim}: ${s.normalized}/100`)
    .join('\n')

  const userMessage = `Here are the Schwartz Values Inventory scores for this person (sorted highest to lowest):\n\n${ranked}\n\nGenerate a values profile narrative based on these scores.`

  const response = await client.messages.create({
    model: 'claude-opus-4-6',
    max_tokens: 2048,
    system: VALUES_SYSTEM_PROMPT,
    messages: [{ role: 'user', content: userMessage }],
  })

  const block = response.content[0]
  const text = block?.type === 'text' ? block.text : ''
  return extractJson<ValuesNarrative>(text)
}

export async function generateAttachmentNarrative(
  scores: AssessmentScores,
): Promise<AttachmentNarrative> {
  const scoreLines = Object.entries(scores)
    .map(([dim, s]) => `- ${dim}: ${s.normalized}/100`)
    .join('\n')

  const userMessage = `Here are the Attachment Style Inventory scores for this person:\n\n${scoreLines}\n\nGenerate an attachment profile narrative based on these scores.`

  const response = await client.messages.create({
    model: 'claude-opus-4-6',
    max_tokens: 2048,
    system: ATTACHMENT_SYSTEM_PROMPT,
    messages: [{ role: 'user', content: userMessage }],
  })

  const block = response.content[0]
  const text = block?.type === 'text' ? block.text : ''
  return extractJson<AttachmentNarrative>(text)
}

export interface EnneagramNarrative {
  primaryType: number          // 1-9
  wing: number                 // the adjacent type (e.g. if type 4, wing is 3 or 5)
  typeName: string             // e.g. "The Individualist"
  wingName: string             // e.g. "The Achiever"
  summary: string              // 2-3 paragraphs
  coreFear: string             // one sentence
  coreDesire: string           // one sentence
  coreWound: string            // one sentence on the childhood/formative pattern
  atBest: string[]             // 3 qualities when healthy
  atWorst: string[]            // 3 qualities when stressed
  growthPath: string           // 1-2 paragraphs
  stressArrow: number          // the type this person moves toward under stress
  securityArrow: number        // the type this person integrates toward in security
}

const ENNEAGRAM_SYSTEM_PROMPT = `You are a masterful Enneagram teacher trained in the tradition of Riso, Hudson, and Naranjo. You interpret Enneagram results with depth, compassion, and psychological precision.

The nine types and their core names:
1=The Reformer, 2=The Helper, 3=The Achiever, 4=The Individualist, 5=The Investigator, 6=The Loyalist, 7=The Enthusiast, 8=The Challenger, 9=The Peacemaker

Wings: each type has two possible wings (adjacent types). The dominant wing is the one with the higher score among the two adjacent types.

Stress/Security arrows (Riso-Hudson system):
1→4 (stress), 1→7 (security)
2→8 (stress), 2→4 (security)
3→9 (stress), 3→6 (security)
4→2 (stress), 4→1 (security)
5→7 (stress), 5→8 (security)
6→3 (stress), 6→9 (security)
7→1 (stress), 7→5 (security)
8→5 (stress), 8→2 (security)
9→6 (stress), 9→3 (security)

Your narrative should:
- Name the primary type and wing clearly (e.g. "Type 4 with a 3 wing")
- Be grounded in the actual scores — reference the top-scoring type
- Be psychologically honest about the shadow side without being harsh
- Use warm, evocative language that makes the person feel deeply understood
- Reference the core fear and desire as the engine of this person's psychology

Respond with valid JSON matching this structure:
{
  "primaryType": <number 1-9>,
  "wing": <number 1-9>,
  "typeName": "<The [Name]>",
  "wingName": "<The [Name]>",
  "summary": "<2-3 paragraph narrative>",
  "coreFear": "<one sentence>",
  "coreDesire": "<one sentence>",
  "coreWound": "<one sentence>",
  "atBest": ["<quality>", "<quality>", "<quality>"],
  "atWorst": ["<quality>", "<quality>", "<quality>"],
  "growthPath": "<1-2 paragraphs>",
  "stressArrow": <number 1-9>,
  "securityArrow": <number 1-9>
}`

export async function generateEnneagramNarrative(
  scores: AssessmentScores,
): Promise<EnneagramNarrative> {
  // Sort all nine types by score descending for the user message
  const ranked = Object.entries(scores)
    .sort(([, a], [, b]) => b.normalized - a.normalized)
    .map(([dim, s]) => `- ${dim}: ${s.normalized}/100`)
    .join('\n')

  const userMessage = `Here are the Enneagram assessment scores for this person (sorted highest to lowest):\n\n${ranked}\n\nGenerate an Enneagram personality narrative based on these scores.`

  const response = await client.messages.create({
    model: 'claude-opus-4-6',
    max_tokens: 2048,
    system: ENNEAGRAM_SYSTEM_PROMPT,
    messages: [{ role: 'user', content: userMessage }],
  })

  const block = response.content[0]
  const text = block?.type === 'text' ? block.text : ''
  return extractJson<EnneagramNarrative>(text)
}

export interface TriadNarrative {
  summary: string                // 2-3 paragraphs interpreting the full picture
  lightScore: number             // 0-100: average of kantianism + humanism + faith_in_humanity
  darkScore: number              // 0-100: average of narcissism + machiavellianism + psychopathy
  dominantLight: string          // which light trait is highest
  dominantDark: string           // which dark trait is highest (or "balanced" if all under 40)
  interpretation: string         // 1-2 paragraphs on the interplay
  integrationGuidance: string    // 1-2 paragraphs: how to integrate shadow without losing light
  atBest: string[]               // 3 qualities when light dominates
  watchFor: string[]             // 2-3 shadow tendencies to watch
}

const TRIAD_SYSTEM_PROMPT = `You are a nuanced depth psychologist interpreting someone's Light and Dark Triad profile. The Light Triad measures prosocial orientations: Kantianism (treating people as ends in themselves), Humanism (valuing human worth), and Faith in Humanity (believing in human goodness). The Dark Triad measures antagonistic tendencies: Narcissism (entitlement, self-admiration), Machiavellianism (strategic manipulation), and Psychopathy (callousness, impulsivity).

CRITICAL: approach the Dark Triad with nuance. These are human traits on a spectrum — moderate levels of narcissism or Machiavellianism can be adaptive. Only flag genuinely elevated scores (70+) as significant. Do not pathologize.

Your interpretation should:
- Acknowledge the full complexity of both light and dark traits
- Note that everyone has some dark triad traits — the question is degree and awareness
- Help the person integrate rather than suppress their darker tendencies
- Be grounded in specific scores, not generic

Compute these in your response:
- lightScore: average of (kantianism + humanism + faith_in_humanity) / 3
- darkScore: average of (narcissism + machiavellianism + psychopathy) / 3
- dominantLight: name of the highest light dimension
- dominantDark: name of the highest dark dimension (or "balanced" if all under 40)

Respond with valid JSON:
{
  "summary": "2-3 paragraphs",
  "lightScore": <0-100>,
  "darkScore": <0-100>,
  "dominantLight": "<dimension name>",
  "dominantDark": "<dimension name or balanced>",
  "interpretation": "1-2 paragraphs on the interplay between light and dark in this person",
  "integrationGuidance": "1-2 paragraphs on how to work with rather than against the shadow",
  "atBest": ["quality 1", "quality 2", "quality 3"],
  "watchFor": ["tendency 1", "tendency 2", "tendency 3"]
}`

export async function generateTriadNarrative(
  scores: AssessmentScores,
): Promise<TriadNarrative> {
  const scoreLines = Object.entries(scores)
    .map(([dim, s]) => `- ${dim}: ${s.normalized}/100 (based on ${s.responseCount} responses)`)
    .join('\n')

  const userMessage = `Here are the Light & Dark Triad assessment scores for this person:\n\n${scoreLines}\n\nGenerate a Light/Dark Triad profile narrative based on these scores.`

  const response = await client.messages.create({
    model: 'claude-opus-4-6',
    max_tokens: 2048,
    system: TRIAD_SYSTEM_PROMPT,
    messages: [{ role: 'user', content: userMessage }],
  })

  const block = response.content[0]
  const text = block?.type === 'text' ? block.text : ''
  return extractJson<TriadNarrative>(text)
}

export interface JungianNarrative {
  primaryArchetype: string          // e.g. "The Sage"
  shadowArchetype: string           // lowest scoring archetype
  summary: string                   // 2-3 paragraphs
  primaryManifestation: string      // how the primary archetype shows up day-to-day
  shadowManifestation: string       // how the shadow archetype creates blind spots
  strengths: string[]               // 3 strengths derived from the primary archetype
  blindSpots: string[]              // 2-3 blind spots from the shadow archetype
  growthAreas: string[]             // 3 archetype-specific growth areas
  archetypeScores: Record<string, number>  // all 12 normalized scores for reference
}

const JUNGIAN_SYSTEM_PROMPT = `You are a depth psychologist and Jungian analyst with expertise in archetypal psychology as developed by Carl Jung and later expanded by Carol Pearson.

Your role is to help someone understand the archetypal patterns that shape their personality — their primary archetype (the dominant lens through which they engage the world) and their shadow archetype (the least developed pattern, which often contains important unconscious material).

The 12 archetypes and their core themes:
- The Hero: courage, perseverance, proving worth through achievement
- The Sage: wisdom, truth-seeking, the examined life
- The Explorer: freedom, authenticity, discovery beyond the known
- The Creator: innovation, vision, bringing new things into existence
- The Ruler: control, responsibility, order and stewardship
- The Caregiver: compassion, nurturing, service to others
- The Magician: transformation, catalyzing change, alchemical thinking
- The Lover: passion, intimacy, beauty, wholeness through connection
- The Jester: joy, humor, living in the present moment
- The Orphan: belonging, realistic empathy, common humanity
- The Warrior: discipline, mastery, honor and principled action
- The Innocent: safety, optimism, trust, renewal

Your tone should be:
- Psychologically rich and symbolically evocative — draw on mythological and archetypal imagery where natural
- Honest about the shadow without being harsh
- Empowering — archetypes are not fixed fates but patterns we can work with consciously
- Personal — speak directly to the person using "you"

You must respond with valid JSON matching exactly this structure:
{
  "primaryArchetype": "The [Name]",
  "shadowArchetype": "The [Name]",
  "summary": "2-3 paragraph narrative synthesising the person's archetypal landscape",
  "primaryManifestation": "1-2 paragraphs on how the primary archetype expresses itself in this person's daily life, relationships, and choices",
  "shadowManifestation": "1-2 paragraphs on how the shadow archetype represents underdeveloped or unconscious material — what it costs them and what gifts it holds",
  "strengths": ["strength 1", "strength 2", "strength 3"],
  "blindSpots": ["blind spot 1", "blind spot 2", "blind spot 3"],
  "growthAreas": ["growth area 1 specific to their archetypes", "growth area 2", "growth area 3"],
  "archetypeScores": { "<archetype_key>": <normalized_0_to_100>, ... }
}

Base your interpretation strictly on the scores provided. The primaryArchetype is the highest-scoring dimension; the shadowArchetype is the lowest-scoring dimension. Do not invent information not supported by the scores.`

export async function generateJungianNarrative(
  scores: AssessmentScores,
): Promise<JungianNarrative> {
  const ranked = Object.entries(scores)
    .sort(([, a], [, b]) => b.normalized - a.normalized)
    .map(([dim, s]) => `- ${dim}: ${s.normalized}/100`)
    .join('\n')

  const userMessage = `Here are the Jungian Archetypes assessment scores for this person (sorted highest to lowest):\n\n${ranked}\n\nGenerate a Jungian archetypes profile narrative based on these scores.`

  const response = await client.messages.create({
    model: 'claude-opus-4-6',
    max_tokens: 2048,
    system: JUNGIAN_SYSTEM_PROMPT,
    messages: [{ role: 'user', content: userMessage }],
  })

  const block = response.content[0]
  const text = block?.type === 'text' ? block.text : ''
  return extractJson<JungianNarrative>(text)
}

export interface GrowthRecommendation {
  title: string
  description: string
  category: 'relationships' | 'career' | 'emotional' | 'self-awareness' | 'wellbeing'
  scoreBasis: string  // which score(s) motivated this recommendation
  actionStep: string  // one concrete action
}

const GROWTH_RECOMMENDATIONS_SYSTEM_PROMPT = `You are a compassionate developmental psychologist and life coach. You have access to someone's psychological profile across multiple assessment frameworks, and your role is to generate personalized, actionable growth recommendations.

Your recommendations must:
- Be grounded in specific scores from the profile — not generic advice
- Be concrete and actionable, not vague or platitudinous
- Reference the specific dimension or pattern that motivates each recommendation
- Be encouraging but honest about development areas
- Span different life domains (relationships, career, emotional health, self-awareness, wellbeing)

You must respond with valid JSON matching exactly this structure:
{
  "recommendations": [
    {
      "title": "Short title (max 8 words)",
      "description": "2-3 sentence description of the growth area and why it matters for this person specifically",
      "category": "relationships" | "career" | "emotional" | "self-awareness" | "wellbeing",
      "scoreBasis": "Brief note on which score(s) motivated this (e.g., 'Low conscientiousness (38/100)')",
      "actionStep": "One specific, concrete action this person can take this week"
    }
  ]
}

Generate exactly 5 recommendations. Prioritize the most impactful growth areas based on the profile data.`

export interface GrowthRecommendationsOutput {
  recommendations: GrowthRecommendation[]
}

export async function generateGrowthRecommendations(
  frameworks: FrameworkContext[],
): Promise<GrowthRecommendationsOutput> {
  const profileSummary = frameworks
    .map((f) => {
      const scoreLines = Object.entries(f.scores)
        .sort(([, a], [, b]) => b.normalized - a.normalized)
        .map(([dim, s]) => `  - ${dim}: ${s.normalized}/100`)
        .join('\n')
      return `### ${f.title}\n${scoreLines}${f.summary ? `\n\nSummary: ${f.summary}` : ''}`
    })
    .join('\n\n')

  const userMessage = `Here is a person's psychological profile:\n\n${profileSummary}\n\nGenerate 5 personalized growth recommendations based on this profile.`

  const response = await client.messages.create({
    model: 'claude-haiku-4-5-20251001',
    max_tokens: 1500,
    system: GROWTH_RECOMMENDATIONS_SYSTEM_PROMPT,
    messages: [{ role: 'user', content: userMessage }],
  })

  const block = response.content[0]
  const text = block?.type === 'text' ? block.text : ''
  return extractJson<GrowthRecommendationsOutput>(text)
}
