/*
  Warnings:

  - A unique constraint covering the columns `[profileId]` on the table `LuckyExposureStat` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "LuckyExposureStat_profileId_key" ON "LuckyExposureStat"("profileId");
