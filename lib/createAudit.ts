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

  console.log("🟢 Audit stored:", audit.id)

  const summary = await generateSummary(
    input,
    result,
    recommendations
  )

  console.log("🟡 Generated summary:", summary)

  await prisma.audit.update({
    where: {
      id: audit.id,
    },
    data: {
      summary,
    },
  })

  console.log("🔵 Summary updated in DB")

  return {
    id: audit.id,
    result,
  }
}