import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Search, Images, Instagram, Facebook } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { AdCard } from "@/components/AdCard";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useStudio } from "@/lib/studio-store";

export const Route = createFileRoute("/gallery")({
  head: () => ({
    meta: [
      { title: "Ad Gallery — Replix AI Ad Studio" },
      {
        name: "description",
        content:
          "Every Zaffo Coffee creative in one place — search by product or hook and filter by Instagram or Facebook.",
      },
      { property: "og:title", content: "Ad Gallery — Replix AI Ad Studio" },
      {
        property: "og:description",
        content: "Browse, search and filter all of your generated ad creatives.",
      },
    ],
  }),
  component: Gallery,
});

function Gallery() {
  const { ads } = useStudio();
  const [query, setQuery] = useState("");
  const [platform, setPlatform] = useState("all");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return ads.filter((ad) => {
      const matchesPlatform = platform === "all" || ad.platform === platform;
      const matchesQuery =
        !q ||
        [ad.headline, ad.caption, ad.productName, ad.audience].some((f) =>
          f.toLowerCase().includes(q),
        );
      return matchesPlatform && matchesQuery;
    });
  }, [ads, query, platform]);

  const tiles = [
    { label: "Total Ads", value: ads.length, icon: Images },
    { label: "Instagram", value: ads.filter((a) => a.platform === "instagram").length, icon: Instagram },
    { label: "Facebook", value: ads.filter((a) => a.platform === "facebook").length, icon: Facebook },
  ];

  return (
    <AppShell title="Ad Gallery" subtitle="Every creative Replix has made for Zaffo Coffee">
      <div className="space-y-7">
        <div className="grid gap-4 sm:grid-cols-3">
          {tiles.map(({ label, value, icon: Icon }) => (
            <div key={label} className="card-soft flex items-center gap-4 p-5">
              <span className="rounded-xl bg-gold-soft p-2.5 text-navy">
                <Icon className="h-5 w-5" />
              </span>
              <div>
                <p className="font-display text-2xl font-semibold">{value}</p>
                <p className="text-sm text-muted-foreground">{label}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative w-full sm:max-w-xs">
            <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search hooks, products, audiences"
              className="pl-9"
            />
          </div>
          <Tabs value={platform} onValueChange={setPlatform}>
            <TabsList>
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="instagram">Instagram</TabsTrigger>
              <TabsTrigger value="facebook">Facebook</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        {filtered.length ? (
          <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
            {filtered.map((ad) => (
              <AdCard key={ad.id} ad={ad} />
            ))}
          </div>
        ) : (
          <p className="card-soft p-10 text-center text-sm text-muted-foreground">
            No creatives match that search yet.
          </p>
        )}
      </div>
    </AppShell>
  );
}
