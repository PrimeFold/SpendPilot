import { notFound } from "next/navigation"
import { prisma } from "@/lib/prisma"
import { ReportClient } from "./reportClient"

interface ReportPageProps {
  params: Promise<{
    id: string
  }>
}

export default async function ReportPage({
  params,
}: ReportPageProps) {
  

  const { id } = await params

  

  const audit = await prisma.audit.findUnique({
    where: {
      id,
    },
    include: {
      recommendations: true,
    },
  })

  

  if (!audit) {
    
    notFound()
  }

  const report = {
    id: audit.id,

    toolId: audit.toolId ?? "Unknown",
    plan: audit.plan ?? "Unknown",
    teamSize: audit.teamSize ?? 0,
    seats: audit.seats ?? 0,
    monthlySpend: audit.monthlySpend ?? 0,
    useCase: audit.useCase ?? "Unknown",

    result: {
      currentSpend: audit.currentSpend ?? 0,
      optimizedSpend: audit.optimizedSpend ?? 0,
      monthlySavings: audit.monthlySavings ?? 0,
      annualSavings: audit.annualSavings ?? 0,
    },

    recommendations: Array.isArray(audit.recommendations)
      ? audit.recommendations
      : [],

    summary: audit.summary ?? null,

    createdAt:
      audit.createdAt instanceof Date
        ? audit.createdAt.toISOString()
        : new Date().toISOString(),
  }

  

  return <ReportClient report={report} />
}