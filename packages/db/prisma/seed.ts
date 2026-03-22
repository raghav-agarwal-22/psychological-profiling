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

// ─── Light Triad + Dark Triad (18 items, Kaufman et al. inspired) ────────────
//
// Light Triad: Kantianism, Humanism, Faith in Humanity (prosocial)
// Dark Triad: Narcissism, Machiavellianism, Psychopathy (antagonistic)
// 3 items per dimension, 1-5 Likert scale

const LIGHT_DARK_TRIAD_QUESTIONS = [
  // ── Kantianism (Light) ─────────────────────────────────────────────────────
  { id: 'KAN_01', text: 'I treat all people as worthy of dignity and respect, regardless of what they can do for me.',     dimension: 'kantianism',        reverse_scored: false },
  { id: 'KAN_02', text: 'I would not use someone as a means to my own ends without their knowledge.',                      dimension: 'kantianism',        reverse_scored: false },
  { id: 'KAN_03', text: 'I believe every person has intrinsic worth that cannot be reduced to their usefulness.',          dimension: 'kantianism',        reverse_scored: false },

  // ── Humanism (Light) ───────────────────────────────────────────────────────
  { id: 'HUM_01', text: 'I am interested in the inner life and unique story of every person I meet.',                      dimension: 'humanism',          reverse_scored: false },
  { id: 'HUM_02', text: 'I genuinely care about the wellbeing of people I will never meet.',                               dimension: 'humanism',          reverse_scored: false },
  { id: 'HUM_03', text: "I believe that understanding another person's perspective is one of the most valuable things I can do.", dimension: 'humanism',   reverse_scored: false },

  // ── Faith in Humanity (Light) ──────────────────────────────────────────────
  { id: 'FIH_01', text: 'I believe that most people are fundamentally good at heart.',                                     dimension: 'faith_in_humanity', reverse_scored: false },
  { id: 'FIH_02', text: 'I think that if given the chance, most people will try to do the right thing.',                  dimension: 'faith_in_humanity', reverse_scored: false },
  { id: 'FIH_03', text: 'Despite the suffering in the world, I maintain a basic trust in human nature.',                  dimension: 'faith_in_humanity', reverse_scored: false },

  // ── Narcissism (Dark) ──────────────────────────────────────────────────────
  { id: 'NAR_01', text: 'I deserve special treatment that others do not.',                                                 dimension: 'narcissism',        reverse_scored: false },
  { id: 'NAR_02', text: 'I like to be the center of attention and feel diminished when I am not.',                        dimension: 'narcissism',        reverse_scored: false },
  { id: 'NAR_03', text: 'I expect people to recognize and admire my abilities.',                                          dimension: 'narcissism',        reverse_scored: false },

  // ── Machiavellianism (Dark) ────────────────────────────────────────────────
  { id: 'MAC_01', text: 'I am willing to be dishonest if it helps me get what I want.',                                   dimension: 'machiavellianism',  reverse_scored: false },
  { id: 'MAC_02', text: 'I tend to manipulate others to get my way.',                                                     dimension: 'machiavellianism',  reverse_scored: false },
  { id: 'MAC_03', text: 'I believe that most people can be manipulated if you know the right techniques.',                dimension: 'machiavellianism',  reverse_scored: false },

  // ── Psychopathy (Dark) ─────────────────────────────────────────────────────
  { id: 'PSY_01', text: 'I rarely feel remorse for hurting others.',                                                      dimension: 'psychopathy',       reverse_scored: false },
  { id: 'PSY_02', text: 'I find it easy to take advantage of people without feeling bad about it.',                       dimension: 'psychopathy',       reverse_scored: false },
  { id: 'PSY_03', text: "I tend to lack empathy — other people's emotions don't affect me much.",                        dimension: 'psychopathy',       reverse_scored: false },
]

const LIGHT_DARK_TRIAD_SCORING_CONFIG: ScoringConfig = {
  kantianism:        { questionIds: ['KAN_01','KAN_02','KAN_03'], reverseIds: [], formula: 'average', normalize: true },
  humanism:          { questionIds: ['HUM_01','HUM_02','HUM_03'], reverseIds: [], formula: 'average', normalize: true },
  faith_in_humanity: { questionIds: ['FIH_01','FIH_02','FIH_03'], reverseIds: [], formula: 'average', normalize: true },
  narcissism:        { questionIds: ['NAR_01','NAR_02','NAR_03'], reverseIds: [], formula: 'average', normalize: true },
  machiavellianism:  { questionIds: ['MAC_01','MAC_02','MAC_03'], reverseIds: [], formula: 'average', normalize: true },
  psychopathy:       { questionIds: ['PSY_01','PSY_02','PSY_03'], reverseIds: [], formula: 'average', normalize: true },
}

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

// ─── Enneagram Question Bank (45 items, 5 per type) ───────────────────────────
//
// Likert-scale statements: 1 = strongly disagree, 5 = strongly agree.
// Dimensions map to type_1 through type_9 corresponding to the nine types.

const ENNEAGRAM_QUESTIONS = [
  // ── Type 1: The Reformer ───────────────────────────────────────────────────
  { id: 'E1_01', text: 'I have a strong sense of what is right and wrong.',                          dimension: 'type_1', reverse_scored: false },
  { id: 'E1_02', text: 'I often notice details that others overlook.',                               dimension: 'type_1', reverse_scored: false },
  { id: 'E1_03', text: 'I feel an inner pressure to improve myself and the world around me.',        dimension: 'type_1', reverse_scored: false },
  { id: 'E1_04', text: 'I find it difficult to tolerate sloppiness or moral compromise.',            dimension: 'type_1', reverse_scored: false },
  { id: 'E1_05', text: 'I hold myself to a higher standard than I hold most other people.',          dimension: 'type_1', reverse_scored: false },

  // ── Type 2: The Helper ─────────────────────────────────────────────────────
  { id: 'E2_01', text: 'I naturally tune in to what other people need before they ask.',             dimension: 'type_2', reverse_scored: false },
  { id: 'E2_02', text: 'Being needed by others gives me a deep sense of purpose.',                   dimension: 'type_2', reverse_scored: false },
  { id: 'E2_03', text: 'I find it hard to say no, especially to people I care about.',              dimension: 'type_2', reverse_scored: false },
  { id: 'E2_04', text: 'I give generously to others and sometimes feel unappreciated for it.',       dimension: 'type_2', reverse_scored: false },
  { id: 'E2_05', text: 'My relationships are the most important thing in my life.',                  dimension: 'type_2', reverse_scored: false },

  // ── Type 3: The Achiever ───────────────────────────────────────────────────
  { id: 'E3_01', text: 'I am very motivated by success and the recognition that comes with it.',     dimension: 'type_3', reverse_scored: false },
  { id: 'E3_02', text: 'I am skilled at presenting myself well in different social contexts.',       dimension: 'type_3', reverse_scored: false },
  { id: 'E3_03', text: 'I set ambitious goals and work hard to achieve them.',                       dimension: 'type_3', reverse_scored: false },
  { id: 'E3_04', text: 'I think about how I am perceived and work to project a winning image.',      dimension: 'type_3', reverse_scored: false },
  { id: 'E3_05', text: 'Failure or appearing incompetent is one of my deepest fears.',               dimension: 'type_3', reverse_scored: false },

  // ── Type 4: The Individualist ──────────────────────────────────────────────
  { id: 'E4_01', text: 'I have a persistent sense that something essential is missing from my life.', dimension: 'type_4', reverse_scored: false },
  { id: 'E4_02', text: 'I feel most alive when I can express myself authentically and creatively.',  dimension: 'type_4', reverse_scored: false },
  { id: 'E4_03', text: 'I am drawn to beauty, melancholy, and things that feel deeply meaningful.',  dimension: 'type_4', reverse_scored: false },
  { id: 'E4_04', text: 'I see myself as fundamentally different from most other people.',            dimension: 'type_4', reverse_scored: false },
  { id: 'E4_05', text: 'My emotions are intense, and I dwell on them more than most people do.',     dimension: 'type_4', reverse_scored: false },

  // ── Type 5: The Investigator ───────────────────────────────────────────────
  { id: 'E5_01', text: 'I prefer to observe and understand a situation before I engage with it.',    dimension: 'type_5', reverse_scored: false },
  { id: 'E5_02', text: 'I protect my time and privacy very carefully.',                              dimension: 'type_5', reverse_scored: false },
  { id: 'E5_03', text: 'I feel most comfortable when I have mastery of a subject or skill.',         dimension: 'type_5', reverse_scored: false },
  { id: 'E5_04', text: 'I tend to withdraw when I feel emotionally or socially overwhelmed.',        dimension: 'type_5', reverse_scored: false },
  { id: 'E5_05', text: 'I am energized by deep intellectual exploration and independent thinking.',  dimension: 'type_5', reverse_scored: false },

  // ── Type 6: The Loyalist ───────────────────────────────────────────────────
  { id: 'E6_01', text: 'I often anticipate what could go wrong before committing to a course of action.', dimension: 'type_6', reverse_scored: false },
  { id: 'E6_02', text: 'I value loyalty and trust, and I am deeply committed to the people I align with.', dimension: 'type_6', reverse_scored: false },
  { id: 'E6_03', text: 'I frequently look to trusted authorities or groups to help me feel secure.',  dimension: 'type_6', reverse_scored: false },
  { id: 'E6_04', text: 'I can be suspicious of people\'s motives until they prove themselves trustworthy.', dimension: 'type_6', reverse_scored: false },
  { id: 'E6_05', text: 'Anxiety and self-doubt are recurring companions in my decision-making.',     dimension: 'type_6', reverse_scored: false },

  // ── Type 7: The Enthusiast ─────────────────────────────────────────────────
  { id: 'E7_01', text: 'I am drawn to new experiences, adventures, and exciting possibilities.',     dimension: 'type_7', reverse_scored: false },
  { id: 'E7_02', text: 'I tend to keep my options open rather than commit to one path.',             dimension: 'type_7', reverse_scored: false },
  { id: 'E7_03', text: 'I reframe difficult situations quickly to find the positive angle.',         dimension: 'type_7', reverse_scored: false },
  { id: 'E7_04', text: 'I find it hard to sit with boredom, routine, or emotional pain for long.',  dimension: 'type_7', reverse_scored: false },
  { id: 'E7_05', text: 'I have many interests and can become scattered when pursuing all of them.',  dimension: 'type_7', reverse_scored: false },

  // ── Type 8: The Challenger ─────────────────────────────────────────────────
  { id: 'E8_01', text: 'I am assertive and have no problem confronting people or situations directly.', dimension: 'type_8', reverse_scored: false },
  { id: 'E8_02', text: 'I have a strong need to be in control of my own life and decisions.',        dimension: 'type_8', reverse_scored: false },
  { id: 'E8_03', text: 'I instinctively protect those who are weaker or who I consider under my care.', dimension: 'type_8', reverse_scored: false },
  { id: 'E8_04', text: 'Showing vulnerability feels dangerous or uncomfortable to me.',              dimension: 'type_8', reverse_scored: false },
  { id: 'E8_05', text: 'I respect people who are direct and strong, and I lose respect for those who seem weak.', dimension: 'type_8', reverse_scored: false },

  // ── Type 9: The Peacemaker ─────────────────────────────────────────────────
  { id: 'E9_01', text: 'I tend to go along with what others want to keep the peace.',               dimension: 'type_9', reverse_scored: false },
  { id: 'E9_02', text: 'I have difficulty knowing what I truly want when others\' needs are present.', dimension: 'type_9', reverse_scored: false },
  { id: 'E9_03', text: 'I feel an almost physical discomfort when there is conflict around me.',     dimension: 'type_9', reverse_scored: false },
  { id: 'E9_04', text: 'I can lose myself in routines or distractions rather than face difficult feelings.', dimension: 'type_9', reverse_scored: false },
  { id: 'E9_05', text: 'I see all sides of an issue and often struggle to take a firm stance.',      dimension: 'type_9', reverse_scored: false },
]

const ENNEAGRAM_SCORING_CONFIG: ScoringConfig = {
  type_1: { questionIds: ['E1_01','E1_02','E1_03','E1_04','E1_05'], reverseIds: [], formula: 'average', normalize: true },
  type_2: { questionIds: ['E2_01','E2_02','E2_03','E2_04','E2_05'], reverseIds: [], formula: 'average', normalize: true },
  type_3: { questionIds: ['E3_01','E3_02','E3_03','E3_04','E3_05'], reverseIds: [], formula: 'average', normalize: true },
  type_4: { questionIds: ['E4_01','E4_02','E4_03','E4_04','E4_05'], reverseIds: [], formula: 'average', normalize: true },
  type_5: { questionIds: ['E5_01','E5_02','E5_03','E5_04','E5_05'], reverseIds: [], formula: 'average', normalize: true },
  type_6: { questionIds: ['E6_01','E6_02','E6_03','E6_04','E6_05'], reverseIds: [], formula: 'average', normalize: true },
  type_7: { questionIds: ['E7_01','E7_02','E7_03','E7_04','E7_05'], reverseIds: [], formula: 'average', normalize: true },
  type_8: { questionIds: ['E8_01','E8_02','E8_03','E8_04','E8_05'], reverseIds: [], formula: 'average', normalize: true },
  type_9: { questionIds: ['E9_01','E9_02','E9_03','E9_04','E9_05'], reverseIds: [], formula: 'average', normalize: true },
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

// ─── Jungian Archetypes Question Bank (36 items, 3 per archetype) ─────────────
//
// 12 Jungian archetypes, 3 Likert-scale items each.
// 1 = Strongly Disagree, 5 = Strongly Agree.
// Each question maps to one archetype dimension.

const JUNGIAN_QUESTIONS = [
  // ── The Hero ────────────────────────────────────────────────────────────────
  { id: 'JA_HERO_1',      text: 'I feel most alive when I am overcoming a significant challenge.',                    dimension: 'the_hero',      reverse_scored: false },
  { id: 'JA_HERO_2',      text: 'I push through difficulty even when others around me give up.',                      dimension: 'the_hero',      reverse_scored: false },
  { id: 'JA_HERO_3',      text: 'I am driven by a need to prove my worth through my achievements.',                   dimension: 'the_hero',      reverse_scored: false },

  // ── The Sage ────────────────────────────────────────────────────────────────
  { id: 'JA_SAGE_1',      text: 'I am drawn to understanding the deeper truths behind things rather than accepting surface explanations.', dimension: 'the_sage', reverse_scored: false },
  { id: 'JA_SAGE_2',      text: 'People often come to me for perspective, and I genuinely enjoy helping them think things through.',       dimension: 'the_sage', reverse_scored: false },
  { id: 'JA_SAGE_3',      text: 'I would rather make a decision slowly and wisely than quickly and impulsively.',     dimension: 'the_sage',      reverse_scored: false },

  // ── The Explorer ────────────────────────────────────────────────────────────
  { id: 'JA_EXPL_1',      text: 'I feel most like myself when I am discovering new places, ideas, or ways of living.', dimension: 'the_explorer', reverse_scored: false },
  { id: 'JA_EXPL_2',      text: 'Routines and constraints feel stifling to me — I crave freedom to chart my own course.', dimension: 'the_explorer', reverse_scored: false },
  { id: 'JA_EXPL_3',      text: 'I would rather leave a comfortable situation that feels inauthentic than stay and settle.', dimension: 'the_explorer', reverse_scored: false },

  // ── The Creator ─────────────────────────────────────────────────────────────
  { id: 'JA_CREA_1',      text: 'I feel a deep compulsion to make things — to bring something new into existence.',   dimension: 'the_creator',   reverse_scored: false },
  { id: 'JA_CREA_2',      text: 'I find more meaning in the act of creating than in the recognition it brings.',      dimension: 'the_creator',   reverse_scored: false },
  { id: 'JA_CREA_3',      text: 'My imagination regularly produces visions that I then feel compelled to realise.',   dimension: 'the_creator',   reverse_scored: false },

  // ── The Ruler ───────────────────────────────────────────────────────────────
  { id: 'JA_RULE_1',      text: 'I am at my best when I am responsible for a team or system and can set the direction.', dimension: 'the_ruler',  reverse_scored: false },
  { id: 'JA_RULE_2',      text: 'I take responsibility seriously — I expect the same standards from myself as from those I lead.', dimension: 'the_ruler', reverse_scored: false },
  { id: 'JA_RULE_3',      text: 'I am comfortable making difficult decisions and taking the consequences that follow.', dimension: 'the_ruler',   reverse_scored: false },

  // ── The Caregiver ───────────────────────────────────────────────────────────
  { id: 'JA_CARE_1',      text: 'Protecting and nurturing the people I love gives my life its deepest sense of meaning.', dimension: 'the_caregiver', reverse_scored: false },
  { id: 'JA_CARE_2',      text: 'I often put the needs of others before my own, sometimes to my own detriment.',     dimension: 'the_caregiver', reverse_scored: false },
  { id: 'JA_CARE_3',      text: 'I feel distress when those around me are suffering and I cannot help.',              dimension: 'the_caregiver', reverse_scored: false },

  // ── The Magician ────────────────────────────────────────────────────────────
  { id: 'JA_MAGI_1',      text: 'I naturally see how to shift a situation, conversation, or system in a new direction.', dimension: 'the_magician', reverse_scored: false },
  { id: 'JA_MAGI_2',      text: 'I am energised by transforming what is stuck or broken into something vital and new.', dimension: 'the_magician', reverse_scored: false },
  { id: 'JA_MAGI_3',      text: 'I believe that changing how we think about something can change everything about it.', dimension: 'the_magician', reverse_scored: false },

  // ── The Lover ───────────────────────────────────────────────────────────────
  { id: 'JA_LOVE_1',      text: 'I experience the world intensely — beauty, connection, and passion move me deeply.',  dimension: 'the_lover',    reverse_scored: false },
  { id: 'JA_LOVE_2',      text: 'I am drawn to deep, intimate connections rather than broad networks of acquaintances.', dimension: 'the_lover',  reverse_scored: false },
  { id: 'JA_LOVE_3',      text: 'I pursue what I love wholeheartedly, even if it is impractical or unconventional.',  dimension: 'the_lover',    reverse_scored: false },

  // ── The Jester ──────────────────────────────────────────────────────────────
  { id: 'JA_JEST_1',      text: 'I find humor in most situations and use it to connect with people and ease tension.', dimension: 'the_jester',  reverse_scored: false },
  { id: 'JA_JEST_2',      text: 'I live firmly in the present — I believe joy is something you create now, not later.', dimension: 'the_jester', reverse_scored: false },
  { id: 'JA_JEST_3',      text: 'I sometimes use playfulness and wit to challenge assumptions others take too seriously.', dimension: 'the_jester', reverse_scored: false },

  // ── The Orphan ──────────────────────────────────────────────────────────────
  { id: 'JA_ORPH_1',      text: 'I have a strong need to belong somewhere — to be seen and accepted as I truly am.',  dimension: 'the_orphan',   reverse_scored: false },
  { id: 'JA_ORPH_2',      text: 'I have a realistic, pragmatic view of the world because life has taught me not to expect too much.', dimension: 'the_orphan', reverse_scored: false },
  { id: 'JA_ORPH_3',      text: 'I empathise deeply with people who are marginalised or feel they do not fit in.',    dimension: 'the_orphan',   reverse_scored: false },

  // ── The Warrior ─────────────────────────────────────────────────────────────
  { id: 'JA_WARR_1',      text: 'I hold myself to a strict code of conduct and rarely compromise my principles.',     dimension: 'the_warrior',  reverse_scored: false },
  { id: 'JA_WARR_2',      text: 'I am motivated by the discipline required to master a craft, skill, or way of being.', dimension: 'the_warrior', reverse_scored: false },
  { id: 'JA_WARR_3',      text: 'I stand up for what is right even when it is costly or uncomfortable.',              dimension: 'the_warrior',  reverse_scored: false },

  // ── The Innocent ────────────────────────────────────────────────────────────
  { id: 'JA_INNO_1',      text: 'I approach the world with a fundamental optimism that things will work out.',        dimension: 'the_innocent', reverse_scored: false },
  { id: 'JA_INNO_2',      text: 'I believe in the goodness of people and tend to see the best in those around me.',   dimension: 'the_innocent', reverse_scored: false },
  { id: 'JA_INNO_3',      text: 'I feel most at peace in simple, authentic moments free from cynicism and complexity.', dimension: 'the_innocent', reverse_scored: false },
]

const JUNGIAN_SCORING_CONFIG: ScoringConfig = {
  the_hero:      { questionIds: ['JA_HERO_1','JA_HERO_2','JA_HERO_3'],   reverseIds: [], formula: 'average', normalize: true },
  the_sage:      { questionIds: ['JA_SAGE_1','JA_SAGE_2','JA_SAGE_3'],   reverseIds: [], formula: 'average', normalize: true },
  the_explorer:  { questionIds: ['JA_EXPL_1','JA_EXPL_2','JA_EXPL_3'],   reverseIds: [], formula: 'average', normalize: true },
  the_creator:   { questionIds: ['JA_CREA_1','JA_CREA_2','JA_CREA_3'],   reverseIds: [], formula: 'average', normalize: true },
  the_ruler:     { questionIds: ['JA_RULE_1','JA_RULE_2','JA_RULE_3'],   reverseIds: [], formula: 'average', normalize: true },
  the_caregiver: { questionIds: ['JA_CARE_1','JA_CARE_2','JA_CARE_3'],   reverseIds: [], formula: 'average', normalize: true },
  the_magician:  { questionIds: ['JA_MAGI_1','JA_MAGI_2','JA_MAGI_3'],   reverseIds: [], formula: 'average', normalize: true },
  the_lover:     { questionIds: ['JA_LOVE_1','JA_LOVE_2','JA_LOVE_3'],   reverseIds: [], formula: 'average', normalize: true },
  the_jester:    { questionIds: ['JA_JEST_1','JA_JEST_2','JA_JEST_3'],   reverseIds: [], formula: 'average', normalize: true },
  the_orphan:    { questionIds: ['JA_ORPH_1','JA_ORPH_2','JA_ORPH_3'],   reverseIds: [], formula: 'average', normalize: true },
  the_warrior:   { questionIds: ['JA_WARR_1','JA_WARR_2','JA_WARR_3'],   reverseIds: [], formula: 'average', normalize: true },
  the_innocent:  { questionIds: ['JA_INNO_1','JA_INNO_2','JA_INNO_3'],   reverseIds: [], formula: 'average', normalize: true },
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

  // ── 1d. Upsert Enneagram template ──────────────────────────────────────────
  const enneagramTemplate = await prisma.assessmentTemplate.upsert({
    where: { type_version: { type: AssessmentType.ENNEAGRAM, version: '1.0' } },
    update: {},
    create: {
      type: AssessmentType.ENNEAGRAM,
      version: '1.0',
      title: 'Enneagram Personality Types',
      description: 'Discover your core Enneagram type and wing through 45 statements about how you think, feel, and behave.',
      questionBank: ENNEAGRAM_QUESTIONS as object[],
      scoringConfig: ENNEAGRAM_SCORING_CONFIG as object,
      isActive: true,
    },
  })
  console.log(`✓ AssessmentTemplate: ${enneagramTemplate.title} v${enneagramTemplate.version} (${ENNEAGRAM_QUESTIONS.length} items)`)

  // ── 1e. Upsert Light/Dark Triad template ───────────────────────────────────
  const triadTemplate = await prisma.assessmentTemplate.upsert({
    where: { type_version: { type: AssessmentType.LIGHT_DARK_TRIAD, version: '1.0' } },
    update: {
      questionBank: LIGHT_DARK_TRIAD_QUESTIONS as object[],
      scoringConfig: LIGHT_DARK_TRIAD_SCORING_CONFIG as object,
    },
    create: {
      type: AssessmentType.LIGHT_DARK_TRIAD,
      version: '1.0',
      title: 'Light & Dark Triad',
      description: 'Explore your position on the light-dark personality spectrum. Measures three prosocial virtues (Kantianism, Humanism, Faith in Humanity) and three antagonistic tendencies (Narcissism, Machiavellianism, Psychopathy). 18 items, Likert 1–5.',
      questionBank: LIGHT_DARK_TRIAD_QUESTIONS as object[],
      scoringConfig: LIGHT_DARK_TRIAD_SCORING_CONFIG as object,
      isActive: true,
    },
  })
  console.log(`✓ AssessmentTemplate: ${triadTemplate.title} v${triadTemplate.version} (${LIGHT_DARK_TRIAD_QUESTIONS.length} items)`)

  // ── 1f. Upsert Jungian Archetypes template ─────────────────────────────────
  const jungianTemplate = await prisma.assessmentTemplate.upsert({
    where: { type_version: { type: AssessmentType.JUNGIAN_ARCHETYPES, version: '1.0' } },
    update: {
      questionBank: JUNGIAN_QUESTIONS as object[],
      scoringConfig: JUNGIAN_SCORING_CONFIG as object,
    },
    create: {
      type: AssessmentType.JUNGIAN_ARCHETYPES,
      version: '1.0',
      title: 'Jungian Archetypes',
      description: 'Discover your primary and shadow Jungian archetypes across 12 universal patterns: Hero, Sage, Explorer, Creator, Ruler, Caregiver, Magician, Lover, Jester, Orphan, Warrior, and Innocent. 36 items, Likert 1–5.',
      questionBank: JUNGIAN_QUESTIONS as object[],
      scoringConfig: JUNGIAN_SCORING_CONFIG as object,
      isActive: true,
    },
  })
  console.log(`✓ AssessmentTemplate: ${jungianTemplate.title} v${jungianTemplate.version} (${JUNGIAN_QUESTIONS.length} items)`)

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

  // ── 7. Seed testimonials ───────────────────────────────────────────────────
  const testimonialData = [
    {
      firstName: 'Sarah',
      personalityTag: 'High Openness · Sage',
      rating: 5,
      quote: "Finally an app that takes psychological depth seriously. I've tried every personality tool out there and nothing has given me the quality of self-reflection that Innermind has. The AI narrative alone is worth it.",
      isApproved: true,
      isFeatured: true,
    },
    {
      firstName: 'James',
      personalityTag: 'Therapist',
      rating: 5,
      quote: "I've done MBTI, Enneagram, everything — Innermind went deeper than any of them. As a therapist I'm skeptical of these tools, but the synthesis here is genuinely sophisticated. I now recommend it to clients.",
      isApproved: true,
      isFeatured: true,
    },
    {
      firstName: 'Priya',
      personalityTag: 'INFJ · Enneagram 4',
      rating: 5,
      quote: "Taking the Jungian archetypes assessment was genuinely moving. The shadow archetype section made me pause for an hour. I filled two pages in my journal afterward. I didn't expect a web app to do that.",
      isApproved: true,
      isFeatured: true,
    },
    {
      firstName: 'Marcus',
      personalityTag: 'Secure Attachment · Enneagram 3',
      rating: 5,
      quote: "The cross-framework synthesis is what sets Innermind apart. Seeing how my Enneagram 3 patterns connect to my attachment style was an 'aha' moment I've been chasing for years in therapy.",
      isApproved: true,
      isFeatured: false,
    },
    {
      firstName: 'Elena',
      personalityTag: 'Values-driven · High Conscientiousness',
      rating: 5,
      quote: "I appreciated the Values Inventory most. It surfaced a tension between security and self-direction I'd never articulated before. That single insight changed how I think about my career.",
      isApproved: true,
      isFeatured: false,
    },
    {
      firstName: 'David',
      personalityTag: 'Coach',
      rating: 4,
      quote: "The growth recommendations are genuinely actionable — not generic self-help. I run a coaching practice and I now have every client take the Big Five before our first session. It's a real time-saver.",
      isApproved: true,
      isFeatured: false,
    },
    {
      firstName: 'Aisha',
      personalityTag: 'Anxious Attachment · Enneagram 6',
      rating: 5,
      quote: "The attachment style results were hard to read but exactly what I needed. The growth guidance was compassionate, not clinical. I've gone back to it three times already.",
      isApproved: true,
      isFeatured: false,
    },
    {
      firstName: 'Tom',
      personalityTag: 'High Openness · Creator',
      rating: 4,
      quote: "Innermind made the abstract concrete. I've known I'm creative and sensitive, but seeing it mapped across five frameworks at once gave me language for things I'd struggled to explain to people.",
      isApproved: true,
      isFeatured: false,
    },
  ]

  // Create seed users for testimonials (separate from the dev user above)
  for (let i = 0; i < testimonialData.length; i++) {
    const t = testimonialData[i]
    const seedUser = await prisma.user.upsert({
      where: { email: `testimonial-seed-${i}@innermind.internal` },
      update: {},
      create: {
        email: `testimonial-seed-${i}@innermind.internal`,
        name: t.firstName,
      },
    })
    await prisma.testimonial.upsert({
      where: { userId: seedUser.id },
      update: {},
      create: {
        userId: seedUser.id,
        firstName: t.firstName,
        personalityTag: t.personalityTag,
        rating: t.rating,
        quote: t.quote,
        isApproved: t.isApproved,
        isFeatured: t.isFeatured,
      },
    })
    console.log(`✓ Testimonial: ${t.firstName} (${t.rating}★)`)
  }

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
