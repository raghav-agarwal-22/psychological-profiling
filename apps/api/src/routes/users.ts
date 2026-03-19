import type { FastifyInstance } from 'fastify'
import { prisma, SessionStatus } from '@innermind/db'
import { requireAuth } from '../lib/auth.js'

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
              generatedAt: profile.generatedAt,
            }
          : null,
        deltas,
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
}
