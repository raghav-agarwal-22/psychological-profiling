-- AlterTable
ALTER TABLE "users" ADD COLUMN     "email_digest_opt_in" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "last_digest_sent_at" TIMESTAMP(3);
