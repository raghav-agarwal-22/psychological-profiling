import type { FastifyInstance } from 'fastify'
import { prisma } from '@innermind/db'

// In-memory LRU-style cache for public share profiles.
// Profiles are immutable once created — safe to cache for 5 minutes.
// Protects DB during PH viral traffic spikes.
const SHARE_CACHE_TTL = 5 * 60 * 1000 // 5 minutes
const SHARE_CACHE_MAX = 500 // cap memory usage
const shareCache = new Map<string, { data: object; expiry: number }>()

function getCached(token: string) {
  const entry = shareCache.get(token)
  if (!entry) return null
  if (Date.now() > entry.expiry) {
    shareCache.delete(token)
    return null
  }
  return entry.data
}

function setCache(token: string, data: object) {
  if (shareCache.size >= SHARE_CACHE_MAX) {
    // Evict oldest entry
    const oldest = shareCache.keys().next().value
    if (oldest) shareCache.delete(oldest)
  }
  shareCache.set(token, { data, expiry: Date.now() + SHARE_CACHE_TTL })
}

export async function shareRoutes(server: FastifyInstance) {
  // GET /api/share/:shareToken — public, no auth required
  server.get<{ Params: { shareToken: string } }>('/:shareToken', async (req, reply) => {
    const { shareToken } = req.params
    const cached = getCached(shareToken)
    if (cached) {
      reply.header('X-Cache', 'HIT')
      return reply.send({ profile: cached })
    }

    const profile = await prisma.profile.findFirst({
      where: { shareToken, isPublic: true },
    })
    if (!profile) {
      return reply.status(404).send({ error: 'Profile not found or not public' })
    }

    setCache(shareToken, profile)
    reply.header('X-Cache', 'MISS')
    return reply.send({ profile })
  })
}
