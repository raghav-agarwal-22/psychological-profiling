import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'FAQ — Innermind',
  description:
    'Answers to the most common questions about Innermind — our psychological assessments, AI features, pricing, privacy practices, and professional plans.',
  alternates: { canonical: '/faq' },
  openGraph: {
    title: 'FAQ — Innermind',
    description:
      'Answers to the most common questions about Innermind — our psychological assessments, AI features, pricing, privacy practices, and professional plans.',
    url: 'https://innermindhealing.com/faq',
    siteName: 'Innermind',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'FAQ — Innermind',
    description:
      'Answers to the most common questions about Innermind — our psychological assessments, AI features, pricing, privacy, and professional plans.',
  },
}

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'What is Innermind?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Innermind is a psychological profiling platform that combines science-backed assessments — Big Five personality, Enneagram, Attachment Style, Jungian Archetypes, Values Inventory, and more — with AI-powered synthesis to create a deep, coherent portrait of who you are. Think of it as the most thoughtful self-understanding tool ever built.',
      },
    },
    {
      '@type': 'Question',
      name: 'How is Innermind different from 16Personalities or MBTI?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'MBTI and 16Personalities use a single typology system with limited scientific validation. Innermind draws on six peer-reviewed frameworks simultaneously and synthesizes them with AI to produce a nuanced, multi-dimensional portrait. We never reduce you to a four-letter type. Our assessments measure spectrums, not boxes.',
      },
    },
    {
      '@type': 'Question',
      name: 'Who is Innermind for?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Innermind is for anyone who wants to understand themselves more deeply — whether you are navigating a life transition, curious about your personality, working with a coach or therapist, or simply committed to personal growth. Professionals such as coaches, therapists, and HR teams also use Innermind to build richer understanding of clients and teams.',
      },
    },
    {
      '@type': 'Question',
      name: 'Is Innermind science-based?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes. Every assessment on Innermind is grounded in peer-reviewed psychological research: Big Five (Costa & McCrae, 1992), Schwartz Values Theory (1992), Attachment Theory (Bowlby & Ainsworth), Enneagram, Light/Dark Triad (Kaufman et al., 2019), and Jungian Archetypes. We do not invent frameworks — we implement validated ones and layer AI synthesis on top.',
      },
    },
    {
      '@type': 'Question',
      name: 'Which assessments are included?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Innermind includes six assessment frameworks: Big Five (OCEAN) personality, Enneagram (9 types), Attachment Style, Jungian Archetypes, Values Inventory (Schwartz theory), and Light & Dark Triad. The Big Five is available on the free tier; all six are available on Innermind Pro.',
      },
    },
    {
      '@type': 'Question',
      name: 'How long does each assessment take?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Each assessment takes roughly 10-20 minutes. Big Five: ~15 min. Enneagram: ~12 min. Attachment Style: ~10 min. Jungian Archetypes: ~15 min. Values Inventory: ~12 min. Light & Dark Triad: ~10 min. You can pause and resume any time — your answers are saved automatically.',
      },
    },
    {
      '@type': 'Question',
      name: 'What is the Big Five (OCEAN) personality model?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'The Big Five is the most empirically validated personality model in psychology. It measures five dimensions: Openness to experience, Conscientiousness, Extraversion, Agreeableness, and Neuroticism (emotional stability). Unlike typologies, the Big Five measures where you fall on each spectrum — giving a far more nuanced picture than a personality type.',
      },
    },
    {
      '@type': 'Question',
      name: 'What is the Enneagram?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: "The Enneagram is a nine-type personality system that describes core motivations, fears, and defense mechanisms. It is widely used in coaching and therapy to understand deep behavioral patterns. Innermind's Enneagram assessment identifies your primary type and wing, and integrates this with your Big Five results to deepen the overall profile.",
      },
    },
    {
      '@type': 'Question',
      name: 'What is Attachment Style?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Attachment theory, developed by Bowlby and Ainsworth, describes how early relational experiences shape the way we connect with others as adults. Innermind measures four attachment patterns — Secure, Anxious, Avoidant, and Fearful-Avoidant — and explains how your style influences your relationships, communication, and emotional responses.',
      },
    },
    {
      '@type': 'Question',
      name: 'What are Jungian Archetypes?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: "Jungian Archetypes are universal symbolic patterns from Carl Jung's analytical psychology — figures like the Hero, the Sage, the Caregiver, or the Explorer. Innermind identifies your dominant archetype constellation and shows how these patterns show up in your values, relationships, and life narrative.",
      },
    },
    {
      '@type': 'Question',
      name: 'What is the Values Inventory?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: "The Values Inventory is based on Shalom Schwartz's values theory — one of the most replicated frameworks in cross-cultural psychology. It measures ten universal value types (e.g., Benevolence, Achievement, Security, Universalism) and shows which values drive your decisions.",
      },
    },
    {
      '@type': 'Question',
      name: 'Can I retake assessments?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes. You can retake any assessment at any time. Innermind tracks your scores over time so you can observe how you change — particularly useful after major life events, transitions, or extended coaching or therapy work. Retakes are recommended quarterly for meaningful longitudinal tracking.',
      },
    },
    {
      '@type': 'Question',
      name: 'What is the AI portrait?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: "The AI portrait is a synthesized narrative of your psychological profile, generated by Anthropic's Claude AI. It integrates results from all your completed assessments into a single coherent story — describing your personality, core values, relational patterns, motivations, shadow tendencies, and growth edges.",
      },
    },
    {
      '@type': 'Question',
      name: 'What is the AI coach?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: "The AI coach is a conversational interface powered by Claude that has full context of your psychological profile. Unlike generic AI chatbots, every response is grounded in your specific traits, values, and attachment patterns. You can use it to explore difficult decisions, process emotions, or deepen your self-understanding. Unlimited AI coach access is included in Innermind Pro.",
      },
    },
    {
      '@type': 'Question',
      name: 'What is Adaptive Deep-Dive?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Adaptive Deep-Dive is an AI-led follow-up assessment that asks personalized questions based on your existing results. Rather than a fixed question bank, it probes areas of ambiguity or tension in your profile — helping surface insights that standard assessments miss. It is available on Innermind Pro.',
      },
    },
    {
      '@type': 'Question',
      name: 'Is my data used to train AI models?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: "No. Your psychological assessment data and profile content are never used to train AI models — not Innermind's systems and not Anthropic's. When your data is sent to Anthropic's Claude to generate your portrait or coaching responses, it is processed under a data processing agreement that explicitly prohibits using customer data for model training.",
      },
    },
    {
      '@type': 'Question',
      name: 'What is free and what requires Pro?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'The free tier includes the Big Five personality assessment, a basic psychological profile, a personal dashboard, and a public profile share link. Innermind Pro unlocks all six assessment frameworks, the full AI-synthesized portrait, AI coach (unlimited), Adaptive Deep-Dive, archetype breakdown, growth tracking, daily prompts, compatibility mapping, unlimited journaling, PDF export, and weekly digest emails.',
      },
    },
    {
      '@type': 'Question',
      name: 'How much does Innermind Pro cost?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Innermind Pro is $19/month on a monthly plan, or $144/year ($12/month) on an annual plan — saving you $84 per year. Both plans include a 7-day free trial. No charge until day 8.',
      },
    },
    {
      '@type': 'Question',
      name: 'Is there a free trial?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes. Innermind Pro comes with a 7-day free trial. You will not be charged until day 8. You can cancel at any time during the trial with no charge.',
      },
    },
    {
      '@type': 'Question',
      name: 'Can I cancel anytime?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes. There is no lock-in. You can cancel your Innermind Pro subscription at any time from the billing portal in your account settings. If you cancel, you retain access until the end of your current billing period.',
      },
    },
    {
      '@type': 'Question',
      name: 'What payment methods do you accept?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Innermind accepts all major credit and debit cards (Visa, Mastercard, Amex, Discover) as well as Apple Pay and Google Pay. Payments are processed securely by Stripe. We never store your card details on our servers.',
      },
    },
    {
      '@type': 'Question',
      name: 'What is your refund policy?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'If you are unsatisfied with Innermind Pro within the first 7 days after your trial ends, contact us at support@innermindhealing.com and we will issue a full refund. For annual plans, we offer a 14-day refund window from the first charge.',
      },
    },
    {
      '@type': 'Question',
      name: 'How is my data stored?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Your data is stored in an encrypted PostgreSQL database. All data is transmitted over TLS (HTTPS) and encrypted at rest. We use short-lived authentication tokens and do not store passwords. Access to production data is restricted to authorised personnel only.',
      },
    },
    {
      '@type': 'Question',
      name: 'Can I delete my account and data?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes. You can request full account deletion at any time by emailing privacy@innermindhealing.com. We will permanently delete all your personal data within 30 days.',
      },
    },
    {
      '@type': 'Question',
      name: 'Do you sell my data?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'No. We do not sell your personal data. We do not use your psychological profile data for advertising. We do not share individual-level data with employers, insurers, or any third party for commercial purposes.',
      },
    },
    {
      '@type': 'Question',
      name: 'Is Innermind GDPR compliant?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes. Innermind complies with GDPR. You have full rights to access, rectify, delete, and export your data. All third-party sub-processors are bound by data processing agreements consistent with GDPR requirements.',
      },
    },
    {
      '@type': 'Question',
      name: 'Can therapists and coaches use Innermind with clients?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes — Innermind was built with practitioners in mind. Coaches and therapists can create a professional workspace, send clients a unique invite link, and once clients complete their assessments and share access, practitioners can review the full psychological portrait and growth trends.',
      },
    },
    {
      '@type': 'Question',
      name: 'What is Pro Business?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: "Pro Business is Innermind's plan for solo coaches and therapists. At $99/month, it includes 10 client seats, a client assessment dashboard, PDF report downloads, private practitioner notes, shared profile access, and growth tracking with retakes.",
      },
    },
    {
      '@type': 'Question',
      name: 'Do you offer team plans?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes. The Team plan at $299/month includes 50 client seats and everything in Pro Business, plus team cohort analytics — aggregate Big Five charts, shared values and attachment distributions, and group-level insight summaries.',
      },
    },
  ],
}

type FaqSection = {
  id: string
  icon: string
  title: string
  items: Array<{
    q: string
    a: React.ReactNode
  }>
}

const FAQ_SECTIONS: FaqSection[] = [
  {
    id: 'general',
    icon: '◎',
    title: 'General',
    items: [
      {
        q: 'What is Innermind?',
        a: (
          <>
            Innermind is a psychological profiling platform that combines science-backed assessments
            — Big Five personality, Enneagram, Attachment Style, Jungian Archetypes, Values
            Inventory, and more — with AI-powered synthesis to create a deep, coherent portrait of
            who you are. Think of it as the most thoughtful self-understanding tool ever built.
          </>
        ),
      },
      {
        q: 'How is Innermind different from 16Personalities or MBTI?',
        a: (
          <>
            MBTI and 16Personalities use a single typology system with limited scientific
            validation. Innermind draws on six peer-reviewed frameworks simultaneously and
            synthesizes them with AI to produce a nuanced, multi-dimensional portrait. We never
            reduce you to a four-letter type. Our assessments measure spectrums, not boxes.
          </>
        ),
      },
      {
        q: 'Who is Innermind for?',
        a: (
          <>
            Innermind is for anyone who wants to understand themselves more deeply — whether you
            are navigating a life transition, curious about your personality, working with a coach
            or therapist, or simply committed to personal growth. Professionals such as coaches,
            therapists, and HR teams also use Innermind to build richer understanding of clients
            and teams.
          </>
        ),
      },
      {
        q: 'Is Innermind science-based?',
        a: (
          <>
            Yes. Every assessment on Innermind is grounded in peer-reviewed psychological research:
            Big Five (Costa &amp; McCrae, 1992), Schwartz Values Theory (1992), Attachment Theory
            (Bowlby &amp; Ainsworth), Enneagram, Light/Dark Triad (Kaufman et al., 2019), and
            Jungian Archetypes. We do not invent frameworks — we implement validated ones and layer
            AI synthesis on top.
          </>
        ),
      },
    ],
  },
  {
    id: 'assessments',
    icon: '◈',
    title: 'Assessments',
    items: [
      {
        q: 'Which assessments are included?',
        a: (
          <>
            Innermind includes six assessment frameworks:{' '}
            <strong className="font-semibold text-stone-300">Big Five (OCEAN)</strong> personality,{' '}
            <strong className="font-semibold text-stone-300">Enneagram</strong> (9 types),{' '}
            <strong className="font-semibold text-stone-300">Attachment Style</strong>,{' '}
            <strong className="font-semibold text-stone-300">Jungian Archetypes</strong>,{' '}
            <strong className="font-semibold text-stone-300">Values Inventory</strong> (Schwartz
            theory), and{' '}
            <strong className="font-semibold text-stone-300">Light &amp; Dark Triad</strong>. The
            Big Five is available on the free tier; all six unlock with{' '}
            <Link
              href="/upgrade"
              className="text-amber-400 underline underline-offset-2 hover:text-amber-300"
            >
              Innermind Pro
            </Link>
            .
          </>
        ),
      },
      {
        q: 'How long does each assessment take?',
        a: (
          <>
            Each assessment takes roughly 10–20 minutes. Big Five: ~15 min &nbsp;·&nbsp; Enneagram:
            ~12 min &nbsp;·&nbsp; Attachment Style: ~10 min &nbsp;·&nbsp; Jungian Archetypes:
            ~15 min &nbsp;·&nbsp; Values Inventory: ~12 min &nbsp;·&nbsp; Light &amp; Dark Triad:
            ~10 min. You can pause and resume at any time — your answers are saved automatically.
          </>
        ),
      },
      {
        q: 'What is the Big Five (OCEAN) personality model?',
        a: (
          <>
            The Big Five is the most empirically validated personality model in psychology. It
            measures five dimensions:{' '}
            <strong className="font-semibold text-stone-300">O</strong>penness to experience,{' '}
            <strong className="font-semibold text-stone-300">C</strong>onscientiousness,{' '}
            <strong className="font-semibold text-stone-300">E</strong>xtraversion,{' '}
            <strong className="font-semibold text-stone-300">A</strong>greeableness, and{' '}
            <strong className="font-semibold text-stone-300">N</strong>euroticism (emotional
            stability). Unlike typologies, the Big Five measures where you fall on each spectrum
            — giving a far more nuanced picture than a personality &ldquo;type.&rdquo;
          </>
        ),
      },
      {
        q: 'What is the Enneagram?',
        a: (
          <>
            The Enneagram is a nine-type personality system that describes core motivations, fears,
            and defense mechanisms. It is widely used in coaching and therapy to understand deep
            behavioral patterns. Innermind&apos;s Enneagram assessment identifies your primary type
            and wing, and integrates this with your Big Five results to deepen the overall portrait.
          </>
        ),
      },
      {
        q: 'What is Attachment Style?',
        a: (
          <>
            Attachment theory, developed by Bowlby and Ainsworth, describes how early relational
            experiences shape the way we connect with others as adults. Innermind measures four
            patterns —{' '}
            <strong className="font-semibold text-stone-300">Secure</strong>,{' '}
            <strong className="font-semibold text-stone-300">Anxious</strong>,{' '}
            <strong className="font-semibold text-stone-300">Avoidant</strong>, and{' '}
            <strong className="font-semibold text-stone-300">Fearful-Avoidant</strong> — and
            explains how your style influences your relationships, communication, and emotional
            responses.
          </>
        ),
      },
      {
        q: 'What are Jungian Archetypes?',
        a: (
          <>
            Jungian Archetypes are universal symbolic patterns from Carl Jung&apos;s analytical
            psychology — figures like the Hero, the Sage, the Caregiver, or the Explorer. Innermind
            identifies your dominant archetype constellation and shows how these patterns show up in
            your values, relationships, and life narrative. Explore the{' '}
            <Link
              href="/archetypes"
              className="text-amber-400 underline underline-offset-2 hover:text-amber-300"
            >
              archetype library
            </Link>{' '}
            to learn more.
          </>
        ),
      },
      {
        q: 'What is the Values Inventory?',
        a: (
          <>
            The Values Inventory is based on Shalom Schwartz&apos;s values theory — one of the
            most replicated frameworks in cross-cultural psychology. It measures ten universal
            value types (e.g., Benevolence, Achievement, Security, Universalism) and shows which
            values drive your decisions. Understanding your value hierarchy often explains career
            choices, relationship dynamics, and areas of inner conflict.
          </>
        ),
      },
      {
        q: 'Can I retake assessments?',
        a: (
          <>
            Yes. You can retake any assessment at any time. Innermind tracks your scores over time
            so you can observe how you change — particularly useful after major life events,
            transitions, or extended coaching or therapy work. Retakes are recommended quarterly
            for meaningful longitudinal tracking.
          </>
        ),
      },
    ],
  },
  {
    id: 'ai-features',
    icon: '◉',
    title: 'AI Features',
    items: [
      {
        q: 'What is the AI portrait?',
        a: (
          <>
            The AI portrait is a synthesized narrative of your psychological profile, generated by
            Anthropic&apos;s Claude AI. It integrates results from all your completed assessments
            into a single coherent story — describing your personality, core values, relational
            patterns, motivations, shadow tendencies, and growth edges. It is written in plain
            language and designed to feel like a thoughtful letter from a wise observer who has
            studied you carefully.
          </>
        ),
      },
      {
        q: 'What is the AI coach?',
        a: (
          <>
            The AI coach is a conversational interface powered by Claude that has full context of
            your psychological profile. Unlike generic AI chatbots, every response is grounded in
            your specific traits, values, and attachment patterns. Use it to explore difficult
            decisions, process emotions, prepare for hard conversations, or deepen your
            self-understanding. Unlimited AI coach access is included in{' '}
            <Link
              href="/upgrade"
              className="text-amber-400 underline underline-offset-2 hover:text-amber-300"
            >
              Innermind Pro
            </Link>
            .
          </>
        ),
      },
      {
        q: 'What is Adaptive Deep-Dive?',
        a: (
          <>
            Adaptive Deep-Dive is an AI-led follow-up assessment that asks personalized questions
            based on your existing results. Rather than a fixed question bank, it probes areas of
            ambiguity or tension in your profile — helping surface insights that standard
            assessments miss. Available on{' '}
            <Link
              href="/upgrade"
              className="text-amber-400 underline underline-offset-2 hover:text-amber-300"
            >
              Innermind Pro
            </Link>
            .
          </>
        ),
      },
      {
        q: 'Is my data used to train AI models?',
        a: (
          <>
            No. Your psychological assessment data and profile content are never used to train AI
            models — not Innermind&apos;s systems and not Anthropic&apos;s. When your data is sent
            to Anthropic&apos;s Claude to generate your portrait or coaching responses, it is
            processed under a data processing agreement that explicitly prohibits using customer
            data for model training. See our{' '}
            <Link
              href="/privacy"
              className="text-amber-400 underline underline-offset-2 hover:text-amber-300"
            >
              Privacy Policy
            </Link>{' '}
            for full details.
          </>
        ),
      },
    ],
  },
  {
    id: 'pricing',
    icon: '◇',
    title: 'Pricing & Billing',
    items: [
      {
        q: 'What is free and what requires Pro?',
        a: (
          <>
            The <strong className="font-semibold text-stone-300">free tier</strong> includes the
            Big Five personality assessment, a basic psychological profile, a personal dashboard,
            and a public profile share link.{' '}
            <strong className="font-semibold text-stone-300">Innermind Pro</strong> unlocks all six
            assessment frameworks, the full AI-synthesized portrait, AI coach (unlimited), Adaptive
            Deep-Dive, Jungian Archetypes breakdown, growth tracking, daily prompts, compatibility
            mapping, unlimited journaling, PDF export, and weekly digest emails.{' '}
            <Link
              href="/upgrade"
              className="text-amber-400 underline underline-offset-2 hover:text-amber-300"
            >
              See full comparison
            </Link>
            .
          </>
        ),
      },
      {
        q: 'How much does Innermind Pro cost?',
        a: (
          <>
            Innermind Pro is{' '}
            <strong className="font-semibold text-stone-300">$19/month</strong> on a monthly plan,
            or{' '}
            <strong className="font-semibold text-stone-300">$144/year ($12/month)</strong> on an
            annual plan — saving you $84 per year. Both plans include a 7-day free trial. No charge
            until day 8.
          </>
        ),
      },
      {
        q: 'Is there a free trial?',
        a: (
          <>
            Yes. Innermind Pro includes a{' '}
            <strong className="font-semibold text-stone-300">7-day free trial</strong>. You will
            not be charged until day 8. You can cancel at any time during the trial at no cost.{' '}
            <Link
              href="/upgrade"
              className="text-amber-400 underline underline-offset-2 hover:text-amber-300"
            >
              Start your free trial
            </Link>
            .
          </>
        ),
      },
      {
        q: 'Can I cancel anytime?',
        a: (
          <>
            Yes. There is no lock-in. Cancel your subscription at any time from the billing portal
            in your account settings. If you cancel, you retain access until the end of your
            current billing period. Your profile and assessment data are preserved even after
            cancellation.
          </>
        ),
      },
      {
        q: 'What payment methods do you accept?',
        a: (
          <>
            Innermind accepts all major credit and debit cards (Visa, Mastercard, Amex, Discover)
            as well as Apple Pay and Google Pay. Payments are processed securely by Stripe. We
            never store your card details on our servers.
          </>
        ),
      },
      {
        q: 'What is your refund policy?',
        a: (
          <>
            If you are unsatisfied with Innermind Pro within the first 7 days after your trial ends
            (i.e., within 7 days of your first charge), contact us at{' '}
            <a
              href="mailto:support@innermindhealing.com"
              className="text-amber-400 underline underline-offset-2 hover:text-amber-300"
            >
              support@innermindhealing.com
            </a>{' '}
            and we will issue a full refund. For annual plans, we offer a 14-day refund window from
            the date of the first charge.
          </>
        ),
      },
    ],
  },
  {
    id: 'privacy',
    icon: '⬡',
    title: 'Privacy & Security',
    items: [
      {
        q: 'How is my data stored?',
        a: (
          <>
            Your data is stored in an encrypted PostgreSQL database. All data is transmitted over
            TLS (HTTPS) and encrypted at rest. Innermind uses passwordless (magic-link)
            authentication — we never store passwords. We use short-lived tokens for sessions.
            Access to production data is restricted to authorised personnel only. In the event of
            a breach, we will notify affected users within 72 hours as required by GDPR.
          </>
        ),
      },
      {
        q: 'Can I delete my account and data?',
        a: (
          <>
            Yes. You can request full account deletion at any time by emailing{' '}
            <a
              href="mailto:privacy@innermindhealing.com"
              className="text-amber-400 underline underline-offset-2 hover:text-amber-300"
            >
              privacy@innermindhealing.com
            </a>
            . We will permanently delete all your personal data — assessment responses, profiles,
            journal entries, and account information — within 30 days. Billing records are retained
            for 7 years as required by tax law, but disconnected from your profile data.
          </>
        ),
      },
      {
        q: 'Do you sell my data?',
        a: (
          <>
            No. We do not sell your personal data. We do not use your psychological profile data
            for advertising. We do not share individual-level data with employers, insurers, or any
            third party for commercial purposes. Your inner life is yours. Read our{' '}
            <Link
              href="/privacy"
              className="text-amber-400 underline underline-offset-2 hover:text-amber-300"
            >
              Privacy Policy
            </Link>{' '}
            for the full picture.
          </>
        ),
      },
      {
        q: 'Is Innermind GDPR compliant?',
        a: (
          <>
            Yes. Innermind complies with the General Data Protection Regulation (GDPR). You have
            full rights to access, rectify, delete, and export your data. All third-party
            sub-processors (Anthropic, Stripe, Resend, PostHog) are bound by data processing
            agreements consistent with GDPR requirements. To exercise your rights, email{' '}
            <a
              href="mailto:privacy@innermindhealing.com"
              className="text-amber-400 underline underline-offset-2 hover:text-amber-300"
            >
              privacy@innermindhealing.com
            </a>
            .
          </>
        ),
      },
    ],
  },
  {
    id: 'professionals',
    icon: '▷',
    title: 'For Professionals',
    items: [
      {
        q: 'Can therapists and coaches use Innermind with their clients?',
        a: (
          <>
            Yes — Innermind was built with practitioners in mind. Coaches and therapists can create
            a professional workspace, send clients a unique invite link, and once clients complete
            their assessments and grant access, practitioners can review the full psychological
            portrait, raw scores, and growth trends before the first session. This typically
            eliminates two full intake sessions. Learn more on our{' '}
            <Link
              href="/for-professionals"
              className="text-amber-400 underline underline-offset-2 hover:text-amber-300"
            >
              For Professionals
            </Link>{' '}
            page.
          </>
        ),
      },
      {
        q: 'What is Pro Business?',
        a: (
          <>
            Pro Business is Innermind&apos;s plan for solo coaches and therapists. At{' '}
            <strong className="font-semibold text-stone-300">$99/month</strong>, it includes 10
            client seats, a client assessment dashboard, PDF report downloads, private practitioner
            notes, shared profile access, and growth tracking with retakes. It is designed to
            replace your current intake process and give you richer starting data than any
            assessment tool you have used before.{' '}
            <Link
              href="/professional"
              className="text-amber-400 underline underline-offset-2 hover:text-amber-300"
            >
              Set up your workspace
            </Link>
            .
          </>
        ),
      },
      {
        q: 'Do you offer team plans?',
        a: (
          <>
            Yes. The{' '}
            <strong className="font-semibold text-stone-300">Team plan</strong> at $299/month
            includes 50 client seats and everything in Pro Business, plus team cohort analytics
            — including an aggregate Big Five chart, shared values and attachment distributions,
            and group-level insight summaries. Ideal for group practices, HR teams, organizational
            development consultants, and leadership programs. For custom plans, email{' '}
            <a
              href="mailto:professionals@innermindhealing.com"
              className="text-amber-400 underline underline-offset-2 hover:text-amber-300"
            >
              professionals@innermindhealing.com
            </a>
            .
          </>
        ),
      },
    ],
  },
]

export default function FaqPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      <div className="mx-auto max-w-3xl px-6 py-16">
        {/* Hero */}
        <div className="mb-14 text-center">
          <div className="mb-6 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-amber-500/10 ring-1 ring-amber-500/20">
            <span className="text-3xl text-amber-400">◎</span>
          </div>
          <h1 className="font-serif text-4xl text-stone-100">Frequently asked questions</h1>
          <p className="mt-4 text-lg leading-relaxed text-stone-400">
            Everything you need to know about Innermind.
          </p>
        </div>

        {/* Section jump links */}
        <nav className="mb-12 flex flex-wrap gap-2" aria-label="FAQ sections">
          {FAQ_SECTIONS.map((section) => (
            <a
              key={section.id}
              href={`#${section.id}`}
              className="inline-flex items-center gap-1.5 rounded-full border border-stone-800 bg-stone-900/50 px-3.5 py-1.5 text-xs font-medium text-stone-400 transition-colors hover:border-stone-700 hover:text-stone-200"
            >
              <span className="text-amber-500">{section.icon}</span>
              {section.title}
            </a>
          ))}
        </nav>

        {/* FAQ Sections */}
        <div className="space-y-12">
          {FAQ_SECTIONS.map((section) => (
            <section key={section.id} id={section.id}>
              {/* Section header */}
              <div className="mb-5 flex items-center gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-stone-900 text-base text-amber-500 ring-1 ring-stone-800">
                  {section.icon}
                </div>
                <h2 className="font-serif text-2xl text-stone-200">{section.title}</h2>
              </div>

              {/* Accordion card */}
              <div className="rounded-2xl border border-stone-800 bg-stone-900/50">
                {section.items.map((item, idx) => (
                  <details
                    key={item.q}
                    className={
                      idx < section.items.length - 1 ? 'border-b border-stone-800/80' : ''
                    }
                  >
                    <summary className="flex cursor-pointer select-none list-none items-center justify-between gap-4 px-6 py-4 [&::-webkit-details-marker]:hidden">
                      <span className="text-sm font-semibold text-stone-200 transition-colors group-open:text-stone-100">
                        {item.q}
                      </span>
                      <svg
                        width="14"
                        height="14"
                        viewBox="0 0 14 14"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        aria-hidden="true"
                        className="shrink-0 text-stone-500 transition-transform duration-200 [[open]_&]:rotate-180"
                      >
                        <path
                          d="M2.5 5L7 9.5L11.5 5"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </summary>
                    <div className="px-6 pb-5 text-sm leading-relaxed text-stone-400">
                      {item.a}
                    </div>
                  </details>
                ))}
              </div>
            </section>
          ))}
        </div>

        {/* Still have questions */}
        <div className="mt-14 rounded-2xl border border-stone-800 bg-stone-900/50 p-8 text-center">
          <p className="mb-2 font-serif text-xl text-stone-200">Still have a question?</p>
          <p className="mb-6 text-sm leading-relaxed text-stone-400">
            Our team reads every message. Reach us at{' '}
            <a
              href="mailto:hello@innermindhealing.com"
              className="text-amber-400 underline underline-offset-2 hover:text-amber-300"
            >
              hello@innermindhealing.com
            </a>{' '}
            and we will get back to you within one business day.
          </p>
          <a
            href="mailto:hello@innermindhealing.com"
            className="inline-flex items-center justify-center rounded-xl border border-stone-700 px-6 py-2.5 text-sm font-semibold text-stone-300 transition-colors hover:border-stone-500 hover:text-stone-100"
          >
            Email us
          </a>
        </div>

        {/* CTA */}
        <div className="mt-8 rounded-2xl border border-amber-500/20 bg-amber-500/5 p-8 text-center">
          <p className="mb-2 font-serif text-xl text-stone-200">Ready to know yourself?</p>
          <p className="mb-6 text-sm leading-relaxed text-stone-400">
            Take your first assessment free — no credit card required.
          </p>
          <div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <Link
              href="/assessment"
              className="inline-flex items-center justify-center rounded-xl bg-amber-500 px-8 py-3 text-sm font-semibold text-stone-950 transition-colors hover:bg-amber-400"
            >
              Start your assessment
            </Link>
            <Link
              href="/upgrade"
              className="inline-flex items-center justify-center rounded-xl border border-amber-500/30 px-8 py-3 text-sm font-semibold text-amber-400 transition-colors hover:border-amber-400 hover:text-amber-300"
            >
              View Pro plans
            </Link>
          </div>
        </div>
      </div>
    </>
  )
}
