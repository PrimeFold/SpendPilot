"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { AuditResult } from "@/types/audit"

type Recommendation = {
  title: string
  description: string
  monthlySavings: number
}

interface AuditReport {
  id: string
  slug: string
  toolId: string
  plan: string
  teamSize: number
  seats: number
  monthlySpend: number
  useCase: string

  result: AuditResult
  recommendations: Recommendation[]

  summary?: string | null
  createdAt: string
}

interface ReportClientProps {
  report: AuditReport
}

export function ReportClient({ report }: ReportClientProps) {
  const {
    id,
    slug,
    toolId,
    plan,
    teamSize,
    seats,
    monthlySpend,
    useCase,
    result,
    recommendations,
    summary,
    createdAt,
  } = report

  const createdDate = createdAt
    ? new Date(createdAt).toLocaleString()
    : "Unknown"

  const safeRecommendations = Array.isArray(recommendations)
    ? recommendations
    : []
  console.log("🧾 ReportClient received:", report)

  console.log("Result:", report?.result)
  console.log("Recommendations:", report?.recommendations)
  return (
    <main className="container mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <div className="rounded-[2rem] border border-border bg-card p-8 shadow-sm shadow-slate-950/10">

        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-primary">
              Audit report
            </p>
            <h1 className="mt-3 text-3xl font-semibold text-foreground sm:text-4xl">
              Audit details
            </h1>
            <p className="mt-4 text-sm leading-7 text-muted-foreground">
              Review the audit summary, savings, and recommendations for the selected report.
            </p>
          </div>

          <Link href="/dashboard" className="w-full max-w-xs lg:w-auto">
            <Button variant="secondary" className="w-full lg:w-auto">
              Return to audit
            </Button>
          </Link>
        </div>

        <div className="mt-10 grid gap-6 lg:grid-cols-[1.5fr_1fr]">

          {/* LEFT */}
          <section className="space-y-6 rounded-3xl border border-border bg-card p-6">

            <div className="flex flex-col gap-2">
              <p className="text-xs uppercase tracking-[0.28em] text-muted-foreground">
                Report metadata
              </p>
              <p className="text-sm text-foreground">ID: {id}</p>
              <p className="text-sm text-foreground">Slug: {slug}</p>
              <p className="text-sm text-foreground">Created: {createdDate}</p>
            </div>

            {/* TOOL INFO (replaces old input section) */}
            <div className="space-y-3 rounded-3xl border border-border bg-background p-5">
              <p className="text-[10px] uppercase tracking-[0.28em] text-muted-foreground">
                Tool context
              </p>

              <div className="grid gap-3 sm:grid-cols-2">
                {[
                  { label: "Tool", value: toolId },
                  { label: "Plan", value: plan },
                  { label: "Seats", value: seats },
                  { label: "Team size", value: teamSize },
                  { label: "Use case", value: useCase },
                  { label: "Monthly spend", value: `$${monthlySpend.toLocaleString()}` },
                ].map((item) => (
                  <div
                    key={item.label}
                    className="rounded-2xl border border-border bg-card p-4"
                  >
                    <p className="text-[11px] uppercase tracking-[0.28em] text-muted-foreground">
                      {item.label}
                    </p>
                    <p className="mt-2 text-sm text-foreground">
                      {item.value}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-3 rounded-3xl border border-border bg-background p-5">
              <p className="text-[10px] uppercase tracking-[0.28em] text-muted-foreground">
                AI summary
              </p>
              <p className="text-sm leading-6 text-foreground">
                {summary ?? "No AI summary is available for this report yet."}
              </p>
            </div>

          </section>

          {/* RIGHT */}
          <section className="space-y-6 rounded-3xl border border-border bg-card p-6">

            <div>
              <p className="text-[10px] uppercase tracking-[0.28em] text-muted-foreground">
                Savings overview
              </p>

              <p className="mt-3 text-3xl font-semibold text-foreground">
                ${result.monthlySavings.toLocaleString()}
              </p>
              <p className="text-sm text-muted-foreground">
                Estimated monthly savings
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              {[
                { label: "Current spend", value: `$${result.currentSpend.toLocaleString()}` },
                { label: "Optimized spend", value: `$${result.optimizedSpend.toLocaleString()}` },
                { label: "Annual savings", value: `$${result.annualSavings.toLocaleString()}` },
              ].map((item) => (
                <div
                  key={item.label}
                  className="rounded-2xl border border-border bg-background p-4"
                >
                  <p className="text-[10px] uppercase tracking-[0.28em] text-muted-foreground">
                    {item.label}
                  </p>
                  <p className="mt-2 text-lg font-medium text-foreground">
                    {item.value}
                  </p>
                </div>
              ))}
            </div>

            <div className="space-y-4 rounded-3xl border border-border bg-background p-5">
              <p className="text-[10px] uppercase tracking-[0.28em] text-muted-foreground">
                Recommendations
              </p>

              {safeRecommendations.length > 0 ? (
                <div className="space-y-3">
                  {safeRecommendations.map((item, index) => (
                    <div
                      key={index}
                      className="rounded-3xl border border-border bg-card p-4"
                    >
                      <p className="text-sm font-semibold text-foreground">
                        {item.title}
                      </p>
                      <p className="mt-2 text-sm text-muted-foreground">
                        {item.description}
                      </p>
                      <p className="mt-3 text-xs uppercase tracking-[0.3em] text-muted-foreground">
                        Estimated savings: ${item.monthlySavings}/mo
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">
                  No recommendations were generated for this audit.
                </p>
              )}
            </div>

          </section>

        </div>
      </div>
    </main>
  )
}