# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

Innermind — a psychological assessment platform combining AI-synthesized personality profiles, longitudinal tracking, and growth insights. Freemium SaaS with three subscription tiers (free, essential, pro).

## Tech Stack

- **Monorepo**: pnpm 9+ workspaces, Turborepo, Node >= 20
- **API** (`apps/api`): Fastify 4, TypeScript (ESM), JWT auth, Zod validation, Stripe billing, Resend email, Anthropic Claude API for profile synthesis
- **Web** (`apps/web`): Next.js 14 App Router, React 18, Tailwind CSS, Recharts, PostHog analytics
- **DB** (`packages/db`): PostgreSQL 16, Prisma 5 ORM
- **Types** (`packages/types`): Shared enums and interfaces (source-only, no build step)

## Commands

```bash
# Development
pnpm dev                    # Run API (port 3001) + Web (port 3000) in parallel
make dev                    # Docker postgres + pnpm dev
make dev-up / dev-down      # Start/stop Docker postgres only

# Building
pnpm build                  # Build all via Turbo
pnpm typecheck              # TypeScript strict check all packages
pnpm lint                   # ESLint all packages

# Testing
pnpm test                   # Run all tests (Vitest)
cd apps/api && pnpm test    # API tests only
cd apps/api && pnpm test:watch  # Interactive test watcher

# Database
pnpm db:generate            # Regenerate Prisma client after schema changes
pnpm db:push                # Push schema to dev DB (no migration files)
pnpm db:migrate             # Create and run a migration
pnpm db:studio              # Open Prisma Studio web UI
make db-reset               # Drop, recreate, and migrate dev DB
```

## Architecture

### API Route Pattern
Routes live in `apps/api/src/routes/*.ts` — each file registers Fastify routes. Auth middleware: `requireAuth()` (JWT), `requirePro()` / `requireEssentialOrPro()` for tier gating. Stripe webhook route uses raw body parsing for signature verification.

### Profile Generation Pipeline
`apps/api/src/lib/profile-generator.ts` calls Claude API to synthesize narrative profiles from assessment scores. Each of the 11 assessment types (Big Five, Enneagram, Jungian Archetypes, Values Inventory, Shadow Work, Attachment Style, Light/Dark Triad, Moral Foundations, Life Satisfaction, Strengths, Custom) has a dedicated narrative generator. Profiles are versioned with `version` + `isLatest` fields for longitudinal tracking.

### Authentication Flow
Passwordless magic link: user requests link → token stored in `MagicLinkToken` (15-min expiry) → email sent via Resend (or logged in dev with `SKIP_EMAIL=true`) → token verified → JWT issued.

### Frontend Patterns
- App Router file-based routing in `apps/web/src/app/`
- `src/middleware.ts` handles affiliate cookie capture (90-day attribution)
- Analytics: PostHog provider + GTM + Meta Pixel components
- Suspense boundaries required for pages using `useSearchParams`

### Database Schema
Core chain: `User → Session → Assessment → Profile/Insight → JournalEntry`. JSONB fields (`dimensions`, `archetypes`, `rawOutput`) store nested AI-generated data. Composite indexes on `userId + timestamp` for query performance. Cascading deletes on foreign keys.

### Email System
30+ React Email templates in `apps/api/src/emails/`. Drip sequences (welcome, assessment nudge, pro upsell, journal prompts, re-engagement) orchestrated via `src/lib/drip-sequences.ts` and processed at `/api/drip/process` (protected by `CRON_SECRET`).

## Deployment

- **Web**: Vercel (configured in `vercel.json` — builds from `apps/web`, must generate Prisma client and build `@innermind/db` first)
- **API**: Railway (multi-stage `Dockerfile` — builder generates Prisma client, runner is Node 20 slim)
- **CI**: GitHub Actions — lint/typecheck → test (with Postgres service) → build → deploy on main

## Key Conventions

- TypeScript ESM throughout (`"type": "module"` in API and packages)
- Shared types in `packages/types/src/index.ts` — import as `@innermind/types`
- Database client from `packages/db` — import as `@innermind/db`
- Zod schemas for request validation in API routes
- `next.config.mjs` has `typescript.ignoreBuildErrors: true` (type errors won't block web builds)
- Environment: `.env` files per app (`apps/api/.env`, `apps/web/.env.local`); see `.env.example` for required vars

## Behavioral Guidelines

**Tradeoff:** These guidelines bias toward caution over speed.
For trivial tasks, use judgment.

### 1. Think Before Coding

**Don't assume. Don't hide confusion. Surface tradeoffs.**

Before implementing:
- State your assumptions explicitly. If uncertain, ask.
- If multiple interpretations exist, present them. Don't pick silently.
- If a simpler approach exists, say so. Push back when warranted.
- If something is unclear, stop. Name what's confusing. Ask.

### 2. Simplicity First

**Minimum code that solves the problem. Nothing speculative.**

- No features beyond what was asked.
- No abstractions for single-use code.
- No "flexibility" or "configurability" that wasn't requested.
- No error handling for impossible scenarios.
- If you write 200 lines and it could be 50, rewrite it.

Ask yourself: "Would a senior engineer say this is overcomplicated?"
If yes, simplify.

### 3. Surgical Changes

**Touch only what you must. Clean up only your own mess.**

When editing existing code:
- Don't "improve" adjacent code, comments, or formatting.
- Don't refactor things that aren't broken.
- Match existing style, even if you'd do it differently.
- If you notice unrelated dead code, mention it. Don't delete it.

When your changes create orphans:
- Remove imports/variables/functions that YOUR changes made unused.
- Don't remove pre-existing dead code unless asked.

The test: every changed line should trace directly to the user's request.

### 4. Goal-Driven Execution

**Define success criteria. Loop until verified.**

Transform tasks into verifiable goals:
- "Add validation" → "Write tests for invalid inputs, then make them pass"
- "Fix the bug" → "Write a test that reproduces it, then make it pass"
- "Refactor X" → "Ensure tests pass before and after"

For multi-step tasks, state a brief plan:
1. [Step] → verify: [check]
2. [Step] → verify: [check]
3. [Step] → verify: [check]

Strong success criteria let you loop independently.
Weak criteria ("make it work") require constant clarification.

---

**These guidelines are working if:** fewer unnecessary changes in diffs,
fewer rewrites due to overcomplication, and clarifying questions come
before implementation rather than after mistakes.
