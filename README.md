# Innermind

> The most thoughtful platform for self-understanding — combining psychology, reflection, and symbolic wisdom.

## Stack

| Layer | Technology |
|---|---|
| Frontend | Next.js 14 (App Router) + Tailwind CSS |
| Backend | Fastify + TypeScript |
| Database | PostgreSQL + Prisma ORM |
| AI | Anthropic Claude API (`claude-sonnet-4-6`) |
| Monorepo | pnpm workspaces + Turborepo |

## Structure

```
innermind/
├── apps/
│   ├── api/          # Fastify REST API
│   └── web/          # Next.js frontend
├── packages/
│   └── db/           # Prisma schema + client
├── .github/
│   └── workflows/    # GitHub Actions CI
├── docker-compose.yml
└── turbo.json
```

## Getting Started

### Prerequisites

- Node.js >= 20
- pnpm >= 9
- Docker (for local PostgreSQL)

### Setup

```bash
# Install dependencies
pnpm install

# Start the database
docker compose up -d

# Copy env file and configure
cp .env.example .env

# Push schema to database (development)
pnpm db:push

# Run in development mode
pnpm dev
```

The API runs at `http://localhost:3001` and the web app at `http://localhost:3000`.

### Database

```bash
# Open Prisma Studio
pnpm db:studio

# Create a migration
pnpm db:migrate

# Generate Prisma client after schema changes
pnpm db:generate
```

## Core Data Models

- **User** — account, auth, preferences
- **Session** — a sitting of assessments
- **Assessment** — a single instrument (Big Five, Jungian, Values, etc.)
- **Profile** — synthesized psychological profile (versioned)
- **Insight** — actionable, meaningful insight surfaced from a profile
- **JournalEntry** — reflections tied to insights

## Roadmap

See the [full roadmap](https://innermind.app) for Phase 0–4 delivery plan.
