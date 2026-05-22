"use server"
import { AuditInput, AuditResult } from "@/types/audit"
import { openrouter } from "./openai"

function fallbackSummary( result: AuditResult) {
  if (result.monthlySavings <= 0) {
    return `No major optimization opportunities were identified in the current AI tooling setup. Existing subscriptions appear reasonably aligned with the team's usage and scale.`
  }

  return `This audit identified approximately $${result.monthlySavings} in potential monthly savings through AI subscription and plan optimization. Adjusting tooling allocation and selecting more appropriate pricing tiers could reduce annual spend by roughly $${result.annualSavings} while maintaining team productivity.`
}



export async function generateSummary(
  input: AuditInput,
  result: AuditResult
) {
  try {
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
  ${result.recommendations
    .map(
      (r) =>
        `- ${r.title}: ${r.description}`
    )
    .join("\n")}
  
  INSTRUCTIONS:
  - Keep response under 120 words
  - Sound professional and concise
  - Focus on optimization opportunities
  - Do not invent numbers
  - Do not use markdown
  `

  const completion = await openrouter.chat.completions.create({
    model:"meta-llama/llama-3.3-70b-instruct:free",
    messages:[
      {
        role:"user",
        content:prompt,
      }
    ]
  })

  return completion.choices[0].message.content;

  } catch (error) {
    console.error(error)

    return fallbackSummary(result)
  }
}