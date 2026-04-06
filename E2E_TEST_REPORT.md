# E2E Test Report — Revenue Funnel Builds

**Date**: 2026-04-02 11:07am
**Branch**: develop
**Runner**: Scheduled cron job (headless Chromium via gstack/browse)

---

## Summary

| Test | Build(s) | Status | Notes |
|------|----------|--------|-------|
| TEST 1: Upgrade Page | Builds 1 & 4 | PASS | All 4 checks verified |
| TEST 2: Bridge Page | Builds 2 & 3 | PASS | Frosted bars, CTA, escape, persistent banner |
| TEST 3: B2B Feature Flag | Build 5 | PASS | Redirect + hidden section |
| TEST 4: Email Capture | Build 2 | PASS | Submission + success message |

**Overall: 4/4 PASS**

---

## TEST 1: Upgrade Page (Builds 1 & 4)

**What was tested**: CC-required trial copy changes + annual consolidation

| Check | Expected | Actual | Status |
|-------|----------|--------|--------|
| Annual selected by default | Annual toggle has active style | `AnnualSAVE 37% → SELECTED` | PASS |
| Green reinforcement banner | "You're on the annual plan — saving $84/year" | Exact match | PASS |
| CTA button copy | Contains "$0 today" | "Start free trial — $0 today →" | PASS |
| Disclaimer text | "Card required" | "Card required. Cancel anytime before day 7. No charge until then." | PASS |
| Monthly nudge banner | Shows "Switch to annual" on click | "Switch to annual and save $84/year" | PASS |

**Screenshot**: `/tmp/e2e-test1-upgrade.png`

---

## TEST 2: Big Five Quiz + Bridge Page (Builds 2 & 3)

**What was tested**: Quiz tracking events, bridge page with frosted locked bars, escape to results

### Bridge Page Checks

| Check | Expected | Actual | Status |
|-------|----------|--------|--------|
| Openness trait revealed | Violet bar with score | Openness: 20 (violet-400 styled) | PASS |
| Locked traits | 4 frosted/blurred bars | 5 elements with aria-label (4 locked + 1 revealed) | PASS |
| CTA text | "See My Full Portrait — $0 Today" | Exact match | PASS |
| Escape link | "View basic results only" | "View basic results only ↓" | PASS |
| Testimonial | Italicized quote | "The most accurate thing I've ever read about myse..." | PASS |

### Results Page Checks (after escape)

| Check | Expected | Actual | Status |
|-------|----------|--------|--------|
| Persistent upsell banner | "Your full portrait is waiting" | Link present at top with amber styling | PASS |
| All 5 traits visible | 5 bar charts | Openness, Conscientiousness, Extraversion, Agreeableness, Neuroticism all rendered | PASS |
| QuizUpgradeCard | Comparison table | "Unlock Your Full Psychological Portrait" visible | PASS |
| Email capture | Input + button | Email textbox + submit button present | PASS |

**Screenshots**: `/tmp/e2e-test2-bridge.png`, `/tmp/e2e-test2-results.png`

---

## TEST 3: B2B Feature Flag (Build 5)

**What was tested**: Professional tier routes gated, B2B section hidden

| Check | Expected | Actual | Status |
|-------|----------|--------|--------|
| /professional redirect | Redirect to / | URL: http://localhost:3000/ | PASS |
| B2B section on /upgrade | "For professionals" NOT visible | `textContent.includes('For professionals') === false` | PASS |

---

## TEST 4: Email Capture (Build 2)

**What was tested**: Shared QuizEmailCapture component calls /api/newsletter/subscribe

| Check | Expected | Actual | Status |
|-------|----------|--------|--------|
| Email input present | Textbox on results page | @e10 textbox "Email me my full results" | PASS |
| Submit enabled after input | Button becomes clickable | Button lost [disabled] after filling "test-e2e@example.com" | PASS |
| Success message | Green text about "full profile" | "We'll send you your full profile when Innermind launches." (emerald-400) | PASS |

---

## Environment

- macOS Darwin 25.3.0
- Node >= 20, pnpm 9+
- Next.js 14 (port 3000), Fastify API (port 3001)
- Headless Chromium via gstack/browse
- No auth tokens (unauthenticated user flow)
- ENABLE_PROFESSIONAL_TIER not set (default: hidden)
