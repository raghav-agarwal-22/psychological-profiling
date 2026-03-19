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

// ─── Schwartz Values Inventory (36 items, 4 per dimension) ────────────────────
//
// Based on Schwartz's Basic Human Values Theory (public domain research).
// Dimensions: Achievement, Benevolence, Conformity, Hedonism, Power,
//             Security, Self-Direction, Stimulation, Universalism

const VALUES_QUESTIONS = [
  // ── Achievement ────────────────────────────────────────────────────────────
  { id: 'ACH_01', text: 'Being successful and showing my abilities is important to me.',           dimension: 'achievement',    reverse_scored: false },
  { id: 'ACH_02', text: 'I want people to recognize my accomplishments.',                          dimension: 'achievement',    reverse_scored: false },
  { id: 'ACH_03', text: 'Setting ambitious goals and achieving them drives me.',                   dimension: 'achievement',    reverse_scored: false },
  { id: 'ACH_04', text: 'I strive to be competent and demonstrate my capabilities.',               dimension: 'achievement',    reverse_scored: false },

  // ── Benevolence ────────────────────────────────────────────────────────────
  { id: 'BEN_01', text: 'Helping the people close to me matters deeply to me.',                    dimension: 'benevolence',    reverse_scored: false },
  { id: 'BEN_02', text: 'Being loyal to my friends and family is one of my core commitments.',     dimension: 'benevolence',    reverse_scored: false },
  { id: 'BEN_03', text: 'I care deeply about the wellbeing of people I am close to.',              dimension: 'benevolence',    reverse_scored: false },
  { id: 'BEN_04', text: 'I try to respond to the needs of people who are important to me.',        dimension: 'benevolence',    reverse_scored: false },

  // ── Conformity ─────────────────────────────────────────────────────────────
  { id: 'CON_01', text: 'I believe it is important to follow rules and behave properly.',          dimension: 'conformity',     reverse_scored: false },
  { id: 'CON_02', text: 'Showing respect for traditions and customs is important to me.',          dimension: 'conformity',     reverse_scored: false },
  { id: 'CON_03', text: 'I try to behave in ways that avoid upsetting or annoying others.',        dimension: 'conformity',     reverse_scored: false },
  { id: 'CON_04', text: 'I believe in doing what I am supposed to do, even when no one is watching.', dimension: 'conformity', reverse_scored: false },

  // ── Hedonism ───────────────────────────────────────────────────────────────
  { id: 'HED_01', text: 'I enjoy pleasure and seek out experiences that feel good.',               dimension: 'hedonism',       reverse_scored: false },
  { id: 'HED_02', text: 'Having fun and enjoying life is very important to me.',                   dimension: 'hedonism',       reverse_scored: false },
  { id: 'HED_03', text: 'I indulge myself when I can.',                                           dimension: 'hedonism',       reverse_scored: false },
  { id: 'HED_04', text: 'Satisfying my desires and enjoying sensory pleasures matters to me.',     dimension: 'hedonism',       reverse_scored: false },

  // ── Power ──────────────────────────────────────────────────────────────────
  { id: 'POW_01', text: 'Having authority and influence over others is important to me.',          dimension: 'power',          reverse_scored: false },
  { id: 'POW_02', text: 'It matters to me to be in control and lead situations.',                  dimension: 'power',          reverse_scored: false },
  { id: 'POW_03', text: 'I want to be wealthy and have access to resources others do not.',        dimension: 'power',          reverse_scored: false },
  { id: 'POW_04', text: 'Social status and prestige are meaningful to me.',                        dimension: 'power',          reverse_scored: false },

  // ── Security ───────────────────────────────────────────────────────────────
  { id: 'SEC_01', text: 'Living in a safe and stable environment is very important to me.',        dimension: 'security',       reverse_scored: false },
  { id: 'SEC_02', text: 'I value order and predictability in my daily life.',                      dimension: 'security',       reverse_scored: false },
  { id: 'SEC_03', text: 'I prefer situations where I know what to expect.',                        dimension: 'security',       reverse_scored: false },
  { id: 'SEC_04', text: 'Protecting my family and loved ones from harm comes first.',              dimension: 'security',       reverse_scored: false },

  // ── Self-Direction ─────────────────────────────────────────────────────────
  { id: 'SD_01',  text: 'Thinking for myself and forming my own opinions is essential to me.',     dimension: 'self_direction', reverse_scored: false },
  { id: 'SD_02',  text: 'I value having the freedom to choose what I do and how I do it.',         dimension: 'self_direction', reverse_scored: false },
  { id: 'SD_03',  text: 'Being creative and exploring new ideas is important to my sense of self.', dimension: 'self_direction', reverse_scored: false },
  { id: 'SD_04',  text: 'I believe in charting my own course in life, independent of others.',     dimension: 'self_direction', reverse_scored: false },

  // ── Stimulation ────────────────────────────────────────────────────────────
  { id: 'STI_01', text: 'I seek out exciting and novel experiences that challenge me.',            dimension: 'stimulation',    reverse_scored: false },
  { id: 'STI_02', text: 'Having an adventurous life full of variety matters to me.',               dimension: 'stimulation',    reverse_scored: false },
  { id: 'STI_03', text: 'I feel most alive when facing risk or novelty.',                          dimension: 'stimulation',    reverse_scored: false },
  { id: 'STI_04', text: 'I am drawn to situations that are daring and unconventional.',            dimension: 'stimulation',    reverse_scored: false },

  // ── Universalism ───────────────────────────────────────────────────────────
  { id: 'UNI_01', text: 'I care about justice and fairness for everyone, not just those close to me.', dimension: 'universalism', reverse_scored: false },
  { id: 'UNI_02', text: 'Protecting the environment and nature is deeply important to me.',        dimension: 'universalism',   reverse_scored: false },
  { id: 'UNI_03', text: 'I believe all people deserve equal opportunities regardless of background.', dimension: 'universalism', reverse_scored: false },
  { id: 'UNI_04', text: 'Understanding people who are very different from me enriches my life.',   dimension: 'universalism',   reverse_scored: false },
]

// ─── Attachment Style Inventory (18 items, ECR-inspired) ─────────────────────
//
// Dimensions: anxiety (fear of abandonment), avoidance (discomfort with closeness)

const ATTACHMENT_QUESTIONS = [
  // ── Anxiety ────────────────────────────────────────────────────────────────
  { id: 'ANX_01', text: 'I worry that people I care about will leave me.',                     dimension: 'anxiety',   reverse_scored: false },
  { id: 'ANX_02', text: 'I need frequent reassurance that I am loved.',                        dimension: 'anxiety',   reverse_scored: false },
  { id: 'ANX_03', text: 'I often worry about whether my close relationships are secure.',      dimension: 'anxiety',   reverse_scored: false },
  { id: 'ANX_04', text: 'When I\'m apart from people I care about, I feel anxious.',           dimension: 'anxiety',   reverse_scored: false },
  { id: 'ANX_05', text: 'I find myself becoming upset when I feel ignored by close others.',   dimension: 'anxiety',   reverse_scored: false },
  { id: 'ANX_06', text: 'I rarely worry about being abandoned by those close to me.',          dimension: 'anxiety',   reverse_scored: true  },
  { id: 'ANX_07', text: 'I feel confident that my close relationships are stable.',            dimension: 'anxiety',   reverse_scored: true  },
  { id: 'ANX_08', text: 'I find it easy to let others get close to me emotionally without fear.', dimension: 'anxiety', reverse_scored: true },
  { id: 'ANX_09', text: 'I don\'t often feel preoccupied with my close relationships.',        dimension: 'anxiety',   reverse_scored: true  },

  // ── Avoidance ──────────────────────────────────────────────────────────────
  { id: 'AVO_01', text: 'I prefer not to share my feelings with others.',                      dimension: 'avoidance', reverse_scored: false },
  { id: 'AVO_02', text: 'I find it difficult to depend on other people.',                      dimension: 'avoidance', reverse_scored: false },
  { id: 'AVO_03', text: 'I am uncomfortable when people get too emotionally close to me.',     dimension: 'avoidance', reverse_scored: false },
  { id: 'AVO_04', text: 'I prefer to handle problems without involving others.',               dimension: 'avoidance', reverse_scored: false },
  { id: 'AVO_05', text: 'I feel uncomfortable opening up to others about personal matters.',   dimension: 'avoidance', reverse_scored: false },
  { id: 'AVO_06', text: 'I find it relatively easy to let people close to me.',                dimension: 'avoidance', reverse_scored: true  },
  { id: 'AVO_07', text: 'I am comfortable depending on others when I need support.',           dimension: 'avoidance', reverse_scored: true  },
  { id: 'AVO_08', text: 'I enjoy being emotionally close to people.',                          dimension: 'avoidance', reverse_scored: true  },
  { id: 'AVO_09', text: 'I find it easy to trust others with my feelings.',                    dimension: 'avoidance', reverse_scored: true  },
]

const ATTACHMENT_SCORING_CONFIG: ScoringConfig = {
  anxiety:   { questionIds: ['ANX_01','ANX_02','ANX_03','ANX_04','ANX_05','ANX_06','ANX_07','ANX_08','ANX_09'], reverseIds: ['ANX_06','ANX_07','ANX_08','ANX_09'], formula: 'average', normalize: true },
  avoidance: { questionIds: ['AVO_01','AVO_02','AVO_03','AVO_04','AVO_05','AVO_06','AVO_07','AVO_08','AVO_09'], reverseIds: ['AVO_06','AVO_07','AVO_08','AVO_09'], formula: 'average', normalize: true },
}

const VALUES_SCORING_CONFIG: ScoringConfig = {
  achievement:    { questionIds: ['ACH_01','ACH_02','ACH_03','ACH_04'], reverseIds: [], formula: 'average', normalize: true },
  benevolence:    { questionIds: ['BEN_01','BEN_02','BEN_03','BEN_04'], reverseIds: [], formula: 'average', normalize: true },
  conformity:     { questionIds: ['CON_01','CON_02','CON_03','CON_04'], reverseIds: [], formula: 'average', normalize: true },
  hedonism:       { questionIds: ['HED_01','HED_02','HED_03','HED_04'], reverseIds: [], formula: 'average', normalize: true },
  power:          { questionIds: ['POW_01','POW_02','POW_03','POW_04'], reverseIds: [], formula: 'average', normalize: true },
  security:       { questionIds: ['SEC_01','SEC_02','SEC_03','SEC_04'], reverseIds: [], formula: 'average', normalize: true },
  self_direction: { questionIds: ['SD_01', 'SD_02', 'SD_03', 'SD_04' ], reverseIds: [], formula: 'average', normalize: true },
  stimulation:    { questionIds: ['STI_01','STI_02','STI_03','STI_04'], reverseIds: [], formula: 'average', normalize: true },
  universalism:   { questionIds: ['UNI_01','UNI_02','UNI_03','UNI_04'], reverseIds: [], formula: 'average', normalize: true },
}

async function main() {
  console.log('🌱 Seeding database...')

  // ── 1. Upsert Big Five assessment template ─────────────────────────────────
  const template = await prisma.assessmentTemplate.upsert({
    where: { type_version: { type: AssessmentType.BIG_FIVE, version: '1.0' } },
    update: {
      questionBank: BIG_FIVE_QUESTIONS as object[],
      scoringConfig: BIG_FIVE_SCORING_CONFIG as object,
    },
    create: {
      type: AssessmentType.BIG_FIVE,
      version: '1.0',
      title: 'Big Five Personality Assessment',
      description: 'Measures the OCEAN dimensions: Openness, Conscientiousness, Extraversion, Agreeableness, and Neuroticism. 50 items, Likert 1-5.',
      questionBank: BIG_FIVE_QUESTIONS as object[],
      scoringConfig: BIG_FIVE_SCORING_CONFIG as object,
      isActive: true,
    },
  })
  console.log(`✓ AssessmentTemplate: ${template.title} v${template.version} (${BIG_FIVE_QUESTIONS.length} items)`)

  // ── 1b. Upsert Values Inventory template ───────────────────────────────────
  const valuesTemplate = await prisma.assessmentTemplate.upsert({
    where: { type_version: { type: AssessmentType.VALUES_INVENTORY, version: '1.0' } },
    update: {
      questionBank: VALUES_QUESTIONS as object[],
      scoringConfig: VALUES_SCORING_CONFIG as object,
    },
    create: {
      type: AssessmentType.VALUES_INVENTORY,
      version: '1.0',
      title: 'Values Inventory',
      description: 'Discover your core values across 9 fundamental dimensions based on Schwartz\'s Basic Human Values Theory. 36 items, Likert 1-5.',
      questionBank: VALUES_QUESTIONS as object[],
      scoringConfig: VALUES_SCORING_CONFIG as object,
      isActive: true,
    },
  })
  console.log(`✓ AssessmentTemplate: ${valuesTemplate.title} v${valuesTemplate.version} (${VALUES_QUESTIONS.length} items)`)

  // ── 1c. Upsert Attachment Style template ───────────────────────────────────
  const attachmentTemplate = await prisma.assessmentTemplate.upsert({
    where: { type_version: { type: AssessmentType.ATTACHMENT_STYLE, version: '1.0' } },
    update: {
      questionBank: ATTACHMENT_QUESTIONS as object[],
      scoringConfig: ATTACHMENT_SCORING_CONFIG as object,
    },
    create: {
      type: AssessmentType.ATTACHMENT_STYLE,
      version: '1.0',
      title: 'Attachment Style Inventory',
      description: 'Understand your relational blueprint — how you connect, trust, and seek closeness. Measures anxiety and avoidance dimensions to reveal your attachment pattern. 18 items, Likert 1-5.',
      questionBank: ATTACHMENT_QUESTIONS as object[],
      scoringConfig: ATTACHMENT_SCORING_CONFIG as object,
      isActive: true,
    },
  })
  console.log(`✓ AssessmentTemplate: ${attachmentTemplate.title} v${attachmentTemplate.version} (${ATTACHMENT_QUESTIONS.length} items)`)

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
