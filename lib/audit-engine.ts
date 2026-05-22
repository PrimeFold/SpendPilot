"use server"

import { prisma } from "./prisma"
import { AuditInput, AuditResult } from "@/types/audit"
import { AI_PRICING } from "./ai-pricing"

export type AuditRecommendation = {
  title: string
  description: string
  monthlySavings: number
}

type AuditRule = (
  input: AuditInput,
  seatPrice: number
) => AuditRecommendation[]



const providerRules: Record<
  string,
  Record<string, AuditRule>
> = {
  chatgpt: {
    team: (input, seatPrice) => {
      const recs: AuditRecommendation[] = []

      if (input.seats > input.teamSize) {
        const unusedSeats =
          input.seats - input.teamSize

        recs.push({
          title: "Reduce unused licenses",
          description:
            "Your organization is paying for more ChatGPT Team licenses than actively required.",
          monthlySavings:
            unusedSeats * seatPrice,
        })
      }

      if (input.teamSize <= 2) {
        recs.push({
          title: "Downgrade to ChatGPT Plus",
          description:
            "Smaller teams may not require collaboration-focused Team features.",
          monthlySavings:
            input.seats * 5,
        })
      }

      return recs
    },
  },

  cursor: {
    business: (input) => {
      const recs: AuditRecommendation[] = []

      if (input.teamSize < 5) {
        recs.push({
          title:
            "Consider Cursor Pro instead of Business",
          description:
            "Smaller engineering teams may not benefit from Business-tier controls.",
          monthlySavings:
            input.seats * 20,
        })
      }

      return recs
    },
  },

  github_copilot: {
    enterprise: (input) => {
      const recs: AuditRecommendation[] = []

      if (input.teamSize < 10) {
        recs.push({
          title:
            "Downgrade from Copilot Enterprise",
          description:
            "Enterprise controls may be unnecessary for smaller development teams.",
          monthlySavings:
            input.seats * 20,
        })
      }

      return recs
    },
  },

  claude: {
    team: (input, seatPrice) => {
      const recs: AuditRecommendation[] = []

      if (input.seats > input.teamSize) {
        recs.push({
          title:
            "Reduce unused Claude Team licenses",
          description:
            "Some Claude Team seats appear underutilized.",
          monthlySavings:
            (input.seats - input.teamSize) *
            seatPrice,
        })
      }

      return recs
    },
  },

  gemini: {
    ultra: (input) => {
      const recs: AuditRecommendation[] = []

      if (input.teamSize <= 3) {
        recs.push({
          title:
            "Review Gemini Ultra necessity",
          description:
            "Gemini Ultra may be excessive for smaller organizations with moderate AI usage.",
          monthlySavings:
            input.seats * 200,
        })
      }

      return recs
    },
  },

  windsurf: {
    teams: (input) => {
      const recs: AuditRecommendation[] = []

      if (input.teamSize <= 2) {
        recs.push({
          title:
            "Downgrade Windsurf Teams plan",
          description:
            "Smaller teams may achieve similar productivity using Pro plans.",
          monthlySavings:
            input.seats * 15,
        })
      }

      return recs
    },
  },
}

function calculateMonthlySpend(
  input: AuditInput
) {
  const providerPricing =
    AI_PRICING[input.toolId]

  if (!providerPricing) {
    return {
      currentSpend: 0,
      seatPrice: 0,
    }
  }

  const seatPrice =
    providerPricing[
      input.plan.toLowerCase()
    ] ?? 0

  return {
    currentSpend:
      seatPrice * input.seats,
    seatPrice,
  }
}

function computeResult(
  currentSpend: number,
  recommendations: AuditRecommendation[]
): AuditResult {
  const monthlySavings =
    recommendations.reduce(
      (acc, rec) =>
        acc + rec.monthlySavings,
      0
    )

  return {
    currentSpend,
    optimizedSpend: Math.max(
      currentSpend - monthlySavings,
      0
    ),
    monthlySavings,
    annualSavings:
      monthlySavings * 12,
  }
}

export async function runAudit(
  input: AuditInput
): Promise<{
  result: AuditResult
  recommendations: AuditRecommendation[]
}> {
  const {
    currentSpend,
    seatPrice,
  } = calculateMonthlySpend(input)

  const rule =
    providerRules[input.toolId]?.[
      input.plan.toLowerCase()
    ]

  const recommendations = rule
    ? rule(input, seatPrice)
    : []

  const result = computeResult(
    currentSpend,
    recommendations
  )

  return {
    result,
    recommendations,
  }
}

export async function storeAudit(
  input: AuditInput,
  result: AuditResult,
  recommendations: AuditRecommendation[],
  summary?: string
) {
  const audit =
    await prisma.audit.create({
      data: {
        toolId: input.toolId,
        plan: input.plan,

        teamSize: input.teamSize,
        seats: input.seats,

        monthlySpend:
          result.currentSpend,

        useCase: input.useCase,

        currentSpend:
          result.currentSpend,

        optimizedSpend:
          result.optimizedSpend,

        monthlySavings:
          result.monthlySavings,

        annualSavings:
          result.annualSavings,

        summary,
      },
    })

  if (recommendations.length > 0) {
    await prisma.recommendation.createMany(
      {
        data: recommendations.map(
          (r) => ({
            auditId: audit.id,
            title: r.title,
            description:
              r.description,
            monthlySavings:
              r.monthlySavings,
          })
        ),
      }
    )
  }

  return audit
}