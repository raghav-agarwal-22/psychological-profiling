# Resend Email API Key

**Status**: ⏳ Waiting on founder
**Blocking**: Magic link authentication, all transactional emails
**Priority**: P0
**Date requested**: 2026-03-21

## What the founder needs to do
1. Go to https://resend.com/
2. Sign up or sign in
3. Go to **API Keys** → **Create API Key**
4. Name it `innermind-dev`, scope to your sending domain
5. Copy the key (starts with `re_...`)
6. **Also**: Go to **Domains** → add and verify `innermindhealing.com` (requires adding DNS records — MX, SPF, DKIM)

## Where to put the result
- Open `apps/api/.env` and replace the placeholder:
  ```
  RESEND_API_KEY=re_your-real-key-here
  ```

## Why this matters
All authentication uses magic links sent via Resend. Without this key, nobody can log in. Transactional emails (profile ready, trial onboarding, demo confirmations) also won't send.
