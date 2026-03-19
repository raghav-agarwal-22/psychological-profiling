import type { FastifyRequest, FastifyReply } from 'fastify'

export async function requireAuth(req: FastifyRequest, reply: FastifyReply) {
  try {
    await req.jwtVerify()
  } catch {
    return reply.status(401).send({ error: 'Unauthorized' })
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
