"use server"

import { prisma } from "@/lib/prisma"
import { generateSummary } from "@/lib/ai-summary"
import { AuditInput, AuditResult } from "@/types/audit"

export async function generateAndUpdateSummary(
  id: string,
  input: AuditInput,
  result: AuditResult
) {
  try {
    const summary = await generateSummary(input, result)

    if (!summary) return

    await prisma.audit.update({
      where: { id },
      data: { summary },
    })
  } catch (err) {
    console.error("Summary generation failed:", err)
  }
}