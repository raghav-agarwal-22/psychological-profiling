-- AlterTable: add profile_id and prompt to journal_entries
ALTER TABLE "journal_entries" ADD COLUMN "profile_id" TEXT;
ALTER TABLE "journal_entries" ADD COLUMN "prompt" TEXT;

-- CreateIndex
CREATE INDEX "journal_entries_profile_id_idx" ON "journal_entries"("profile_id");

-- AddForeignKey
ALTER TABLE "journal_entries" ADD CONSTRAINT "journal_entries_profile_id_fkey" FOREIGN KEY ("profile_id") REFERENCES "profiles"("id") ON DELETE SET NULL ON UPDATE CASCADE;
