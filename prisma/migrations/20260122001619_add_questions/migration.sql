-- CreateEnum
CREATE TYPE "GradeLevel" AS ENUM ('CLASS_10', 'CLASS_11', 'CLASS_12');

-- CreateEnum
CREATE TYPE "SubjectType" AS ENUM ('SPLDV', 'MATRIKS', 'KALKULUS', 'ALJABAR', 'GEOMETRI', 'TRIGONOMETRI', 'STATISTIKA', 'PELUANG');

-- CreateEnum
CREATE TYPE "Difficulty" AS ENUM ('EASY', 'MEDIUM', 'HARD');

-- CreateTable
CREATE TABLE "Question" (
    "id" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "grade" "GradeLevel" NOT NULL,
    "subject" "SubjectType" NOT NULL,
    "difficulty" "Difficulty" NOT NULL,
    "solution" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Question_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Option" (
    "id" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "isCorrect" BOOLEAN NOT NULL DEFAULT false,
    "questionId" TEXT NOT NULL,

    CONSTRAINT "Option_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Option" ADD CONSTRAINT "Option_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "Question"("id") ON DELETE CASCADE ON UPDATE CASCADE;
