```markdown
# AI Prompt Engineering Documentation

## Production Prompt: `generateSummary`
This prompt is passed directly to the `meta-llama/llama-3.3-70b-instruct:free` engine inside our Server Action structure[cite: 75].

### Prompt Template
```text
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
    ? recommendations.map((r) => `- ${r.title}: ${r.description}`).join("\n")
    : "No specific recommendations generated."
}
      
INSTRUCTIONS:
- Keep response under 120 words
- Sound professional and concise
- Focus on optimization opportunities
- Do not invent numbers
- Do not use markdown