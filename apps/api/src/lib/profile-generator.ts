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

const SYSTEM_PROMPT = `You are a thoughtful psychological guide trained in the Big Five personality framework, Jungian archetypes, and humanistic psychology.

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
    system: SYSTEM_PROMPT,
    messages: [{ role: 'user', content: userMessage }],
  })

  const block = response.content[0]
  const text = block?.type === 'text' ? block.text : ''

  // Extract JSON from response (may be wrapped in ```json blocks)
  const jsonMatch = text.match(/```json\s*([\s\S]*?)\s*```/) ?? text.match(/(\{[\s\S]*\})/)
  const jsonText = jsonMatch ? jsonMatch[1] ?? jsonMatch[0] : text

  const parsed = JSON.parse(jsonText) as ProfileNarrative
  return parsed
}
