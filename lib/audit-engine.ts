"use server"

import { prisma } from "./prisma"
import { AuditInput, AuditResult } from "@/types/audit"

export type AuditRecommendation = {
  title: string
  description: string
  monthlySavings: number
}

type AuditRule = (input: AuditInput) => AuditRecommendation[]

const providerRules: Record<string, Record<string, AuditRule>> = {
  chatgpt: {
    team: (input) => {
      const recs: AuditRecommendation[] = []

      if (input.seats > input.teamSize) {
        recs.push({
          title: "Reduce excess seats",
          description: "You are paying for unused seats.",
          monthlySavings: 20,
        })
      }

      return recs
    },
  },
}

function computeResult(input: AuditInput): AuditResult {
  const monthlySavings = input.monthlySpend * 0.2

  return {
    currentSpend: input.monthlySpend,
    optimizedSpend: input.monthlySpend - monthlySavings,
    monthlySavings,
    annualSavings: monthlySavings * 12,
  }
}

export async function runAudit(input: AuditInput): Promise<{
  result: AuditResult
  recommendations: AuditRecommendation[]
}> {
  const provider = providerRules[input.toolId]
  const rule = provider?.[input.plan.toLowerCase()]

  const result = computeResult(input)

  const recommendations = providerRules[input.toolId]?.[input.plan]
    ? providerRules[input.toolId][input.plan](input)
    : []

  return { result, recommendations }
}

export async function storeAudit(
  input: AuditInput,
  result: AuditResult,
  recommendations: AuditRecommendation[],
  summary?: string
) {
  const audit = await prisma.audit.create({
    data: {
      slug: `audit-${Date.now()}`,

      toolId: input.toolId,
      plan: input.plan,
      teamSize: input.teamSize,
      seats: input.seats,
      monthlySpend: input.monthlySpend,
      useCase: input.useCase,

      currentSpend: result.currentSpend,
      optimizedSpend: result.optimizedSpend,
      monthlySavings: result.monthlySavings,
      annualSavings: result.annualSavings,

      summary,
    },
  })

  if (recommendations.length > 0) {
    await prisma.recommendation.createMany({
      data: recommendations.map((r) => ({
        auditId: audit.id,
        title: r.title,
        description: r.description,
        monthlySavings: r.monthlySavings,
      })),
    })
  }

  return audit
}