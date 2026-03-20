-- AlterTable: extend Team for professional workspace
ALTER TABLE "teams" ADD COLUMN "type" TEXT NOT NULL DEFAULT 'professional';
ALTER TABLE "teams" ADD COLUMN "seat_limit" INTEGER NOT NULL DEFAULT 3;
ALTER TABLE "teams" ADD COLUMN "professional_tier" TEXT NOT NULL DEFAULT 'starter';

-- AlterTable: extend TeamMember for client invite flow
ALTER TABLE "team_members" DROP CONSTRAINT IF EXISTS "team_members_team_id_user_id_key";

ALTER TABLE "team_members" ALTER COLUMN "user_id" DROP NOT NULL;
ALTER TABLE "team_members" ADD COLUMN IF NOT EXISTS "role" TEXT NOT NULL DEFAULT 'client';
ALTER TABLE "team_members" ADD COLUMN "invite_token" TEXT;
ALTER TABLE "team_members" ADD COLUMN "invite_email" TEXT;
ALTER TABLE "team_members" ADD COLUMN "invite_status" TEXT NOT NULL DEFAULT 'pending';
ALTER TABLE "team_members" ADD COLUMN "invited_at" TIMESTAMP(3);
ALTER TABLE "team_members" ADD COLUMN "practitioner_notes" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "team_members_invite_token_key" ON "team_members"("invite_token");
CREATE INDEX "team_members_team_id_idx" ON "team_members"("team_id");
CREATE INDEX "team_members_user_id_idx" ON "team_members"("user_id");
