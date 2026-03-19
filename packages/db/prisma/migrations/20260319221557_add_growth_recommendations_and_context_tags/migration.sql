-- AlterTable
ALTER TABLE "sessions" ADD COLUMN     "context_tags" TEXT[] DEFAULT ARRAY[]::TEXT[];

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "growth_recommendations" JSONB,
ADD COLUMN     "recommendations_generated_at" TIMESTAMP(3);
