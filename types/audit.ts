
export type ToolId = 
  | "cursor" 
  | "github_copilot" 
  | "claude" 
  | "chatgpt" 
  | "anthropic_api" 
  | "openai_api" 
  | "gemini" 
  | "windsurf" 
  | "v0";

export type UseCase = 
  | "coding" 
  | "writing" 
  | "data" 
  | "research" 
  | "mixed";


export type PlanId = 
  | "free" | "hobby" | "individual" | "plus" 
  | "pro" | "team" | "business" 
  | "max" | "ultra" 
  | "enterprise" | "api";

export interface AuditInput {
  toolId: ToolId;
  plan: PlanId;
  useCase: UseCase;
  seats: number;
  teamSize: number;
  monthlySpend: number;
}

export interface AuditRecommendation {
  title: string;
  description: string;
  monthlySavings: number;
}

export interface AuditResult {
  currentSpend: number;
  optimizedSpend: number;
  monthlySavings: number;
  annualSavings: number;
}