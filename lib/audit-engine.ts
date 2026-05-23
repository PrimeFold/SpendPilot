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

const providerRules: Record<string, Record<string, AuditRule>> = {
  chatgpt: {
    free: () => [],
    plus: (input, seatPrice) => {
      const recs: AuditRecommendation[] = []
      if (input.seats > input.teamSize) {
        recs.push({
          title: "Reduce unused ChatGPT Plus seats",
          description: "You have more Plus licenses than active team members.",
          monthlySavings: (input.seats - input.teamSize) * seatPrice,
        })
      }
      return recs
    },
    team: (input, seatPrice) => {
      const recs: AuditRecommendation[] = []
      if (input.seats > input.teamSize) {
        recs.push({
          title: "Reduce unused ChatGPT Team licenses",
          description: "Your organization is paying for more ChatGPT Team licenses than actively required.",
          monthlySavings: (input.seats - input.teamSize) * seatPrice,
        })
      }
      if (input.teamSize <= 2) {
        recs.push({
          title: "Downgrade to ChatGPT Plus",
          description: "Smaller teams may not require collaboration-focused Team features.",
          monthlySavings: input.seats * 5,
        })
      }
      return recs
    },
    enterprise: (input, seatPrice) => {
      const recs: AuditRecommendation[] = []
      if (input.seats > input.teamSize) {
        recs.push({
          title: "Reduce unused Enterprise licenses",
          description: "Enterprise seats are expensive — unused licenses should be removed immediately.",
          monthlySavings: (input.seats - input.teamSize) * seatPrice,
        })
      }
      if (input.teamSize < 20) {
        recs.push({
          title: "Downgrade to ChatGPT Team",
          description: "Enterprise is designed for large orgs. Teams under 20 rarely need custom contracts and SSO.",
          monthlySavings: input.seats * 35,
        })
      }
      return recs
    },
    pro: (input, seatPrice) => {
      const recs: AuditRecommendation[] = []
      if (input.seats > 1) {
        recs.push({
          title: "Review ChatGPT Pro seat count",
          description: "ChatGPT Pro at $100/seat is designed for power users. Ensure all seats are actively used.",
          monthlySavings: (input.seats - Math.ceil(input.teamSize * 0.5)) * seatPrice,
        })
      }
      return recs
    },
  },
  cursor: {
    free: () => [],
    pro: (input, seatPrice) => {
      const recs: AuditRecommendation[] = []
      if (input.seats > input.teamSize) {
        recs.push({
          title: "Reduce unused Cursor Pro seats",
          description: "You have more Pro licenses than active developers.",
          monthlySavings: (input.seats - input.teamSize) * seatPrice,
        })
      }
      return recs
    },
    business: (input, seatPrice) => {
      const recs: AuditRecommendation[] = []
      if (input.teamSize < 5) {
        recs.push({
          title: "Consider Cursor Pro instead of Business",
          description: "Smaller engineering teams may not benefit from Business-tier admin controls.",
          monthlySavings: input.seats * 20,
        })
      }
      if (input.seats > input.teamSize) {
        recs.push({
          title: "Reduce unused Cursor Business seats",
          description: "Remove licenses for inactive developers to cut costs.",
          monthlySavings: (input.seats - input.teamSize) * seatPrice,
        })
      }
      return recs
    },
  },
  github_copilot: {
    individual: (input, seatPrice) => {
      const recs: AuditRecommendation[] = []
      if (input.seats > input.teamSize) {
        recs.push({
          title: "Reduce unused Copilot Individual seats",
          description: "Remove licenses not tied to active developers.",
          monthlySavings: (input.seats - input.teamSize) * seatPrice,
        })
      }
      return recs
    },
    business: (input, seatPrice) => {
      const recs: AuditRecommendation[] = []
      if (input.seats > input.teamSize) {
        recs.push({
          title: "Reduce unused Copilot Business seats",
          description: "Unused developer seats are a direct cost with no return.",
          monthlySavings: (input.seats - input.teamSize) * seatPrice,
        })
      }
      if (input.teamSize < 5) {
        recs.push({
          title: "Downgrade to Copilot Individual",
          description: "Small teams rarely need the org-level controls included in the Business plan.",
          monthlySavings: input.seats * 9,
        })
      }
      return recs
    },
    enterprise: (input, seatPrice) => {
      const recs: AuditRecommendation[] = []
      if (input.teamSize < 10) {
        recs.push({
          title: "Downgrade from Copilot Enterprise",
          description: "Enterprise controls are unnecessary for smaller development teams.",
          monthlySavings: input.seats * 20,
        })
      }
      if (input.seats > input.teamSize) {
        recs.push({
          title: "Remove unused Enterprise licenses",
          description: "At $39/seat, unused Enterprise licenses are the most expensive waste in your stack.",
          monthlySavings: (input.seats - input.teamSize) * seatPrice,
        })
      }
      return recs
    },
  },
  claude: {
    free: () => [],
    pro: (input, seatPrice) => {
      const recs: AuditRecommendation[] = []
      if (input.seats > input.teamSize) {
        recs.push({
          title: "Reduce unused Claude Pro seats",
          description: "You have more Pro licenses than active team members.",
          monthlySavings: (input.seats - input.teamSize) * seatPrice,
        })
      }
      return recs
    },
    team: (input, seatPrice) => {
      const recs: AuditRecommendation[] = []
      if (input.seats > input.teamSize) {
        recs.push({
          title: "Reduce unused Claude Team licenses",
          description: "Some Claude Team seats appear underutilized.",
          monthlySavings: (input.seats - input.teamSize) * seatPrice,
        })
      }
      if (input.teamSize <= 2) {
        recs.push({
          title: "Downgrade to Claude Pro",
          description: "Very small teams may not need Team-tier collaboration features.",
          monthlySavings: input.seats * 5,
        })
      }
      return recs
    },
    max: (input, seatPrice) => {
      const recs: AuditRecommendation[] = []
      if (input.seats > input.teamSize) {
        recs.push({
          title: "Reduce unused Claude Max seats",
          description: "At $100/seat, unused Max licenses are a significant overhead.",
          monthlySavings: (input.seats - input.teamSize) * seatPrice,
        })
      }
      if (input.teamSize < 3) {
        recs.push({
          title: "Review Claude Max necessity",
          description: "Claude Max is designed for heavy power users. Evaluate if Pro or Team meets your actual usage.",
          monthlySavings: input.seats * 75,
        })
      }
      return recs
    },
  },
  gemini: {
    free: () => [],
    pro: (input, seatPrice) => {
      const recs: AuditRecommendation[] = []
      if (input.seats > input.teamSize) {
        recs.push({
          title: "Reduce unused Gemini Pro seats",
          description: "Remove licenses for inactive team members.",
          monthlySavings: (input.seats - input.teamSize) * seatPrice,
        })
      }
      return recs
    },
    ultra: (input, seatPrice) => {
      const recs: AuditRecommendation[] = []
      if (input.teamSize <= 3) {
        recs.push({
          title: "Review Gemini Ultra necessity",
          description: "Gemini Ultra may be excessive for smaller organizations with moderate AI usage.",
          monthlySavings: input.seats * 200,
        })
      }
      if (input.seats > input.teamSize) {
        recs.push({
          title: "Remove unused Gemini Ultra seats",
          description: "At $250/seat, even one unused Ultra license is a significant monthly waste.",
          monthlySavings: (input.seats - input.teamSize) * seatPrice,
        })
      }
      return recs
    },
  },
  windsurf: {
    free: () => [],
    pro: (input, seatPrice) => {
      const recs: AuditRecommendation[] = []
      if (input.seats > input.teamSize) {
        recs.push({
          title: "Reduce unused Windsurf Pro seats",
          description: "Remove licenses for developers who are no longer active.",
          monthlySavings: (input.seats - input.teamSize) * seatPrice,
        })
      }
      return recs
    },
    teams: (input, seatPrice) => {
      const recs: AuditRecommendation[] = []
      if (input.teamSize <= 2) {
        recs.push({
          title: "Downgrade Windsurf Teams plan",
          description: "Smaller teams may achieve similar productivity using Pro plans.",
          monthlySavings: input.seats * 15,
        })
      }
      if (input.seats > input.teamSize) {
        recs.push({
          title: "Remove unused Windsurf Teams seats",
          description: "Unused team seats should be removed to reduce monthly overhead.",
          monthlySavings: (input.seats - input.teamSize) * seatPrice,
        })
      }
      return recs
    },
  },
}

function calculateMonthlySpend(input: AuditInput) {
  const providerPricing = AI_PRICING[input.toolId]
  if (!providerPricing) {
    return { currentSpend: 0, seatPrice: 0 }
  }
  const seatPrice = providerPricing[input.plan.toLowerCase()] ?? 0
  return {
    currentSpend: seatPrice * input.seats,
    seatPrice,
  }
}

export async function runAudit(input: AuditInput): Promise<{ result: AuditResult, recommendations: AuditRecommendation[] }> {
  
  const { currentSpend, seatPrice } = calculateMonthlySpend(input)
  
 
  const toolRules = providerRules[input.toolId.toLowerCase()]
  let recommendations: AuditRecommendation[] = []
  
  if (toolRules && toolRules[input.plan.toLowerCase()]) {
    recommendations = toolRules[input.plan.toLowerCase()](input, seatPrice)
  }

  
  if (currentSpend >= 500 || input.plan.toLowerCase().includes('enterprise') || input.plan.toLowerCase().includes('api')) {
    const credexDiscountSavings = currentSpend * 0.20;
    recommendations.push({
      title: "Source Infrastructure Credits via Credex",
      description: `You are paying full retail for ${input.toolId}. Because you spend over $500/mo, you qualify to purchase secondary-market AI credits through Credex, which typically yields a 20%+ discount on identical infrastructure.`,
      monthlySavings: credexDiscountSavings,
    });
  }

  
  if (input.toolId.toLowerCase() === 'cursor' && input.useCase.toLowerCase() === 'writing') {
     if (seatPrice >= 20) {
        const mismatchSavings = (seatPrice - 20) * input.seats;
        recommendations.push({
          title: "Realign Tooling with Primary Use Case",
          description: `Your primary use case is writing, but you are paying a premium for Cursor, an IDE. Switching to standard Claude Pro or ChatGPT Plus aligns tooling with actual needs and reduces seat costs.`,
          monthlySavings: mismatchSavings,
        });
     }
  }

  
  const totalMonthlySavings = recommendations.filter((r) => r.monthlySavings > 0).reduce((acc, rec) => acc + rec.monthlySavings, 0)

  const finalSavings = Math.min(totalMonthlySavings, currentSpend);

  const result: AuditResult = {
    currentSpend, 
    optimizedSpend: Math.max(currentSpend - finalSavings, 0),
    monthlySavings: finalSavings,
    annualSavings: finalSavings * 12,
  };

  return { result, recommendations };
}

export async function storeAudit(input: AuditInput,result: AuditResult,recommendations: AuditRecommendation[]) {
  const audit = await prisma.audit.create({
    data: {
      toolId: input.toolId,
      plan: input.plan,
      teamSize: input.teamSize,
      seats: input.seats,
      monthlySpend: result.currentSpend, 
      useCase: input.useCase,

      currentSpend: result.currentSpend,
      optimizedSpend: result.optimizedSpend,
      monthlySavings: result.monthlySavings,
      annualSavings: result.annualSavings,

      recommendations: {
        create: recommendations.map((rec) => ({
          title: rec.title,
          description: rec.description,
          monthlySavings: rec.monthlySavings,
        })),
      },
    },
  });

  return audit;
}