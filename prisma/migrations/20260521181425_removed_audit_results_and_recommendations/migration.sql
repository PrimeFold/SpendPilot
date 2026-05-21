/*
  Warnings:

  - You are about to drop the `AuditRecommendations` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `AuditResult` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "AuditRecommendations" DROP CONSTRAINT "AuditRecommendations_auditResultId_fkey";

-- DropTable
DROP TABLE "AuditRecommendations";

-- DropTable
DROP TABLE "AuditResult";

-- CreateTable
CREATE TABLE "Audit" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "input" JSONB NOT NULL,
    "result" JSONB NOT NULL,
    "summary" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Audit_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Audit_slug_key" ON "Audit"("slug");
