
"use server"
import { AuditInput, AuditRecommendation, AuditResult } from "@/types/audit";
import { Prisma } from "@/generated/prisma/client";
import { prisma } from "./prisma";

const providerRules: Record<
  string,
  Record<string, (input: AuditInput) => AuditRecommendation | null>
> = {
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
          title: "Cursor Enterprise may be the better long-term choice",
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
        title: "Cursor Enterprise looks appropriate for a large organization",
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
          title: "Consider Copilot Individual for a very small team",
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
        title: "GitHub Copilot Business is generally well suited for your team",
        description:
          "Business offers a good balance of collaboration and price for most small-to-medium engineering teams.",
        monthlySavings: 0,
      }
    },
    Enterprise: (input) => {
      if (input.seats <= 5 && input.teamSize <= 10) {
        return {
          title: "GitHub Copilot Enterprise may be more than needed",
          description:
            "Smaller engineering organizations can often save by using Business unless they require enterprise-grade compliance or single sign-on.",
          monthlySavings: 65,
        }
      }
      return {
        title: "GitHub Copilot Enterprise is appropriate for a large engineering organization",
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
          title: "Claude Free may be enough for very light usage",
          description:
            "If your team is small and spend is minimal, Claude Free could replace Pro for basic workflows.",
          monthlySavings: 25,
        }
      }
      return {
        title: "Claude Pro is a good fit for your current team",
        description:
          "Pro is well suited for small teams that need more capacity than Free without paying for Team-level pricing.",
        monthlySavings: 0,
      }
    },
    Max: (input) => {
      if (input.teamSize > 10 || input.seats > 10) {
        return {
          title: "Evaluate Claude Team for broader collaboration",
          description:
            "Claude Max is strong for growing teams, but Team offers additional workspace and management benefits.",
          monthlySavings: 40,
        }
      }
      if (input.teamSize <= 4 && input.seats <= 4) {
        return {
          title: "Claude Pro may be sufficient for smaller groups",
          description:
            "If your team remains compact, Max is likely more expensive than necessary compared to Pro.",
          monthlySavings: 30,
        }
      }
      return {
        title: "Claude Max aligns with moderate team demand",
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
          title: "Review Claude Enterprise or negotiated pricing",
          description:
            "Very high spend can often be improved through a custom enterprise agreement rather than standard Team pricing.",
          monthlySavings: 55,
        }
      }
      return {
        title: "Claude Team is appropriate for multi-user collaboration",
        description:
          "Team is a good choice for organizations managing several active users across AI workflows.",
        monthlySavings: 0,
      }
    },
    "API direct": (input) => {
      if (input.monthlySpend > 2500) {
        return {
          title: "Negotiate Claude enterprise pricing for high spend",
          description:
            "When API spend grows, a committed enterprise contract usually delivers significantly better unit economics.",
          monthlySavings: 90,
        }
      }
      return {
        title: "Claude API direct is a flexible option for usage-based spend",
        description:
          "Pay-as-you-go is sensible for variable API consumption, but review token usage to avoid unforeseen cost spikes.",
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
      if (input.monthlySpend > 1800) {
        return {
          title: "Review ChatGPT Enterprise for heavy usage",
          description:
            "Enterprise can be more cost-effective and offers better compliance controls for high-spend teams.",
          monthlySavings: 55,
        }
      }
      return {
        title: "ChatGPT Team is generally well matched to your current usage",
        description:
          "Team works well for small groups that need shared access and centralized controls.",
        monthlySavings: 0,
      }
    },
    Enterprise: (input) => {
      if (input.seats <= 4 && input.teamSize <= 8) {
        return {
          title: "ChatGPT Team may be sufficient",
          description:
            "Smaller organizations often do not need the added complexity of Enterprise and can save with Team.",
          monthlySavings: 50,
        }
      }
      return {
        title: "ChatGPT Enterprise is suitable for larger teams",
        description:
          "Enterprise is justified for teams that need advanced security, compliance, and administrative controls.",
        monthlySavings: 0,
      }
    },
    "API direct": (input) => {
      if (input.monthlySpend > 2200) {
        return {
          title: "Explore ChatGPT Enterprise for large API spend",
          description:
            "Large API spend is often more efficient under an enterprise or committed usage agreement than pure pay-as-you-go.",
          monthlySavings: 75,
        }
      }
      return {
        title: "ChatGPT API direct is flexible for usage-based workloads",
        description:
          "API direct is a strong choice for developers and teams with variable demand, especially if you optimize prompt and token usage.",
        monthlySavings: 0,
      }
    },
  },
  anthropic_api: {
    "Pay-as-you-go": (input) => {
      if (input.monthlySpend > 2500) {
        return {
          title: "Negotiate committed pricing for Anthropics API spend",
          description:
            "High pay-as-you-go spend usually means you should move to a contract or volume plan to lower costs.",
          monthlySavings: 100,
        }
      }
      if (input.monthlySpend > 700) {
        return {
          title: "Optimize Anthropics API token usage",
          description:
            "Token and prompt design improvements can reduce your per-request cost while preserving capability.",
          monthlySavings: 35,
        }
      }
      return {
        title: "Anthropic Pay-as-you-go is a good fit for moderate usage",
        description:
          "This plan is ideal when usage is variable and you are not yet ready for a committed enterprise agreement.",
        monthlySavings: 0,
      }
    },
  },
  openai_api: {
    "Pay-as-you-go": (input) => {
      if (input.monthlySpend > 2500) {
        return {
          title: "Review OpenAI committed usage or enterprise pricing",
          description:
            "At high spend levels, OpenAI committed use or enterprise agreements usually offer much better economics.",
          monthlySavings: 110,
        }
      }
      if (input.monthlySpend > 700) {
        return {
          title: "Improve OpenAI prompt efficiency",
          description:
            "Optimizing prompt length and model selection can lower costs without reducing output quality.",
          monthlySavings: 40,
        }
      }
      return {
        title: "OpenAI Pay-as-you-go is appropriate for variable usage",
        description:
          "This plan is a strong fit for teams that want flexibility and are still tuning their API consumption.",
        monthlySavings: 0,
      }
    },
  },
  gemini: {
    Pro: (input) => {
      if (input.teamSize > 4 || input.seats > 4) {
        return {
          title: "Upgrade to Gemini Ultra for larger teams",
          description:
            "Gemini Pro is best for small teams; Ultra provides higher throughput and better per-seat economics at scale.",
          monthlySavings: 35,
        }
      }
      return {
        title: "Gemini Pro matches small-team usage",
        description:
          "Pro is a good choice when you are evaluating Gemini with a limited number of active users.",
        monthlySavings: 0,
      }
    },
    Ultra: (input) => {
      if (input.teamSize <= 3 && input.seats <= 3) {
        return {
          title: "Gemini Pro may be more cost-effective for a very small team",
          description:
            "If only a few people are using Gemini, Pro can lower costs while still providing strong capabilities.",
          monthlySavings: 30,
        }
      }
      if (input.monthlySpend > 2000) {
        return {
          title: "Consider Gemini API for large usage",
          description:
            "High API spend can make the API plan more efficient than fixed Ultra seats in some cases.",
          monthlySavings: 45,
        }
      }
      return {
        title: "Gemini Ultra is a strong fit for moderate enterprise usage",
        description:
          "Ultra is appropriate if your team needs advanced Gemini capabilities with dependable capacity.",
        monthlySavings: 0,
      }
    },
    API: (input) => {
      if (input.monthlySpend > 1500 && input.seats <= 5) {
        return {
          title: "Evaluate a dedicated Gemini plan for high API spend",
          description:
            "Significant API usage may benefit from a more structured plan than pure pay-as-you-go.",
          monthlySavings: 40,
        }
      }
      return {
        title: "Gemini API is a flexible choice for usage-based access",
        description:
          "API access is ideal when demand changes frequently or you want direct developer control over costs.",
        monthlySavings: 0,
      }
    },
  },
  windsurf: {
    Free: (input) => {
      if (input.teamSize > 1 || input.monthlySpend > 0) {
        return {
          title: "Move from Windsurf Free to Pro or Teams",
          description:
            "Free plans are best for evaluation; active teams should upgrade to Pro or Teams for reliability and support.",
          monthlySavings: 20,
        }
      }
      return {
        title: "Windsurf Free is reasonable for introductory use",
        description:
          "If you are still evaluating the product and have very light usage, Free is a sensible starting point.",
        monthlySavings: 0,
      }
    },
    Pro: (input) => {
      if (input.teamSize > 6 || input.seats > 6) {
        return {
          title: "Consider Windsurf Teams for larger groups",
          description:
            "Windsurf Pro is designed for smaller teams; Teams provides better volume pricing and collaboration features at scale.",
          monthlySavings: 30,
        }
      }
      if (input.teamSize <= 3 && input.seats <= 3) {
        return {
          title: "Windsurf Free may be enough for very light use",
          description:
            "A small team with low spend may still do fine on Free while they validate the product.",
          monthlySavings: 20,
        }
      }
      return {
        title: "Windsurf Pro is a solid fit for your team",
        description:
          "Pro offers a good balance of features and cost for growing teams that are past the Free tier.",
        monthlySavings: 0,
      }
    },
    Teams: (input) => {
      if (input.seats <= 3 && input.teamSize <= 4) {
        return {
          title: "Windsurf Pro may be more appropriate for a smaller group",
          description:
            "Teams is best for larger collaborative groups; smaller teams can often achieve savings with Pro.",
          monthlySavings: 30,
        }
      }
      return {
        title: "Windsurf Teams is suitable for a collaborative organization",
        description:
          "Teams is appropriate when multiple contributors need shared access and collaboration features.",
        monthlySavings: 0,
      }
    },
  },
}

function normalizeMonthlySavings(value: number, currentSpend: number) {
  return Math.max(0, Math.min(value, currentSpend))
}

export async function runAudit(input: AuditInput): Promise<AuditResult> {
  const provider = providerRules[input.toolId]
  const planRule = provider?.[input.plan]
  const recommendations: AuditRecommendation[] = []
  let monthlySavings = 0

  if (planRule) {
    const recommendation = planRule(input)
    if (recommendation) {
      monthlySavings += normalizeMonthlySavings(recommendation.monthlySavings, input.monthlySpend)
      recommendations.push(recommendation)
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
    const excessSavings = Math.min(25, excessSeats * 10)
    monthlySavings += normalizeMonthlySavings(excessSavings, input.monthlySpend - monthlySavings)
    recommendations.push({
      title: "Review seat allocation",
      description: `You have ${excessSeats} more seats than active team members. Eliminating unused seats can reduce recurring costs without changing your plan.",
      monthlySavings: excessSavings,
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

  monthlySavings = normalizeMonthlySavings(monthlySavings, input.monthlySpend)

  return {
    currentSpend: input.monthlySpend,
    optimizedSpend: Math.max(0, input.monthlySpend - monthlySavings),
    monthlySavings,
    annualSavings: monthlySavings * 12,
    recommendations,
  }
}

export async function storeAudit(
  input: AuditInput,
  summary: string,
  result?: AuditResult,
) {
  const auditResult = result ?? (await runAudit(input))
  const slug = `audit-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`

  try {
    const audit = await prisma.audit.create({
      data: {
        slug,
        input: input as unknown as Prisma.InputJsonValue,
        result: auditResult as unknown as Prisma.InputJsonValue,
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
      message: (error as Error).message,
    }
  }
}
