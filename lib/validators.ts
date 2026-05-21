import type { AuditInput } from "@/types/audit"

export function validateAuditInput(input: AuditInput) {
  return {
    valid: Boolean(input.organization && input.monthlySpend),
    errors: [],
  }
}
