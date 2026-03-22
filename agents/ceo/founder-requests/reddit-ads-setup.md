# Reddit Ads Campaign Setup

**Status**: ⏳ Waiting on founder
**Blocking**: INN-223 — Reddit Ads test campaign ($200–300 budget)
**Priority**: P1
**Date requested**: 2026-03-22

## What the founder needs to do

### Step 1: Create Reddit Ads Account
1. Go to https://ads.reddit.com/
2. Sign in with your Reddit account (or create a new one with `founders@innermind.app`)
3. Click "New Ad Account"
4. Business name: **Innermind**
5. Add billing: credit card for $50/day spend
6. Note your **Account ID** (shown in the URL)

### Step 2: Create the Campaign

**Campaign settings:**
- Objective: **Traffic** (to start; switch to Conversions once pixel warms up)
- Campaign name: `innermind-mbti-test-1`
- Budget: **$50/day** (run 5 days = ~$250 total)
- Schedule: Start immediately, end after 5 days

### Step 3: Create 2 Ad Groups

**Ad Group 1: MBTI Communities**
- Targeting type: Communities (subreddit targeting)
- Subreddits: r/MBTI, r/intj, r/infp, r/entp, r/enfp, r/isfp, r/infj
- Age: 18–35
- Device: All

**Ad Group 2: Psychology / Self-Improvement**
- Targeting type: Communities + Interests
- Subreddits: r/psychology, r/selfimprovement, r/personalitytypes, r/Jung
- Interests: Personal development, Mental health
- Age: 22–40

### Step 4: Create 2 Ads

**Ad 1 (Quiz Hook) — for MBTI communities:**
- Format: Link Ad
- Headline: `Most MBTI tests get you wrong. Here's why.`
- Body text: `4-letter codes miss 90% of your psychology. Innermind combines Big Five, Jungian archetypes, attachment styles, Enneagram, and Schwartz values into one free profile.`
- Call to action: **Learn More**
- Destination URL:
  ```
  https://innermind.app/?utm_source=reddit&utm_medium=paid&utm_campaign=mbti-test&utm_content=quiz-hook
  ```

**Ad 2 (Insight Hook) — for psychology communities:**
- Format: Link Ad
- Headline: `Discover your actual cognitive patterns — not just a letter code`
- Body text: `Full psychological profile across 5 science-backed dimensions. Takes 20 minutes. Free. AI-synthesized portrait that actually explains your behavior.`
- Call to action: **Sign Up**
- Destination URL:
  ```
  https://innermind.app/?utm_source=reddit&utm_medium=paid&utm_campaign=mbti-test&utm_content=insight-hook
  ```

### Step 5: Verify tracking

The UTM parameters above are already captured by the app and sent to PostHog. After launching:
1. Click one of the ad preview URLs
2. Check PostHog → Events → `landing_page_viewed` — should show `source: reddit`, `campaign: mbti-test`
3. No additional pixel setup needed for UTM tracking

### Step 6: Report back after 5 days

Share these numbers so the agent can analyze:
- Total impressions
- CTR (click-through rate)
- Total clicks
- Signups attributed (PostHog → `signup_complete` where `utm_source = reddit`)
- Cost per click

**Scale criteria:** If CPM < $5 and CTR > 0.5%, increase to $100/day.

## Why this matters
Reddit has the highest concentration of our target users (r/MBTI alone has 800k+ members). This $250 test will tell us CAC before committing to larger budgets.
