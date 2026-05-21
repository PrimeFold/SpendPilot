import { calculateAuditReport } from "@/lib/audit-engine"

test("calculates an audit report", () => {
  const report = calculateAuditReport({
    organization: "Acme",
    department: "AI",
    monthlySpend: "$10,000",
    primaryVendor: "OpenAI",
    costDrivers: "Embeddings",
    auditGoal: "Optimize spend",
    notes: "Testing audit report",
  })
  expect(report.id).toBe("report-1")
})
