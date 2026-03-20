# Innermind Affiliate Tracker

**Goal:** 20 affiliates active → 200 referred Pro subscribers → $1,140/mo recurring affiliate-sourced MRR
**Program:** 30% recurring commission · 90-day cookie · monthly payouts via Stripe · min. $25 threshold

---

## Application Pipeline

| # | Creator | Type | Applied | Status | Notes |
|---|---------|------|---------|--------|-------|
| 1 | Joyce Meng | YouTube / Coaching | — | 🔵 Not yet contacted | Tier 1 — email available |
| 2 | Dear Kristin | YouTube | — | 🔵 Not yet contacted | Tier 1 — email available |
| 3 | Psychology Junkie (Susan Storm) | Blog | — | 🔵 Not yet contacted | Tier 1 — contact form |
| 4 | Personality Hacker | Podcast | — | 🔵 Not yet contacted | Tier 1 — email available |
| 5 | Frank James | YouTube | — | 🔵 Not yet contacted | Tier 2 — Ko-fi/Facebook |
| 6 | Objective Personality | YouTube | — | 🔵 Not yet contacted | Tier 2 |
| 7 | Michael Pierce | YouTube | — | 🔵 Not yet contacted | Tier 2 |
| 8 | Typology Podcast | Podcast | — | 🔵 Not yet contacted | Tier 2 |
| 9 | Mental Healness | YouTube | — | 🔵 Not yet contacted | Tier 3 |
| 10 | Derek Van Schaik | YouTube | — | 🔵 Not yet contacted | Tier 3 |
| 11 | PeakYourMind | YouTube | — | 🔵 Not yet contacted | Tier 3 |
| 12 | Practical Psychology | YouTube | — | 🔵 Not yet contacted | Tier 3 |
| 13 | Actualized.org (Leo Gura) | YouTube | — | 🔵 Not yet contacted | Tier 3 |
| 14 | Therapy in a Nutshell | YouTube | — | 🔵 Not yet contacted | Tier 3 |
| 15 | The Knowledge Project | Podcast | — | 🔵 Not yet contacted | Tier 3 |
| 16 | The One You Feed | Podcast | — | 🔵 Not yet contacted | Tier 3 |
| 17 | On Purpose with Jay Shetty | Podcast | — | 🔵 Not yet contacted | Tier 3 |
| 18 | 10% Happier | Podcast | — | 🔵 Not yet contacted | Tier 3 |
| 19 | Dare to Lead | Podcast | — | 🔵 Not yet contacted | Tier 3 |
| 20 | Therapy for Black Girls | Podcast | — | 🔵 Not yet contacted | Tier 3 |

**Status legend:**
| Symbol | Meaning |
|--------|---------|
| 🔵 Not yet contacted | Outreach not sent |
| 📧 Outreach sent | Email/DM sent — awaiting reply |
| 💬 Replied | Creator responded |
| 🤝 Applied | Submitted affiliate application |
| ✅ Active | Link issued, promoting Innermind |
| ❌ Declined | Passed or no response after 3 weeks |

---

## Active Affiliates

| Affiliate | Code | Joined | Clicks | Signups | Active Subs | Monthly Earnings | Status |
|-----------|------|--------|--------|---------|-------------|-----------------|--------|
| *(none yet)* | — | — | — | — | — | — | — |

---

## Monthly Commission Log

| Month | Total Active Affiliates | Total Active Referred Subs | Commissions Paid | Notes |
|-------|------------------------|---------------------------|-----------------|-------|
| 2026-03 | 0 | 0 | $0 | Program launched |

---

## Outreach Priority Order

Send outreach in this sequence (highest expected ROI first):

1. **Joyce Meng** — `joycemeng22@gmail.com` — MBTI practitioner, engaged niche audience
2. **Dear Kristin** — `dear.kristin.mail@gmail.com` — MBTI comedy, also has podcast
3. **Psychology Junkie** — `psychologyjunkie.com/contact-form-1` — blog authority, certified MBTI
4. **Personality Hacker** — `joelmarkwitt@personalityhacker.com` — book authors, podcast hosts
5. **Frank James** — Ko-fi / Facebook (yourboyfj) — 1.3M MBTI subscribers
6. **Objective Personality** — YouTube About section — deep MBTI, serious audience
7. **Michael Pierce** — YouTube About section — Jungian theory, niche credibility
8. **Typology Podcast** — typologypodcast.com — Enneagram specialist
9–20: All others via YouTube About / website contact forms

Use email templates from `marketing/affiliate-program.md`:
- Coaches/therapists: "Outreach Email — Existing Coach/Therapist Contacts"
- Content creators: "Cold Outreach Email — MBTI/Psychology Content Creators (Primary)"
- Podcast hosts: "Cold Outreach Email — Podcast Hosts"

---

## Conversion Benchmarks

| Metric | Target |
|--------|--------|
| Outreach → Reply rate | >20% |
| Reply → Active affiliate rate | >50% |
| Active affiliate avg. referred subs/month | 10 |
| Active affiliate avg. monthly commission | $57/mo (monthly plan) |

---

## Engineering Status

Track implementation progress for required affiliate infrastructure:

| Feature | Status | Notes |
|---------|--------|-------|
| Unique referral codes per affiliate | — | Can reuse INN-185 referral system |
| 90-day cookie attribution | — | |
| `/affiliates/apply` application form | — | |
| Application review queue (admin) | — | |
| Approval email with link | — | |
| Affiliate dashboard (`/affiliates/dashboard`) | — | Clicks, signups, earnings |
| Commission calculation job (1st of month) | — | |
| Stripe payout integration | — | |

---

## Notes

- Full outreach pipeline detail: `marketing/influencer-pipeline.md`
- Affiliate program terms + email copy: `marketing/affiliate-program.md`
- Affiliate landing page: `apps/web/src/app/affiliates/page.tsx`
- Apply link: `https://innermind.app/affiliates/apply`
- Related issues: [INN-191](/INN/issues/INN-191), [INN-161](/INN/issues/INN-161)
