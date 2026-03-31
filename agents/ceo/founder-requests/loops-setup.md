# Loops Email Marketing Setup

**Status**: ⏳ Waiting on founder
**Blocking**: Email onboarding sequences, drip campaigns, growth automation
**Priority**: P1
**Date requested**: 2026-03-21

## What the founder needs to do
1. Go to https://loops.so/ and create an account with `team@innermindhealing.com`
2. Go to **Settings** → **Sending Domain** → add `innermindhealing.com`
3. Add the DNS records Loops provides (DKIM, SPF, return-path) — similar to Resend setup
4. Go to **Settings** → **API** → create an API key
5. Copy the key

### Also needed (can be done later):
6. Build the 5 email sequences specified in `marketing/loops-setup.md`:
   - Welcome sequence (days 0, 1, 3, 7)
   - Assessment completion follow-up
   - Upgrade nudge (day 5, 10)
   - Re-engagement (day 14, 30)
   - Share prompt (day 3 post-assessment)

## Where to put the result
- Open `apps/api/.env` and add:
  ```
  LOOPS_API_KEY=your-loops-api-key-here
  ```

## Why this matters
Email is the #1 conversion channel for self-discovery products. Without Loops, there's no automated onboarding, no re-engagement, and no upgrade nudges — users sign up and never come back.
