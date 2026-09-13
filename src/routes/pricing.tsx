import { createFileRoute, Link } from "@tanstack/react-router";
import { Check } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/pricing")({ head: () => ({ meta: [
  { title: "Pricing — Replix AI Ad Studio" }, { name: "description", content: "Compare Replix AI plans for Shopify brands creating ads at every scale." },
  { property: "og:title", content: "Pricing — Replix AI Ad Studio" }, { property: "og:description", content: "Compare Replix AI ad generation plans." },
  { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary_large_image" },
] }), component: Pricing });

const plans = [
  { name: "Starter", tagline: "For small Shopify brands", price: "$9.99", features: ["30 AI generations/month", "All creative styles", "Edit captions & hooks", "Basic Brand DNA", "High-quality downloads"] },
  { name: "Pro", tagline: "For growing Shopify brands", price: "$29", popular: true, features: ["100 AI generations/month", "Advanced Brand DNA", "Multiple creative concepts", "Premium creative styles", "Full creative library"] },
  { name: "Scale", tagline: "For brands creating ads at scale", price: "$59", features: ["300 AI generations/month", "Advanced Brand DNA", "Multiple products", "Unlimited creative styles", "Priority support"] },
];

function Pricing() { return <AppShell title="Pricing & Billing" subtitle="A plan for every stage of your brand.">
  <section className="mb-10 rounded-3xl border border-gold/40 bg-gold-soft px-8 py-12 text-center"><Badge variant="outline">Exclusive · Limited Time</Badge><h2 className="mt-4 font-display text-3xl font-bold text-navy">Free Launch Offer — 100 FREE AI ads</h2><p className="mx-auto mt-3 max-w-2xl text-sm text-muted-foreground">Claim your free account and get 100 AI-generated Shopify ads, completely free. No subscription or card required.</p><Button asChild variant="navy" className="mt-6 rounded-full"><Link to="/create">Claim 100 free ads</Link></Button></section>
  <h2 className="mb-6 font-display text-3xl font-semibold">Pricing Plans</h2><div className="grid gap-6 lg:grid-cols-3">{plans.map((plan) => <article key={plan.name} className={cn("relative flex flex-col rounded-2xl border bg-card p-8 shadow-soft", plan.popular ? "border-navy" : "border-border")}>{plan.popular ? <Badge className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-navy text-navy-foreground">Most Popular</Badge> : null}<div className="text-center"><h3 className="font-display text-xl font-semibold">{plan.name}</h3><p className="mt-1 text-sm text-muted-foreground">{plan.tagline}</p><p className="mt-6 font-display text-3xl font-bold text-navy">{plan.price} <span className="text-sm font-normal text-muted-foreground">/month</span></p><Button disabled variant={plan.popular ? "navy" : "outline"} className="mt-6 w-full">Coming soon</Button></div><div className="my-6 h-px bg-border" /><ul className="space-y-3">{plan.features.map((feature) => <li key={feature} className="flex gap-2 text-sm"><Check className="mt-0.5 h-4 w-4 text-success" />{feature}</li>)}</ul></article>)}</div>
  <div className="mt-10 flex items-center justify-between rounded-3xl border border-border bg-card p-8"><div><p className="text-sm text-muted-foreground">Current Plan</p><p className="mt-1 font-display text-3xl font-bold">Free</p><p className="mt-2 text-sm text-muted-foreground">100 credits remaining</p></div><Button asChild variant="outline" className="rounded-full"><Link to="/billing">View billing details</Link></Button></div>
  </AppShell>; }