import Link from "next/link"
import { Button } from "@/components/ui/button"

interface ReportPageProps {
  params: {
    id: string
  }
}

export default function ReportPage({ params }: ReportPageProps) {
  return (
    <main className="container mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <div className="rounded-[2rem] border border-border bg-card p-8 shadow-lg shadow-slate-950/10">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-primary">Audit report</p>
            <h1 className="mt-3 text-3xl font-semibold text-foreground sm:text-4xl">
              Report details for ID: {params.id}
            </h1>
            <p className="mt-4 text-sm leading-7 text-muted-foreground">
              The report page is scoped to the selected audit result and is ready to display summary insights, recommendations, and spend breakdown.
            </p>
          </div>
          <Link href="/audit" className="w-full max-w-xs lg:w-auto">
            <Button variant="secondary" className="w-full lg:w-auto">
              Return to audit
            </Button>
          </Link>
        </div>
      </div>
    </main>
  )
}
