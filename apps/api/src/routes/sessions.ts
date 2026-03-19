import type { FastifyInstance } from 'fastify'
import { z } from 'zod'
import { prisma, SessionStatus, AssessmentStatus, computeScores, type ScoringConfig } from '@innermind/db'
import { requireAuth } from '../lib/auth.js'
import { generateProfileNarrative } from '../lib/profile-generator.js'

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
  server.post<{ Params: { id: string } }>('/:id/complete', async (req, reply) => {
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
    for (const assessment of session.assessments) {
      if (!assessment.template) continue

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

    // Generate AI narrative if we have scores and ANTHROPIC_API_KEY is set
    let narrative = null
    if (Object.keys(dimensionScores).length > 0 && process.env.ANTHROPIC_API_KEY) {
      try {
        narrative = await generateProfileNarrative(dimensionScores)
      } catch (err) {
        server.log.warn({ err }, 'AI profile generation failed — storing numeric scores only')
      }
    }

    // Unmark previous latest profile
    await prisma.profile.updateMany({
      where: { userId: req.user.userId, isLatest: true },
      data: { isLatest: false },
    })

    const profile = await prisma.profile.create({
      data: {
        userId: req.user.userId,
        version: 1,
        isLatest: true,
        summary: narrative?.summary ?? 'Profile generated from assessment responses.',
        dimensions: dimensionScores,
        archetypes: narrative?.archetype ? [narrative.archetype] : [],
        values: narrative?.values ?? [],
        blindSpots: narrative?.blind_spots ?? [],
        strengths: narrative?.strengths ?? [],
        rawOutput: { sessionId: session.id, scores: dimensionScores, narrative } as object,
      },
    })

    const updated = await prisma.session.update({
      where: { id: session.id },
      data: { status: SessionStatus.COMPLETED, completedAt: new Date() },
    })

    return reply.send({ session: updated, profile })
  })

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
}
