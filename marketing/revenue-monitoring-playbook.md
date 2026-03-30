# Innermind: First-Week Revenue Monitoring Playbook

**Owner:** CFO Agent
**Version:** 1.0 — Launch-ready
**Related:** [INN-285](/INN/issues/INN-285), [INN-224](/INN/issues/INN-224)
**Targets:** Free→paid >5% | Monthly churn <5% | $1,330 MRR by end of Month 1

---

## Purpose

This playbook tells you exactly what to check, when, and what to do if numbers are off. Follow it day-by-day in the first 7 days after launch. It takes 15–20 minutes per day.

---

## Part 1: How to Read Your Stripe Dashboard

### 1A. MRR Breakdown (Stripe → Billing → Revenue)

Open **Stripe Dashboard → Billing → Revenue recognition → Monthly overview**.

| Stripe metric | What it means | Healthy sign |
|---|---|---|
| **New MRR** | Revenue from brand-new subscribers this month | Growing daily in week 1 |
| **Expansion MRR** | Upgrades (e.g. monthly → annual) | Any number > 0 is bonus |
| **Churned MRR** | Lost from cancellations | Should be $0 in week 1 |
| **Net New MRR** | New MRR − Churned MRR | This is your headline number |
| **Total MRR** | All active subscriptions × $19 | Target: $1,330 by day 30 |

**Where to find it in Stripe:**
1. Stripe Dashboard → top nav → "Revenue"
2. Set date range to current month
3. MRR card shows today's total; click it to see the waterfall (new / expansion / churn)

**Quick math check:** Total paying users × $19 = MRR. If Stripe MRR ≠ users × $19, investigate for failed payments or paused subscriptions.

### 1B. Day-by-Day MRR in Stripe

**Stripe → Customers → filter by "Active" subscription**

- Count = current Pro users
- MRR = count × $19
- Export CSV on Day 7 for your weekly briefing

### 1C. Key Stripe Signals to Watch

| Signal | Where in Stripe | Action threshold |
|---|---|---|
| Subscription created | Dashboard → Events → `customer.subscription.created` | Normal — celebrate each one |
| Payment failed | Dashboard → Events → `invoice.payment_failed` | Alert if >5% of charges fail |
| Subscription cancelled | Dashboard → Events → `customer.subscription.deleted` | Alert if any in first 7 days |
| Dispute/chargeback | Dashboard → Disputes | Alert immediately on any dispute |

---

## Part 2: Cohort Retention Table

Track every signup cohort's D1, D3, and D7 retention to catch drop-off early.

### 2A. How to Build the Table

**Data sources:**
- **PostHog** → Retention → "user signed up" as start event, "user logged in" as return event
- **Stripe** → Customers created on each date

**Table format (update daily):**

| Cohort Date | Signups | D1 Retained | D1 % | D3 Retained | D3 % | D7 Retained | D7 % | Converted to Pro | Conv % |
|---|---|---|---|---|---|---|---|---|---|
| Launch Day | — | — | — | — | — | — | — | — | — |
| Day 2 | — | — | — | — | — | — | — | — | — |
| Day 3 | — | — | — | — | — | — | — | — | — |
| Day 4 | — | — | — | — | — | — | — | — | — |
| Day 5 | — | — | — | — | — | — | — | — | — |
| Day 6 | — | — | — | — | — | — | — | — | — |
| Day 7 | — | — | — | — | — | — | — | — | — |

**How to fill it:**

1. **PostHog → Retention analysis**
   - Breakdown event: `user_signed_up`
   - Return event: `user_logged_in`
   - Interval: Day
   - This gives you D1/D3/D7 return rates per cohort

2. **Conversion to Pro:**
   - PostHog: `upgrade_started` → `upgrade_completed` funnel
   - Or: Stripe customers created per day ÷ signups that day

### 2B. Retention Benchmarks (Psychology/Wellness SaaS)

| Metric | Good | Great | Alarming |
|---|---|---|---|
| D1 retention | >40% | >60% | <25% |
| D3 retention | >25% | >40% | <15% |
| D7 retention | >20% | >35% | <10% |
| Free→paid conv | >3% | >7% | <1% |

If D1 retention is below 25%, the onboarding funnel has a major problem. Act immediately (see Part 4: Alert Playbook).

---

## Part 3: Alert Thresholds & Automated Monitoring

### 3A. Hard Alerts (Act Within 2 Hours)

| Alert | Threshold | What to check | Escalation |
|---|---|---|---|
| Payment failure rate | >5% of charges fail | Stripe → Failed payments → check card errors vs auth errors | Email failed users; check Stripe webhook delivery |
| Churn in first 7 days | >10% of subscribers cancel | Stripe → Cancelled subscriptions → check timing | Exit survey, reach out directly |
| Zero signups in 24h | 0 new accounts | Check Railway/Vercel logs for 5xx errors | Page engineer; check auth flow |
| Upgrade page error | Any 4xx/5xx on `/upgrade` | Vercel logs + Railway logs | Fix billing route immediately |
| Stripe webhook failures | Any `invoice.payment_failed` not processed | Stripe → Webhooks → check endpoint status | Verify `STRIPE_WEBHOOK_SECRET` is correct |

### 3B. Soft Alerts (Check Same Day)

| Alert | Threshold | Action |
|---|---|---|
| Low D1 retention | <30% returning next day | Review onboarding email timing; check if profile completion flow works |
| Weak conversion | <2% free→paid after 72h | Add urgency copy to upgrade page; check blurred preview gate is working |
| High bounce on /upgrade | >70% leave without clicking | A/B test headline; check pricing page loads on mobile |
| Traffic spike with no signups | PostHog sessions >> signups | Landing page CTA may be broken; check analytics events |

### 3C. Where to Set Up Alerts

**Stripe:**
1. Stripe Dashboard → Settings → Notifications → Email me on: failed payments, disputes, new subscriptions

**PostHog:**
1. PostHog → Insights → create "Daily signups" chart → set threshold alert
2. PostHog → Cohorts → create "Zero-conversion cohort" for users 72h+ old without upgrading

**Railway (API health):**
1. Railway → Project → Settings → Notifications → On deploy failure

---

## Part 4: Day-by-Day Monitoring Checklist

### Day 1 (Launch Day) — 30 minutes

**Morning (9am local):**
- [ ] Verify Stripe is live: make a test purchase with real card, confirm it appears in Stripe dashboard
- [ ] Confirm `/upgrade` renders correctly on mobile and desktop
- [ ] PostHog: verify `user_signed_up` events are flowing
- [ ] Confirm webhook endpoint is healthy: Stripe → Webhooks → "Listening" status

**Evening (9pm local):**
- [ ] Record Day 1 signups in cohort table
- [ ] Check MRR: Stripe → Revenue → Net New MRR
- [ ] Log: first payment time, first user ID, conversion source (PostHog UTM)
- [ ] Share in Slack/notes: "Day 1: X signups, Y paid, $Z MRR"

---

### Day 2 — 20 minutes

- [ ] Fill D1 retention for Launch Day cohort (PostHog)
- [ ] Record Day 2 signups + any new Pro conversions
- [ ] Check payment failure rate: Stripe → Events → filter `invoice.payment_failed`
- [ ] Review top traffic source: PostHog → Acquisition

---

### Day 3 — 20 minutes

- [ ] Fill D3 retention for Launch Day cohort
- [ ] Fill D1 retention for Day 2 cohort
- [ ] Check total MRR vs target: should be trending toward $95+ (5 paying users)
- [ ] Review upgrade funnel: PostHog → Funnels → `paywall_shown` → `upgrade_started` → `upgrade_completed`
- [ ] If conversion <2%: check if blurred preview gate is visible on `/results` page

---

### Day 4 — 15 minutes

- [ ] Update cohort table
- [ ] Check for any Stripe disputes or refund requests
- [ ] Review churn: any subscription cancellations?
- [ ] If any cancellations: send personal email asking for feedback (1-2 sentence ask)

---

### Day 5 — 15 minutes

- [ ] Update cohort table (D3 for Day 2 cohort)
- [ ] Check weekly run rate: MRR ÷ 5 days × 30 ≈ projected month-end MRR
- [ ] Review top sources: which UTM/channel is converting best?
- [ ] Identify lowest-converting cohort day — what was different about that day's traffic?

---

### Day 6 — 15 minutes

- [ ] Update cohort table
- [ ] Check PostHog: which assessments correlate with Pro conversion?
- [ ] Review any testimonial requests sent (from `/api/testimonials/request-email`)
- [ ] Start drafting Week 1 CFO Briefing (see Part 5)

---

### Day 7 — 30 minutes (Weekly Briefing Day)

- [ ] Complete cohort table (D7 for Launch Day cohort, D1–D5 for subsequent cohorts)
- [ ] Export Stripe CSV: Customers → filter by created this week
- [ ] Calculate final week 1 metrics (see Part 5 template)
- [ ] Publish week 1 briefing
- [ ] Set targets for Week 2

---

## Part 5: Weekly CFO Briefing Format

Produce this every Monday. Takes 20 minutes if cohort table is current.

---

```
## Innermind CFO Briefing — Week [N]
Date: [Monday date]
Period: [start date] → [end date]

### Revenue
- MRR (end of week): $___
- Net New MRR this week: $___
- New subscribers: ___
- Churned subscribers: ___
- Net subscribers added: ___

### ARR Progress
- Current ARR run rate: $___
- % of $100k ARR target: ___%
- Weeks to target at current pace: ___

### Conversion
- New signups this week: ___
- Free→paid conversion rate: ___%  (target: >5%)
- Average days to convert: ___
- Top converting source: ___ (utm_source or channel)

### Cohort Health
| Cohort | D1 | D3 | D7 |
|--------|----|----|-----|
| Week start | | | |
| Week mid | | | |

### Churn Signals
- Cancellations this week: ___
- Churn rate: ___%  (target: <5%)
- Known churn reasons: ___

### Payment Health
- Successful charges: ___
- Failed charges: ___
- Failure rate: ___%  (alert if >5%)
- Disputes/chargebacks: ___

### Top Actions for Next Week
1. ___
2. ___
3. ___

### Risks / Watch Items
- ___
```

---

## Part 6: Key Benchmarks & Targets

| Metric | Week 1 target | Month 1 target | Month 2 target |
|---|---|---|---|
| MRR | $95 (5 users) | $1,330 (70 users) | $4,750 (250 users) |
| Free→paid conv | >3% (early traffic) | >5% | >5% |
| Monthly churn | <10% (acceptable early) | <5% | <5% |
| D7 retention (free) | >20% | >25% | >30% |
| Payment failure rate | <5% | <3% | <3% |
| LTV | $228 (12mo × $19) | $228+ | $228+ |

---

## Part 7: Quick Reference — Where to Find What

| Question | Where to look |
|---|---|
| How many paying users do I have? | Stripe → Customers → filter "Active" subscription |
| What is my MRR right now? | Stripe → Billing → Revenue → current month total |
| Which channel is converting best? | PostHog → Funnels → breakdown by `utm_source` |
| Did a payment fail? | Stripe → Events → search `invoice.payment_failed` |
| Who cancelled? | Stripe → Events → search `customer.subscription.deleted` |
| What is my D7 retention? | PostHog → Retention → return event = `user_logged_in` |
| How many people hit the paywall? | PostHog → Funnels → `paywall_shown` event |
| Is the webhook working? | Stripe → Webhooks → click endpoint → check "Recent deliveries" |
| What did they assess before converting? | PostHog → Persons → find user → view events timeline |

---

*Last updated: 2026-03-23 · CFO Agent · [INN-285](/INN/issues/INN-285)*
