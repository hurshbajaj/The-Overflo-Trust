-- CreateEnum
CREATE TYPE "Role" AS ENUM ('CONSUMER', 'STEWARD');

-- CreateEnum
CREATE TYPE "FreshnessLevel" AS ENUM ('PRIME', 'FRESH', 'STANDARD');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "fullName" TEXT NOT NULL,
    "role" "Role" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Session" (
    "id" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expiresAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Session_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StewardProfile" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "brandName" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "story" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "latitude" DOUBLE PRECISION,
    "longitude" DOUBLE PRECISION,
    "contactEmail" TEXT,
    "contactPhone" TEXT,
    "openHours" TEXT,
    "republicScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "consistencyStreak" INTEGER NOT NULL DEFAULT 0,
    "successfulPickups" INTEGER NOT NULL DEFAULT 0,
    "failedPickups" INTEGER NOT NULL DEFAULT 0,
    "averageRating" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "profileViews" INTEGER NOT NULL DEFAULT 0,
    "totalMealsDonated" INTEGER NOT NULL DEFAULT 0,
    "badge" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "StewardProfile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MenuItem" (
    "id" TEXT NOT NULL,
    "profileId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "details" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "MenuItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Photo" (
    "id" TEXT NOT NULL,
    "profileId" TEXT NOT NULL,
    "imageUrl" TEXT NOT NULL,
    "caption" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Photo_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Rating" (
    "id" TEXT NOT NULL,
    "profileId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "score" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Rating_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Comment" (
    "id" TEXT NOT NULL,
    "profileId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "body" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Comment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DonationEntry" (
    "id" TEXT NOT NULL,
    "profileId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "quantityMeals" INTEGER NOT NULL,
    "description" TEXT NOT NULL,
    "pickupWindow" TEXT NOT NULL,
    "freshness" "FreshnessLevel" NOT NULL,
    "imageUrl" TEXT,
    "proofSource" TEXT,
    "pickupSuccess" BOOLEAN NOT NULL,
    "responseMinutes" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "DonationEntry_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LeaderboardStat" (
    "id" TEXT NOT NULL,
    "profileId" TEXT NOT NULL,
    "rank" INTEGER NOT NULL,
    "score" DOUBLE PRECISION NOT NULL,
    "scoreDelta" DOUBLE PRECISION NOT NULL,
    "viewsDelta" INTEGER NOT NULL,
    "periodLabel" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "LeaderboardStat_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LuckyExposureStat" (
    "id" TEXT NOT NULL,
    "profileId" TEXT NOT NULL,
    "luckyAppearances" INTEGER NOT NULL DEFAULT 0,
    "clickThroughs" INTEGER NOT NULL DEFAULT 0,
    "ratingGrowth" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "popularityGained" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "LuckyExposureStat_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Session_token_key" ON "Session"("token");

-- CreateIndex
CREATE UNIQUE INDEX "StewardProfile_userId_key" ON "StewardProfile"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "StewardProfile_slug_key" ON "StewardProfile"("slug");

-- AddForeignKey
ALTER TABLE "Session" ADD CONSTRAINT "Session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StewardProfile" ADD CONSTRAINT "StewardProfile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MenuItem" ADD CONSTRAINT "MenuItem_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "StewardProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Photo" ADD CONSTRAINT "Photo_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "StewardProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Rating" ADD CONSTRAINT "Rating_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "StewardProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Rating" ADD CONSTRAINT "Rating_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Comment" ADD CONSTRAINT "Comment_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "StewardProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Comment" ADD CONSTRAINT "Comment_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DonationEntry" ADD CONSTRAINT "DonationEntry_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "StewardProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LeaderboardStat" ADD CONSTRAINT "LeaderboardStat_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "StewardProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LuckyExposureStat" ADD CONSTRAINT "LuckyExposureStat_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "StewardProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;
