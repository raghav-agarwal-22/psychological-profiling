# Innermind Launch Day Runbook

**Status:** Ready — execute when Anthropic + Stripe keys are set in Railway
**Owner:** Founder
**Last updated:** 2026-03-23

---

## Part 0: Keys Setup (Before Anything Else)

Set these environment variables in Railway (or your `.env` files for local):

- [ ] `ANTHROPIC_API_KEY` — get from [console.anthropic.com](https://console.anthropic.com/) → API Keys → Create Key
  _(see full instructions: `agents/ceo/founder-requests/anthropic-api-key.md`)_
- [ ] `STRIPE_SECRET_KEY` — get from [dashboard.stripe.com](https://dashboard.stripe.com/) → Developers → API Keys
  _(see full instructions: `agents/ceo/founder-requests/stripe-setup.md`)_
- [ ] `STRIPE_WEBHOOK_SECRET` — set up webhook endpoint in Stripe dashboard, events: `checkout.session.completed`, `customer.subscription.updated`, `customer.subscription.deleted`
  _(see full instructions: `agents/ceo/founder-requests/stripe-setup.md`)_
- [ ] `STRIPE_PRICE_ID_PRO_MONTHLY` — get from `agents/ceo/founder-requests/stripe-price-ids.md`
- [ ] `RESEND_API_KEY` — get from [resend.com](https://resend.com) → API Keys
  _(see full instructions: `agents/ceo/founder-requests/resend-api-key.md`)_

Once keys are set, **restart the Railway service** and wait for it to show "Healthy" before proceeding.

---

## Part 1: Pre-Launch Smoke Tests

Run these checks **before going public**. Do not launch until all pass.

### 1.1 — AI Synthesis Check
- [ ] Go to `https://innermindhealing.com` (your production URL)
- [ ] Click **Start Free Assessment**
- [ ] Complete the Big Five assessment (30 questions)
- [ ] Confirm the profile page loads with an AI-generated portrait (not a fallback template)
- [ ] Confirm archetypes, Big Five score bars, and narrative text all render
- [ ] **Pass criteria:** AI-generated portrait visible within 30 seconds of completing assessment

### 1.2 — Stripe Payment Check
- [ ] Log in as a user with a completed profile
- [ ] Click **Upgrade to Pro** (or navigate to `/upgrade`)
- [ ] Use Stripe test card: `4242 4242 4242 4242` / any future expiry / any CVC
- [ ] Confirm checkout session opens in Stripe
- [ ] Complete the purchase
- [ ] Confirm Pro features unlock (growth chart, AI coach, deep-dive questions visible)
- [ ] Check [Stripe dashboard](https://dashboard.stripe.com/) → Payments — confirm the test charge appears
- [ ] Check Railway logs — confirm `checkout.session.completed` webhook received with 200 response
- [ ] **Pass criteria:** Pro features unlock within 10 seconds of payment

### 1.3 — Email / Magic Link Check
- [ ] Go to `/auth/login`
- [ ] Enter a real email address you can check
- [ ] Click Send Magic Link
- [ ] Confirm email arrives within 60 seconds (check spam folder too)
- [ ] Click the magic link — confirm it logs you in and redirects to dashboard
- [ ] **Pass criteria:** Email delivered, login works

### 1.4 — Mobile Check (iPhone Safari)
- [ ] Open `https://innermindhealing.com` on iPhone Safari
- [ ] Confirm homepage renders correctly (no horizontal scroll, no broken layout)
- [ ] Tap **Start Free Assessment** — confirm assessment loads and is tappable
- [ ] Complete at least 5 questions — confirm progress bar works
- [ ] **Pass criteria:** No layout breaks, all buttons tappable, no console errors

### 1.5 — All 4 Assessment Frameworks
- [ ] Complete Big Five (30 questions) ✓ (done in 1.1)
- [ ] Start and complete Enneagram assessment from the dashboard
- [ ] Start and complete a third assessment (Attachment Style or Values)
- [ ] Confirm each completion updates the profile page with the new dimension
- [ ] **Pass criteria:** Each framework completes without error, results appear in profile

---

## Part 2: T+0 Launch Sequence

Execute in this exact order. Work top-to-bottom.

### Step 1 — Product Hunt (T+0:00)

- [ ] Open draft at [producthunt.com/posts/new](https://www.producthunt.com/posts/new)
- [ ] Fill in form using `agents/ceo/founder-requests/product-hunt-submit.md`:
  - **Name:** Innermind
  - **Tagline:** Know yourself completely — 5 validated psych frameworks, one AI-synthesized portrait
  - **Website URL:** https://innermindhealing.com
  - Gallery screenshots + demo GIF already prepared (see product-hunt-submit.md for assets)
- [ ] **Set launch time to NOW** (or earliest available slot — midnight PT is best if early morning)
- [ ] Click **Launch**
- [ ] Copy the Product Hunt launch URL and save it here: `___________________________`
- [ ] Pin the PH URL in a visible place (your phone, browser bookmark) — you'll need it all day

### Step 2 — Hacker News Show HN (T+0:05)

- [ ] Open [news.ycombinator.com/submit](https://news.ycombinator.com/submit)
- [ ] **Title:** `Show HN: Innermind – AI portrait of your psychology from Big Five, Jung, Enneagram, attachment + values`
- [ ] **URL:** https://innermindhealing.com
- [ ] **Text body:** Copy from `marketing/hn-show-hn-v2.md` → "Submission Body" section
- [ ] Click **Submit**
- [ ] Copy the HN thread URL and save it here: `___________________________`
- [ ] Keep this tab open — you'll be responding to comments in minutes

> ⚠️ **HN rules:** Do not ask friends to upvote. Do not vote on your own post. Respond genuinely to all comments. See `marketing/hn-show-hn-v2.md` → "Post-Submission Playbook" for response templates.

### Step 3 — Fire Waitlist Email (T+0:10)

- [ ] The waitlist email template is at `apps/api/src/emails/WaitlistLaunchEmail.tsx`
- [ ] If Loops is configured (`agents/ceo/founder-requests/loops-setup.md`): trigger the launch broadcast via Loops dashboard
- [ ] If using direct Resend: POST to `/api/waitlist/notify-launch` (or run the email script)
- [ ] Confirm at least one test delivery in Resend dashboard before sending to full list
- [ ] **Send to full waitlist**
- [ ] Note send time: `___________________________`

### Step 4 — Twitter/X Launch Thread (T+0:15)

- [ ] Open Twitter/X — post from **founder's personal account** (performs better than brand account at <1k followers)
- [ ] **Tweet 1 (hook thread):** Post the Day 1 hook thread from `marketing/twitter-content-calendar.md` → "Day 1 — Monday (Launch Hook)"
- [ ] After thread is posted, add a reply with the Product Hunt link: `"We launched on Product Hunt today — would love your support: [PH URL]"`
- [ ] **Founder personal tweet** (separate post, not part of thread):

```
Today we launched Innermind.

Two years ago I couldn't explain myself clearly — not to therapists, not to partners, not to myself.

I built this because I wanted one honest, complete picture of my psychology. Not a type. Not a category. An actual portrait.

It's free to start. Try it here: https://innermindhealing.com

[link to Product Hunt post]
```

- [ ] Post this tweet too
- [ ] Like and retweet the thread from personal account if using brand account, or vice versa

### Step 5 — Reddit Posts (T+0:20)

Post the top 3 posts from `marketing/reddit-posts.md`:

- [ ] **Post 1** → r/mbti
  Title: _"I've identified as INFJ for 10 years. Then I added 4 other frameworks. Here's what I actually learned."_
  Best time: Tuesday–Thursday 8–10pm EST. If it's daytime: post anyway, pin for evening re-engagement.
  UTM link: `https://innermindhealing.com?utm_source=reddit&utm_medium=community&utm_campaign=mbti-post1`

- [ ] **Post 2** → r/enneagram
  Use the post from `marketing/reddit-posts.md` targeting Enneagram community
  UTM: `?utm_source=reddit&utm_medium=community&utm_campaign=enneagram-post1`

- [ ] **Post 3** → r/selfimprovement
  Use the productivity-framed post from `marketing/reddit-posts.md`
  UTM: `?utm_source=reddit&utm_medium=community&utm_campaign=selfimprovement-post1`

> ⚠️ **Reddit rules:** Don't post "I launched a tool" directly. Use the personal story framing in the drafts. Engage with every comment. Do not repost the same link across subreddits — use different posts with different angles.

---

## Part 3: T+1h Monitoring

Set a 1-hour timer from your first launch action. At T+1h, run through this checklist:

### Traffic & Signups
- [ ] Open [PostHog dashboard](https://app.posthog.com) → check **active sessions** (should see spike)
- [ ] Check **signup funnel**: Landing → Assessment Start → Assessment Complete → Profile View
- [ ] Note assessment completion rate (target: >60%)
- [ ] Check if any users reached the upgrade page (even 1 is a win at this stage)

### Infrastructure
- [ ] Check Railway logs for any 500 errors or API failures
- [ ] Check Railway service metrics — CPU/memory within normal range
- [ ] Check Anthropic API dashboard for usage (confirm synthesis is running, not hitting rate limits)

### Community Engagement
- [ ] **Product Hunt:** Respond to ALL comments within this window. Even a "Thank you!" is better than silence. Upvotes come when founders are visibly engaged.
- [ ] **HN:** Check for new comments. Respond to technical questions first — HN rewards detailed founder replies.
- [ ] **Reddit:** Check your 3 posts. Reply to any comments. Don't be salesy — be a person in a conversation.
- [ ] **Twitter:** Reply to any quote-tweets or mentions

### Stripe
- [ ] Check Stripe → Payments — any real paid conversions? (incredible if yes at this stage — screenshot it)

---

## Part 4: T+24h Follow-Up

### Email Follow-Up
- [ ] Send waitlist email #2 (re-engagement) to users who opened but didn't sign up
  - Template: Draft a short "did you try it yet?" email using `apps/api/src/emails/WaitlistLaunchEmail.tsx` as base
  - Subject: "Still thinking about it? Your psychological portrait is waiting"
- [ ] Check email open rates in Resend/Loops dashboard

### Social Follow-Up
- [ ] **Twitter:** Post a day-1 results thread:
  ```
  Day 1 of Innermind on Product Hunt.

  [X] people took their psychological assessment.
  [X% or "handful of"] upgraded to Pro.

  Favorite insight from a user: "[quote a real user comment if you have one]"

  Still going strong: [Product Hunt link]
  ```
- [ ] Thank the top 3 most engaged Product Hunt supporters (reply to their comments)
- [ ] Reply to any remaining Reddit/HN threads that got traction

### Review & Adjust
- [ ] Write a 5-line post-mortem for yourself:
  1. What channel drove the most signups?
  2. Where did users drop off in the funnel?
  3. What unexpected thing happened?
  4. What should be done differently tomorrow?
  5. What single thing would move the needle most in the next 48h?

---

## Reference Files

| File | What's in it |
|------|-------------|
| `agents/ceo/founder-requests/anthropic-api-key.md` | Anthropic API key setup instructions |
| `agents/ceo/founder-requests/stripe-setup.md` | Stripe keys + webhook setup |
| `agents/ceo/founder-requests/stripe-price-ids.md` | Stripe price IDs for Pro subscription |
| `agents/ceo/founder-requests/resend-api-key.md` | Resend email API key setup |
| `agents/ceo/founder-requests/product-hunt-submit.md` | Product Hunt submission form guide + assets |
| `agents/ceo/founder-requests/loops-setup.md` | Loops email platform setup |
| `marketing/hn-show-hn-v2.md` | HN Show HN title + body + response templates |
| `marketing/twitter-content-calendar.md` | Day-by-day tweet calendar (Day 1 = launch thread) |
| `marketing/twitter-launch-strategy.md` | Engagement strategy + target accounts |
| `marketing/reddit-posts.md` | Full Reddit post drafts for each subreddit |
| `marketing/reddit-community-seeding-inn260.md` | Detailed Reddit community seeding strategy |
| `apps/api/src/emails/WaitlistLaunchEmail.tsx` | Waitlist launch notification email template |

---

## Emergency Contacts

| Issue | Action |
|-------|--------|
| AI synthesis broken (users get fallback template) | Check `ANTHROPIC_API_KEY` in Railway env vars, check API credits at console.anthropic.com |
| Stripe webhook failing | Check Railway logs for `/api/billing/webhook`, verify `STRIPE_WEBHOOK_SECRET` matches Stripe dashboard |
| Emails not sending | Check `RESEND_API_KEY` in Railway, check Resend dashboard for bounces or domain issues |
| Railway app down | Check Railway dashboard → Deployments for error logs, redeploy last known-good build |
| Assessment completion broken | Check Railway API logs for `/api/assessments/*` errors, check Postgres connection |
