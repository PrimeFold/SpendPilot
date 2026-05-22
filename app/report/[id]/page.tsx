import { notFound } from "next/navigation"
import { prisma } from "@/lib/prisma"
import { ReportClient } from "./reportClient"

export default async function ReportPage({ params }: { params: { id: string } }) {
  console.log("\n🔥 REPORT PAGE HIT")
  console.log("Params:", params)

  try {
    console.log("\n📡 Fetching audit from DB...")

    const audit = await prisma.audit.findUnique({
      where: { id: params.id },
      include: {
        recommendations: true,
      },
    })

    console.log("\n📦 RAW AUDIT RESULT:")
    console.dir(audit, { depth: null })

    if (!audit) {
      console.log("❌ Audit not found")
      notFound()
    }

    console.log("\n🧠 Building report object...")

    const report = {
      id: audit.id,

      toolId: audit.toolId,
      plan: audit.plan,
      teamSize: audit.teamSize,
      seats: audit.seats,
      monthlySpend: audit.monthlySpend,
      useCase: audit.useCase,

      result: {
        currentSpend: audit.currentSpend,
        optimizedSpend: audit.optimizedSpend,
        monthlySavings: audit.monthlySavings,
        annualSavings: audit.annualSavings,
      },

      recommendations: audit.recommendations,

      summary: audit.summary,
      createdAt: audit.createdAt.toISOString(),
    }

    console.log("\n📤 FINAL REPORT OBJECT:")
    console.dir(report, { depth: null })

    console.log("\n🚀 Passing to ReportClient...")

    return <ReportClient report={report} />
  } catch (err) {
    console.error("\n💥 REPORT PAGE CRASHED FULL ERROR:")
    console.error(err)

    console.error("\n💥 STRINGIFIED ERROR:")
    console.error(JSON.stringify(err, Object.getOwnPropertyNames(err), 2))

    throw err
  
  }
}