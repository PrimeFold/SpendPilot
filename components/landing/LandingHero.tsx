import Link from "next/link"
import { Button } from "@/components/ui/button"

export function LandingHero() {
  return (
    <section className="bg-slate-50 text-slate-950">
      <div className="mx-auto max-w-6xl px-6 py-20 sm:px-8 lg:px-10">
        <div className="grid gap-10 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
          <div className="space-y-6">
            <p className="text-xs uppercase tracking-[0.3em] text-slate-500">
              Free • No login required
            </p>
            <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">
              Audit AI spend with a clean, light experience.
            </h1>
            <p className="max-w-2xl text-base leading-8 text-slate-600 sm:text-lg">
              Add your tools, plans, seats, and monthly spend to get a focused audit and savings estimate. Simple, accurate, and easy to read.
            </p>
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
              <Link href="/dashboard">
                <Button className="rounded-none bg-slate-950 px-8 py-3 text-[10px] uppercase tracking-widest text-white hover:bg-slate-800">
                  Start free audit
                </Button>
              </Link>
              <Link
                href="/dashboard"
                className="text-[10px] uppercase tracking-[0.3em] text-slate-500 hover:text-slate-900 transition-colors"
              >
                Go to audit form →
              </Link>
            </div>
          </div>
          <div className="rounded-[1.75rem] border border-slate-200 bg-white p-8 shadow-sm">
            <p className="text-sm uppercase tracking-[0.28em] text-slate-500">Audit preview</p>
            <div className="mt-6 space-y-4">
              <div className="rounded-3xl bg-slate-50 p-5">
                <p className="font-semibold text-slate-950">Tool inventory</p>
                <p className="mt-2 text-sm text-slate-600">List every AI product your team pays for, including plan and spend.</p>
              </div>
              <div className="rounded-3xl bg-slate-50 p-5">
                <p className="font-semibold text-slate-950">Savings checks</p>
                <p className="mt-2 text-sm text-slate-600">We compare plan fit, seat count, and pricing to highlight overspend.</p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-16 grid gap-6 lg:grid-cols-3">
          {[
            {
              title: "Team details",
              description: "Capture headcount and primary AI use case for a tighter audit.",
            },
            {
              title: "Tool plans",
              description: "Choose the exact plan and seats for each AI vendor you pay for.",
            },
            {
              title: "Monthly cost",
              description: "Enter current spend so results reflect your actual budget.",
            },
          ].map((item) => (
            <div key={item.title} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <p className="text-sm font-semibold text-slate-950">{item.title}</p>
              <p className="mt-3 text-sm leading-6 text-slate-600">{item.description}</p>
            </div>
          ))}
        </div>

        <div className="mt-16 rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Trusted by</p>
              <p className="mt-2 text-xl font-semibold text-slate-950">Startups, teams, and operators.</p>
            </div>
            <Link href="/dashboard">
              <Button className="rounded-none bg-slate-950 px-8 py-3 text-[10px] uppercase tracking-widest text-white hover:bg-slate-800">
                Run audit
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
