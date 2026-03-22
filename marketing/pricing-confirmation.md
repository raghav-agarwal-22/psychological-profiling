# Innermind Pricing Confirmation
**Date:** 2026-03-22
**Status:** Confirmed — launch-ready
**Decision log:** [INN-242](/INN/issues/INN-242)
**Related:** [INN-257](/INN/issues/INN-257)

---

## Current Pricing Structure

### Free Tier
- **Price:** $0 forever
- **Included:**
  - Big Five personality assessment
  - Partial profile preview (blurred gate for full content)
  - Basic trait scores (openness, conscientiousness, extraversion, agreeableness, neuroticism)
- **Excluded:** All Pro features below

### Pro — Individual ($19/month)
- **Price:** $19/month
- **Annual option:** Available (equivalent to ~2 months free, billed annually)
- **Included:**
  - All 5 frameworks: Big Five + MBTI + Enneagram + Attachment Style + Cognitive Patterns
  - Full AI-synthesized portrait
  - Adaptive deep-dive questions
  - AI coach (knows your full profile)
  - Growth tracking over time
  - Reflective journal with personalized prompts
- **No team plans. No enterprise plans. Individuals only.**

---

## Pricing Rationale

$19/mo was validated against competitive landscape (see [`marketing/competitive-pricing.md`](competitive-pricing.md)):

- **Below Crystal Knows** ($49/mo) and **BetterUp** ($71/mo+) — not a professional tool
- **Above one-time report cost** (Truity $19-29/test, TraitLab $49 one-time) — justified by ongoing AI coach, growth tracking, journal
- **Sweet spot:** committed self-discovery users who budget ~$20/mo for insight tools
- **LTV at <5% churn:** ~$380 (20 months avg retention × $19)

### Price sensitivity test
At $19/mo, we need 440 paying users to hit $100k ARR. With a 5% conversion rate, that requires 8,800 total registered users. Achievable within 90 days with current traffic projections.

If conversion is <3% at $19, test a $14/mo entry point before cutting the Pro feature set.

---

## What's NOT on the Pricing Page (by design)

- ~~Team plans~~ — Innermind is a personal self-discovery product. No B2B.
- ~~Enterprise tiers~~ — Not consistent with product positioning.
- ~~Lifetime access~~ — Ongoing AI costs make this unviable.
- ~~Free trial~~ — Free tier IS the trial. No time-boxing needed.

---

## Env Var Confirmation

```bash
# These must be set before launch:
STRIPE_PRO_MONTHLY_PRICE_ID=price_XXXX   # $19/mo product in Stripe
STRIPE_PRO_ANNUAL_PRICE_ID=price_XXXX    # Annual equivalent (~$190/yr)
```

Both price IDs must match live products in the Stripe Dashboard. See [`agents/ceo/founder-requests/stripe-price-ids.md`](../agents/ceo/founder-requests/stripe-price-ids.md) for setup instructions.
