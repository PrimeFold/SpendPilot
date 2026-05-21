export function rateLimit(key: string) {
  return {
    key,
    allowed: 100,
    period: "1h",
  }
}
