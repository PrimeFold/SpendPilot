"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"

export const LandingClient = () => {
  return (
    <div className="min-h-[calc(100vh-6rem)] bg-[radial-gradient(circle_at_top,_rgba(79,70,229,0.16),_transparent_40%),radial-gradient(circle_at_bottom_right,_rgba(16,185,129,0.15),_transparent_30%)] py-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl rounded-[2rem] border border-border bg-card/95 p-8 shadow-xl shadow-slate-950/5 backdrop-blur-xl sm:p-12">
          <div className="space-y-6 text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-primary">
              AI spend audit
            </p>
            <h1 className="text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
              SpendPilot helps you audit AI costs in 60 seconds.
            </h1>
            <p className="mx-auto max-w-2xl text-base leading-8 text-muted-foreground sm:text-lg">
              A clean, simple interface to plan your AI spend review, capture tool usage, and map savings opportunities. No auth, no clutter — just a fast path to your audit setup.
            </p>
          </div>

          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row sm:justify-center">
            <Link href="/dashboard">
              <Button size="lg">Get started</Button>
            </Link>
            <Link href="/dashboard" className="text-sm font-medium text-primary underline-offset-4 hover:underline">
              View interface demo
            </Link>
          </div>

          <div className="mt-12 grid gap-4 sm:grid-cols-3">
            {[
              "Spend overview",
              "Audit settings",
              "Action-ready workflow",
            ].map((item) => (
              <div key={item} className="rounded-3xl border border-border bg-background/90 p-4 text-center">
                <p className="text-sm font-semibold text-foreground">{item}</p>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  Prepare the components and wire your business logic where it belongs.
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}