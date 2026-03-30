# Stripe Keys + Webhook Secret

**Status**: ⏳ Waiting on founder
**Blocking**: All payments, subscriptions, and upgrade flows
**Priority**: P0
**Date requested**: 2026-03-21

## What the founder needs to do

### Step 1: Get API keys
1. Go to https://dashboard.stripe.com/
2. Sign in (or create account)
3. For development, make sure you're in **Test mode** (toggle top-right)
4. Go to **Developers** → **API keys**
5. Copy the **Secret key** (starts with `sk_test_...`)
6. Copy the **Publishable key** (starts with `pk_test_...`) — may be needed later for frontend

### Step 2: Set up webhook
1. Go to **Developers** → **Webhooks**
2. Click **Add endpoint**
3. URL: your dev tunnel URL + `/api/billing/webhook` (e.g. `https://your-ngrok-url.ngrok.io/api/billing/webhook`)
4. Select events: `checkout.session.completed`, `customer.subscription.updated`, `customer.subscription.deleted`, `invoice.payment_succeeded`, `invoice.payment_failed`
5. Copy the **Webhook signing secret** (starts with `whsec_...`)

### For local dev without a tunnel
- Use Stripe CLI: `stripe listen --forward-to localhost:3001/api/billing/webhook`
- This prints a webhook secret you can use locally

## Where to put the result
- Open `apps/api/.env` and replace the placeholders:
  ```
  STRIPE_SECRET_KEY=sk_test_your-key-here
  STRIPE_WEBHOOK_SECRET=whsec_your-secret-here
  ```

## Why this matters
The entire monetization layer — Pro upgrades, professional workspace billing, subscription management — runs through Stripe. Without real keys, the billing page shows "Stripe not configured" and no one can pay.
