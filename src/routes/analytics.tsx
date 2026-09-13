import { createFileRoute, Link } from "@tanstack/react-router";
import { Users, Zap } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { user } from "@/data/studio";
import { useStudio } from "@/lib/studio-store";

export const Route = createFileRoute("/analytics")({ head: () => ({ meta: [
  { title: "Analytics — Replix AI Ad Studio" }, { name: "description", content: "Track Replix credit usage, ad generation, plan details, and referral rewards." },
  { property: "og:title", content: "Analytics — Replix AI Ad Studio" }, { property: "og:description", content: "Track account usage and creative output." },
  { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary_large_image" },
] }), component: Analytics });

function Analytics() {
  const { ads, creditsRemaining, creditsTotal, creditsUsed } = useStudio();
  return <AppShell title="Analytics" subtitle="Your account usage and creative output at a glance.">
    <div className="space-y-6">
      <div className="grid gap-6 lg:grid-cols-2">
        <section className="rounded-3xl border border-gold/50 bg-gold-soft p-8"><p className="text-lg">Credit Usage:</p><p className="mt-2 font-display text-4xl font-bold">{creditsRemaining}/{creditsTotal}</p><p className="mt-2 text-sm text-muted-foreground">free ads remaining | 1 credit per ad</p><Progress value={(creditsRemaining / creditsTotal) * 100} className="mt-10 max-w-xs" /></section>
        <section className="relative overflow-hidden rounded-3xl bg-navy p-8 text-navy-foreground"><Button asChild className="absolute top-8 right-8 rounded-full bg-card text-navy hover:bg-card/90"><Link to="/pricing">Upgrade Plan</Link></Button><p className="text-lg text-navy-foreground/70">Current Plan</p><p className="mt-2 font-display text-4xl font-bold uppercase">{user.plan}</p><p className="mt-2 text-sm text-navy-foreground/60">100 free ads promo</p></section>
      </div>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <Stat label="Ads Generated:" value={String(ads.length)} note="Across your gallery" />
        <Stat label="Usage this month" value={String(creditsUsed).padStart(2, "0")} note="Resets on the 1st" />
        <section className="rounded-3xl border border-border bg-card p-8 shadow-soft sm:col-span-2"><p className="mb-6 text-lg">Referrals:</p><div className="flex gap-8"><Referral icon={Users} value="0" label="Friends joined" /><span className="w-px bg-border" /><Referral icon={Zap} value="0" label="Credits earned" /></div></section>
      </div>
    </div>
  </AppShell>;
}
function Stat({ label, value, note }: { label: string; value: string; note: string }) { return <section className="rounded-3xl border border-border bg-card p-8 shadow-soft"><p className="text-lg">{label}</p><p className="mt-2 font-display text-4xl font-bold">{value}</p><p className="mt-2 text-sm text-muted-foreground">{note}</p></section>; }
function Referral({ icon: Icon, value, label }: { icon: typeof Users; value: string; label: string }) { return <div className="flex items-center gap-3"><span className="rounded-xl bg-secondary p-3"><Icon className="h-5 w-5" /></span><div><p className="font-display text-3xl font-bold">{value}</p><p className="text-xs text-muted-foreground">{label}</p></div></div>; }