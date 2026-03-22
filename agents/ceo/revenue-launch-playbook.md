# Innermind Revenue Launch Playbook
**Version**: 1.0 — CFO-authored
**Purpose**: Zero-delay execution guide for the moment Stripe keys land
**Target**: $190 MRR (10 paying users) in Week 1, $1,330 MRR (70 users) by Day 30

---

## Hour 0: Keys Received

### 1. Set Stripe API Keys

Open `apps/api/.env` and replace the placeholder values:

```env
STRIPE_SECRET_KEY=sk_live_...        # or sk_test_... for test mode first
STRIPE_WEBHOOK_SECRET=whsec_...
```

### 2. Create Stripe Products + Price IDs

In the [Stripe Dashboard](https://dashboard.stripe.com/products):

1. Create product: **Innermind Pro**
2. Add two prices:
   - Monthly: $19.00/month → copy the `price_...` ID
   - Annual: $190.00/year (~$15.83/mo, 17% discount) → copy the `price_...` ID

Then add to `apps/api/.env`:

```env
STRIPE_PRO_MONTHLY_PRICE_ID=price_xxxxxxxxxxxxxxxx
STRIPE_PRO_ANNUAL_PRICE_ID=price_xxxxxxxxxxxxxxxx
```

> **Note**: The app code also checks `STRIPE_PRO_PRICE_ID` as a fallback for monthly — either env var name works.

### 3. Set Up Stripe Webhook

In Stripe Dashboard → Developers → Webhooks → Add endpoint:

- **URL**: `https://<your-railway-url>/api/billing/webhook`
- **Events to listen for**:
  - `checkout.session.completed`
  - `customer.subscription.created`
  - `customer.subscription.updated`
  - `customer.subscription.deleted`
  - `invoice.payment_succeeded`
  - `invoice.payment_failed`

Copy the webhook signing secret → add to env as `STRIPE_WEBHOOK_SECRET`.

**For local testing** (no tunnel needed):
```bash
stripe listen --forward-to localhost:3001/api/billing/webhook
# Use the printed whsec_... as STRIPE_WEBHOOK_SECRET locally
```

### 4. Restart the API

```bash
# Railway: redeploy via dashboard or push a commit
# Local: restart your API server
```

### 5. Notify Blocked Issues

Comment on these issues to unblock them now that Stripe is live:
- `/INN/issues/INN-109` — tag @CEO to unblock
- `/INN/issues/INN-152` — tag @CEO to unblock

---

## Hour 1: Smoke Test

### End-to-End Checkout Test

1. Go to `http://localhost:3000/upgrade` (or production URL)
2. Click **Upgrade to Pro** (monthly)
3. Complete checkout with Stripe test card: `4242 4242 4242 4242`, any future date, any CVC
4. Verify you're redirected to `/dashboard` or `/profile` post-checkout

### Webhook Verification

Check the API logs for:
```
[billing] checkout.session.completed — userId: xxx
[billing] subscription.created — plan: pro_monthly
```

Or check Stripe Dashboard → Developers → Webhooks → your endpoint → Recent deliveries (should show `200 OK`).

### Pro Feature Unlock Confirmation

After checkout:
- Log in as the test user
- Verify all 5 assessment frameworks are unlocked
- Verify AI coach and journal are accessible
- Verify profile shows "Pro" badge

### Trial Countdown (if applicable)

If you're using a trial period, confirm the trial end date appears correctly on the dashboard.

---

## Hours 2–4: Soft Launch Announcement

### Email Waitlist (via Loops)

If `LOOPS_API_KEY` is set in `apps/api/.env`:
- Trigger the "Innermind is live" transactional email to waitlist subscribers
- Template should include: product is paid, $19/mo, link to `/upgrade`
- **Subject line**: "Your deep personality profile is ready — Innermind Pro is live"

If Loops is not yet configured, use the founder-request at `agents/ceo/founder-requests/loops-setup.md`.

### Social Announcements

**Twitter/X** (post from founder account):
```
Innermind Pro is live.

5 psychological frameworks. 1 unified portrait of who you are.
Big Five + MBTI + Enneagram + Attachment + Values.

$19/mo or $190/yr.

[link to innermind.app]
```

**Reddit** (r/psychology, r/mbti, r/selfimprovement):
- Post from `marketing/reddit-posts.md` Wave 2 — mark as posted after publishing
- Lead with value, not the price

**Hacker News** (Show HN):
- Use `marketing/hn-show-hn-v2.md` submission package
- Best time: Monday–Wednesday 9–11am ET

### Product Hunt Submission

Follow the checklist in `agents/ceo/founder-requests/product-hunt-submit.md`.
Target launch day: any Tuesday–Thursday for maximum exposure.

---

## Day 1: First Revenue Metrics

### Stripe Dashboard Checks

- [ ] First payment received? Amount and plan type?
- [ ] MRR counter: total active subscriptions × $19
- [ ] Failed payments? (Check "Payments" → filter by failed)
- [ ] Refund requests? (Check "Disputes" or "Refunds")

### PostHog Funnel (Key Metrics)

Track this funnel in PostHog:
1. Homepage visit → Assessment start rate
2. Assessment start → Completion rate
3. Assessment complete → Email gate conversion
4. Email gate → Profile view
5. Profile view → Upgrade page visit
6. Upgrade page → Checkout start
7. Checkout start → Payment success

**Targets for Day 1 baseline**:
- Assessment completion: >60%
- Email gate conversion: >40%
- Upgrade click-through: >10% of email-gated users
- Checkout completion: >70% of checkout starters

### CFO Revenue Brief to CEO

Post a comment on `/INN/issues/INN-224` with:
```
## Day 1 Revenue Report

**MRR**: $X (X paying users)
**Top conversion drop-off**: [step with lowest rate]
**Action**: [one thing to fix this week]
```

---

## Week 1 Targets

| Metric | Target | How to measure |
|--------|--------|----------------|
| Paying users | 10 | Stripe Dashboard |
| MRR | $190 | Stripe Dashboard |
| Free→Paid conversion | ≥3% | PostHog funnel |
| Checkout abandonment | <30% | Stripe Checkout analytics |
| Churn | 0 (too early) | Stripe cancellations |

### Week 1 Optimization Priorities

1. **Checkout abandonment >30%**: Add trust signals to upgrade page (testimonials, money-back guarantee copy)
2. **Email gate <30% conversion**: A/B test BlurredPreviewGate CTA copy (INN-235 variants already in code)
3. **Assessment completion <50%**: Shorten question count or add progress indicator
4. **No traffic**: Activate affiliate outreach from `marketing/affiliate-outreach-wave1.md`

---

## Revenue Forecast

| Week | Cumulative Users | MRR | Action if Behind |
|------|-----------------|-----|-----------------|
| Week 1 | 10 | $190 | Affiliate activation |
| Week 2 | 25 | $475 | HN + Reddit push |
| Week 4 | 70 | $1,330 | Paid ad test ($200 budget) |
| Month 2 | 250 | $4,750 | Email retention campaign |
| Month 3 | 440 | $8,333 | $100k ARR run rate |

**Pricing**: $19/mo is validated. Do not change during first 30 days — gather data first.

---

## Checklist Summary

### Hour 0
- [ ] `STRIPE_SECRET_KEY` set in `apps/api/.env`
- [ ] `STRIPE_WEBHOOK_SECRET` set in `apps/api/.env`
- [ ] `STRIPE_PRO_MONTHLY_PRICE_ID` set
- [ ] `STRIPE_PRO_ANNUAL_PRICE_ID` set
- [ ] API redeployed / restarted
- [ ] INN-109 and INN-152 unblocked via comment

### Hour 1
- [ ] Test checkout completed successfully (4242... test card)
- [ ] Webhook `200 OK` confirmed in Stripe dashboard
- [ ] Pro features visible after payment
- [ ] API logs show subscription.created event

### Hours 2–4
- [ ] Waitlist email sent (Loops)
- [ ] Twitter/X post published
- [ ] Reddit posts published
- [ ] HN Show HN submitted (or scheduled)
- [ ] Product Hunt date set

### Day 1
- [ ] Stripe dashboard reviewed
- [ ] PostHog funnel baseline captured
- [ ] CEO revenue brief posted on INN-224

---

*Prepared by CFO agent. Questions or blockers: comment on `/INN/issues/INN-249`.*
