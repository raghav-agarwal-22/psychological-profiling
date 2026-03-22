import type { FastifyInstance } from 'fastify'
import { z } from 'zod'
import { prisma, SessionStatus, AssessmentStatus, AssessmentType, computeScores, type ScoringConfig } from '@innermind/db'
import { requireAuth } from '../lib/auth.js'
import { generateProfileNarrative, generateValuesNarrative, generateAttachmentNarrative, generateTriadNarrative, generateEnneagramNarrative, generateJungianNarrative, generateDeltaObservation, generateReflectionPrompts, generateTemplateSummary, type ProfileNarrative, type ValuesNarrative, type AttachmentNarrative, type TriadNarrative, type EnneagramNarrative, type JungianNarrative } from '../lib/profile-generator.js'
import { applyReferral } from './referrals.js'
import { sendProfileRevealEmail } from '../services/email.js'
import { sendLoopsEvent, upsertLoopsContact } from '../lib/loops.js'

const createSessionSchema = z.object({
  title: z.string().max(200).optional(),
})

const batchResponseSchema = z.object({
  assessmentId: z.string().cuid(),
  responses: z.array(
    z.object({
      questionId: z.string().min(1),
      value: z.number().int().min(1).max(5),
    }),
  ).min(1),
})

export async function sessionRoutes(server: FastifyInstance) {
  server.addHook('preHandler', requireAuth)

  // GET /api/sessions — list sessions for the current user
  server.get('/', async (req, reply) => {
    const sessions = await prisma.session.findMany({
      where: { userId: req.user.userId },
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        title: true,
        status: true,
        startedAt: true,
        completedAt: true,
        createdAt: true,
        _count: { select: { assessments: true } },
      },
    })
    return reply.send({ sessions })
  })

  // POST /api/sessions — create a new session
  server.post('/', async (req, reply) => {
    const body = createSessionSchema.safeParse(req.body)
    if (!body.success) {
      return reply.status(400).send({ error: 'Invalid request', issues: body.error.issues })
    }

    const session = await prisma.session.create({
      data: {
        userId: req.user.userId,
        title: body.data.title,
        status: SessionStatus.IN_PROGRESS,
      },
    })

    return reply.status(201).send({ session })
  })

  // GET /api/sessions/:id — get a specific session with its assessments
  server.get<{ Params: { id: string } }>('/:id', async (req, reply) => {
    const session = await prisma.session.findFirst({
      where: { id: req.params.id, userId: req.user.userId },
      include: {
        assessments: {
          select: {
            id: true,
            type: true,
            title: true,
            status: true,
            currentStep: true,
            totalSteps: true,
            startedAt: true,
            completedAt: true,
          },
        },
      },
    })
    if (!session) {
      return reply.status(404).send({ error: 'Session not found' })
    }
    return reply.send({ session })
  })

  // POST /api/sessions/:id/responses — batch-submit question responses
  server.post<{ Params: { id: string } }>('/:id/responses', async (req, reply) => {
    const body = batchResponseSchema.safeParse(req.body)
    if (!body.success) {
      return reply.status(400).send({ error: 'Invalid request', issues: body.error.issues })
    }

    const session = await prisma.session.findFirst({
      where: { id: req.params.id, userId: req.user.userId },
    })
    if (!session) {
      return reply.status(404).send({ error: 'Session not found' })
    }

    const assessment = await prisma.assessment.findFirst({
      where: { id: body.data.assessmentId, sessionId: session.id, userId: req.user.userId },
    })
    if (!assessment) {
      return reply.status(404).send({ error: 'Assessment not found in this session' })
    }

    // Upsert each response (allow re-submission)
    await prisma.$transaction(
      body.data.responses.map(({ questionId, value }) =>
        prisma.assessmentResponse.upsert({
          where: { assessmentId_questionId: { assessmentId: assessment.id, questionId } },
          update: { value },
          create: { assessmentId: assessment.id, questionId, value },
        }),
      ),
    )

    // Mark assessment as in progress
    await prisma.assessment.update({
      where: { id: assessment.id },
      data: {
        status: AssessmentStatus.IN_PROGRESS,
        startedAt: assessment.startedAt ?? new Date(),
      },
    })

    return reply.send({ ok: true, count: body.data.responses.length })
  })

  // POST /api/sessions/:id/complete — finalize session and trigger scoring
  // Strict rate limit: LLM synthesis is expensive — max 10 completions per hour per IP
  server.post<{ Params: { id: string } }>(
    '/:id/complete',
    {
      config: {
        rateLimit: {
          max: 10,
          timeWindow: '1 hour',
          errorResponseBuilder: () => ({
            statusCode: 429,
            error: 'Too Many Requests',
            message: 'You are generating too many profiles. Please wait before retrying.',
          }),
        },
      },
    },
    async (req, reply) => {
    const session = await prisma.session.findFirst({
      where: { id: req.params.id, userId: req.user.userId },
      include: {
        assessments: {
          include: {
            responses: true,
            template: true,
          },
        },
      },
    })
    if (!session) {
      return reply.status(404).send({ error: 'Session not found' })
    }

    // Score each completed assessment with a template
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const dimensionScores: Record<string, any> = {}
    let templateType: string = AssessmentType.BIG_FIVE
    for (const assessment of session.assessments) {
      if (!assessment.template) continue

      templateType = assessment.template.type
      const scoringConfig = assessment.template.scoringConfig as unknown as ScoringConfig
      const responseMap: Record<string, number> = {}
      for (const r of assessment.responses) {
        responseMap[r.questionId] = r.value
      }

      const scores = computeScores(responseMap, scoringConfig)
      Object.assign(dimensionScores, scores)

      await prisma.assessment.update({
        where: { id: assessment.id },
        data: { status: AssessmentStatus.COMPLETED, completedAt: new Date() },
      })
    }

    // Kick off reflection prompts immediately so they run in parallel with narrative generation.
    // Both are independent LLM calls — parallelizing them cuts total synthesis time by ~40%.
    const hasLlm = Object.keys(dimensionScores).length > 0 && !!process.env.ANTHROPIC_API_KEY
    const reflectionPromptsPromise = hasLlm
      ? generateReflectionPrompts(dimensionScores, templateType).catch((err: unknown) => {
          server.log.warn({ err }, 'Reflection prompt generation failed — skipping')
          return [] as string[]
        })
      : Promise.resolve([] as string[])

    let narrative: ProfileNarrative | null = null
    let valuesNarrative: ValuesNarrative | null = null
    let attachmentNarrative: AttachmentNarrative | null = null
    let triadNarrative: TriadNarrative | null = null
    let enneagramNarrative: EnneagramNarrative | null = null
    let jungianNarrative: JungianNarrative | null = null

    if (hasLlm) {
      try {
        if (templateType === AssessmentType.ATTACHMENT_STYLE) {
          attachmentNarrative = await generateAttachmentNarrative(dimensionScores)
        } else if (templateType === AssessmentType.VALUES_INVENTORY) {
          valuesNarrative = await generateValuesNarrative(dimensionScores)
        } else if (templateType === AssessmentType.LIGHT_DARK_TRIAD) {
          triadNarrative = await generateTriadNarrative(dimensionScores)
        } else if (templateType === AssessmentType.ENNEAGRAM) {
          enneagramNarrative = await generateEnneagramNarrative(dimensionScores)
        } else if (templateType === AssessmentType.JUNGIAN_ARCHETYPES) {
          jungianNarrative = await generateJungianNarrative(dimensionScores)
        } else {
          narrative = await generateProfileNarrative(dimensionScores)
        }
      } catch (err) {
        server.log.warn({ err }, 'AI profile generation failed — storing numeric scores only')
      }
    }

    // Await reflection prompts — should already be done or nearly done
    const reflectionPrompts = await reflectionPromptsPromise

    // Unmark previous latest profile
    await prisma.profile.updateMany({
      where: { userId: req.user.userId, isLatest: true },
      data: { isLatest: false },
    })

    // Build profile fields based on template type
    let summary: string
    let archetypes: string[]
    let values: string[]
    let blindSpots: string[]
    let strengths: string[]

    if (templateType === AssessmentType.ATTACHMENT_STYLE && attachmentNarrative) {
      summary = attachmentNarrative.summary
      archetypes = [attachmentNarrative.attachmentStyle]
      values = attachmentNarrative.relationshipStrengths
      blindSpots = attachmentNarrative.growthEdges
      strengths = attachmentNarrative.relationshipStrengths
    } else if (templateType === AssessmentType.VALUES_INVENTORY && valuesNarrative) {
      summary = valuesNarrative.summary
      archetypes = []
      values = valuesNarrative.coreValues
      blindSpots = valuesNarrative.tensions.map((t) => `${t.value1} vs ${t.value2}: ${t.description}`)
      strengths = []
    } else if (templateType === AssessmentType.LIGHT_DARK_TRIAD && triadNarrative) {
      summary = triadNarrative.summary
      archetypes = [triadNarrative.dominantLight]
      values = triadNarrative.atBest
      blindSpots = triadNarrative.watchFor
      strengths = triadNarrative.atBest
    } else if (templateType === AssessmentType.ENNEAGRAM && enneagramNarrative) {
      summary = enneagramNarrative.summary
      archetypes = [`${enneagramNarrative.typeName} (${enneagramNarrative.wingName} wing)`]
      values = enneagramNarrative.atBest
      blindSpots = enneagramNarrative.atWorst
      strengths = enneagramNarrative.atBest
    } else if (templateType === AssessmentType.JUNGIAN_ARCHETYPES && jungianNarrative) {
      summary = jungianNarrative.summary
      archetypes = [jungianNarrative.primaryArchetype, jungianNarrative.shadowArchetype]
      values = jungianNarrative.growthAreas
      blindSpots = jungianNarrative.blindSpots
      strengths = jungianNarrative.strengths
    } else {
      summary = narrative?.summary ?? generateTemplateSummary(dimensionScores as Record<string, { normalized: number }>, templateType)
      archetypes = narrative?.archetype ? [narrative.archetype] : []
      values = narrative?.values ?? []
      blindSpots = narrative?.blind_spots ?? []
      strengths = narrative?.strengths ?? []
    }

    // Track whether this profile was generated without AI (degraded mode)
    const aiPending = !hasLlm

    const profile = await prisma.profile.create({
      data: {
        userId: req.user.userId,
        version: 1,
        isLatest: true,
        summary,
        dimensions: dimensionScores,
        archetypes,
        values,
        blindSpots,
        strengths,
        rawOutput: {
          sessionId: session.id,
          scores: dimensionScores,
          templateType,
          narrative: narrative ?? valuesNarrative ?? attachmentNarrative ?? triadNarrative ?? enneagramNarrative ?? jungianNarrative,
          reflectionPrompts,
          aiPending,
        } as object,
      },
    })

    // Sync portrait generation to Loops for PH retention campaign triggers
    {
      const primaryArchetype = archetypes[0] ?? null
      const sessionUser = await prisma.user.findUnique({
        where: { id: req.user.userId },
        select: { email: true, subscriptionTier: true },
      })
      if (sessionUser) {
        const topTraitName = typeof dimensionScores === 'object' && dimensionScores !== null
          ? Object.entries(dimensionScores as Record<string, { normalized: number }>)
              .sort((a, b) => (b[1]?.normalized ?? 0) - (a[1]?.normalized ?? 0))[0]?.[0] ?? null
          : null
        sendLoopsEvent(sessionUser.email, 'portrait_generated', {
          ...(primaryArchetype ? { archetypeName: primaryArchetype } : {}),
          ...(topTraitName ? { topTrait: topTraitName } : {}),
        }).catch(() => {})
        upsertLoopsContact({
          email: sessionUser.email,
          userId: req.user.userId,
          userGroup: sessionUser.subscriptionTier,
          primaryArchetype,
          topTrait: topTraitName,
        }).catch(() => {})
      }
    }

    // Generate delta observation if user has a prior profile for the same template
    if (process.env.ANTHROPIC_API_KEY && Object.keys(dimensionScores).length > 0) {
      try {
        const prevProfile = await prisma.profile.findFirst({
          where: {
            userId: req.user.userId,
            id: { not: profile.id },
            rawOutput: { path: ['templateType'], equals: templateType },
          },
          orderBy: { generatedAt: 'desc' },
          select: { dimensions: true },
        })

        if (prevProfile) {
          type DimScore = { normalized: number }
          const prev = prevProfile.dimensions as Record<string, DimScore>
          const curr = dimensionScores as Record<string, DimScore>
          const deltas: Record<string, number> = {}
          for (const key of Object.keys(curr)) {
            const p = prev[key]?.normalized ?? null
            const c = curr[key]?.normalized ?? null
            if (p !== null && c !== null) {
              const d = Math.round((c - p) * 100)
              if (d !== 0) deltas[key] = d
            }
          }
          const hasSignificant = Object.values(deltas).some((v) => Math.abs(v) > 10)
          if (hasSignificant) {
            const frameworkTitle =
              templateType === AssessmentType.VALUES_INVENTORY ? 'Schwartz Values Inventory' :
              templateType === AssessmentType.ATTACHMENT_STYLE ? 'Attachment Style Inventory' :
              templateType === AssessmentType.ENNEAGRAM ? 'Enneagram' :
              templateType === AssessmentType.LIGHT_DARK_TRIAD ? 'Light & Dark Triad' :
              templateType === AssessmentType.JUNGIAN_ARCHETYPES ? 'Jungian Archetypes' :
              'Big Five Personality'
            const observation = await generateDeltaObservation(frameworkTitle, deltas)
            await prisma.profile.update({
              where: { id: profile.id },
              data: {
                rawOutput: {
                  ...(profile.rawOutput as object),
                  deltaObservation: observation,
                },
              },
            })
          }
        }
      } catch (err) {
        server.log.warn({ err }, 'Delta observation generation failed — skipping')
      }
    }

    const updated = await prisma.session.update({
      where: { id: session.id },
      data: { status: SessionStatus.COMPLETED, completedAt: new Date() },
    })

    // Send profile reveal email on first-ever profile (fire-and-forget)
    try {
      const profileCount = await prisma.profile.count({ where: { userId: req.user.userId } })
      const alreadySentReveal = await prisma.onboardingEmail.findUnique({
        where: { userId_emailType: { userId: req.user.userId, emailType: 'profile_reveal' } },
      })
      if (profileCount === 1 && !alreadySentReveal) {
        const user = await prisma.user.findUnique({
          where: { id: req.user.userId },
          select: { email: true, name: true },
        })
        const frameworkLabel =
          templateType === AssessmentType.VALUES_INVENTORY ? 'Schwartz Values Inventory' :
          templateType === AssessmentType.ATTACHMENT_STYLE ? 'Attachment Style' :
          templateType === AssessmentType.ENNEAGRAM ? 'Enneagram' :
          templateType === AssessmentType.LIGHT_DARK_TRIAD ? 'Light & Dark Triad' :
          templateType === AssessmentType.JUNGIAN_ARCHETYPES ? 'Jungian Archetypes' :
          'Big Five Personality'
        if (user) {
          await sendProfileRevealEmail(user.email, user.name, profile.id, frameworkLabel)
          await prisma.onboardingEmail.create({
            data: { userId: req.user.userId, emailType: 'profile_reveal' },
          })
        }
      }
    } catch (err) {
      server.log.warn({ err }, 'Profile reveal email failed — skipping')
    }

    // Apply referral on first-ever assessment completion (fire-and-forget)
    try {
      const user = await prisma.user.findUnique({
        where: { id: req.user.userId },
        select: { referredByCode: true },
      })
      if (user?.referredByCode) {
        const completedCount = await prisma.session.count({
          where: { userId: req.user.userId, status: SessionStatus.COMPLETED },
        })
        // Only apply on the very first completed session
        if (completedCount === 1) {
          await applyReferral(req.user.userId, user.referredByCode, (msg) => server.log.info(msg))
        }
      }
    } catch (err) {
      server.log.warn({ err }, 'Referral apply failed — skipping')
    }

    return reply.send({ session: updated, profile })
  },
  )

  // GET /api/sessions/:id/results — get scored profile for a session
  server.get<{ Params: { id: string } }>('/:id/results', async (req, reply) => {
    const session = await prisma.session.findFirst({
      where: { id: req.params.id, userId: req.user.userId },
    })
    if (!session) {
      return reply.status(404).send({ error: 'Session not found' })
    }
    if (session.status !== SessionStatus.COMPLETED) {
      return reply.status(400).send({ error: 'Session not yet completed' })
    }

    // Find the profile created from this session
    const profile = await prisma.profile.findFirst({
      where: { userId: req.user.userId, rawOutput: { path: ['sessionId'], equals: session.id } },
      orderBy: { version: 'desc' },
    })
    if (!profile) {
      return reply.status(404).send({ error: 'No profile found for this session' })
    }

    return reply.send({ profile })
  })

  // PATCH /api/sessions/:id/tags — set context tags for a session
  server.patch<{ Params: { id: string }; Body: { tags: string[] } }>(
    '/:id/tags',
    async (req, reply) => {
      const { tags } = req.body as { tags?: string[] }
      if (!Array.isArray(tags)) {
        return reply.status(400).send({ error: 'tags must be an array of strings' })
      }
      const cleaned = tags
        .map((t: string) => String(t).trim().slice(0, 50))
        .filter(Boolean)
        .slice(0, 10)

      const session = await prisma.session.findFirst({
        where: { id: req.params.id, userId: req.user.userId },
      })
      if (!session) {
        return reply.status(404).send({ error: 'Session not found' })
      }

      const updated = await prisma.session.update({
        where: { id: session.id },
        data: { contextTags: cleaned },
        select: { id: true, contextTags: true },
      })
      return reply.send({ session: updated })
    },
  )
}
