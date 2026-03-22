# Innermind Revenue Launch Playbook
**Version:** 1.0 — Ready to execute
**Status:** Pre-launch (waiting on Stripe keys)
**Owner:** CFO Agent
**Related:** [INN-257](/INN/issues/INN-257), [INN-224](/INN/issues/INN-224)

---

## Overview

This is the hour-by-hour execution guide for the moment Stripe keys arrive. Goal: **first paying customer within 60 minutes of key insertion.** Target: 5 paying users on day 1 ($95 MRR).

---

## Phase 0: Pre-launch Readiness (Before Keys Arrive)

These are things you can verify NOW, before Stripe is live:

### ✅ Environment variables — confirm placeholders exist in `apps/api/.env`
```
STRIPE_SECRET_KEY=sk_test_placeholder       ← replace with real key
STRIPE_WEBHOOK_SECRET=whsec_placeholder     ← replace with real secret
STRIPE_PRO_MONTHLY_PRICE_ID=price_pro_monthly_placeholder  ← replace
STRIPE_PRO_ANNUAL_PRICE_ID=price_pro_annual_placeholder    ← replace
NEXT_PUBLIC_POSTHOG_KEY=<your-key>          ← needed for conversion tracking
```

### ✅ Confirm billing routes are registered
- File: `apps/api/src/routes/billing.ts`
- Routes exposed: `/api/billing/create-checkout-session`, `/api/billing/webhook`, `/api/billing/portal`
- All three must return non-500 responses before launch

### ✅ Confirm upgrade page loads
- URL: `/upgrade`
- Must show Pro plan at $19/mo and offer Stripe Checkout button
- Test locally: click Upgrade → should redirect to `stripe.com/pay/...` (not an error)

### ✅ Confirm webhook events are configured (see `agents/ceo/founder-requests/stripe-setup.md`)
Required Stripe events:
- `checkout.session.completed`
- `customer.subscription.updated`
- `customer.subscription.deleted`
- `invoice.payment_succeeded`
- `invoice.payment_failed`

---

## Phase 1: Stripe Keys Arrive (T=0)

### Step 1 — Insert keys (5 min)
Open `apps/api/.env` and set:
```bash
STRIPE_SECRET_KEY=sk_test_XXXX
STRIPE_WEBHOOK_SECRET=whsec_XXXX
STRIPE_PRO_MONTHLY_PRICE_ID=price_XXXX
STRIPE_PRO_ANNUAL_PRICE_ID=price_XXXX    # if offering annual
```

### Step 2 — Restart API server (2 min)
```bash
cd apps/api && npm run build && npm start
# Or if using Railway: push to main triggers auto-deploy
```

### Step 3 — Test charge with Stripe test card (10 min)
1. Open `/upgrade` in the app
2. Click "Upgrade to Pro"
3. Use Stripe test card: `4242 4242 4242 4242` / any future date / any CVC
4. Complete checkout
5. Verify:
   - Redirect back to app with success state
   - Database: user's `subscriptionTier` = `pro`
   - Stripe Dashboard: subscription visible under Customers

### Step 4 — Test webhook delivery (5 min)
Option A (production): Stripe Dashboard → Webhooks → your endpoint → "Send test event" → `checkout.session.completed`
Option B (local): `stripe listen --forward-to localhost:3001/api/billing/webhook` then trigger a test checkout

Confirm: no 400/500 errors in API logs for webhook receipt.

### Step 5 — Test email delivery (5 min)
After the test charge, confirm:
- Welcome email arrives (requires `RESEND_API_KEY` — see founder-requests)
- If RESEND not configured, OTP fallback mode active (auth still works)

### Step 6 — Verify admin dashboard shows revenue (3 min)
- URL: `/admin`
- MRR should now show $19 (from test charge)
- Funnel should show 1 conversion

**Total time from keys to verified: ~30 minutes**

---

## Phase 2: Go Live (T+30 min)

### Flip to live mode
1. Replace `sk_test_...` with `sk_live_...` in `apps/api/.env`
2. Update webhook endpoint in Stripe Dashboard to point to production Railway URL
3. Replace `price_prod_...` price IDs with live-mode price IDs
4. Restart API / redeploy

### Verify production checkout
- Do a real $0.50 charge with a real card (use coupon if needed)
- Confirm subscription created in Stripe live dashboard
- Refund immediately after verification

---

## Phase 3: Launch Announcements (T+45 min)

See [`marketing/launch-announcements.md`](launch-announcements.md) for ready-to-paste copy.

**Sequence:**
1. Post Twitter/X announcement thread
2. Post to r/mbti, r/psychology, r/personalitytypes
3. Send waitlist email (if list exists)
4. Drop HN comment on existing Show HN thread

---

## Revenue Tracking: First-Day Targets

| Metric | Day-1 Target | Week-1 Target | Month-1 Target |
|--------|-------------|---------------|----------------|
| Paying users | 5 | 25 | 70 |
| MRR | $95 | $475 | $1,330 |
| Free → paid conversion | 3% | 4% | 5% |
| Churn | 0% | 0% | <5% |

### What "success" looks like on day 1
- **Minimum viable:** 2 paying users ($38 MRR) — proves billing works
- **Good:** 5 paying users ($95 MRR) — validates product-market fit signal
- **Great:** 10+ paying users ($190+ MRR) — strong launch momentum

### Daily check-in cadence (first week)
- 9am: check Stripe Dashboard for overnight signups
- 5pm: check PostHog funnel conversion rate
- Log findings in [`marketing/revenue-dashboard.md`](revenue-dashboard.md)

---

## Phase 4: Post-Launch Monitoring (T+24 hours)

### Stripe Dashboard — check daily
- New customers
- Failed payments
- Subscription cancellations
- Disputed charges (goal: 0)

### PostHog funnel — check daily
- Free tier signups
- Upgrade page visits
- Checkout initiations
- Checkout completions
- Conversion rate: target >5%

### Common day-1 issues and fixes

| Issue | Likely Cause | Fix |
|-------|-------------|-----|
| Checkout button errors | Price ID not set | Re-check env vars, restart API |
| Webhook 400 errors | Wrong webhook secret | Re-copy `whsec_` from Stripe Dashboard |
| User not upgraded after payment | Webhook not received | Check Stripe Dashboard → Webhooks → recent events |
| Email not sent after signup | RESEND_API_KEY missing | OTP fallback works; email can wait |
| Admin dashboard shows $0 | API not rebuilt | Run `npm run build` in `apps/api` |

---

## Env Var Master Checklist

```
# Core (P0 — launch blocked without these)
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...
STRIPE_PRO_MONTHLY_PRICE_ID=price_...
DATABASE_URL=postgresql://...

# High priority (P1 — degraded without these)
RESEND_API_KEY=re_...              # email delivery (OTP fallback works)
NEXT_PUBLIC_POSTHOG_KEY=phc_...   # conversion tracking
JWT_SECRET=...                    # auth (must be set)

# Nice to have (P2 — safe to launch without)
STRIPE_PRO_ANNUAL_PRICE_ID=price_...   # annual plan
ANTHROPIC_API_KEY=sk-ant-...           # AI coach feature
```

---

## Launch Day Communication

At the end of day 1, post a metrics update as a comment on [INN-224](/INN/issues/INN-224):
- Total signups
- Paying users
- MRR
- Conversion rate
- Top acquisition channel (check PostHog)
