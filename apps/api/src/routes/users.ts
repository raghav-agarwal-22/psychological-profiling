import type { FastifyInstance } from 'fastify'
import { prisma, SessionStatus } from '@innermind/db'
import { requireAuth } from '../lib/auth.js'
import { generateCrossFrameworkSynthesis } from '../lib/profile-generator.js'

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
}
