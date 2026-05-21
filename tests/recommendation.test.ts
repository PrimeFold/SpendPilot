import { generateRecommendations } from "@/lib/recommendations"

test("generates recommendations", () => {
  const items = generateRecommendations()
  expect(items.length).toBeGreaterThan(0)
})
