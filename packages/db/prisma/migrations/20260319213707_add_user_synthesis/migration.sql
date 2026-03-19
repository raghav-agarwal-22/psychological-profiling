-- CreateEnum
CREATE TYPE "SessionStatus" AS ENUM ('IN_PROGRESS', 'COMPLETED', 'ABANDONED');

-- CreateEnum
CREATE TYPE "AssessmentType" AS ENUM ('BIG_FIVE', 'JUNGIAN_ARCHETYPES', 'VALUES_INVENTORY', 'SHADOW_WORK', 'LIFE_SATISFACTION', 'STRENGTHS', 'ATTACHMENT_STYLE', 'CUSTOM');

-- CreateEnum
CREATE TYPE "AssessmentStatus" AS ENUM ('NOT_STARTED', 'IN_PROGRESS', 'COMPLETED', 'SKIPPED');

-- CreateEnum
CREATE TYPE "InsightType" AS ENUM ('PATTERN', 'STRENGTH', 'BLIND_SPOT', 'VALUE_ALIGNMENT', 'VALUE_CONFLICT', 'ARCHETYPE', 'GROWTH_EDGE', 'REFLECTION');

-- CreateEnum
CREATE TYPE "LifeDomain" AS ENUM ('WORK', 'RELATIONSHIPS', 'HEALTH', 'CREATIVITY', 'MEANING', 'FINANCES', 'FAMILY', 'PERSONAL_GROWTH');

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT,
    "avatar_url" TEXT,
    "timezone" TEXT NOT NULL DEFAULT 'UTC',
    "locale" TEXT NOT NULL DEFAULT 'en',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "synthesis" TEXT,
    "synthesis_generated_at" TIMESTAMP(3),

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "magic_link_tokens" (
    "id" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "expires_at" TIMESTAMP(3) NOT NULL,
    "used_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "magic_link_tokens_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sessions" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "title" TEXT,
    "status" "SessionStatus" NOT NULL DEFAULT 'IN_PROGRESS',
    "started_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "completed_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "sessions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "assessment_templates" (
    "id" TEXT NOT NULL,
    "type" "AssessmentType" NOT NULL,
    "version" TEXT NOT NULL DEFAULT '1.0',
    "title" TEXT NOT NULL,
    "description" TEXT,
    "question_bank" JSONB NOT NULL,
    "scoring_config" JSONB NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "assessment_templates_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "assessments" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "session_id" TEXT NOT NULL,
    "template_id" TEXT,
    "type" "AssessmentType" NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "status" "AssessmentStatus" NOT NULL DEFAULT 'NOT_STARTED',
    "current_step" INTEGER NOT NULL DEFAULT 0,
    "total_steps" INTEGER,
    "raw_responses" JSONB NOT NULL DEFAULT '{}',
    "metadata" JSONB NOT NULL DEFAULT '{}',
    "started_at" TIMESTAMP(3),
    "completed_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "assessments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "assessment_responses" (
    "id" TEXT NOT NULL,
    "assessment_id" TEXT NOT NULL,
    "question_id" TEXT NOT NULL,
    "value" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "assessment_responses_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "profiles" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "version" INTEGER NOT NULL DEFAULT 1,
    "is_latest" BOOLEAN NOT NULL DEFAULT true,
    "summary" TEXT NOT NULL,
    "dimensions" JSONB NOT NULL,
    "archetypes" JSONB NOT NULL DEFAULT '[]',
    "values" JSONB NOT NULL DEFAULT '[]',
    "blind_spots" JSONB NOT NULL DEFAULT '[]',
    "strengths" JSONB NOT NULL DEFAULT '[]',
    "raw_output" JSONB NOT NULL,
    "generated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "is_public" BOOLEAN NOT NULL DEFAULT false,
    "share_token" TEXT,

    CONSTRAINT "profiles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "insights" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "profile_id" TEXT,
    "assessment_id" TEXT,
    "type" "InsightType" NOT NULL,
    "title" TEXT NOT NULL,
    "body" TEXT NOT NULL,
    "symbol" TEXT,
    "domain" "LifeDomain",
    "is_read" BOOLEAN NOT NULL DEFAULT false,
    "is_saved" BOOLEAN NOT NULL DEFAULT false,
    "reactions" JSONB NOT NULL DEFAULT '{}',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "insights_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "journal_entries" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "insight_id" TEXT,
    "title" TEXT,
    "body" TEXT NOT NULL,
    "mood" INTEGER,
    "tags" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "journal_entries_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "magic_link_tokens_token_key" ON "magic_link_tokens"("token");

-- CreateIndex
CREATE INDEX "magic_link_tokens_token_idx" ON "magic_link_tokens"("token");

-- CreateIndex
CREATE INDEX "magic_link_tokens_user_id_idx" ON "magic_link_tokens"("user_id");

-- CreateIndex
CREATE INDEX "sessions_user_id_idx" ON "sessions"("user_id");

-- CreateIndex
CREATE INDEX "sessions_user_id_completed_at_idx" ON "sessions"("user_id", "completed_at");

-- CreateIndex
CREATE UNIQUE INDEX "assessment_templates_type_version_key" ON "assessment_templates"("type", "version");

-- CreateIndex
CREATE INDEX "assessments_user_id_idx" ON "assessments"("user_id");

-- CreateIndex
CREATE INDEX "assessments_session_id_idx" ON "assessments"("session_id");

-- CreateIndex
CREATE INDEX "assessments_template_id_idx" ON "assessments"("template_id");

-- CreateIndex
CREATE INDEX "assessment_responses_assessment_id_idx" ON "assessment_responses"("assessment_id");

-- CreateIndex
CREATE UNIQUE INDEX "assessment_responses_assessment_id_question_id_key" ON "assessment_responses"("assessment_id", "question_id");

-- CreateIndex
CREATE UNIQUE INDEX "profiles_share_token_key" ON "profiles"("share_token");

-- CreateIndex
CREATE INDEX "profiles_user_id_idx" ON "profiles"("user_id");

-- CreateIndex
CREATE INDEX "profiles_user_id_is_latest_idx" ON "profiles"("user_id", "is_latest");

-- CreateIndex
CREATE INDEX "profiles_share_token_idx" ON "profiles"("share_token");

-- CreateIndex
CREATE INDEX "insights_user_id_idx" ON "insights"("user_id");

-- CreateIndex
CREATE INDEX "insights_user_id_type_idx" ON "insights"("user_id", "type");

-- CreateIndex
CREATE INDEX "insights_user_id_domain_idx" ON "insights"("user_id", "domain");

-- CreateIndex
CREATE INDEX "journal_entries_user_id_idx" ON "journal_entries"("user_id");

-- AddForeignKey
ALTER TABLE "magic_link_tokens" ADD CONSTRAINT "magic_link_tokens_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sessions" ADD CONSTRAINT "sessions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "assessments" ADD CONSTRAINT "assessments_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "assessments" ADD CONSTRAINT "assessments_session_id_fkey" FOREIGN KEY ("session_id") REFERENCES "sessions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "assessments" ADD CONSTRAINT "assessments_template_id_fkey" FOREIGN KEY ("template_id") REFERENCES "assessment_templates"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "assessment_responses" ADD CONSTRAINT "assessment_responses_assessment_id_fkey" FOREIGN KEY ("assessment_id") REFERENCES "assessments"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "profiles" ADD CONSTRAINT "profiles_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "insights" ADD CONSTRAINT "insights_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "insights" ADD CONSTRAINT "insights_profile_id_fkey" FOREIGN KEY ("profile_id") REFERENCES "profiles"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "insights" ADD CONSTRAINT "insights_assessment_id_fkey" FOREIGN KEY ("assessment_id") REFERENCES "assessments"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "journal_entries" ADD CONSTRAINT "journal_entries_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
