# ─── Stage 1: Build ──────────────────────────────────────────────────────────
FROM node:20-slim AS builder

RUN corepack enable && corepack prepare pnpm@9.1.0 --activate

WORKDIR /app

# Copy workspace config first for better layer caching
COPY pnpm-workspace.yaml pnpm-lock.yaml package.json turbo.json tsconfig.base.json ./
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

RUN apt-get update && apt-get install -y openssl && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Copy everything needed from builder
COPY --from=builder /app/node_modules node_modules
COPY --from=builder /app/packages/db/dist packages/db/dist
COPY --from=builder /app/packages/db/package.json packages/db/package.json
COPY --from=builder /app/packages/db/prisma packages/db/prisma
COPY --from=builder /app/packages/db/node_modules packages/db/node_modules
COPY --from=builder /app/packages/types packages/types
COPY --from=builder /app/apps/api/dist apps/api/dist
COPY --from=builder /app/apps/api/package.json apps/api/package.json
COPY --from=builder /app/apps/api/node_modules apps/api/node_modules
COPY --from=builder /app/package.json package.json
COPY --from=builder /app/pnpm-workspace.yaml pnpm-workspace.yaml

ENV NODE_ENV=production
ENV PORT=3001

EXPOSE 3001

CMD ["sh", "-c", "node_modules/.bin/prisma migrate deploy --schema packages/db/prisma/schema.prisma && node apps/api/dist/index.js"]
