import type { Metadata } from 'next'
import { PersonalityDatabaseClient } from './PersonalityDatabaseClient'
import { CHARACTERS } from './characters-data'

export const revalidate = 86400

export const metadata: Metadata = {
  title: 'Personality Database — Famous Characters & Celebrities | Innermind',
  description:
    'Browse personality types for 48 fictional characters and celebrities. Discover the MBTI type and Enneagram type of your favorite characters from movies, TV, books, music, and business.',
  keywords: [
    'character personality type',
    'celebrity mbti',
    'fictional character enneagram',
    'personality database',
    'mbti characters',
    'enneagram celebrities',
    'fictional character mbti',
    'celebrity personality type',
    'character enneagram',
    'personality types famous people',
  ],
  openGraph: {
    title: 'Personality Database — Famous Characters & Celebrities',
    description:
      'Browse MBTI and Enneagram types for 48 fictional characters and real-world celebrities. Movies, TV, books, music, and business icons.',
    url: 'https://innermind.app/personality-database',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Personality Database — Famous Characters & Celebrities',
    description:
      'Browse MBTI and Enneagram types for 48 fictional characters and celebrities.',
  },
  alternates: {
    canonical: 'https://innermind.app/personality-database',
  },
}

const itemListSchema = {
  '@context': 'https://schema.org',
  '@type': 'ItemList',
  name: 'Personality Database — Famous Characters & Celebrities',
  description:
    'MBTI and Enneagram personality types for 48 fictional characters and celebrities across movies, TV, books, music, and business.',
  url: 'https://innermind.app/personality-database',
  numberOfItems: CHARACTERS.length,
  itemListElement: CHARACTERS.map((c, i) => ({
    '@type': 'ListItem',
    position: i + 1,
    name: c.name,
    description: `${c.name} (${c.source}) — MBTI: ${c.mbti}, Enneagram: ${c.enneagram}. ${c.description}`,
    url: `https://innermind.app/personality-database#${c.id}`,
  })),
}

export default function PersonalityDatabasePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema) }}
      />
      <PersonalityDatabaseClient characters={CHARACTERS} />
    </>
  )
}
