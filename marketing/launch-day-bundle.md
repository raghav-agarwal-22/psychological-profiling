# Launch Day Content Bundle — Innermind

**Purpose:** Copy-paste ready content for a coordinated 9AM EST multi-channel blast on Product Hunt launch day.
**Owner:** CMO | INN-286
**Status:** Ready

---

## TIMING OVERVIEW

| Channel | When | Action |
|---------|------|--------|
| Product Hunt | 12:01AM PST | Auto-submits (or founder submits night before) |
| Twitter/X thread | 9:00AM EST | Paste Tweet 1, then the thread |
| Reddit r/startups | 9:05AM EST | Paste post, check it went live |
| Reddit r/SideProject | 9:15AM EST | Paste post (offset to avoid simultaneous) |
| HN Show HN | 9:30AM EST | Submit from `hn-show-hn-v2.md` title + body |
| LinkedIn | 9:45AM EST | Paste post |
| Discord drops | 10:00AM–12PM EST | Stagger across communities (instructions below) |

**Rule:** Don't post all Reddit + HN at the same moment — Reddit's spam filters flag simultaneous multi-subreddit bursts.

---

## 1. TWITTER/X THREAD — FOUNDER VOICE

**UTM:** `?utm_source=twitter&utm_medium=launch&utm_campaign=ph-launch-day`

---

**TWEET 1 (Hook — post this first, then reply with the thread):**

> We just launched on Product Hunt — and I want to explain why we built Innermind differently.
>
> Most personality tools give you one lens. We give you five.
>
> Thread 🧵

---

**TWEET 2:**

> Every popular framework captures something real:
>
> → Big Five (OCEAN) predicts career outcomes + life satisfaction better than almost any other measure
> → Enneagram maps the fear underneath your behavior — the part that doesn't change
> → Attachment Style explains your patterns in relationships under stress
> → Schwartz Values shows what you actually optimize for (vs. what you say you care about)
> → Jungian Archetypes gives you the narrative — who you are in story form
>
> None of them are complete. All of them are true.

---

**TWEET 3:**

> Innermind runs all five back-to-back and uses Claude to synthesize them into one portrait.
>
> The synthesis finds where the frameworks *agree* (strong signal — this is really you) and where they *conflict* (the conflict is often the most diagnostic part).
>
> Example insight: "Your Big Five shows high Openness + low Conscientiousness, which in your Enneagram 7 manifests as brilliant idea generation that rarely lands. Your Anxious Attachment amplifies the fear of finishing — completion = judgment."
>
> That's not one framework talking. That's five converging.

---

**TWEET 4:**

> What's new since we last shipped:
>
> → Viral share cards (OpenGraph profile images you can post)
> → Refer-a-friend program (Pro subscribers get 30-day extensions per converted referral)
> → Reflection journal — link insights to what's actually happening in your life
> → AI coach that knows your full profile (not generic advice)
> → Growth tracking — retake quarterly and see what's actually changed
>
> The basic assessment + portrait is free. No credit card.

---

**TWEET 5 (CTA):**

> We're live on Product Hunt today — if this resonates, an upvote goes a long way.
>
> Try the free assessment: https://innermind.app?utm_source=twitter&utm_medium=launch&utm_campaign=ph-launch-day
>
> [Link to Product Hunt listing]
>
> DMs open. Would love feedback from anyone who takes it today. 🙏

---

**IMMEDIATE FOLLOW-UP (reply to your own thread ~5 min later):**

> Quick note: we built this because personality type communities (MBTI, Enneagram, etc.) are enormous — millions of people are clearly hungry for self-understanding. But the tools haven't kept up.
>
> Most apps give you your type and stop there. We treat your profile as a *working model* you update over time. Not "you're an INFJ." More like: "here's the current best map of your psychology — let's navigate with it."
>
> That's the product.

---

## 2. REDDIT r/startups

**UTM:** `?utm_source=reddit&utm_medium=launch&utm_campaign=startups-ph-launch`
**Best time:** 9:05AM EST
**Flair:** Launch

---

**Title:**
`We launched Innermind on Product Hunt today — AI psychological profiling that synthesizes 5 frameworks instead of giving you one type`

**Body:**

Hey r/startups — launching today on Product Hunt and wanted to share with this community since we've gotten good feedback here before.

**What it is:** Innermind runs five validated psychology assessments (Big Five, Enneagram, Jungian Archetypes, Schwartz Values, Attachment Style) and uses Claude to synthesize them into one psychological portrait.

**The problem we're solving:** Every popular personality framework captures something real, but each has blind spots. MBTI tells you cognitive style but misses motivation. Enneagram maps fear but not trait stability. Big Five is scientifically validated but emotionally flat. Combining them gives you something more three-dimensional than any one of them.

**Current traction:**
- Free tier: Big Five + partial portrait
- Pro ($19/mo): all 5 frameworks, AI coach, growth tracking, reflection journal
- Early validation: paying customers, referral program driving 15–20% of new signups

**What's new in this version:**
- Viral share cards (shareable OpenGraph profile images)
- Refer-a-friend (30-day Pro extension per referred conversion)
- PostHog funnel analytics + paywall A/B infrastructure
- AI coach grounded in full user profile

**The real insight that drove the product:** People who take multiple personality tests are clearly hungry for more, not less. They're not switching frameworks — they're adding them. We're building the tool for that behavior.

Would genuinely appreciate feedback on pricing, positioning, and whether the "synthesis" framing lands. And an upvote on PH if it resonates: [Product Hunt link]

---

## 3. REDDIT r/SideProject

**UTM:** `?utm_source=reddit&utm_medium=launch&utm_campaign=sideproject-ph-launch`
**Best time:** 9:15AM EST (offset from r/startups by 10 min)
**Flair:** Launch

---

**Title:**
`I spent 3 months building a psychological profiling tool that synthesizes 5 frameworks at once — launching on Product Hunt today`

**Body:**

After years of jumping between MBTI, Big Five, Enneagram, Attachment Style, and Schwartz Values Theory — each giving me something real but incomplete — I built Innermind to run all five together.

The core idea: personality frameworks aren't competing. They're measuring different things. Big Five measures stable traits. Enneagram maps core fear + defense mechanisms. Attachment Style maps relational behavior under stress. Schwartz Values shows what you actually optimize for. Jungian Archetypes gives you the narrative.

Running them together and synthesizing with AI gives you something none of them can give you alone: convergent signal (where frameworks agree = reliable data) and productive tension (where they conflict = the most useful diagnostic insight).

**Stack:**
- Next.js 14 (app router, Vercel)
- Fastify API on Railway
- PostgreSQL + Prisma
- Claude for synthesis and AI coach
- Stripe billing, Resend email, PostHog analytics

**What I'm proud of:**
- The synthesis quality — it finds cross-framework patterns, not just summaries of each one
- Growth tracking — retake quarterly and track change over time
- Referral program with localStorage guest token attribution (handles the signup funnel without losing ref credit)

**What I'm still figuring out:**
- SEO takes time — most discovery is still direct
- Converting free users to Pro ($19/mo) is the main challenge right now

Live today on Product Hunt: [Link]
Free assessment: https://innermind.app?utm_source=reddit&utm_medium=launch&utm_campaign=sideproject-ph-launch

Happy to answer questions about the tech or the product — been heads down on this for a while.

---

## 4. HN SHOW HN

**Source:** `marketing/hn-show-hn-v2.md` — full submission text is ready there.
**Best time:** 9:30AM EST (Tuesday–Thursday optimal; adjust to match launch day of week)
**Do NOT copy this section** — paste directly from `hn-show-hn-v2.md` to avoid version divergence.

**Quick reference — recommended title:**
```
Show HN: Innermind – AI portrait of your psychology from Big Five, Jung, Enneagram, attachment + values
```

**Reminder:** Monitor the thread for first 2 hours. Reply to every comment. See HN post-submission playbook in `hn-show-hn-v2.md`.

---

## 5. LINKEDIN — FOUNDER PERSPECTIVE

**UTM:** `?utm_source=linkedin&utm_medium=launch&utm_campaign=ph-launch-day`
**Best time:** 9:45AM EST

---

**Post:**

We're launching on Product Hunt today — and I want to be honest about what we're actually building and why.

Personality psychology has a real problem. The tools are enormously popular (hundreds of millions of people have taken some version of MBTI, Big Five, or Enneagram) but the experience is almost always the same: take a quiz, get a type, move on.

The type becomes an identity badge. "I'm an INTJ." "I'm a Type 4." But six months later, you're no clearer on the actual questions: why do I keep making the same mistake in relationships? Why does this career feel wrong even though I'm performing? What's actually driving me?

That's what Innermind is trying to answer.

We run five validated frameworks — Big Five, Enneagram, Jungian Archetypes, Schwartz Values, Attachment Style — and synthesize them with Claude into a unified psychological portrait. The synthesis finds where frameworks converge (strong signal) and where they conflict (productive diagnostic tension). You don't get a type. You get a map.

What I think is actually different about the approach:
1. **Multi-framework convergence** — one trait prediction is a guess; three frameworks agreeing is evidence
2. **Growth tracking** — your personality shifts measurably over time. We let you see it.
3. **AI coaching grounded in your actual profile** — not generic advice, but conversations that know your specific convergences and tensions

The basic assessment is free. Pro is $19/month for the full picture.

If this is useful for you, your team, or your clients — I'd genuinely welcome the feedback. And an upvote on Product Hunt if you believe in what we're building: [Product Hunt link]

https://innermind.app?utm_source=linkedin&utm_medium=launch&utm_campaign=ph-launch-day

---

## 6. DISCORD/SLACK DROPS

**Timing:** 10:00AM–12PM EST — stagger one community every 15–20 min

---

### 6A. Personality Database (PDB) Discord
**Channel:** `#personality-discussion` or `#general`
**When:** 10:00AM EST

**Message:**

Hey — launching Innermind on Product Hunt today. It synthesizes Big Five, Enneagram, Jungian Archetypes, Attachment Style, and Schwartz Values into a unified AI portrait. The multi-framework synthesis is what we've been most focused on — finding convergence and tension across frameworks rather than just running five separate tests.

Free assessment if you want to try it: https://innermind.app?utm_source=discord&utm_medium=pdb&utm_campaign=ph-launch-day

PH link: [Product Hunt link] — upvotes appreciated if it resonates.

---

### 6B. r/mbti Discord
**Channel:** `#general` or `#mbti-discussion`
**When:** 10:20AM EST

**Message:**

For anyone in this community curious about multi-framework profiling — launched Innermind on Product Hunt today. It runs MBTI/Jungian Archetypes alongside Big Five, Enneagram, Attachment Style, and Values and synthesizes them with AI into one portrait.

The synthesis specifically looks for where MBTI function stack predictions match or conflict with Big Five trait data — that cross-framework tension is usually the most useful insight.

Free to try: https://innermind.app?utm_source=discord&utm_medium=mbti-discord&utm_campaign=ph-launch-day

---

### 6C. Psychology/Self-Development Discord Servers
**Channel:** `#tools` or `#resources`
**When:** 10:40AM EST

**Message:**

Sharing this for anyone interested in psychological frameworks — we just launched Innermind on Product Hunt. Synthesizes five validated assessments (Big Five, Enneagram, Jungian, Attachment Style, Schwartz Values) with Claude into one portrait.

The goal is multi-framework convergence — if three frameworks agree on something, that's more reliable than any one test. Disclosure: I'm affiliated with the project.

Free assessment: https://innermind.app?utm_source=discord&utm_medium=psych-discord&utm_campaign=ph-launch-day

---

### 6D. GROW Slack (Self-Improvement)
**Channel:** `#tools` or `#introductions`
**When:** 11:00AM EST

**Message:**

Hey GROW — launching on Product Hunt today. Innermind synthesizes five psychology frameworks (Big Five, Enneagram, Attachment Style, Schwartz Values, Jungian Archetypes) into one AI portrait of how your psychology actually works together.

For self-improvement purposes: the most useful output isn't the type — it's where frameworks conflict. If you score high Big Five Conscientiousness but Enneagram 7, that tension is the exact thing to work on.

Free: https://innermind.app?utm_source=slack&utm_medium=grow&utm_campaign=ph-launch-day

---

## LAUNCH DAY CHECKLIST

```
[ ] 12:01AM PST — Product Hunt is live (verify it posted)
[ ] 9:00AM EST — Twitter thread posted (5 tweets + follow-up reply)
[ ] 9:05AM EST — r/startups post live
[ ] 9:15AM EST — r/SideProject post live
[ ] 9:30AM EST — HN Show HN submitted (from hn-show-hn-v2.md)
[ ] 9:45AM EST — LinkedIn post live
[ ] 10:00AM–12PM EST — Discord/Slack drops (staggered, 4 communities)
[ ] First 2 hours — Reply to every HN comment
[ ] First 2 hours — Reply to every Reddit comment
[ ] First 2 hours — Reply to Twitter replies
[ ] 12PM — Check PH ranking, consider asking early supporters to comment
[ ] 5PM EST — Status check: upvotes, signups, top-of-funnel in PostHog
[ ] End of day — Thank-you tweet with day-1 numbers
```

---

## UTM TRACKING SUMMARY

| Channel | utm_source | utm_medium | utm_campaign |
|---------|-----------|------------|--------------|
| Twitter | twitter | launch | ph-launch-day |
| Reddit r/startups | reddit | launch | startups-ph-launch |
| Reddit r/SideProject | reddit | launch | sideproject-ph-launch |
| LinkedIn | linkedin | launch | ph-launch-day |
| PDB Discord | discord | pdb | ph-launch-day |
| r/mbti Discord | discord | mbti-discord | ph-launch-day |
| Psych Discord | discord | psych-discord | ph-launch-day |
| GROW Slack | slack | grow | ph-launch-day |

**PostHog filter:** `utm_campaign=ph-launch-day` to see all launch day traffic combined.

---

*Created: 2026-03-23 | Owner: CMO | INN-286 / INN-282*
