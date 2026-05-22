"use server"

import { AuditInput, AuditResult } from "@/types/audit"
import { openrouter } from "./openai"

type Recommendation = {
  title: string
  description: string
  monthlySavings: number
}

function fallbackSummary(result: AuditResult) {
  console.log("🟡 Using fallback summary")

  if (result.monthlySavings <= 0) {
    return `No major optimization opportunities were identified in the current AI tooling setup. Existing subscriptions appear reasonably aligned with the team's usage and scale.`
  }

  return `This audit identified approximately $${result.monthlySavings} in potential monthly savings through AI subscription and plan optimization. Adjusting tooling allocation and selecting more appropriate pricing tiers could reduce annual spend by roughly $${result.annualSavings} while maintaining team productivity.`
}

export async function generateSummary(
  input: AuditInput,
  result: AuditResult,
  recommendations: Recommendation[] = []
): Promise<string> {
  try {
    console.log("🟡 generateSummary started")

    const prompt = `
You are an AI infrastructure cost consultant.

Analyze the following AI spend audit and produce a concise executive summary.

COMPANY CONTEXT:
- Team size: ${input.teamSize}
- Use case: ${input.useCase}

CURRENT SETUP:
- Tool: ${input.toolId}
- Plan: ${input.plan}
- Seats: ${input.seats}
- Current monthly spend: $${result.currentSpend}

AUDIT RESULTS:
- Optimized monthly spend: $${result.optimizedSpend}
- Estimated monthly savings: $${result.monthlySavings}
- Estimated annual savings: $${result.annualSavings}

RECOMMENDATIONS:
${
  recommendations.length > 0
    ? recommendations
        .map((r) => `- ${r.title}: ${r.description}`)
        .join("\n")
    : "No specific recommendations generated."
}

INSTRUCTIONS:
- Keep response under 120 words
- Sound professional and concise
- Focus on optimization opportunities
- Do not invent numbers
- Do not use markdown
`

    console.log("🟡 Prompt prepared")
    console.log("🟡 Sending request to OpenRouter...")

    const completion = await openrouter.chat.completions.create({
      model: "meta-llama/llama-3.3-70b-instruct:free",
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
    })

    console.log("🟢 OpenRouter response received")
    console.log(
      "🟢 Raw completion:",
      JSON.stringify(completion, null, 2)
    )

    const summary = completion.choices?.[0]?.message?.content

    console.log("🟡 Extracted summary:", summary)

    if (!summary || typeof summary !== "string") {
      console.log("🔴 Invalid summary returned")
      return fallbackSummary(result)
    }

    console.log("🟢 Returning AI summary")

    return summary
  } catch (error) {
    console.error("🔴 generateSummary failed:")
    console.error(error)

    return fallbackSummary(result)
  }
}