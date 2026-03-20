// Static metadata for the 12 classic Jungian archetypes used in email personalization.

export interface ArchetypeMetadata {
  name: string
  tagline: string
  description: string
}

const ARCHETYPE_MAP: Record<string, ArchetypeMetadata> = {
  'The Hero': {
    name: 'The Hero',
    tagline: 'The one who rises to the challenge',
    description:
      'You are driven by courage and the desire to prove your worth through action. The Hero within you sees obstacles as opportunities and transforms adversity into strength. Your journey is one of growth through challenge.',
  },
  'The Sage': {
    name: 'The Sage',
    tagline: 'The seeker of truth and wisdom',
    description:
      'You are compelled by the pursuit of understanding. The Sage within you questions, analyses, and seeks to see through illusions to the deeper truth. Your greatest gift is the clarity of mind you offer to a confused world.',
  },
  'The Explorer': {
    name: 'The Explorer',
    tagline: 'The one who seeks meaning beyond the horizon',
    description:
      'You are driven by a restless hunger for authentic experience. The Explorer within you resists conformity and constantly seeks new territory — physical, intellectual, or spiritual. Freedom and discovery are your oxygen.',
  },
  'The Creator': {
    name: 'The Creator',
    tagline: 'The visionary who builds worlds',
    description:
      'You are compelled to give form to your inner vision. The Creator within you sees potential everywhere and finds meaning through making things that did not exist before. Imagination is your native language.',
  },
  'The Caregiver': {
    name: 'The Caregiver',
    tagline: 'The protector and nurturer',
    description:
      'You are moved by compassion and the desire to protect those you love. The Caregiver within you finds purpose through service and sees the vulnerabilities in others as calls to action. Your love is expressed through action.',
  },
  'The Ruler': {
    name: 'The Ruler',
    tagline: 'The architect of order',
    description:
      'You are drawn to responsibility and the creation of lasting structures. The Ruler within you understands that real power comes from competence and integrity, not dominance. You build systems that outlast you.',
  },
  'The Magician': {
    name: 'The Magician',
    tagline: 'The transformer of reality',
    description:
      'You are drawn to the liminal spaces where transformation happens. The Magician within you understands that the world is malleable — that consciousness shapes reality. You catalyze change in yourself and others.',
  },
  'The Innocent': {
    name: 'The Innocent',
    tagline: 'The believer in goodness',
    description:
      'You carry an innate optimism and faith in the fundamental goodness of life. The Innocent within you has not surrendered its wonder or its trust that things can be right. Your hope is a radical act.',
  },
  'The Outlaw': {
    name: 'The Outlaw',
    tagline: 'The revolutionary who breaks what must be broken',
    description:
      'You are driven by a visceral need to challenge what feels false or unjust. The Outlaw within you refuses to pretend that broken systems are acceptable. Your disruption is in service of something truer.',
  },
  'The Lover': {
    name: 'The Lover',
    tagline: 'The pursuer of connection and beauty',
    description:
      'You are moved by beauty, connection, and the desire for deep intimacy. The Lover within you experiences life in full colour and is most alive when in union with what it loves most. Passion is your compass.',
  },
  'The Jester': {
    name: 'The Jester',
    tagline: 'The one who lives in the moment',
    description:
      'You are alive to the absurdity and delight of existence. The Jester within you understands that laughter is a form of wisdom, and that play opens doors that seriousness keeps locked. Joy is your protest against the mundane.',
  },
  'The Everyman': {
    name: 'The Everyman',
    tagline: 'The connector who belongs everywhere',
    description:
      'You are driven by the need to belong and to connect with others as equals. The Everyman within you is unpretentious and real, finding common ground where others see division. Your humanity is your superpower.',
  },
}

const DEFAULT_ARCHETYPE: ArchetypeMetadata = {
  name: 'The Seeker',
  tagline: 'The one searching for deeper meaning',
  description:
    'Your psychological portrait reveals a complex inner world driven by the desire for meaning and self-understanding. You are engaged in the fundamental human project of knowing yourself — and that self-knowledge is already changing who you are.',
}

export function getArchetypeMetadata(archetypeName: string): ArchetypeMetadata {
  if (ARCHETYPE_MAP[archetypeName]) return ARCHETYPE_MAP[archetypeName]

  // Case-insensitive partial match
  const lower = archetypeName.toLowerCase()
  for (const [key, meta] of Object.entries(ARCHETYPE_MAP)) {
    const keyCore = key.toLowerCase().replace('the ', '')
    if (lower.includes(keyCore) || key.toLowerCase().includes(lower)) {
      return { ...meta, name: archetypeName }
    }
  }

  return { ...DEFAULT_ARCHETYPE, name: archetypeName }
}

// Big Five dimension label mapping for email personalization
const BIG_FIVE_LABELS: Record<string, string> = {
  openness: 'Openness',
  conscientiousness: 'Conscientiousness',
  extraversion: 'Extraversion',
  agreeableness: 'Agreeableness',
  neuroticism: 'Neuroticism',
  // alternate spellings
  emotional_stability: 'Emotional Stability',
  intellect: 'Openness',
}

export function getTopBigFiveTrait(dimensions: Record<string, unknown>): string {
  let topKey = ''
  let topScore = -Infinity

  for (const [key, val] of Object.entries(dimensions)) {
    // Dimension values may be numbers or objects with a score field
    const score = typeof val === 'number' ? val : (val as Record<string, number>)?.score ?? 0
    if (score > topScore) {
      topScore = score
      topKey = key
    }
  }

  return BIG_FIVE_LABELS[topKey.toLowerCase()] ?? topKey
}
