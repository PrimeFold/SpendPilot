import { notFound } from "next/navigation"
import { prisma } from "@/lib/prisma"
import { ReportClient } from "./reportClient"
import { AuditInput, AuditResult } from "@/types/audit"

interface ReportPageProps {
  params: {
    id: string
  }
}

type AuditReport = {
  id: string
  slug: string
  input: AuditInput
  result: AuditResult
  summary: string | null
  createdAt: string
}

export default async function ReportPage({ params }: ReportPageProps) {
  const audit = await prisma.audit.findUnique({
    where: { id: params.id },
  })

  if (!audit) {
    notFound()
  }

  const report: AuditReport = {
    id: audit.id,
    slug: audit.slug,
    input: audit.input as unknown as AuditInput,
    result: audit.result as unknown as AuditResult,
    summary: audit.summary,
    createdAt: audit.createdAt.toISOString(),
  }

  return <ReportClient report={report} />
}
