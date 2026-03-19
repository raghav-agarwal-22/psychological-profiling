import { PrismaClient, AssessmentType, AssessmentStatus, SessionStatus } from '@prisma/client'
import type { ScoringConfig } from '../src/scoring'

const prisma = new PrismaClient()

// ─── Big Five Question Bank (50 items, 10 per dimension) ──────────────────────
//
// Based on the IPIP Big-Five Factor Markers (public domain).
// Dimensions: Openness (O), Conscientiousness (C), Extraversion (E),
//             Agreeableness (A), Neuroticism (N)

const BIG_FIVE_QUESTIONS = [
  // ── Openness ──────────────────────────────────────────────────────────────
  { id: 'O_01', text: 'I have a vivid imagination.',                                  dimension: 'openness',          reverse_scored: false },
  { id: 'O_02', text: 'I am interested in abstract ideas.',                           dimension: 'openness',          reverse_scored: false },
  { id: 'O_03', text: 'I enjoy hearing new ideas.',                                   dimension: 'openness',          reverse_scored: false },
  { id: 'O_04', text: 'I prefer variety to routine.',                                 dimension: 'openness',          reverse_scored: false },
  { id: 'O_05', text: 'I enjoy reflecting on ideas and feelings.',                    dimension: 'openness',          reverse_scored: false },
  { id: 'O_06', text: 'I find beauty in things that others may not notice.',          dimension: 'openness',          reverse_scored: false },
  { id: 'O_07', text: 'I avoid philosophical discussions.',                           dimension: 'openness',          reverse_scored: true  },
  { id: 'O_08', text: 'I do not enjoy going to art museums.',                         dimension: 'openness',          reverse_scored: true  },
  { id: 'O_09', text: 'I try to avoid complex tasks.',                                dimension: 'openness',          reverse_scored: true  },
  { id: 'O_10', text: 'I enjoy exploring new ways of thinking.',                      dimension: 'openness',          reverse_scored: false },

  // ── Conscientiousness ──────────────────────────────────────────────────────
  { id: 'C_01', text: 'I am always prepared.',                                        dimension: 'conscientiousness', reverse_scored: false },
  { id: 'C_02', text: 'I pay close attention to details.',                            dimension: 'conscientiousness', reverse_scored: false },
  { id: 'C_03', text: 'I follow through with my commitments.',                        dimension: 'conscientiousness', reverse_scored: false },
  { id: 'C_04', text: 'I complete tasks right away.',                                 dimension: 'conscientiousness', reverse_scored: false },
  { id: 'C_05', text: 'I work according to a schedule.',                              dimension: 'conscientiousness', reverse_scored: false },
  { id: 'C_06', text: 'I leave my belongings around.',                                dimension: 'conscientiousness', reverse_scored: true  },
  { id: 'C_07', text: 'I make a mess of things.',                                     dimension: 'conscientiousness', reverse_scored: true  },
  { id: 'C_08', text: 'I do just enough to get by.',                                  dimension: 'conscientiousness', reverse_scored: true  },
  { id: 'C_09', text: 'I hold myself to high standards.',                             dimension: 'conscientiousness', reverse_scored: false },
  { id: 'C_10', text: 'I am easily distracted.',                                      dimension: 'conscientiousness', reverse_scored: true  },

  // ── Extraversion ───────────────────────────────────────────────────────────
  { id: 'E_01', text: 'I am the life of the party.',                                  dimension: 'extraversion',      reverse_scored: false },
  { id: 'E_02', text: 'I feel comfortable around people.',                            dimension: 'extraversion',      reverse_scored: false },
  { id: 'E_03', text: 'I start conversations.',                                       dimension: 'extraversion',      reverse_scored: false },
  { id: 'E_04', text: 'I talk to a lot of different people at parties.',              dimension: 'extraversion',      reverse_scored: false },
  { id: 'E_05', text: 'I make friends easily.',                                       dimension: 'extraversion',      reverse_scored: false },
  { id: 'E_06', text: 'I don\'t like to draw attention to myself.',                   dimension: 'extraversion',      reverse_scored: true  },
  { id: 'E_07', text: 'I am quiet around strangers.',                                 dimension: 'extraversion',      reverse_scored: true  },
  { id: 'E_08', text: 'I find it hard to approach others.',                           dimension: 'extraversion',      reverse_scored: true  },
  { id: 'E_09', text: 'I feel energized after spending time with others.',            dimension: 'extraversion',      reverse_scored: false },
  { id: 'E_10', text: 'I enjoy being part of a group.',                               dimension: 'extraversion',      reverse_scored: false },

  // ── Agreeableness ──────────────────────────────────────────────────────────
  { id: 'A_01', text: 'I sympathize with others\' feelings.',                         dimension: 'agreeableness',     reverse_scored: false },
  { id: 'A_02', text: 'I have a soft heart.',                                         dimension: 'agreeableness',     reverse_scored: false },
  { id: 'A_03', text: 'I take time out for others.',                                  dimension: 'agreeableness',     reverse_scored: false },
  { id: 'A_04', text: 'I make people feel at ease.',                                  dimension: 'agreeableness',     reverse_scored: false },
  { id: 'A_05', text: 'I am concerned about others\' wellbeing.',                     dimension: 'agreeableness',     reverse_scored: false },
  { id: 'A_06', text: 'I insult people.',                                             dimension: 'agreeableness',     reverse_scored: true  },
  { id: 'A_07', text: 'I am not really interested in others.',                        dimension: 'agreeableness',     reverse_scored: true  },
  { id: 'A_08', text: 'I take advantage of others.',                                  dimension: 'agreeableness',     reverse_scored: true  },
  { id: 'A_09', text: 'I get back at others.',                                        dimension: 'agreeableness',     reverse_scored: true  },
  { id: 'A_10', text: 'I cooperate easily with others.',                              dimension: 'agreeableness',     reverse_scored: false },

  // ── Neuroticism ────────────────────────────────────────────────────────────
  { id: 'N_01', text: 'I get stressed out easily.',                                   dimension: 'neuroticism',       reverse_scored: false },
  { id: 'N_02', text: 'I worry about things.',                                        dimension: 'neuroticism',       reverse_scored: false },
  { id: 'N_03', text: 'I get upset easily.',                                          dimension: 'neuroticism',       reverse_scored: false },
  { id: 'N_04', text: 'I am easily disturbed.',                                       dimension: 'neuroticism',       reverse_scored: false },
  { id: 'N_05', text: 'I often feel anxious.',                                        dimension: 'neuroticism',       reverse_scored: false },
  { id: 'N_06', text: 'I am relaxed most of the time.',                               dimension: 'neuroticism',       reverse_scored: true  },
  { id: 'N_07', text: 'I seldom feel blue.',                                          dimension: 'neuroticism',       reverse_scored: true  },
  { id: 'N_08', text: 'I am not easily bothered by things.',                          dimension: 'neuroticism',       reverse_scored: true  },
  { id: 'N_09', text: 'I rarely get irritated.',                                      dimension: 'neuroticism',       reverse_scored: true  },
  { id: 'N_10', text: 'I change my mood a lot.',                                      dimension: 'neuroticism',       reverse_scored: false },
]

// ─── Scoring Configuration ────────────────────────────────────────────────────
//
// formula: "average" → mean of adjusted values
// normalize: true   → (avg - 1) / 4 * 100 → 0-100 range

const BIG_FIVE_SCORING_CONFIG: ScoringConfig = {
  openness: {
    questionIds: ['O_01','O_02','O_03','O_04','O_05','O_06','O_07','O_08','O_09','O_10'],
    reverseIds:  ['O_07','O_08','O_09'],
    formula: 'average',
    normalize: true,
  },
  conscientiousness: {
    questionIds: ['C_01','C_02','C_03','C_04','C_05','C_06','C_07','C_08','C_09','C_10'],
    reverseIds:  ['C_06','C_07','C_08','C_10'],
    formula: 'average',
    normalize: true,
  },
  extraversion: {
    questionIds: ['E_01','E_02','E_03','E_04','E_05','E_06','E_07','E_08','E_09','E_10'],
    reverseIds:  ['E_06','E_07','E_08'],
    formula: 'average',
    normalize: true,
  },
  agreeableness: {
    questionIds: ['A_01','A_02','A_03','A_04','A_05','A_06','A_07','A_08','A_09','A_10'],
    reverseIds:  ['A_06','A_07','A_08','A_09'],
    formula: 'average',
    normalize: true,
  },
  neuroticism: {
    questionIds: ['N_01','N_02','N_03','N_04','N_05','N_06','N_07','N_08','N_09','N_10'],
    reverseIds:  ['N_06','N_07','N_08','N_09'],
    formula: 'average',
    normalize: true,
  },
}

// ─── Sample responses for the demo assessment ─────────────────────────────────
// Profile: High openness/conscientiousness, moderate extraversion, high agreeableness, low neuroticism

const DEMO_RESPONSES: Record<string, number> = {
  O_01: 5, O_02: 5, O_03: 4, O_04: 4, O_05: 5, O_06: 4, O_07: 1, O_08: 2, O_09: 1, O_10: 5,
  C_01: 4, C_02: 5, C_03: 5, C_04: 4, C_05: 4, C_06: 2, C_07: 1, C_08: 1, C_09: 5, C_10: 2,
  E_01: 3, E_02: 3, E_03: 3, E_04: 3, E_05: 3, E_06: 3, E_07: 3, E_08: 3, E_09: 3, E_10: 3,
  A_01: 5, A_02: 5, A_03: 4, A_04: 4, A_05: 5, A_06: 1, A_07: 1, A_08: 1, A_09: 1, A_10: 5,
  N_01: 2, N_02: 2, N_03: 2, N_04: 2, N_05: 2, N_06: 4, N_07: 4, N_08: 4, N_09: 4, N_10: 2,
}

async function main() {
  console.log('🌱 Seeding database...')

  // ── 1. Upsert Big Five assessment template ─────────────────────────────────
  const template = await prisma.assessmentTemplate.upsert({
    where: { type_version: { type: AssessmentType.BIG_FIVE, version: '1.0' } },
    update: {
      questionBank: BIG_FIVE_QUESTIONS,
      scoringConfig: BIG_FIVE_SCORING_CONFIG,
    },
    create: {
      type: AssessmentType.BIG_FIVE,
      version: '1.0',
      title: 'Big Five Personality Assessment',
      description: 'Measures the OCEAN dimensions: Openness, Conscientiousness, Extraversion, Agreeableness, and Neuroticism. 50 items, Likert 1-5.',
      questionBank: BIG_FIVE_QUESTIONS,
      scoringConfig: BIG_FIVE_SCORING_CONFIG,
      isActive: true,
    },
  })
  console.log(`✓ AssessmentTemplate: ${template.title} v${template.version} (${BIG_FIVE_QUESTIONS.length} items)`)

  // ── 2. Upsert demo user ────────────────────────────────────────────────────
  const user = await prisma.user.upsert({
    where: { email: 'test@innermind.dev' },
    update: {},
    create: {
      email: 'test@innermind.dev',
      name: 'Test User',
      timezone: 'UTC',
      locale: 'en',
    },
  })
  console.log(`✓ User: ${user.email} (${user.id})`)

  // ── 3. Create a session ────────────────────────────────────────────────────
  const session = await prisma.session.create({
    data: {
      userId: user.id,
      title: 'Initial Self-Discovery Session',
      status: SessionStatus.COMPLETED,
      startedAt: new Date(),
      completedAt: new Date(),
    },
  })
  console.log(`✓ Session: ${session.title} (${session.id})`)

  // ── 4. Create a completed Big Five assessment with structured responses ────
  const assessment = await prisma.assessment.create({
    data: {
      userId: user.id,
      sessionId: session.id,
      templateId: template.id,
      type: AssessmentType.BIG_FIVE,
      title: 'Big Five Personality Assessment',
      description: 'Measures openness, conscientiousness, extraversion, agreeableness, and neuroticism.',
      status: AssessmentStatus.COMPLETED,
      currentStep: BIG_FIVE_QUESTIONS.length,
      totalSteps: BIG_FIVE_QUESTIONS.length,
      rawResponses: DEMO_RESPONSES,
      metadata: {
        templateVersion: '1.0',
      },
      startedAt: new Date(),
      completedAt: new Date(),
      responses: {
        create: Object.entries(DEMO_RESPONSES).map(([questionId, value]) => ({
          questionId,
          value,
        })),
      },
    },
  })
  console.log(`✓ Assessment: ${assessment.title} (${assessment.id}) with ${Object.keys(DEMO_RESPONSES).length} responses`)

  // ── 5. Create a profile ────────────────────────────────────────────────────
  const profile = await prisma.profile.create({
    data: {
      userId: user.id,
      version: 1,
      isLatest: true,
      summary:
        'You show high openness to experience and strong conscientiousness, suggesting a curious, disciplined mind that values depth and follow-through. Moderate extraversion indicates comfortable adaptability across social contexts.',
      dimensions: {
        openness:          0.82,
        conscientiousness: 0.74,
        extraversion:      0.51,
        agreeableness:     0.68,
        neuroticism:       0.32,
      },
      archetypes: ['The Sage', 'The Creator'],
      values:     ['Learning', 'Integrity', 'Mastery'],
      blindSpots: ['Perfectionism', 'Over-analysis'],
      strengths:  ['Strategic thinking', 'Attention to detail', 'Intellectual curiosity'],
      rawOutput: {
        model:       'claude-sonnet-4-6',
        generatedAt: new Date().toISOString(),
        prompt:      'seed-placeholder',
      },
      generatedAt: new Date(),
    },
  })
  console.log(`✓ Profile v${profile.version} (${profile.id})`)

  // ── 6. Create a sample insight ─────────────────────────────────────────────
  const insight = await prisma.insight.create({
    data: {
      userId:      user.id,
      profileId:   profile.id,
      assessmentId: assessment.id,
      type:        'GROWTH_EDGE',
      title:       'Balance depth with action',
      body:        'Your high openness and conscientiousness create a powerful engine for learning — but watch for the pattern of researching indefinitely before acting. The Sage in you values understanding, but mastery comes from doing.',
      symbol:      'The Sage',
      domain:      'PERSONAL_GROWTH',
      isRead:      false,
      isSaved:     false,
    },
  })
  console.log(`✓ Insight: ${insight.title} (${insight.id})`)

  console.log('\n✅ Seed complete.')
  console.log(`   • 1 AssessmentTemplate (Big Five v1.0, ${BIG_FIVE_QUESTIONS.length} questions)`)
  console.log('   • 1 User, 1 Session, 1 Assessment, 1 Profile, 1 Insight')
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
