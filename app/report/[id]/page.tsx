import { notFound } from "next/navigation"
import { prisma } from "@/lib/prisma"
import { ReportClient } from "./reportClient"

interface ReportPageProps {
  params: Promise<{ id: string }>
}

export default async function ReportPage({ params }: ReportPageProps) {
  const { id } = await params;

  
  const audit = await prisma.audit.findUnique({
    where: { id },
    include: { recommendations: true },
  });

  if (!audit) notFound();

  
  const report = {
    id: audit.id,
    toolId: audit.toolId,
    plan: audit.plan,
    teamSize: audit.teamSize,
    seats: audit.seats,
    monthlySpend: audit.monthlySpend,
    useCase: audit.useCase,
    summary: audit.summary,
    result: {
      currentSpend: audit.currentSpend,
      optimizedSpend: audit.optimizedSpend,
      monthlySavings: audit.monthlySavings,
      annualSavings: audit.annualSavings,
    },

    
    createdAt: audit.createdAt.toISOString(),
    recommendations: audit.recommendations.map((rec) => ({
      ...rec,
      createdAt: rec.createdAt.toISOString(),
    })),
  };

  return <ReportClient report={report} id={id}/>
}