import type { FastifyInstance } from 'fastify'
import { prisma } from '@innermind/db'
import { generateCompatibilityNarrative, type FrameworkContext } from '../lib/profile-generator.js'

interface DimensionScore {
  normalized: number
}

function computeOverlapScores(
  dimsA: Record<string, DimensionScore>,
  dimsB: Record<string, DimensionScore>,
): Record<string, { scoreA: number; scoreB: number; overlap: number }> {
  const result: Record<string, { scoreA: number; scoreB: number; overlap: number }> = {}
  const sharedKeys = Object.keys(dimsA).filter((k) => k in dimsB)
  for (const key of sharedKeys) {
    const scoreA = dimsA[key]?.normalized ?? 0
    const scoreB = dimsB[key]?.normalized ?? 0
    result[key] = {
      scoreA,
      scoreB,
      overlap: Math.round(100 - Math.abs(scoreA - scoreB)),
    }
  }
  return result
}

function overallCompatibility(overlapScores: Record<string, { overlap: number }>): number {
  const values = Object.values(overlapScores)
  if (values.length === 0) return 0
  return Math.round(values.reduce((sum, v) => sum + v.overlap, 0) / values.length)
}

function buildFrameworks(profile: {
  summary: string
  dimensions: unknown
  rawOutput: unknown
}): FrameworkContext[] {
  const raw = profile.rawOutput as Record<string, unknown> | null
  const templateType = (raw?.templateType as string | undefined) ?? 'BIG_FIVE'
  const title =
    templateType === 'VALUES_INVENTORY'
      ? 'Schwartz Values Inventory'
      : templateType === 'ATTACHMENT_STYLE'
        ? 'Attachment Style Inventory'
        : 'Big Five Personality'

  return [
    {
      type: templateType,
      title,
      scores: profile.dimensions as Record<string, { normalized: number }>,
      summary: profile.summary,
    },
  ]
}

export async function compareRoutes(server: FastifyInstance) {
  // GET /api/compare?a={shareTokenA}&b={shareTokenB}
  // Public endpoint — no auth required. Uses share tokens so only shared profiles are comparable.
  server.get<{ Querystring: { a?: string; b?: string } }>('/', async (req, reply) => {
    const { a, b } = req.query

    if (!a || !b) {
      return reply.status(400).send({ error: 'Query params a and b (share tokens) are required' })
    }
    if (a === b) {
      return reply.status(400).send({ error: 'Cannot compare a profile with itself' })
    }

    const [profileA, profileB] = await Promise.all([
      prisma.profile.findFirst({
        where: { shareToken: a, isPublic: true },
        select: {
          id: true,
          summary: true,
          dimensions: true,
          archetypes: true,
          values: true,
          strengths: true,
          blindSpots: true,
          rawOutput: true,
          shareToken: true,
          generatedAt: true,
        },
      }),
      prisma.profile.findFirst({
        where: { shareToken: b, isPublic: true },
        select: {
          id: true,
          summary: true,
          dimensions: true,
          archetypes: true,
          values: true,
          strengths: true,
          blindSpots: true,
          rawOutput: true,
          shareToken: true,
          generatedAt: true,
        },
      }),
    ])

    if (!profileA) {
      return reply.status(404).send({ error: 'Profile A not found or not public' })
    }
    if (!profileB) {
      return reply.status(404).send({ error: 'Profile B not found or not public' })
    }

    const dimsA = profileA.dimensions as unknown as Record<string, DimensionScore>
    const dimsB = profileB.dimensions as unknown as Record<string, DimensionScore>
    const overlapScores = computeOverlapScores(dimsA, dimsB)
    const compatibilityScore = overallCompatibility(overlapScores)

    // Generate AI compatibility narrative (graceful fallback if AI unavailable)
    let narrative: Awaited<ReturnType<typeof generateCompatibilityNarrative>>
    try {
      const frameworksA = buildFrameworks(profileA)
      const frameworksB = buildFrameworks(profileB)
      narrative = await generateCompatibilityNarrative(
        { label: 'Person A', frameworks: frameworksA },
        { label: 'Person B', frameworks: frameworksB },
      )
    } catch {
      narrative = {
        overallNarrative: 'Compatibility analysis based on dimension scores.',
        whatWorks: [],
        watchFor: [],
        complementaryStrengths: 'Profiles show complementary patterns across dimensions.',
        growthOpportunities: 'Each profile brings unique strengths to the relationship.',
      }
    }

    return reply.send({
      profileA: {
        id: profileA.id,
        summary: profileA.summary,
        dimensions: profileA.dimensions,
        archetypes: profileA.archetypes,
        values: profileA.values,
        strengths: profileA.strengths,
        blindSpots: profileA.blindSpots,
        shareToken: profileA.shareToken,
        generatedAt: profileA.generatedAt,
      },
      profileB: {
        id: profileB.id,
        summary: profileB.summary,
        dimensions: profileB.dimensions,
        archetypes: profileB.archetypes,
        values: profileB.values,
        strengths: profileB.strengths,
        blindSpots: profileB.blindSpots,
        shareToken: profileB.shareToken,
        generatedAt: profileB.generatedAt,
      },
      overlapScores,
      compatibilityScore,
      narrative,
    })
  })
}
