import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import emptyFolder from "@/assets/campaign-empty-folder.png.asset.json";
import { CampaignDialog, type CampaignDialogMode } from "@/components/CampaignDialog";
import { CampaignFolderCard } from "@/components/CampaignFolderCard";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import type { Collection } from "@/data/studio";
import { useStudio } from "@/lib/studio-store";

export function CampaignsView({ openSignal = 0 }: { openSignal?: number }) {
  const { collections, ads, removeCollection } = useStudio();
  const navigate = useNavigate();
  const [dialog, setDialog] = useState<{ mode: CampaignDialogMode; collection?: Collection } | null>(null);
  const [pendingDelete, setPendingDelete] = useState<Collection | null>(null);
  const [lastSignal, setLastSignal] = useState(openSignal);

  if (openSignal !== lastSignal) {
    setLastSignal(openSignal);
    setDialog({ mode: "create" });
  }

  const populated = collections.map((collection) => ({
    ...collection,
    ads: ads.filter((ad) => ad.collectionIds.includes(collection.id)),
  }));

  const dialogNode = (
    <>
      <CampaignDialog
        open={Boolean(dialog)}
        mode={dialog?.mode ?? "create"}
        {...(dialog?.collection ? { collection: dialog.collection } : {})}
        onOpenChange={(open) => !open && setDialog(null)}
      />
      <AlertDialog open={Boolean(pendingDelete)} onOpenChange={(open) => !open && setPendingDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="font-display">Delete this campaign?</AlertDialogTitle>
            <AlertDialogDescription>
              “{pendingDelete?.name}” will be removed. Your creatives stay in My Creatives.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="rounded-full">Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="rounded-full"
              onClick={() => {
                if (pendingDelete) removeCollection(pendingDelete.id);
                setPendingDelete(null);
              }}
            >
              Delete campaign
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );

  if (!populated.length)
    return (
      <>
        <div className="mx-auto flex max-w-3xl flex-col items-center rounded-3xl bg-card px-8 py-14 text-center shadow-soft">
          <img src={emptyFolder.url} alt="" className="h-[200px] w-auto" />
          <h2 className="mt-6 font-display text-2xl font-semibold">No Campaigns Yet</h2>
          <p className="mt-2 text-muted-foreground">Group related ads together to keep your gallery tidy.</p>
          <Button variant="navy" className="mt-7 rounded-full px-8 py-6 text-base" onClick={() => setDialog({ mode: "create" })}>
            Create Your First Campaign
          </Button>
        </div>
        {dialogNode}
      </>
    );

  return (
    <>
      <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 lg:gap-x-12 lg:gap-y-10">
        {populated.map((collection) => (
          <CampaignFolderCard
            key={collection.id}
            title={collection.name}
            count={collection.ads.length}
            images={collection.ads.map((ad) => ad.image).filter(Boolean)}
            color={collection.color}
            onOpen={() => navigate({ to: "/campaigns/$campaignId", params: { campaignId: collection.id } })}
            onAdd={() => setDialog({ mode: "ads", collection })}
            onEdit={() => setDialog({ mode: "edit", collection })}
            onDelete={() => setPendingDelete(collection)}
          />
        ))}
      </div>
      {dialogNode}
    </>
  );
}
