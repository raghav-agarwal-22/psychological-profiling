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
