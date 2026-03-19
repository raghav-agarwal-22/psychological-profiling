.PHONY: dev dev-up dev-down db-reset migrate migrate-test seed logs

# ─── Dev Environment ──────────────────────────────────────────────────────────

## Start all dev services (Docker + API + Web)
dev: dev-up
	pnpm dev

## Start Docker services only
dev-up:
	docker compose up -d
	@echo "Waiting for PostgreSQL to be ready..."
	@until docker compose exec -T postgres pg_isready -U innermind -d innermind_dev > /dev/null 2>&1; do sleep 1; done
	@echo "PostgreSQL is ready."

## Stop Docker services
dev-down:
	docker compose down

# ─── Database ─────────────────────────────────────────────────────────────────

## Reset dev database: drop, recreate, and run migrations
db-reset:
	docker compose exec -T postgres psql -U innermind -c "DROP DATABASE IF EXISTS innermind_dev;"
	docker compose exec -T postgres psql -U innermind -c "CREATE DATABASE innermind_dev;"
	$(MAKE) migrate
	@echo "Dev database reset complete."

## Run Prisma migrations on dev database
migrate:
	cd packages/db && pnpm prisma migrate dev

## Run Prisma migrations on test database
migrate-test:
	cd packages/db && DATABASE_URL=$$DATABASE_URL_TEST pnpm prisma migrate deploy

## Seed dev database
seed:
	cd packages/db && pnpm prisma db seed

## Generate Prisma client
prisma-generate:
	cd packages/db && pnpm prisma generate

## View Docker service logs
logs:
	docker compose logs -f
