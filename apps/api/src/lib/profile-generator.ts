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

  const userMessage = `Here are the psychological assessment results for this person across ${frameworks.length} framework${frameworks.length > 1 ? 's' : ''}:\n\n${sections.join('\n\n')}\n\nWrite a cross-framework synthesis — a single, flowing narrative that integrates all of these frameworks into one coherent self-portrait for this person.`

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
    return genericPrompts[Math.floor(Math.random() * genericPrompts.length)]
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
