/*
  Warnings:

  - You are about to drop the column `input` on the `Audit` table. All the data in the column will be lost.
  - You are about to drop the column `result` on the `Audit` table. All the data in the column will be lost.
  - Added the required column `annualSavings` to the `Audit` table without a default value. This is not possible if the table is not empty.
  - Added the required column `currentSpend` to the `Audit` table without a default value. This is not possible if the table is not empty.
  - Added the required column `monthlySavings` to the `Audit` table without a default value. This is not possible if the table is not empty.
  - Added the required column `monthlySpend` to the `Audit` table without a default value. This is not possible if the table is not empty.
  - Added the required column `optimizedSpend` to the `Audit` table without a default value. This is not possible if the table is not empty.
  - Added the required column `plan` to the `Audit` table without a default value. This is not possible if the table is not empty.
  - Added the required column `seats` to the `Audit` table without a default value. This is not possible if the table is not empty.
  - Added the required column `teamSize` to the `Audit` table without a default value. This is not possible if the table is not empty.
  - Added the required column `toolId` to the `Audit` table without a default value. This is not possible if the table is not empty.
  - Added the required column `useCase` to the `Audit` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Audit" DROP COLUMN "input",
DROP COLUMN "result",
ADD COLUMN     "annualSavings" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "currentSpend" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "monthlySavings" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "monthlySpend" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "optimizedSpend" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "plan" TEXT NOT NULL,
ADD COLUMN     "seats" INTEGER NOT NULL,
ADD COLUMN     "teamSize" INTEGER NOT NULL,
ADD COLUMN     "toolId" TEXT NOT NULL,
ADD COLUMN     "useCase" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "Recommendation" (
    "id" TEXT NOT NULL,
    "auditId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "monthlySavings" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Recommendation_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Recommendation" ADD CONSTRAINT "Recommendation_auditId_fkey" FOREIGN KEY ("auditId") REFERENCES "Audit"("id") ON DELETE CASCADE ON UPDATE CASCADE;
