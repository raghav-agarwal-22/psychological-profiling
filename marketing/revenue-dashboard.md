# Innermind Revenue Dashboard
> Auto-generated on 2026-03-20 · Source: `/api/admin/revenue` + `/api/admin/funnel`
> Data source: Database estimates (Stripe not configured)

---

## Current State

| Metric | Value |
|--------|-------|
| **MRR** | $0 |
| **ARR** | $0 |
| **ARR goal progress** | 0.0% ($0 / $100,000) |
| **Paying users** | 0 paid + 0 trialing |
| **Total registered users** | 10 |
| **Free → paid conversion** | 0.0% |
| **Monthly churn rate** | N/A (no churn data yet) |
| **Estimated LTV** | $228 |
| **Days since first payment** | Pre-revenue |

### ARR Progress to $100k Goal

```
░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░ 0.0%
$0 of $100,000 ARR
```

---

## MRR Movement (Last 30 Days)

| Metric | Value |
|--------|-------|
| New MRR | $0 |
| Churned MRR | $0 |
| Net New MRR | $0 |
| New Pro users (30d) | 0 |
| Cancelled (30d) | 0 |

---

## 60-Day Projection

| Metric | Value |
|--------|-------|
| Projected MRR (day 60) | $0 |
| Projection basis | pre-revenue — no projection available yet |
| Gap to $100k ARR | $100,000 ARR = $8,333/mo MRR |
| Additional users needed | ~439 paying users |

### Milestone Tracker

| Milestone | Target | Progress | |
|-----------|--------|----------|--|
| Month 1 target | $1,330/mo | 0% | ░░░░░░░░░░░░░░░░░░░░ |
| Month 2 target | $4,750/mo | 0% | ░░░░░░░░░░░░░░░░░░░░ |
| $100k ARR target | $8,333/mo | 0% | ░░░░░░░░░░░░░░░░░░░░ |

---

## Conversion Funnel

| Stage | Users | Rate |
|-------|-------|------|
| Signed up | 10 | 100% |
| Started assessment | 8 | 80.0% |
| Completed assessment | 8 | 80.0% overall |
| Profile generated | 8 | 100.0% |
| Started trial | 0 | 0.0% |
| Converted to paid | 0 | 0.0% |

**Overall free → paid: 0.0%** (target: >5%)

---

## MRR Timeline

| Date | Running MRR |
|------|-------------|
| — | Pre-revenue |

---

## Acquisition Attribution (Paid Users)

| UTM Source | Users | % of Paid |
|------------|-------|-----------|
| (no paid users yet) | — | — |

---

## At-Risk Subscribers

_No subscribers expiring in the next 7 days._

---

## Targets

| Period | MRR Target | Users | Status |
|--------|------------|-------|--------|
| Month 1 (day 30) | $1,330 | 70 | ⏳ |
| Month 2 (day 60) | $4,750 | 250 | ⏳ |
| Month 3 (day 90) | $8,333 | 440 | ⏳ |
| $100k ARR | $8,333/mo | 440 | ⏳ |

---

_To regenerate: `node scripts/generate-revenue-dashboard.mjs`_
_For live Stripe data, ensure `STRIPE_SECRET_KEY` is set in the API environment._
