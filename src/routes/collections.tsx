import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Plus } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { CampaignsView } from "@/components/CampaignsView";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/collections")({ head: () => ({ meta: [
  { title: "Collections — Replix AI Ad Studio" }, { name: "description", content: "Browse your saved Replix ad campaign collections." },
  { property: "og:title", content: "Collections — Replix AI Ad Studio" }, { property: "og:description", content: "Browse saved ad campaign collections." },
  { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary_large_image" },
] }), component: Collections });

function Collections() {
  const [openSignal, setOpenSignal] = useState(0);
  return (
    <AppShell
      title="My Campaigns"
      subtitle="Grouped creatives you can reuse campaign to campaign"
      action={
        <Button variant="navy" className="hidden rounded-full px-7 sm:inline-flex" onClick={() => setOpenSignal((n) => n + 1)}>
          <Plus /> Create Your First Campaign
        </Button>
      }
    >
      <CampaignsView openSignal={openSignal} />
    </AppShell>
  );
}
