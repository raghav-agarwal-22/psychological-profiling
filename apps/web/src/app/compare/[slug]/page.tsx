import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'

interface CompetitorData {
  slug: string
  competitor: string
  tagline: string
  metaTitle: string
  metaDescription: string
  intro: string
  inDepth: string[]
  tableRows: {
    feature: string
    innermind: string
    competitor: string
    innermindWins: boolean
  }[]
  verdict: string
  faq: { q: string; a: string }[]
}

const comparisons: Record<string, CompetitorData> = {
  'innermind-vs-16personalities': {
    slug: 'innermind-vs-16personalities',
    competitor: '16Personalities',
    tagline: 'vs 16Personalities (MBTI-based)',
    metaTitle: 'Innermind vs 16Personalities: Which Personality Test Is More Accurate?',
    metaDescription:
      'An honest comparison of Innermind and 16Personalities. Explore differences in scientific validity, depth of insight, AI synthesis, and practical value.',
    intro: `16Personalities is the most-visited personality site on the internet, built on a simplified version of the Myers-Briggs Type Indicator (MBTI). It's introduced hundreds of millions of people to personality psychology. But popularity and accuracy are different things — and the gap between the two matters if you're using a test to make real decisions about your career, relationships, or growth.

Innermind was built with a different premise: personality psychology has advanced far beyond four-letter types, and people deserve tools that reflect that science. Here's an honest breakdown of where each tool excels and where it falls short.`,
    inDepth: [
      `**The science question.** MBTI, which 16Personalities is based on, was developed in the 1940s before modern psychometrics existed. The scientific consensus since the 1980s is that the Big Five (OCEAN) model — measuring Openness, Conscientiousness, Extraversion, Agreeableness, and Neuroticism — is a far more reliable, valid, and predictive framework. MBTI types show poor test-retest reliability: roughly 50% of people get a different four-letter type when they retake the test five weeks later. Big Five scores are stable and replicate across cultures, languages, and decades of research.

Innermind uses Big Five as its primary personality framework, supplemented by attachment theory and values assessment. This isn't just a matter of scientific preference — it directly affects how useful the results are. A test that puts you in a different category depending on when you take it cannot be the basis for reliable self-knowledge.`,
      `**Depth of analysis.** 16Personalities gives you a type label (e.g., "INFJ — The Advocate") and a set of descriptions about what people with that type are like. The descriptions are well-written, but they're general — they have to be, because they apply to millions of people assigned to the same bucket. This is the Barnum effect: personality-relevant statements that feel personally accurate because they're written to apply broadly.

Innermind generates your profile through an adaptive assessment — the system adjusts which questions it shows based on your earlier answers, building a more precise picture. Your results are synthesized by Claude into a profile that's specific to your actual score pattern, not to a generic type. If you scored 72nd percentile on conscientiousness, 34th on neuroticism, and high on self-direction values, your profile will reflect that particular combination — not a general description of "conscientious people."`,
      `**Practical utility.** For career and relationship decisions, the specific matters. Knowing you're an "INTJ" is less actionable than knowing your profile shows high openness, lower agreeableness, and a strong autonomy drive — and understanding concretely how that combination plays out in team settings, under stress, and in close relationships. Innermind's AI-synthesized narrative connects your scores to real behavioral patterns rather than presenting an idealized self-description.

16Personalities is a great starting point — it's introduced millions of people to the idea that personality shapes how we see the world. But if you've already taken MBTI and want to go deeper, Innermind is where the real work happens.`,
    ],
    tableRows: [
      { feature: 'Scientific validity', innermind: 'Big Five (OCEAN) — gold standard', competitor: 'MBTI-derived — limited peer support', innermindWins: true },
      { feature: 'Test-retest reliability', innermind: 'High — scores stable over time', competitor: 'Low — ~50% type shift on retest', innermindWins: true },
      { feature: 'Adaptive assessment', innermind: 'Yes — adjusts to your answers', competitor: 'No — fixed question set', innermindWins: true },
      { feature: 'AI-synthesized profile', innermind: 'Yes — personalized narrative', competitor: 'No — generic type descriptions', innermindWins: true },
      { feature: 'Attachment style', innermind: 'Included', competitor: 'Not included', innermindWins: true },
      { feature: 'Values mapping', innermind: 'Included', competitor: 'Not included', innermindWins: true },
      { feature: 'Free tier', innermind: 'Yes — full assessment free', competitor: 'Yes — basic results free', innermindWins: false },
      { feature: 'Community size', innermind: 'Growing', competitor: 'Massive — 100M+ users', innermindWins: false },
    ],
    verdict: `16Personalities wins on brand recognition and community. Innermind wins on science, depth, and actionable insight. If you want a shareable type label, 16Personalities delivers that. If you want to actually understand your psychology — and get an AI-synthesized analysis built on validated frameworks — Innermind is the better tool. The two aren't really competing for the same outcome.`,
    faq: [
      {
        q: 'Is MBTI scientifically valid?',
        a: 'The scientific consensus is mixed-to-negative. MBTI has poor test-retest reliability and the four dichotomies do not align well with factor analyses of personality. The Big Five model has far stronger empirical support. 16Personalities uses a modified version of MBTI that scores each dimension on a spectrum, which is an improvement, but the underlying framework remains contested.',
      },
      {
        q: 'Can I use both tests?',
        a: 'Yes — many people find value in taking multiple assessments. Your 16P type can give you a narrative frame, while Innermind provides the quantitative profile underneath it. They measure overlapping but distinct things.',
      },
      {
        q: 'How long does the Innermind assessment take?',
        a: 'The core assessment takes 15–25 minutes. The adaptive format means it stops asking questions once it has enough data for a precise profile, so actual time varies.',
      },
    ],
  },

  'innermind-vs-crystal-knows': {
    slug: 'innermind-vs-crystal-knows',
    competitor: 'Crystal Knows',
    tagline: 'vs Crystal Knows',
    metaTitle: 'Innermind vs Crystal Knows: Which Personality Platform Is More Accurate?',
    metaDescription:
      'Compare Innermind and Crystal Knows on personality science, self-assessment accuracy, team features, and pricing. An honest breakdown for professionals.',
    intro: `Crystal Knows is built for B2B sales and recruiting — it infers personality profiles from LinkedIn profiles and email behavior to help salespeople adapt their communication style to each prospect. It's a fascinating and commercially useful product. But it's solving a different problem than Innermind, and understanding that distinction matters when you're choosing a tool.

Innermind is built for individual self-knowledge: a rigorous, AI-synthesized understanding of your own psychology based on validated self-assessment. Crystal is built for interpersonal strategy: predicting how someone else will behave based on external signals. Here's how the two tools compare when put side by side.`,
    inDepth: [
      `**The inference question.** Crystal's most powerful feature — predicting personality from LinkedIn data — is also its most epistemically uncertain. Inferring someone's neuroticism or attachment style from their professional bio and writing style involves significant assumptions. Crystal uses DISC as its primary framework, which is older and less validated than the Big Five, and the inferences made from text signals are not fully transparent.

Self-assessment, by contrast, has a fundamental advantage: you have access to your own internal states in a way that no external observer can replicate. When Innermind asks you how you respond to criticism, how you feel in large groups, or how you approach uncertainty, your answers carry information that no LinkedIn profile can approximate. For personal self-knowledge, self-report is the gold standard — the question is just whether the assessment is well-designed.`,
      `**Use case divergence.** Crystal is primarily a sales and recruiting tool. Its value proposition is: "understand the person across the table before they speak." This is genuinely useful in high-stakes professional contexts. But it's not really about understanding yourself — it's about understanding others through an external lens.

Innermind inverts this. The primary audience is people who want to understand their own psychology: their Big Five trait profile, their attachment style, the values that drive their decisions, and how these interact. The AI-synthesized profile connects quantitative scores to qualitative behavioral patterns. If you're in therapy, coaching, a career transition, or trying to understand patterns in your relationships, Innermind is built for that goal. Crystal isn't.`,
      `**Pricing and accessibility.** Crystal's B2B focus is reflected in its pricing — the full platform costs hundreds of dollars per year, with most advanced features behind a paid wall. It's priced for teams and enterprises. Innermind's core assessment is free, with a Pro tier for deeper analysis and longitudinal tracking. The accessibility difference matters if you're an individual looking for self-insight, not a sales team trying to score leads.`,
    ],
    tableRows: [
      { feature: 'Personality framework', innermind: 'Big Five + Attachment + Values', competitor: 'DISC', innermindWins: true },
      { feature: 'Assessment method', innermind: 'Adaptive self-assessment', competitor: 'Text inference from LinkedIn/email', innermindWins: true },
      { feature: 'Scientific validation', innermind: 'High — Big Five is peer-reviewed', competitor: 'Limited — DISC lacks strong validation', innermindWins: true },
      { feature: 'AI-synthesized personal narrative', innermind: 'Yes', competitor: 'No — type descriptions only', innermindWins: true },
      { feature: 'Sales/recruiting features', innermind: 'Not the focus', competitor: 'Core feature', innermindWins: false },
      { feature: 'Team comparison view', innermind: 'Pro feature', competitor: 'Yes — core feature', innermindWins: false },
      { feature: 'Free personal assessment', innermind: 'Yes', competitor: 'Limited', innermindWins: true },
      { feature: 'Pricing model', innermind: 'Freemium individual', competitor: 'B2B subscription', innermindWins: true },
    ],
    verdict: `Crystal Knows is an excellent B2B tool for sales teams who need to quickly adapt communication style to prospects. Innermind is the better choice for anyone who wants to deeply understand their own psychology. They serve genuinely different purposes — choosing between them depends on whether your goal is self-knowledge or interpersonal strategy.`,
    faq: [
      {
        q: 'Does Crystal Knows give accurate personality profiles?',
        a: 'Crystal\'s inferences from text are useful as a heuristic for communication style but shouldn\'t be treated as definitive personality assessments. The accuracy depends heavily on how much public information is available about the person.',
      },
      {
        q: 'Can Innermind help with professional communication?',
        a: 'Yes — understanding your own Big Five profile, values, and communication patterns directly improves how you collaborate, negotiate, and lead. The personal self-knowledge angle complements what tools like Crystal offer.',
      },
      {
        q: 'What is DISC vs Big Five?',
        a: 'DISC is an older model measuring four behavioral tendencies (Dominance, Influence, Steadiness, Conscientiousness). The Big Five (OCEAN) is the current scientific standard, validated across thousands of studies and cultures. The Big Five is generally considered more predictive and comprehensive.',
      },
    ],
  },

  'innermind-vs-truity': {
    slug: 'innermind-vs-truity',
    competitor: 'Truity',
    tagline: 'vs Truity',
    metaTitle: 'Innermind vs Truity: Which Personality Test Gives Better Insights?',
    metaDescription:
      'Compare Innermind and Truity across scientific validity, test variety, AI synthesis, depth of insight, and pricing. Find out which gives you more actionable self-knowledge.',
    intro: `Truity is one of the more thoughtful personality test aggregators on the market. It offers Big Five, Enneagram, TypeFinder (their MBTI variant), and several other assessments — and its free tests are genuinely well-constructed. If you want to sample multiple personality frameworks, Truity is a reasonable place to do it.

But sampling across frameworks and going deep within one are different activities. Innermind is built around the premise that a single comprehensive assessment — covering Big Five, attachment style, and core values — synthesized by AI into a coherent personal narrative, produces more actionable insight than a collection of separate scores. Here's how the two compare.`,
    inDepth: [
      `**Breadth vs depth.** Truity's strength is variety: you can take a Big Five test, an Enneagram test, and a TypeFinder test in the same place. This breadth has real value for people exploring personality psychology. But it can also produce fragmentation — you end up with a collection of scores across frameworks that don't obviously connect to each other.

Innermind integrates three validated frameworks — Big Five trait psychology, attachment theory, and the Schwartz values model — into a single adaptive assessment. Rather than giving you separate scores in each domain, Claude synthesizes them into a coherent profile narrative that shows how your trait expression, relational patterns, and core values interact. This integration is where the actionable insight lives.`,
      `**Free vs paid content.** Truity's business model gates most of the detailed interpretation behind a paywall. The free results show you your scores, but the "full report" — including practical applications, career implications, and relationship guidance — costs $19.95 per assessment. If you want the complete picture across multiple frameworks, costs add up quickly.

Innermind's full AI-synthesized profile is accessible at the free tier. The Pro tier adds longitudinal tracking, advanced comparisons, and the AI coach — but the core value proposition, a comprehensive personalized analysis, doesn't require payment.`,
      `**Adaptive assessment.** Truity uses fixed-item questionnaires. Innermind's assessment is adaptive — the question sequence adjusts based on your earlier responses, allowing the system to build a more precise profile in fewer questions. This matters particularly at the extremes of trait distributions, where standard instruments tend to have lower measurement precision.`,
      `**AI synthesis.** Truity's reports are template-based: well-written but necessarily generic because they need to apply to everyone who scores in a similar range. Innermind's profiles are synthesized by Claude from your specific score pattern. Two people with similar but not identical profiles will receive meaningfully different narratives that reflect the actual differences in their psychology — not variations of the same template.`,
    ],
    tableRows: [
      { feature: 'Assessment frameworks', innermind: 'Big Five + Attachment + Values (integrated)', competitor: 'Big Five, MBTI, Enneagram, StrengthsFinder, more', innermindWins: false },
      { feature: 'Adaptive assessment', innermind: 'Yes', competitor: 'No — fixed item sets', innermindWins: true },
      { feature: 'AI-synthesized narrative', innermind: 'Yes — personalized', competitor: 'No — template-based reports', innermindWins: true },
      { feature: 'Free full results', innermind: 'Yes', competitor: 'Scores free, deep reports paid', innermindWins: true },
      { feature: 'Report price', innermind: 'Free core / Pro subscription', competitor: '$19.95 per detailed report', innermindWins: true },
      { feature: 'Cross-framework integration', innermind: 'Yes — unified profile', competitor: 'Separate per-test scores', innermindWins: true },
      { feature: 'Test variety', innermind: 'Focused — 3 integrated frameworks', competitor: 'Wide — 10+ tests', innermindWins: false },
      { feature: 'Community content', innermind: 'Growing', competitor: 'Large — established audience', innermindWins: false },
    ],
    verdict: `Truity is the better choice if you want to explore multiple personality frameworks cheaply before committing to one. Innermind is the better choice if you want the deepest possible understanding of your psychology from a single rigorous assessment — especially if you care about getting a genuinely personalized AI analysis rather than a template-based report.`,
    faq: [
      {
        q: 'Is Truity\'s Big Five test accurate?',
        a: 'Yes — Truity\'s Big Five implementation is reasonably well-constructed and uses the established OCEAN model. The scores themselves are reliable. Where it diverges from Innermind is in the interpretive layer: Truity\'s reports are template-based while Innermind\'s profiles are AI-synthesized from your specific score pattern.',
      },
      {
        q: 'Does Innermind include an Enneagram assessment?',
        a: 'Currently Innermind focuses on Big Five, attachment style, and values — three frameworks with strong scientific validation. The Enneagram is not included because its empirical foundations are weaker. Future assessments may expand the framework set.',
      },
      {
        q: 'How does Innermind\'s Pro tier compare to Truity\'s paid reports?',
        a: 'Innermind Pro is a subscription that includes longitudinal tracking, advanced comparisons, and AI coaching — ongoing value rather than a one-time report purchase. Truity charges per-report, which works well for one-time deep dives but can become expensive if you use multiple assessments.',
      },
    ],
  },

  'innermind-vs-human-design': {
    slug: 'innermind-vs-human-design',
    competitor: 'Human Design',
    tagline: 'vs Human Design',
    metaTitle: 'Innermind vs Human Design: Science-Based vs Esoteric Personality Systems',
    metaDescription:
      'Compare Innermind and Human Design on scientific validity, practical utility, and depth of personal insight. An honest look at what each system offers.',
    intro: `Human Design is a synthesis of astrology, the I Ching, Kabbalah, and the chakra system, developed in the late 1980s. It assigns people to one of five "types" (Manifestor, Generator, Manifesting Generator, Projector, Reflector) based on birth date, time, and location. It has accumulated a large and dedicated following, particularly in wellness and coaching communities.

We want to be direct here: Human Design is not a psychological science. It makes no empirically testable claims and has not been subjected to scientific validation. That doesn't mean people don't find it meaningful — many do. But it does mean the two systems are operating in fundamentally different registers, and the comparison requires acknowledging that distinction honestly.`,
    inDepth: [
      `**What Human Design does well.** Human Design gives people a rich symbolic system for self-exploration. Its language — centers, channels, profiles, authorities — provides a framework for asking questions about decision-making, energy, and relationships. For many people, it offers a permission structure: if your chart says you're a Projector who shouldn't initiate, that framing can help someone who has historically over-extended themselves to rest without guilt. The symbolic language creates space for reflection.

There's also something psychologically interesting happening in Human Design communities: people are paying close attention to their inner states, discussing psychology and decision-making in accessible language, and building self-awareness through a shared framework. These are good things, even if the framework generating them isn't empirically grounded.`,
      `**What Human Design doesn't offer.** Human Design cannot tell you your actual trait profile. It cannot measure your attachment anxiety or avoidance. It cannot quantify where you fall on conscientiousness, how your neuroticism compares to the population, or whether your values cluster toward self-transcendence or personal achievement. These are measurable psychological characteristics that predict behavior, mental health outcomes, relationship quality, and career success — and Human Design doesn't access them.

The birth chart determines your Human Design type completely. You have no agency over your type, and two people born in the same hospital on the same day would receive identical charts. Psychological research consistently shows that personality is influenced by genetics and environment in complex, individual ways — not by celestial positions at birth.`,
      `**The scientific question.** Innermind is built on three frameworks: the Big Five, attachment theory, and the Schwartz values model. All three have been validated across thousands of studies, replicated across cultures, and shown to predict meaningful real-world outcomes. If your neuroticism score is high, there's a body of research showing that predicts anxiety vulnerability, relationship conflict, and certain health outcomes. If your attachment style is anxious, there's research on how that plays out in romantic relationships, friendships, and work dynamics. These connections are empirical, not metaphorical.

Human Design's type assignments have not been shown to predict any of these outcomes. There are no peer-reviewed studies validating Human Design as a psychological assessment.`,
    ],
    tableRows: [
      { feature: 'Scientific validation', innermind: 'Yes — peer-reviewed frameworks', competitor: 'None — not empirically validated', innermindWins: true },
      { feature: 'Predictive validity', innermind: 'Yes — outcomes research exists', competitor: 'None established', innermindWins: true },
      { feature: 'Self-assessment component', innermind: 'Yes — adaptive questionnaire', competitor: 'None — birth data only', innermindWins: true },
      { feature: 'Trait measurement', innermind: 'Big Five, Attachment, Values', competitor: 'Types, Centers, Channels (non-empirical)', innermindWins: true },
      { feature: 'AI-synthesized narrative', innermind: 'Yes', competitor: 'No — chart interpretation', innermindWins: true },
      { feature: 'Spiritual/esoteric framework', innermind: 'No', competitor: 'Yes — central to the system', innermindWins: false },
      { feature: 'Community and culture', innermind: 'Growing', competitor: 'Large, established community', innermindWins: false },
      { feature: 'Cost to access full results', innermind: 'Free core profile', competitor: 'Free basic chart, paid readings', innermindWins: true },
    ],
    verdict: `Human Design and Innermind are not really alternatives — they're different things. Human Design is a symbolic system for self-exploration that many people find meaningful. Innermind is a scientific psychological assessment that measures real, validated traits with real predictive power. If you're drawn to Human Design for spiritual exploration, that's a valid use. If you want an accurate psychological profile that tells you something empirically true about your personality, Innermind is the right tool.`,
    faq: [
      {
        q: 'Can Human Design and psychological tests be used together?',
        a: 'Yes — many people use both. Human Design can provide a meaningful personal narrative and community framework, while tools like Innermind provide empirically grounded trait data. They operate in different registers and don\'t contradict each other.',
      },
      {
        q: 'Is there any scientific research on Human Design?',
        a: 'There is very limited peer-reviewed research on Human Design, and none that validates its core claims about types predicting psychological outcomes. The system\'s founder described it as a "mystical revelation" rather than a scientific theory.',
      },
      {
        q: 'What makes the Big Five more reliable than Human Design?',
        a: 'Big Five scores are determined by self-report questionnaire, not birth data. They show strong test-retest reliability (you get similar scores over time), cross-cultural replication, and predictive validity for outcomes including career performance, relationship quality, and mental health. Human Design types have not been tested against these criteria.',
      },
    ],
  },

  'innermind-vs-humandesign': {
    slug: 'innermind-vs-humandesign',
    competitor: 'Human Design',
    tagline: 'vs Human Design',
    metaTitle: 'Innermind vs Human Design: Science-Based Psychology vs Esoteric Typing',
    metaDescription:
      'Compare Innermind and Human Design on scientific validity, practical utility, and depth of personal insight. An honest look at what each system actually offers.',
    intro: `Human Design is a synthesis of astrology, the I Ching, Kabbalah, and the chakra system, created in 1987. It classifies people into five "types" — Manifestor, Generator, Manifesting Generator, Projector, Reflector — based entirely on birth date, time, and location. It has earned a devoted following in wellness and coaching circles.

We want to be straightforward: Human Design is not an empirical psychological science. Its type assignments are determined by celestial data, not by anything you report about your own behavior, preferences, or inner life. That doesn't mean people don't find it meaningful — many do. But it means the comparison with Innermind requires acknowledging what each system is actually doing.`,
    inDepth: [
      `**Evidence and epistemology.** Innermind is built on three frameworks that have been validated across thousands of peer-reviewed studies: the Big Five trait model, attachment theory, and the Schwartz values model. When Innermind says you score high on neuroticism, that score predicts anxiety vulnerability, relationship conflict, and health outcomes — because those predictions have been tested empirically across diverse populations.

Human Design's type assignments have not been shown to predict any of these outcomes. There are no peer-reviewed studies validating Human Design as a psychological assessment. The system's founder described it as a received "mystical revelation," not a scientific theory. This isn't a dismissal of the system's cultural value — it's a factual description of its epistemic status.`,
      `**What Human Design offers.** Human Design gives users a rich symbolic vocabulary for self-exploration: centers, channels, authorities, profiles. Many people find this language genuinely useful for examining their decision-making patterns, energy management, and relational tendencies. A Projector who is told not to initiate may find useful permission to rest and wait — even if the origin of that advice is astrological rather than psychological.

The Human Design community also fosters genuine introspection and rich conversations about personality. These are real benefits, independent of whether the underlying framework is scientifically valid.`,
      `**What Human Design cannot provide.** Human Design cannot tell you where you actually fall on conscientiousness, openness, or neuroticism — traits that predict career performance, mental health, and relationship quality. It cannot measure your attachment anxiety or avoidance, or show how your values hierarchy drives your decisions. These are measurable characteristics with genuine predictive power, and they require a self-report assessment to surface.

Because your Human Design type is entirely determined by your birth data, two people born at the same place and time would receive identical charts — regardless of how differently their actual personalities developed. Psychological research shows personality emerges from a complex interaction of genetics and lived experience, not from celestial positions.`,
      `**The actionability gap.** Innermind's AI-synthesized profile connects your specific score pattern to behavioral predictions: how you're likely to perform under stress, what environments you thrive in, how your attachment style shapes conflict. This specificity is possible because the underlying frameworks have been studied in relation to real outcomes.

Human Design readings tend toward archetypal description — qualities associated with a type rather than predictions grounded in outcome data. Both can be useful for reflection, but only one provides the kind of empirically grounded self-knowledge that supports concrete decisions about career, relationships, or mental health.`,
    ],
    tableRows: [
      { feature: 'Scientific validation', innermind: 'Yes — peer-reviewed frameworks', competitor: 'None — not empirically validated', innermindWins: true },
      { feature: 'Assessment method', innermind: 'Adaptive self-report questionnaire', competitor: 'Birth date, time, and location only', innermindWins: true },
      { feature: 'Predictive validity', innermind: 'Yes — outcomes research exists', competitor: 'None established', innermindWins: true },
      { feature: 'Trait measurement', innermind: 'Big Five, Attachment, Values', competitor: 'Types, Centers, Channels (non-empirical)', innermindWins: true },
      { feature: 'AI-synthesized narrative', innermind: 'Yes — personalized to your scores', competitor: 'No — chart interpretation', innermindWins: true },
      { feature: 'Spiritual / esoteric framework', innermind: 'No', competitor: 'Yes — central to the system', innermindWins: false },
      { feature: 'Free core results', innermind: 'Yes', competitor: 'Free basic chart, paid readings vary', innermindWins: true },
      { feature: 'Community and culture', innermind: 'Growing', competitor: 'Large, passionate community', innermindWins: false },
    ],
    verdict: `Human Design and Innermind are not competing for the same goal. Human Design is a symbolic self-exploration system that many people find meaningful and community-forming. Innermind is a scientific psychological assessment with empirically validated frameworks and genuine predictive power. If you use Human Design for spiritual exploration and personal narrative, that is a legitimate use. If you want a rigorous, evidence-based profile of your actual psychology, Innermind is built for exactly that.`,
    faq: [
      {
        q: 'Can I use Human Design and Innermind together?',
        a: 'Yes — they operate in different registers and don\'t contradict each other. Human Design provides a symbolic framework and community language. Innermind provides empirically grounded trait data. Many people find value in both: the narrative depth of Human Design alongside the scientific rigor of Big Five and attachment theory.',
      },
      {
        q: 'Is there scientific research validating Human Design?',
        a: 'There is no peer-reviewed research validating Human Design\'s core claims. The system was not developed through the scientific method and has not been tested against outcome data. Its founder described it as a mystical revelation rather than an empirical theory.',
      },
      {
        q: 'Why does birth data alone not determine personality?',
        a: 'Decades of behavioral genetics research show that personality emerges from a combination of genetic factors and lived experience — family environment, culture, formative events, and individual development. Celestial positions at birth have not been found to predict personality outcomes in controlled studies.',
      },
      {
        q: 'What does Innermind measure that Human Design does not?',
        a: 'Innermind measures your Big Five trait scores (Openness, Conscientiousness, Extraversion, Agreeableness, Neuroticism), attachment style (secure, anxious, avoidant, disorganized), and core values hierarchy. These have been shown to predict career performance, relationship quality, mental health outcomes, and behavioral tendencies — none of which Human Design addresses empirically.',
      },
    ],
  },

  'innermind-vs-enneagraminstitute': {
    slug: 'innermind-vs-enneagraminstitute',
    competitor: 'The Enneagram Institute',
    tagline: 'vs The Enneagram Institute',
    metaTitle: 'Innermind vs The Enneagram Institute: Multi-Framework AI vs Enneagram Specialist',
    metaDescription:
      'Compare Innermind and The Enneagram Institute on depth, scientific validity, AI synthesis, and practical utility. Is a specialist better than a multi-framework platform?',
    intro: `The Enneagram Institute is the most authoritative Enneagram resource available. Founded by Don Riso and Russ Hudson, it offers the RHETI (Riso-Hudson Enneagram Type Indicator) — the most rigorously developed Enneagram assessment in existence — along with deep written profiles, levels of development theory, and a rich library of teaching materials. If you want the best possible Enneagram experience, the Enneagram Institute delivers it.

The question isn't whether the Enneagram Institute does what it does well — it does. The question is whether a single-framework specialist or a multi-framework platform with AI synthesis better serves your goal of understanding yourself. Here's an honest breakdown.`,
    inDepth: [
      `**The Enneagram's scientific standing.** The Enneagram Institute's RHETI is the most psychometrically developed Enneagram instrument available, and the Enneagram's nine-type model has genuine face validity — its descriptions resonate deeply with many people. However, the Enneagram as a framework has weaker empirical support than the Big Five. Its origins are unclear (the typology does not have a clear scientific lineage), test-retest reliability is lower than Big Five instruments, and fewer peer-reviewed studies have validated its predictive claims.

This is not to dismiss the Enneagram — experienced therapists, coaches, and educators find it genuinely useful. But Innermind's choice to center on Big Five, attachment theory, and Schwartz values reflects where the strongest scientific consensus sits.`,
      `**Depth within one framework vs synthesis across three.** The Enneagram Institute goes exceptionally deep on a single framework. Its levels of development model, wing theory, and integration/disintegration paths create a rich, nuanced system for self-study. If you find the Enneagram deeply resonant, the Institute's materials represent years of serious engagement with the model.

Innermind's approach is different: it integrates Big Five trait psychology, attachment theory, and values mapping into a single adaptive assessment, then uses Claude to synthesize the results into a coherent profile. The value is in the cross-framework synthesis — understanding how your trait expression, relational patterns, and core values interact, rather than going as deep as possible within one lens. These are genuinely different approaches, and which serves you better depends on what you're looking for.`,
      `**AI synthesis vs written profiles.** The Enneagram Institute's profiles are expertly crafted by human authors and reflect decades of accumulated wisdom. They are detailed, psychologically sophisticated, and rich with clinical observation. Their value is in the depth and quality of the writing.

Innermind's AI synthesis generates a profile specific to your actual score pattern across three frameworks. Two people who both score as Enneagram Type 4 would receive the same Institute profile — but they might have very different Big Five trait profiles, attachment patterns, and values hierarchies. Innermind's approach reflects those differences, generating a narrative that is specific to the individual rather than the type.`,
      `**Pricing and access.** The Enneagram Institute's RHETI costs $12. The detailed written profiles for each type and wing are available free on the website. The Institute is not a subscription service — it's a one-time assessment plus reference library. Innermind's core assessment is free, with a Pro subscription for advanced features. The cost comparison is modest, but Innermind's free tier delivers the full AI-synthesized profile.`,
    ],
    tableRows: [
      { feature: 'Primary framework', innermind: 'Big Five + Attachment + Values (integrated)', competitor: 'Enneagram (nine types)', innermindWins: false },
      { feature: 'Scientific validation', innermind: 'High — Big Five is gold standard', competitor: 'Moderate — RHETI is best-in-class Enneagram', innermindWins: true },
      { feature: 'Adaptive assessment', innermind: 'Yes', competitor: 'No — fixed item RHETI', innermindWins: true },
      { feature: 'AI-synthesized narrative', innermind: 'Yes — personalized to your scores', competitor: 'No — expert-written type profiles', innermindWins: true },
      { feature: 'Cross-framework synthesis', innermind: 'Yes — three integrated frameworks', competitor: 'No — Enneagram only', innermindWins: true },
      { feature: 'Depth within one framework', innermind: 'Moderate', competitor: 'Very deep — levels, wings, arrows', innermindWins: false },
      { feature: 'Free core results', innermind: 'Yes', competitor: 'RHETI $12, type profiles free', innermindWins: true },
      { feature: 'Written teaching library', innermind: 'Limited', competitor: 'Extensive — books, videos, courses', innermindWins: false },
    ],
    verdict: `The Enneagram Institute is the definitive resource if you want to go as deep as possible within the Enneagram framework specifically. Innermind is the better choice if you want a comprehensive, multi-framework psychological profile with AI synthesis that connects Big Five traits, attachment patterns, and values into a single coherent narrative. The ideal approach for serious self-knowledge may be both: use Innermind for your empirically grounded baseline profile, and the Enneagram Institute if the nine-type model resonates deeply and you want to explore it further.`,
    faq: [
      {
        q: 'Is the RHETI the most accurate Enneagram test?',
        a: 'The RHETI is the most psychometrically developed Enneagram assessment available, with published reliability and validity data. It is significantly more rigorous than free online Enneagram tests. If you\'re going to take an Enneagram test, the RHETI is the right choice.',
      },
      {
        q: 'Does Innermind include an Enneagram assessment?',
        a: 'Currently Innermind focuses on Big Five, attachment style, and values — three frameworks with the strongest scientific validation. The Enneagram is not currently included because its empirical foundations are less robust than the Big Five. Future additions to the framework set are possible.',
      },
      {
        q: 'Can the Enneagram and Big Five be used together?',
        a: 'Yes — they measure overlapping but distinct aspects of personality. Research has found correlations between Enneagram types and Big Five scores (for example, Type 5 correlates with high openness and low extraversion), but the frameworks are not redundant. Using both can provide complementary perspectives.',
      },
      {
        q: 'What does "levels of development" mean in Enneagram theory?',
        a: 'The Levels of Development is a model developed by Don Riso and Russ Hudson that describes nine levels of psychological health within each type — from healthy and integrated to unhealthy and disintegrated. It\'s one of the most sophisticated contributions of the Enneagram Institute\'s work and has no direct equivalent in the Big Five framework.',
      },
      {
        q: 'Which is better for therapy or coaching — Enneagram or Big Five?',
        a: 'Both are used in clinical and coaching contexts. The Enneagram is popular in coaching because its narrative richness and motivational language resonate with clients. The Big Five is more common in clinical research because of its validated predictive relationships with psychological outcomes. Many practitioners use both.',
      },
    ],
  },

  'innermind-vs-bigfivetest': {
    slug: 'innermind-vs-bigfivetest',
    competitor: 'BigFiveTest.com',
    tagline: 'vs BigFiveTest.com',
    metaTitle: 'Innermind vs BigFiveTest.com: Which Big Five Assessment Goes Further?',
    metaDescription:
      'Compare Innermind and BigFiveTest.com on depth, AI synthesis, additional frameworks, and actionability. Both use Big Five — find out what separates them.',
    intro: `BigFiveTest.com is a free, straightforward Big Five personality assessment. It measures the five core OCEAN traits — Openness, Conscientiousness, Extraversion, Agreeableness, and Neuroticism — and returns percentage scores with brief descriptions. For someone who wants a quick, free Big Five score, it does the job.

Innermind also uses the Big Five as its primary framework. But the comparison between the two illustrates what happens when you build on the same scientific foundation and take it much further: adding attachment theory, values mapping, adaptive assessment methodology, and AI synthesis. Here's a detailed look at where they diverge.`,
    inDepth: [
      `**The same foundation, very different execution.** Both tools are grounded in the Big Five — the scientific standard in personality research. This means both are working from a valid framework, which is more than can be said for many personality tools. Where they diverge is in depth, methodology, and what they do with the data.

BigFiveTest.com returns five percentage scores with brief written descriptions of what each score means. This is useful and accurate as far as it goes. Innermind treats those same five scores as the starting point for a much more extensive analysis — synthesizing them alongside attachment and values data into a personal narrative that addresses how your trait profile plays out behaviorally, relationally, and vocationally.`,
      `**Adaptive vs fixed assessment.** BigFiveTest.com uses a fixed-item questionnaire — every user answers the same questions in the same order. This is a perfectly valid approach and is how most Big Five tools work. Innermind's assessment is adaptive: the question sequence adjusts based on your earlier responses. This allows the system to allocate more questions to trait dimensions where your responses are ambiguous and fewer where your profile is clear — improving measurement precision without increasing test length unnecessarily.`,
      `**Going beyond the Big Five.** The Big Five measures traits — stable tendencies in how you think, feel, and behave. But personality psychology has other important dimensions that the Big Five doesn't capture directly. Attachment theory describes how your early relational experiences shape your default patterns in close relationships — whether you tend toward security, anxiety, avoidance, or disorganization in intimate contexts. The Schwartz values model maps your core motivational priorities — what you're fundamentally oriented toward, from self-direction and achievement to benevolence and tradition.

These dimensions are not redundant with the Big Five. Someone can score identically on all five OCEAN traits and still have meaningfully different attachment patterns or values hierarchies. Innermind's integrated assessment captures all three dimensions in a single session.`,
      `**AI synthesis vs static descriptions.** BigFiveTest.com's descriptions explain what each score means for that trait. They're accurate but necessarily generic — the same description applies to everyone who scores in the 70th percentile on openness. Innermind's AI synthesis generates a profile that reflects the interaction of all your scores: how your specific combination of openness, conscientiousness, extraversion, agreeableness, and neuroticism — plus your attachment style and values — produces your particular psychology. This interaction effect is where genuine self-knowledge lives.`,
    ],
    tableRows: [
      { feature: 'Big Five assessment', innermind: 'Yes — adaptive', competitor: 'Yes — fixed item', innermindWins: true },
      { feature: 'Attachment style', innermind: 'Yes — included', competitor: 'No', innermindWins: true },
      { feature: 'Values mapping', innermind: 'Yes — Schwartz model', competitor: 'No', innermindWins: true },
      { feature: 'Adaptive assessment', innermind: 'Yes', competitor: 'No — fixed question set', innermindWins: true },
      { feature: 'AI-synthesized narrative', innermind: 'Yes — personalized profile', competitor: 'No — static trait descriptions', innermindWins: true },
      { feature: 'Cross-framework integration', innermind: 'Yes — unified analysis', competitor: 'No — Big Five only', innermindWins: true },
      { feature: 'Free access', innermind: 'Yes — full profile free', competitor: 'Yes — fully free', innermindWins: false },
      { feature: 'Simplicity and speed', innermind: 'Moderate — 15–25 min', competitor: 'Fast — basic results quickly', innermindWins: false },
    ],
    verdict: `BigFiveTest.com is a good choice if you want a quick, free Big Five score with no frills. Innermind is the better choice if you want to understand what those Big Five scores actually mean for your life — supplemented by attachment theory and values data, synthesized by AI into a coherent personal profile rather than five separate trait descriptions. Both start from the right scientific foundation; Innermind builds significantly further from there.`,
    faq: [
      {
        q: 'Is BigFiveTest.com a legitimate personality test?',
        a: 'Yes — it uses the validated Big Five framework and provides accurate trait scores. It is a straightforward implementation of a well-established model. Where it differs from Innermind is in depth: it measures the five traits without the additional frameworks (attachment, values) or AI synthesis that Innermind provides.',
      },
      {
        q: 'Why does Innermind include attachment style alongside Big Five?',
        a: 'Attachment theory captures something the Big Five does not: your relational security patterns — how you behave in close relationships when trust, intimacy, or conflict are involved. Attachment style is partially correlated with Big Five traits (high neuroticism correlates with anxious attachment, for example) but is not redundant. Knowing both gives a more complete picture of your psychology.',
      },
      {
        q: 'What is the Schwartz values model?',
        a: 'The Schwartz Basic Human Values model identifies ten universal motivational values — including self-direction, achievement, benevolence, and tradition — that describe what people fundamentally pursue and protect. It has been validated across 80+ countries and predicts behavior in ways that complement rather than duplicate trait measurement.',
      },
      {
        q: 'How long does the Innermind assessment take compared to BigFiveTest.com?',
        a: 'BigFiveTest.com\'s assessment takes roughly 5–10 minutes. Innermind\'s adaptive assessment takes 15–25 minutes, reflecting the additional frameworks (attachment, values) and the adaptive question logic. The additional time produces a significantly more comprehensive profile.',
      },
      {
        q: 'Can I use BigFiveTest.com to prepare for Innermind?',
        a: 'You can, though it\'s not necessary. If you\'re curious about your Big Five scores before committing to a longer assessment, BigFiveTest.com is a reasonable way to get a preview. Your Innermind results will be more precise due to the adaptive methodology, but the overall trait profile should be broadly consistent.',
      },
    ],
  },

  'innermind-vs-personalitydb': {
    slug: 'innermind-vs-personalitydb',
    competitor: 'PersonalityDatabase (PDB)',
    tagline: 'vs PersonalityDatabase',
    metaTitle: 'Innermind vs PersonalityDatabase: Personal Assessment vs Collective Typing',
    metaDescription:
      'Compare Innermind and PersonalityDatabase (PDB) — individual scientific assessment vs community-driven celebrity typing. Find out which serves your self-knowledge goals.',
    intro: `PersonalityDatabase (PDB) is a community platform where users collaboratively type celebrities, fictional characters, and public figures using MBTI, Enneagram, and other frameworks. It's an enormous database — millions of profiles, a passionate community, and extensive content around personality type theory. It's also not really an assessment tool for individuals.

This comparison is slightly different from the others on this page, because Innermind and PDB serve genuinely different purposes. But many people encounter PDB when exploring personality psychology, and understanding what it offers (and what it doesn't) is useful context for deciding what tools you actually need.`,
    inDepth: [
      `**What PDB is.** PersonalityDatabase is a community wiki for typing public figures. If you want to see what MBTI type the community has assigned to Elon Musk, Toni Morrison, or Sherlock Holmes, PDB is the resource. It's genuinely entertaining and fosters deep engagement with personality type theory. The debates are spirited, the community is knowledgeable about the frameworks, and there's a lot of content to explore.

The individual assessment component is secondary — PDB has a test, but it's not the primary draw. Most users come for the celebrity profiles and community discussion.`,
      `**The projection problem.** Community-voted typing of public figures introduces a significant epistemological issue: you're inferring someone's personality from curated public behavior, media appearances, and secondhand accounts. This can be genuinely interesting as an intellectual exercise — noticing patterns, debating whether someone's public persona reflects their actual type — but it tells you very little about your own psychology.

More subtly, there's research showing that people project their preferred types onto admired figures. The MBTI types most voted for characters people admire skew toward "rare and special" types (INTJ, INFJ) in ways that are statistically implausible if the community were neutrally assessing trait distributions.`,
      `**Self-knowledge requires self-assessment.** The most important thing Innermind offers that PDB doesn't is a direct, adaptive assessment of your own psychology. You can spend hours on PDB learning the theory of introverted intuition and getting a granular sense of the MBTI framework — and that knowledge has value. But it doesn't tell you where you actually fall on the Big Five, what your attachment patterns are, or how your values cluster.

Innermind's adaptive assessment gathers data from your actual responses to behavioral and situational questions, then synthesizes that data into a profile that reflects your real psychological profile rather than a type category you've self-selected based on which descriptions resonated. These are fundamentally different processes.`,
      `**Framework considerations.** PDB primarily uses MBTI and Enneagram — both of which have weaker scientific validation than the Big Five. The MBTI has poor test-retest reliability (as discussed in the 16Personalities comparison above). The Enneagram has a devoted following but limited peer-reviewed validation. Innermind's frameworks — Big Five, attachment theory, and Schwartz values — are the current scientific standards in personality research.`,
    ],
    tableRows: [
      { feature: 'Individual self-assessment', innermind: 'Yes — adaptive questionnaire', competitor: 'Secondary — community typing primary', innermindWins: true },
      { feature: 'Personality framework', innermind: 'Big Five + Attachment + Values', competitor: 'MBTI, Enneagram (community voting)', innermindWins: true },
      { feature: 'Scientific validation', innermind: 'Yes', competitor: 'Limited — frameworks less validated', innermindWins: true },
      { feature: 'AI-synthesized profile', innermind: 'Yes', competitor: 'No', innermindWins: true },
      { feature: 'Celebrity/character typing database', innermind: 'No', competitor: 'Millions of profiles', innermindWins: false },
      { feature: 'Community and discussion', innermind: 'Growing', competitor: 'Very large, active community', innermindWins: false },
      { feature: 'Learning personality theory', innermind: 'Through personal results', competitor: 'Extensive community content', innermindWins: false },
      { feature: 'Privacy — no data shared publicly', innermind: 'Yes', competitor: 'Community profiles are public', innermindWins: true },
    ],
    verdict: `PersonalityDatabase is excellent for learning personality type theory, following celebrity typing debates, and engaging with a passionate community. Innermind is for people who want to actually understand their own psychology through a scientifically validated assessment. The two can coexist: PDB is where you learn the frameworks, Innermind is where you apply them to yourself.`,
    faq: [
      {
        q: 'Is PersonalityDatabase accurate for typing celebrities?',
        a: 'It\'s a useful aggregation of community opinion, but accuracy varies. Typing from public behavior is inherently limited — you only see the persona, not the psychology. The most controversial typings (public figures who act inconsistently) illustrate the limits of the method.',
      },
      {
        q: 'Can PDB help me understand my own personality type?',
        a: 'Indirectly — reading about types and comparing yourself to examples can help you identify patterns. But there\'s no substitute for taking a validated assessment that measures your actual trait scores rather than asking you to self-select a type based on descriptions.',
      },
      {
        q: 'Why does Innermind use Big Five instead of MBTI or Enneagram?',
        a: 'The Big Five is the dominant model in academic personality psychology because it has the strongest empirical support: high test-retest reliability, cross-cultural replication, and demonstrated predictive validity for real-world outcomes. MBTI and Enneagram are more popular in casual contexts but have weaker scientific foundations.',
      },
    ],
  },
}

const compareSlugs = Object.keys(comparisons)

interface QuizLink {
  name: string
  slug: string
  tagline: string
}

const compareQuizLinks: Record<string, QuizLink[]> = {
  'innermind-vs-16personalities': [
    { name: 'Free 16 Types Test', slug: '16-types', tagline: 'Find your MBTI-style type — INTJ, ENFP, INFJ, and 13 more' },
    { name: 'Free Big Five Test', slug: 'big-five', tagline: 'The scientifically validated alternative to MBTI' },
  ],
  'innermind-vs-crystal-knows': [
    { name: 'Free Big Five Test', slug: 'big-five', tagline: 'Self-assessment: the gold standard of personality science' },
    { name: 'Free DISC Test', slug: 'disc', tagline: 'Behavioral style — Dominance, Influence, Steadiness, Compliance' },
  ],
  'innermind-vs-truity': [
    { name: 'Free Big Five Test', slug: 'big-five', tagline: 'The scientifically validated OCEAN model' },
    { name: 'Free Enneagram Test', slug: 'enneagram', tagline: 'Core motivations and growth direction' },
    { name: 'Free 16 Types Test', slug: '16-types', tagline: 'Cognitive function stack and type preferences' },
  ],
  'innermind-vs-human-design': [
    { name: 'Free Big Five Test', slug: 'big-five', tagline: 'Peer-reviewed personality science — not astrology' },
    { name: 'Free Enneagram Test', slug: 'enneagram', tagline: 'Motivations and growth path backed by research' },
  ],
  'innermind-vs-humandesign': [
    { name: 'Free Big Five Test', slug: 'big-five', tagline: 'Peer-reviewed personality science — not astrology' },
    { name: 'Free Enneagram Test', slug: 'enneagram', tagline: 'Motivations and growth path backed by research' },
  ],
  'innermind-vs-enneagraminstitute': [
    { name: 'Free Enneagram Test', slug: 'enneagram', tagline: 'Discover your type, wing, and growth path — free' },
    { name: 'Free Big Five Test', slug: 'big-five', tagline: 'How your Enneagram type connects to OCEAN traits' },
  ],
  'innermind-vs-bigfivetest': [
    { name: 'Free Big Five Test', slug: 'big-five', tagline: 'Take the OCEAN model test — instant results' },
    { name: 'Free Enneagram Test', slug: 'enneagram', tagline: 'Go deeper: motivations behind your Big Five scores' },
  ],
  'innermind-vs-personalitydb': [
    { name: 'Free 16 Types Test', slug: '16-types', tagline: 'Find your type with a scored adaptive quiz' },
    { name: 'Free Big Five Test', slug: 'big-five', tagline: 'The science-backed foundation beneath 16 types' },
  ],
}

export function generateStaticParams() {
  return compareSlugs.map((slug) => ({ slug }))
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const data = comparisons[params.slug]
  if (!data) return {}

  return {
    title: data.metaTitle,
    description: data.metaDescription,
    keywords: [
      `innermind vs ${data.competitor.toLowerCase()}`,
      'personality test comparison',
      'best personality test',
      'personality assessment review',
      'innermind review',
    ],
    openGraph: {
      title: data.metaTitle,
      description: data.metaDescription,
    },
    alternates: {
      canonical: `/compare/${data.slug}`,
    },
  }
}

export default function CompareSlugPage({ params }: { params: { slug: string } }) {
  const data = comparisons[params.slug]
  if (!data) notFound()

  const webPageSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: data.metaTitle,
    description: data.metaDescription,
    url: `https://innermind.app/compare/${data.slug}`,
    breadcrumb: {
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://innermind.app' },
        { '@type': 'ListItem', position: 2, name: 'Compare', item: 'https://innermind.app/compare' },
        { '@type': 'ListItem', position: 3, name: `Innermind vs ${data.competitor}`, item: `https://innermind.app/compare/${data.slug}` },
      ],
    },
    publisher: { '@type': 'Organization', name: 'Innermind', url: 'https://innermind.app' },
  }

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: data.faq.map((item) => ({
      '@type': 'Question',
      name: item.q,
      acceptedAnswer: { '@type': 'Answer', text: item.a },
    })),
  }

  return (
    <div className="mx-auto max-w-3xl px-6 py-16">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(webPageSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      {/* Breadcrumb */}
      <nav className="mb-8 flex items-center gap-2 text-xs text-stone-500">
        <Link href="/" className="hover:text-stone-300">Home</Link>
        <span>/</span>
        <Link href="/compare" className="hover:text-stone-300">Compare</Link>
        <span>/</span>
        <span className="text-stone-400">Innermind {data.tagline}</span>
      </nav>

      {/* Header */}
      <header className="mb-10">
        <div className="mb-4 flex items-center gap-3">
          <span className="rounded-full bg-amber-500/10 px-3 py-1 text-xs font-medium text-amber-400 ring-1 ring-amber-500/20">
            In-depth comparison
          </span>
        </div>
        <h1 className="font-serif text-3xl leading-tight text-stone-100 sm:text-4xl">
          Innermind vs {data.competitor}: Which Is More Accurate?
        </h1>
        <p className="mt-4 text-lg leading-relaxed text-stone-400">{data.intro}</p>
      </header>

      {/* In-depth analysis */}
      <section className="mb-12 space-y-6">
        {data.inDepth.map((paragraph, i) => (
          <div key={i} className="leading-relaxed text-stone-300">
            {paragraph.split('\n\n').map((block, j) => {
              if (block.startsWith('**') && block.includes('.**')) {
                const boldEnd = block.indexOf('.**') + 3
                const boldText = block.slice(2, boldEnd - 3)
                const rest = block.slice(boldEnd)
                return (
                  <p key={j} className="mb-4">
                    <strong className="font-semibold text-stone-100">{boldText}.</strong>
                    {rest}
                  </p>
                )
              }
              return <p key={j} className="mb-4">{block}</p>
            })}
          </div>
        ))}
      </section>

      {/* Comparison table */}
      <section className="mb-12">
        <h2 className="mb-5 font-serif text-2xl text-stone-100">Feature comparison</h2>
        <div className="overflow-hidden rounded-2xl border border-stone-800">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-stone-800 bg-stone-900">
                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-stone-500">Feature</th>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-amber-500">Innermind</th>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-stone-500">{data.competitor}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-800/60">
              {data.tableRows.map((row, i) => (
                <tr key={i} className={row.innermindWins ? 'bg-amber-500/3' : ''}>
                  <td className="px-4 py-3 text-stone-400">{row.feature}</td>
                  <td className="px-4 py-3">
                    <span className={`flex items-center gap-1.5 ${row.innermindWins ? 'text-amber-300' : 'text-stone-400'}`}>
                      {row.innermindWins && <span className="text-amber-500">✦</span>}
                      {row.innermind}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-stone-500">{row.competitor}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Verdict */}
      <section className="mb-12 rounded-2xl border border-stone-700 bg-stone-900/60 p-6">
        <h2 className="mb-3 font-serif text-xl text-stone-100">Bottom line</h2>
        <p className="leading-relaxed text-stone-300">{data.verdict}</p>
      </section>

      {/* FAQ */}
      <section className="mb-12">
        <h2 className="mb-5 font-serif text-2xl text-stone-100">Frequently asked questions</h2>
        <div className="space-y-5">
          {data.faq.map((item, i) => (
            <div key={i} className="rounded-xl border border-stone-800 bg-stone-900/30 p-5">
              <h3 className="mb-2 font-medium text-stone-200">{item.q}</h3>
              <p className="leading-relaxed text-stone-400">{item.a}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <div className="rounded-2xl border border-amber-500/20 bg-amber-500/5 p-8 text-center">
        <div className="mb-3 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-amber-500/10 ring-1 ring-amber-500/20">
          <span className="text-xl">✦</span>
        </div>
        <h2 className="mb-2 font-serif text-2xl text-stone-100">Try Innermind free</h2>
        <p className="mb-6 text-stone-400">
          Take the adaptive assessment and get your AI-synthesized psychological profile in under 30 minutes.
          No signup required to start.
        </p>
        <Link
          href="/"
          className="inline-block rounded-xl bg-amber-500 px-8 py-3 text-sm font-semibold text-stone-950 transition-colors hover:bg-amber-400"
        >
          Try Innermind free →
        </Link>
        <p className="mt-3 text-xs text-stone-600">Free forever · No credit card required</p>
      </div>

      {/* Try the tools */}
      {compareQuizLinks[params.slug] && (
        <section className="mt-12 rounded-2xl border border-stone-800 bg-stone-900/30 p-6">
          <h2 className="mb-1 font-serif text-lg text-stone-100">Try these free tests</h2>
          <p className="mb-4 text-sm text-stone-500">See for yourself — no signup required.</p>
          <div className="flex flex-col gap-3 sm:flex-row">
            {compareQuizLinks[params.slug]!.map((q) => (
              <Link
                key={q.slug}
                href={`/quiz/${q.slug}`}
                className="flex-1 rounded-xl border border-stone-700 bg-stone-900/60 px-4 py-3 transition-colors hover:border-amber-500/40 hover:bg-stone-900"
              >
                <p className="text-sm font-semibold text-stone-100">{q.name}</p>
                <p className="mt-0.5 text-xs text-stone-500">{q.tagline}</p>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Other comparisons */}
      <nav className="mt-12 border-t border-stone-800 pt-8">
        <p className="mb-4 text-sm text-stone-500">More comparisons</p>
        <div className="flex flex-wrap gap-2">
          {compareSlugs
            .filter((s) => s !== params.slug)
            .map((s) => {
              const c = comparisons[s]!
              return (
                <Link
                  key={s}
                  href={`/compare/${s}`}
                  className="rounded-lg border border-stone-800 bg-stone-900/50 px-3 py-1.5 text-xs text-stone-400 transition-colors hover:border-stone-700 hover:text-stone-200"
                >
                  Innermind vs {c.competitor}
                </Link>
              )
            })}
        </div>
      </nav>
    </div>
  )
}
