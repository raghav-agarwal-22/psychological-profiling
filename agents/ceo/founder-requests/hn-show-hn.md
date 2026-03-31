# Founder Request: Submit Innermind Show HN (v2)

**Priority:** High
**Effort:** 10 minutes to submit + ~2 hours monitoring

---

## What to Do

Submit a "Show HN" post to news.ycombinator.com for Innermind v2.

**Why now:** We've shipped viral share cards, the referral program, and degraded mode since the last HN appearance. The product is meaningfully better and has a clearer story.

---

## Submission Steps

1. Go to **https://news.ycombinator.com/submit**
2. Use your HN account (or create one at news.ycombinator.com/login)
3. Fill in:
   - **Title:** `Show HN: Innermind – AI portrait of your psychology from Big Five, Jung, Enneagram, attachment + values`
   - **URL:** `https://innermindhealing.com`
   - **Text:** Copy the body below exactly

4. Submit. Save the link to the submission for monitoring.
5. Stay near your computer for the first 2 hours and reply to every comment.

---

## Body Text (copy-paste ready)

```
Hi HN — we built Innermind, a psychological profiling tool that runs five validated frameworks back-to-back and uses Claude to synthesize them into a cohesive portrait.

The frameworks: Big Five (OCEAN), Enneagram, Jungian Archetypes, Schwartz Values Theory, and Attachment Style. The synthesis isn't just concatenation — it looks for convergence (when multiple frameworks agree, that's a strong signal) and tension (when they conflict, that conflict is often the most diagnostic insight).

What's new since we last showed here:

– Viral share cards: shareable psychological profile cards with OpenGraph images (Next.js ImageResponse)
– Refer-a-friend program: Pro subscribers who refer users get a 30-day Pro extension per referred conversion, capped at 12 months
– Graceful degraded mode: if the Claude API key is missing, we fall back to template-based portraits rather than breaking
– Referral tracking with anonymous localStorage guest tokens to handle the signup funnel without losing attribution

Technical stack: Next.js 14 (app router, Vercel), Fastify API on Railway, PostgreSQL + Prisma, Resend email, Stripe billing, PostHog analytics.

Three things we'd genuinely like feedback on:

1. The synthesis quality — we're using Claude to combine five framework results into one coherent narrative portrait. Is the synthesis actually adding value, or does it feel like it's just summarizing each framework separately?

2. The assessment UX — we've tried to make five sequential assessments feel like one continuous experience. Where does it break?

3. Pricing — we're at $19/month for Pro features (growth tracking, AI coach, deep-dive questions, reflection journal). Does this feel right for the value being delivered?

The basic assessment + portrait is free. No credit card required.

https://innermindhealing.com
```

---

## After Submitting

- Save the submission URL (e.g. `https://news.ycombinator.com/item?id=XXXXXXX`)
- Reply to every comment in the first 2 hours — especially technical questions and skeptics
- See `marketing/hn-show-hn-v2.md` for response templates to common objections

**Do NOT** ask anyone to upvote. HN penalizes coordinated upvoting and it will kill the post.

---

## Best Times to Submit

- Tuesday–Thursday, 9am–12pm ET
- Avoid Monday (backlog) and Friday (people tuning out)

---

*Created by CMO agent 2026-03-22 | Ref: INN-234*
