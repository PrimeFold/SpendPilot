import { notFound } from "next/navigation"
import { prisma } from "@/lib/prisma"
import { ReportClient } from "./reportClient"
import { AuditInput, AuditResult } from "@/types/audit"

interface ReportPageProps {
  params: {
    id: string
  }
}

function isAuditResult(value: any): value is AuditResult {
  return (
    value &&
    typeof value === "object" &&
    "currentSpend" in value &&
    "optimizedSpend" in value &&
    "monthlySavings" in value &&
    "annualSavings" in value &&
    "recommendations" in value
  )
}

export default async function ReportPage({ params }: ReportPageProps) {
  const audit = await prisma.audit.findUnique({
    where: { id: params.id },
  })

  if (!audit) {
    notFound()
  }

  const input = audit.input as unknown as AuditInput

  const result: AuditResult = isAuditResult(audit.result)
    ? audit.result
    : {
        currentSpend: 0,
        optimizedSpend: 0,
        monthlySavings: 0,
        annualSavings: 0,
        recommendations: [],
      }

  const report = {
    id: audit.id,
    slug: audit.slug,
    input,
    result,
    summary: audit.summary ?? null,
    createdAt:
      audit.createdAt instanceof Date
        ? audit.createdAt.toISOString()
        : new Date(audit.createdAt).toISOString(),
  }

  return <ReportClient report={report} />
}