# Hacker News Show HN — Innermind v2

**Status:** Ready to submit. See `agents/ceo/founder-requests/hn-show-hn.md` for submission instructions.

**Best time to submit:** Tuesday–Thursday, 9am–12pm ET

---

## Recommended Title

```
Show HN: Innermind – AI portrait of your psychology from Big Five, Jung, Enneagram, attachment + values
```

**Why this title works for HN:**
- "Show HN" prefix signals this is a real product demo, not an article
- Lists the actual frameworks — HN readers want specifics, not marketing language
- "AI portrait" is descriptive, not hype — it accurately describes what it generates
- No adjectives like "amazing" or "revolutionary"

**Alternatives (if the above is flagged as too long):**
1. `Show HN: Innermind – Five validated psych frameworks synthesized into one AI portrait`
2. `Show HN: Multi-dimensional personality profiler that goes beyond MBTI`

---

## Submission Body

*Paste this in the "text" field when submitting. HN renders it as plain text.*

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

## Post-Submission Playbook (Founder to Execute)

**First 2 hours are critical:**

1. **Monitor every new comment** — reply substantively to every one, even critical ones
2. **For technical questions**: answer precisely. HN loves founders who know their stack cold.
3. **For skepticism about personality psychology**: engage honestly. "MBTI is pseudoscience" is a valid critique — acknowledge what's valid, explain how Big Five and Schwartz are different.
4. **For pricing questions**: be transparent about the thinking.
5. **For "why not just do X instead"**: engage genuinely. Don't be defensive.

**What NOT to do:**
- Don't ask friends/colleagues to upvote. HN's algorithm detects vote rings and penalizes them.
- Don't be defensive about criticism
- Don't abandon the thread after the initial post

**Response templates for common objections:**

*"MBTI is pseudoscience"*
> "Agreed that MBTI has real limitations — its test-retest reliability is genuinely poor and the type categories artificially discretize continuous traits. That's exactly why we lead with Big Five (which has decades of cross-cultural validation) and use MBTI-adjacent typing only through Jungian Archetypes, which we treat as archetypal narratives rather than predictive categories. The synthesis deliberately weights Big Five results more heavily."

*"Why AI? What's it actually adding?"*
> "Good question — we debated this ourselves. The AI adds value specifically at the synthesis layer: human readers struggle to hold five different framework results in their head simultaneously and notice the relationships between them. Claude can hold all five and identify where they converge (which is strong signal) and where they conflict (which is often the most useful insight). We've been testing whether the synthesis actually adds signal or just sounds good — still refining the prompt architecture."

*"This is just a personality test aggregator"*
> "Fair. The differentiated value is in three places: the cross-framework synthesis (not just showing five separate results), the growth tracking (retake over time and see what's changed), and the AI coach (conversations grounded in your specific profile rather than generic advice). Whether those are actually better than five separate tests is a legitimate thing to evaluate — we'd love the feedback."

---

## Timing

**Optimal HN windows (ET):**
- Tuesday 9am–12pm
- Wednesday 9am–12pm
- Thursday 9am–12pm

**Avoid:** Monday (weekend backlog), Friday (people checking out), weekends (lower traffic)

---

*Created: 2026-03-22 | Owner: CMO | INN-234*
