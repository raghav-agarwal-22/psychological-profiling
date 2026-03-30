# Stripe Price IDs (6 Products)

**Status**: ⏳ Waiting on founder
**Blocking**: Checkout flows — users can't subscribe to any plan
**Priority**: P0
**Date requested**: 2026-03-21
**Depends on**: [stripe-setup.md](stripe-setup.md) — need Stripe account first

## What the founder needs to do

In the Stripe Dashboard (Test mode), create these 6 products with recurring prices:

### Pro Plan (Individual)
1. Go to **Products** → **Add product**
2. Name: `Innermind Pro Monthly` → Price: choose your monthly rate → Recurring/Monthly
3. After creating, copy the **Price ID** (starts with `price_...`)
4. Repeat for `Innermind Pro Annual` → Recurring/Yearly

### Professional Starter (B2B)
5. Create `Professional Starter Monthly` → Recurring/Monthly
6. Create `Professional Starter Annual` → Recurring/Yearly

### Professional Unlimited (B2B)
7. Create `Professional Unlimited Monthly` → Recurring/Monthly
8. Create `Professional Unlimited Annual` → Recurring/Yearly

## Where to put the result
- Open `apps/api/.env` and add:
  ```
  STRIPE_PRO_MONTHLY_PRICE_ID=price_xxxxxx
  STRIPE_PRO_ANNUAL_PRICE_ID=price_xxxxxx
  STRIPE_PROFESSIONAL_STARTER_MONTHLY=price_xxxxxx
  STRIPE_PROFESSIONAL_STARTER_ANNUAL=price_xxxxxx
  STRIPE_PROFESSIONAL_UNLIMITED_MONTHLY=price_xxxxxx
  STRIPE_PROFESSIONAL_UNLIMITED_ANNUAL=price_xxxxxx
  ```

## Why this matters
Without real price IDs, Stripe Checkout can't create sessions. Users click "Upgrade" and get an error. The code falls back to placeholder strings that Stripe rejects.
