import { PrismaClient, AssessmentType, AssessmentStatus, SessionStatus } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding database...')

  // Create test user
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

  // Create a session
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

  // Create a Big Five assessment template
  const assessment = await prisma.assessment.create({
    data: {
      userId: user.id,
      sessionId: session.id,
      type: AssessmentType.BIG_FIVE,
      title: 'Big Five Personality Assessment',
      description:
        'Measures openness, conscientiousness, extraversion, agreeableness, and neuroticism.',
      status: AssessmentStatus.COMPLETED,
      currentStep: 10,
      totalSteps: 10,
      rawResponses: {
        q1: 4,
        q2: 3,
        q3: 5,
        q4: 2,
        q5: 4,
        q6: 3,
        q7: 5,
        q8: 4,
        q9: 3,
        q10: 2,
      },
      metadata: {
        version: '1.0',
        questionBank: 'big5-standard-10',
        scoringConfig: {
          openness: [1, 6],
          conscientiousness: [3, 8],
          extraversion: [2, 7],
          agreeableness: [4, 9],
          neuroticism: [5, 10],
        },
      },
      startedAt: new Date(),
      completedAt: new Date(),
    },
  })
  console.log(`✓ Assessment: ${assessment.title} (${assessment.id})`)

  // Create a profile
  const profile = await prisma.profile.create({
    data: {
      userId: user.id,
      version: 1,
      isLatest: true,
      summary:
        'You show high openness to experience and strong conscientiousness, suggesting a curious, disciplined mind that values depth and follow-through. Moderate extraversion indicates comfortable adaptability across social contexts.',
      dimensions: {
        openness: 0.82,
        conscientiousness: 0.74,
        extraversion: 0.51,
        agreeableness: 0.68,
        neuroticism: 0.32,
      },
      archetypes: ['The Sage', 'The Creator'],
      values: ['Learning', 'Integrity', 'Mastery'],
      blindSpots: ['Perfectionism', 'Over-analysis'],
      strengths: ['Strategic thinking', 'Attention to detail', 'Intellectual curiosity'],
      rawOutput: {
        model: 'claude-sonnet-4-6',
        generatedAt: new Date().toISOString(),
        prompt: 'seed-placeholder',
      },
      generatedAt: new Date(),
    },
  })
  console.log(`✓ Profile v${profile.version} (${profile.id})`)

  // Create a sample insight
  const insight = await prisma.insight.create({
    data: {
      userId: user.id,
      profileId: profile.id,
      assessmentId: assessment.id,
      type: 'GROWTH_EDGE',
      title: 'Balance depth with action',
      body: 'Your high openness and conscientiousness create a powerful engine for learning — but watch for the pattern of researching indefinitely before acting. The Sage in you values understanding, but mastery comes from doing.',
      symbol: 'The Sage',
      domain: 'PERSONAL_GROWTH',
      isRead: false,
      isSaved: false,
    },
  })
  console.log(`✓ Insight: ${insight.title} (${insight.id})`)

  console.log('\n✅ Seed complete.')
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
