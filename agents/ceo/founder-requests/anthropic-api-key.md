# Anthropic API Key

**Status**: ⏳ Waiting on founder
**Blocking**: AI-powered profile synthesis — the core product feature
**Priority**: P0
**Date requested**: 2026-03-21

## What the founder needs to do
1. Go to https://console.anthropic.com/
2. Sign in (or create account)
3. Go to **API Keys** in the sidebar
4. Click **Create Key** → name it `innermind-dev`
5. Copy the key (starts with `sk-ant-...`)
6. Add billing/credits if needed — the free tier may not be sufficient for dev testing

## Where to put the result
- Open `apps/api/.env` and replace the placeholder:
  ```
  ANTHROPIC_API_KEY=sk-ant-your-real-key-here
  ```

## Why this matters
The entire psychological profile synthesis runs through the Anthropic API. Without a real key, users complete assessments but get no AI-generated profile — the core value prop is broken.
