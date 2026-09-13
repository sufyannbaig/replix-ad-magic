import { createFileRoute } from "@tanstack/react-router";
import { ChartNoAxesCombined } from "lucide-react";
import { AppShell } from "@/components/AppShell";

export const Route = createFileRoute("/analytics")({
  head: () => ({
    meta: [
      { title: "Analytics — Replix AI Ad Studio" },
      {
        name: "description",
        content: "Review creative and campaign performance in Replix AI.",
      },
      { property: "og:title", content: "Analytics — Replix AI Ad Studio" },
      {
        property: "og:description",
        content: "Review creative and campaign performance in Replix AI.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Analytics,
});

function Analytics() {
  return (
    <AppShell title="Analytics" subtitle="Creative and campaign performance">
      <div className="flex min-h-[24rem] items-center justify-center rounded-xl border border-dashed border-border bg-card px-6 text-center">
        <div className="max-w-sm">
          <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-gold-soft text-navy">
            <ChartNoAxesCombined className="h-5 w-5" />
          </span>
          <h2 className="mt-4 font-display text-xl font-semibold text-foreground">Coming soon</h2>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">
            Performance reporting will appear here when analytics are connected.
          </p>
        </div>
      </div>
    </AppShell>
  );
}