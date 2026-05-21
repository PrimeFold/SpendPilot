import { summarizeAiSpend } from "@/lib/ai-summary"

test("summarizes AI spend data", () => {
  const summary = summarizeAiSpend({ spend: 10000 })
  expect(summary.overview).toContain("placeholder")
})
