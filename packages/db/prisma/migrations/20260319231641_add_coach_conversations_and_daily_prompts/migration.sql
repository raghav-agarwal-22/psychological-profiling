-- CreateTable
CREATE TABLE "coach_conversations" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "title" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "coach_conversations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "coach_messages" (
    "id" TEXT NOT NULL,
    "conversation_id" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "coach_messages_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "daily_prompts" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "date" TEXT NOT NULL,
    "prompt" TEXT NOT NULL,
    "response" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "daily_prompts_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "coach_conversations_user_id_idx" ON "coach_conversations"("user_id");

-- CreateIndex
CREATE INDEX "coach_messages_conversation_id_idx" ON "coach_messages"("conversation_id");

-- CreateIndex
CREATE INDEX "daily_prompts_user_id_idx" ON "daily_prompts"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "daily_prompts_user_id_date_key" ON "daily_prompts"("user_id", "date");

-- AddForeignKey
ALTER TABLE "coach_conversations" ADD CONSTRAINT "coach_conversations_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "coach_messages" ADD CONSTRAINT "coach_messages_conversation_id_fkey" FOREIGN KEY ("conversation_id") REFERENCES "coach_conversations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "daily_prompts" ADD CONSTRAINT "daily_prompts_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
