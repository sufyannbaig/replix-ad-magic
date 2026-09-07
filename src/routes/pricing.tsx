import { createFileRoute } from "@tanstack/react-router";
import { Check } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/pricing")({
  head: () => ({
    meta: [
      { title: "Pricing — Replix AI Ad Studio" },
      {
        name: "description",
        content:
          "Simple monthly plans for Replix AI: start free with 100 ads a month and scale to unlimited creative batches.",
      },
      { property: "og:title", content: "Pricing — Replix AI Ad Studio" },
      {
        property: "og:description",
        content: "Free, Growth and Studio plans for Shopify sellers generating ad creatives.",
      },
    ],
  }),
  component: Pricing,
});

const plans = [
  {
    name: "Free",
    price: "$0",
    note: "Current plan",
    features: ["100 ads per month", "Instagram + Facebook formats", "1 connected store"],
    current: true,
  },
  {
    name: "Growth",
    price: "$39",
    note: "Most popular",
    features: ["1,000 ads per month", "Collections and batch export", "Priority generation queue"],
    current: false,
  },
  {
    name: "Studio",
    price: "$99",
    note: "For agencies",
    features: ["Unlimited ads", "5 connected stores", "Brand voice training"],
    current: false,
  },
];

function Pricing() {
  return (
    <AppShell title="Pricing" subtitle="Upgrade when you run out of free credits">
      <div className="grid gap-5 lg:grid-cols-3">
        {plans.map((plan) => (
          <div
            key={plan.name}
            className={cn("card-soft p-7", plan.name === "Growth" && "ring-2 ring-primary")}
          >
            <div className="flex items-center justify-between">
              <h2 className="font-display text-lg font-semibold">{plan.name}</h2>
              <Badge variant={plan.current ? "secondary" : "default"}>{plan.note}</Badge>
            </div>
            <p className="mt-4 font-display text-3xl font-semibold">
              {plan.price}
              <span className="text-sm font-normal text-muted-foreground">/month</span>
            </p>
            <ul className="mt-5 space-y-2.5">
              {plan.features.map((f) => (
                <li key={f} className="flex items-center gap-2 text-sm">
                  <Check className="h-4 w-4 text-success" />
                  {f}
                </li>
              ))}
            </ul>
            <Button className="mt-6 w-full" variant={plan.current ? "outline" : "default"} disabled>
              {plan.current ? "Your plan" : "Coming soon"}
            </Button>
          </div>
        ))}
      </div>
      <p className="mt-6 text-sm text-muted-foreground">
        Checkout is intentionally disabled in this prototype.
      </p>
    </AppShell>
  );
}
