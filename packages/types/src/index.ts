// ─── Enums ───────────────────────────────────────────────────────────────────

export type SessionStatus = 'IN_PROGRESS' | 'COMPLETED' | 'ABANDONED'

export type AssessmentType =
  | 'BIG_FIVE'
  | 'JUNGIAN_ARCHETYPES'
  | 'VALUES_INVENTORY'
  | 'SHADOW_WORK'
  | 'LIFE_SATISFACTION'
  | 'STRENGTHS'
  | 'ATTACHMENT_STYLE'
  | 'CUSTOM'

export type AssessmentStatus = 'NOT_STARTED' | 'IN_PROGRESS' | 'COMPLETED' | 'SKIPPED'

export type InsightType =
  | 'PATTERN'
  | 'STRENGTH'
  | 'BLIND_SPOT'
  | 'VALUE_ALIGNMENT'
  | 'VALUE_CONFLICT'
  | 'ARCHETYPE'
  | 'GROWTH_EDGE'
  | 'REFLECTION'

export type LifeDomain =
  | 'WORK'
  | 'RELATIONSHIPS'
  | 'HEALTH'
  | 'CREATIVITY'
  | 'MEANING'
  | 'FINANCES'
  | 'FAMILY'
  | 'PERSONAL_GROWTH'

// ─── API Response Types ───────────────────────────────────────────────────────

export interface ApiResponse<T> {
  data: T
  meta?: Record<string, unknown>
}

export interface ApiError {
  statusCode: number
  error: string
  message: string
}

export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  pageSize: number
  hasNextPage: boolean
}

// ─── User ─────────────────────────────────────────────────────────────────────

export interface User {
  id: string
  email: string
  name: string | null
  avatarUrl: string | null
  timezone: string
  locale: string
  createdAt: string
  updatedAt: string
}

// ─── Session ──────────────────────────────────────────────────────────────────

export interface Session {
  id: string
  userId: string
  title: string | null
  status: SessionStatus
  startedAt: string
  completedAt: string | null
  createdAt: string
  updatedAt: string
}

// ─── Assessment ───────────────────────────────────────────────────────────────

export interface Assessment {
  id: string
  userId: string
  sessionId: string
  type: AssessmentType
  title: string
  description: string | null
  status: AssessmentStatus
  currentStep: number
  totalSteps: number | null
  rawResponses: Record<string, unknown>
  metadata: Record<string, unknown>
  startedAt: string | null
  completedAt: string | null
  createdAt: string
  updatedAt: string
}

// ─── Profile ──────────────────────────────────────────────────────────────────

export interface ProfileDimensions {
  openness?: number
  conscientiousness?: number
  extraversion?: number
  agreeableness?: number
  neuroticism?: number
  [key: string]: number | undefined
}

export interface Profile {
  id: string
  userId: string
  version: number
  isLatest: boolean
  summary: string
  dimensions: ProfileDimensions
  archetypes: string[]
  values: string[]
  blindSpots: string[]
  strengths: string[]
  generatedAt: string
  createdAt: string
  updatedAt: string
}

// ─── Insight ──────────────────────────────────────────────────────────────────

export interface Insight {
  id: string
  userId: string
  profileId: string | null
  assessmentId: string | null
  type: InsightType
  title: string
  body: string
  symbol: string | null
  domain: LifeDomain | null
  isRead: boolean
  isSaved: boolean
  reactions: Record<string, unknown>
  createdAt: string
  updatedAt: string
}

// ─── Assessment Template ───────────────────────────────────────────────────────

export interface QuestionBankItem {
  id: string
  text: string
  dimension: string
  reverse_scored: boolean
}

export interface DimensionScoringConfig {
  questionIds: string[]
  reverseIds: string[]
  formula: 'average'
  normalize: boolean
}

export type ScoringConfig = Record<string, DimensionScoringConfig>

export interface AssessmentTemplate {
  id: string
  type: AssessmentType
  version: string
  title: string
  description: string | null
  questionBank: QuestionBankItem[]
  scoringConfig: ScoringConfig
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export interface AssessmentResponse {
  id: string
  assessmentId: string
  questionId: string
  value: number
  createdAt: string
}

export interface DimensionScore {
  raw: number
  normalized: number
  responseCount: number
}

export type AssessmentScores = Record<string, DimensionScore>

// ─── Auth ─────────────────────────────────────────────────────────────────────

export interface AuthTokens {
  accessToken: string
  expiresIn: number
}

export interface MagicLinkRequest {
  email: string
}

export interface MagicLinkVerify {
  token: string
}

// ─── Journal ──────────────────────────────────────────────────────────────────

export interface JournalEntry {
  id: string
  userId: string
  insightId: string | null
  title: string | null
  body: string
  mood: number | null
  tags: string[]
  createdAt: string
  updatedAt: string
}
