import Link from "next/link"
import { Button } from "@/components/ui/button"
import { AuditForm } from "@/components/forms/audit-form"
import { AuditSummary } from "@/components/audit/summary-card"

export default function AuditPage() {
  return (
    <main className="container mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <div className="mb-10 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.3em] text-primary">Audit workspace</p>
          <h1 className="mt-3 text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
            Configure your AI spend audit.
          </h1>
          <p className="mt-4 max-w-2xl text-base text-muted-foreground sm:text-lg">
            Use this page to collect all frontend audit inputs and review the audit summary before generating a report.
          </p>
        </div>
        <Link href="/" className="w-full max-w-xs md:w-auto">
          <Button variant="secondary" className="w-full md:w-auto">
            Back to home
          </Button>
        </Link>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.35fr_0.85fr]">
        <AuditForm />
        <AuditSummary />
      </div>
    </main>
  )
}
