-- CreateTable
CREATE TABLE "AuditRecommendations" (
    "id" TEXT NOT NULL,
    "auditResultId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "monthlySavings" INTEGER NOT NULL,

    CONSTRAINT "AuditRecommendations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AuditResult" (
    "id" TEXT NOT NULL,
    "currentSpend" INTEGER NOT NULL,
    "optimizedSpend" INTEGER NOT NULL,
    "annualSavings" INTEGER NOT NULL,

    CONSTRAINT "AuditResult_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "AuditRecommendations" ADD CONSTRAINT "AuditRecommendations_auditResultId_fkey" FOREIGN KEY ("auditResultId") REFERENCES "AuditResult"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
