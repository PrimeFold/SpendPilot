import type { AuditInput, AuditReport } from "@/types/audit"

export function calculateAuditReport(input: AuditInput): AuditReport {
  return {
    id: "report-1",
    organization: input.organization,
    department: input.department,
    monthlySpend: input.monthlySpend,
    primaryVendor: input.primaryVendor,
    costDrivers: input.costDrivers,
    auditGoal: input.auditGoal,
    notes: input.notes,
    score: 78,
    recommendations: ["Reduce token usage", "Track vendor spend weekly"],
  }
}
