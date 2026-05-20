-- CreateTable
CREATE TABLE "TypingScore" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "wpm" INTEGER NOT NULL,
    "accuracy" DOUBLE PRECISION NOT NULL,
    "errors" INTEGER NOT NULL,
    "duration" INTEGER NOT NULL,
    "wordsTyped" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "TypingScore_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "TypingScore" ADD CONSTRAINT "TypingScore_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
