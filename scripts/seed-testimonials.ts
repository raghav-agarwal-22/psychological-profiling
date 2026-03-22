#!/usr/bin/env tsx
/**
 * Seed pre-approved beta user testimonials directly into the DB.
 *
 * Usage:
 *   DATABASE_URL=postgresql://... pnpm tsx scripts/seed-testimonials.ts
 *   # or via make:
 *   make seed-testimonials
 */

import { PrismaClient } from '@innermind/db'

const prisma = new PrismaClient()

const BETA_TESTIMONIALS = [
  {
    firstName: 'Alex',
    personalityTag: 'INTJ · Enneagram 5',
    rating: 5,
    quote: "I've tried every personality test out there. Innermind is the first one that actually synthesized them into something coherent. The cross-framework narrative is genuinely insightful.",
  },
  {
    firstName: 'Maya',
    personalityTag: 'ENFP · Big Five: High Openness',
    rating: 5,
    quote: 'The blind spots section hit me hard — in the best way. I shared it with my therapist and we spent the whole session on it. Worth every penny.',
  },
  {
    firstName: 'Jordan',
    personalityTag: 'Enneagram Type 2',
    rating: 5,
    quote: 'Finally a platform that treats personality as something dynamic, not a label. The growth recommendations feel real, not generic.',
  },
  {
    firstName: 'Priya',
    personalityTag: 'INFJ · Attachment: Secure',
    rating: 5,
    quote: "I was skeptical about another 'AI psychology' tool. But the depth here is different. It actually understands the tension between my values and how I show up.",
  },
  {
    firstName: 'Sam',
    personalityTag: 'ENFJ · Dark Triad: Low',
    rating: 4,
    quote: "The multi-framework approach is what sets this apart. I've done Big Five, MBTI, Enneagram separately — seeing them unified is a completely different experience.",
  },
  {
    firstName: 'Chris',
    personalityTag: 'ISTP · Enneagram 8',
    rating: 5,
    quote: 'I sent this to three friends after finishing my profile. The narrative reads like someone who actually knows me wrote it.',
  },
]

async function main() {
  console.log(`Seeding ${BETA_TESTIMONIALS.length} beta testimonials...`)

  let created = 0
  let skipped = 0

  for (const t of BETA_TESTIMONIALS) {
    // Create without userId (public testimonial, not tied to a real account)
    const existing = await prisma.testimonial.findFirst({
      where: { firstName: t.firstName, quote: t.quote },
    })

    if (existing) {
      console.log(`  ⏭  Skipping "${t.firstName}" (already exists)`)
      skipped++
      continue
    }

    await prisma.testimonial.create({
      data: {
        userId: null,
        firstName: t.firstName,
        personalityTag: t.personalityTag,
        rating: t.rating,
        quote: t.quote,
        isApproved: true,
        isFeatured: t.rating === 5,
      },
    })
    console.log(`  ✓  Created testimonial for ${t.firstName} (${t.rating}★)`)
    created++
  }

  console.log(`\nDone: ${created} created, ${skipped} skipped.`)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
