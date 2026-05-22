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
  },

  chatgpt: {
    Plus: (input) => {
      if (input.seats > 1 || input.teamSize > 1) {
        return {
          title: "Move from ChatGPT Plus to Team",
          description:
            "Plus is designed for individuals; teams should use Team for shared access and better management.",
          monthlySavings: 35,
        }
      }

      return {
        title: "ChatGPT Plus is a solid choice for one user",
        description:
          "Plus is ideal when a single person is using ChatGPT and team-wide access is not required.",
        monthlySavings: 0,
      }
    },

    Team: (input) => {
      if (input.teamSize <= 3 && input.seats <= 3) {
        return {
          title: "Consider ChatGPT Plus for a very small team",
          description:
            "If just a few people are using ChatGPT, Plus may be a more economical choice than Team.",
          monthlySavings: 30,
        }
      }

      return {
        title:
          "ChatGPT Team is generally well matched to your current usage",
        description:
          "Team works well for small groups that need shared access and centralized controls.",
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
  console.log("\n================ RUN AUDIT ================\n")

  console.log("RAW INPUT:")
  console.log(input)

  console.log("\nAVAILABLE PROVIDERS:")
  console.log(Object.keys(providerRules))

  const normalizedToolId = input.toolId.trim()
  const normalizedPlan = input.plan.trim()

  console.log("\nNORMALIZED VALUES:")
  console.log({
    normalizedToolId,
    normalizedPlan,
  })

  const provider = providerRules[normalizedToolId]

  console.log("\nPROVIDER FOUND:")
  console.log(provider)

  if (!provider) {
    console.error(
      `❌ No provider rules found for toolId: ${normalizedToolId}`
    )
  }

  const planRule = provider?.[normalizedPlan]

  console.log("\nPLAN RULE FOUND:")
  console.log(planRule)

  if (!planRule) {
    console.error(
      `❌ No plan rule found for plan: ${normalizedPlan}`
    )
  }

  const recommendations: AuditRecommendation[] = []

  let monthlySavings = 0

  if (planRule) {
    console.log("\nRUNNING PLAN RULE...\n")

    const recommendation = planRule(input)

    console.log("RECOMMENDATION RESULT:")
    console.log(recommendation)

    if (recommendation) {
      const normalizedSavings =
        normalizeMonthlySavings(
          recommendation.monthlySavings,
          input.monthlySpend
        )

      monthlySavings += normalizedSavings

      recommendations.push({
        ...recommendation,
        monthlySavings: normalizedSavings,
      })

      console.log("\nUPDATED RECOMMENDATIONS:")
      console.log(recommendations)

      console.log("\nUPDATED MONTHLY SAVINGS:")
      console.log(monthlySavings)
    }
  } else {
    console.log(
      "\n⚠️ ENTERING FALLBACK RECOMMENDATION BRANCH\n"
    )

    recommendations.push({
      title: "Review your plan selection",
      description:
        "We do not have a specific optimization rule for this combination yet. Verify that the plan matches your team size and usage profile.",
      monthlySavings: 0,
    })
  }

  if (input.seats > input.teamSize + 1) {
    console.log(
      "\n⚠️ EXCESS SEAT RULE TRIGGERED\n"
    )

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

    console.log("\nEXCESS SEAT RECOMMENDATION ADDED:")
    console.log(recommendations)
  }

  if (recommendations.length === 0) {
    console.log(
      "\n⚠️ NO RECOMMENDATIONS GENERATED\n"
    )

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

  const finalResult: AuditResult = {
    currentSpend: input.monthlySpend,
    optimizedSpend: Math.max(
      0,
      input.monthlySpend - monthlySavings
    ),
    monthlySavings,
    annualSavings: monthlySavings * 12,
    recommendations,
  }

  console.log("\nFINAL RESULT:")
  console.log(JSON.stringify(finalResult, null, 2))

  console.log(
    "\n===========================================\n"
  )

  return finalResult
}

export async function storeAudit(
  input: AuditInput,
  summary: string,
  result?: AuditResult
) {
  console.log("\n=========== STORE AUDIT ===========\n")

  const auditResult = result ?? (await runAudit(input))

  console.log("AUDIT RESULT TO STORE:")
  console.log(JSON.stringify(auditResult, null, 2))

  const slug = `audit-${Date.now().toString(
    36
  )}-${Math.random().toString(36).slice(2, 8)}`

  console.log("\nGENERATED SLUG:")
  console.log(slug)

  try {
    const audit = await prisma.audit.create({
      data: {
        slug,
        input: toJsonValue(input),
        result: toJsonValue(auditResult),
        summary,
      },
    })

    console.log("\n✅ AUDIT STORED SUCCESSFULLY")
    console.log(audit)

    return {
      success: true,
      message: "Audit saved successfully",
      data: audit,
    }
  } catch (error) {
    console.error("\n❌ STORE AUDIT FAILED")
    console.error(error)

    return {
      success: false,
      message: "Internal Server error"
    }
  }
}