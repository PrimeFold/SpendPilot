"use client"

import { FormEvent, useState } from "react"
import Link from "next/link"
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

import { AuditInput } from "@/types/audit"
import { createAudit } from "@/lib/createAudit"
import { generateAndUpdateSummary } from "@/lib/generateUpdateAndSummary"
import { generateSummary } from "@/lib/ai-summary"
import { runAudit, storeAudit } from "@/lib/audit-engine"
import { prisma } from "@/lib/prisma"


const TOOLS: ReadonlyArray<{ id: string; name: string; plans: readonly string[] }> = [
  { id: "cursor", name: "Cursor", plans: ["Hobby", "Pro", "Business", "Enterprise"] },
  { id: "github_copilot", name: "GitHub Copilot", plans: ["Individual", "Business", "Enterprise"] },
  { id: "claude", name: "Claude (Anthropic)", plans: ["Free", "Pro", "Max", "Team", "Enterprise", "API direct"] },
  { id: "chatgpt", name: "ChatGPT (OpenAI)", plans: ["Plus", "Team", "Enterprise", "API direct"] },
  { id: "anthropic_api", name: "Anthropic API direct", plans: ["Pay-as-you-go"] },
  { id: "openai_api", name: "OpenAI API direct", plans: ["Pay-as-you-go"] },
  { id: "gemini", name: "Gemini (Google)", plans: ["Pro", "Ultra", "API"] },
  { id: "windsurf", name: "Windsurf", plans: ["Free", "Pro", "Teams"] },
] as const

const USE_CASES = ["Coding", "Writing", "Data", "Research", "Mixed"] as const

type ToolId = (typeof TOOLS)[number]["id"]

export default function DashboardClient() {
  const router = useRouter()

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [submitted, setSubmitted] = useState(false)

  const [teamSize, setTeamSize] = useState(1)
  const [useCase, setUseCase] = useState("")
  const [toolId, setToolId] = useState<ToolId | "">("")
  const [plan, setPlan] = useState("")
  const [seats, setSeats] = useState(1)
  const [monthlySpend, setMonthlySpend] = useState(0)

  const selectedTool = TOOLS.find(t => t.id === toolId)

  const hasValidTeamSize = teamSize > 0
  const hasValidSeats = seats > 0
  const hasValidSpend = monthlySpend > 0

  const hasCompleteToolEntry =
    Boolean(toolId && plan && hasValidSeats && hasValidSpend)

  const canSubmit =
    hasValidTeamSize && useCase !== "" && hasCompleteToolEntry

  const prepareAudit = (): AuditInput => ({
    toolId: toolId.trim(),
    seats,
    teamSize,
    useCase: useCase.trim(),
    monthlySpend,
    plan: plan.trim(),
  })

  const validationMessage = () => {
    if (canSubmit) return null

    const reasons: string[] = []
    if (!hasValidTeamSize) reasons.push("team size must be ≥ 1")
    if (useCase === "") reasons.push("select a use case")
    if (!hasCompleteToolEntry)
      reasons.push("add tool, plan, seats, and spend")

    return `Missing: ${reasons.join(", ")}`
  }

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    
    if (!canSubmit) return
    
    try {
      setError(null)
      setLoading(true)
    
      const input = prepareAudit()
    
      console.log("STEP 1 - sending input")
    
      const { id } = await createAudit(input)
    
      console.log("STEP 2 - audit created", id)
    
      router.push(`/report/${id}`)
    
      console.log("STEP 3 - navigation triggered")
    
    } catch (err) {
      console.error(err)
      setError((err as Error)?.message ?? "Something went wrong")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="mx-auto max-w-3xl">

        <form onSubmit={handleSubmit} className="space-y-4">

          {error && (
            <div className="text-red-600 text-sm">{error}</div>
          )}

          <div>
            <Label>Team Size</Label>
            <Input
              type="number"
              value={teamSize}
              onChange={e => setTeamSize(Number(e.target.value))}
            />
          </div>

          <div>
            <Label>Use Case</Label>
            <Select value={useCase} onValueChange={setUseCase}>
              <SelectTrigger>
                <SelectValue placeholder="Select use case" />
              </SelectTrigger>
              <SelectContent>
                {USE_CASES.map(u => (
                  <SelectItem key={u} value={u.toLowerCase()}>
                    {u}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>Tool</Label>
            <Select value={toolId} onValueChange={v => setToolId(v as ToolId)}>
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
            <Select value={plan} onValueChange={setPlan}>
              <SelectTrigger>
                <SelectValue placeholder="Select plan" />
              </SelectTrigger>
              <SelectContent>
                {selectedTool?.plans.map(p => (
                  <SelectItem key={p} value={p}>
                    {p}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>Seats</Label>
            <Input
              type="number"
              value={seats}
              onChange={e => setSeats(Number(e.target.value))}
            />
          </div>

          <div>
            <Label>Monthly Spend</Label>
            <Input
              type="number"
              value={monthlySpend}
              onChange={e => setMonthlySpend(Number(e.target.value))}
            />
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