export interface Archetype {
  slug: string
  name: string
  symbol: string
  tagline: string
  coreTheme: string
  mythologicalReferences: string[]
  shadowExpression: string
  growthPath: string
  famousExamples: string[]
  strengths: string[]
  challenges: string[]
  complementaryArchetypes: string[]
  shadowArchetypes: string[]
  color: string
  description: string
}

export const ARCHETYPES: Archetype[] = [
  {
    slug: 'the-hero',
    name: 'The Hero',
    symbol: '⚔️',
    tagline: 'Courage in the face of the impossible',
    coreTheme:
      'The Hero is driven by a deep need to prove their worth through courage, determination, and overcoming adversity. They accept the call to adventure and push through fear to achieve transformation — both for themselves and the world around them.',
    mythologicalReferences: [
      'Heracles (Greek) — completed twelve labors to atone and transcend his mortal limitations',
      'Arjuna (Hindu) — faced the moral crisis of the Mahabharata war and chose righteous action',
      'Beowulf (Norse-Anglo-Saxon) — slew monsters threatening the community at great personal cost',
      'Achilles (Greek) — embodied glory and sacrifice, choosing a short brilliant life over obscurity',
    ],
    shadowExpression:
      'When the Hero loses balance, they become the Tyrant or the Bully — using strength to dominate rather than protect, needing victory so badly they crush others to get it. The shadow also manifests as arrogance: the belief that only they can save the day, leading to burnout, isolation, and an inability to receive help.',
    growthPath:
      'The Hero grows by learning that true courage includes vulnerability — asking for help, admitting failure, and protecting the inner child rather than only the outer world. The mature Hero becomes a servant leader, using strength to lift others rather than prove themselves.',
    famousExamples: [
      'Nelson Mandela',
      'Malala Yousafzai',
      'Frodo Baggins (LOTR)',
      'Simba (The Lion King)',
      'Wonder Woman',
    ],
    strengths: ['Courage', 'Determination', 'Resilience', 'Inspiration', 'Protective instinct'],
    challenges: ['Arrogance', 'Difficulty receiving help', 'Burnout', 'Competitive shadow', 'Fear of failure'],
    complementaryArchetypes: ['the-caregiver', 'the-sage'],
    shadowArchetypes: ['the-ruler', 'the-warrior'],
    color: 'amber',
    description:
      'You embody courage and determination. You rise to challenges others avoid and inspire those around you through action.',
  },
  {
    slug: 'the-shadow',
    name: 'The Shadow',
    symbol: '🌑',
    tagline: 'What is hidden holds the most power',
    coreTheme:
      "The Shadow represents the unconscious aspects of personality — the repressed, denied, or unexplored dimensions of the self. In Jungian psychology, the Shadow isn't evil; it's simply everything we have pushed into the dark. Integrating the Shadow is the core work of psychological maturity.",
    mythologicalReferences: [
      'Hades (Greek) — ruler of the underworld, keeper of hidden wealth and souls',
      'Loki (Norse) — the trickster god who reveals uncomfortable truths through chaos',
      'Set (Egyptian) — god of chaos and storms, brother-enemy of Osiris',
      'Kali (Hindu) — goddess of destruction who clears what must be released',
    ],
    shadowExpression:
      "The Shadow's shadow is paradoxical: projection. When someone embodies this archetype unconsciously, they see their own darkness everywhere in others, or they dramatize the very qualities they deny in themselves. The trap is identification — becoming entirely the dark figure rather than integrating it.",
    growthPath:
      "Growth through the Shadow archetype means becoming a witness to one's own darkness — not with shame, but with curiosity. Shadow integration involves reclaiming the energy locked in repression: creativity, anger, desire, grief. Those who do this work become psychologically whole and deeply compassionate.",
    famousExamples: [
      'Carl Jung (who named and mapped this archetype)',
      'Darth Vader (Star Wars)',
      'Gollum (LOTR)',
      'Walter White (Breaking Bad)',
      'The Phantom of the Opera',
    ],
    strengths: ['Psychological depth', 'Honesty about darkness', 'Creative power', 'Transformation', 'Authenticity'],
    challenges: ['Projection', 'Self-destruction', 'Isolation', 'Shame cycles', 'Difficulty with lightness'],
    complementaryArchetypes: ['the-magician', 'the-sage'],
    shadowArchetypes: ['the-hero', 'the-ruler'],
    color: 'violet',
    description:
      'You carry deep psychological awareness and the courage to explore what others deny. Your strength lies in integration — making the unconscious conscious.',
  },
  {
    slug: 'the-sage',
    name: 'The Sage',
    symbol: '🦉',
    tagline: 'Truth is the highest freedom',
    coreTheme:
      'The Sage seeks understanding above all else. Driven by a deep hunger for truth and wisdom, they trust the life of the mind and believe that clarity of understanding is what liberates both individuals and societies. Knowledge, properly applied, is the Sage\'s contribution to the world.',
    mythologicalReferences: [
      'Athena (Greek) — goddess of wisdom and strategic intelligence',
      'Thoth (Egyptian) — god of knowledge, writing, and cosmic law',
      'Merlin (Arthurian) — the wise wizard who guides the Hero king',
      'Confucius (historical-mythological) — sage whose wisdom shaped civilization',
    ],
    shadowExpression:
      "The Sage's shadow is the Dogmatist — the one who mistakes their map for the territory and defends their model of reality against all evidence. Also: the Ivory Tower intellectual who accumulates knowledge but avoids the messy engagement of real life. The shadow Sage can become cold, detached, and superior.",
    growthPath:
      'The Sage grows by learning that wisdom without heart is merely information. The mature Sage combines deep understanding with genuine compassion, and they know when to speak and when to listen. They become the teacher who learns from students, holding knowledge lightly.',
    famousExamples: [
      'Yoda (Star Wars)',
      'Dumbledore (Harry Potter)',
      'Gandalf (LOTR)',
      'Socrates',
      'Maya Angelou',
    ],
    strengths: ['Deep intelligence', 'Clarity', 'Analytical power', 'Wisdom', 'Truth-seeking'],
    challenges: ['Detachment', 'Overthinking', 'Arrogance', 'Analysis paralysis', 'Emotional distance'],
    complementaryArchetypes: ['the-explorer', 'the-magician'],
    shadowArchetypes: ['the-jester', 'the-creator'],
    color: 'blue',
    description:
      'You are a seeker of truth and deep understanding. Your gift is clarity — the ability to cut through noise and illuminate what is real.',
  },
  {
    slug: 'the-explorer',
    name: 'The Explorer',
    symbol: '🧭',
    tagline: 'The world is a map yet to be drawn',
    coreTheme:
      "The Explorer is driven by an insatiable need to discover — new territories, new ideas, new ways of being. They resist conformity and convention, following an inner compass that pulls them toward the frontier. Freedom is the Explorer's deepest value; they wither in captivity.",
    mythologicalReferences: [
      'Odysseus (Greek) — the ten-year wandering homeward, full of impossible encounters',
      "Maui (Polynesian) — the demi-god who sailed to the edges of the world to expand humanity's world",
      'Hermes (Greek) — the messenger god who moved freely between all realms',
      "Gilgamesh (Sumerian) — the king who searched the ends of the earth for immortality's secret",
    ],
    shadowExpression:
      "The Explorer's shadow is the Wanderer — someone who can never commit, who treats every relationship or place as temporary, always believing the next horizon holds the real answer. The dark side of the Explorer avoids depth through perpetual movement, using discovery as an escape from self-knowledge.",
    growthPath:
      "The Explorer grows by learning that the deepest territory to explore is the inner world. The mature Explorer brings the same curiosity to relationships, commitments, and their own psychology that they bring to the external world. They discover that roots don't cage — they anchor.",
    famousExamples: [
      'Indiana Jones',
      'Amelia Earhart',
      'Jack Kerouac',
      'Elizabeth Gilbert (Eat Pray Love)',
      'David Attenborough',
    ],
    strengths: ['Curiosity', 'Adaptability', 'Independence', 'Open-mindedness', 'Resilience'],
    challenges: ['Commitment avoidance', 'Restlessness', 'Isolation', 'Superficiality risk', 'Fear of being trapped'],
    complementaryArchetypes: ['the-creator', 'the-sage'],
    shadowArchetypes: ['the-ruler', 'the-caregiver'],
    color: 'teal',
    description:
      'You are driven by curiosity and freedom. You live to discover — new ideas, new places, new ways of understanding the world.',
  },
  {
    slug: 'the-creator',
    name: 'The Creator',
    symbol: '✨',
    tagline: 'Imagination made tangible',
    coreTheme:
      "The Creator is compelled to make things — to bring into being what exists only in imagination. They are builders, artists, writers, inventors: anyone who feels the ache of an idea waiting to be realized. The Creator's deepest fear is the unlived creative life — work that never gets made.",
    mythologicalReferences: [
      'Prometheus (Greek) — stole fire from the gods to give humanity the power of creation',
      'Saraswati (Hindu) — goddess of arts, music, and creative knowledge',
      'Ptah (Egyptian) — god who created the world through spoken word and thought',
      'Brigid (Celtic) — goddess of poetry, craftsmanship, and inspired making',
    ],
    shadowExpression:
      "The Creator's shadow is the Perfectionist who destroys finished work, or the Self-Indulgent artist who uses creative license to avoid responsibility. The dark side creates endlessly but shares nothing, or creates recklessly without regard for consequence.",
    growthPath:
      'The Creator grows by learning that the creative act is also an act of service — that making things is how we give the world what only we can give. The mature Creator embraces imperfection and completion, finishing and releasing work even when it falls short of the inner vision.',
    famousExamples: [
      'Frida Kahlo',
      'Leonardo da Vinci',
      'Willy Wonka',
      'Picasso',
      'Mozart',
    ],
    strengths: ['Imagination', 'Originality', 'Vision', 'Aesthetic sense', 'Dedication'],
    challenges: ['Perfectionism', 'Self-doubt', 'Impracticality', 'Isolation', 'Sensitivity to criticism'],
    complementaryArchetypes: ['the-magician', 'the-explorer'],
    shadowArchetypes: ['the-ruler', 'the-hero'],
    color: 'pink',
    description:
      'You are compelled to make things that have never existed before. Your gift is vision — the ability to imagine what could be and bring it into being.',
  },
  {
    slug: 'the-caregiver',
    name: 'The Caregiver',
    symbol: '💛',
    tagline: 'Love expressed through action',
    coreTheme:
      "The Caregiver is moved by the suffering and needs of others. They give generously of their time, energy, and empathy — often at personal cost. Their deepest motivation is love in action: not as a feeling but as a practice. The Caregiver builds the relational fabric that holds communities together.",
    mythologicalReferences: [
      'Demeter (Greek) — the goddess who mourned so completely for her daughter that the earth went cold',
      'Quan Yin (Buddhist) — goddess of compassion who hears all suffering',
      'Mary (Christian) — the compassionate mother of divine love',
      'Chiron (Greek) — the wounded healer who gave his immortality for others\' freedom',
    ],
    shadowExpression:
      "The Caregiver's shadow is the Martyr or the Enabler — giving so much that they burn out, then feeling resentful about it, or using care to control and create dependency. The shadow Caregiver helps in ways that preserve their necessity, not the other person's growth.",
    growthPath:
      "The Caregiver grows by learning that self-care is not selfish — it is what makes sustained giving possible. The mature Caregiver gives from fullness rather than depletion, and distinguishes between care that empowers and care that creates dependency. They learn to receive as gracefully as they give.",
    famousExamples: [
      'Mother Teresa',
      'Fred Rogers (Mister Rogers)',
      'Marge Simpson',
      'Atticus Finch',
      'Princess Diana',
    ],
    strengths: ['Empathy', 'Generosity', 'Nurturing', 'Reliability', 'Emotional intelligence'],
    challenges: ['Martyrdom', 'Boundary difficulty', 'Enabling', 'Self-neglect', 'Resentment buildup'],
    complementaryArchetypes: ['the-hero', 'the-lover'],
    shadowArchetypes: ['the-ruler', 'the-warrior'],
    color: 'emerald',
    description:
      'You are moved by love expressed through action. You give generously of yourself and build the relational fabric that holds people together.',
  },
  {
    slug: 'the-ruler',
    name: 'The Ruler',
    symbol: '👑',
    tagline: 'Order from chaos, power with purpose',
    coreTheme:
      "The Ruler is called to create order, establish structure, and take responsibility for the whole. They think in terms of systems, legacies, and long-term consequences. At their best, they are the just king or queen — holding power as a sacred trust on behalf of those they serve.",
    mythologicalReferences: [
      'Zeus (Greek) — king of the Olympian gods, holder of cosmic order',
      "Maat (Egyptian) — the goddess of cosmic order whose feather weighed against the soul",
      "Arthur (Arthurian) — the once and future king who unified a kingdom through just rule",
      "Indra (Hindu) — lord of the heavens and protector of the cosmic order",
    ],
    shadowExpression:
      "The Ruler's shadow is the Tyrant — one who uses power to dominate rather than steward, who confuses their interests with the common good, who cannot delegate or trust. The shadow also appears as the rigid bureaucrat who enforces rules without wisdom, or the controlling parent who cannot allow their children to grow.",
    growthPath:
      'The Ruler grows by learning that the greatest leaders make themselves unnecessary. The mature Ruler builds systems that work without them, develops others to take their place, and measures success by the flourishing of those they lead — not by their own power or permanence.',
    famousExamples: [
      'Elizabeth I of England',
      'Miranda Priestly (The Devil Wears Prada)',
      'Cersei Lannister (Game of Thrones)',
      'Mufasa (The Lion King)',
      'Marcus Aurelius',
    ],
    strengths: ['Leadership', 'Strategic thinking', 'Responsibility', 'Organization', 'Vision'],
    challenges: ['Control issues', 'Rigidity', 'Authoritarianism', 'Difficulty delegating', 'Arrogance'],
    complementaryArchetypes: ['the-caregiver', 'the-sage'],
    shadowArchetypes: ['the-jester', 'the-orphan'],
    color: 'yellow',
    description:
      'You are called to create order and take responsibility for the whole. You think in systems and legacies, holding power as a sacred trust.',
  },
  {
    slug: 'the-jester',
    name: 'The Jester',
    symbol: '🃏',
    tagline: 'Laughter is the shortest path to truth',
    coreTheme:
      'The Jester lives in the present moment, delighting in playfulness, humor, and the absurdity of existence. They are the fool who speaks truth to power, the comedian who reveals what serious people dare not say. The Jester believes that joy and lightness are not trivial — they are essential.',
    mythologicalReferences: [
      'Loki (Norse) — the trickster who revealed cosmic truths through mischief',
      'Coyote (Native American) — the trickster spirit who taught through chaos and humor',
      "Dionysus (Greek) — god of wine, ecstasy, and the loosening of social constraints",
      "Anansi (African) — the spider trickster who outwitted gods through clever stories",
    ],
    shadowExpression:
      "The Jester's shadow is the Clown who hides profound pain behind constant performance, or the Cynic who uses humor as a weapon to deflect intimacy and avoid vulnerability. The dark Jester mocks everything, including what deserves reverence, and uses laughter as armor against life.",
    growthPath:
      'The Jester grows by allowing themselves to be serious when seriousness is called for — learning that humor and depth are not opposites, and that their gift of laughter is most powerful when it comes from genuine joy rather than fear. The mature Jester knows when to play and when to put down the mask.',
    famousExamples: [
      'Robin Williams',
      'The Fool (King Lear)',
      'Charlie Chaplin',
      'Tyrion Lannister',
      'Bugs Bunny',
    ],
    strengths: ['Humor', 'Playfulness', 'Perspective', 'Spontaneity', 'Ability to disarm tension'],
    challenges: ['Avoiding depth', 'Commitment issues', 'Using humor as deflection', 'Being taken seriously', 'Hidden pain'],
    complementaryArchetypes: ['the-lover', 'the-explorer'],
    shadowArchetypes: ['the-ruler', 'the-sage'],
    color: 'orange',
    description:
      'You live in the present moment, bringing lightness and truth to the world through humor. You are the fool who speaks what others dare not say.',
  },
  {
    slug: 'the-lover',
    name: 'The Lover',
    symbol: '❤️',
    tagline: 'Beauty and belonging are the point',
    coreTheme:
      'The Lover is moved by beauty, passion, and the deep need for connection and belonging. They experience the world through the senses and the heart, and they give themselves fully to what they love — people, art, causes, ideas. For the Lover, life without depth of feeling is no life at all.',
    mythologicalReferences: [
      'Aphrodite/Venus (Greek/Roman) — goddess of love, beauty, and erotic union',
      'Eros (Greek) — god of passionate connection and divine longing',
      'Radha and Krishna (Hindu) — the mythic lovers whose union represents soul\'s longing for the divine',
      'Tristan and Iseult (Medieval) — the doomed lovers consumed by passion',
    ],
    shadowExpression:
      "The Lover's shadow is obsession, co-dependency, or the inability to be alone. When the Lover's need for connection becomes need for possession, or when they lose themselves entirely in another person or experience, the beautiful energy turns destructive. The shadow also includes shallow hedonism — pleasure without meaning.",
    growthPath:
      'The Lover grows by learning to love from fullness rather than need — to be genuinely present with others without losing themselves. The mature Lover discovers that the capacity to love everything begins with loving themselves: not narcissistically, but with the same warm acceptance they extend to others.',
    famousExamples: [
      'Romeo and Juliet',
      'Marilyn Monroe',
      'Elizabeth Bennet (Pride and Prejudice)',
      'Pablo Neruda',
      'Frida Kahlo',
    ],
    strengths: ['Passion', 'Empathy', 'Sensory richness', 'Commitment', 'Emotional depth'],
    challenges: ['Codependency', 'Possessiveness', 'Loss of self', 'Jealousy', 'Heartbreak vulnerability'],
    complementaryArchetypes: ['the-caregiver', 'the-creator'],
    shadowArchetypes: ['the-warrior', 'the-orphan'],
    color: 'rose',
    description:
      'You are moved by beauty and connection. You give yourself fully to what you love — people, art, ideas — and bring deep feeling into everything you touch.',
  },
  {
    slug: 'the-orphan',
    name: 'The Orphan',
    symbol: '🌿',
    tagline: 'Belonging begins with belonging to yourself',
    coreTheme:
      "The Orphan archetype carries the wound of abandonment — the experience of being cast out, unseen, or fundamentally not belonging. This is not just a personal wound; it is a universal human experience. The Orphan's journey is toward reclaiming their place in the world and discovering that they are not, ultimately, alone.",
    mythologicalReferences: [
      'Moses (Abrahamic) — the orphan prince who became the liberator of his people',
      'Persephone (Greek) — taken from her home, transformed through underworld experience',
      'Oliver Twist (literary archetype) — the foundling seeking place in an indifferent world',
      'Harry Potter (modern archetype) — the orphan who discovers their true inheritance',
    ],
    shadowExpression:
      "The Orphan's shadow is the Victim — someone who identifies so completely with their wound that they cannot move beyond it, or who uses their suffering to manipulate others' sympathy. The shadow also includes the cynicism of deep disillusionment: the belief that nothing will ever truly be safe or loving.",
    growthPath:
      "The Orphan grows by transforming wound into wisdom — discovering that the very experiences that created the feeling of separation also developed strength, empathy, and resilience that others don't have. The mature Orphan becomes the one who helps others feel less alone, because they know what that loneliness costs.",
    famousExamples: [
      'Harry Potter',
      'Oliver Twist',
      'Jane Eyre',
      'Cinderella',
      'Luke Skywalker',
    ],
    strengths: ['Empathy for suffering', 'Resilience', 'Authenticity', 'Solidarity with the marginalized', 'Depth'],
    challenges: ['Victim identity', 'Trust issues', 'Cynicism', 'Fear of abandonment', 'Self-pity'],
    complementaryArchetypes: ['the-caregiver', 'the-magician'],
    shadowArchetypes: ['the-ruler', 'the-hero'],
    color: 'stone',
    description:
      'You carry the universal wound of not belonging — and through it, have developed extraordinary empathy and resilience. Your journey is toward wholeness.',
  },
  {
    slug: 'the-magician',
    name: 'The Magician',
    symbol: '🔮',
    tagline: 'Transform the world by transforming yourself',
    coreTheme:
      "The Magician understands the deep laws beneath the surface of ordinary reality — the principles by which things are transformed. They are the shamans, alchemists, visionaries, and change-makers who see possibility where others see only limits. The Magician's gift is the power of transformation.",
    mythologicalReferences: [
      'Hermes Trismegistus (Hermetic tradition) — the thrice-great magician who mapped inner and outer worlds',
      'Circe (Greek) — the sorceress who transformed men and understood the nature of change',
      'Merlin (Arthurian) — the wizard who held the wisdom of ages and shaped kingdoms through it',
      'Odin (Norse) — the All-Father who hung on the world tree nine days to gain wisdom of the runes',
    ],
    shadowExpression:
      "The Magician's shadow is the Manipulator or the Cult Leader — one who uses their understanding of how people and systems work to control and exploit rather than empower. The shadow Magician becomes obsessed with power itself, mistaking the map for the territory and themselves for a god.",
    growthPath:
      'The Magician grows by remembering that the deepest magic is in service to life — not personal power. The mature Magician becomes the initiator who helps others access their own transformation, stepping back when the student surpasses the teacher. They hold wisdom lightly, knowing they are always still learning.',
    famousExamples: [
      'Gandalf (LOTR)',
      'Dumbledore (Harry Potter)',
      'Nikola Tesla',
      'Carl Jung himself',
      'Stephen Hawking',
    ],
    strengths: ['Vision', 'Transformative insight', 'Pattern recognition', 'Charisma', 'Catalytic power'],
    challenges: ['Manipulation risk', 'Detachment from ordinary life', 'Arrogance', 'Power addiction', 'Isolation'],
    complementaryArchetypes: ['the-sage', 'the-creator'],
    shadowArchetypes: ['the-orphan', 'the-caregiver'],
    color: 'purple',
    description:
      'You see what others cannot — the deep patterns and possibilities beneath the surface. Your gift is transformation: of situations, of people, of yourself.',
  },
  {
    slug: 'the-warrior',
    name: 'The Warrior',
    symbol: '🗡️',
    tagline: 'Discipline is the path to freedom',
    coreTheme:
      "The Warrior is defined by mastery, discipline, and the commitment to a cause worth fighting for. Unlike the Hero who transforms through adventure, the Warrior develops power through training, practice, and the daily application of will. The Warrior's virtue is courage in the service of something beyond the self.",
    mythologicalReferences: [
      'Ares/Mars (Greek/Roman) — god of war and martial power',
      'Durga (Hindu) — the warrior goddess who battles cosmic evil with fierce compassion',
      'Achilles (Greek) — the supreme warrior who chose glory over long life',
      'Miyamoto Musashi (historical-mythological) — the undefeated samurai who transcended fighting into philosophy',
    ],
    shadowExpression:
      "The Warrior's shadow is ruthlessness — fighting without conscience, victory at any moral cost. The shadow also includes the mercenary who sells their skills to whoever pays, without regard for the cause. Over-identification with the Warrior archetype produces hardness: an inability to show vulnerability, tenderness, or surrender.",
    growthPath:
      "The Warrior grows by discovering that the greatest battles are interior ones — and that the courage to be vulnerable is harder than any external fight. The mature Warrior knows when to fight and when to lay down arms, when strength means advancing and when it means standing still.",
    famousExamples: [
      'Achilles',
      'Leonidas (300)',
      'Katniss Everdeen (Hunger Games)',
      'Aragorn (LOTR)',
      'Serena Williams',
    ],
    strengths: ['Discipline', 'Courage', 'Loyalty', 'Focus', 'Perseverance'],
    challenges: ['Ruthlessness', 'Emotional armor', 'Aggression', 'Rigidity', 'Difficulty with surrender'],
    complementaryArchetypes: ['the-hero', 'the-caregiver'],
    shadowArchetypes: ['the-lover', 'the-jester'],
    color: 'red',
    description:
      'You are defined by discipline and mastery. You commit fully to causes worth fighting for and develop strength through daily practice and will.',
  },
]

export const ARCHETYPE_BY_SLUG = Object.fromEntries(ARCHETYPES.map((a) => [a.slug, a]))

export const ARCHETYPE_BY_NAME = Object.fromEntries(ARCHETYPES.map((a) => [a.name.toLowerCase(), a]))

export function getArchetypeByName(name: string): Archetype | undefined {
  const lower = name.toLowerCase()
  // Try exact match first
  if (ARCHETYPE_BY_NAME[lower]) return ARCHETYPE_BY_NAME[lower]
  // Try slug-style matching
  const slug = 'the-' + lower.replace(/^the\s+/i, '').replace(/\s+/g, '-')
  return ARCHETYPE_BY_SLUG[slug]
}

export function archetypeNameToSlug(name: string): string {
  const lower = name.toLowerCase().trim()
  if (lower.startsWith('the ')) return 'the-' + lower.slice(4).replace(/\s+/g, '-')
  return lower.replace(/\s+/g, '-')
}

export const ARCHETYPE_COLORS: Record<string, string> = {
  amber: 'bg-amber-500/10 ring-amber-500/20 text-amber-400 border-amber-500/30',
  violet: 'bg-violet-500/10 ring-violet-500/20 text-violet-400 border-violet-500/30',
  blue: 'bg-blue-500/10 ring-blue-500/20 text-blue-400 border-blue-500/30',
  teal: 'bg-teal-500/10 ring-teal-500/20 text-teal-400 border-teal-500/30',
  pink: 'bg-pink-500/10 ring-pink-500/20 text-pink-400 border-pink-500/30',
  emerald: 'bg-emerald-500/10 ring-emerald-500/20 text-emerald-400 border-emerald-500/30',
  yellow: 'bg-yellow-500/10 ring-yellow-500/20 text-yellow-400 border-yellow-500/30',
  orange: 'bg-orange-500/10 ring-orange-500/20 text-orange-400 border-orange-500/30',
  rose: 'bg-rose-500/10 ring-rose-500/20 text-rose-400 border-rose-500/30',
  stone: 'bg-stone-500/10 ring-stone-500/20 text-stone-400 border-stone-500/30',
  purple: 'bg-purple-500/10 ring-purple-500/20 text-purple-400 border-purple-500/30',
  red: 'bg-red-500/10 ring-red-500/20 text-red-400 border-red-500/30',
}
