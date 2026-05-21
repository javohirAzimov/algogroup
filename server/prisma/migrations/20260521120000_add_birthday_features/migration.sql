-- Add birthday field to User
ALTER TABLE "User" ADD COLUMN "birthday" TEXT;

-- Create BirthdayMessage table
CREATE TABLE "BirthdayMessage" (
    "id"         SERIAL          NOT NULL,
    "fromUserId" INTEGER         NOT NULL,
    "toUserId"   INTEGER         NOT NULL,
    "message"    TEXT            NOT NULL,
    "createdAt"  TIMESTAMP(3)    NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "BirthdayMessage_pkey" PRIMARY KEY ("id")
);
ALTER TABLE "BirthdayMessage" ADD CONSTRAINT "BirthdayMessage_fromUserId_fkey"
    FOREIGN KEY ("fromUserId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "BirthdayMessage" ADD CONSTRAINT "BirthdayMessage_toUserId_fkey"
    FOREIGN KEY ("toUserId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- Create Shoutout table
CREATE TABLE "Shoutout" (
    "id"         SERIAL          NOT NULL,
    "fromUserId" INTEGER         NOT NULL,
    "toUserId"   INTEGER         NOT NULL,
    "message"    TEXT            NOT NULL,
    "isBirthday" BOOLEAN         NOT NULL DEFAULT false,
    "createdAt"  TIMESTAMP(3)    NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Shoutout_pkey" PRIMARY KEY ("id")
);
ALTER TABLE "Shoutout" ADD CONSTRAINT "Shoutout_fromUserId_fkey"
    FOREIGN KEY ("fromUserId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "Shoutout" ADD CONSTRAINT "Shoutout_toUserId_fkey"
    FOREIGN KEY ("toUserId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
