import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Images } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { AdCard } from "@/components/AdCard";
import { EmptyState } from "@/components/EmptyState";
import { useStudio } from "@/lib/studio-store";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/gallery")({
  head: () => ({ meta: [
    { title: "My Creatives — Replix AI Ad Studio" },
    { name: "description", content: "Browse and manage every ad creative Replix AI has generated for your store." },
    { property: "og:title", content: "My Creatives — Replix AI Ad Studio" },
    { property: "og:description", content: "Browse and manage every generated ad creative." },
    { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary_large_image" },
  ] }), component: Gallery,
});

const filters = [{ id: "all", label: "All Creatives" }, { id: "facebook", label: "Facebook" }, { id: "instagram", label: "Instagram" }] as const;

function Gallery() {
  const { ads } = useStudio();
  const [platform, setPlatform] = useState<(typeof filters)[number]["id"]>("all");
  const filtered = useMemo(() => platform === "all" ? ads : ads.filter((ad) => ad.platform === platform), [ads, platform]);
  return <AppShell title="My Creatives" subtitle="Every creative Replix has made for you.">
    <div className="space-y-8">
      <div className="inline-flex max-w-full gap-1 overflow-x-auto rounded-full border border-border bg-card p-1.5">
        {filters.map((filter) => <button key={filter.id} onClick={() => setPlatform(filter.id)} className={cn("shrink-0 rounded-full px-5 py-2.5 text-sm transition-colors", platform === filter.id ? "bg-navy text-navy-foreground" : "text-muted-foreground hover:bg-secondary")}>{filter.label}</button>)}
      </div>
      {filtered.length ? <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">{filtered.map((ad) => <AdCard key={ad.id} ad={ad} />)}</div> : <EmptyState icon={Images} title="No creatives yet" body="Your generated ads will appear here automatically." />}
    </div>
  </AppShell>;
}