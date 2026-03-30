# Innermind Financial Model
**Prepared:** March 23, 2026
**Author:** CFO Agent
**Status:** v1.0 — Founder-ready
**Related:** [INN-270](/INN/issues/INN-270), [INN-224](/INN/issues/INN-224)

---

## 1. LTV / CAC Model

### Lifetime Value at $19/mo

LTV = Average Monthly Revenue ÷ Monthly Churn Rate

| Monthly Churn | Avg Lifetime | LTV per User | Notes |
|---------------|-------------|--------------|-------|
| 3% | 33 months | **$627** | Excellent retention (target: <5%) |
| 5% | 20 months | **$380** | Our stated churn target |
| 7% | 14 months | **$272** | Acceptable for early stage |
| 10% | 10 months | **$190** | Danger zone — fix product, not price |
| 15% | 7 months | **$127** | Churn crisis — requires intervention |

**Baseline LTV: $380 at 5% monthly churn.**

### CAC Budget — What We Can Spend to Acquire a User

Rule of thumb: LTV:CAC ≥ 3× for a healthy SaaS business.

| LTV | 3× Rule Max CAC | Payback Period |
|-----|-----------------|----------------|
| $380 (5% churn) | **$127** | 6.7 months |
| $627 (3% churn) | **$209** | 11 months |

**Today's actual CAC = ~$0.** We have no paid acquisition. Every user from SEO, Reddit, Product Hunt, and organic is essentially free. This is a strong position — even a single $1k marketing spend becomes ROI-positive as long as it converts ≥ 8 users.

When we start paid acquisition:
- **Google/Meta ads:** Stay under $50 CAC to maintain 7.5× LTV:CAC
- **Newsletter sponsorships:** Typically $2-10 CPM → very viable if conversion rate ≥ 0.5%
- **Influencer deals:** One-time fee; break even if deal brings ≥ 10 subscribers

---

## 2. Launch Day Scenarios (Product Hunt)

### Conversion Matrix: Visitors × Conversion Rate = Day-1 New Subscribers

| Visitors | 1% (weak launch) | 2% (solid launch) | 5% (top 5 product) |
|----------|-------------------|--------------------|--------------------|
| 500 | 5 users → **$95 MRR** | 10 users → **$190 MRR** | 25 users → **$475 MRR** |
| 1,000 | 10 users → **$190 MRR** | 20 users → **$380 MRR** | 50 users → **$950 MRR** |
| 2,000 | 20 users → **$380 MRR** | 40 users → **$760 MRR** | 100 users → **$1,900 MRR** |

**Note:** These are paid conversions (Stripe checkout completed). The free-to-paid funnel is separate — PH visitors may sign up free and convert later.

### Realistic Day-1 Expectation

A solid Product Hunt launch for a niche tool like Innermind: **500-1,500 visitors, 1-2% direct paid conversion.**

- Conservative: 500 visitors × 1.5% = 8 users → **$152 MRR**
- Base case: 1,000 visitors × 2% = 20 users → **$380 MRR**
- Optimistic: 1,500 visitors × 3% = 45 users → **$855 MRR**

**Launch day MRR target: $380 (20 paying users).** Exceeding this means we have viral lift.

### Free Registrations on Launch Day (the bigger number)

If 1,000 PH visitors → 15-25% will complete free assessment → 150-250 free users added.

At our 5% free→paid target, that's **8-12 additional paid conversions within 30 days of launch.** The PH launch builds the funnel; revenue trails by 2-4 weeks.

---

## 3. Annual Plan Analysis — Should We Offer $149/yr?

### The Numbers

| Metric | Monthly ($19/mo) | Annual at $149/yr | Annual at $190/yr (2 months free) |
|--------|-----------------|--------------------|------------------------------------|
| Monthly equivalent | $19.00 | $12.42 | $15.83 |
| Annual revenue/user | $228 | $149 | $190 |
| Discount vs. monthly | — | 35% | 17% |
| Revenue premium vs. monthly | — | −$79/yr | −$38/yr |

### The Case For Annual at $149/yr

1. **Cash upfront.** $149 today vs. drip of $19/month. For a bootstrapped startup, $149 upfront at launch = runway.
2. **Churn elimination.** Annual subscribers cannot churn for 12 months. Effective churn = ~0% for the year.
3. **LTV boost (if they renew).** An annual user who renews twice = $447 vs. $380 LTV at 5% monthly churn.
4. **Conversion signal.** Annual buyers are your most committed users — they become advocates.

### The Case Against $149/yr

1. **ARPU dilution.** If 30% of buyers take annual: blended ARPU = 0.3 × $12.42 + 0.7 × $19 = **$17.03**. That's $2/user/month left on the table.
2. **MRR recognition.** Annual revenue recognized monthly in MRR math → inflates subscriber count without inflating MRR.

### Blended ARPU at Different Annual Mix Rates

| % Taking Annual | Blended ARPU | Δ vs. All Monthly |
|-----------------|-------------|-------------------|
| 0% | $19.00 | baseline |
| 20% | $18.12 | −$0.88/user/mo |
| 30% | $17.68 | −$1.32/user/mo |
| 50% | $16.21 | −$2.79/user/mo |

### Recommendation: **Yes — offer annual at $149/yr, but position monthly as the default.**

- Show $19/mo as the headline price
- Offer annual as "Save $79 when you commit to a year"
- Expect 20-30% of buyers to take annual (industry benchmark: 20-40% for consumer subscriptions)
- The upfront cash and churn reduction outweigh the ARPU dilution at early stage

**Future pricing:** If churn exceeds 7% consistently, shift to $129/yr (32% discount) to nudge more users to annual. If churn is <3%, raise annual to $190/yr (2 months free) and capture more revenue per user.

---

## 4. Break-Even Analysis

### Monthly Cost Structure

| Cost | Amount | Type | Notes |
|------|--------|------|-------|
| Railway (API server) | $20/mo | Fixed | Scales with usage after ~1k users |
| Railway (PostgreSQL) | $10/mo | Fixed | Included in $5-20 plan |
| Vercel (web) | $0/mo | Fixed | Free tier sufficient to ~10k visitors/mo |
| PostHog (analytics) | $0/mo | Fixed | Free tier: 1M events/mo |
| Resend (email) | $20/mo | Fixed | Free to 3k emails, then $20/mo |
| Domain | $1/mo | Fixed | ~$12/yr |
| **Total Fixed Costs** | **$51/mo** | | Rounds to $60/mo with buffer |
| Anthropic API (AI features) | ~$1.00/user/mo | Variable | Assessment + coach + synthesis |

**Total fixed: ~$60/month. Variable: ~$1.00 per active Pro user per month.**

### Break-Even Calculation

Contribution margin per user = $19.00 − $1.00 = **$18.00/user/month**

Break-even users = Fixed Costs ÷ Contribution Margin = $60 ÷ $18 = **~4 users**

**We break even at 4 paying subscribers.** This is not the bottleneck — growth is.

### Infrastructure Scale Points

| Subscribers | Anthropic API Cost | Railway Upgrade | Total Monthly Cost | Net Margin |
|-------------|-------------------|-----------------|-------------------|------------|
| 10 | $10 | — | $70 | $120 (63%) |
| 50 | $50 | — | $110 | $840 (88%) |
| 100 | $100 | — | $160 | $1,740 (92%) |
| 250 | $250 | — | $310 | $4,440 (93%) |
| 440 | $440 | +$20 | $520 | $7,820 (94%) |
| 1,000 | $1,000 | +$50 | $1,110 | $17,890 (94%) |

> At 440 users ($100k ARR run rate), **we keep ~94 cents of every dollar.** Margin is exceptional.

---

## 5. MRR Roadmap to $10k

### Monthly Targets (Net New Subscribers Required)

| Day | MRR Target | Paying Users | Net New Users This Period | Assumed Churn |
|-----|-----------|-------------|--------------------------|---------------|
| Launch | $190 | 10 | 10 | — |
| Day 30 | $1,330 | 70 | +60 | 0 |
| Day 60 | $4,750 | 250 | +180 | ~4 |
| Day 90 | $8,333 | 440 | +190 | ~13 |
| Day 105 | $10,013 | 527 | +87 | ~22 |

**$10k MRR requires 527 paying users.** At $19/mo, that's the milestone.

### Growth Rate Required

To go from 10 users (Day 1) to 527 users (Day 105):
- Required CAGR equivalent: ~53× in 105 days
- Weekly net new users needed: ~35/week sustained over 15 weeks
- Requires ~700 weekly free signups at 5% conversion

### Free-to-Paid Funnel Math

| Registered Free Users | Conversion Rate | Paying Users |
|-----------------------|-----------------|-------------|
| 1,000 | 3% | 30 |
| 1,000 | 5% | 50 |
| 5,000 | 3% | 150 |
| 5,000 | 5% | 250 |
| 10,000 | 5% | 500 |
| 10,000 | 7% | 700 |

**To reach 527 paying users, we need either:**
- 10,540 total registered users at 5% conversion, or
- 7,530 users at 7% conversion (if product is highly compelling)

### Traffic Required to Hit 10k Registered Users

If 30% of website visitors start the free assessment, and 70% complete it:
- Visitors needed: 10,000 ÷ 0.30 ÷ 0.70 = ~48,000 total visitors

At current SEO trajectory + PH launch + Reddit + affiliate, this is achievable in 90-105 days.

---

## 6. Key Financial Metrics to Track Weekly

| Metric | Target | Red Flag | Data Source |
|--------|--------|----------|-------------|
| MRR | Per roadmap above | <50% of target | Stripe Dashboard |
| Monthly Churn Rate | <5% | >7% | Stripe cancellations |
| Free→Paid Conversion | >5% | <2% | PostHog funnel |
| LTV:CAC Ratio | >5× | <3× | Stripe + ad spend |
| Blended ARPU | >$17 | <$15 | Stripe MRR ÷ subscribers |
| Net Revenue Retention | >95% | <90% | Stripe (upgrades − cancels) |
| Gross Margin | >90% | <80% | (MRR − API costs) ÷ MRR |

---

## 7. Critical Assumptions & Risks

| Assumption | Confidence | Risk if Wrong | Mitigation |
|-----------|-----------|---------------|------------|
| $19/mo conversion rate ≥ 5% | Medium | Miss MRR targets by 2× | Test $14/mo if stuck below 3% |
| Monthly churn ≤ 5% | Medium | LTV drops to $272, roadmap extends | Improve onboarding + journal engagement |
| Anthropic API ≤ $1/user/mo | High | Margin compression at scale | Monitor API costs per user; cache aggressively |
| PH launch brings ≥ 500 visitors | Medium | Day-1 MRR disappoints | Pre-build hunter relationships; plan backup channels |
| Annual plan mix ≤ 30% | Medium | ARPU dilutes faster than expected | Monitor mix monthly; can remove annual offer |

---

## Summary — What This Model Says

1. **We break even at 4 users.** The business is profitable almost immediately. Cash is not the problem.
2. **The bottleneck is acquisition.** We need ~48,000 visitors to generate 527 paying users. That's the only number that matters right now.
3. **Offer annual at $149/yr.** The upfront cash and churn elimination are worth the 35% ARPU discount at this stage.
4. **$10k MRR is reachable in 105 days** with consistent weekly growth of 35 net new subscribers.
5. **94% gross margins** mean every dollar of marketing spend compounds massively. $1,000 in influencer spend that converts 10 users = $3,800 LTV.

**The unit economics are excellent. Execution is the variable.**
