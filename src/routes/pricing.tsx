import { useCallback, useEffect, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { Check, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { AppShell } from "@/components/AppShell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { FREE_PLAN_TOTAL_ADS, paidPlans, store, type PlanId } from "@/data/studio";
import { useStudio } from "@/lib/studio-store";
import { confirmCheckoutSession, createCheckoutSession } from "@/lib/stripe.functions";

export const Route = createFileRoute("/pricing")({ head: () => ({ meta: [
  { title: "Pricing — Replix AI Ad Studio" }, { name: "description", content: "Compare Replix AI plans for Shopify brands creating ads at every scale." },
  { property: "og:title", content: "Pricing — Replix AI Ad Studio" }, { property: "og:description", content: "Compare Replix AI ad generation plans." },
  { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary_large_image" },
] }), component: Pricing });

const plans = paidPlans;

function Pricing() {
  const { creditsRemaining, planName, planId: activePlanId, setPlan } = useStudio();
  const startCheckout = useServerFn(createCheckoutSession);
  const confirmCheckout = useServerFn(confirmCheckoutSession);
  const [pendingPlan, setPendingPlan] = useState<PlanId | null>(null);

  // Handle the redirect back from Stripe Checkout.
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const outcome = params.get("checkout");
    const sessionId = params.get("session_id");
    if (!outcome) return;
    const clean = () => window.history.replaceState({}, "", window.location.pathname);

    if (outcome === "cancelled") {
      toast("Checkout cancelled — your plan is unchanged.");
      clean();
      return;
    }
    if (outcome !== "success" || !sessionId) return;

    void confirmCheckout({ data: { sessionId } })
      .then((result) => {
        if (result.paid && result.planId) {
          setPlan(result.planId);
          toast.success(`${result.planName} plan is now active.`);
        } else {
          toast.error("We could not confirm that payment yet. Try again in a moment.");
        }
      })
      .catch(() => toast.error("We could not confirm that payment."))
      .finally(clean);
  }, [confirmCheckout, setPlan]);

  const onSelectPlan = useCallback(
    (id: PlanId) => {
      setPendingPlan(id);
      void startCheckout({ data: { planId: id, origin: window.location.origin } })
        .then((result) => {
          if (result.ok && result.url) {
            window.location.href = result.url;
            return;
          }
          toast.error("Card payments are not switched on yet for this demo.");
          setPendingPlan(null);
        })
        .catch((error: unknown) => {
          toast.error(error instanceof Error ? error.message : "Could not start checkout.");
          setPendingPlan(null);
        });
    },
    [startCheckout],
  );

  return <AppShell title="" >
  <h1 className="sr-only">Pricing &amp; Billing</h1>
  <section className="mb-10 rounded-3xl border border-border bg-gradient-to-r from-gold-soft/60 via-card to-navy-bright/15 px-8 py-12 text-center"><Badge variant="outline">Always Free To Start</Badge><h2 className="mt-4 font-display text-2xl font-bold text-navy">Free Offer - {FREE_PLAN_TOTAL_ADS} FREE AI ads</h2><p className="mx-auto mt-3 max-w-2xl text-xs text-muted-foreground">Create a free account any time and get {FREE_PLAN_TOTAL_ADS} AI-generated Shopify ads, completely free. No subscription required. <span className="font-semibold text-foreground">No deadline, no card required.</span></p><Button asChild variant="gradient" className="mt-8 rounded-full px-8"><Link to="/create">Claim {FREE_PLAN_TOTAL_ADS} free ads</Link></Button></section>
  <h2 className="mb-5 font-display text-2xl font-medium">Pricing Plans</h2><div className="grid gap-6 lg:grid-cols-3">{plans.map((plan) => <article key={plan.name} className={cn("relative flex flex-col rounded-2xl border bg-card p-7 shadow-soft", plan.popular ? "border-navy/50" : "border-border")}>{plan.popular ? <Badge className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-navy text-navy-foreground">Most Popular</Badge> : null}<div className="text-center"><h3 className="font-display text-xl font-medium">{plan.name}</h3><p className="mt-1 text-xs text-muted-foreground">{plan.tagline}</p><p className="mt-5 font-display text-2xl font-bold text-navy">{plan.price} <span className="text-sm font-normal text-muted-foreground">/month</span></p><Button variant={plan.popular ? "gradient" : "outline"} className="mt-5 w-full rounded-full" disabled={pendingPlan !== null || activePlanId === plan.id} onClick={() => onSelectPlan(plan.id)}>{activePlanId === plan.id ? "Current plan" : pendingPlan === plan.id ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Opening checkout…</> : <>Start {plan.name} →</>}</Button></div><div className="my-5 h-px bg-border" /><ul className="space-y-3">{plan.features.map((feature) => <li key={feature} className="flex gap-2 text-xs"><Check className="mt-0.5 h-4 w-4 text-navy" />{feature}</li>)}</ul></article>)}</div>
  <h2 className="mb-5 mt-10 font-display text-2xl font-medium">Billing</h2><div className="flex flex-col justify-between gap-7 rounded-3xl border border-border bg-card p-8 sm:flex-row sm:items-center"><div><p className="text-sm text-muted-foreground">Current Plan</p><p className="mt-1 font-display text-3xl font-bold">{planName}</p><p className="mt-1 text-sm text-muted-foreground">{creditsRemaining} credits remaining</p><p className="mt-5 border-t border-border pt-4 text-sm"><span className="font-semibold">Connected store:</span> <span className="text-muted-foreground">{store.domain}</span></p></div><div className="flex flex-col gap-3 sm:w-56">{activePlanId ? <Button variant="destructive-outline" className="rounded-full" onClick={() => { setPlan(null); toast("Switched back to the free plan."); }}>Cancel Subscription</Button> : <Button variant="gradient" className="rounded-full" onClick={() => onSelectPlan("pro")}>Manage Subscription</Button>}<Button variant="destructive-outline" className="rounded-full">Disconnect Store</Button></div></div>
  </AppShell>;
}