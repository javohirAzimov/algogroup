-- Add gamification fields to User
ALTER TABLE "User" ADD COLUMN "xp"            INTEGER NOT NULL DEFAULT 0;
ALTER TABLE "User" ADD COLUMN "loginStreak"   INTEGER NOT NULL DEFAULT 0;
ALTER TABLE "User" ADD COLUMN "lastLoginDate" TEXT;

-- Badge definitions table
CREATE TABLE "Badge" (
  "id"          SERIAL PRIMARY KEY,
  "key"         TEXT NOT NULL UNIQUE,
  "name"        TEXT NOT NULL,
  "description" TEXT NOT NULL,
  "icon"        TEXT NOT NULL,
  "xpReward"    INTEGER NOT NULL DEFAULT 0
);

-- User → Badge join table (earned badges)
CREATE TABLE "UserBadge" (
  "id"       SERIAL PRIMARY KEY,
  "userId"   INTEGER NOT NULL,
  "badgeId"  INTEGER NOT NULL,
  "earnedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "UserBadge_userId_fkey"  FOREIGN KEY ("userId")  REFERENCES "User"("id")  ON DELETE CASCADE,
  CONSTRAINT "UserBadge_badgeId_fkey" FOREIGN KEY ("badgeId") REFERENCES "Badge"("id") ON DELETE CASCADE,
  UNIQUE ("userId", "badgeId")
);

-- Tournaments
CREATE TABLE "Tournament" (
  "id"          SERIAL PRIMARY KEY,
  "title"       TEXT NOT NULL,
  "description" TEXT,
  "startAt"     TIMESTAMP(3) NOT NULL,
  "endAt"       TIMESTAMP(3) NOT NULL,
  "createdAt"   TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Tournament entries (one per user per tournament, tracks best score)
CREATE TABLE "TournamentEntry" (
  "id"           SERIAL PRIMARY KEY,
  "tournamentId" INTEGER NOT NULL,
  "userId"       INTEGER NOT NULL,
  "bestWpm"      INTEGER,
  "bestAccuracy" DOUBLE PRECISION,
  "submittedAt"  TIMESTAMP(3),
  CONSTRAINT "TournamentEntry_tournamentId_fkey" FOREIGN KEY ("tournamentId") REFERENCES "Tournament"("id") ON DELETE CASCADE,
  CONSTRAINT "TournamentEntry_userId_fkey"       FOREIGN KEY ("userId")       REFERENCES "User"("id")       ON DELETE CASCADE,
  UNIQUE ("tournamentId", "userId")
);
