import { useEffect, useState } from "react";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { collectionColors, type Collection, type CollectionColor } from "@/data/studio";
import { useStudio } from "@/lib/studio-store";
import { cn } from "@/lib/utils";

export type CampaignDialogMode = "create" | "edit" | "ads";

export function CampaignDialog({
  open,
  mode,
  collection,
  onOpenChange,
}: {
  open: boolean;
  mode: CampaignDialogMode;
  collection?: Collection;
  onOpenChange: (open: boolean) => void;
}) {
  const { ads, collections, addCollection, updateCollection, setCollectionAds } = useStudio();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [color, setColor] = useState<CollectionColor>("gray");
  const [selected, setSelected] = useState<string[]>([]);

  useEffect(() => {
    if (!open) return;
    setName(collection?.name ?? "");
    setDescription(collection?.description ?? "");
    setColor(collection?.color ?? collectionColors[collections.length % collectionColors.length]!.id);
    setSelected(
      collection ? ads.filter((ad) => ad.collectionIds.includes(collection.id)).map((ad) => ad.id) : [],
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, collection?.id]);

  const showDetails = mode !== "ads";
  const toggle = (id: string) =>
    setSelected((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));

  const submit = () => {
    if (showDetails && !name.trim()) return;
    if (mode === "create") {
      const id = addCollection({ name: name.trim(), description: description.trim(), color });
      setCollectionAds(id, selected);
    } else if (collection) {
      if (showDetails) updateCollection(collection.id, { name: name.trim(), description: description.trim(), color });
      setCollectionAds(collection.id, selected);
    }
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[88vh] max-w-2xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-display">
            {mode === "create" ? "Create a campaign" : mode === "edit" ? "Edit campaign" : "Add creatives"}
          </DialogTitle>
          <DialogDescription>
            {mode === "ads"
              ? "Pick the creatives that belong in this campaign."
              : "Name your campaign, pick a colour and choose the creatives it holds."}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {showDetails ? (
            <div className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="campaign-name">Campaign name</Label>
                <Input
                  id="campaign-name"
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  placeholder="Summer Product Launch"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="campaign-description">Short description (optional)</Label>
                <Textarea
                  id="campaign-description"
                  value={description}
                  onChange={(event) => setDescription(event.target.value)}
                  placeholder="What this campaign is for"
                  rows={2}
                />
              </div>
              <div className="space-y-2">
                <Label>Colour</Label>
                <div className="flex items-center gap-3">
                  {collectionColors.map((option) => (
                    <button
                      key={option.id}
                      type="button"
                      onClick={() => setColor(option.id)}
                      aria-label={option.label}
                      aria-pressed={color === option.id}
                      className={cn(
                        "flex h-9 w-9 items-center justify-center rounded-full border transition-transform",
                        color === option.id ? "scale-110 border-navy" : "border-border hover:scale-105",
                      )}
                      style={{ backgroundColor: option.swatch }}
                    >
                      {color === option.id ? <Check className="h-4 w-4 text-navy" /> : null}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ) : null}

          <div className="space-y-3">
            <Label>
              Creatives{" "}
              <span className="font-normal text-muted-foreground">({selected.length} selected)</span>
            </Label>
            {ads.length ? (
              <div className="grid max-h-[19rem] grid-cols-3 gap-3 overflow-y-auto rounded-2xl border border-border bg-secondary/40 p-3 sm:grid-cols-4">
                {ads.map((ad) => {
                  const isOn = selected.includes(ad.id);
                  return (
                    <button
                      key={ad.id}
                      type="button"
                      onClick={() => toggle(ad.id)}
                      aria-pressed={isOn}
                      className={cn(
                        "relative overflow-hidden rounded-xl border-2 bg-card transition-colors",
                        isOn ? "border-navy" : "border-transparent hover:border-border",
                      )}
                    >
                      <img src={ad.image} alt={ad.headline} className="aspect-square w-full object-cover" />
                      {isOn ? (
                        <span className="absolute top-1.5 right-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-navy text-navy-foreground">
                          <Check className="h-3 w-3" />
                        </span>
                      ) : null}
                    </button>
                  );
                })}
              </div>
            ) : (
              <p className="rounded-2xl border border-border bg-secondary/40 p-5 text-sm text-muted-foreground">
                You have no creatives yet. Generate ads first, then add them here.
              </p>
            )}
          </div>
        </div>

        <DialogFooter>
          <Button variant="ghost" onClick={() => onOpenChange(false)} className="rounded-full">
            Cancel
          </Button>
          <Button variant="navy" onClick={submit} disabled={showDetails && !name.trim()} className="rounded-full px-6">
            {mode === "create" ? "Create campaign" : "Save changes"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
