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
import { runAudit, storeAudit } from "@/lib/audit-engine"
import { generateSummary } from "@/lib/ai-summary"

const TOOLS: ReadonlyArray<{ id: string; name: string; plans: readonly string[] }> = [
  { id: "cursor",         name: "Cursor",               plans: ["Hobby", "Pro", "Business", "Enterprise"] },
  { id: "github_copilot", name: "GitHub Copilot",       plans: ["Individual", "Business", "Enterprise"] },
  { id: "claude",         name: "Claude (Anthropic)",   plans: ["Free", "Pro", "Max", "Team", "Enterprise", "API direct"] },
  { id: "chatgpt",        name: "ChatGPT (OpenAI)",     plans: ["Plus", "Team", "Enterprise", "API direct"] },
  { id: "anthropic_api",  name: "Anthropic API direct", plans: ["Pay-as-you-go"] },
  { id: "openai_api",     name: "OpenAI API direct",    plans: ["Pay-as-you-go"] },
  { id: "gemini",         name: "Gemini (Google)",      plans: ["Pro", "Ultra", "API"] },
  { id: "windsurf",       name: "Windsurf",             plans: ["Free", "Pro", "Teams"] },
] as const

const USE_CASES = ["Coding", "Writing", "Data", "Research", "Mixed"] as const

type ToolId = (typeof TOOLS)[number]["id"]

export default function DashboardClient() {
  const router = useRouter()
  const [loading,setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [teamSize, setTeamSize] = useState(1)
  const [useCase, setUseCase] = useState("")
  const [toolId, setToolId] = useState<ToolId | "">("")
  const [plan, setPlan] = useState("")
  const [seats, setSeats] = useState(1)
  const [monthlySpend, setMonthlySpend] = useState(0)

  const selectedTool = TOOLS.find(tool => tool.id === toolId)
  const totalSpend = typeof monthlySpend === "number" ? monthlySpend : 0
  const hasValidTeamSize = typeof teamSize === "number" && teamSize > 0
  const hasValidSeats = typeof seats === "number" && seats > 0
  const hasValidSpend = typeof monthlySpend === "number" && monthlySpend > 0
  const hasCompleteToolEntry = Boolean(toolId && plan && hasValidSeats && hasValidSpend)
  const validEntries = hasCompleteToolEntry ? [{ toolId, plan, seats, monthlySpend }] : []
  const canSubmit = hasValidTeamSize && useCase !== "" && hasCompleteToolEntry

  const handleToolChange = (value: string) => {
    const nextToolId = value as ToolId | ""
    const nextTool = TOOLS.find(tool => tool.id === nextToolId)

    setToolId(nextToolId)
    setPlan(currentPlan => (nextTool?.plans.includes(currentPlan) ? currentPlan : ""))
  }

  const prepareAudit = (): AuditInput => {
    const parsedTeamSize = Number(teamSize)
    const parsedMonthlySpend = Number(monthlySpend)
    const parsedSeats = Number(seats)

    return {
      toolId: toolId.trim(),
      plan: plan.trim(),
      teamSize: Number.isFinite(parsedTeamSize) && parsedTeamSize > 0 ? parsedTeamSize : 0,
      monthlySpend: Number.isFinite(parsedMonthlySpend) && parsedMonthlySpend >= 0 ? parsedMonthlySpend : 0,
      seats: Number.isFinite(parsedSeats) && parsedSeats > 0 ? parsedSeats : 0,
      useCase: useCase.trim(),
    }
  }


  const handleSubmit = async(e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (!canSubmit) {
      return
    }

    try {
      setLoading(true)
      const input = prepareAudit()
      const result = await runAudit(input)
      const summary = await generateSummary(input, result)
      if (!summary) {
        throw new Error("Summary not found !")
      }

      const stored = await storeAudit(input, summary, result)
      if (!stored.success || !stored.data) {
        throw new Error(stored.message)
      }

      router.push(`/report/${stored.data.id}`)
      setSubmitted(true)
    } catch (error) {
      console.error(error)
      throw new Error("Internal Server Error")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[linear-gradient(180deg,#f8fafc_0%,#eef4ff_100%)] font-mono text-slate-950">
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-14 lg:px-8 lg:py-16">

        {/* ── Header ──────────────────────────────────────────────────────── */}
        <div className="mb-10 flex flex-col gap-6 border border-slate-200/80 bg-white/80 px-5 py-6 shadow-[0_20px_60px_-48px_rgba(15,23,42,0.45)] backdrop-blur sm:px-7 lg:mb-12 lg:flex-row lg:items-start lg:justify-between">
          <div className="space-y-3">
            <p className="text-[10px] uppercase tracking-[0.4em] text-sky-600">
              AI spend audit
            </p>
            <h1 className="text-3xl font-light tracking-tight text-slate-950 sm:text-4xl">
              Build your cost review.
            </h1>
            <p className="max-w-2xl text-sm leading-7 text-slate-600">
              Add every AI tool your team pays for — plan, seats, and monthly spend.
            </p>
          </div>
          <Link href="/">
            <button className="inline-flex items-center justify-center border border-slate-200 bg-slate-50 px-4 py-2 text-[10px] uppercase tracking-[0.3em] text-slate-500 transition-colors hover:border-sky-200 hover:bg-sky-50 hover:text-sky-700">
              ← Back
            </button>
          </Link>
        </div>

        {/* ── Main grid ───────────────────────────────────────────────────── */}
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_300px] lg:items-start">

          
          <form
            onSubmit={handleSubmit}
            className="space-y-8 border border-slate-200 bg-white p-5 shadow-[0_20px_60px_-48px_rgba(15,23,42,0.45)] sm:p-7 lg:p-8"
          >
            {/* 01 — Team context */}
            <section className="space-y-5">
              <SectionLabel index="01" label="Team context" />
              <div className="grid gap-4 md:grid-cols-2">
                <Field label="Team size (headcount)">
                  <Input
                    type="number"
                    min={1}
                    placeholder="e.g. 8"
                    value={teamSize}
                    onChange={e => setTeamSize(Number(e.target.value))}
                    className="h-11 rounded-none border-slate-200 bg-slate-50/80 text-sm text-slate-900 placeholder:text-slate-400 focus-visible:border-sky-400 focus-visible:ring-0"
                  />
                </Field>
                <Field label="Primary use case">
                  <Select value={useCase} onValueChange={setUseCase}>
                    <SelectTrigger className="h-11 rounded-none border-slate-200 bg-slate-50/80 text-sm text-slate-900 focus:border-sky-400 focus:ring-0">
                      <SelectValue placeholder="Select use case" />
                    </SelectTrigger>
                    <SelectContent className="rounded-none border-slate-200 bg-white">
                      {USE_CASES.map(u => (
                        <SelectItem key={u} value={u.toLowerCase()} className="text-sm text-slate-700 focus:bg-sky-50 focus:text-slate-950">
                          {u}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </Field>
              </div>
            </section>

            <div className="h-px bg-slate-200/80" />

            {/* 02 — Tools */}
            <section className="space-y-6">
              <SectionLabel index="02" label="AI tools you pay for" />
              <ToolRow
                toolId={toolId}
                plan={plan}
                seats={seats}
                monthlySpend={monthlySpend}
                onToolChange={handleToolChange}
                onPlanChange={setPlan}
                onSeatsChange={setSeats}
                onMonthlySpendChange={setMonthlySpend}
              />
            </section>

            <div className="h-px bg-slate-200/80" />

            {/* Submit row */}
            <div className="flex flex-col gap-4 border border-slate-200 bg-slate-50/70 p-5 sm:flex-row sm:items-center sm:justify-between">
              <div className="space-y-1">
                <p className="text-[10px] uppercase tracking-[0.3em] text-slate-500">
                  Total declared spend
                </p>
                <p className="mt-1 text-2xl font-light text-slate-950">
                  ${totalSpend.toLocaleString()}
                  <span className="ml-1 text-sm text-slate-500">/mo</span>
                </p>
              </div>
              <Button
                type="submit"
                disabled={!canSubmit}
                className="h-11 rounded-none bg-slate-950 px-8 text-[10px] uppercase tracking-widest text-white hover:bg-sky-700 disabled:opacity-30"
              >
                Run audit →
              </Button>
            </div>
          </form>

          
          <div className="space-y-6 border border-slate-200 bg-white p-5 shadow-[0_20px_60px_-48px_rgba(15,23,42,0.45)] sm:p-7 lg:sticky lg:top-8">
            <SectionLabel index="03" label="Audit scope" />
            <div className="border border-sky-100 bg-sky-50/70 p-5 space-y-1">
              <p className="text-[10px] uppercase tracking-[0.3em] text-sky-700">Tool selected</p>
              <p className="text-xl font-light text-slate-950">{selectedTool?.name ?? "None yet"}</p>
            </div>
            <div className="h-px bg-slate-200/80" />
            <div className="space-y-3">
              <p className="text-[10px] uppercase tracking-[0.3em] text-slate-400">What we check</p>
              {[
                "Right plan for team size",
                "Cheaper same-vendor tier",
                "Alternative tool fit",
                "Credits vs. retail pricing",
              ].map(item => (
                <div key={item} className="flex items-start gap-2">
                  <span className="text-sky-300">—</span>
                  <span className="text-[11px] leading-5 text-slate-500">{item}</span>
                </div>
              ))}
            </div>

            <div className="h-px bg-slate-200/80" />

            <div className="space-y-1">
              <p className="text-[10px] uppercase tracking-[0.3em] text-slate-400">Status</p>
              <p className="text-[11px] text-slate-500">
                {submitted
                  ? "Audit submitted."
                  : canSubmit
                  ? "Ready to run."
                  : "Fill in team context and at least one tool."}
              </p>
            </div>
          </div>
        </div>

        
        {submitted && (
          <div className="mt-6 space-y-8 border border-slate-200 bg-white p-5 shadow-[0_20px_60px_-48px_rgba(15,23,42,0.45)] sm:p-7 lg:p-8">

            <div className="flex items-center justify-between">
              <SectionLabel index="04" label="Audit results" />
              <span className="text-[10px] uppercase tracking-[0.3em] text-slate-400">
                Wire your audit engine here
              </span>
            </div>

            {/* Hero savings — plug your numbers in */}
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="border border-slate-200 bg-slate-50 p-6 space-y-2">
                <p className="text-[10px] uppercase tracking-[0.3em] text-slate-400">Est. monthly savings</p>
                <p className="text-4xl font-light text-slate-950">—</p>
              </div>
              <div className="border border-slate-200 bg-slate-50 p-6 space-y-2">
                <p className="text-[10px] uppercase tracking-[0.3em] text-slate-400">Est. annual savings</p>
                <p className="text-4xl font-light text-slate-950">—</p>
              </div>
            </div>

            {/* Per-tool rows */}
            <div className="space-y-3">
              <p className="text-[10px] uppercase tracking-[0.3em] text-slate-400">Per-tool breakdown</p>
              {validEntries.map((e, i) => {
                const tool = TOOLS.find(t => t.id === e.toolId)
                return (
                  <div key={i} className="grid grid-cols-[1fr_auto] gap-4 border border-slate-200 bg-slate-50 px-4 py-4">
                    <div>
                      <p className="text-xs text-slate-800">{tool?.name}</p>
                      <p className="mt-1 text-[11px] text-slate-400">
                        {e.plan} · {e.seats} seat{Number(e.seats) !== 1 ? "s" : ""}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-slate-600">${Number(e.monthlySpend || 0).toLocaleString()}/mo</p>
                      <p className="text-[11px] text-slate-300">savings: —</p>
                    </div>
                  </div>
                )
              })}
            </div>

            {/* AI summary placeholder */}
            <div className="border border-slate-200 bg-slate-50 p-6 space-y-2">
              <p className="text-[10px] uppercase tracking-[0.3em] text-slate-400">AI-generated summary</p>
              <p className="text-[11px] leading-6 text-slate-400">
                Anthropic API response will render here.
              </p>
            </div>

            {/* Lead capture */}
            <div className="border border-slate-200 p-6 space-y-5">
              <div>
                <p className="text-xs font-medium text-slate-900">Get the full report</p>
                <p className="mt-1 text-[11px] text-slate-500">
                  Enter your email to receive a detailed PDF. High-savings audits include a free Credex consultation offer.
                </p>
              </div>
              <div className="grid gap-3 md:grid-cols-[1fr_1fr_auto]">
                <Input
                  placeholder="Work email"
                  type="email"
                  className="h-11 rounded-none border-slate-200 bg-slate-50 text-sm text-slate-900 placeholder:text-slate-400 focus-visible:border-sky-400 focus-visible:ring-0"
                />
                <Input
                  placeholder="Company (optional)"
                  className="h-11 rounded-none border-slate-200 bg-slate-50 text-sm text-slate-900 placeholder:text-slate-400 focus-visible:border-sky-400 focus-visible:ring-0"
                />
                <Button className="h-11 rounded-none bg-slate-950 px-6 text-[10px] uppercase tracking-widest text-white hover:bg-sky-700">
                  Send report
                </Button>
              </div>
            </div>

          </div>
        )}

        {/* ── Footer ──────────────────────────────────────────────────────── */}
        <div className="mt-8 px-1">
          <span className="text-[10px] uppercase tracking-[0.3em] text-slate-400">
            Pricing data verified weekly · Sources in PRICING_DATA.md
          </span>
        </div>

      </div>
    </div>
  )
}

// ─── Sub-components ────────────────────────────────────────────────────────────

function SectionLabel({ index, label }: { index: string; label: string }) {
  return (
    <div className="flex items-center gap-3">
      <span className="text-[10px] text-sky-500">{index}</span>
      <span className="text-[10px] uppercase tracking-[0.3em] text-slate-500">{label}</span>
    </div>
  )
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-2.5">
      <Label className="text-[10px] uppercase tracking-[0.25em] text-slate-500">{label}</Label>
      {children}
    </div>
  )
}

function ToolRow({
  toolId,
  plan,
  seats,
  monthlySpend,
  onToolChange,
  onPlanChange,
  onSeatsChange,
  onMonthlySpendChange,
}: {
  toolId: ToolId | ""
  plan: string
  seats: number | 0
  monthlySpend: number | 0
  onToolChange: (value: string) => void
  onPlanChange: (value: string) => void
  onSeatsChange: (value: number) => void
  onMonthlySpendChange: (value: number) => void
}) {
  const selectedTool = TOOLS.find(t => t.id === toolId)

  return (
    <div className="space-y-5 border border-slate-200 bg-slate-50/80 p-4 sm:p-5">
      <div className="flex items-center justify-between gap-4">
        <span className="text-[10px] uppercase tracking-[0.3em] text-slate-500">Tool details</span>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <Field label="Tool">
          <Select value={toolId} onValueChange={onToolChange}>
            <SelectTrigger className="h-11 rounded-none border-slate-200 bg-white text-sm text-slate-900 focus:border-sky-400 focus:ring-0">
              <SelectValue placeholder="Select tool" />
            </SelectTrigger>
            <SelectContent className="rounded-none border-slate-200 bg-white">
              {TOOLS.map(t => (
                <SelectItem key={t.id} value={t.id} className="text-sm text-slate-700 focus:bg-sky-50 focus:text-slate-950">
                  {t.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </Field>

        <Field label="Plan">
          <Select value={plan} onValueChange={onPlanChange} disabled={!selectedTool}>
            <SelectTrigger className="h-11 rounded-none border-slate-200 bg-white text-sm text-slate-900 focus:border-sky-400 focus:ring-0 data-[disabled]:opacity-40">
              <SelectValue placeholder="Select plan" />
            </SelectTrigger>
            <SelectContent className="rounded-none border-slate-200 bg-white">
              {selectedTool?.plans.map(p => (
                <SelectItem key={p} value={p} className="text-sm text-slate-700 focus:bg-sky-50 focus:text-slate-950">
                  {p}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </Field>

        <Field label="Seats">
          <Input
            type="number"
            min={1}
            placeholder="1"
            value={seats}
            onChange={e => onSeatsChange(Number(e.target.value))}
            className="h-11 rounded-none border-slate-200 bg-white text-sm text-slate-900 placeholder:text-slate-400 focus-visible:border-sky-400 focus-visible:ring-0"
          />
        </Field>

        <Field label="Monthly spend ($)">
          <Input
            type="number"
            min={0}
            step="0.01"
            placeholder="e.g. 400"
            value={monthlySpend}
            onChange={e => onMonthlySpendChange(Number(e.target.value))}
            className="h-11 rounded-none border-slate-200 bg-white text-sm text-slate-900 placeholder:text-slate-400 focus-visible:border-sky-400 focus-visible:ring-0"
          />
        </Field>
      </div>
    </div>
  )
}
