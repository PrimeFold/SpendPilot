import { notFound } from "next/navigation"
import { prisma } from "@/lib/prisma"
import { ReportClient } from "./reportClient"

export default async function ReportPage({ params }: { params: { id: string } }) {
  const audit = await prisma.audit.findUnique({
    where: { id: params.id },
    include: {
      recommendations: true,
    },
  })

  if (!audit) notFound()

  const report = {
    id: audit.id,
    slug: audit.slug,

    toolId: audit.toolId,
    plan: audit.plan,
    teamSize: audit.teamSize,
    seats: audit.seats,
    monthlySpend: audit.monthlySpend,
    useCase: audit.useCase,

    result: {
      currentSpend: audit.currentSpend,
      optimizedSpend: audit.optimizedSpend,
      monthlySavings: audit.monthlySavings,
      annualSavings: audit.annualSavings,
    },

    recommendations: audit.recommendations
      ? JSON.parse(JSON.stringify(audit.recommendations))
      : [],

    summary: audit.summary ?? null,
    createdAt: audit.createdAt.toISOString(),
  }

  return <ReportClient report={report} />
}