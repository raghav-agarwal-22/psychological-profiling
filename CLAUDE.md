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
