import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { user } from "@/data/studio";
import { useStudio } from "@/lib/studio-store";

export const Route = createFileRoute("/billing")({
  head: () => ({
    meta: [
      { title: "Billing — Replix AI Ad Studio" },
      {
        name: "description",
        content:
          "Your Replix AI plan, credit usage and invoice history for the Zaffo Coffee workspace.",
      },
      { property: "og:title", content: "Billing — Replix AI Ad Studio" },
      { property: "og:description", content: "Plan, credit usage and invoice history." },
    ],
  }),
  component: Billing,
});

const invoices = [
  { id: "INV-2026-08", date: "Aug 1, 2026", amount: "$0.00", status: "Free plan" },
  { id: "INV-2026-07", date: "Jul 1, 2026", amount: "$0.00", status: "Free plan" },
];

function Billing() {
  const { creditsUsed, creditsTotal, creditsRemaining } = useStudio();

  return (
    <AppShell title="Billing" subtitle="Plan, usage and invoices">
      <div className="grid gap-5 lg:grid-cols-3">
        <div className="card-soft p-6">
          <p className="text-sm text-muted-foreground">Current plan</p>
          <p className="mt-2 font-display text-2xl font-semibold">{user.plan}</p>
          <Badge className="mt-3">Renews monthly</Badge>
        </div>

        <div className="card-soft p-6 lg:col-span-2">
          <div className="flex items-baseline justify-between">
            <p className="text-sm text-muted-foreground">Credit usage this month</p>
            <p className="font-display text-lg font-semibold">
              {creditsUsed} / {creditsTotal}
            </p>
          </div>
          <Progress value={(creditsUsed / creditsTotal) * 100} className="mt-4 h-2" />
          <p className="mt-2 text-sm text-muted-foreground">
            {creditsRemaining} free ads remaining.
          </p>
        </div>
      </div>

      <div className="card-soft mt-6 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-muted/70 text-left">
            <tr>
              <th className="px-5 py-3 font-semibold">Invoice</th>
              <th className="px-5 py-3 font-semibold">Date</th>
              <th className="px-5 py-3 font-semibold">Amount</th>
              <th className="px-5 py-3 font-semibold">Status</th>
            </tr>
          </thead>
          <tbody>
            {invoices.map((inv) => (
              <tr key={inv.id} className="border-t border-border">
                <td className="px-5 py-3 font-medium">{inv.id}</td>
                <td className="px-5 py-3 text-muted-foreground">{inv.date}</td>
                <td className="px-5 py-3 text-muted-foreground">{inv.amount}</td>
                <td className="px-5 py-3">
                  <Badge variant="secondary">{inv.status}</Badge>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className="mt-6 text-sm text-muted-foreground">
        Payment methods are not connected in this prototype.
      </p>
    </AppShell>
  );
}
