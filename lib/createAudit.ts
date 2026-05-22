"use server"

import { runAudit, storeAudit } from "@/lib/audit-engine"
import { generateSummary } from "@/lib/ai-summary"
import { AuditInput } from "@/types/audit"

export async function createAudit(input: AuditInput) {
  // STEP 1: run audit (pure computation)
  const { result, recommendations } = await runAudit(input)

  // STEP 2: immediate DB write (no summary yet)
  const audit = await storeAudit(
    input,
    result,
    recommendations,
    ""
  )

  if (!audit?.id) {
    throw new Error("Failed to store audit")
  }

  generateSummary(input, result)
    .then(async (summary) => {
      const safeSummary = summary ?? ""
      await storeAudit(
        input,
        result,
        recommendations,
        safeSummary
      )
    })
    .catch((err) => {
      console.error("Summary generation failed:", err)
    })

  return {
    id: audit.id,
    result,
  }
}