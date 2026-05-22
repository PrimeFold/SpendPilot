"use server"

import { runAudit, storeAudit } from "@/lib/audit-engine"
import { generateSummary } from "@/lib/ai-summary"
import { prisma } from "@/lib/prisma"
import { AuditInput } from "@/types/audit"

export async function createAudit(input: AuditInput) {
  const { result, recommendations } = await runAudit(input)
  const audit = await storeAudit(
    input,
    result,
    recommendations
  )

  const auditId = audit.id;

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