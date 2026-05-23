"use client"

import Link from "next/link"
import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { AuditResult } from "@/types/audit"

const router = useRouter();
type Recommendation = {
  title: string
  description: string
  monthlySavings: number
}

interface AuditReport {
  id: string
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
  console.log("REPORT DATA:", report)
  const router = useRouter();
  const {
    id,
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

  useEffect(() => {
  if (summary) return

  const interval = setInterval(() => {
    router.refresh()
  }, 4000)

  return () => clearInterval(interval)
  }, [summary, router])

  const createdDate = createdAt
    ? new Date(createdAt).toLocaleString()
    : "Unknown"

  const safeRecommendations = Array.isArray(recommendations)
    ? recommendations
    : []

  const safeNumber = (value: unknown) => {
  const parsed = Number(value)

  if (!Number.isFinite(parsed)) {
    return 0
  }

  const safeResult = {
    currentSpend: safeNumber(result?.currentSpend),
    optimizedSpend: safeNumber(result?.optimizedSpend),
    monthlySavings: safeNumber(result?.monthlySavings),
    annualSavings: safeNumber(result?.annualSavings),
  }
  const safeMonthlySpend = safeNumber(monthlySpend)

  return parsed
  
}

  return (
  <div className="p-10 text-white">
    <h1>REPORT PAGE WORKS</h1>

    <pre>
      {JSON.stringify(report, null, 2)}
    </pre>
  </div>
)
}