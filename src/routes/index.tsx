import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Images, Instagram, Facebook, Sparkles, Crown } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { AdCard } from "@/components/AdCard";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { store, user } from "@/data/studio";
import { useStudio } from "@/lib/studio-store";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Dashboard — Replix AI Ad Studio" },
      {
        name: "description",
        content:
          "Your Zaffo Coffee ad performance at a glance: credits remaining, creatives generated, and your next winning ad.",
      },
      { property: "og:title", content: "Dashboard — Replix AI Ad Studio" },
      {
        property: "og:description",
        content: "Credits, creative counts, and one-click access to the Replix ad generator.",
      },
    ],
  }),
  component: Dashboard,
});

function Dashboard() {
  const { ads, creditsRemaining, creditsTotal } = useStudio();
  const instagram = ads.filter((a) => a.platform === "instagram").length;
  const facebook = ads.filter((a) => a.platform === "facebook").length;

  const tiles = [
    { label: "Ads Generated", value: ads.length, icon: Images, note: "All time" },
    { label: "Instagram Creatives", value: instagram, icon: Instagram, note: "Feed + story" },
    { label: "Facebook Creatives", value: facebook, icon: Facebook, note: "Feed + right rail" },
    { label: "Current Plan", value: user.plan, icon: Crown, note: "100 free ads / month" },
  ];

  return (
    <AppShell title={`Welcome back, ${user.name}`} subtitle={`${store.name} · ad performance`}>
      <div className="space-y-8">
        <section className="grid gap-5 lg:grid-cols-3">
          <div className="card-soft flex flex-col justify-between p-6 lg:col-span-1">
            <div>
              <p className="text-xs tracking-[0.14em] text-muted-foreground uppercase">
                Free credits
              </p>
              <p className="mt-3 font-display text-3xl font-semibold">
                {creditsRemaining} / {creditsTotal}
              </p>
              <p className="text-sm text-muted-foreground">free ads remaining</p>
            </div>
            <div className="mt-5">
              <Progress value={(creditsRemaining / creditsTotal) * 100} className="h-2" />
              <p className="mt-2 text-xs text-muted-foreground">
                Resets on the 1st. Upgrade any time for unlimited batches.
              </p>
            </div>
          </div>

          <div className="relative overflow-hidden rounded-xl bg-navy p-7 text-navy-foreground shadow-lift lg:col-span-2">
            <div className="absolute -top-16 -right-10 h-52 w-52 rounded-full bg-gold/20 blur-2xl" />
            <div className="relative max-w-xl">
              <Badge className="bg-gold text-primary-foreground hover:bg-gold">
                <Sparkles className="mr-1 h-3 w-3" /> Ready when you are
              </Badge>
              <h2 className="mt-4 font-display text-3xl leading-tight font-semibold">
                Generate Your Next Winning Ad
              </h2>
              <p className="mt-2 text-sm text-navy-foreground/70">
                Pick a product, let Replix study it properly, and get a batch of creative concepts
                with hooks, captions and audiences already worked out.
              </p>
              <Button asChild size="lg" className="mt-6">
                <Link to="/create">
                  Start a new ad batch <ArrowRight className="ml-1 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </section>

        <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {tiles.map(({ label, value, icon: Icon, note }) => (
            <div key={label} className="card-soft p-5">
              <div className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground">{label}</p>
                <span className="rounded-lg bg-gold-soft p-2 text-navy">
                  <Icon className="h-4 w-4" />
                </span>
              </div>
              <p className="mt-3 font-display text-2xl font-semibold">{value}</p>
              <p className="text-xs text-muted-foreground">{note}</p>
            </div>
          ))}
        </section>

        <section>
          <div className="mb-4 flex items-end justify-between">
            <div>
              <h2 className="font-display text-lg font-semibold">Recent creatives</h2>
              <p className="text-sm text-muted-foreground">The latest ads across both platforms</p>
            </div>
            <Button asChild variant="ghost" size="sm">
              <Link to="/gallery">
                View gallery <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>
          </div>
          <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
            {ads.slice(0, 3).map((ad) => (
              <AdCard key={ad.id} ad={ad} compact />
            ))}
          </div>
        </section>
      </div>
    </AppShell>
  );
}
