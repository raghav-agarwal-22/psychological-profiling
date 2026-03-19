import type { FastifyInstance } from 'fastify'
import Anthropic from '@anthropic-ai/sdk'
import { prisma } from '@innermind/db'
import { requireAuth } from '../lib/auth.js'

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

function buildCoachSystemPrompt(
  profile: {
    summary: string
    dimensions: unknown
    archetypes: unknown
    values: unknown
    blindSpots: unknown
    strengths: unknown
    rawOutput: unknown
  } | null,
  synthesis: string | null,
): string {
  if (!profile) {
    return `You are a warm, psychologically-informed life coach. The user hasn't completed any assessments yet.

Encourage them to explore Innermind's assessments to unlock a personalized coaching experience.
Be warm, curious, and supportive. Ask open questions that help them reflect on what they're seeking.`
  }

  const raw = profile.rawOutput as Record<string, unknown> | null
  const templateType = (raw?.templateType as string) ?? 'BIG_FIVE'
  const frameworkName =
    templateType === 'VALUES_INVENTORY'
      ? 'Schwartz Values Inventory'
      : templateType === 'ATTACHMENT_STYLE'
        ? 'Attachment Style Inventory'
        : 'Big Five Personality'

  const dims = (profile.dimensions as Record<string, { normalized: number }>) ?? {}
  const dimLines = Object.entries(dims)
    .sort(([, a], [, b]) => b.normalized - a.normalized)
    .map(([k, v]) => `  - ${k}: ${v.normalized}/100`)
    .join('\n')

  const archetypes = (profile.archetypes as string[]) ?? []
  const values = (profile.values as string[]) ?? []
  const blindSpots = (profile.blindSpots as string[]) ?? []
  const strengths = (profile.strengths as string[]) ?? []

  return `You are a deeply knowledgeable, compassionate psychological life coach. You have access to this person's full psychological profile from Innermind's assessments. Use this context to provide personalized, grounded coaching.

## This person's psychological profile

**Framework:** ${frameworkName}

**Dimension scores:**
${dimLines}

**Dominant archetype:** ${archetypes[0] ?? 'Unknown'}
**Core values:** ${values.join(', ') || 'Not yet assessed'}
**Identified strengths:** ${strengths.join(', ') || 'None identified'}
**Growth areas / blind spots:** ${blindSpots.join(', ') || 'None identified'}

**Profile summary:**
${profile.summary}

${synthesis ? `**Cross-framework synthesis:**\n${synthesis}` : ''}

## Your coaching style

- Warm, direct, and psychologically sophisticated — not generic chatbot advice
- Ground your responses in their actual profile data when relevant
- Ask one powerful question at the end of each response when appropriate
- Reference their specific scores, archetypes, or patterns naturally in conversation
- Do not be preachy. Be like a trusted, insightful friend who happens to know a lot about psychology.
- Keep responses focused: 3-5 sentences for simple questions, longer for complex explorations
- You are NOT a therapist — refer them to professional support for clinical concerns`
}

export async function coachRoutes(server: FastifyInstance) {
  server.addHook('preHandler', requireAuth)

  // GET /api/coach/conversations — list user's coach conversations
  server.get('/conversations', async (req, reply) => {
    const conversations = await prisma.coachConversation.findMany({
      where: { userId: req.user.userId },
      orderBy: { updatedAt: 'desc' },
      select: {
        id: true,
        title: true,
        createdAt: true,
        updatedAt: true,
        messages: {
          take: 1,
          orderBy: { createdAt: 'asc' },
          select: { content: true, role: true },
        },
      },
    })
    return reply.send({ conversations })
  })

  // POST /api/coach/conversations — create a new conversation
  server.post('/conversations', async (req, reply) => {
    const conversation = await prisma.coachConversation.create({
      data: { userId: req.user.userId },
      select: { id: true, title: true, createdAt: true },
    })
    return reply.status(201).send({ conversation })
  })

  // GET /api/coach/conversations/:id — get a conversation with messages
  server.get<{ Params: { id: string } }>('/conversations/:id', async (req, reply) => {
    const conversation = await prisma.coachConversation.findFirst({
      where: { id: req.params.id, userId: req.user.userId },
      include: {
        messages: { orderBy: { createdAt: 'asc' } },
      },
    })
    if (!conversation) {
      return reply.status(404).send({ error: 'Conversation not found' })
    }
    return reply.send({ conversation })
  })

  // POST /api/coach/conversations/:id/messages — send a message (streaming)
  server.post<{ Params: { id: string }; Body: { content: string } }>(
    '/conversations/:id/messages',
    async (req, reply) => {
      const { content } = req.body as { content?: string }
      if (!content?.trim()) {
        return reply.status(400).send({ error: 'Message content is required' })
      }

      // Verify conversation belongs to user
      const conversation = await prisma.coachConversation.findFirst({
        where: { id: req.params.id, userId: req.user.userId },
        include: { messages: { orderBy: { createdAt: 'asc' } } },
      })
      if (!conversation) {
        return reply.status(404).send({ error: 'Conversation not found' })
      }

      // Save the user message
      await prisma.coachMessage.create({
        data: {
          conversationId: conversation.id,
          role: 'user',
          content: content.trim(),
        },
      })

      // Auto-title the conversation from first message
      if (!conversation.title && conversation.messages.length === 0) {
        const short = content.trim().slice(0, 60)
        await prisma.coachConversation.update({
          where: { id: conversation.id },
          data: { title: short + (content.length > 60 ? '\u2026' : '') },
        })
      }

      // Fetch user's latest profile + synthesis for context
      const [latestProfile, user] = await Promise.all([
        prisma.profile.findFirst({
          where: { userId: req.user.userId, isLatest: true },
          select: {
            summary: true,
            dimensions: true,
            archetypes: true,
            values: true,
            blindSpots: true,
            strengths: true,
            rawOutput: true,
          },
        }),
        prisma.user.findUnique({
          where: { id: req.user.userId },
          select: { synthesis: true },
        }),
      ])

      const systemPrompt = buildCoachSystemPrompt(latestProfile, user?.synthesis ?? null)

      // Build message history for Claude
      const history = conversation.messages.map((m) => ({
        role: m.role as 'user' | 'assistant',
        content: m.content,
      }))
      history.push({ role: 'user', content: content.trim() })

      // Stream the response
      reply.hijack()
      const origin = req.headers.origin ?? '*'
      reply.raw.setHeader('Content-Type', 'text/plain; charset=utf-8')
      reply.raw.setHeader('Transfer-Encoding', 'chunked')
      reply.raw.setHeader('Cache-Control', 'no-cache')
      reply.raw.setHeader('Access-Control-Allow-Origin', origin)
      reply.raw.setHeader('Access-Control-Allow-Credentials', 'true')
      reply.raw.writeHead(200)

      let fullResponse = ''
      try {
        const stream = await client.messages.stream({
          model: 'claude-sonnet-4-6',
          max_tokens: 1024,
          system: systemPrompt,
          messages: history,
        })
        for await (const chunk of stream) {
          if (chunk.type === 'content_block_delta' && chunk.delta.type === 'text_delta') {
            reply.raw.write(chunk.delta.text)
            fullResponse += chunk.delta.text
          }
        }
      } finally {
        reply.raw.end()
      }

      // Persist assistant response
      await prisma.coachMessage.create({
        data: {
          conversationId: conversation.id,
          role: 'assistant',
          content: fullResponse,
        },
      })

      // Touch conversation updatedAt
      await prisma.coachConversation.update({
        where: { id: conversation.id },
        data: { updatedAt: new Date() },
      })
    },
  )
}
