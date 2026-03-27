# ─── Stage 1: Build ──────────────────────────────────────────────────────────
FROM node:20-slim AS builder

RUN corepack enable && corepack prepare pnpm@9.1.0 --activate

WORKDIR /app

# Copy workspace config first for better layer caching
COPY pnpm-workspace.yaml pnpm-lock.yaml package.json turbo.json ./
COPY packages/db/package.json packages/db/
COPY packages/types/package.json packages/types/
COPY apps/api/package.json apps/api/

# Install dependencies
RUN pnpm install --frozen-lockfile

# Copy source
COPY packages/ packages/
COPY apps/api/ apps/api/

# Generate Prisma client + build
RUN pnpm --filter @innermind/db db:generate \
 && pnpm --filter @innermind/db build \
 && pnpm --filter @innermind/api build

# ─── Stage 2: Production ────────────────────────────────────────────────────
FROM node:20-slim AS runner

RUN corepack enable && corepack prepare pnpm@9.1.0 --activate \
 && apt-get update && apt-get install -y openssl && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Copy workspace config
COPY pnpm-workspace.yaml pnpm-lock.yaml package.json ./
COPY packages/db/package.json packages/db/
COPY packages/types/package.json packages/types/
COPY apps/api/package.json apps/api/

# Install production deps only
RUN pnpm install --frozen-lockfile --prod

# Copy built artifacts
COPY --from=builder /app/packages/db/dist packages/db/dist
COPY --from=builder /app/packages/db/prisma packages/db/prisma
COPY --from=builder /app/packages/types/dist packages/types/dist
COPY --from=builder /app/apps/api/dist apps/api/dist

# Copy Prisma generated client
COPY --from=builder /app/node_modules/.pnpm/@prisma+client*/node_modules/.prisma node_modules/.pnpm/@prisma+client*/node_modules/.prisma
COPY --from=builder /app/packages/db/node_modules/.prisma packages/db/node_modules/.prisma

ENV NODE_ENV=production
ENV PORT=3001

EXPOSE 3001

# Run migrations then start
CMD ["sh", "-c", "pnpm --filter @innermind/db migrate:deploy && node apps/api/dist/index.js"]
