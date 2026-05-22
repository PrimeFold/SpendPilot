"use server"

import { runAudit } from "@/lib/audit-engine"
import { generateSummary } from "@/lib/ai-summary"
import { prisma } from "@/lib/prisma"
import { AuditInput } from "@/types/audit"

export async function createAudit(input: AuditInput) {
  const { result, recommendations } = await runAudit(input)

  // create DB row (structured fields only)
  const audit = await prisma.audit.create({
    data: {
      slug: `audit-${Date.now()}`,
      toolId: input.toolId,
      plan: input.plan,
      teamSize: input.teamSize,
      seats: input.seats,
      monthlySpend: input.monthlySpend,
      useCase: input.useCase,

      currentSpend: result.currentSpend,
      optimizedSpend: result.optimizedSpend,
      monthlySavings: result.monthlySavings,
      annualSavings: result.annualSavings,

      summary: "",

      recommendations: {
        create: recommendations.map(r => ({
          title: r.title,
          description: r.description,
          monthlySavings: r.monthlySavings,
        })),
      },
    },
  })

  const auditId = audit.id

  // async enrichment (does NOT block navigation)
  generateSummary(input, result, recommendations)
    .then(async (summary) => {
      if (!summary) return

      await prisma.audit.update({
        where: { id: auditId },
        data: { summary },
      })
    })
    .catch(console.error)

  return {
    id: auditId,
    result,
  }
}