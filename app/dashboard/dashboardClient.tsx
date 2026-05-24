"use client"

import { useEffect, FormEvent, useState } from "react"
import { useRouter } from "next/navigation"
import {CountUp} from '@/components/CountUp'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { AuditInput, ToolId, PlanId, UseCase } from "@/types/audit"
import { createAudit } from "@/lib/createAudit"
import { AI_PRICING } from "@/lib/ai-pricing"
import { TOOLS } from "@/lib/tools"
import { USE_CASES } from "@/lib/use-cases"

import LoaderComponent from "@/components/loader"

export default function DashboardClient() {
  const router = useRouter()

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [teamSize, setTeamSize] = useState<number>(1)
  const [useCase, setUseCase] = useState<UseCase | "">("")
  const [toolId, setToolId] = useState<ToolId | "">("")
  const [plan, setPlan] = useState<PlanId | "">("")
  const [seats, setSeats] = useState<number>(1)

  const [monthlySpend, setMonthlySpend] = useState<number>(0)

  useEffect(() => {
    if (!toolId || !plan) {
      setMonthlySpend(0)
      return
    }

    const seatPrice = AI_PRICING[toolId]?.[plan] ?? 0
    setMonthlySpend(seatPrice * seats)
  }, [toolId, plan, seats])

  const selectedTool = TOOLS.find(t => t.id === toolId)

  const hasValidTeamSize = teamSize > 0
  const hasValidSeats = seats > 0
  const hasCompleteToolEntry = Boolean(toolId && plan && hasValidSeats)

  const canSubmit =
    hasValidTeamSize &&
    useCase !== "" &&
    hasCompleteToolEntry

  const prepareAudit = (): AuditInput => {
    if (!canSubmit) {
      throw new Error("Form validation failed")
    }

    return {
      toolId: toolId as ToolId,
      plan: plan as PlanId,
      useCase: useCase as UseCase,
      seats,
      teamSize,
      monthlySpend,
    }
  }

  const validationMessage = () => {
    if (canSubmit) return null

    const reasons: string[] = []

    if (!hasValidTeamSize) {
      reasons.push("team size must be ≥ 1")
    }

    if (useCase === "") {
      reasons.push("select a use case")
    }

    if (!hasCompleteToolEntry) {
      reasons.push("add tool, plan, and seats")
    }

    return `Missing: ${reasons.join(", ")}`
  }

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (!canSubmit) return

    try {
      setError(null)
      setLoading(true)

      const input = prepareAudit()
      const response = await createAudit(input)

      if (!response?.id) {
        throw new Error("Audit ID missing from response")
      }

      router.push(`/report/${response.id}`)
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong"
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-10">
      <div className="mx-auto max-w-3xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">
            AI Cost Audit
          </h1>

          <p className="mt-2 text-sm text-slate-600">
            Estimate your AI tooling spend and generate a detailed audit report.
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-100 px-6 py-5">
            <h2 className="text-lg font-semibold text-slate-900">
              Audit Configuration
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Configure your team and tooling setup.
            </p>
          </div>

          <form
            onSubmit={handleSubmit}
            className="space-y-6 p-6"
          >
            {error && (
              <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                {error}
              </div>
            )}

            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-2">
                <Label>Team Size</Label>

                <Input
                  type="number"
                  min={1}
                  value={teamSize}
                  onChange={e =>
                    setTeamSize(Number(e.target.value))
                  }
                  className="h-11"
                />
              </div>

              <div className="space-y-2">
                <Label>Seats</Label>

                <Input
                  type="number"
                  min={1}
                  value={seats}
                  onChange={e =>
                    setSeats(Number(e.target.value))
                  }
                  className="h-11"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Use Case</Label>

              <Select
                value={useCase}
                onValueChange={v =>
                  setUseCase(v as UseCase)
                }
              >
                <SelectTrigger className="h-11">
                  <SelectValue placeholder="Select use case" />
                </SelectTrigger>

                <SelectContent className="bg-white border border-slate-200 shadow-lg">
                  {USE_CASES.map(u => (
                    <SelectItem
                      key={u}
                      value={u.toLowerCase() as UseCase}
                    >
                      {u}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-2">
                <Label>Tool</Label>

                <Select
                  value={toolId}
                  onValueChange={v => {
                    setToolId(v as ToolId)
                    setPlan("")
                  }}
                >
                  <SelectTrigger className="h-11">
                    <SelectValue placeholder="Select tool" />
                  </SelectTrigger>

                  <SelectContent className="bg-white border border-slate-200 shadow-lg">
                    {TOOLS.map(t => (
                      <SelectItem
                        key={t.id}
                        value={t.id}
                      >
                        {t.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Plan</Label>

                <Select
                  value={plan}
                  onValueChange={v =>
                    setPlan(v as PlanId)
                  }
                  disabled={!toolId}
                >
                  <SelectTrigger className="h-11">
                    <SelectValue placeholder="Select plan" />
                  </SelectTrigger>

                  <SelectContent className="bg-white border border-slate-200 shadow-lg">
                    {selectedTool?.plans.map(p => (
                      <SelectItem
                        key={p}
                        value={p}
                      >
                        {p.charAt(0).toUpperCase() + p.slice(1)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-500">
                    Estimated Monthly Spend
                  </p>

                  <h3 className="mt-1 text-2xl font-bold text-slate-900">
                    $
                    <CountUp 
                      to={monthlySpend}
                      from={0}
                      separator=","
                      direction="up"
                      duration={0.1}
                      className="count-up-text"
                      delay={0}
                      onStart={() => {}}
                      onEnd={() => {}}
                    />
                  </h3>
                </div>

                <div className="rounded-full bg-slate-900 px-3 py-1 text-xs font-medium text-white">
                  Live Estimate
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between gap-4 pt-2">
              {!canSubmit ? (
                <p className="text-sm text-red-500">
                  {validationMessage()}
                </p>
              ) : (
                <p className="text-sm text-emerald-600">
                  Ready to generate audit
                </p>
              )}

              <Button
                type="submit"
                disabled={!canSubmit || loading}
                className="h-11 min-w-35"
              >
                {loading ? (
                  <LoaderComponent />
                ) : (
                  "Run Audit"
                )}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}