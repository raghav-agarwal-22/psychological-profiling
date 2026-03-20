-- CreateTable
CREATE TABLE "anonymous_sessions" (
    "id" TEXT NOT NULL,
    "guest_token" TEXT NOT NULL,
    "template_id" TEXT NOT NULL,
    "template_type" TEXT NOT NULL,
    "profile_json" JSONB,
    "archetype_name" TEXT,
    "claimed_by_user_id" TEXT,
    "referral_code" TEXT,
    "expires_at" TIMESTAMP(3) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "anonymous_sessions_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "anonymous_sessions_guest_token_key" ON "anonymous_sessions"("guest_token");

-- CreateIndex
CREATE UNIQUE INDEX "anonymous_sessions_claimed_by_user_id_key" ON "anonymous_sessions"("claimed_by_user_id");

-- CreateIndex
CREATE INDEX "anonymous_sessions_guest_token_idx" ON "anonymous_sessions"("guest_token");
