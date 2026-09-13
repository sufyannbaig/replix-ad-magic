import { Link } from "@tanstack/react-router";
import { FolderOpen, Plus } from "lucide-react";
import { CampaignFolderCard } from "@/components/CampaignFolderCard";
import { Button } from "@/components/ui/button";
import { useStudio } from "@/lib/studio-store";

export function CampaignsView() {
  const { collections, ads } = useStudio();
  const populated = collections.map((collection, index) => ({
    ...collection,
    index,
    ads: ads.filter((ad) => ad.collectionIds.includes(collection.id)),
  }));
  const hasAny = populated.some((collection) => collection.ads.length > 0);

  if (!hasAny) return <div className="mx-auto flex max-w-3xl flex-col items-center rounded-3xl border border-border bg-card px-8 py-16 text-center"><span className="flex h-20 w-20 items-center justify-center rounded-2xl bg-success-soft"><FolderOpen className="h-9 w-9 text-success" /></span><h2 className="mt-7 font-display text-2xl font-semibold">No Collections Yet</h2><p className="mt-2 text-muted-foreground">Group related ads together to keep your gallery tidy.</p><Button asChild variant="navy" className="mt-8 rounded-full"><Link to="/gallery"><Plus /> Create Your First Collection</Link></Button></div>;

  return <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 lg:gap-x-14">{populated.map((collection) => <CampaignFolderCard key={collection.id} title={collection.name} count={collection.ads.length} images={collection.ads.map((ad) => ad.image).filter(Boolean)} index={collection.index} />)}</div>;
}