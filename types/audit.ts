export interface AuditInput {
  toolId:string,
  seats:number,
  teamSize:number,
  useCase : string,
  monthlySpend:number,
  plan: string,

}

export interface AuditRecommendation {
  title: string
  description: string
  monthlySavings: number
}

export interface AuditResult {
  currentSpend: number
  optimizedSpend: number
  monthlySavings: number
  annualSavings: number
  recommendations: AuditRecommendation[]
}

