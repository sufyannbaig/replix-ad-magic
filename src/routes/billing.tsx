import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { store, user } from "@/data/studio";
import { useStudio } from "@/lib/studio-store";

export const Route = createFileRoute("/billing")({ head: () => ({ meta: [
  { title: "Billing — Replix AI Ad Studio" }, { name: "description", content: "Review your Replix plan, monthly credit usage, and connected store." },
  { property: "og:title", content: "Billing — Replix AI Ad Studio" }, { property: "og:description", content: "Review your plan, usage, and connected store." },
  { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary_large_image" },
] }), component: Billing });

function Billing() { const { creditsUsed, creditsTotal, creditsRemaining } = useStudio(); return <AppShell title="Pricing & Billing" subtitle="Your current plan and account usage.">
  <div className="grid gap-6 lg:grid-cols-3"><section className="rounded-3xl border border-border bg-card p-8 shadow-soft"><p className="text-sm text-muted-foreground">Current Plan</p><p className="mt-2 font-display text-3xl font-bold">{user.plan}</p><Badge className="mt-4">Active</Badge></section><section className="rounded-3xl border border-border bg-card p-8 shadow-soft lg:col-span-2"><div className="flex items-baseline justify-between"><p className="text-sm text-muted-foreground">Credit usage this month</p><p className="font-display text-xl font-semibold">{creditsUsed} / {creditsTotal}</p></div><Progress value={(creditsUsed / creditsTotal) * 100} className="mt-5" /><p className="mt-3 text-sm text-muted-foreground">{creditsRemaining} free ads remaining.</p></section></div>
  <section className="mt-6 flex flex-col justify-between gap-6 rounded-3xl border border-border bg-card p-8 shadow-soft sm:flex-row sm:items-center"><div><p className="text-sm text-muted-foreground">Connected store</p><p className="mt-2 font-semibold">{store.domain}</p><p className="mt-1 text-sm text-muted-foreground">Your catalog remains connected and available for generation.</p></div><div className="flex gap-3"><Button asChild variant="navy"><Link to="/pricing">View Plans</Link></Button><Button variant="destructive-outline" disabled>Disconnect Store</Button></div></section>
  <p className="mt-6 text-sm text-muted-foreground">Payments and subscription changes are disabled in this demo.</p>
  </AppShell>; }