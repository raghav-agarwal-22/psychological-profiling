import type { FastifyRequest, FastifyReply } from 'fastify'
import { prisma } from '@innermind/db'

export async function requireAuth(req: FastifyRequest, reply: FastifyReply) {
  try {
    await req.jwtVerify()
  } catch {
    return reply.status(401).send({ error: 'Unauthorized' })
  }
}

export async function requirePro(req: FastifyRequest, reply: FastifyReply) {
  try {
    await req.jwtVerify()
  } catch {
    return reply.status(401).send({ error: 'Unauthorized' })
  }
  const user = await prisma.user.findUnique({
    where: { id: req.user.userId },
    select: { subscriptionTier: true },
  })
  if (user?.subscriptionTier !== 'pro' && user?.subscriptionTier !== 'essential') {
    return reply.status(403).send({ error: 'Pro subscription required', upgradeUrl: '/upgrade' })
  }
}

export async function requireEssentialOrPro(req: FastifyRequest, reply: FastifyReply) {
  try {
    await req.jwtVerify()
  } catch {
    return reply.status(401).send({ error: 'Unauthorized' })
  }
  const user = await prisma.user.findUnique({
    where: { id: req.user.userId },
    select: { subscriptionTier: true },
  })
  if (user?.subscriptionTier !== 'pro' && user?.subscriptionTier !== 'essential') {
    return reply.status(403).send({ error: 'Essential or Pro subscription required', upgradeUrl: '/upgrade' })
  }
}

export interface JwtPayload {
  userId: string
  email: string
}

declare module '@fastify/jwt' {
  interface FastifyJWT {
    payload: JwtPayload
    user: JwtPayload
  }
}
