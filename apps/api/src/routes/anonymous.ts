import type { FastifyInstance } from 'fastify'
import { z } from 'zod'
import crypto from 'node:crypto'
import { prisma, AssessmentType, SessionStatus, AssessmentStatus, computeScores, type ScoringConfig } from '@innermind/db'
import {
  generateProfileNarrative,
  generateValuesNarrative,
  generateAttachmentNarrative,
  generateTriadNarrative,
  generateEnneagramNarrative,
  generateJungianNarrative,
  generateReflectionPrompts,
} from '../lib/profile-generator.js'

const createSessionSchema = z.object({
  templateId: z.string().cuid(),
  referralCode: z.string().max(100).optional(),
})

const completeSchema = z.object({
  responses: z.array(
    z.object({
      questionId: z.string().min(1),
      value: z.number().int().min(1).max(5),
    }),
  ).min(1),
})

const claimSchema = z.object({
  anonSessionId: z.string().cuid(),
  guestToken: z.string().min(1),
  email: z.string().email(),
  name: z.string().max(200).optional(),
})

function getGuestToken(req: { headers: Record<string, string | string[] | undefined> }): string | null {
  const raw = req.headers['x-guest-token']
  if (!raw) return null
  return Array.isArray(raw) ? (raw[0] ?? null) : raw
}

export async function anonymousRoutes(server: FastifyInstance) {
  // POST /api/anon/sessions — start an anonymous assessment session
  server.post('/sessions', async (req, reply) => {
    const body = createSessionSchema.safeParse(req.body)
    if (!body.success) {
      return reply.status(400).send({ error: 'Invalid request', issues: body.error.issues })
    }

    const template = await prisma.assessmentTemplate.findUnique({
      where: { id: body.data.templateId },
      select: { id: true, type: true, isActive: true },
    })
    if (!template || !template.isActive) {
      return reply.status(404).send({ error: 'Template not found' })
    }

    // Allow all assessment types with narrative generators anonymously
    const ANON_ALLOWED: string[] = [
      AssessmentType.BIG_FIVE,
      AssessmentType.JUNGIAN_ARCHETYPES,
      AssessmentType.VALUES_INVENTORY,
      AssessmentType.ATTACHMENT_STYLE,
      AssessmentType.ENNEAGRAM,
      AssessmentType.LIGHT_DARK_TRIAD,
    ]
    if (!ANON_ALLOWED.includes(template.type)) {
      return reply.status(403).send({ error: 'This assessment type requires an account' })
    }

    const guestToken = crypto.randomBytes(32).toString('hex')
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000) // 24h

    const anonSession = await prisma.anonymousSession.create({
      data: {
        guestToken,
        templateId: template.id,
        templateType: template.type,
        referralCode: body.data.referralCode ?? null,
        expiresAt,
      },
    })

    return reply.status(201).send({ anonSessionId: anonSession.id, guestToken })
  })

  // POST /api/anon/sessions/:id/complete — score responses + generate profile
  server.post<{ Params: { id: string } }>('/sessions/:id/complete', async (req, reply) => {
    const guestToken = getGuestToken(req as Parameters<typeof getGuestToken>[0])
    if (!guestToken) {
      return reply.status(401).send({ error: 'Missing guest token' })
    }

    const body = completeSchema.safeParse(req.body)
    if (!body.success) {
      return reply.status(400).send({ error: 'Invalid request', issues: body.error.issues })
    }

    const anonSession = await prisma.anonymousSession.findFirst({
      where: { id: req.params.id, guestToken, claimedByUserId: null },
    })
    if (!anonSession) {
      return reply.status(404).send({ error: 'Anonymous session not found' })
    }
    if (anonSession.expiresAt < new Date()) {
      return reply.status(410).send({ error: 'Anonymous session expired' })
    }
    if (anonSession.profileJson) {
      return reply.status(409).send({ error: 'Session already completed' })
    }

    // Fetch template with scoring config
    const template = await prisma.assessmentTemplate.findUnique({
      where: { id: anonSession.templateId },
    })
    if (!template) {
      return reply.status(404).send({ error: 'Template not found' })
    }

    // Score responses
    const scoringConfig = template.scoringConfig as unknown as ScoringConfig
    const responseMap: Record<string, number> = {}
    for (const r of body.data.responses) {
      responseMap[r.questionId] = r.value
    }
    const dimensionScores = computeScores(responseMap, scoringConfig)
    const templateType = template.type

    // Generate AI narrative
    let narrative = null
    let valuesNarrative = null
    let attachmentNarrative = null
    let triadNarrative = null
    let enneagramNarrative = null
    let jungianNarrative = null
    if (Object.keys(dimensionScores).length > 0 && process.env.ANTHROPIC_API_KEY) {
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
        server.log.warn({ err }, 'Anon AI profile generation failed — storing numeric scores only')
      }
    }

    // Build profile fields
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
      summary = narrative?.summary ?? 'Profile generated from assessment responses.'
      archetypes = narrative?.archetype ? [narrative.archetype] : []
      values = narrative?.values ?? []
      blindSpots = narrative?.blind_spots ?? []
      strengths = narrative?.strengths ?? []
    }

    let reflectionPrompts: string[] = []
    if (Object.keys(dimensionScores).length > 0 && process.env.ANTHROPIC_API_KEY) {
      try {
        reflectionPrompts = await generateReflectionPrompts(dimensionScores, templateType)
      } catch (err) {
        server.log.warn({ err }, 'Anon reflection prompt generation failed — skipping')
      }
    }

    const profileJson = {
      summary,
      archetypes,
      values,
      blindSpots,
      strengths,
      dimensions: dimensionScores,
      templateType,
      rawNarrative: narrative ?? valuesNarrative ?? attachmentNarrative ?? triadNarrative ?? enneagramNarrative ?? jungianNarrative,
      reflectionPrompts,
    }

    const archetypeName = archetypes[0] ?? null

    await prisma.anonymousSession.update({
      where: { id: anonSession.id },
      data: { profileJson: profileJson as object, archetypeName },
    })

    return reply.send({ archetypeName, summary })
  })

  // GET /api/anon/sessions/:id — get teaser data (public archetype + summary)
  server.get<{ Params: { id: string } }>('/sessions/:id', async (req, reply) => {
    const guestToken = getGuestToken(req as Parameters<typeof getGuestToken>[0])
    if (!guestToken) {
      return reply.status(401).send({ error: 'Missing guest token' })
    }

    const anonSession = await prisma.anonymousSession.findFirst({
      where: { id: req.params.id, guestToken },
      select: {
        id: true,
        templateType: true,
        archetypeName: true,
        profileJson: true,
        claimedByUserId: true,
        expiresAt: true,
      },
    })
    if (!anonSession) {
      return reply.status(404).send({ error: 'Anonymous session not found' })
    }
    if (anonSession.expiresAt < new Date()) {
      return reply.status(410).send({ error: 'Anonymous session expired' })
    }

    const isComplete = anonSession.profileJson !== null
    const isClaimed = anonSession.claimedByUserId !== null

    return reply.send({
      anonSessionId: anonSession.id,
      templateType: anonSession.templateType,
      archetypeName: anonSession.archetypeName,
      isComplete,
      isClaimed,
      // Partial profile for teaser — first 300 chars of summary only
      summaryTeaser: isComplete
        ? ((anonSession.profileJson as { summary?: string })?.summary ?? '').slice(0, 300)
        : null,
    })
  })

  // POST /api/anon/claim — convert anonymous profile to a real account
  server.post('/claim', async (req, reply) => {
    const body = claimSchema.safeParse(req.body)
    if (!body.success) {
      return reply.status(400).send({ error: 'Invalid request', issues: body.error.issues })
    }

    const { anonSessionId, guestToken, email, name } = body.data

    const anonSession = await prisma.anonymousSession.findFirst({
      where: { id: anonSessionId, guestToken },
    })
    if (!anonSession) {
      return reply.status(404).send({ error: 'Anonymous session not found' })
    }
    if (anonSession.expiresAt < new Date()) {
      return reply.status(410).send({ error: 'Anonymous session expired' })
    }
    if (!anonSession.profileJson) {
      return reply.status(400).send({ error: 'Assessment not yet completed' })
    }
    if (anonSession.claimedByUserId) {
      return reply.status(409).send({ error: 'Session already claimed' })
    }

    // Upsert user (handles existing accounts)
    const user = await prisma.user.upsert({
      where: { email },
      update: { name: name ?? undefined },
      create: { email, name },
    })

    // Apply referral / affiliate attribution if tracked
    if (anonSession.referralCode && !user.referredByCode) {
      await prisma.user.update({
        where: { id: user.id },
        data: { referredByCode: anonSession.referralCode },
      })
    }

    const profileData = anonSession.profileJson as {
      summary: string
      archetypes: string[]
      values: string[]
      blindSpots: string[]
      strengths: string[]
      dimensions: object
      templateType: string
      rawNarrative: unknown
      reflectionPrompts: string[]
    }

    // Unmark previous latest profile
    await prisma.profile.updateMany({
      where: { userId: user.id, isLatest: true },
      data: { isLatest: false },
    })

    // Create a real session + assessment + profile
    const session = await prisma.session.create({
      data: {
        userId: user.id,
        title: `${profileData.templateType.replace(/_/g, ' ')} (from anonymous assessment)`,
        status: SessionStatus.COMPLETED,
        completedAt: new Date(),
      },
    })

    const template = await prisma.assessmentTemplate.findUnique({
      where: { id: anonSession.templateId },
      select: { id: true },
    })

    await prisma.assessment.create({
      data: {
        userId: user.id,
        sessionId: session.id,
        type: profileData.templateType as AssessmentType,
        title: profileData.templateType.replace(/_/g, ' '),
        status: AssessmentStatus.COMPLETED,
        templateId: template?.id ?? null,
        completedAt: new Date(),
        startedAt: new Date(),
      },
    })

    const profile = await prisma.profile.create({
      data: {
        userId: user.id,
        version: 1,
        isLatest: true,
        summary: profileData.summary,
        dimensions: profileData.dimensions,
        archetypes: profileData.archetypes,
        values: profileData.values,
        blindSpots: profileData.blindSpots,
        strengths: profileData.strengths,
        rawOutput: {
          sessionId: session.id,
          scores: profileData.dimensions,
          templateType: profileData.templateType,
          narrative: profileData.rawNarrative,
          reflectionPrompts: profileData.reflectionPrompts,
          fromAnonymousSession: anonSession.id,
        } as object,
      },
    })

    // Mark anonymous session as claimed
    await prisma.anonymousSession.update({
      where: { id: anonSession.id },
      data: { claimedByUserId: user.id },
    })

    // Issue JWT
    const token = server.jwt.sign({ userId: user.id, email: user.email })

    return reply.send({ token, profileId: profile.id, isNewUser: true })
  })
}
