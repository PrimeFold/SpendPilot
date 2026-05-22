export const AI_PRICING: Record<string, Record<string, number>> = {
  cursor: {
    free: 0,
    pro: 20,
    business: 40,
  },
  github_copilot: {
    individual: 10,
    business: 19,
    enterprise: 39,
  },
  claude: {
    free: 0,
    pro: 20,
    team: 25,
    max: 100,
  },
  chatgpt: {
    free: 0,
    plus: 20,
    team: 25,
    enterprise: 60,
    pro: 100,
  },
  gemini: {
    free: 0,
    pro: 20,
    ultra: 250,
  },
  windsurf: {
    free: 0,
    pro: 15,
    teams: 30,
  },
  openai_api: {
    starter: 25,
    growth: 100,
    scale: 500,
  },
  anthropic_api: {
    starter: 30,
    growth: 120,
    scale: 600,
  },
}