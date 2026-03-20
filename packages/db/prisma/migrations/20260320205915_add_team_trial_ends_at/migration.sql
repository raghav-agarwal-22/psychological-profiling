-- DropIndex
DROP INDEX "team_members_team_id_user_id_key";

-- AlterTable
ALTER TABLE "team_members" ALTER COLUMN "role" SET DEFAULT 'client';

-- AlterTable
ALTER TABLE "teams" ADD COLUMN     "trial_ends_at" TIMESTAMP(3);
