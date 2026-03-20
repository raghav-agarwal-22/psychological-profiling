import type { FastifyInstance } from 'fastify'
import { z } from 'zod'
import { prisma, AssessmentType, AssessmentStatus } from '@innermind/db'
import { requireAuth } from '../lib/auth.js'

const createAssessmentSchema = z.object({
  sessionId: z.string().cuid(),
  type: z.nativeEnum(AssessmentType),
  title: z.string().min(1).max(200),
  description: z.string().optional(),
})

const updateResponseSchema = z.object({
  step: z.number().int().min(0),
  response: z.record(z.unknown()),
})

export async function assessmentRoutes(server: FastifyInstance) {
  // All routes require auth
  server.addHook('preHandler', requireAuth)

  // GET /api/assessments — list assessments for the current user
  server.get('/', async (req, reply) => {
    const assessments = await prisma.assessment.findMany({
      where: { userId: req.user.userId },
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        sessionId: true,
        type: true,
        title: true,
        status: true,
        currentStep: true,
        totalSteps: true,
        startedAt: true,
        completedAt: true,
        createdAt: true,
      },
    })
    return reply.send({ assessments })
  })

  // POST /api/assessments — create a new assessment
  server.post('/', async (req, reply) => {
    const body = createAssessmentSchema.safeParse(req.body)
    if (!body.success) {
      return reply.status(400).send({ error: 'Invalid request', issues: body.error.issues })
    }

    // Essential+ assessment types (Values, Attachment, Enneagram, Light & Dark Triad)
    const ESSENTIAL_TYPES: AssessmentType[] = [
      AssessmentType.VALUES_INVENTORY,
      AssessmentType.ATTACHMENT_STYLE,
      AssessmentType.ENNEAGRAM,
      AssessmentType.LIGHT_DARK_TRIAD,
    ]
    if (ESSENTIAL_TYPES.includes(body.data.type)) {
      const user = await prisma.user.findUnique({
        where: { id: req.user.userId },
        select: { subscriptionTier: true },
      })
      if (user?.subscriptionTier !== 'pro' && user?.subscriptionTier !== 'essential') {
        return reply.status(403).send({ error: 'Essential or Pro subscription required for this assessment type', upgradeUrl: '/upgrade' })
      }
    }

    // Verify session belongs to user
    const session = await prisma.session.findFirst({
      where: { id: body.data.sessionId, userId: req.user.userId },
    })
    if (!session) {
      return reply.status(404).send({ error: 'Session not found' })
    }

    // Auto-link the active template for this type so scoring works at session completion
    const template = await prisma.assessmentTemplate.findFirst({
      where: { type: body.data.type, isActive: true },
      orderBy: { createdAt: 'desc' },
      select: { id: true, questionBank: true },
    })

    // Derive totalSteps from question bank length for accurate progress tracking
    const questionCount = Array.isArray(template?.questionBank)
      ? (template.questionBank as unknown[]).length
      : null

    const assessment = await prisma.assessment.create({
      data: {
        userId: req.user.userId,
        sessionId: body.data.sessionId,
        type: body.data.type,
        title: body.data.title,
        description: body.data.description,
        status: AssessmentStatus.NOT_STARTED,
        templateId: template?.id ?? null,
        totalSteps: questionCount,
      },
    })

    return reply.status(201).send({ assessment })
  })

  // GET /api/assessments/:id — get a specific assessment
  server.get<{ Params: { id: string } }>('/:id', async (req, reply) => {
    const assessment = await prisma.assessment.findFirst({
      where: { id: req.params.id, userId: req.user.userId },
    })
    if (!assessment) {
      return reply.status(404).send({ error: 'Assessment not found' })
    }
    return reply.send({ assessment })
  })

  // PATCH /api/assessments/:id/respond — submit a response to a step
  server.patch<{ Params: { id: string } }>('/:id/respond', async (req, reply) => {
    const body = updateResponseSchema.safeParse(req.body)
    if (!body.success) {
      return reply.status(400).send({ error: 'Invalid request', issues: body.error.issues })
    }

    const assessment = await prisma.assessment.findFirst({
      where: { id: req.params.id, userId: req.user.userId },
    })
    if (!assessment) {
      return reply.status(404).send({ error: 'Assessment not found' })
    }

    const existingResponses = assessment.rawResponses as Record<string, unknown>
    const updatedResponses = {
      ...existingResponses,
      [body.data.step]: body.data.response,
    }

    const updated = await prisma.assessment.update({
      where: { id: assessment.id },
      data: {
        rawResponses: updatedResponses,
        currentStep: body.data.step + 1,
        status: AssessmentStatus.IN_PROGRESS,
        startedAt: assessment.startedAt ?? new Date(),
      },
    })

    return reply.send({ assessment: updated })
  })

  // POST /api/assessments/:id/complete — mark assessment as complete
  server.post<{ Params: { id: string } }>('/:id/complete', async (req, reply) => {
    const assessment = await prisma.assessment.findFirst({
      where: { id: req.params.id, userId: req.user.userId },
    })
    if (!assessment) {
      return reply.status(404).send({ error: 'Assessment not found' })
    }

    const updated = await prisma.assessment.update({
      where: { id: assessment.id },
      data: {
        status: AssessmentStatus.COMPLETED,
        completedAt: new Date(),
      },
    })

    return reply.send({ assessment: updated })
  })
}
