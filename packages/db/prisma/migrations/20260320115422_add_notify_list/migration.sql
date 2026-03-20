-- CreateTable
CREATE TABLE "notify_list" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "source" TEXT NOT NULL DEFAULT 'prelaunch_notify',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "notify_list_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "notify_list_email_key" ON "notify_list"("email");
