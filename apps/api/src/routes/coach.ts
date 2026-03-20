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
    strengths: unknown
    blindSpots: unknown
    rawOutput: unknown
  } | null,
  synthesis: string | null,
): string {
  const profileSection = profile
    ? `
## Psychological Profile

**Summary:** ${profile.summary}

**Personality dimensions:**
${Object.entries(profile.dimensions as Record<string, { normalized: number }>)
  .sort(([, a], [, b]) => b.normalized - a.normalized)
  .map(([k, v]) => `- ${k}: ${v.normalized}/100`)
  .join('\n')}

**Dominant archetypes:** ${(profile.archetypes as string[]).join(', ')}
**Core values:** ${(profile.values as string[]).join(', ')}
**Key strengths:** ${(profile.strengths as string[]).join(', ')}
**Growth areas (blind spots):** ${(profile.blindSpots as string[]).join(', ')}
`
    : 'No psychological profile on file yet — user has not completed an assessment.'

  const synthesisSection = synthesis
    ? `
## Cross-framework synthesis
${synthesis}
`
    : ''

  return `You are a compassionate, insightful AI life coach and psychological guide for Innermind. You have deep training in humanistic psychology, Jungian archetypes, attachment theory, and values-based coaching.

Your role is to help this person navigate their inner life — processing emotions, understanding behavioral patterns, working toward meaningful change, and building self-awareness.

Here is what you know about this person:
${profileSection}
${synthesisSection}

## How to coach

- **Ground responses in their actual profile** — reference specific dimensions, archetypes, or values when relevant. Do not be generic.
- **Be warm but honest** — not a cheerleader, not a therapist, but a wise guide
- **Use Socratic questioning** — help them discover insights themselves
- **Acknowledge complexity** — inner life is nuanced, resist oversimplification
- **Be concise** — aim for 2-4 paragraphs max unless depth is genuinely needed
- **Never diagnose** — you are a coach, not a clinician
- **Refer to their actual archetype and values** naturally when they come up

Speak as if you know this person and have been following their journey.`
}

export async function coachRoutes(server: FastifyInstance) {
  server.addHook('preHandler', requireAuth)

  // GET /api/coach/conversations — list all conversations
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
          orderBy: { createdAt: 'desc' },
          select: { content: true, role: true },
        },
      },
    })
    return reply.send({ conversations })
  })

  // POST /api/coach/conversations — create a new conversation
  server.post('/conversations', async (req, reply) => {
    const conversation = await prisma.coachConversation.create({
      data: {
        userId: req.user.userId,
        title: (req.body as { title?: string })?.title ?? null,
      },
      select: { id: true, title: true, createdAt: true },
    })
    return reply.status(201).send({ conversation })
  })

  // GET /api/coach/conversations/:id/messages — load messages for a conversation
  server.get<{ Params: { id: string } }>('/conversations/:id/messages', async (req, reply) => {
    const conversation = await prisma.coachConversation.findFirst({
      where: { id: req.params.id, userId: req.user.userId },
      include: {
        messages: {
          orderBy: { createdAt: 'asc' },
          select: { id: true, role: true, content: true, createdAt: true },
        },
      },
    })
    if (!conversation) return reply.status(404).send({ error: 'Conversation not found' })
    return reply.send({ conversation })
  })

  // POST /api/coach/conversations/:id/message — send a message, stream response
  server.post<{ Params: { id: string }; Body: { message: string } }>(
    '/conversations/:id/message',
    async (req, reply) => {
      const { message } = req.body as { message?: string }
      if (!message?.trim()) {
        return reply.status(400).send({ error: 'message is required' })
      }

      const conversation = await prisma.coachConversation.findFirst({
        where: { id: req.params.id, userId: req.user.userId },
        include: {
          messages: { orderBy: { createdAt: 'asc' }, select: { role: true, content: true } },
        },
      })
      if (!conversation) return reply.status(404).send({ error: 'Conversation not found' })

      // Load user profile and synthesis
      const [profile, user] = await Promise.all([
        prisma.profile.findFirst({
          where: { userId: req.user.userId, isLatest: true },
          select: {
            summary: true,
            dimensions: true,
            archetypes: true,
            values: true,
            strengths: true,
            blindSpots: true,
            rawOutput: true,
          },
        }),
        prisma.user.findUnique({
          where: { id: req.user.userId },
          select: { synthesis: true },
        }),
      ])

      // Save user message
      await prisma.coachMessage.create({
        data: { conversationId: conversation.id, role: 'user', content: message.trim() },
      })

      // Auto-title the conversation after first message
      if (!conversation.title && conversation.messages.length === 0) {
        const shortTitle = message.trim().slice(0, 60) + (message.trim().length > 60 ? '\u2026' : '')
        await prisma.coachConversation.update({
          where: { id: conversation.id },
          data: { title: shortTitle },
        })
      }

      // Build message history for Claude
      const history: Array<{ role: 'user' | 'assistant'; content: string }> = [
        ...conversation.messages.map((m) => ({
          role: m.role as 'user' | 'assistant',
          content: m.content,
        })),
        { role: 'user', content: message.trim() },
      ]

      const systemPrompt = buildCoachSystemPrompt(profile, user?.synthesis ?? null)

      // Stream response
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
            const text = chunk.delta.text
            fullResponse += text
            reply.raw.write(text)
          }
        }
      } finally {
        reply.raw.end()
      }

      // Save assistant message
      await prisma.coachMessage.create({
        data: { conversationId: conversation.id, role: 'assistant', content: fullResponse },
      })

      // Update conversation timestamp
      await prisma.coachConversation.update({
        where: { id: conversation.id },
        data: { updatedAt: new Date() },
      })
    },
  )
}
