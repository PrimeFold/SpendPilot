import { ReactNode } from "react"

interface SectionProps {
  title: string
  description: string
  children: ReactNode
}

export function Section({ title, description, children }: SectionProps) {
  return (
    <section className="rounded-3xl border border-border bg-card p-6 shadow-sm">
      <div className="mb-6">
        <p className="text-sm uppercase tracking-[0.28em] text-primary">{title}</p>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">{description}</p>
      </div>
      {children}
    </section>
  )
}
