import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

const spendingTools = ["GPT API", "Vector DB", "Custom embeddings", "Data pipeline", "Analytics"]

export default function DashboardPage() {
  return (
    <main className="container mx-auto space-y-8 py-12 px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-primary">
            SpendPilot interface
          </p>
          <h1 className="mt-3 text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
            Prepare your AI spend audit in one place.
          </h1>
          <p className="mt-4 max-w-2xl text-base text-muted-foreground sm:text-lg">
            This workspace is ready for your audit logic. Fill in the details, review your spend profile, and then connect the form handlers.
          </p>
        </div>
        <Link href="/" className="w-full md:w-auto">
          <Button variant="secondary" className="w-full md:w-auto">
            Back to landing
          </Button>
        </Link>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.3fr_0.9fr]">
        <Card className="space-y-6">
          <CardHeader>
            <CardTitle>Audit configuration</CardTitle>
            <CardDescription>
              Configure the main inputs for AI spend tracking and optimization.
            </CardDescription>
          </CardHeader>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="company">Organization name</Label>
              <Input id="company" name="company" placeholder="Acme AI Labs" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="monthlySpend">Monthly spend estimate</Label>
              <Input id="monthlySpend" name="monthlySpend" type="number" placeholder="$12,400" />
            </div>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="tools">AI tools in use</Label>
              <Input id="tools" name="tools" placeholder="GPT-4, embeddings, agent chains" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="targetSavings">Target savings</Label>
              <Input id="targetSavings" name="targetSavings" placeholder="20%" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="notes">Audit notes</Label>
              <Textarea id="notes" name="notes" placeholder="Describe the spend categories, teams, and priorities." />
            </div>
          </div>

          <div className="flex justify-end">
            <Button type="button">Save draft</Button>
          </div>
        </Card>

        <Card className="space-y-6">
          <CardHeader>
            <CardTitle>What happens next</CardTitle>
            <CardDescription>
              Review the workflow steps and wire your business actions into the buttons below.
            </CardDescription>
          </CardHeader>

          <div className="space-y-4">
            {spendingTools.map((tool) => (
              <div key={tool} className="rounded-3xl border border-border bg-background/80 p-4">
                <p className="text-sm font-medium text-foreground">{tool}</p>
                <p className="mt-2 text-sm text-muted-foreground">
                  Map this tool to your spend metrics and attach it to the audit pipeline.
                </p>
              </div>
            ))}
          </div>

          <div className="space-y-3 rounded-3xl border border-border bg-background/80 p-5">
            <p className="text-sm font-semibold text-foreground">Ready to launch</p>
            <p className="text-sm text-muted-foreground">
              The UI is prepared for capture and review. Connect your functions to the buttons once the audit backend is ready.
            </p>
            <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
              <Button type="button" className="w-full sm:w-auto">
                Run audit check
              </Button>
              <Button variant="outline" type="button" className="w-full sm:w-auto">
                Download estimate
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </main>
  )
}
