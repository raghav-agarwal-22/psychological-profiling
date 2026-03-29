import pkg from '@prisma/client'
const { PrismaClient } = pkg
type PrismaClientInstance = InstanceType<typeof PrismaClient>

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClientInstance | undefined
}

// Build database URL with explicit connection pool settings for production.
// Railway PostgreSQL defaults may be too low for PH-scale traffic spikes.
// Override via DATABASE_CONNECTION_LIMIT env var (default: 10).
function buildDatasource() {
  const url = process.env.DATABASE_URL
  if (!url) return undefined
  const limit = process.env.DATABASE_CONNECTION_LIMIT ?? '10'
  const poolTimeout = process.env.DATABASE_POOL_TIMEOUT ?? '20'
  // Only append params if not already set in the URL
  const separator = url.includes('?') ? '&' : '?'
  const pooledUrl = url.includes('connection_limit')
    ? url
    : `${url}${separator}connection_limit=${limit}&pool_timeout=${poolTimeout}`
  return { db: { url: pooledUrl } }
}

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log:
      process.env.NODE_ENV === 'development'
        ? ['query', 'error', 'warn']
        : ['error'],
    datasources: buildDatasource(),
  })

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma
}

// Re-export Prisma types and enums explicitly (CJS interop workaround)
const {
  SessionStatus,
  AssessmentType,
  AssessmentStatus,
  InsightType,
  LifeDomain,
  Prisma,
} = pkg

export {
  SessionStatus,
  AssessmentType,
  AssessmentStatus,
  InsightType,
  LifeDomain,
  Prisma,
  PrismaClient,
}
export type { ScoringConfig, AssessmentScores } from './scoring.js'
export { computeScores } from './scoring.js'
export default prisma
