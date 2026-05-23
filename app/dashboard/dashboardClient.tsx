"use client"

import { useEffect, FormEvent, useState } from "react"
import { useRouter } from "next/navigation"
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

const TOOLS = [
  {
    id: "cursor",
    name: "Cursor",
    plans: ["free", "pro", "business"],
  },
  {
    id: "github_copilot",
    name: "GitHub Copilot",
    plans: ["individual", "business", "enterprise"],
  },
  {
    id: "claude",
    name: "Claude (Anthropic)",
    plans: ["free", "pro", "team", "max"],
  },
  {
    id: "chatgpt",
    name: "ChatGPT (OpenAI)",
    plans: ["free", "plus", "team", "enterprise", "pro"],
  },
  {
    id: "gemini",
    name: "Gemini (Google)",
    plans: ["free", "pro", "ultra"],
  },
  {
    id: "windsurf",
    name: "Windsurf",
    plans: ["free", "pro", "teams"],
  },
  {
    id: "openai_api",
    name: "OpenAI API Direct",
    plans: ["starter", "growth", "scale"],
  },
  {
    id: "anthropic_api",
    name: "Anthropic API Direct",
    plans: ["starter", "growth", "scale"],
  },
] as const

const USE_CASES = ["Coding", "Writing", "Data", "Research", "Mixed"] as const

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

  // Recompute cost on change
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

  const canSubmit = hasValidTeamSize && useCase !== "" && hasCompleteToolEntry

  const prepareAudit = (): AuditInput => {
    if (!canSubmit) throw new Error("Form validation failed")
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
    if (!hasValidTeamSize) reasons.push("team size must be ≥ 1")
    if (useCase === "") reasons.push("select a use case")
    if (!hasCompleteToolEntry) reasons.push("add tool, plan, and seats")

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
      console.error("🔴 SUBMIT FAILED:", err)
      setError(err instanceof Error ? err.message : "Something went wrong")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="mx-auto max-w-3xl">
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && <div className="text-red-600 text-sm">{error}</div>}

          <div>
            <Label>Team Size</Label>
            <Input
              type="number"
              min={1}
              value={teamSize}
              onChange={e => setTeamSize(Number(e.target.value))}
            />
          </div>

          <div>
            <Label>Use Case</Label>
            <Select value={useCase} onValueChange={(v) => setUseCase(v as UseCase)}>
              <SelectTrigger>
                <SelectValue placeholder="Select use case" />
              </SelectTrigger>
              <SelectContent>
                {USE_CASES.map(u => (
                  <SelectItem key={u} value={u.toLowerCase() as UseCase}>
                    {u}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>Tool</Label>
            <Select 
              value={toolId} 
              onValueChange={(v) => {
                setToolId(v as ToolId)
                setPlan("") 
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select tool" />
              </SelectTrigger>
              <SelectContent>
                {TOOLS.map(t => (
                  <SelectItem key={t.id} value={t.id}>
                    {t.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>Plan</Label>
            <Select value={plan} onValueChange={(v) => setPlan(v as PlanId)} disabled={!toolId}>
              <SelectTrigger>
                <SelectValue placeholder="Select plan" />
              </SelectTrigger>
              <SelectContent>
                {selectedTool?.plans.map(p => (
                  <SelectItem key={p} value={p}>
                    {p.charAt(0).toUpperCase() + p.slice(1)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>Seats</Label>
            <Input
              type="number"
              min={1}
              value={seats}
              onChange={e => setSeats(Number(e.target.value))}
            />
          </div>

          <div>
            <Label>Estimated Monthly Spend</Label>
            <div className="rounded-md border bg-muted/40 px-3 py-2 text-sm">
              ${monthlySpend.toLocaleString()}
            </div>
          </div>

          <Button type="submit" disabled={!canSubmit || loading}>
            {loading ? "Running..." : "Run Audit"}
          </Button>
        </form>

        {!canSubmit && (
          <p className="text-sm text-red-500 mt-2">
            {validationMessage()}
          </p>
        )}
      </div>
    </div>
  )
}