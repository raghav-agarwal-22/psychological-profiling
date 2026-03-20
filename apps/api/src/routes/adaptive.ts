import type { FastifyInstance } from 'fastify'
import { z } from 'zod'
import Anthropic from '@anthropic-ai/sdk'
import { prisma, AssessmentType, AssessmentStatus, SessionStatus } from '@innermind/db'
import { requireAuth } from '../lib/auth.js'

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

// ─── Types ────────────────────────────────────────────────────────────────────

interface AdaptiveQuestion {
  id: string
  text: string
  dimension: string
  type: 'open_ended' | 'likert'
  reverse_scored: boolean
}

interface AdaptiveNarrative {
  summary: string
  keyPatterns: string[]
  growthEdges: string[]
  integrationTheme: string
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

const FRAMEWORK_DESCRIPTIONS: Record<string, string> = {
  BIG_FIVE: 'Big Five Personality (Openness, Conscientiousness, Extraversion, Agreeableness, Neuroticism)',
  VALUES_INVENTORY: 'Schwartz Values Inventory (Achievement, Benevolence, Conformity, Hedonism, Power, Security, Self-Direction, Stimulation, Universalism)',
  ATTACHMENT_STYLE: 'Adult Attachment Style (Anxiety, Avoidance dimensions)',
  LIGHT_DARK_TRIAD: 'Light & Dark Triad (Kantianism, Humanism, Faith in Humanity vs Narcissism, Machiavellianism, Psychopathy)',
  ENNEAGRAM: 'Enneagram personality system',
  JUNGIAN_ARCHETYPES: 'Jungian Archetypes',
}

function buildQuestionGenerationPrompt(
  frameworkType: string,
  dimensionScores: Record<string, { normalized: number }>,
  profileSummary: string,
): string {
  const frameworkDesc = FRAMEWORK_DESCRIPTIONS[frameworkType] ?? frameworkType
  const scoreLines = Object.entries(dimensionScores)
    .sort(([, a], [, b]) => b.normalized - a.normalized)
    .map(([dim, s]) => `- ${dim.replace(/_/g, ' ')}: ${Math.round(s.normalized * 100)}/100`)
    .join('\n')

  return `You are a depth psychologist crafting personalized follow-up questions for someone who just completed a ${frameworkDesc} assessment.

## Their profile summary
${profileSummary}

## Their dimension scores (0–100)
${scoreLines}

## Your task
Generate exactly 10 personalized follow-up questions that probe the psychological patterns most relevant to THIS specific person. The questions should:
1. Target their highest and lowest scoring dimensions — explore what drives the extremes
2. Surface tensions between competing dimensions (e.g., high openness + high conscientiousness)
3. Connect their scores to lived experience — not abstract theory
4. Mix introspective and behavioral questions
5. Be warm and curious in tone, not clinical
6. 8 questions should be Likert-scale (rated 1–5), 2 questions should be reflection prompts (open_ended)

For Likert questions, write them so higher agreement (5) = stronger expression of the targeted dimension.

Respond ONLY with valid JSON in this exact structure (no markdown, no explanation):
{
  "questions": [
    {
      "id": "adp_1",
      "text": "Question text here",
      "dimension": "the_dimension_this_targets",
      "type": "likert",
      "reverse_scored": false
    },
    {
      "id": "adp_2",
      "text": "Reflection prompt here (for open_ended type)",
      "dimension": "integration",
      "type": "open_ended",
      "reverse_scored": false
    }
  ]
}

The "dimension" field should use the original dimension key (e.g. "openness", "anxiety", "self_direction"). For open_ended questions that span multiple dimensions, use "integration".`
}

function buildNarrativePrompt(
  questions: AdaptiveQuestion[],
  responses: Record<string, number | string>,
  originalSummary: string,
): string {
  const responseLines = questions.map((q) => {
    const answer = responses[q.id]
    const answerStr = q.type === 'likert'
      ? `${answer}/5 (${getlikertLabel(Number(answer))})`
      : `"${answer}"`
    return `Q: ${q.text}\nA: ${answerStr}`
  }).join('\n\n')

  return `A person completed an adaptive deep-dive assessment that was personalized to their initial psychological profile. Here is their original profile context:

${originalSummary}

Here are their responses to the follow-up questions:

${responseLines}

Based on these responses, generate a deep narrative that:
1. Synthesizes their adaptive responses with their original profile patterns
2. Identifies 2-3 key psychological patterns that emerged or were confirmed
3. Highlights 2-3 growth edges — specific areas ripe for development
4. Offers an integration theme — one central insight about how to work with their patterns

Respond ONLY with valid JSON in this exact structure (no markdown):
{
  "summary": "A 2-3 paragraph narrative synthesis",
  "keyPatterns": ["pattern 1", "pattern 2", "pattern 3"],
  "growthEdges": ["growth edge 1", "growth edge 2", "growth edge 3"],
  "integrationTheme": "One central integration insight, 2-3 sentences"
}`
}

function getlikertLabel(value: number): string {
  const labels: Record<number, string> = { 1: 'Strongly Disagree', 2: 'Disagree', 3: 'Neutral', 4: 'Agree', 5: 'Strongly Agree' }
  return labels[value] ?? 'Unknown'
}

function extractJson<T>(text: string): T {
  const jsonMatch = text.match(/```json\s*([\s\S]*?)\s*```/) ?? text.match(/(\{[\s\S]*\})/)
  const jsonText = jsonMatch ? (jsonMatch[1] ?? jsonMatch[0]) : text
  return JSON.parse(jsonText as string) as T
}

// ─── Schema ────────────────────────────────────────────────────────────────────

const generateAdaptiveSchema = z.object({
  sourceProfileId: z.string().cuid(),
})

const submitAdaptiveSchema = z.object({
  sessionId: z.string().cuid(),
  assessmentId: z.string().cuid(),
  responses: z.record(z.union([z.number(), z.string()])),
})

// ─── Routes ───────────────────────────────────────────────────────────────────

export async function adaptiveRoutes(server: FastifyInstance) {
  server.addHook('preHandler', requireAuth)

  /**
   * POST /api/adaptive/generate
   * Analyze the source profile with Claude, generate 10 personalized questions,
   * persist them as a one-off CUSTOM template, and create a new session + assessment.
   */
  server.post('/generate', async (req, reply) => {
    if (!process.env.ANTHROPIC_API_KEY) {
      return reply.status(503).send({ error: 'Adaptive assessment requires AI — ANTHROPIC_API_KEY not configured' })
    }

    const body = generateAdaptiveSchema.safeParse(req.body)
    if (!body.success) {
      return reply.status(400).send({ error: 'Invalid request', issues: body.error.issues })
    }

    // Load source profile
    const sourceProfile = await prisma.profile.findFirst({
      where: { id: body.data.sourceProfileId, userId: req.user.userId },
    })
    if (!sourceProfile) {
      return reply.status(404).send({ error: 'Source profile not found' })
    }

    const frameworkType = (sourceProfile.rawOutput as Record<string, unknown>)?.templateType as string ?? 'BIG_FIVE'
    const dimensionScores = sourceProfile.dimensions as Record<string, { normalized: number }>

    // Generate personalized questions via Claude
    let questions: AdaptiveQuestion[]
    try {
      const prompt = buildQuestionGenerationPrompt(frameworkType, dimensionScores, sourceProfile.summary)
      const response = await client.messages.create({
        model: 'claude-sonnet-4-6',
        max_tokens: 2000,
        messages: [{ role: 'user', content: prompt }],
      })
      const block = response.content[0]
      const text = block?.type === 'text' ? block.text : ''
      const parsed = extractJson<{ questions: AdaptiveQuestion[] }>(text)
      questions = parsed.questions
      if (!Array.isArray(questions) || questions.length === 0) {
        throw new Error('Claude returned empty questions')
      }
    } catch (err) {
      server.log.error({ err }, '[adaptive] Failed to generate questions via Claude')
      return reply.status(500).send({ error: 'Failed to generate adaptive questions' })
    }

    // Persist as a one-off CUSTOM template (not reusable — per-user per-profile)
    const frameworkLabel = (FRAMEWORK_DESCRIPTIONS[frameworkType] ?? frameworkType).split(' ')[0]
    const template = await prisma.assessmentTemplate.create({
      data: {
        type: AssessmentType.CUSTOM,
        title: `Adaptive Deep-Dive — ${frameworkLabel}`,
        description: `Personalized follow-up questions generated from your ${frameworkLabel} assessment profile.`,
        version: `adaptive-${sourceProfile.id.slice(-8)}`,
        questionBank: questions as unknown as object[],
        scoringConfig: { adaptive: true, sourceProfileId: sourceProfile.id } as object,
        isActive: true,
      },
    })

    // Create a new session for the adaptive assessment
    const session = await prisma.session.create({
      data: {
        userId: req.user.userId,
        title: `Adaptive Deep-Dive — ${frameworkLabel}`,
        status: SessionStatus.IN_PROGRESS,
      },
    })

    // Create the assessment linked to the template
    const assessment = await prisma.assessment.create({
      data: {
        userId: req.user.userId,
        sessionId: session.id,
        templateId: template.id,
        type: AssessmentType.CUSTOM,
        title: template.title,
        description: template.description,
        status: AssessmentStatus.NOT_STARTED,
        totalSteps: questions.length,
        metadata: { sourceProfileId: sourceProfile.id, frameworkType } as object,
      },
    })

    return reply.status(201).send({
      sessionId: session.id,
      assessmentId: assessment.id,
      templateId: template.id,
      questions,
      title: template.title,
      description: template.description,
      sourceFramework: frameworkType,
    })
  })

  /**
   * POST /api/adaptive/complete
   * Submit all responses, run Claude to generate a narrative, store it as a profile.
   */
  server.post('/complete', async (req, reply) => {
    if (!process.env.ANTHROPIC_API_KEY) {
      return reply.status(503).send({ error: 'Adaptive completion requires AI — ANTHROPIC_API_KEY not configured' })
    }

    const body = submitAdaptiveSchema.safeParse(req.body)
    if (!body.success) {
      return reply.status(400).send({ error: 'Invalid request', issues: body.error.issues })
    }

    const { sessionId, assessmentId, responses } = body.data

    // Verify session and assessment ownership
    const session = await prisma.session.findFirst({
      where: { id: sessionId, userId: req.user.userId },
    })
    if (!session) return reply.status(404).send({ error: 'Session not found' })

    const assessment = await prisma.assessment.findFirst({
      where: { id: assessmentId, sessionId, userId: req.user.userId },
      include: { template: true },
    })
    if (!assessment) return reply.status(404).send({ error: 'Assessment not found' })

    const questions = (assessment.template?.questionBank ?? []) as unknown as AdaptiveQuestion[]
    const sourceProfileId = (assessment.metadata as Record<string, string>)?.sourceProfileId
    const frameworkType = (assessment.metadata as Record<string, string>)?.frameworkType ?? 'BIG_FIVE'

    // Load source profile for context
    const sourceProfile = sourceProfileId
      ? await prisma.profile.findFirst({
          where: { id: sourceProfileId, userId: req.user.userId },
          select: { summary: true, dimensions: true },
        })
      : null

    const contextSummary = sourceProfile?.summary ?? 'Profile not available.'

    // Generate adaptive narrative from responses
    let narrative: AdaptiveNarrative
    try {
      const prompt = buildNarrativePrompt(questions, responses as Record<string, number | string>, contextSummary)
      const response = await client.messages.create({
        model: 'claude-sonnet-4-6',
        max_tokens: 2000,
        messages: [{ role: 'user', content: prompt }],
      })
      const block = response.content[0]
      const text = block?.type === 'text' ? block.text : ''
      narrative = extractJson<AdaptiveNarrative>(text)
    } catch (err) {
      server.log.error({ err }, '[adaptive] Failed to generate narrative via Claude')
      return reply.status(500).send({ error: 'Failed to generate adaptive narrative' })
    }

    // Mark assessment and session as complete
    await prisma.assessment.update({
      where: { id: assessmentId },
      data: {
        status: AssessmentStatus.COMPLETED,
        completedAt: new Date(),
        rawResponses: responses as object,
      },
    })

    await prisma.session.update({
      where: { id: sessionId },
      data: { status: SessionStatus.COMPLETED, completedAt: new Date() },
    })

    // Unmark previous latest profile
    await prisma.profile.updateMany({
      where: { userId: req.user.userId, isLatest: true },
      data: { isLatest: false },
    })

    // Count existing profiles to get version number
    const profileCount = await prisma.profile.count({ where: { userId: req.user.userId } })

    // Create the adaptive profile
    const profile = await prisma.profile.create({
      data: {
        userId: req.user.userId,
        version: profileCount + 1,
        isLatest: true,
        summary: narrative.summary,
        dimensions: sourceProfile?.dimensions ?? {},
        archetypes: [],
        values: narrative.keyPatterns,
        blindSpots: narrative.growthEdges,
        strengths: narrative.keyPatterns,
        rawOutput: {
          templateType: AssessmentType.CUSTOM,
          sourceFramework: frameworkType,
          sourceProfileId,
          sessionId,
          responses,
          narrative: {
            summary: narrative.summary,
            keyPatterns: narrative.keyPatterns,
            growthEdges: narrative.growthEdges,
            integrationTheme: narrative.integrationTheme,
          },
          adaptiveQuestions: questions,
        } as object,
      },
    })

    return reply.send({ profile: { id: profile.id } })
  })

  /**
   * GET /api/adaptive/eligibility
   * Check if the user has completed a base assessment and can start an adaptive one.
   */
  server.get('/eligibility', async (req, reply) => {
    const latestProfile = await prisma.profile.findFirst({
      where: { userId: req.user.userId, isLatest: true },
      select: {
        id: true,
        summary: true,
        generatedAt: true,
        rawOutput: true,
      },
    })

    if (!latestProfile) {
      return reply.send({ eligible: false, reason: 'Complete a base assessment first' })
    }

    const templateType = (latestProfile.rawOutput as Record<string, unknown>)?.templateType as string
    if (templateType === AssessmentType.CUSTOM) {
      return reply.send({ eligible: false, reason: 'Your latest profile is already an adaptive assessment', profileId: latestProfile.id })
    }

    return reply.send({
      eligible: true,
      sourceProfileId: latestProfile.id,
      frameworkType: templateType,
      profileSummary: latestProfile.summary.slice(0, 200),
    })
  })
}
