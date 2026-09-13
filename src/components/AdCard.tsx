import { useState } from "react";
import {
  Download,
  Instagram,
  Facebook,
  Pencil,
  RefreshCw,
  Star,
  Check,
  Loader2,
} from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { adScenes, themes, type Ad, type Platform } from "@/data/studio";
import { useStudio } from "@/lib/studio-store";
import { downloadImage } from "@/lib/image-utils";
import { cn } from "@/lib/utils";

const themeLabel = (id: Ad["theme"]) => themes.find((t) => t.id === id)?.label ?? id;

function PlatformPreview({
  ad,
  platform,
  open,
  onClose,
}: {
  ad: Ad;
  platform: Platform;
  open: boolean;
  onClose: () => void;
}) {
  const isIg = platform === "instagram";
  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle className="font-display">
            {isIg ? "Instagram" : "Facebook"} preview
          </DialogTitle>
          <DialogDescription>
            This is how the creative would appear in the feed. Pushing is disabled in this demo.
          </DialogDescription>
        </DialogHeader>

        <div className="overflow-hidden rounded-xl border border-border bg-card">
          <div className="flex items-center gap-2 p-3">
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-navy text-[0.65rem] font-bold text-navy-foreground">
              ZC
            </span>
            <div className="leading-tight">
              <p className="text-xs font-semibold">zaffocoffee</p>
              <p className="text-[0.65rem] text-muted-foreground">Sponsored</p>
            </div>
          </div>
          <img src={ad.image} alt={ad.headline} className="aspect-square w-full object-cover" />
          <div className="space-y-2 p-3">
            <p className="text-sm font-semibold">{ad.headline}</p>
            <p className="text-xs text-muted-foreground">{ad.caption}</p>
            <Button size="sm" className="w-full">
              {ad.cta}
            </Button>
          </div>
        </div>

        <Button variant="outline" onClick={onClose}>
          Close preview
        </Button>
      </DialogContent>
    </Dialog>
  );
}

export function AdCard({
  ad,
  onRegenerate,
  compact = false,
}: {
  ad: Ad;
  onRegenerate?: (ad: Ad) => void | Promise<void>;
  compact?: boolean;
}) {
  const { toggleFavorite, updateAd } = useStudio();
  const [preview, setPreview] = useState<Platform | null>(null);
  const [editing, setEditing] = useState(false);
  const [headline, setHeadline] = useState(ad.headline);
  const [caption, setCaption] = useState(ad.caption);
  const [cta, setCta] = useState(ad.cta);
  const [regenerating, setRegenerating] = useState(false);
  const fallbackImage = adScenes[Math.abs(ad.id.split("").reduce((sum, char) => sum + char.charCodeAt(0), 0)) % adScenes.length]?.src;

  const aspectClass =
    ad.format === "9:16" ? "aspect-[9/16]" : ad.format === "4:5" ? "aspect-[4/5]" : "aspect-square";

  const handleRegenerate = async () => {
    if (!onRegenerate) return;
    setRegenerating(true);
    try {
      await onRegenerate(ad);
    } finally {
      setRegenerating(false);
    }
  };

  const saveCopy = () => {
    updateAd(ad.id, { headline, caption, cta });
    setEditing(false);
    toast.success("Copy updated");
  };

  const handleDownload = async () => {
    if (!ad.image) return;
    try {
      await downloadImage(ad.image, `${ad.productName.replace(/\s+/g, "-").toLowerCase()}-ad.png`);
    } catch {
      toast.error("Could not download that image.");
    }
  };

  return (
    <article className="group card-soft overflow-hidden transition-shadow hover:shadow-lift">
      <div className="relative">
        {ad.image ? (
          <img
            src={ad.image}
            alt={ad.headline}
            loading="eager"
            onError={(event) => {
              if (fallbackImage && event.currentTarget.src !== fallbackImage) event.currentTarget.src = fallbackImage;
            }}
            className={cn(
              "w-full object-cover",
              aspectClass,
              regenerating && "animate-pulse opacity-40",
            )}
          />
        ) : (
          <div
            className={cn(
              "flex w-full animate-pulse flex-col items-center justify-center gap-2 bg-muted",
              aspectClass,
            )}
          >
            <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
            <p className="text-xs text-muted-foreground">Painting the scene…</p>
          </div>
        )}
        <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
          <Badge className="bg-navy/85 text-[0.65rem] text-navy-foreground hover:bg-navy">
            {ad.platform === "instagram" ? "Instagram" : "Facebook"}
          </Badge>
          <Badge variant="secondary" className="bg-card/90 text-[0.65rem]">
            {ad.format}
          </Badge>
        </div>
        <button
          onClick={() => toggleFavorite(ad.id)}
          aria-label="Toggle favourite"
          className={cn(
            "absolute top-3 right-3 rounded-full p-2 backdrop-blur transition-colors",
            ad.favorite ? "bg-success text-navy-foreground" : "bg-card/85 text-muted-foreground",
          )}
        >
          <Star className={cn("h-4 w-4", ad.favorite && "fill-current")} />
        </button>
        {ad.favorite ? (
          <Badge className="absolute bottom-3 left-3 gap-1 bg-success text-[0.65rem] text-navy-foreground hover:bg-success">
            <Check className="h-3 w-3" /> Winning pick
          </Badge>
        ) : null}
      </div>

      <div className="space-y-3 p-3.5">
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="outline" className="text-[0.65rem] font-medium">
            {themeLabel(ad.theme)}
          </Badge>
          <span className="text-[0.7rem] text-muted-foreground">{ad.productName}</span>
        </div>

        {!compact ? (
          <div className="space-y-1.5 rounded-xl bg-muted/70 p-3 text-xs">
            <p>
              <span className="font-semibold">Target audience:</span>{" "}
              <span className="text-muted-foreground">{ad.audience}</span>
            </p>
            <p>
              <span className="font-semibold">Core idea:</span>{" "}
              <span className="text-muted-foreground">{ad.coreIdea}</span>
            </p>
          </div>
        ) : null}

        {editing ? (
          <div className="space-y-2">
            <Input value={headline} onChange={(e) => setHeadline(e.target.value)} />
            <Textarea
              value={caption}
              rows={4}
              onChange={(e) => setCaption(e.target.value)}
              className="text-xs"
            />
            <Input value={cta} onChange={(e) => setCta(e.target.value)} />
            <div className="flex gap-2">
              <Button size="sm" onClick={saveCopy}>
                Save copy
              </Button>
              <Button size="sm" variant="ghost" onClick={() => setEditing(false)}>
                Cancel
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-1.5">
            <h3 className="font-display text-sm leading-snug font-semibold">{ad.headline}</h3>
            <p className="text-xs leading-relaxed text-muted-foreground">{ad.caption}</p>
            <p className="pt-1 text-xs font-semibold text-navy">
              CTA button: <span className="text-primary">{ad.cta}</span>
            </p>
          </div>
        )}

        <div className="flex items-center gap-1 border-t border-border pt-3">
          {onRegenerate ? (
            <Button
              size="icon"
              variant="ghost"
              title="Regenerate"
              onClick={() => void handleRegenerate()}
              disabled={regenerating}
            >
              <RefreshCw className={cn("h-4 w-4", regenerating && "animate-spin")} />
            </Button>
          ) : null}
          <Button
            size="icon"
            variant="ghost"
            title="Edit copy"
            onClick={() => setEditing((v) => !v)}
          >
            <Pencil className="h-4 w-4" />
          </Button>
          <Button
            size="icon"
            variant="ghost"
            title="Download"
            disabled={!ad.image}
            onClick={handleDownload}
          >
            <Download className="h-4 w-4" />
          </Button>
          <span className="flex-1" />
          <Button
            size="icon"
            variant="ghost"
            title="Push to Instagram"
            onClick={() => setPreview("instagram")}
          >
            <Instagram className="h-4 w-4" />
          </Button>
          <Button
            size="icon"
            variant="ghost"
            title="Push to Facebook"
            onClick={() => setPreview("facebook")}
          >
            <Facebook className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {preview ? (
        <PlatformPreview ad={ad} platform={preview} open onClose={() => setPreview(null)} />
      ) : null}
    </article>
  );
}
