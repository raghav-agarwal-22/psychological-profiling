-- AlterTable: add UTM attribution fields and first paid date to users
ALTER TABLE "users"
  ADD COLUMN "utm_source"   TEXT,
  ADD COLUMN "utm_medium"   TEXT,
  ADD COLUMN "utm_campaign" TEXT,
  ADD COLUMN "first_paid_at" TIMESTAMP(3);
