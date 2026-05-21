import { Badge } from "@/components/ui/badge"

const summaryItems = [
  { title: "Spend health", value: "Moderate" },
  { title: "Vendor exposure", value: "High" },
  { title: "Optimization potential", value: "25%" },
]

export function AuditSummary() {
  return (
    <section className="space-y-6">
      <div className="rounded-[2rem] border border-border bg-card p-6 shadow-sm">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-primary">Audit summary</p>
            <h2 className="mt-3 text-2xl font-semibold text-foreground">Preview insights</h2>
          </div>
          <Badge variant="secondary">Draft</Badge>
        </div>
        <div className="mt-6 grid gap-4">
          {summaryItems.map((item) => (
            <div key={item.title} className="rounded-3xl border border-slate-800/80 bg-slate-950/70 p-4">
              <p className="text-sm text-slate-400">{item.title}</p>
              <p className="mt-2 text-xl font-semibold text-white">{item.value}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
