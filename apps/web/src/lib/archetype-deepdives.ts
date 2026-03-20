/**
 * Deep-dive content for each archetype.
 * These entries contain richer narrative content for the /archetypes/[slug] pages.
 * The slugs align with those in archetypes.ts.
 */

export interface ArchetypeDeepDive {
  slug: string
  name: string
  tagline: string
  symbol: string
  /** 2-3 evocative paragraphs */
  description: string
  /** 3-5 core themes */
  coreThemes: string[]
  /** 1-2 paragraphs on the shadow side */
  shadowExpression: string
  /** 1 paragraph on mythological/cultural roots */
  mythologicalRoots: string
  /** 4-6 illustrative examples */
  famousExamples: string[]
  /** 1-2 paragraphs on how this archetype grows */
  growthPath: string
  /** 2-3 complementary archetype slugs */
  complementaryArchetypes: string[]
  /** the shadow/opposing archetype slug */
  shadowArchetype: string
}

export const ARCHETYPE_DEEPDIVES: ArchetypeDeepDive[] = [
  {
    slug: 'the-sage',
    name: 'The Sage',
    tagline: 'Truth is the highest pursuit',
    symbol: '◎',
    description: `The Sage lives inside a perpetual question. Where others see a finished conversation, they see a loose thread worth pulling until truth, or something closer to it, comes into view. They are the ones who stay after class, who re-read the footnote, who feel a small private disappointment when a complex idea is reduced to a sound bite. Thinking is not a tool for them; it is a form of love.

What distinguishes the Sage from the merely curious is their relationship to uncertainty. They have made peace with not knowing — not as resignation, but as the precondition for genuine discovery. They trust the process of inquiry more than any single conclusion, and they are often more interested in a well-asked question than in an answer that forecloses further exploration. In this way the Sage carries a kind of intellectual humility that can look, from the outside, like detachment.

Their greatest gift to the world is the capacity to illuminate. A Sage in conversation doesn't just share information; they reframe the frame, show you the assumption hiding beneath your certainty, and leave you seeing something you cannot unsee. They are natural teachers, editors, advisors, scientists, philosophers, and the quiet person at the back of the room who asks the one question that changes everything.`,
    coreThemes: [
      'Pursuit of truth and understanding',
      'Intellectual humility and genuine inquiry',
      'Wisdom over mere knowledge',
      'Clarity and discernment',
      'Teaching through illumination',
    ],
    shadowExpression: `The shadow of the Sage is the know-it-all — someone who has confused the accumulation of information with actual wisdom. In this mode, the mind becomes a fortress rather than a laboratory. The Sage's healthy skepticism curdles into cynicism, their love of nuance into a refusal to commit to anything, their intelligence into a weapon used to feel superior. The shadow Sage is always correcting people, always finding the flaw in someone else's argument, always managing relationships from a safe intellectual distance.

Perhaps the deepest shadow pattern is the Sage's tendency to use thinking as a way to avoid feeling. The interior world of analysis can become a place of exile from messy human connection. When the Sage says "I need to think about that," they often mean "I need to not feel that right now." Growth for the Sage means learning that emotional knowledge is not inferior to rational knowledge — that the body and the heart carry data the mind cannot access alone.`,
    mythologicalRoots: `The Sage appears across virtually every culture as the figure standing at the threshold between the known and the unknowable. In Greek mythology they are embodied by Athena, goddess of wisdom and strategic intelligence, and by Tiresias the blind prophet whose very blindness enables a deeper kind of sight. In Eastern traditions the Sage is the mountain hermit, the Zen master whose koans bypass ordinary logic. The figure of Merlin in Arthurian legend — counselor to kings, keeper of ancient knowledge — captures the Sage's role as the power behind the throne, the one who sees what rulers cannot.`,
    famousExamples: [
      'Socrates',
      'Hermione Granger (Harry Potter)',
      'Carl Jung',
      'Atticus Finch (To Kill a Mockingbird)',
      'Marie Curie',
      'Sherlock Holmes',
    ],
    growthPath: `The Sage grows when they discover that wisdom is not just knowing — it is knowing how to be with people. The movement from intelligence to wisdom requires an encounter with the limits of the intellect: grief that cannot be reasoned away, love that defies analysis, beauty that exceeds explanation. When a Sage allows themselves to be moved — genuinely moved — by something they cannot categorize, they cross a threshold into a richer life.

Practically, this means cultivating practices that bypass the analytical mind: art, physical movement, long friendships where nothing is resolved, meditation, time in nature. The fully realized Sage integrates heart and mind into something greater than either — what the ancient Greeks called phronesis, or practical wisdom: the ability to know not just what is true in the abstract, but what is called for in this particular moment, with this particular person, in this particular life.`,
    complementaryArchetypes: ['the-explorer', 'the-magician'],
    shadowArchetype: 'the-innocent',
  },

  {
    slug: 'the-explorer',
    name: 'The Explorer',
    tagline: 'The frontier is always the next horizon',
    symbol: '→',
    description: `The Explorer exists in a state of perpetual becoming. They are not restless in a neurotic sense — they are restless in the way a river is restless, always finding the path that leads forward, always moving toward the open sea. Their comfort zone is the zone of discomfort, and what others experience as threatening or unknown, they experience as invitation. Routine is not stability to them; it is a kind of slow suffocation.

There is a quality of aliveness that follows Explorers into every room. They bring stories from strange places, ideas from unexpected disciplines, and a contagious sense that the world is far larger and stranger than most people suspect. They are often early adopters, cultural translators, and the first to spot the emerging thing that everyone else will be talking about in three years. Their attention is genuinely attracted by novelty — not as distraction, but as a form of appetite.

What the Explorer seeks, beneath all the movement, is authenticity. The horizon is not just a geographic destination but a metaphor for becoming more truly themselves. Each new experience is a mirror. The Explorer is always gathering data about who they are and who they could be, and their journeys — literal and interior — are the medium through which they construct their identity.`,
    coreThemes: [
      'Freedom and autonomy above all',
      'Discovery and genuine novelty',
      'Authenticity through experience',
      'Adventure as a mode of becoming',
      'Independence and self-reliance',
    ],
    shadowExpression: `The shadow of the Explorer is commitment-avoidance disguised as freedom. In this mode, movement becomes a way to escape rather than discover — every time depth is required, the Explorer finds a new horizon to chase. Relationships, projects, and identities are serially begun and abandoned, not because they have been outgrown but because they have become real and therefore require something the shadow Explorer is not willing to give: presence.

The deeper wound beneath this pattern is often a fear of being trapped, which is itself a fear of powerlessness. The shadow Explorer mistakes rootedness for imprisonment and intimacy for the loss of self. They can spend decades in motion, mistaking novelty for aliveness, accumulating experiences that never quite add up to a life. Growth begins when they recognize that depth is not the enemy of freedom — that some horizons can only be reached by staying.`,
    mythologicalRoots: `The Explorer lives in every culture's mythology of the heroic journey into the unknown: Odysseus sailing beyond the maps, Gilgamesh entering the forest of cedars, the Norse Odin hanging from the World Tree to gain wisdom. In American mythology the Explorer is the pioneer and the astronaut, the Lewis and Clark archetype moving into unmapped territory. In Eastern traditions, the wandering monk who has renounced fixed abode embodies this energy — travel not as escape but as the condition for encountering the real.`,
    famousExamples: [
      'Amelia Earhart',
      'Aragorn (The Lord of the Rings)',
      'Charles Darwin',
      'Elizabeth Gilbert',
      'Frodo Baggins',
      'Neil Armstrong',
    ],
    growthPath: `The Explorer's growth is a paradox: the final frontier they must explore is stillness. Not the death of movement, but the willingness to discover what is right here, right now — what has always been here, beneath the need to go somewhere else. This is often precipitated by a loss that cannot be outrun: the death of someone loved, a health crisis, a relationship that finally matters too much to leave.

The mature Explorer learns to bring their quality of attention — the openness, the curiosity, the willingness to be surprised — into the interior landscape with the same courage they brought to outer ones. They discover that commitment deepens freedom rather than limiting it, and that staying with something long enough to see it change is one of the great adventures available to a human life.`,
    complementaryArchetypes: ['the-sage', 'the-jester'],
    shadowArchetype: 'the-ruler',
  },

  {
    slug: 'the-creator',
    name: 'The Creator',
    tagline: 'To make is to mean',
    symbol: '✦',
    description: `The Creator is haunted by the image of the thing that does not yet exist. They carry around a version of the world slightly different from the one that is actually here — and they feel the gap between the two as a creative imperative, almost a moral one. Making things is not what they do; it is how they organize their relationship to existence. Without creation, something essential in them goes dark.

What marks the Creator is not talent — though talent is often present — but a particular quality of noticing. They see raw material everywhere: in overheard conversations, in the quality of afternoon light, in the gap between what someone says and what they mean. The world feeds them constantly, and they are always processing, always assembling, always looking for the form that will contain what they feel. There is an urgency to this that can be misread as egotism, but it is closer to a kind of devotion.

Creators understand that making something is also a way of making sense of things. The painting, the novel, the business, the garden — whatever the medium — is a translation of inner experience into shared form. This is why finished works matter so much to them: not as ego objects but as contributions to a collective conversation about what it means to be alive.`,
    coreThemes: [
      'Imagination and originality',
      'Self-expression as a form of truth',
      'Making meaning through form',
      'The relationship between vision and craft',
      'Beauty as a mode of knowing',
    ],
    shadowExpression: `The Creator's shadow is perfectionism as paralysis — the inability to release anything because no finished work can match the luminous version in the mind. This shadow keeps people in perpetual drafts, collecting materials, planning projects that never begin, or endlessly revising work they cannot bring themselves to share. The inner critic becomes a tyrant who frames protection as discernment.

There is also a shadow tendency toward grandiosity: the Creator who becomes so identified with their vision that they cannot receive feedback, collaborate, or acknowledge the contributions of others. The shadow Creator mistakes self-expression for self-absorption, and the studio becomes an echo chamber where only one voice is permitted. The antidote is humility — a willingness to be changed by the work, by the audience, by the act of making itself.`,
    mythologicalRoots: `In Greek mythology, the Creator is Hephaestus — the divine craftsman who forges weapons for gods and worlds in his volcanic forge, and who is also, significantly, the only Olympian with a visible imperfection. Creation mythology across cultures involves a maker-god who brings form out of chaos: the Hindu Brahma, the Polynesian Tane who shaped humans from clay, the Norse dwarves who crafted the magical objects that defined the cosmos. The figure of Pygmalion — the sculptor who fell in love with his own creation — captures both the beauty and the danger of the Creator archetype.`,
    famousExamples: [
      'Frida Kahlo',
      'Leonardo da Vinci',
      'Virginia Woolf',
      'Willy Wonka',
      'Beethoven',
      'Maya Lin',
    ],
    growthPath: `The Creator grows by learning to ship — to release the work before it is perfect, to value the conversation that finished work begins over the control that keeping it private provides. This requires distinguishing between the legitimate pursuit of quality and the unconscious use of perfectionism to avoid vulnerability. Releasing work is always an act of courage for the Creator, because it is releasing a piece of themselves into a world that may not receive it as intended.

The fully realized Creator understands that the work belongs to the audience once it is shared, and that their job is not to control meaning but to transmit experience as honestly as possible. They also learn to honor their constraints — the human limitations of time, energy, medium, and skill — not as failure but as the very conditions that make creation possible. Art is always the art of the possible, and the Creator who accepts this finds that their work becomes more alive, not less.`,
    complementaryArchetypes: ['the-magician', 'the-lover'],
    shadowArchetype: 'the-warrior',
  },

  {
    slug: 'the-hero',
    name: 'The Hero',
    tagline: 'Courage is the willingness to keep going',
    symbol: '⬆',
    description: `The Hero is defined not by the absence of fear but by the decision to act in spite of it. They are the ones who step forward when others step back — not because they have conquered their inner landscape but because they have decided that the call matters more than their comfort. There is something in the Hero that refuses to let the world be smaller than it could be, and they are willing to pay significant personal costs to hold that line.

What drives the Hero is an inner standard — a sense of what is right and possible that operates independently of what everyone else is doing. They are often the ones who name the thing no one wants to name, take on the role no one else will accept, or persist long after rational calculation would have suggested stopping. This is not bravado; it is a relationship to purpose so deep that retreat feels like self-betrayal.

Heroes are forged, not born. The characteristic Hero story is one of transformation through ordeal: the call, the refusal, the crossing of a threshold, the encounter with the shadow, the return with something won. What distinguishes the Hero from the merely brave is the return — they do not just survive the ordeal; they bring something back. They serve. Their courage is always in service of something beyond themselves.`,
    coreThemes: [
      'Courage and perseverance against the odds',
      'Transformation through difficulty',
      'Proving worth through action',
      'Responsibility and answering the call',
      'The journey from ordinary to extraordinary',
    ],
    shadowExpression: `The shadow of the Hero is the warrior without a cause — someone who is addicted to struggle because it gives them a sense of identity and purpose. The shadow Hero creates enemies where none exist, turns every interaction into a competition, and cannot be at peace because peace feels like defeat. They have confused the experience of striving with the meaning of striving, and they are driven more by the need to win than by genuine service.

The deeper shadow is martyrdom: the Hero who keeps score of their sacrifices, who expects gratitude and recognition for every act of courage, and who becomes bitter when the world does not adequately acknowledge their suffering. The shadow Hero's wounds become their identity — they are always the one who gave the most and got the least. Growth begins when they can distinguish between genuine courage and the performance of it.`,
    mythologicalRoots: `The Hero is perhaps the most universal of all archetypes, appearing in the oldest stories human beings tell about themselves: Hercules performing his twelve labors, Arjuna on the battlefield of Kurukshetra receiving the Bhagavad Gita, Beowulf entering the mead-hall to face Grendel. In modern mythology the Hero appears as the soldier, the firefighter, the underdog athlete, and the reluctant savior of the fantasy novel. Joseph Campbell's monomyth — the Hero's Journey — is the template underneath virtually every story humans have told about becoming.`,
    famousExamples: [
      'Malala Yousafzai',
      'Frodo Baggins (The Lord of the Rings)',
      'Nelson Mandela',
      'Katniss Everdeen (The Hunger Games)',
      'Winston Churchill',
      'Simone Biles',
    ],
    growthPath: `The Hero's deepest growth is learning that the greatest courage is often the quiet kind: the willingness to be vulnerable, to rest without guilt, to receive help, to lay down the sword and simply be present with someone they love. After a lifetime of proving themselves through action, the Hero must learn that their worth is not contingent on their achievements. This is frequently the most difficult challenge they face — more difficult than any external ordeal.

The mature Hero integrates strength with tenderness. They discover that true service does not require self-erasure, and that sustainable courage is grounded in self-compassion, not self-punishment. They become mentors rather than lone warriors — their greatest act of heroism is creating conditions for other people's courage to emerge.`,
    complementaryArchetypes: ['the-caregiver', 'the-warrior'],
    shadowArchetype: 'the-orphan',
  },

  {
    slug: 'the-caregiver',
    name: 'The Caregiver',
    tagline: 'Love is expressed through service',
    symbol: '♡',
    description: `The Caregiver orients their life around the wellbeing of others with a naturalness that can seem, to those who do not share it, almost incomprehensible. It is not that they sacrifice themselves — though that can be a shadow pattern — but that their flourishing is genuinely, authentically bound up with the flourishing of the people around them. When those they love thrive, something in the Caregiver expands. When those they love suffer, they feel it as their own.

This is a relational intelligence of extraordinary depth. The Caregiver reads the room in ways others miss: they notice the slightly tense posture, the forced laugh, the absence of the person who is usually present. They remember what you told them six months ago and ask about it. They organize the things that make other people's lives work — the meal, the carpool, the detail that would have been forgotten, the phone call to the person who is probably having a hard time right now. This is not servitude; it is a form of genius.

What Caregivers offer the world is the irreplaceable experience of being truly seen and held. In a culture that valorizes autonomy and individual achievement, the Caregiver insists — through action rather than argument — that we are profoundly interconnected, that to tend to another is one of the most meaningful things a human being can do.`,
    coreThemes: [
      'Nurturing and protection',
      'Empathy and emotional attunement',
      'Service as a form of love',
      'Community and belonging',
      'Generosity without expectation',
    ],
    shadowExpression: `The Caregiver's shadow is caretaking as control. In this pattern, the generous impulse to help has curdled into a need to be needed — and the "help" provided is often subtly undermining rather than genuinely empowering. The shadow Caregiver creates dependency, cannot tolerate others' independence, and uses their indispensability to manage their own anxiety about abandonment. Their martyrdom is real but also strategic.

There is also the collapse into resentment that comes from a lifetime of giving without receiving. The shadow Caregiver has never learned to articulate their own needs — in some cases, they have truly lost contact with what those needs are — and they accumulate a silent ledger of uncredited sacrifices that eventually explodes into anger or collapse. The deepest care they can offer themselves is the recognition that their needs are as legitimate as everyone else's, and that asking for care is not weakness but wisdom.`,
    mythologicalRoots: `The Caregiver archetype flows through every maternal deity and protective figure in world mythology: Isis gathering the scattered pieces of Osiris, Demeter scouring the earth for Persephone, the Hindu Kali who destroys in order to protect. In more domestic forms, the archetype lives in the figure of the hearth-keeper and in the healer figures across cultures: the shaman, the midwife, the village nurse who knew which plants to use. Florence Nightingale walking lamp-lit wards is a modern incarnation of this ancient energy.`,
    famousExamples: [
      'Mother Teresa',
      'Samwise Gamgee (The Lord of the Rings)',
      'Fred Rogers',
      'Princess Diana',
      'Calpurnia (To Kill a Mockingbird)',
      'Dr. Martin Luther King Jr.',
    ],
    growthPath: `The Caregiver grows by learning to receive. This sounds simple but is in practice one of the hardest things they will ever do, because receiving requires vulnerability — allowing someone else to see their need, their imperfection, their exhaustion. The Caregiver who can accept care gracefully is a rarer and more integrated being than the one who can only give it.

The mature Caregiver also learns to distinguish between genuine service — which comes from abundance and choice — and compulsive helping, which comes from fear. They develop the capacity to say no without guilt, to set limits without feeling cruel, and to understand that their wellbeing is not a luxury but the very foundation of their capacity to care for others. The oxygen-mask metaphor applies: put on your own first. The Caregiver who truly internalizes this becomes inexhaustible, because they are no longer running on depletion.`,
    complementaryArchetypes: ['the-hero', 'the-innocent'],
    shadowArchetype: 'the-ruler',
  },

  {
    slug: 'the-ruler',
    name: 'The Ruler',
    tagline: 'Order creates the conditions for flourishing',
    symbol: '◈',
    description: `The Ruler understands, at a level that is almost cellular, that chaos is not the natural state of things — that the conditions for human flourishing require architecture, intention, and sustained effort to create and maintain. They are drawn to leadership not primarily by a desire for status but by a genuine need to see things working as they should. A broken system is a genuine affront to them. An organization without clear purpose, a team without direction, a family without structure — these cause the Ruler real discomfort, and they will move toward the problem with the instinct of someone who cannot walk past a crooked painting.

What the Ruler offers is the rare and undervalued ability to hold complexity without losing coherence. They can see the whole board. They can make the decision that no one else wants to make. They can absorb pressure without transmitting it downward. And they have a quality of authority — not dominance, but genuine authority — that makes people feel both held and challenged. Under a healthy Ruler, people know where they stand and what they are working toward.

The Ruler's deepest aspiration is legacy. They think in long arcs, building structures designed to outlast them. They are interested in institutions, systems, and traditions precisely because these are the mechanisms through which wisdom and order persist beyond any individual life. They want to leave the world better-organized than they found it.`,
    coreThemes: [
      'Leadership and responsibility',
      'Order, systems, and structure',
      'Legacy and long-term thinking',
      'Authority and stewardship',
      'Creating conditions for others to thrive',
    ],
    shadowExpression: `The shadow of the Ruler is tyranny — the conflation of control with care, and the willingness to harm others in the service of maintaining order and personal authority. The shadow Ruler is threatened by any autonomy not granted by them, punishes deviation from the prescribed path, and mistakes their preference for truth. They can be subtly — or not so subtly — crushing to the people who work for them, creating environments of compliance rather than creativity.

The less dramatic but equally corrosive shadow is micromanagement: the inability to delegate, the constant intervention in processes that do not require their input, the subtle message to everyone around them that they are not quite trusted. Beneath this is often deep anxiety — the Ruler whose need for control is a defense against a fear of chaos that feels existentially threatening. Growth begins when they can tolerate uncertainty without needing to eliminate it.`,
    mythologicalRoots: `The Ruler archetype is embodied by the sky gods of most pantheons: Zeus and Hera on Olympus, the Norse Odin on his throne Hlidskjalf, the Egyptian Ra maintaining ma'at — cosmic order. In human mythology, the archetype appears in the figure of the wise king — Solomon, Arthur, the Confucian ideal of the scholar-ruler who governs through moral example rather than force. The archetype's double nature (benevolent ruler versus despotic tyrant) is built into the mythology: Zeus is both protector and punisher, father and tyrant.`,
    famousExamples: [
      'Queen Elizabeth I',
      'Mufasa (The Lion King)',
      'Abraham Lincoln',
      'Marcus Aurelius',
      'Franklin D. Roosevelt',
      'Miranda Priestly (The Devil Wears Prada, shadow)',
    ],
    growthPath: `The Ruler's growth requires learning to lead from within rather than above — to understand that the most durable authority comes not from position but from relationship. The Ruler who leads by fear creates the conditions for their own eventual deposition; the Ruler who leads by genuine care and demonstrated competence earns a loyalty that survives adversity.

The mature Ruler also learns the profound skill of succession: preparing others to surpass them, cultivating leadership in the next generation, and understanding that the greatest act of governance is making themselves unnecessary. This requires a relationship to ego and legacy that the immature Ruler cannot access — the willingness to be forgotten, to pour themselves into something that will outlive them without needing credit for it. When they reach this place, they become genuinely great.`,
    complementaryArchetypes: ['the-caregiver', 'the-sage'],
    shadowArchetype: 'the-explorer',
  },

  {
    slug: 'the-magician',
    name: 'The Magician',
    tagline: 'To understand the deep laws is to move the world',
    symbol: '⬡',
    description: `The Magician sees the structure beneath the surface — the patterns that repeat, the laws that govern, the levers that, once understood, allow reality itself to be shifted. Where others see discrete events, the Magician sees a system. Where others see limitation, the Magician sees a problem that has not yet been correctly framed. Their signature gift is the ability to work at the level of causes rather than symptoms, transforming situations from the inside rather than fighting them from the outside.

There is something of the alchemist in every Magician — the sense that the base material of experience, properly engaged, can be transmuted into something of extraordinary value. They are drawn to the hidden, the symbolic, and the catalytic. A catalyst, significantly, enables transformation without being consumed by it: and this is often the Magician's role. They change the conditions; others' lives change. They rarely announce themselves; the transformation speaks for itself.

The Magician often appears to those around them as slightly otherworldly — partly because they operate according to principles that are not immediately visible, and partly because they seem to have access to resources others do not. This is not supernatural. It is, rather, the fruit of an unusually deep attention to how things actually work.`,
    coreThemes: [
      'Transformation and transmutation',
      'Pattern recognition and systems thinking',
      'Catalyzing change without being consumed',
      'The hidden structure beneath surface reality',
      'Vision and manifestation',
    ],
    shadowExpression: `The Magician's shadow is the manipulator — someone who uses their understanding of how things work to serve their own interests at others' expense. The shadow Magician has the same intelligence as the healthy one but deploys it without conscience, creating situations that benefit themselves while presenting it as something else. This shadow is particularly dangerous because it is so plausible — the shadow Magician is always two steps ahead, and by the time the manipulation is visible, the dynamic has already been established.

A more subtle shadow is the Magician who becomes addicted to the experience of power itself — to the feeling of being the one who understands, who knows, who can see what others cannot see. This makes the Magician unavailable for genuine peer relationships, always positioning themselves as the one with special knowledge. The antidote is radical honesty about motivation and a genuine commitment to others' independent flourishing.`,
    mythologicalRoots: `The Magician archetype spans from the shamanic figure — the one who moves between worlds, who knows the language of plants and spirits and ancestors — to the medieval court wizard, to the modern scientist probing the fundamental laws of matter. Merlin is the archetype's most complete Western incarnation: wise counselor, shapeshifter, keeper of secret knowledge, teacher of the future king. In Eastern traditions, the Magician appears as the tantric master, the Taoist sage who surfs the currents of ch'i, the alchemist seeking the Philosopher's Stone not in lead but in consciousness.`,
    famousExamples: [
      'Gandalf (The Lord of the Rings)',
      'Nikola Tesla',
      'Hermes Trismegistus',
      'Steve Jobs',
      'Dumbledore (Harry Potter)',
      'Oprah Winfrey',
    ],
    growthPath: `The Magician grows when they commit their gifts to a genuinely larger purpose — one that does not return primarily to themselves. The transformative intelligence of the Magician is a neutral tool; what determines its value is what it is in service of. The mature Magician has developed a strong ethical center that constrains their power not from outside but from within — a genuine care for the wellbeing of others and the world.

The Magician also grows by learning that some things cannot be transmuted — that grief, loss, mortality, and limitation are not problems to be solved but realities to be inhabited. When the Magician can sit in the darkness without immediately reaching for their toolkit, they discover a dimension of wisdom inaccessible to those who are always managing their experience. This is the Magician's descent into the underworld — necessary, clarifying, and ultimately ennobling.`,
    complementaryArchetypes: ['the-sage', 'the-creator'],
    shadowArchetype: 'the-innocent',
  },

  {
    slug: 'the-lover',
    name: 'The Lover',
    tagline: 'Depth of feeling is depth of being',
    symbol: '◉',
    description: `The Lover experiences life at a higher resolution than most. Colors are more vivid, music reaches deeper, food tastes more real, and the face of someone they love contains more meaning than most people will find in a library of books. This is not sentimentality — it is a genuine perceptual difference, an orientation toward experience that is fully engaged rather than half-present. The Lover does not hold experience at arm's length. They let it in.

What defines the Lover is not romantic love, though that is one of their natural domains. It is the capacity for passionate, wholehearted engagement with whatever they care about — a person, a place, a piece of music, a cause, a craft. The Lover in a garden is not gardening; they are in conversation. The Lover at a dinner table does not just eat; they are moved by the fact of gathering, of nourishment, of the people across from them. Presence is their superpower.

The Lover's great contribution to the world is the insistence that beauty and connection are not luxuries but necessities — that a life lived without deep feeling is a life only half inhabited. They are the ones who remember that aliveness is the point, that intimacy is not a reward for productivity but the ground of meaning itself. They call us back to what matters.`,
    coreThemes: [
      'Passion and full-heartedness',
      'Beauty, aesthetics, and sensory depth',
      'Intimacy and genuine connection',
      'Devotion and loyalty',
      'The sacred dimension of desire',
    ],
    shadowExpression: `The Lover's shadow is obsession — the inability to distinguish between passionate engagement and addictive attachment. In this mode, the Lover's intensity becomes a kind of consumption: they project so much onto the beloved that the real thing disappears behind the image. The shadow Lover cannot tolerate the ordinary, the boring, or the imperfect, and so they are perpetually disappointed and perpetually seeking the next thing that will deliver the feeling they are looking for.

There is also the shadow of emotional flooding — the Lover whose feelings are so intense and so un-boundaried that they overwhelm everyone around them. The shadow Lover cannot regulate their interior world and uses relationships as emotional containers rather than genuine connections. The path forward involves developing the capacity to feel deeply without losing oneself in the feeling — the ability to be moved without being swept away.`,
    mythologicalRoots: `Eros and Aphrodite in the Greek pantheon, the Hindu Kamadeva, the Norse Freya — the Lover archetype appears in every culture as the divine force of attraction, beauty, and desire. In Eastern traditions, the Lover appears in Sufi poetry (Rumi's ecstatic verse is a supreme expression of the Lover archetype) and in bhakti devotional practice. The troubadour tradition of medieval Europe, with its theology of courtly love — the idea that love itself is a form of spiritual practice — is a cultural crystallization of the Lover archetype.`,
    famousExamples: [
      'Rumi',
      'Elizabeth Bennet (Pride and Prejudice)',
      'Pablo Neruda',
      'Catherine (Wuthering Heights)',
      'Coco Chanel',
      'Cyrano de Bergerac',
    ],
    growthPath: `The Lover grows by learning that love is not a feeling but a practice — that the height of passion is not its most evolved form but its beginning. The mature Lover discovers that real intimacy, unlike the high of infatuation, requires a different kind of courage: the willingness to be truly known, including in one's imperfection and limitation. This is the move from eros to agape, from romantic love to something larger and more durable.

The Lover also grows through learning to love ordinary things ordinarily — to find the sacred in the mundane, the beauty in the everyday, the depth in the familiar. The Lover who can only feel alive at the peaks is missing most of life. The mature Lover brings their quality of attention to everything: the morning light, the brief conversation, the meal prepared for someone they care about. This is what mystics across traditions have called the sacrament of ordinary life.`,
    complementaryArchetypes: ['the-creator', 'the-jester'],
    shadowArchetype: 'the-warrior',
  },

  {
    slug: 'the-jester',
    name: 'The Jester',
    tagline: 'Joy is an act of defiance',
    symbol: '◇',
    description: `The Jester understands something that serious people keep forgetting: that laughter is not the absence of depth but one of its expressions. They move through the world with a quality of lightness that is not shallowness — it is a practiced, often hard-won refusal to take the pretensions of power, the tyranny of convention, or the weight of existential anxiety more seriously than life itself deserves. The Jester laughs, but they are watching. They notice everything.

The Jester's intelligence is sideways intelligence — it approaches truth from angles that the frontal assault of reason cannot reach. The joke that illuminates a room's hidden dynamic in thirty seconds. The absurd observation that suddenly makes a complex situation make sense. The self-deprecating confession that grants everyone else permission to be human. This is not merely entertainment; it is a distinct form of wisdom, and cultures throughout history have known it: the court jester was the only person permitted to speak truth to the king.

What the Jester is finally about is aliveness — the stubborn insistence on the intrinsic value of the present moment, the irreplaceable texture of immediate experience. They resist the deferral of pleasure, the postponement of joy, the grinding subjugation of now to a future that never quite arrives. In this sense the Jester is a kind of philosopher — but one who proves their point by living rather than arguing.`,
    coreThemes: [
      'Joy, play, and spontaneity',
      'Truth-telling through humor',
      'Living fully in the present moment',
      'The subversive power of laughter',
      'Lightness as a form of wisdom',
    ],
    shadowExpression: `The Jester's shadow is the person who cannot be serious — who uses humor as armor against genuine feeling, who deflects every moment of depth with a joke because depth feels dangerous. The shadow Jester has learned, often early, that their pain is more palatable to others when it is wrapped in comedy, and they have become so good at this that they have lost access to their own suffering. They make everyone around them laugh and go home to an empty silence they have no idea how to fill.

There is also the Jester who uses humor as a weapon — the wit that cuts, the observation that dismantles, the joke at someone's expense that is not quite a joke. The shadow Jester's intelligence becomes cruelty dressed as entertainment, and they hide behind "just kidding" to avoid accountability for their aggression. Growth begins with the willingness to be unfunny — to simply be present, in pain or in love or in awe, without reaching for the comic deflection.`,
    mythologicalRoots: `The Jester appears in every culture's mythology as the Trickster — the figure who operates outside the rules, who can change shape and cross boundaries that bind everyone else, and who creates chaos that turns out to be creative. Coyote in Native American traditions, Loki among the Norse gods, Hermes in the Greek pantheon, Anansi the spider in West African and Caribbean mythology. These figures are not simply troublemakers; they are the force of creative disruption that prevents ossification, that keeps the cosmos from freezing into permanent form.`,
    famousExamples: [
      'Charlie Chaplin',
      'Tyrion Lannister (Game of Thrones)',
      'Robin Williams',
      'Falstaff (Shakespeare)',
      'Tina Fey',
      'Mark Twain',
    ],
    growthPath: `The Jester grows when they discover that vulnerability is not a threat but an invitation — that letting people see them without the armor of humor is not weakness but the deepest act of connection they can offer. This often happens through a loss or a failure that humor cannot contain: a grief too large to joke about, a love too important to keep at a safe ironic distance, a truth too urgent to deliver as a punchline.

The mature Jester integrates joy and depth, playfulness and presence. They become the rarest of human beings: someone who can make you laugh and make you feel, sometimes in the same moment. They understand that their gift — the capacity to find the comic in the cosmic, to hold suffering lightly without denying it — is not a coping mechanism but a genuine form of grace. The world needs them badly.`,
    complementaryArchetypes: ['the-explorer', 'the-lover'],
    shadowArchetype: 'the-sage',
  },

  {
    slug: 'the-orphan',
    name: 'The Orphan',
    tagline: 'We are all more alike in our wounding than our strength',
    symbol: '○',
    description: `The Orphan has been disillusioned. They have encountered the gap between the world as it was promised to be and the world as it actually is, and they have survived it — which is to say, they have become realistic without becoming cynical, wounded without becoming hard, alone without becoming isolated. The Orphan archetype is not about literal parentlessness; it is about the universal experience of abandonment, of discovering that the protection we counted on cannot be counted on, of learning to stand in a reality that refuses to be sentimentalized.

This encounter with hard truth gives the Orphan a quality of psychological realism that is extraordinarily valuable. They do not have illusions to protect. They see human beings as they actually are — fallible, inconsistent, capable of both cruelty and unexpected tenderness — and they love them anyway, not despite this knowledge but informed by it. The Orphan's love is the most grounded kind: it has looked at the reality and chosen to stay.

There is a democracy to the Orphan archetype. Having survived vulnerability, they recognize it in others with unusual accuracy. They do not maintain the pretense that some people are fundamentally stronger or safer than others. They know that suffering does not respect social categories, and this knowledge makes them profoundly inclusive — naturally drawn to the ones on the margins, the ones who have also found themselves on the outside of what they thought they were entitled to.`,
    coreThemes: [
      'Resilience through adversity',
      'Psychological realism and clear-eyed acceptance',
      'The universality of suffering',
      'Belonging and the search for community',
      'Surviving abandonment and finding ground',
    ],
    shadowExpression: `The Orphan's shadow is victimhood — the use of one's wound as the organizing principle of one's identity. In this mode, the genuine experience of suffering hardens into a story that is told and retold, a grievance that is nursed rather than processed, a wound kept open because it has become the only source of coherence available. The shadow Orphan cannot move forward because forward would require giving up the story of having been wronged.

There is also the shadow of cynicism: the Orphan who, having been disappointed, concludes that disappointment is all there is and that hope is simply naivety waiting to be punished. This shadow protects against further hurt by foreclosing the possibility of further joy. The shadow Orphan recruits others into their disillusionment, finding comfort in shared pessimism. The path out of this shadow requires the courage to hope again — which is, paradoxically, the most dangerous thing an Orphan can do.`,
    mythologicalRoots: `The Orphan archetype is embedded in some of the oldest and most resonant stories in human culture: Moses in the bulrushes, Romulus and Remus suckled by a wolf, Cinderella abandoned by those who should have protected her, Superman launched from a dying planet, Harry Potter growing up in the cupboard under the stairs. The abandoned child who rises through their own resources — or through unexpected aid from unlikely quarters — is one of humanity's deepest and most hopeful stories. It is the story of resilience itself.`,
    famousExamples: [
      'Harry Potter',
      'Jean Valjean (Les Misérables)',
      'Dorothy (The Wizard of Oz)',
      'Oliver Twist',
      'Jane Eyre',
      'Celie (The Color Purple)',
    ],
    growthPath: `The Orphan's growth is the recovery of trust — not naive trust, but the harder, wiser form that knows what it has survived and chooses relationship anyway. This requires grieving what was lost or never had: the safe childhood, the reliable parent, the world that was supposed to be fair. Real grieving is not the same as staying stuck. It is the work that releases the past so the present can be inhabited.

The mature Orphan becomes the most reliable person in the room — not because nothing can hurt them, but because they have a proven track record of survival. They know they can endure, and this knowledge is quietly steadying to everyone around them. They become the ones who create the belonging they lacked — building communities, building families of choice, building spaces where the excluded are included. Their wound becomes their gift.`,
    complementaryArchetypes: ['the-caregiver', 'the-innocent'],
    shadowArchetype: 'the-hero',
  },

  {
    slug: 'the-warrior',
    name: 'The Warrior',
    tagline: 'Discipline is the highest form of self-respect',
    symbol: '▲',
    description: `The Warrior is defined by their relationship to discipline — not as punishment but as devotion. They have discovered that the gap between who you are and who you could be is bridged by one thing above all others: the willingness to do the difficult thing, repeatedly, over time, when it is hard and when no one is watching. This willingness is not sourced in willpower alone; it flows from a deep commitment to something beyond comfort, to a standard they hold for themselves that does not require external validation to maintain.

The Warrior's excellence is grounded. They have put in the hours. They know the difference between the feeling of tired and the feeling of actually breaking, and they have learned to operate productively in the space between. They have also learned to lose — which is one of the most important educations available to a human being. The Warrior who has never lost is not yet fully formed; the one who has lost, and returned, and applied the lesson, is formidable in a way that goes far beyond any physical or professional achievement.

There is an ethics to the Warrior archetype that is often underestimated. Discipline without values is merely mechanism; the Warrior is characterized not just by their commitment to excellence but by what that excellence is in service of. The code — the bushido, the chivalric ideal, the creed — gives the Warrior's power its moral dimension, and it is this dimension that distinguishes the Warrior from the mere fighter.`,
    coreThemes: [
      'Discipline, training, and mastery',
      'Courage under sustained pressure',
      'A code of honor and ethics',
      'Resilience and the willingness to compete',
      'Excellence through sustained effort',
    ],
    shadowExpression: `The Warrior's shadow is aggression without conscience — power deployed in the service of the ego rather than a larger good. The shadow Warrior has internalized the discipline but not the ethics, and they use their formidable capabilities to dominate, intimidate, and crush opposition rather than to genuinely serve. They are often deeply competitive in ways that damage relationships and communities, unable to celebrate others' success because it feels like evidence of their own inadequacy.

There is also the shadow of the Warrior who cannot stop fighting even when the war is over — who has organized their entire identity around struggle and has no idea who they are in its absence. This Warrior picks unnecessary fights, creates conflict to maintain a sense of purpose, and is uncomfortable with peace because peace reveals the inner emptiness that the fight was covering. The antidote is finding a cause worthy of the Warrior's formidable energy — something larger than winning.`,
    mythologicalRoots: `Every culture has its warrior deities: Ares and Athena in Greece (the shadow and integrated warrior), the Norse Tyr who sacrificed his hand for the greater good, the Hindu Durga who slays demons. The samurai tradition codified the Warrior ethic most elaborately in bushido — the way of the warrior — which balanced martial skill with aesthetic sensibility, loyalty, and the willingness to die well. In modern Western mythology, the Warrior appears in the soldier, the athlete, the martial artist, and the entrepreneur who treats business as a form of competition.`,
    famousExamples: [
      'Miyamoto Musashi',
      'Arya Stark (Game of Thrones)',
      'Ruth Bader Ginsburg',
      'Achilles (The Iliad)',
      'Muhammad Ali',
      'Serena Williams',
    ],
    growthPath: `The Warrior grows by discovering the fight that matters most: the interior one. The discipline they have applied to physical training, professional achievement, or competitive endeavor must eventually be turned inward — toward the examination of motive, the cultivation of emotional intelligence, the honest reckoning with shadow and wound. This interior combat is more difficult than any external one because the opponent is the self, and the self is both the fighter and the fought.

The mature Warrior integrates strength and gentleness — understanding that real power does not need to assert itself constantly, that the capacity for force is most meaningful when held in reserve rather than deployed. They become protectors rather than combatants, mentors rather than rivals. Their discipline becomes a gift to others — the training that creates capability, the standard that calls out what is best in the people around them.`,
    complementaryArchetypes: ['the-hero', 'the-ruler'],
    shadowArchetype: 'the-lover',
  },

  {
    slug: 'the-innocent',
    name: 'The Innocent',
    tagline: 'Paradise is not lost — it is waiting to be found again',
    symbol: '◌',
    description: `The Innocent carries a faith that is not naive — or at least, the highest expression of this archetype is not naive. It is the recovered faith of someone who has looked at the evidence honestly and still concluded, against all rational expectation, that goodness is at the heart of things and that life can be lived with a fundamental openness to its beauty. This is not the Innocent who has never been hurt; it is the one who has been hurt and has, through some process of grace or choice or both, arrived on the other side of cynicism.

The Innocent's signature quality is wonder. They have not yet — or have again — the capacity to be genuinely surprised by beauty, touched by small kindnesses, moved by the ordinary extraordinary fact of being alive. This is contagious in the best way: the Innocent's presence loosens something in the people around them, gives them permission to hope or to feel what they have been keeping defended. There is a kind of radical permission-giving that the Innocent archetype extends to everyone in its orbit.

The Innocent also carries a relationship to simplicity that is genuinely countercultural. In a world that valorizes complexity, nuance, and ironic distance, the Innocent insists that some things really are what they look like — that a sunset is beautiful and an act of kindness is good and a child's laughter is one of the best sounds in the world. This insistence is not simple-mindedness; it is a refusal to let sophistication become a form of withholding.`,
    coreThemes: [
      'Optimism and faith in the essential goodness of life',
      'Wonder, innocence, and openness',
      'Simplicity as a form of wisdom',
      'The paradise available within the present moment',
      'Trust and the search for safety',
    ],
    shadowExpression: `The Innocent's shadow is denial — the refusal to see what is actually there because it threatens the image of a world in which everything works out and everyone is fundamentally good. The shadow Innocent looks away from suffering, from injustice, from the evidence of human cruelty, and calls this looking-away optimism. It is not. It is a form of spiritual bypassing that leaves the most vulnerable people without the witness they need and deserve.

There is also the shadow of dependence: the Innocent who has externalized their faith to a specific person, institution, or ideology, such that their sense of safety and goodness is entirely contingent on that external thing remaining intact. When the thing fails — as all things eventually do — the shadow Innocent is shattered rather than challenged and converted. The work of this shadow is to find the source of faith and goodness within rather than without.`,
    mythologicalRoots: `The Innocent is the prelapsarian Adam and Eve before the Fall, the child-god in every tradition — the Hindu Krishna as divine child, the infant Jesus in the manger, the Norse Baldr whose beauty and purity made every living thing promise not to harm him. The figure of Persephone before her abduction embodies the Innocent on the threshold of initiation. The archetype also lives in Utopian imaginings across cultures — the dream of the Golden Age, the Garden of Eden, the vision of what human society could be if it were organized around beauty and goodness rather than fear and competition.`,
    famousExamples: [
      'Anne of Green Gables',
      'Forrest Gump',
      'Maria (The Sound of Music)',
      'Winnie-the-Pooh',
      'Candide (Voltaire)',
      'Pollyanna',
    ],
    growthPath: `The Innocent grows by surviving disillusionment — not just surviving it, but allowing it to teach them. The loss of innocence is not the end of the story; it is the beginning of wisdom. The Innocent who has passed through genuine darkness and returned has something the untested Innocent cannot offer: a faith that has been pressure-tested, a hope that knows what it has survived.

This is the movement from innocence to experience to what William Blake called "organized innocence" — the wisdom that integrates knowledge of darkness while refusing to be defined by it. The mature Innocent is not someone who has not suffered. They are someone who has suffered and has discovered that suffering is not the last word. They carry their openness not as a defense against reality but as a response to it — a deliberate, informed, courageous choice to remain available to joy.`,
    complementaryArchetypes: ['the-caregiver', 'the-orphan'],
    shadowArchetype: 'the-magician',
  },
]

export const DEEPDIVE_BY_SLUG: Record<string, ArchetypeDeepDive> = Object.fromEntries(
  ARCHETYPE_DEEPDIVES.map((a) => [a.slug, a]),
)

export function getArchetypeDeepDive(slug: string): ArchetypeDeepDive | undefined {
  return DEEPDIVE_BY_SLUG[slug]
}
