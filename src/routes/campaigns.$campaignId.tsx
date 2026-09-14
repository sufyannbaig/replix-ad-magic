import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowLeft, Images, Plus } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { AdCard } from "@/components/AdCard";
import { CampaignDialog } from "@/components/CampaignDialog";
import { EmptyState } from "@/components/EmptyState";
import { Button } from "@/components/ui/button";
import { useStudio } from "@/lib/studio-store";

export const Route = createFileRoute("/campaigns/$campaignId")({
  head: () => ({
    meta: [
      { title: "Campaign creatives — Replix AI Ad Studio" },
      { name: "description", content: "View every ad creative grouped inside this Replix campaign." },
      { property: "og:title", content: "Campaign creatives — Replix AI Ad Studio" },
      { property: "og:description", content: "View every ad creative grouped inside this campaign." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: CampaignDetail,
});

function CampaignDetail() {
  const { campaignId } = Route.useParams();
  const { collections, ads } = useStudio();
  const [addOpen, setAddOpen] = useState(false);
  const collection = collections.find((item) => item.id === campaignId);
  const campaignAds = ads.filter((ad) => ad.collectionIds.includes(campaignId));

  if (!collection)
    return (
      <AppShell title="Campaign not found" subtitle="This campaign may have been deleted.">
        <EmptyState icon={Images} title="Campaign not found" body="Head back to My Campaigns to pick another one." />
      </AppShell>
    );

  return (
    <AppShell
      title={collection.name}
      subtitle={collection.description || `${campaignAds.length} creatives in this campaign`}
      action={
        <div className="hidden items-center gap-3 sm:flex">
          <Button asChild variant="outline" className="rounded-full px-5">
            <Link to="/campaigns">
              <ArrowLeft /> All campaigns
            </Link>
          </Button>
          <Button variant="navy" className="rounded-full px-6" onClick={() => setAddOpen(true)}>
            <Plus /> Add creatives
          </Button>
        </div>
      }
    >
      {campaignAds.length ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {campaignAds.map((ad) => (
            <AdCard key={ad.id} ad={ad} />
          ))}
        </div>
      ) : (
        <EmptyState icon={Images} title="No creatives yet" body="Add creatives to this campaign to see them here." />
      )}
      <CampaignDialog open={addOpen} mode="ads" collection={collection} onOpenChange={setAddOpen} />
    </AppShell>
  );
}
