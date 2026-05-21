import { Button } from "@/components/ui/button"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

export function AuditForm() {
  return (
    <Card className="space-y-6">
      <CardHeader>
        <CardTitle>Audit form</CardTitle>
        <CardDescription>
          Collect the key inputs that define your AI spend audit.
        </CardDescription>
      </CardHeader>

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="company">Organization</Label>
          <Input id="company" name="company" placeholder="Acme AI Labs" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="department">Department</Label>
          <Input id="department" name="department" placeholder="Data team, engineering" />
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="monthlyBudget">Monthly spend</Label>
          <Input id="monthlyBudget" name="monthlyBudget" placeholder="$12,400" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="primaryVendor">Primary vendor</Label>
          <Input id="primaryVendor" name="primaryVendor" placeholder="OpenAI, Anthropic" />
        </div>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="costDrivers">Top cost drivers</Label>
          <Input id="costDrivers" name="costDrivers" placeholder="Embeddings, agents, training" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="notes">Audit notes</Label>
          <Textarea id="notes" name="notes" placeholder="Any billing nuances, forecast assumptions, or priority areas." />
        </div>
      </div>

      <div className="flex justify-end">
        <Button type="button">Save audit draft</Button>
      </div>
    </Card>
  )
}
