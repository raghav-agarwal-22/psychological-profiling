import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Psychological Assessments',
  description:
    'Take science-backed psychological assessments — Big Five personality, Schwartz values, attachment style, Enneagram, and more. Get an AI-synthesized profile of your inner world.',
  openGraph: {
    title: 'Psychological Assessments | Innermind',
    description:
      'Science-backed assessments across 6 validated frameworks. Take your first assessment free.',
  },
}

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'ItemList',
  name: 'Psychological Assessments',
  description: 'Science-backed psychological assessments across 6 validated frameworks.',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Big Five Personality (OCEAN)', description: 'Explore the five fundamental dimensions of your personality.' },
    { '@type': 'ListItem', position: 2, name: 'Schwartz Values Inventory', description: 'Discover what truly motivates you across 9 universal value dimensions.' },
    { '@type': 'ListItem', position: 3, name: 'Attachment Style', description: 'Understand your relational blueprint and how you connect with others.' },
    { '@type': 'ListItem', position: 4, name: 'Enneagram', description: 'Discover your core Enneagram type and wing.' },
    { '@type': 'ListItem', position: 5, name: 'Light & Dark Triad', description: 'Explore where you fall on the prosocial-antagonistic personality spectrum.' },
  ],
}

export default function AssessmentLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {children}
    </>
  )
}
