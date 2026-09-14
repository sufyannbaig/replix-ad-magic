import { useState } from "react";
import { FolderOpen, Plus } from "lucide-react";
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
        <div className="mx-auto flex max-w-3xl flex-col items-center rounded-3xl border border-border bg-card px-8 py-16 text-center">
          <span className="flex h-20 w-20 items-center justify-center rounded-2xl bg-success-soft">
            <FolderOpen className="h-9 w-9 text-success" />
          </span>
          <h2 className="mt-7 font-display text-2xl font-semibold">No Campaigns Yet</h2>
          <p className="mt-2 text-muted-foreground">Group related ads together to keep your gallery tidy.</p>
          <Button variant="navy" className="mt-8 rounded-full px-7" onClick={() => setDialog({ mode: "create" })}>
            <Plus /> Create Your First Campaign
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
