"use server"

import { runAudit, storeAudit } from "@/lib/audit-engine"
import { AuditInput } from "@/types/audit"

export async function createAudit(input: AuditInput) {
  const result = await runAudit(input)

  // store immediately with placeholder summary
  const stored = await storeAudit(input, "", result)

  if (!stored.success || !stored.data) {
    throw new Error(stored.message || "Failed to store audit")
  }
  
  return {
    id: stored.data.id,
    result,
  }
}