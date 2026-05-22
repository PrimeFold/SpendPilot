
"use server"
import { AuditInput,AuditResult } from "@/types/audit";
import { Prisma } from "@/generated/prisma/client";
import { prisma } from "./prisma";

export async function runAudit(input:AuditInput):Promise<AuditResult>{
  let monthlySavings = 0;
  const recommendations = [];

  if(
    input.toolId === 'cursor' && input.plan === "Buisness" && input.seats <=2
  ){
    monthlySavings +=40

    recommendations.push({
      title:"Downgrade to Cursor Pro",
      description:"Buisness tier is unnecessary for small teams",
      monthlySavings:40
    })
  }

  return{
    currentSpend:input.monthlySpend,
    optimizedSpend:input.monthlySpend-monthlySavings,
    monthlySavings,
    annualSavings:monthlySavings*12,
    recommendations
  }

}

export async function storeAudit(
  input: AuditInput,
  summary: string,
  result?: AuditResult,
) {
  const auditResult = result ?? await runAudit(input)
  const slug = `audit-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`

  try {
    const audit = await prisma.audit.create({
      data: {
        slug:slug,
        input: input as unknown as Prisma.InputJsonValue,
        result: auditResult as unknown as Prisma.InputJsonValue,
        summary: summary,
      },
    })

    return {
      success:true,
      message:"Audit saved successfully",
      data:audit,
    }
  } catch (error) {
    return{
      success:false,
      message:(error as Error).message
    }
  }
}
