export function estimatePricing(monthlySpend: string) {
  return {
    monthlySpend,
    projectedAnnualSpend: monthlySpend,
    costBreakdown: {
      api: "55%",
      storage: "20%",
      analytics: "25%",
    },
  }
}
