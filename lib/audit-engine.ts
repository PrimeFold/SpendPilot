"use server"

import { Prisma } from "@/generated/prisma/client"
import {
  AuditInput,
  AuditRecommendation,
  AuditResult,
} from "@/types/audit"
import { prisma } from "./prisma"

type AuditRule = (
  input: AuditInput
) => AuditRecommendation | null

const providerRules: Record<string, Record<string, AuditRule>> = {
  cursor: {
    Hobby: (input) => {
      if (input.teamSize > 2 || input.seats > 1) {
        return {
          title: "Upgrade to Cursor Pro for small teams",
          description:
            "Cursor Hobby is best for single users; with larger teams or multiple seats, Cursor Pro reduces per-seat cost and adds collaboration features.",
          monthlySavings: 40,
        }
      }

      return {
        title: "Cursor Hobby is a good fit for your team",
        description:
          "Your current team size and seat count are well matched to Cursor Hobby, so you are not paying for unnecessary seats.",
        monthlySavings: 0,
      }
    },

    Pro: (input) => {
      if (input.teamSize > 10 || input.seats > 8) {
        return {
          title: "Consider Cursor Business for growing teams",
          description:
            "Cursor Pro is ideal for small groups; a larger team should move to Business for better volume pricing and admin controls.",
          monthlySavings: 45,
        }
      }

      if (input.teamSize <= 2 && input.seats <= 2) {
        return {
          title: "Cursor Hobby may save money for small usage",
          description:
            "Your current Pro seats look like a small team. Cursor Hobby could save costs if you are mostly using a single contributor.",
          monthlySavings: 35,
        }
      }

      return {
        title: "Cursor Pro is aligned with your current usage",
        description:
          "Your team size and seat count are appropriate for Cursor Pro, making it a balanced choice between features and cost.",
        monthlySavings: 0,
      }
    },

    Business: (input) => {
      if (input.teamSize <= 2 && input.seats <= 2) {
        return {
          title: "Cursor Business is likely overkill",
          description:
            "Very small teams can usually move down to Pro without losing essential capabilities, freeing up budget for other AI tools.",
          monthlySavings: 55,
        }
      }

      if (input.teamSize > 25 || input.seats > 20) {
        return {
          title:
            "Cursor Enterprise may be the better long-term choice",
          description:
            "High seat counts and larger teams can capture stronger volume pricing and dedicated enterprise support by upgrading.",
          monthlySavings: 70,
        }
      }

      return {
        title: "Cursor Business is a solid match for your usage",
        description:
          "Your current team and seat count are a good fit for Cursor Business unless you need enterprise governance features.",
        monthlySavings: 0,
      }
    },

    Enterprise: (input) => {
      if (input.teamSize <= 8 && input.seats <= 8) {
        return {
          title: "Cursor Enterprise may be oversized",
          description:
            "Smaller teams on Enterprise often save by moving to Business while keeping most collaboration and admin capabilities.",
          monthlySavings: 85,
        }
      }

      return {
        title:
          "Cursor Enterprise looks appropriate for a large organization",
        description:
          "Enterprise is justified for teams with broad seat coverage or strict compliance needs, but continue to review seat utilization.",
        monthlySavings: 0,
      }
    },
  },

  github_copilot: {
    Individual: (input) => {
      if (input.seats > 1 || input.teamSize > 1) {
        return {
          title: "Upgrade from Individual to Business",
          description:
            "GitHub Copilot Individual is intended for one user; multi-user teams should move to Business to avoid per-seat overcharges.",
          monthlySavings: 50,
        }
      }

      return {
        title: "Individual plan suits your single-user team",
        description:
          "GitHub Copilot Individual is the best fit when only one person is using the tool and team-wide access is not required.",
        monthlySavings: 0,
      }
    },

    Business: (input) => {
      if (input.seats <= 2 && input.teamSize <= 4) {
        return {
          title:
            "Consider Copilot Individual for a very small team",
          description:
            "If only a couple of people are using Copilot, the Individual plan may be more cost-effective than Business.",
          monthlySavings: 45,
        }
      }

      if (input.seats > 15 || input.teamSize > 30) {
        return {
          title: "Evaluate GitHub Copilot Enterprise",
          description:
            "Larger organizations often benefit from Enterprise pricing and centralized admin controls once seat counts grow.",
          monthlySavings: 60,
        }
      }

      return {
        title:
          "GitHub Copilot Business is generally well suited for your team",
        description:
          "Business offers a good balance of collaboration and price for most small-to-medium engineering teams.",
        monthlySavings: 0,
      }
    },

    Enterprise: (input) => {
      if (input.seats <= 5 && input.teamSize <= 10) {
        return {
          title:
            "GitHub Copilot Enterprise may be more than needed",
          description:
            "Smaller engineering organizations can often save by using Business unless they require enterprise-grade compliance or single sign-on.",
          monthlySavings: 65,
        }
      }

      return {
        title:
          "GitHub Copilot Enterprise is appropriate for a large engineering organization",
        description:
          "Enterprise is the right choice for teams that need advanced governance, security, and usage controls across many developers.",
        monthlySavings: 0,
      }
    },
  },

  claude: {
    Free: (input) => {
      if (input.teamSize > 2 || input.monthlySpend > 0) {
        return {
          title: "Upgrade from Claude Free to a paid tier",
          description:
            "Claude Free is best for basic experimentation; active teams or any paid usage should move to Pro or higher.",
          monthlySavings: 20,
        }
      }

      return {
        title: "Claude Free is a reasonable starting point",
        description:
          "Free access is a good entry plan for small teams with limited use, but monitor usage if it grows.",
        monthlySavings: 0,
      }
    },

    Pro: (input) => {
      if (input.teamSize > 6 || input.seats > 6) {
        return {
          title: "Consider Claude Max for larger teams",
          description:
            "Claude Pro works for small groups, but teams with heavier usage will save by upgrading to Max or Team.",
          monthlySavings: 35,
        }
      }

      if (input.teamSize <= 2 && input.seats <= 2) {
        return {
          title:
            "Claude Free may be enough for very light usage",
          description:
            "If your team is small and spend is minimal, Claude Free could replace Pro for basic workflows.",
          monthlySavings: 25,
        }
      }

      return {
        title:
          "Claude Pro is a good fit for your current team",
        description:
          "Pro is well suited for small teams that need more capacity than Free without paying for Team-level pricing.",
        monthlySavings: 0,
      }
    },

    Max: (input) => {
      if (input.teamSize > 10 || input.seats > 10) {
        return {
          title:
            "Evaluate Claude Team for broader collaboration",
          description:
            "Claude Max is strong for growing teams, but Team offers additional workspace and management benefits.",
          monthlySavings: 40,
        }
      }

      if (input.teamSize <= 4 && input.seats <= 4) {
        return {
          title:
            "Claude Pro may be sufficient for smaller groups",
          description:
            "If your team remains compact, Max is likely more expensive than necessary compared to Pro.",
          monthlySavings: 30,
        }
      }

      return {
        title:
          "Claude Max aligns with moderate team demand",
        description:
          "Max is a sensible middle tier for teams needing stronger performance than Pro without full Team-level capacity.",
        monthlySavings: 0,
      }
    },

    Team: (input) => {
      if (input.teamSize <= 6 && input.seats <= 6) {
        return {
          title: "Claude Max may be a better value",
          description:
            "For smaller teams, the Team tier can be overkill; Claude Max often delivers the same capabilities at lower cost.",
          monthlySavings: 30,
        }
      }

      if (input.monthlySpend > 3000) {
        return {
          title:
            "Review Claude Enterprise or negotiated pricing",
          description:
            "Very high spend can often be improved through a custom enterprise agreement rather than standard Team pricing.",
          monthlySavings: 55,
        }
      }

      return {
        title:
          "Claude Team is appropriate for multi-user collaboration",
        description:
          "Team is a good choice for organizations managing several active users across AI workflows.",
        monthlySavings: 0,
      }
    },

    "API direct": (input) => {
      if (input.monthlySpend > 2500) {
        return {
          title:
            "Negotiate Claude enterprise pricing for high spend",
          description:
            "When API spend grows, a committed enterprise contract usually delivers significantly better unit economics.",
          monthlySavings: 90,
        }
      }

      return {
        title:
          "Claude API direct is a flexible option for usage-based spend",
        description:
          "Pay-as-you-go is sensible for variable API consumption, but review token usage to avoid unforeseen cost spikes.",
        monthlySavings: 0,
      }
    },
  },
}

function normalizeMonthlySavings(
  value: number,
  currentSpend: number
): number {
  return Math.max(0, Math.min(value, currentSpend))
}

function toJsonValue<T>(value: T): Prisma.InputJsonValue {
  return JSON.parse(JSON.stringify(value)) as Prisma.InputJsonValue
}

export async function runAudit(
  input: AuditInput
): Promise<AuditResult> {
  const provider = providerRules[input.toolId]
  const planRule = provider?.[input.plan]

  const recommendations: AuditRecommendation[] = []

  let monthlySavings = 0

  if (planRule) {
    const recommendation = planRule(input)

    if (recommendation) {
      const normalizedSavings = normalizeMonthlySavings(
        recommendation.monthlySavings,
        input.monthlySpend
      )

      monthlySavings += normalizedSavings

      recommendations.push({
        ...recommendation,
        monthlySavings: normalizedSavings,
      })
    }
  } else {
    recommendations.push({
      title: "Review your plan selection",
      description:
        "We do not have a specific optimization rule for this combination yet. Verify that the plan matches your team size and usage profile.",
      monthlySavings: 0,
    })
  }

  if (input.seats > input.teamSize + 1) {
    const excessSeats = input.seats - input.teamSize

    const excessSavings = Math.min(
      25,
      excessSeats * 10
    )

    const normalizedExcessSavings =
      normalizeMonthlySavings(
        excessSavings,
        input.monthlySpend - monthlySavings
      )

    monthlySavings += normalizedExcessSavings

    recommendations.push({
      title: "Review seat allocation",
      description: `You have ${excessSeats} more seats than active team members. Eliminating unused seats can reduce recurring costs without changing your plan.`,
      monthlySavings: normalizedExcessSavings,
    })
  }

  if (recommendations.length === 0) {
    recommendations.push({
      title: "No immediate audit recommendations",
      description:
        "Your selected plan appears aligned with the provided team size and spend. Continue monitoring usage for future opportunities.",
      monthlySavings: 0,
    })
  }

  monthlySavings = normalizeMonthlySavings(
    monthlySavings,
    input.monthlySpend
  )

  return {
    currentSpend: input.monthlySpend,
    optimizedSpend: Math.max(
      0,
      input.monthlySpend - monthlySavings
    ),
    monthlySavings,
    annualSavings: monthlySavings * 12,
    recommendations,
  }
}

export async function storeAudit(
  input: AuditInput,
  summary: string,
  result?: AuditResult
) {
  const auditResult = result ?? (await runAudit(input))

  const slug = `audit-${Date.now().toString(
    36
  )}-${Math.random().toString(36).slice(2, 8)}`

  try {
    const audit = await prisma.audit.create({
      data: {
        slug,
        input: toJsonValue(input),
        result: toJsonValue(auditResult),
        summary,
      },
    })

    return {
      success: true,
      message: "Audit saved successfully",
      data: audit,
    }
  } catch (error) {
    return {
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Unknown error occurred",
    }
  }
}