"use client"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import {LogoLoop as OriginalLogoLoop} from '@/components/LogoLoop'
import { CSSProperties } from "react"

interface LogoLoopProps {
  logos: { src: string; alt: string; }[];
  speed?: number;
  direction?: 'left' | 'right' | 'up' | 'down';
  width?: string | number;
  logoHeight?: number;
  gap?: number;
  pauseOnHover?: boolean;
  hoverSpeed?: number;
  fadeOut?: boolean;
  fadeOutColor?: string;
  scaleOnHover?: boolean;
  ariaLabel?: string;
  className?: string;
  style?: CSSProperties;
}
const LogoLoop = OriginalLogoLoop as React.FC<LogoLoopProps>;

const LOGOS = [
  { src: "/cursor.svg", alt: "Cursor" },
  { src: "/copilot-color.svg", alt: "GitHub Copilot" },
  { src: "/claude-color.svg", alt: "Claude" },
  { src: "/openai.svg", alt: "OpenAI" },
  { src: "/anthropic.svg", alt: "Anthropic" },
  { src: "/openai.svg", alt: "OpenAI" },
  { src: "/gemini-color.svg", alt: "Gemini" },
  { src: "/windsurf.svg", alt: "Windsurf" },
];
const STEPS = [
  {
    n: "01",
    title: "Input your stack",
    body: "Add every AI tool you pay for with exact plan, seats, and monthly spend.",
  },
  {
    n: "02",
    title: "Review defence-ready findings",
    body: "The audit checks plan fit, same-vendor price tiers, and lower-cost alternative tools.",
  },
  {
    n: "03",
    title: "See line-item reasoning",
    body: "Each recommendation is expressed with seat economics and vendor pricing references.",
  },
  {
    n: "04",
    title: "Capture the report",
    body: "Export or email the audit with sourceable pricing assumptions from PRICING_DATA.md.",
  },
]

export const LandingClient = () => {
  return (
    <section className="md:mb-10 bg-slate-50 text-slate-950 min-h-screen overflow-x-hidden">
      <div className="mx-auto max-w-6xl px-6 pt-20 sm:px-8 lg:px-10">
        <div className="grid gap-10 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
          <div className="space-y-6">
            <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">
              Audit AI spend with seat-level and vendor-fit reasoning.
            </h1>
            <p className="max-w-2xl text-base leading-8 text-slate-600 sm:text-lg">
              Add your AI tools, current plan, seats, and monthly bill to get a front-end audit that explains why each recommendation is finance-ready.
            </p>
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
              <Link href="/dashboard">
                <Button className="rounded-none bg-slate-950 px-8 py-3 text-[10px] uppercase tracking-widest text-white hover:bg-slate-800">
                  get started
                </Button>
              </Link>
            </div>
          </div>
          <div className="rounded-[1.75rem] border border-slate-200 bg-white p-8 shadow-sm">
            <p className="text-sm uppercase tracking-[0.28em] text-slate-500">Audit preview</p>
            <div className="mt-6 space-y-4">
              <div className="rounded-3xl bg-slate-50 p-5">
                <p className="font-semibold text-slate-950">Usage-fit reasoning</p>
                <p className="mt-2 text-sm text-slate-600">Plan recommendations are tied to seat count, use case, and published list prices.</p>
              </div>
              <div className="rounded-3xl bg-slate-50 p-5">
                <p className="font-semibold text-slate-950">Alternative comparison</p>
                <p className="mt-2 text-sm text-slate-600">The dashboard highlights cheaper same-vendor tiers and credible vendor alternatives.</p>
              </div>
              <div className="rounded-3xl bg-slate-50 p-5">
                <p className="font-semibold text-slate-950">Retail vs credits</p>
                <p className="mt-2 text-sm text-slate-600">We show whether your declared cost is retail-level and when credits typically offer a discount.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <LogoLoop
        className="md:mt-10"
        logos={LOGOS}
        speed={40}
        direction="left"
        gap={100}
        logoHeight={35}
        hoverSpeed={30}
        scaleOnHover
        fadeOut={true}
        fadeOutColor="rgb(250 250 252)"
      />

      <div className="mx-auto max-w-6xl px-6 pb-20 sm:px-8 lg:px-10">
        <div className="mt-16 grid gap-6 lg:grid-cols-3">
          {STEPS.map((step) => (
            <div key={step.n} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <p className="text-[10px] uppercase tracking-[0.35em] text-slate-500">{step.n}</p>
              <p className="mt-4 text-lg font-semibold text-slate-950">{step.title}</p>
              <p className="mt-3 text-sm leading-6 text-slate-600">{step.body}</p>
            </div>
          ))}
        </div>

        <div className="mt-16 rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.35em] text-slate-500">Pricing sources</p>
              <p className="mt-2 text-2xl font-semibold text-slate-950">Sources in PRICING_DATA.md</p>
            </div>
            <Link href="/dashboard">
              <Button className="rounded-none bg-slate-950 px-8 py-3 text-[10px] uppercase tracking-widest text-white hover:bg-slate-800">
                Run the audit
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}