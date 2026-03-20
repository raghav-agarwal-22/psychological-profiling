-- CreateTable
CREATE TABLE "onboarding_emails" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "email_type" TEXT NOT NULL,
    "sent_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "onboarding_emails_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "onboarding_emails_user_id_idx" ON "onboarding_emails"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "onboarding_emails_user_id_email_type_key" ON "onboarding_emails"("user_id", "email_type");

-- AddForeignKey
ALTER TABLE "onboarding_emails" ADD CONSTRAINT "onboarding_emails_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
