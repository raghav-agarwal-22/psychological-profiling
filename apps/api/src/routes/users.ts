import type { FastifyInstance } from 'fastify'
import { z } from 'zod'
import { prisma, SessionStatus } from '@innermind/db'
import { requireAuth } from '../lib/auth.js'
import { generateCrossFrameworkSynthesis, generateGrowthRecommendations } from '../lib/profile-generator.js'

const createJournalEntrySchema = z.object({
  body: z.string().min(1).max(10000),
  title: z.string().max(200).optional(),
  profileId: z.string().cuid().optional(),
  prompt: z.string().max(500).optional(),
  tags: z.array(z.string().max(50)).max(10).optional(),
})

interface DimensionScore {
  normalized: number
  raw?: number
  responseCount?: number
}

function extractSessionId(rawOutput: unknown): string | null {
  if (rawOutput && typeof rawOutput === 'object' && 'sessionId' in rawOutput) {
    return (rawOutput as Record<string, unknown>).sessionId as string
  }
  return null
}

function computeDeltas(
  prev: Record<string, DimensionScore>,
  curr: Record<string, DimensionScore>,
): Record<string, number> {
  const deltas: Record<string, number> = {}
  for (const key of Object.keys(curr)) {
    const prevScore = prev[key]?.normalized ?? null
    const currScore = curr[key]?.normalized ?? null
    if (prevScore !== null && currScore !== null) {
      const delta = Math.round((currScore - prevScore) * 100)
      if (delta !== 0) deltas[key] = delta
    }
  }
  return deltas
}

export async function userRoutes(server: FastifyInstance) {
  server.addHook('preHandler', requireAuth)

  // GET /api/users/me/sessions — completed sessions with profile summaries and deltas
  server.get('/me/sessions', async (req, reply) => {
    // Fetch completed sessions, newest first, with first assessment's template
    const sessions = await prisma.session.findMany({
      where: { userId: req.user.userId, status: SessionStatus.COMPLETED },
      orderBy: { completedAt: 'desc' },
      select: {
        id: true,
        title: true,
        status: true,
        completedAt: true,
        createdAt: true,
        assessments: {
          select: {
            template: { select: { title: true, type: true } },
          },
          take: 1,
        },
      },
    })

    // Fetch all profiles for this user in one query
    const profiles = await prisma.profile.findMany({
      where: { userId: req.user.userId },
      select: {
        id: true,
        summary: true,
        archetypes: true,
        dimensions: true,
        generatedAt: true,
        rawOutput: true,
      },
    })

    // Build sessionId -> profile map
    const profileBySession = new Map<string, (typeof profiles)[0]>()
    for (const p of profiles) {
      const sid = extractSessionId(p.rawOutput)
      if (sid) profileBySession.set(sid, p)
    }

    // Group sessions by template type for delta computation (oldest first per template)
    const sessionsByTemplate = new Map<string, typeof sessions>()
    for (const s of [...sessions].reverse()) {
      const templateType = s.assessments[0]?.template?.type ?? 'UNKNOWN'
      if (!sessionsByTemplate.has(templateType)) sessionsByTemplate.set(templateType, [])
      sessionsByTemplate.get(templateType)!.push(s)
    }

    // Build result with deltas
    const result = sessions.map((session) => {
      const profile = profileBySession.get(session.id)
      const templateType = session.assessments[0]?.template?.type ?? 'UNKNOWN'
      const templateTitle = session.assessments[0]?.template?.title ?? null

      // Find previous session for same template (by completedAt order)
      let deltas: Record<string, number> | null = null
      const templateSessions = sessionsByTemplate.get(templateType) ?? []
      const idx = templateSessions.findIndex((s) => s.id === session.id)
      if (idx > 0 && profile) {
        const prevSession = templateSessions[idx - 1]
        const prevProfile = prevSession ? profileBySession.get(prevSession.id) : undefined
        if (prevProfile) {
          deltas = computeDeltas(
            prevProfile.dimensions as unknown as Record<string, DimensionScore>,
            profile.dimensions as unknown as Record<string, DimensionScore>,
          )
        }
      }

      const raw = profile?.rawOutput as Record<string, unknown> | null
      const deltaObservation =
        raw && typeof raw.deltaObservation === 'string' ? raw.deltaObservation : null

      return {
        id: session.id,
        title: session.title,
        templateType,
        templateTitle,
        completedAt: session.completedAt,
        createdAt: session.createdAt,
        profile: profile
          ? {
              id: profile.id,
              summary: profile.summary,
              archetypes: profile.archetypes,
              dimensions: profile.dimensions,
              generatedAt: profile.generatedAt,
            }
          : null,
        deltas,
        deltaObservation,
      }
    })

    return reply.send({ sessions: result })
  })

  // GET /api/users/me/sessions/compare?a=sessionIdA&b=sessionIdB
  server.get<{ Querystring: { a: string; b: string } }>(
    '/me/sessions/compare',
    async (req, reply) => {
      const { a, b } = req.query as { a?: string; b?: string }
      if (!a || !b) {
        return reply.status(400).send({ error: 'Query params a and b (session IDs) are required' })
      }

      // Verify both sessions belong to the user
      const sessions = await prisma.session.findMany({
        where: { id: { in: [a, b] }, userId: req.user.userId, status: SessionStatus.COMPLETED },
        select: { id: true },
      })
      if (sessions.length !== 2) {
        return reply.status(404).send({ error: 'One or both sessions not found or not completed' })
      }

      const profileA = await prisma.profile.findFirst({
        where: { rawOutput: { path: ['sessionId'], equals: a } },
        select: { dimensions: true },
      })
      const profileB = await prisma.profile.findFirst({
        where: { rawOutput: { path: ['sessionId'], equals: b } },
        select: { dimensions: true },
      })

      if (!profileA || !profileB) {
        return reply.status(404).send({ error: 'Profile not found for one or both sessions' })
      }

      const deltas = computeDeltas(
        profileA.dimensions as unknown as Record<string, DimensionScore>,
        profileB.dimensions as unknown as Record<string, DimensionScore>,
      )

      return reply.send({ deltas, sessionA: a, sessionB: b })
    },
  )

  // GET /api/users/me/synthesis — get cached synthesis
  server.get('/me/synthesis', async (req, reply) => {
    const user = await prisma.user.findUnique({
      where: { id: req.user.userId },
      select: { synthesis: true, synthesisGeneratedAt: true },
    })
    if (!user?.synthesis) {
      return reply.status(404).send({ error: 'No synthesis yet. Complete at least one assessment.' })
    }
    return reply.send({
      synthesis: user.synthesis,
      generatedAt: user.synthesisGeneratedAt,
    })
  })

  // POST /api/users/me/synthesis/generate — (re)generate synthesis, streams response
  server.post('/me/synthesis/generate', async (req, reply) => {
    // Rate limit: at most once per hour
    const user = await prisma.user.findUnique({
      where: { id: req.user.userId },
      select: { synthesisGeneratedAt: true },
    })
    if (user?.synthesisGeneratedAt) {
      const elapsed = Date.now() - user.synthesisGeneratedAt.getTime()
      const ONE_HOUR = 60 * 60 * 1000
      if (elapsed < ONE_HOUR) {
        const remainingMinutes = Math.ceil((ONE_HOUR - elapsed) / 60000)
        return reply.status(429).send({
          error: `Synthesis can be regenerated once per hour. Try again in ${remainingMinutes} minute${remainingMinutes !== 1 ? 's' : ''}.`,
        })
      }
    }

    // Gather all completed profiles for this user
    const profiles = await prisma.profile.findMany({
      where: { userId: req.user.userId },
      orderBy: { generatedAt: 'asc' },
      select: { summary: true, dimensions: true, rawOutput: true },
    })

    if (profiles.length === 0) {
      return reply.status(400).send({ error: 'Complete at least one assessment before generating a synthesis.' })
    }

    // Build framework contexts
    const frameworks = profiles.map((p) => {
      const raw = p.rawOutput as Record<string, unknown>
      const templateType = (raw.templateType as string | undefined) ?? 'BIG_FIVE'
      const title = templateType === 'VALUES_INVENTORY' ? 'Schwartz Values Inventory' : 'Big Five Personality'
      const dims = p.dimensions as Record<string, { normalized: number }>
      return { type: templateType, title, scores: dims, summary: p.summary }
    })

    // Hijack reply so Fastify doesn't interfere with raw streaming
    reply.hijack()
    const origin = req.headers.origin ?? '*'
    reply.raw.setHeader('Content-Type', 'text/plain; charset=utf-8')
    reply.raw.setHeader('Transfer-Encoding', 'chunked')
    reply.raw.setHeader('Cache-Control', 'no-cache')
    reply.raw.setHeader('Access-Control-Allow-Origin', origin)
    reply.raw.setHeader('Access-Control-Allow-Credentials', 'true')
    reply.raw.writeHead(200)

    let fullText = ''
    try {
      fullText = await generateCrossFrameworkSynthesis(frameworks, (chunk) => {
        reply.raw.write(chunk)
      })
    } finally {
      reply.raw.end()
    }

    // Persist synthesis to user record (fire-and-forget after streaming)
    await prisma.user.update({
      where: { id: req.user.userId },
      data: {
        synthesis: fullText,
        synthesisGeneratedAt: new Date(),
      },
    })
  })

  // ─── Journal ─────────────────────────────────────────────────────────────

  // GET /api/users/me/journal — list journal entries (newest first)
  server.get('/me/journal', async (req, reply) => {
    const entries = await prisma.journalEntry.findMany({
      where: { userId: req.user.userId },
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        title: true,
        body: true,
        prompt: true,
        profileId: true,
        tags: true,
        createdAt: true,
        updatedAt: true,
      },
    })
    return reply.send({ entries })
  })

  // POST /api/users/me/journal — create a journal entry
  server.post('/me/journal', async (req, reply) => {
    const parsed = createJournalEntrySchema.safeParse(req.body)
    if (!parsed.success) {
      return reply.status(400).send({ error: 'Invalid request', issues: parsed.error.issues })
    }

    // Verify profileId belongs to this user if provided
    if (parsed.data.profileId) {
      const profile = await prisma.profile.findFirst({
        where: { id: parsed.data.profileId, userId: req.user.userId },
        select: { id: true },
      })
      if (!profile) {
        return reply.status(404).send({ error: 'Profile not found' })
      }
    }

    const entry = await prisma.journalEntry.create({
      data: {
        userId: req.user.userId,
        body: parsed.data.body,
        title: parsed.data.title,
        profileId: parsed.data.profileId,
        prompt: parsed.data.prompt,
        tags: parsed.data.tags ?? [],
      },
      select: {
        id: true,
        title: true,
        body: true,
        prompt: true,
        profileId: true,
        tags: true,
        createdAt: true,
        updatedAt: true,
      },
    })

    return reply.status(201).send({ entry })
  })

  // DELETE /api/users/me/journal/:entryId — delete a journal entry
  server.delete<{ Params: { entryId: string } }>('/me/journal/:entryId', async (req, reply) => {
    const entry = await prisma.journalEntry.findFirst({
      where: { id: req.params.entryId, userId: req.user.userId },
    })
    if (!entry) {
      return reply.status(404).send({ error: 'Entry not found' })
    }

    await prisma.journalEntry.delete({ where: { id: entry.id } })
    return reply.send({ ok: true })
  })

  // ─── Growth Recommendations ──────────────────────────────────────────────

  // GET /api/users/me/recommendations — get cached growth recommendations
  server.get('/me/recommendations', async (req, reply) => {
    const user = await prisma.user.findUnique({
      where: { id: req.user.userId },
      select: { growthRecommendations: true, recommendationsGeneratedAt: true },
    })
    if (!user?.growthRecommendations) {
      return reply.status(404).send({ error: 'No recommendations yet. Complete at least one assessment.' })
    }
    return reply.send({
      recommendations: user.growthRecommendations,
      generatedAt: user.recommendationsGeneratedAt,
    })
  })

  // POST /api/users/me/recommendations/generate — (re)generate recommendations
  server.post('/me/recommendations/generate', async (req, reply) => {
    // Rate limit: at most once per 6 hours
    const user = await prisma.user.findUnique({
      where: { id: req.user.userId },
      select: { recommendationsGeneratedAt: true },
    })
    if (user?.recommendationsGeneratedAt) {
      const elapsed = Date.now() - user.recommendationsGeneratedAt.getTime()
      const SIX_HOURS = 6 * 60 * 60 * 1000
      if (elapsed < SIX_HOURS) {
        const remainingHours = Math.ceil((SIX_HOURS - elapsed) / 3600000)
        return reply.status(429).send({
          error: `Recommendations can be regenerated every 6 hours. Try again in ${remainingHours} hour${remainingHours !== 1 ? 's' : ''}.`,
        })
      }
    }

    const profiles = await prisma.profile.findMany({
      where: { userId: req.user.userId },
      orderBy: { generatedAt: 'asc' },
      select: { summary: true, dimensions: true, rawOutput: true },
    })

    if (profiles.length === 0) {
      return reply.status(400).send({ error: 'Complete at least one assessment before generating recommendations.' })
    }

    const frameworks = profiles.map((p) => {
      const raw = p.rawOutput as Record<string, unknown>
      const templateType = (raw.templateType as string | undefined) ?? 'BIG_FIVE'
      const title =
        templateType === 'VALUES_INVENTORY'
          ? 'Schwartz Values Inventory'
          : templateType === 'ATTACHMENT_STYLE'
            ? 'Attachment Style Inventory'
            : 'Big Five Personality'
      const dims = p.dimensions as Record<string, { normalized: number }>
      return { type: templateType, title, scores: dims, summary: p.summary }
    })

    const output = await generateGrowthRecommendations(frameworks)

    await prisma.user.update({
      where: { id: req.user.userId },
      data: {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        growthRecommendations: output as any,
        recommendationsGeneratedAt: new Date(),
      },
    })

    return reply.send({ recommendations: output, generatedAt: new Date() })
  })

  // GET /api/users/me/reassessment-status — check if user is due for reassessment
  server.get('/me/reassessment-status', async (req, reply) => {
    // Find the most recent completed session per assessment framework
    const sessions = await prisma.session.findMany({
      where: { userId: req.user.userId, status: 'COMPLETED' },
      orderBy: { completedAt: 'desc' },
      select: {
        id: true,
        completedAt: true,
        assessments: {
          select: { template: { select: { type: true, title: true } } },
          take: 1,
        },
      },
    })

    const NUDGE_THRESHOLD_DAYS = 90
    const now = Date.now()

    // Group by template type, keep most recent per type
    const latestByType = new Map<string, { completedAt: Date; title: string }>()
    for (const s of sessions) {
      const templateType = s.assessments[0]?.template?.type
      const title = s.assessments[0]?.template?.title
      if (templateType && s.completedAt && !latestByType.has(templateType)) {
        latestByType.set(templateType, { completedAt: s.completedAt, title: title ?? templateType })
      }
    }

    const nudges = Array.from(latestByType.entries()).map(([type, { completedAt, title }]) => {
      const daysSince = Math.floor((now - completedAt.getTime()) / 86400000)
      return {
        frameworkType: type,
        frameworkTitle: title,
        daysSince,
        lastAssessedAt: completedAt,
        nudgeActive: daysSince >= NUDGE_THRESHOLD_DAYS,
      }
    })

    const hasActiveNudge = nudges.some((n) => n.nudgeActive)

    return reply.send({ nudges, hasActiveNudge })
  })
}
