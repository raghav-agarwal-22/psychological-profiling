import type { FastifyInstance } from 'fastify'
import { z } from 'zod'
import { prisma } from '@innermind/db'
import { upsertLoopsContact, sendLoopsEvent } from '../lib/loops.js'

const subscribeSchema = z.object({
  email: z.string().email(),
})

export async function newsletterRoutes(server: FastifyInstance) {
  // POST /api/newsletter — subscribe to the weekly psychology insights email
  server.post('/subscribe', async (req, reply) => {
    const body = subscribeSchema.safeParse(req.body)
    if (!body.success) {
      return reply.status(400).send({ error: 'Valid email required' })
    }

    const { email } = body.data

    try {
      const user = await prisma.user.upsert({
        where: { email },
        update: {},
        create: { email },
        select: { id: true, email: true },
      })

      // Sync to Loops for newsletter sequence
      await upsertLoopsContact({
        email: user.email,
        userId: user.id,
        userGroup: 'newsletter',
      })
      await sendLoopsEvent(email, 'newsletter_subscribe')

      return reply.send({ success: true })
    } catch (err) {
      server.log.error({ err }, 'newsletter subscribe error')
      return reply.status(500).send({ error: 'Failed to subscribe' })
    }
  })
}
