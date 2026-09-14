import { createFileRoute, Link } from "@tanstack/react-router";
import { Users, Zap } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { user } from "@/data/studio";
import { useStudio } from "@/lib/studio-store";
import creditCoin from "@/assets/redesign/credit-coin.png";

export const Route = createFileRoute("/analytics")({ head: () => ({ meta: [
  { title: "Analytics — Replix AI Ad Studio" }, { name: "description", content: "Track Replix credit usage, ad generation, plan details, and referral rewards." },
  { property: "og:title", content: "Analytics — Replix AI Ad Studio" }, { property: "og:description", content: "Track account usage and creative output." },
  { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary_large_image" },
] }), component: Analytics });

function Analytics() {
  const { ads, creditsRemaining, creditsTotal, creditsUsed } = useStudio();
  return <AppShell title="Analytics" subtitle="Track your credit usage, plan, and ad performance in one place.">
    <div className="space-y-5">
      <div className="grid gap-5 lg:grid-cols-2">
        <section className="flex items-center justify-between rounded-3xl border border-gold/60 bg-gold-soft/50 p-7"><div><p className="text-base">Credit Usage:</p><p className="mt-2 font-display text-3xl font-bold">{creditsUsed}/{creditsTotal}</p><p className="mt-1 text-xs text-muted-foreground">credits used | {creditsRemaining} free ads remaining</p><Progress value={(creditsUsed / creditsTotal) * 100} className="mt-8 w-64 max-w-full" /></div><img src={creditCoin} alt="Credit balance" className="hidden h-28 w-28 sm:block" /></section>
        <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-navy-bright to-navy p-7 text-navy-foreground"><span className="absolute -right-16 -bottom-24 h-52 w-52 rounded-full border border-navy-foreground/15" /><span className="absolute -top-24 right-24 h-48 w-48 rounded-full border border-navy-foreground/10" /><Button asChild className="absolute top-7 right-7 rounded-full bg-card text-navy hover:bg-card/90"><Link to="/pricing">Upgrade Plan</Link></Button><p className="text-base text-navy-foreground/70">Current Plan</p><p className="mt-2 font-display text-3xl font-bold uppercase">{user.plan}</p><p className="mt-2 text-xs text-navy-foreground/60">100 free ads promo</p></section>
      </div>
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <Stat label="Ads Generated:" value={String(ads.length)} note="Across your gallery" />
        <Stat label="Usage this month" value={String(creditsUsed).padStart(2, "0")} note="Resets on the 1st" />
        <section className="rounded-3xl border border-border bg-card p-8 shadow-soft sm:col-span-2"><p className="mb-6 text-lg">Referrals:</p><div className="flex gap-8"><Referral icon={Users} value="0" label="Friends joined" /><span className="w-px bg-border" /><Referral icon={Zap} value="0" label="Credits earned" /></div></section>
      </div>
    </div>
  </AppShell>;
}
function Stat({ label, value, note }: { label: string; value: string; note: string }) { return <section className="rounded-3xl border border-border bg-card p-7 shadow-soft"><p className="text-base">{label}</p><p className="mt-2 font-display text-3xl font-bold">{value}</p><p className="mt-2 text-xs text-muted-foreground">{note}</p></section>; }
function Referral({ icon: Icon, value, label }: { icon: typeof Users; value: string; label: string }) { return <div className="flex items-center gap-3"><span className="rounded-xl bg-secondary p-3"><Icon className="h-5 w-5" /></span><div><p className="font-display text-3xl font-bold">{value}</p><p className="text-xs text-muted-foreground">{label}</p></div></div>; }