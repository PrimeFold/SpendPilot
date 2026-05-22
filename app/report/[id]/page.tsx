import { notFound } from "next/navigation"
import { prisma } from "@/lib/prisma"
import { ReportClient } from "./reportClient"

export default async function ReportPage({
  params,
}: {
  params: { id: string }
}) {
  console.log("🟡 [ReportPage] Incoming params:", params)

  const audit = await prisma.audit.findUnique({
    where: { id: params.id },
    include: {
      recommendations: true,
    },
  })

  console.log("🟢 [ReportPage] Raw audit from DB:", audit)

  if (!audit) {
    console.log("🔴 [ReportPage] Audit not found for id:", params.id)
    notFound()
  }

  const result = {
    currentSpend: audit.currentSpend ?? 0,
    optimizedSpend: audit.optimizedSpend ?? 0,
    monthlySavings: audit.monthlySavings ?? 0,
    annualSavings: audit.annualSavings ?? 0,
  }

  console.log("🟣 [ReportPage] Normalized result:", result)

  const report = {
    id: audit.id,

    toolId: audit.toolId ?? "unknown",
    plan: audit.plan ?? "unknown",
    teamSize: audit.teamSize ?? 0,
    seats: audit.seats ?? 0,
    monthlySpend: audit.monthlySpend ?? 0,
    useCase: audit.useCase ?? "unknown",

    result,

    recommendations: Array.isArray(audit.recommendations)
      ? audit.recommendations
      : [],

    summary: audit.summary ?? null,
    createdAt: audit.createdAt.toISOString(),
  }

  console.log("🔵 [ReportPage] Final report object:", report)

  try {
    return <ReportClient report={report} />
  } catch (err) {
    console.error("💥 [ReportPage] Render crash:", err)
    throw err
  }
}