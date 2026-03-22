import type { FastifyInstance } from 'fastify'
import { prisma } from '@innermind/db'
import { requireAuth } from '../lib/auth.js'

export async function testimonialRoutes(server: FastifyInstance) {
  // GET /api/testimonials/public — top approved testimonials (no auth)
  server.get('/public', async (_req, reply) => {
    const testimonials = await prisma.testimonial.findMany({
      where: { isApproved: true },
      orderBy: [{ isFeatured: 'desc' }, { rating: 'desc' }, { createdAt: 'asc' }],
      take: 12,
      select: {
        id: true,
        firstName: true,
        personalityTag: true,
        rating: true,
        quote: true,
        isFeatured: true,
        createdAt: true,
      },
    })
    return reply.send({ testimonials })
  })

  // POST /api/testimonials — submit a testimonial (auth required, once per user)
  server.post('/', { preHandler: requireAuth }, async (req, reply) => {
    const { firstName, personalityTag, rating, quote } = req.body as {
      firstName?: string
      personalityTag?: string
      rating?: number
      quote?: string
    }

    if (!firstName || typeof firstName !== 'string' || firstName.trim().length === 0) {
      return reply.status(400).send({ error: 'First name is required.' })
    }
    if (!quote || typeof quote !== 'string' || quote.trim().length < 10) {
      return reply.status(400).send({ error: 'Quote must be at least 10 characters.' })
    }
    if (!rating || typeof rating !== 'number' || rating < 1 || rating > 5) {
      return reply.status(400).send({ error: 'Rating must be between 1 and 5.' })
    }

    // Check if user already submitted
    const existing = await prisma.testimonial.findUnique({
      where: { userId: req.user.userId },
    })
    if (existing) {
      return reply.status(409).send({ error: 'You have already submitted a testimonial.' })
    }

    // Auto-approve 4+ star ratings; feature 5-star
    const isApproved = rating >= 4
    const isFeatured = rating === 5

    const testimonial = await prisma.testimonial.create({
      data: {
        userId: req.user.userId,
        firstName: firstName.trim().slice(0, 50),
        personalityTag: personalityTag?.trim().slice(0, 100) ?? null,
        rating,
        quote: quote.trim().slice(0, 500),
        isApproved,
        isFeatured,
      },
    })

    return reply.status(201).send({ testimonial })
  })

  // GET /api/testimonials/me — check if current user submitted
  server.get('/me', { preHandler: requireAuth }, async (req, reply) => {
    const testimonial = await prisma.testimonial.findUnique({
      where: { userId: req.user.userId },
      select: { id: true, rating: true, quote: true, createdAt: true },
    })
    return reply.send({ testimonial })
  })
}
