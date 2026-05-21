export interface AuditInput {
  organization: string
  department: string
  monthlySpend: string
  primaryVendor: string
  costDrivers: string
  auditGoal: string
  notes: string
}

export interface AuditReport {
  id: string
  organization: string
  department: string
  monthlySpend: string
  primaryVendor: string
  costDrivers: string
  auditGoal: string
  notes: string
  score: number
  recommendations: string[]
}
