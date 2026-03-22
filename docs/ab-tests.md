# Innermind A/B Tests

All tests use PostHog feature flags. Dashboard: https://app.posthog.com

---

## Active Tests

### 1. `blurred-gate-cta` — Upgrade CTA copy on blurred preview gate
- **File:** `apps/web/src/components/BlurredPreviewGate.tsx`
- **Goal:** Increase gate view → upgrade click rate
- **Variants:**
  - `control` — "Upgrade to Pro — $19/mo"
  - `variant-a` — "Start your 7-day free trial →"
  - `variant-b` — "Try Pro free for 7 days →"
- **Key events:** `ab_upgrade_click` (property: `cta_variant`)
- **Target metric:** `ab_upgrade_click` rate from users who see the gate
- **Minimum sample:** 500 per variant
- **Started:** 2026-03-22
- **PostHog insight:** Create a Trends insight filtering on `ab_upgrade_click`, broken down by `cta_variant`

### 2. `upgrade-interval-default` — Default billing interval on upgrade page
- **File:** `apps/web/src/app/upgrade/page.tsx`
- **Goal:** Increase annual plan selection → higher LTV
- **Variants:**
  - `control` — Monthly selected by default
  - `annual` — Annual selected by default
- **Key events:** `upgrade_cta_clicked` (property: `interval`)
- **Target metric:** Annual conversion rate from upgrade page visits
- **Minimum sample:** 300 per variant
- **Started:** 2026-03-22
- **PostHog insight:** Create a Funnel: `upgrade_page_viewed` → `upgrade_cta_clicked` (filter `interval=annual`), broken down by `upgrade-interval-default` flag

### 3. `upgrade-cta-copy` — CTA copy variant on upgrade page
- **File:** `apps/web/src/app/upgrade/page.tsx`
- **Goal:** Increase upgrade page → Stripe checkout conversion
- **Variants:** tracked via `ab_upgrade_cta_copy` property on `upgrade_page_viewed`
- **Key events:** `upgrade_page_viewed`, `upgrade_cta_clicked`
- **Target metric:** Checkout start rate
- **Minimum sample:** 300 per variant
- **Started:** 2026-03-22
- **PostHog insight:** Create a Trends insight on `upgrade_cta_clicked`, broken down by `ab_upgrade_cta_copy`

### 4. `email-gate-headline` — Headline copy on anonymous profile email gate
- **File:** `apps/web/src/app/profile/anon/[anonId]/page.tsx`
- **Goal:** Increase anonymous profile → email submission rate
- **Variants:** controlled by `email-gate-headline` flag value
- **Key events:** email submission event from anon profile claim flow
- **Target metric:** Email submit rate for anon users
- **Minimum sample:** 500 per variant
- **Started:** 2026-03-22
- **PostHog insight:** Create a Trends insight on the email claim event, broken down by `email-gate-headline` flag

---

## How to Create PostHog Insights

1. Go to **PostHog → Insights → New insight**
2. For conversion funnels: choose **Funnel** type; add steps in order
3. For rate monitoring: choose **Trends** type; add the event; use **Breakdown** by the feature flag property
4. Save insight and add to the **Innermind Growth** dashboard

---

## Declaring a Winner

- Run each test for a minimum of 2 weeks and until minimum sample is reached
- Use PostHog's built-in significance calculator (p < 0.05)
- Roll out winner via PostHog flag → 100% of users
- Archive the losing variant in the feature flag configuration
- Update this doc with result and date
