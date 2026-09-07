import { createFileRoute, Link } from "@tanstack/react-router";
import { FolderOpen } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { AdCard } from "@/components/AdCard";
import { Button } from "@/components/ui/button";
import { useStudio } from "@/lib/studio-store";

export const Route = createFileRoute("/collections")({
  head: () => ({
    meta: [
      { title: "Collections — Replix AI Ad Studio" },
      {
        name: "description",
        content:
          "Saved folders of Zaffo Coffee creatives, grouped by campaign intent so you can reuse what already works.",
      },
      { property: "og:title", content: "Collections — Replix AI Ad Studio" },
      {
        property: "og:description",
        content: "Group your best-performing creatives into reusable campaign folders.",
      },
    ],
  }),
  component: Collections,
});

function Collections() {
  const { collections, ads } = useStudio();

  return (
    <AppShell title="Collections" subtitle="Grouped creatives you can reuse campaign to campaign">
      <div className="space-y-10">
        {collections.map((collection) => {
          const items = ads.filter((a) => a.collectionIds.includes(collection.id));
          return (
            <section key={collection.id}>
              <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-start gap-3">
                  <span className="rounded-xl bg-gold-soft p-2.5 text-navy">
                    <FolderOpen className="h-5 w-5" />
                  </span>
                  <div>
                    <h2 className="font-display text-lg font-semibold">{collection.name}</h2>
                    <p className="text-sm text-muted-foreground">{collection.description}</p>
                  </div>
                </div>
                <span className="text-sm text-muted-foreground">{items.length} ads</span>
              </div>

              {items.length ? (
                <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
                  {items.map((ad) => (
                    <AdCard key={ad.id} ad={ad} compact />
                  ))}
                </div>
              ) : (
                <div className="card-soft p-8 text-center">
                  <p className="text-sm text-muted-foreground">
                    Nothing saved here yet — generate a batch and star your favourites.
                  </p>
                  <Button asChild size="sm" className="mt-4">
                    <Link to="/create">Create an ad</Link>
                  </Button>
                </div>
              )}
            </section>
          );
        })}
      </div>
    </AppShell>
  );
}
