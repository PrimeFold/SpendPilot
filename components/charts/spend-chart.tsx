export function SpendChart() {
  return (
    <div className="rounded-3xl border border-border bg-card p-6 shadow-sm">
      <p className="text-sm uppercase tracking-[0.3em] text-primary">Spend chart</p>
      <div className="mt-6 grid grid-cols-3 gap-3 text-center text-sm text-slate-400">
        <div className="rounded-3xl bg-slate-900/80 p-4">AI API</div>
        <div className="rounded-3xl bg-slate-900/80 p-4">Storage</div>
        <div className="rounded-3xl bg-slate-900/80 p-4">Analytics</div>
      </div>
    </div>
  )
}
