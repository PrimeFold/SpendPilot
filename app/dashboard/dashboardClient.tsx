"use client"
import { useEffect } from "react"
import { FormEvent, useState } from "react"
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
const AI_PRICING: Record<string, Record<string, number>> = {
  cursor: {
    free: 0,
    pro: 20,
    business: 40,
  },

  github_copilot: {
    individual: 10,
    business: 19,
    enterprise: 39,
  },

  claude: {
    free: 0,
    pro: 20,
    team: 25,
    max: 100,
  },

  chatgpt: {
    free: 0,
    plus: 20,
    team: 25,
    enterprise: 60,
    pro: 100,
  },

  gemini: {
    free: 0,
    pro: 20,
    ultra: 250,
  },

  windsurf: {
    free: 0,
    pro: 15,
    teams: 30,
  },

  openai_api: {
    starter: 25,
    growth: 100,
    scale: 500,
  },

  anthropic_api: {
    starter: 30,
    growth: 120,
    scale: 600,
  },
}

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

  useEffect(() => {
  if (!toolId || !plan) {
    setMonthlySpend(0)
    return
  }

  const normalizedPlan = plan.toLowerCase()

  const seatPrice = AI_PRICING[toolId]?.[normalizedPlan] ?? 0

  setMonthlySpend(seatPrice * seats)
}, [toolId, plan, seats])
  
  const selectedTool = TOOLS.find(t => t.id === toolId)

  const hasValidTeamSize = teamSize > 0
  const hasValidSeats = seats > 0
  


  const hasCompleteToolEntry =Boolean(toolId && plan && hasValidSeats);

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