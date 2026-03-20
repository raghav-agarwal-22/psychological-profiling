# Community Launch Posts — Innermind

**Goal:** 200+ HN upvotes, 100+ profile assessments from community posts
**Tracking:** All links use UTM params. Filter by source in PostHog.

---

## UTM Parameter Guide

| Channel | UTM String |
|---------|-----------|
| Hacker News | `?utm_source=hackernews&utm_medium=community&utm_campaign=show_hn` |
| IndieHackers (product) | `?utm_source=indiehackers&utm_medium=community&utm_campaign=product_launch` |
| IndieHackers (milestone) | `?utm_source=indiehackers&utm_medium=community&utm_campaign=milestone_post` |
| BetaList | `?utm_source=betalist&utm_medium=directory&utm_campaign=launch` |
| Uneed | `?utm_source=uneed&utm_medium=directory&utm_campaign=launch` |
| Peerlist | `?utm_source=peerlist&utm_medium=directory&utm_campaign=launch` |
| r/SideProject | `?utm_source=reddit&utm_medium=community&utm_campaign=sideproject` |
| r/startups | `?utm_source=reddit&utm_medium=community&utm_campaign=startups` |
| r/Entrepreneur | `?utm_source=reddit&utm_medium=community&utm_campaign=entrepreneur` |
| Designer News | `?utm_source=designernews&utm_medium=community&utm_campaign=launch` |

**Base URL:** `https://tryinnermind.com`
**Full example:** `https://tryinnermind.com?utm_source=hackernews&utm_medium=community&utm_campaign=show_hn`

---

## Hacker News — Show HN

**Post time:** 9–10am ET, Tuesday or Wednesday
**URL to submit:** `https://tryinnermind.com?utm_source=hackernews&utm_medium=community&utm_campaign=show_hn`

### Title
```
Show HN: Innermind – AI-synthesized psychological profile using Big Five, Jungian archetypes, and 3 other validated instruments
```

### Top Comment (post immediately after submission, as the author)
```
Hey HN! Built this over the last few weeks and wanted to share.

The problem: most personality tools give you a label ("you're an ENFP!")
with no synthesis, no nuance, and no actionable insight. They also rely on
a single framework, which gives you a narrow slice of who you are.

What Innermind does differently:
- Five validated psych instruments: Big Five (OCEAN), Jungian Archetypes,
  Schwartz Values, Attachment Style, and Enneagram
- After you complete all five, GPT-4 synthesizes them into a coherent
  psychological portrait — not just a list of scores
- The portrait looks for patterns, tensions, and blind spots across frameworks
- Free to take, paid to unlock the full synthesis ($9/mo)

Technical notes:
- Next.js 14 + Fastify API on Railway
- Assessments are validated instruments (not made-up quizzes)
- Anonymous flow: take the whole thing before giving your email
- All five assessments take about 25 minutes total

I'd love to hear what the HN crowd thinks about:
1. The validity/value of combining these frameworks
2. Whether the AI synthesis is actually useful vs. just impressive-sounding
3. Pricing intuition — is $9/mo right, or should this be one-time?

Happy to answer any questions!
```

### Anticipated Comments & Responses

**"Isn't this just MBTI with extra steps?"**
> MBTI isn't one of our instruments — specifically because it has poor test-retest reliability. Big Five (OCEAN) is the gold standard in academic psychology. We combine it with Jungian archetypes (different from MBTI), Schwartz Values Theory (used in cross-cultural research), and attachment theory. The synthesis is what's novel — not any single instrument.

**"How is the AI synthesis validated?"**
> It's not peer-reviewed, and we're transparent about that. The individual instruments are validated; the synthesis layer is AI-generated interpretation. We think of it as a thoughtful integration, not a clinical diagnosis. We'd love to eventually partner with researchers to evaluate the synthesis quality.

**"Privacy concerns — are you storing this data?"**
> We store assessment responses and the generated portrait in our database (PostgreSQL). We never sell data. The portrait is tied to your account and only accessible by you. We'll publish a full privacy policy shortly.

**"What's the business model?"**
> Free to take all five assessments and see teaser results. $9/month to unlock the full AI portrait. We're exploring a one-time purchase option too.

---

## IndieHackers — Product Listing

**URL:** Submit at indiehackers.com/products
**Link:** `https://tryinnermind.com?utm_source=indiehackers&utm_medium=community&utm_campaign=product_launch`

### Product Name
```
Innermind
```

### Tagline
```
AI psychological profile using Big Five, Jungian archetypes + 3 more validated instruments
```

### Description
```
Innermind synthesizes five validated psychology assessments into a single,
coherent AI portrait of who you are.

Most personality tools give you a label. Innermind gives you a portrait —
finding the patterns, tensions, and blind spots across Big Five (OCEAN),
Jungian Archetypes, Schwartz Values Theory, Attachment Style, and Enneagram.

Take all five assessments free. Unlock the full AI synthesis for $9/month.

Built with: Next.js 14, Fastify, PostgreSQL, GPT-4
```

---

## IndieHackers — Milestone Post

**URL:** Post in the "Milestones" feed
**Title format:** "From idea to first paying customers in X weeks"

### Draft
```
**From idea to first paying users: how we built an AI psychologist in 3 weeks**

Three weeks ago I had a frustrating thought: why do all personality tests give
you a label and call it done?

MBTI tells you you're an ENFP. Enneagram says you're a 4. Big Five spits out
percentile scores. But none of them synthesize. None of them say: "here's what
it means that you score high in openness AND you have an anxious attachment
style AND your core value is universalism."

So I built Innermind.

**What it does:**
Five validated instruments (Big Five, Jungian Archetypes, Schwartz Values,
Attachment Style, Enneagram) → one AI-synthesized psychological portrait.

The portrait isn't just a summary. GPT-4 looks for coherence, tensions, and
patterns across all five frameworks. It's the kind of analysis you'd get from
a therapist who's read everything about you.

**The build:**
- Week 1: Assessment engine (question flows, scoring algorithms for all 5 instruments)
- Week 2: AI synthesis layer + user auth
- Week 3: Billing, referral program, anonymous flow, polish

Stack: Next.js 14, Fastify on Railway, PostgreSQL, Prisma, Stripe, Resend, PostHog.

**Where we are:**
- [X] paying subscribers (update before posting)
- ~25 minutes to complete all assessments
- Anonymous mode: take it before giving your email (our best conversion lever)

**What I learned:**
The biggest insight was the anonymous flow. Originally we gated everything
behind email. Conversion was terrible. Switched to: take all five assessments
free → get a teaser → email to unlock full portrait. 3x improvement.

**Try it:** https://tryinnermind.com?utm_source=indiehackers&utm_medium=community&utm_campaign=milestone_post

Happy to answer questions about the build or the psych validity!
```

---

## BetaList Submission

**URL:** betalist.com/submit
**Link:** `https://tryinnermind.com?utm_source=betalist&utm_medium=directory&utm_campaign=launch`

### Fields
```
Name: Innermind
Tagline: AI psychological profile using 5 validated instruments — Big Five, Jungian archetypes, and more
Description: Take five validated psychology assessments and receive an AI-synthesized portrait
of your psychology — not just a label, but a coherent narrative that finds patterns and tensions
across Big Five, Jungian Archetypes, Schwartz Values, Attachment Style, and Enneagram.
Website: https://tryinnermind.com?utm_source=betalist&utm_medium=directory&utm_campaign=launch
Category: Personal Development / Productivity
```

---

## Uneed Submission

**URL:** uneed.best/submit
**Link:** `https://tryinnermind.com?utm_source=uneed&utm_medium=directory&utm_campaign=launch`

### Fields
```
Name: Innermind
Short description: AI psychological profiling using Big Five + 4 other validated instruments
Long description: Innermind runs you through 5 validated psychology assessments (Big Five OCEAN,
Jungian Archetypes, Schwartz Values Theory, Attachment Style, Enneagram) and generates a unified
AI portrait — synthesizing the patterns, tensions, and blind spots across all five frameworks.
Free to take. $9/month to unlock.
Website: https://tryinnermind.com?utm_source=uneed&utm_medium=directory&utm_campaign=launch
Tags: psychology, AI, personality, self-development
```

---

## Peerlist Submission

**URL:** peerlist.io/tools (submit product)
**Link:** `https://tryinnermind.com?utm_source=peerlist&utm_medium=directory&utm_campaign=launch`

### Fields
```
Product Name: Innermind
Tagline: AI-synthesized psychological profile using 5 validated instruments
Description: Five validated psychology assessments → one AI portrait.
Big Five, Jungian Archetypes, Schwartz Values, Attachment Style, and Enneagram
synthesized into a coherent psychological portrait by GPT-4.
Built with: Next.js, Fastify, PostgreSQL, Prisma, Stripe
Website: https://tryinnermind.com?utm_source=peerlist&utm_medium=directory&utm_campaign=launch
```

---

## r/SideProject

**Post time:** Monday or Wednesday, 8–10am ET
**Link:** `https://tryinnermind.com?utm_source=reddit&utm_medium=community&utm_campaign=sideproject`

### Title
```
I built an AI that synthesizes 5 validated psychology assessments into one coherent portrait of who you are
```

### Body
```
Most personality tools give you a label. I wanted something that actually
synthesizes.

So I built Innermind: you take five validated instruments — Big Five (OCEAN),
Jungian Archetypes, Schwartz Values Theory, Attachment Style, and Enneagram —
and GPT-4 synthesizes them into a single psychological portrait.

Not a list of scores. An actual narrative: "Here's what it means that you
score high in openness but have an anxious attachment style..."

**Stack:** Next.js 14, Fastify (Railway), PostgreSQL, Prisma, Stripe, PostHog

**Biggest lesson:** switched from email-gated to anonymous-first (take all
assessments → email to unlock portrait) and conversion improved ~3x.

Free to take. $9/month for the full synthesis.

https://tryinnermind.com?utm_source=reddit&utm_medium=community&utm_campaign=sideproject

Happy to answer questions about the build or the psych frameworks!
```

---

## r/startups

**Post time:** Tuesday or Thursday, 9–11am ET
**Link:** `https://tryinnermind.com?utm_source=reddit&utm_medium=community&utm_campaign=startups`

### Title
```
Launched Innermind — AI psychological profiling. Learned the hard way that email gates kill conversion.
```

### Body
```
Built and launched Innermind over the last 3 weeks. Main lesson: don't gate
your core value prop behind email.

**What it is:** Five validated psychology assessments → AI-synthesized portrait

**Original flow:** Landing → email → assessments → portrait
**Result:** ~8% email-to-assessment completion

**New flow:** Landing → assessments (anonymous) → teaser → email to unlock
**Result:** ~3x improvement on conversion

The insight is obvious in retrospect: people don't know if the product is
worth their email until they experience it. Let them experience it first.

Product: https://tryinnermind.com?utm_source=reddit&utm_medium=community&utm_campaign=startups

Anyone else running anonymous-first flows? Curious what conversion benchmarks
look like for similar products.
```

---

## r/Entrepreneur

**Post time:** Friday morning (milestone/reflection posts do well)
**Link:** `https://tryinnermind.com?utm_source=reddit&utm_medium=community&utm_campaign=entrepreneur`

### Title
```
3 weeks from idea to paying customers: what I learned building an AI psychology tool
```

### Body
```
Three weeks ago I was frustrated by personality tests that give you a label
without synthesis. Today I have paying customers for Innermind.

**The product:** 5 validated psych assessments → 1 AI portrait. Big Five,
Jungian Archetypes, Schwartz Values, Attachment Style, Enneagram synthesized
into a coherent psychological narrative.

**3 things that worked:**

1. **Anonymous first.** Don't ask for email until you've delivered value.
   Implemented an anonymous assessment flow — take all 5 before signup.
   Conversion went up ~3x.

2. **Validated instruments, not made-up quizzes.** Academic credibility matters.
   The Big Five is the gold standard in psych research. Using real instruments
   let us confidently say "this is backed by decades of research."

3. **AI synthesis as the differentiator.** Any quiz site can show you scores.
   Having GPT-4 synthesize *across* frameworks — finding tensions and patterns
   the user wouldn't notice — is the thing people actually pay for.

**3 things I'd do differently:**

1. Launched the referral program earlier
2. Built the blog/SEO content first (now playing catch-up)
3. Talked to 20 users before building

Product: https://tryinnermind.com?utm_source=reddit&utm_medium=community&utm_campaign=entrepreneur
```

---

## Designer News

**URL:** designernews.co/submit
**Link:** `https://tryinnermind.com?utm_source=designernews&utm_medium=community&utm_campaign=launch`

### Title
```
Innermind — AI psychological portrait from 5 validated instruments
```

### Comment (post as first comment after submission)
```
Built the UI to feel like a serious product rather than a quiz app.

Key design decisions:
- Dark, considered aesthetic (not the usual bright quiz palette)
- Progress milestones with archetype reveals during the assessment
- Blurred profile preview on the auth page — show them what they're unlocking
- Shareable profile cards (coming soon) for viral distribution

The assessment UX was the hardest part: 5 instruments × 20-40 questions each,
keeping engagement up throughout. Used milestone reveals ("You're showing signs
of the Explorer archetype...") to maintain momentum.

Would love feedback on the overall design direction.
```

---

## Launch Day Checklist

### Pre-launch (day before)
- [ ] Verify all UTM links work in PostHog
- [ ] Set up PostHog funnel: UTM source → signup → assessment complete → paid
- [ ] Prepare 5–10 comment responses for anticipated HN objections
- [ ] Screenshot current metrics (baseline for post-launch comparison)

### Launch day
- [ ] Post HN at 9am ET
- [ ] Post r/SideProject at 8:30am ET (slightly before HN)
- [ ] Submit BetaList, Uneed, Peerlist (takes 24-48h to appear)
- [ ] Post IndieHackers milestone post at 10am ET
- [ ] Monitor HN comments — respond within 30 min of each comment
- [ ] Post r/startups at 11am ET
- [ ] Post r/Entrepreneur at 1pm ET
- [ ] Post Designer News at 2pm ET

### Post-launch (48 hours later)
- [ ] Pull PostHog breakdown by `utm_source`
- [ ] Identify which channel drove most signups
- [ ] Post IndieHackers product listing (after milestone post has traction)
- [ ] Write follow-up comment on HN thread with any user feedback

---

## Tracking Dashboard Setup

In PostHog, create a funnel with these steps:
1. `pageview` where `utm_source` is set
2. `assessment_started`
3. `assessment_completed` (all 5)
4. `profile_viewed`
5. `signup_completed`
6. `subscription_started`

Group by `utm_source` to compare channel quality.
