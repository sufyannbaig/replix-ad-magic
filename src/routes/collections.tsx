import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { CampaignsView } from "@/components/CampaignsView";

export const Route = createFileRoute("/collections")({ head: () => ({ meta: [
  { title: "Collections — Replix AI Ad Studio" }, { name: "description", content: "Browse your saved Replix ad campaign collections." },
  { property: "og:title", content: "Collections — Replix AI Ad Studio" }, { property: "og:description", content: "Browse saved ad campaign collections." },
  { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary_large_image" },
] }), component: Collections });
function Collections() { return <AppShell title="My Campaigns" subtitle="Grouped creatives you can reuse campaign to campaign"><CampaignsView /></AppShell>; }