# Innermind Paid Ads Infrastructure

## Status

| Channel | Account | Pixel / Tag | First Campaign |
|---------|---------|-------------|----------------|
| Google Ads | ❌ Needs creation | GTM container — env var needed | ❌ Pending |
| Meta (Facebook/Instagram) | ❌ Needs creation | Meta Pixel — env var needed | ❌ Pending |

---

## Required Environment Variables

Add these to Vercel (Production + Preview) and `.env.local` for dev:

```env
# Google Tag Manager container ID (format: GTM-XXXXXXX)
NEXT_PUBLIC_GTM_ID=GTM-XXXXXXX

# Google Ads account ID (format: AW-XXXXXXXXXX)
NEXT_PUBLIC_GOOGLE_ADS_ID=AW-XXXXXXXXXX

# Google Ads conversion labels (create one per conversion action in Google Ads UI)
NEXT_PUBLIC_GOOGLE_ADS_SIGNUP_LABEL=XXXXXXXXXXXX
NEXT_PUBLIC_GOOGLE_ADS_PURCHASE_LABEL=XXXXXXXXXXXX

# Meta Pixel ID (15-digit number from Meta Events Manager)
NEXT_PUBLIC_META_PIXEL_ID=XXXXXXXXXXXXXXX
```

---

## Step 1 — Create Google Ads Account

1. Go to [ads.google.com](https://ads.google.com) → "New campaign"
2. Account email: use the Innermind founder email
3. Business name: **Innermind**
4. Website: `https://innermind.app`
5. Skip campaign creation for now ("Expert mode" → "Create account without campaign")
6. Note the **Customer ID** (format: `XXX-XXX-XXXX`)

### Create Google Tag Manager Container

1. Go to [tagmanager.google.com](https://tagmanager.google.com)
2. Create account → **Innermind**, Container: `innermind.app`, Web
3. Copy the **Container ID** (`GTM-XXXXXXX`)
4. Set `NEXT_PUBLIC_GTM_ID` in Vercel
5. In GTM, connect to Google Ads:
   - Tags → New → Google Ads Conversion Tracking
   - Enter Conversion ID from Google Ads account

### Create Google Ads Conversion Actions

In Google Ads → Tools → Conversions → New conversion action:
1. **Sign-up** (Website) — Category: Sign-up, Value: $0, Count: One
2. **Purchase / Upgrade** (Website) — Category: Purchase, Use different values, Count: One

Copy each conversion label into the env vars above.

---

## Step 2 — Create Meta Ads Account

1. Go to [business.facebook.com](https://business.facebook.com) → Create account
2. Business name: **Innermind**
3. Business email: use founder email
4. Create a new Ad Account under the Business Manager

### Create Meta Pixel

1. Business Manager → Events Manager → Connect Data Sources → Web → Meta Pixel
2. Pixel name: **Innermind Web**
3. Website URL: `https://innermind.app`
4. Choose "Install code manually" (pixel is already in the codebase)
5. Copy the **Pixel ID** (15-digit number)
6. Set `NEXT_PUBLIC_META_PIXEL_ID` in Vercel

### Verify Meta Pixel

1. Install Meta Pixel Helper Chrome extension
2. Visit `https://innermind.app` — should show PageView event
3. Sign up for a test account → should show CompleteRegistration event
4. Upgrade to Pro → should show Purchase event

---

## Step 3 — Verify Conversion Tracking

The tracking code is already implemented at:

| Event | Trigger | GTM dataLayer | Meta Pixel | Google Ads |
|-------|---------|---------------|------------|------------|
| **PageView** | Every page load | — | `PageView` | via GTM |
| **Sign-up** | `/auth/verify` success | `signup_complete` | `CompleteRegistration` | Signup label |
| **Assessment Complete** | Assessment submission | `assessment_complete` | Custom event | — |
| **Purchase** | `/dashboard?upgraded=1` | `purchase` (GA4 ecommerce) | `Purchase` | Purchase label |

Use GTM Preview mode to verify dataLayer events fire correctly before going live.

---

## Step 4 — First Campaigns

### Google Search — Psychology Keywords

**Campaign type:** Search
**Budget:** $20/day to start
**Target CPA goal:** $15 (signup) → $50 (paid conversion)

**Ad groups + keywords:**
```
Ad Group 1: MBTI Alternative
- "free mbti test"
- "mbti personality test"
- "16 personalities test"
- "personality type test"
- [mbti test free online]

Ad Group 2: Personality Assessment
- "personality assessment"
- "personality test free"
- "free personality quiz"
- "best personality test"
- [personality assessment online]

Ad Group 3: Big Five / Psychology
- "big five personality test"
- "ocean personality test"
- "psychology personality test"
- "free psychological assessment"

Ad Group 4: Self-Understanding / Growth
- "know yourself test"
- "self awareness test"
- "personal growth assessment"
- "what personality type am i"
```

**Sample ad copy:**

> **Headline 1:** Go Beyond MBTI — 5 Frameworks
> **Headline 2:** Free Psychological Assessment
> **Headline 3:** AI-Synthesized Personal Portrait
> **Description:** Take 5 science-backed assessments. Get one AI-generated portrait of who you really are. Track your growth over time.
> **URL:** innermind.app

**Landing page:** `/` (homepage) with UTM `utm_source=google&utm_medium=cpc&utm_campaign=search-personality`

---

### Meta (Facebook/Instagram) — Interest Targeting

**Campaign type:** Conversions (optimize for CompleteRegistration)
**Budget:** $20/day
**Objective:** Website conversions

**Audience 1: Psychology / Self-Improvement**
- Interests: Psychology, Self-help, Personal development, Mindfulness
- Behaviors: Engaged shoppers
- Age: 24–45
- Placements: Instagram Feed, Facebook Feed

**Audience 2: MBTI / Personality Fans**
- Interests: Myers-Briggs Type Indicator, Enneagram, 16Personalities
- Lookalike: 1% lookalike of email list (upload when >100 emails)
- Age: 20–40

**Sample creative (video preferred):**
- Hook: "MBTI tells you your 4-letter type. Innermind tells you *why*."
- Show: assessment UI → portrait generation → growth chart
- CTA: "Take the free assessment →"

---

## UTM Tracking Reference

All paid links should use UTMs. The UTM tracking schema is already set up (INN-149).

| Campaign | utm_source | utm_medium | utm_campaign |
|----------|-----------|------------|--------------|
| Google Search | `google` | `cpc` | `search-personality` |
| Google Search Brand | `google` | `cpc` | `search-brand` |
| Meta Feed | `meta` | `paid-social` | `social-awareness` |
| Meta Retargeting | `meta` | `paid-social` | `retarget-signup` |

---

## Budget Allocation (Month 1)

| Channel | Monthly Budget | Goal |
|---------|---------------|------|
| Google Search | $600 | 40 signups @ $15 CPA |
| Meta Awareness | $400 | Brand awareness + retargeting pixel warm-up |
| **Total** | **$1,000** | **Breakeven at 8 Pro conversions** |

At $19/mo Pro pricing, 8 conversions = $152 MRR. CAC payback: ~7 months.
Optimize toward $10 CPA for Google Search once conversion data accumulates.

---

## Reporting

Check weekly:
- Google Ads → Campaigns → Conversions column
- Meta Ads Manager → Reporting → Conversions
- PostHog → Events → `signup_complete`, `purchase` (deduplicated)
- Revenue dashboard: `marketing/revenue-dashboard.md`
