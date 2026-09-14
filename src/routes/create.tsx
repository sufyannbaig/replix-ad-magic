import { createFileRoute, Link } from "@tanstack/react-router";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  ChevronRight,
  Download,
  Loader2,
  Share2,
  Sparkles,
  Lightbulb,
  Plus,
  Upload,
  AlertTriangle,
  ImagePlus,
  Pencil,
  LayoutGrid,
  Link2,
  Package,
  X,
} from "lucide-react";

import { toast } from "sonner";
import { AppShell } from "@/components/AppShell";
import { AdCard } from "@/components/AdCard";
import { AdCardSkeleton } from "@/components/AdCardSkeleton";
import { ProductCardBody, productCardClasses } from "@/components/ProductCard";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Progress } from "@/components/ui/progress";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import {
  formats,
  products,
  store,
  themes,
  understandingSteps,
  type Ad,
  type AdFormat,
  type Platform,
  type ThemeId,
} from "@/data/studio";
import { analyzeProductImage, generateAdCopy, renderAdImage, resolveProductUrl, type ProductAnalysis } from "@/lib/ai.functions";
import { saveAd } from "@/lib/ads-repo";
import { downloadImage, fileToDataUrl, urlToDataUrl } from "@/lib/image-utils";
import { useStudio } from "@/lib/studio-store";
import { takeProductIntake } from "@/lib/product-intake";
import { cn } from "@/lib/utils";
import themeBeforeAfter from "@/assets/theme-before-after.jpg";
import themeBoldClaim from "@/assets/theme-bold-claim.jpg";
import themeFeatureBenefit from "@/assets/theme-feature-benefit.jpg";
import themeHeadline from "@/assets/theme-headline.jpg";
import themeOfferSale from "@/assets/theme-offer-sale.jpg";
import themeProblemSolution from "@/assets/theme-problem-solution.jpg";
import themeShowcase from "@/assets/theme-showcase.jpg";
import themeStats from "@/assets/theme-stats.jpg";
import themeTestimonial from "@/assets/theme-testimonial.jpg";
import themeUsVsThem from "@/assets/theme-us-vs-them.jpg";

/** Original, generated example previews — one per creative theme. */
const themeThumbs: Record<ThemeId, string> = {
  "before-after": themeBeforeAfter,
  "bold-claim": themeBoldClaim,
  "feature-benefit": themeFeatureBenefit,
  headline: themeHeadline,
  "offer-sale": themeOfferSale,
  "problem-solution": themeProblemSolution,
  showcase: themeShowcase,
  stats: themeStats,
  testimonial: themeTestimonial,
  "us-vs-them": themeUsVsThem,
};

/** Objective is no longer chosen in the wizard — the creative theme carries the intent. */
const DEFAULT_OBJECTIVE = "awareness" as const;

export const Route = createFileRoute("/create")({
  head: () => ({
    meta: [
      { title: "Create Ad — Replix AI Ad Studio" },
      {
        name: "description",
        content:
          "A four-step ad builder: pick a product or upload a photo, let Replix study it, choose your angle, then generate a batch of real creative concepts.",
      },
      { property: "og:title", content: "Create Ad — Replix AI Ad Studio" },
      {
        property: "og:description",
        content: "Study the product, choose an angle, generate a batch of ad concepts.",
      },
    ],
  }),
  component: CreateAd,
});

const stepLabels = ["Pick a product", "Create a new ad"];

/** What we are making ads for: a catalogue product or an uploaded photo. */
type Subject = {
  id: string;
  name: string;
  price?: number;
  /** What we show in the UI. */
  displayImage: string;
  /** The real reference photo handed to the AI. */
  dataUrl: string;
  source: "shopify" | "upload" | "url";
};

function StepRail({ step }: { step: number }) {
  return (
    <div className="flex items-center gap-3">
      {stepLabels.map((label, i) => {
        const n = i + 1;
        const done = step > n;
        const active = step === n;
        return (
          <div key={label} className="flex flex-1 items-center gap-3">
            <span
              className={cn(
                "flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-semibold transition-colors",
                done
                  ? "bg-navy text-navy-foreground"
                  : active
                    ? "bg-navy text-navy-foreground"
                    : "bg-muted text-muted-foreground/60",
              )}
            >
              {done ? <Check className="h-4 w-4" /> : n}
            </span>
            <span
              className={cn(
                "text-sm whitespace-nowrap",
                active || done ? "font-semibold text-foreground" : "text-muted-foreground/60",
              )}
            >
              {label}
            </span>
            {i < stepLabels.length - 1 ? (
              <span className="hidden h-px flex-1 bg-border sm:block" />
            ) : null}
          </div>
        );
      })}
    </div>
  );
}


/** One labelled, inline-editable field of the product summary card. */
function SummaryField({
  label,
  value,
  list,
  onSave,
}: {
  label: string;
  value: string;
  list?: boolean;
  onSave: (next: string) => void;
}) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(value);

  const start = () => {
    setDraft(value);
    setEditing(true);
  };
  const save = () => {
    onSave(draft);
    setEditing(false);
  };

  const lines = value
    .split("\n")
    .map((l) => l.replace(/^[-•\s]+/, "").trim())
    .filter(Boolean);

  return (
    <div className="rounded-xl border border-border bg-muted/50 p-4">
      <div className="flex items-start justify-between gap-3">
        <p className="text-xs font-semibold tracking-[0.14em] text-navy uppercase">{label}</p>
        {editing ? null : (
          <button
            onClick={start}
            aria-label={`Edit ${label}`}
            className="rounded-lg p-1.5 text-muted-foreground transition-colors hover:bg-gold-soft hover:text-navy"
          >
            <Pencil className="h-3.5 w-3.5" />
          </button>
        )}
      </div>

      {editing ? (
        <div className="mt-2 space-y-2">
          <Textarea
            value={draft}
            rows={list ? 6 : 3}
            onChange={(e) => setDraft(e.target.value)}
            aria-label={`${label} text`}
          />
          {list ? (
            <p className="text-xs text-muted-foreground">One selling point per line.</p>
          ) : null}
          <div className="flex gap-2">
            <Button size="sm" onClick={save}>
              Save
            </Button>
            <Button size="sm" variant="ghost" onClick={() => setEditing(false)}>
              Cancel
            </Button>
          </div>
        </div>
      ) : list ? (
        <ul className="mt-2 space-y-2">
          {lines.length ? (
            lines.map((line) => (
              <li key={line} className="flex gap-2">
                <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-success" />
                <span className="text-sm leading-relaxed">{line}</span>
              </li>
            ))
          ) : (
            <li className="text-sm text-muted-foreground">Nothing yet — add your own.</li>
          )}
        </ul>
      ) : (
        <p className="mt-2 text-sm leading-relaxed">
          {value || <span className="text-muted-foreground">Nothing yet — add your own.</span>}
        </p>
      )}
    </div>
  );
}

/* ---------- Product panel: real photo analysis, editable summary ---------- */

function ProductPanel({
  subject,
  analysis,
  onAnalysed,
  onChangeProduct,
  onDeleteProduct,
}: {
  subject: Subject;
  analysis: ProductAnalysis | null;
  onAnalysed: (analysis: ProductAnalysis) => void;
  onChangeProduct: () => void;
  onDeleteProduct: () => void;
}) {
  const [completed, setCompleted] = useState(analysis ? understandingSteps.length : 0);
  const [error, setError] = useState<string | null>(null);
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    if (analysis) {
      setCompleted(understandingSteps.length);
      return;
    }
    let active = true;
    setError(null);
    setCompleted(0);

    // Pace the visible ticks so the two early stages always read, even on a fast reply.
    const timers = [
      setTimeout(() => active && setCompleted((c) => Math.max(c, 1)), 1100),
      setTimeout(() => active && setCompleted((c) => Math.max(c, 2)), 2300),
    ];
    const started = Date.now();

    void analyzeProductImage({
      data: {
        imageDataUrl: subject.dataUrl,
        productName: subject.name,
        ...(subject.price !== undefined ? { price: subject.price } : {}),
        storeName: subject.source === "shopify" ? store.name : undefined,
      },
    })
      .then((result) => {
        const wait = Math.max(0, 3600 - (Date.now() - started));
        timers.push(
          setTimeout(() => {
            if (!active) return;
            setCompleted(understandingSteps.length);
            onAnalysed(result);
          }, wait),
        );
      })
      .catch((err: unknown) => {
        if (!active) return;
        setError(err instanceof Error ? err.message : "We could not read that photo.");
      });

    return () => {
      active = false;
      timers.forEach(clearTimeout);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [subject.dataUrl, attempt]);

  const thumb = (
    <div className="w-full shrink-0 sm:w-40">
      <img
        src={subject.displayImage}
        alt={subject.name}
        className="aspect-square w-full rounded-xl border border-border object-cover"
        loading="lazy"
      />
      <p className="mt-2 font-display text-sm font-semibold">{subject.name}</p>
      {subject.price !== undefined ? (
        <p className="text-xs text-muted-foreground">${subject.price.toFixed(2)}</p>
      ) : null}
      <div className="mt-2 flex gap-2">
        <Button size="sm" variant="outline" onClick={onChangeProduct}>
          Change
        </Button>
        <Button
          size="sm"
          variant="ghost"
          className="text-destructive hover:text-destructive"
          onClick={onDeleteProduct}
        >
          Delete
        </Button>
      </div>
    </div>
  );

  return (
    <div className="rounded-2xl bg-muted/60 p-5">
      <div className="card-soft p-5">
        <div className="flex flex-col gap-6 sm:flex-row">
          {thumb}

          <div className="min-w-0 flex-1">
            {error ? (
              <div>
                <div className="flex items-center gap-2 text-destructive">
                  <AlertTriangle className="h-4 w-4" />
                  <h3 className="font-display text-base font-semibold">
                    We couldn't read that photo
                  </h3>
                </div>
                <p className="mt-2 text-sm text-muted-foreground">{error}</p>
                <Button className="mt-4" onClick={() => setAttempt((a) => a + 1)}>
                  Try again
                </Button>
              </div>
            ) : analysis ? (
              <div className="animate-fade-in space-y-3">
                <SummaryField
                  label="Product highlights"
                  list
                  value={(analysis.highlights?.length
                    ? analysis.highlights
                    : (analysis.insights ?? [])
                  ).join("\n")}
                  onSave={(next) =>
                    onAnalysed({
                      ...analysis,
                      highlights: next
                        .split("\n")
                        .map((l) => l.replace(/^[-•\s]+/, "").trim())
                        .filter(Boolean),
                    })
                  }
                />
                <SummaryField
                  label="Ideal customer"
                  value={analysis.idealCustomer || analysis.audiences?.[0] || ""}
                  onSave={(next) => onAnalysed({ ...analysis, idealCustomer: next.trim() })}
                />
                <div className="grid gap-3 md:grid-cols-2">
                  <SummaryField
                    label="Pain point"
                    value={analysis.painPoint ?? ""}
                    onSave={(next) => onAnalysed({ ...analysis, painPoint: next.trim() })}
                  />
                  <SummaryField
                    label="Customer need"
                    value={analysis.customerNeed || analysis.sellingAngle || ""}
                    onSave={(next) => onAnalysed({ ...analysis, customerNeed: next.trim() })}
                  />
                </div>
              </div>
            ) : (
              <div>
                <div className="rounded-xl bg-navy p-4 text-navy-foreground">
                  <p className="text-xs tracking-[0.16em] text-navy-foreground/50 uppercase">
                    Studying your product
                  </p>
                  <ul className="mt-3 space-y-2.5">
                    {understandingSteps.map((label, i) => {
                      const isDone = completed > i;
                      const isActive = completed === i;
                      return (
                        <li key={label} className="flex items-center gap-3">
                          <span
                            className={cn(
                              "flex h-6 w-6 items-center justify-center rounded-full transition-all duration-500",
                              isDone
                                ? "bg-success text-navy-foreground"
                                : "bg-navy-soft text-navy-foreground/60",
                            )}
                          >
                            {isDone ? (
                              <Check className="h-3.5 w-3.5 animate-scale-in" />
                            ) : isActive ? (
                              <Loader2 className="h-3 w-3 animate-spin" />
                            ) : (
                              <span className="h-1.5 w-1.5 rounded-full bg-current" />
                            )}
                          </span>
                          <span
                            className={cn(
                              "text-sm",
                              isDone
                                ? "text-navy-foreground"
                                : isActive
                                  ? "text-navy-foreground/90"
                                  : "text-navy-foreground/45",
                            )}
                          >
                            {label}
                            {isActive ? "…" : ""}
                          </span>
                        </li>
                      );
                    })}
                  </ul>
                  <Progress
                    value={(completed / understandingSteps.length) * 100}
                    className="mt-4 h-1.5 bg-navy-foreground/15"
                  />
                </div>
                <div className="mt-3 space-y-3">
                  {[0, 1].map((i) => (
                    <div key={i} className="space-y-2 rounded-xl bg-muted/70 p-3">
                      <Skeleton className="h-3.5 w-full" />
                      <Skeleton className="h-3.5 w-4/5" />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}


/* ---------- Step 4: real generation progress ---------- */

function GenerationProgress({
  count,
  copyDone,
  imagesDone,
}: {
  count: number;
  copyDone: boolean;
  imagesDone: number;
}) {
  const stages = [
    { label: "Writing hooks, captions and calls to action", done: copyDone },
    {
      label: `Building ad scenes around your real product (${imagesDone} of ${count})`,
      done: imagesDone >= count,
    },
  ];
  const progress = ((copyDone ? 1 : 0) + imagesDone / count) / 2;

  return (
    <div className="card-soft mx-auto max-w-xl p-8 text-center">
      <Loader2 className="mx-auto h-7 w-7 animate-spin text-primary" />
      <h3 className="mt-4 font-display text-lg font-semibold">
        Generating {count} concepts for you
      </h3>
      <ul className="mt-6 space-y-2.5 text-left">
        {stages.map((stage) => (
          <li key={stage.label} className="flex items-center gap-3 text-sm">
            <span
              className={cn(
                "flex h-6 w-6 shrink-0 items-center justify-center rounded-full",
                stage.done ? "bg-success text-navy-foreground" : "bg-muted text-muted-foreground",
              )}
            >
              {stage.done ? (
                <Check className="h-3.5 w-3.5" />
              ) : (
                <Loader2 className="h-3 w-3 animate-spin" />
              )}
            </span>
            <span className={stage.done ? "text-foreground" : "text-muted-foreground"}>
              {stage.label}
            </span>
          </li>
        ))}
      </ul>
      <Progress value={progress * 100} className="mt-6 h-2" />
      <p className="mt-4 text-xs text-muted-foreground">
        Real image generation takes a little while — cards fill in as each one lands.
      </p>
    </div>
  );
}


/* ---------- Step 3: one unified creative-theme picker ---------- */

function ThemePicker({
  themeIds,
  onToggle,
  onClear,
}: {
  themeIds: ThemeId[];
  onToggle: (id: ThemeId) => void;
  onClear: () => void;
}) {
  const [open, setOpen] = useState(false);
  const chosen = themes.filter((t) => themeIds.includes(t.id));
  const preview = chosen.length ? chosen : themes.slice(0, 3);

  return (
    <div className="rounded-2xl bg-muted/60 p-5">
      <div className="card-soft flex flex-col items-center gap-4 p-5 text-center">
        <div className="flex h-28 items-center justify-center pt-2">
          {preview.map((t, i) => (
            <img
              key={t.id}
              src={themeThumbs[t.id]}
              alt={`${t.label} example`}
              loading="lazy"
              width={816}
              height={816}
              className={cn(
                "h-24 w-24 rounded-xl border-2 border-card object-cover shadow-lift transition-transform",
                i > 0 && "-ml-10",
                i === 0 && "-rotate-8",
                i === 1 && "rotate-1 z-10",
                i === 2 && "rotate-8 z-20",
              )}
            />
          ))}
        </div>

        <p className="text-sm font-semibold text-navy underline decoration-navy/40 underline-offset-4">
          Select Creative Theme
        </p>

        {chosen.length ? (
          <div className="flex flex-wrap justify-center gap-2">
            {chosen.map((t) => (
              <Badge
                key={t.id}
                className="cursor-pointer bg-gold-soft text-navy hover:bg-gold-soft"
                onClick={() => onToggle(t.id)}
              >
                {t.label}
                <X className="ml-1 h-3 w-3" />
              </Badge>
            ))}
          </div>
        ) : (
          <p className="text-xs text-muted-foreground">
            Ten ad styles — from a plain bold claim to a before-and-after.
          </p>
        )}

        <div className="flex w-full flex-col gap-2">
          <Button
            className="w-full bg-navy text-navy-foreground hover:bg-navy-soft"
            onClick={() => setOpen(true)}
          >
            <LayoutGrid className="mr-1 h-4 w-4" /> Select Theme
          </Button>
          {chosen.length ? (
            <Button variant="ghost" size="sm" onClick={onClear}>
              Clear
            </Button>
          ) : null}
        </div>
      </div>


      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-3xl">
          <DialogHeader>
            <DialogTitle className="font-display">Creative themes</DialogTitle>
            <DialogDescription>
              Choose up to three. Each preview is an example of that style, not your ad.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 sm:grid-cols-3">
            {themes.map((t) => {
              const selected = themeIds.includes(t.id);
              return (
                <button
                  key={t.id}
                  onClick={() => onToggle(t.id)}
                  className={cn(
                    "card-soft overflow-hidden text-left transition-all hover:shadow-lift",
                    selected && "ring-2 ring-primary",
                  )}
                >
                  <div className="relative">
                    <img
                      src={themeThumbs[t.id]}
                      alt={`${t.label} example`}
                      loading="lazy"
                      width={816}
                      height={816}
                      className="aspect-square w-full object-cover"
                    />
                    <span
                      className={cn(
                        "absolute top-2 right-2 flex h-6 w-6 items-center justify-center rounded-full",
                        selected
                          ? "bg-success text-navy-foreground"
                          : "bg-card/90 text-muted-foreground",
                      )}
                    >
                      {selected ? <Check className="h-3.5 w-3.5" /> : <Plus className="h-3.5 w-3.5" />}
                    </span>
                  </div>
                  <div className="p-3">
                    <p className="font-display text-sm font-semibold">{t.label}</p>
                    <p className="text-xs text-muted-foreground">{t.logic}</p>
                  </div>
                </button>
              );
            })}
          </div>
          <div className="flex justify-end">
            <Button onClick={() => setOpen(false)}>Done</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

/* ---------- Step 1: pick a product or upload a photo ---------- */

function UploadPanel({ onReady }: { onReady: (subject: Subject) => void }) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [dataUrl, setDataUrl] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [busy, setBusy] = useState(false);

  const handleFile = async (file: File | undefined) => {
    if (!file) return;
    setBusy(true);
    try {
      setDataUrl(await fileToDataUrl(file));
      if (!name) setName(file.name.replace(/\.[^.]+$/, "").replace(/[-_]+/g, " "));
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "We couldn't read that image file.");
    } finally {
      setBusy(false);
    }
  };

  const start = () => {
    if (!dataUrl) return;
    const parsedPrice = Number.parseFloat(price);
    onReady({
      id: `upload-${Date.now()}`,
      name: name.trim() || "Your product",
      ...(Number.isFinite(parsedPrice) ? { price: parsedPrice } : {}),
      displayImage: dataUrl,
      dataUrl,
      source: "upload",
    });
  };

  return (
    <div className="card-soft grid gap-6 p-6 lg:grid-cols-[320px_1fr]">
      <button
        onClick={() => inputRef.current?.click()}
        className={cn(
          "flex aspect-square w-full flex-col items-center justify-center gap-2 overflow-hidden rounded-xl border border-dashed border-border bg-muted/50 transition-colors hover:border-primary",
          dataUrl && "border-solid",
        )}
      >
        {dataUrl ? (
          <img src={dataUrl} alt="Your uploaded product" className="h-full w-full object-cover" />
        ) : busy ? (
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        ) : (
          <>
            <ImagePlus className="h-7 w-7 text-muted-foreground" />
            <span className="text-sm font-semibold">Choose a photo</span>
            <span className="text-xs text-muted-foreground">JPG or PNG, up to 10MB</span>
          </>
        )}
      </button>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => void handleFile(e.target.files?.[0])}
      />

      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="upload-name">Product name (optional)</Label>
          <Input
            id="upload-name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Sea Salt Caramel Cold Brew"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="upload-price">Price (optional)</Label>
          <Input
            id="upload-price"
            value={price}
            inputMode="decimal"
            onChange={(e) => setPrice(e.target.value)}
            placeholder="35.99"
          />
        </div>
        <p className="text-xs text-muted-foreground">
          Your photo is used as the real reference for both the insights and every generated ad
          scene, so the product stays recognisable.
        </p>
        <Button disabled={!dataUrl} onClick={start}>
          Study this photo <ArrowRight className="ml-1 h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}

function ProductUrlPanel({ onReady }: { onReady: (subject: Subject) => void }) {
  const [url, setUrl] = useState("");
  const [busy, setBusy] = useState(false);

  const analyze = async () => {
    if (!url.trim()) {
      toast.error("Enter a product URL first.");
      return;
    }
    setBusy(true);
    try {
      const resolved = await resolveProductUrl({ data: { url: url.trim() } });
      onReady({
        id: `url-${Date.now()}`,
        name: resolved.name,
        displayImage: resolved.imageUrl,
        dataUrl: resolved.dataUrl,
        source: "url",
      });
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "We could not analyze that product URL.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="flex flex-col items-center rounded-3xl border border-border bg-card px-8 py-16 text-center">
      <span className="flex h-16 w-16 items-center justify-center rounded-2xl bg-navy text-gold"><Link2 className="h-6 w-6" /></span>
      <h3 className="mt-6 font-display text-xl font-semibold">Enter Your Product URL</h3>
      <p className="mt-2 text-sm text-muted-foreground">Paste a public product page and we’ll use its primary image.</p>
      <div className="mt-6 flex w-full max-w-lg rounded-full border border-input bg-background p-1.5 pl-4">
        <Input value={url} onChange={(event) => setUrl(event.target.value)} placeholder="https://yourstore.com/products/..." className="h-9 flex-1 border-0 bg-transparent px-0 shadow-none" />
        <Button className="rounded-full" disabled={busy} onClick={() => void analyze()}>{busy ? <Loader2 className="animate-spin" /> : <Sparkles />} Analyze</Button>
      </div>
    </div>
  );
}

/**
 * Wizard progress lives outside the component so a remount of the page (hot
 * reload, a re-render of the shell, a stray error boundary reset) can never
 * throw the user back to step 1 and lose the product, angle and results.
 */
type WizardCache = {
  step: number;
  mode: "product" | "upload" | "url";
  subject: Subject | null;
  analysis: ProductAnalysis | null;
  themeIds: ThemeId[];
  format: AdFormat;
  batch: number;
  results: Ad[];
  batchIndex: number;
};

const wizardCache: WizardCache = {
  step: 1,
  mode: "product",
  subject: null,
  analysis: null,
  themeIds: [],
  format: "1:1",
  batch: 5,
  results: [],
  batchIndex: 0,
};

function CreateAd() {
  const { addAds, replaceAd, removeAd, spendCredits } = useStudio();
  const [step, setStep] = useState(wizardCache.step);
  const [mode, setMode] = useState<"product" | "upload" | "url">(wizardCache.mode);
  const [subject, setSubject] = useState<Subject | null>(wizardCache.subject);
  const [preparing, setPreparing] = useState<string | null>(null);
  const [analysis, setAnalysis] = useState<ProductAnalysis | null>(wizardCache.analysis);
  const [themeIds, setThemeIds] = useState<ThemeId[]>(wizardCache.themeIds);
  const [format, setFormat] = useState<AdFormat>(wizardCache.format);
  const [batch, setBatch] = useState(wizardCache.batch);
  const [generating, setGenerating] = useState(false);
  const [copyDone, setCopyDone] = useState(false);
  const [imagesDone, setImagesDone] = useState(0);
  const [pending, setPending] = useState(0);
  const [results, setResults] = useState<Ad[]>(wizardCache.results);
  const [genError, setGenError] = useState<string | null>(null);
  const batchIndex = useRef(wizardCache.batchIndex);

  // Mirror every choice out to the cache so it survives a remount.
  useEffect(() => {
    wizardCache.step = step;
    wizardCache.mode = mode;
    wizardCache.subject = subject;
    wizardCache.analysis = analysis;
    wizardCache.themeIds = themeIds;
    wizardCache.format = format;
    wizardCache.batch = batch;
    wizardCache.results = results;
    wizardCache.batchIndex = batchIndex.current;
  }, [step, mode, subject, analysis, themeIds, format, batch, results]);

  // Never sit on a step whose inputs are missing — that used to render a blank
  // panel that looked like the wizard had reset itself.
  useEffect(() => {
    if (step > 1 && !subject) setStep(1);
  }, [step, subject]);

  useEffect(() => {
    const intake = takeProductIntake();
    if (!intake) return;
    if (intake.kind === "upload") {
      startUpload({ id: `upload-${Date.now()}`, name: intake.name || "Your product", displayImage: intake.dataUrl, dataUrl: intake.dataUrl, source: "upload" });
      return;
    }
    setMode("url");
  }, []);



  const pickProduct = async (id: string) => {
    const product = products.find((p) => p.id === id);
    if (!product) return;
    setPreparing(id);
    try {
      const dataUrl = await urlToDataUrl(product.image);
      setSubject({
        id: product.id,
        name: product.name,
        price: product.price,
        displayImage: product.image,
        dataUrl,
        source: "shopify",
      });
      setAnalysis(null);
      setStep(2);
    } catch {
      toast.error("Could not open that product photo.");
    } finally {
      setPreparing(null);
    }
  };

  const startUpload = (next: Subject) => {
    setSubject(next);
    setAnalysis(null);
    setStep(2);
  };

  const toggleTheme = (id: ThemeId) =>
    setThemeIds((prev) =>
      prev.includes(id) ? prev.filter((t) => t !== id) : prev.length >= 3 ? prev : [...prev, id],
    );

  const platformFor = (index: number): Platform => (index % 2 === 0 ? "instagram" : "facebook");

  /** Generate the hero image for one concept, persist it, then swap it into the grid. */
  const renderAndSave = useCallback(
    async (draft: Ad, imageBrief: string, dataUrl: string) => {
      try {
        const { path, signedUrl } = await renderAdImage({
          data: {
            imageDataUrl: dataUrl,
            imageBrief,
            productName: draft.productName,
            format: draft.format,
            theme: draft.theme,
            ...(draft.overlay?.hero ? { overlay: draft.overlay } : {}),
          },
        });
        const withImage: Ad = { ...draft, image: signedUrl, imagePath: path };
        const saved = await saveAd(withImage);
        setResults((prev) => prev.map((r) => (r.id === draft.id ? saved : r)));
        replaceAd(draft.id, saved);
      } catch (err) {
        const message = err instanceof Error ? err.message : "Image generation failed.";
        toast.error(message);
        setResults((prev) => prev.filter((r) => r.id !== draft.id));
        removeAd(draft.id);
      } finally {
        setImagesDone((n) => n + 1);
        setPending((n) => Math.max(0, n - 1));
      }
    },
    [replaceAd, removeAd],
  );

  const runGeneration = async (count: number) => {
    if (!subject || !analysis) {
      setStep(subject ? 2 : 1);
      toast.error("Pick a product or photo first so we have something to study.");
      return;
    }
    if (themeIds.length === 0) {
      setStep(3);
      toast.error("Choose at least one creative theme.");
      return;
    }
    const chosenThemes = themes.filter((t) => themeIds.includes(t.id));


    setGenerating(true);
    setGenError(null);
    setCopyDone(false);
    setImagesDone(0);
    setPending(count);

    try {
      const concepts = await generateAdCopy({
        data: {
          analysis,
          productName: subject.name,
          ...(subject.price !== undefined ? { price: subject.price } : {}),
          storeName: subject.source === "shopify" ? store.name : undefined,
          themes: chosenThemes,
          format,
          count,
          variantSeed: batchIndex.current,
        },
      });
      batchIndex.current += 1;
      setCopyDone(true);

      const drafts: Ad[] = concepts.map((concept, i) => ({
        id: `draft-${Date.now()}-${i}`,
        productId: subject.id,
        productName: subject.name,
        platform: platformFor(i),
        format,
        theme: (chosenThemes.find((t) => t.id === concept.theme)?.id ??
          chosenThemes[i % chosenThemes.length]!.id) as ThemeId,
        objective: DEFAULT_OBJECTIVE,
        image: "",
        source: subject.source,
        audience: concept.audience,
        coreIdea: concept.coreIdea,
        headline: concept.headline,
        caption: concept.caption,
        cta: concept.cta,
        ...(concept.overlay?.hero ? { overlay: concept.overlay } : {}),
        favorite: false,
        createdAt: "Just now",
        collectionIds: [],
      }));

      setResults((prev) => [...prev, ...drafts]);
      addAds(drafts);
      spendCredits(concepts.length);
      setPending(concepts.length);
      setGenerating(false);

      await Promise.all(
        drafts.map((draft, i) =>
          renderAndSave(draft, concepts[i]!.imageBrief, subject.dataUrl),
        ),
      );
    } catch (err) {
      setGenError(err instanceof Error ? err.message : "Generation failed.");
      setGenerating(false);
      setPending(0);
    }
  };

  const handleRegenerate = async (ad: Ad) => {
    if (!subject || !analysis) return;
    const chosenThemes = themes.filter((t) => themeIds.includes(t.id));
    try {
      const [concept] = await generateAdCopy({
        data: {
          analysis,
          productName: subject.name,
          ...(subject.price !== undefined ? { price: subject.price } : {}),
          storeName: subject.source === "shopify" ? store.name : undefined,
          themes: chosenThemes.length ? chosenThemes : themes.slice(0, 1),
          format: ad.format,
          count: 1,
          variantSeed: batchIndex.current + 1,
        },
      });
      if (!concept) return;
      batchIndex.current += 1;
      const { path, signedUrl } = await renderAdImage({
        data: {
          imageDataUrl: subject.dataUrl,
          imageBrief: concept.imageBrief,
          productName: subject.name,
          format: ad.format,
          theme: ad.theme,
          ...(concept.overlay?.hero ? { overlay: concept.overlay } : {}),
        },
      });
      const next: Ad = {
        ...ad,
        audience: concept.audience,
        coreIdea: concept.coreIdea,
        headline: concept.headline,
        caption: concept.caption,
        cta: concept.cta,
        ...(concept.overlay?.hero ? { overlay: concept.overlay } : {}),
        image: signedUrl,
        imagePath: path,
      };
      const saved = await saveAd(next);
      setResults((prev) => prev.map((r) => (r.id === ad.id ? saved : r)));
      replaceAd(ad.id, saved);
      spendCredits(1);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not regenerate that concept.");
    }
  };

  return (
    <AppShell
      title={step === 1 ? "Generate Ads that stop the scroll. In seconds." : "Generate Ad"}
      titleGradient={step === 1}
      {...(step === 1 ? {} : { subtitle: "From product to ready-to-run creatives in seconds." })}
    >
      <div className="space-y-7">
        {step === 1 ? (
          <section className="space-y-8">
            <div className="flex justify-center">
              <div
                className="grid w-full max-w-[540px] grid-cols-3 rounded-full border border-border bg-card p-1 shadow-soft"
                role="tablist"
                aria-label="Choose product source"
              >
                {(
                  [
                    { id: "product", label: "Shopify Product", icon: Package },
                    { id: "upload", label: "Upload Image", icon: Upload },
                    { id: "url", label: "Product URL", icon: Link2 },
                  ] as const
                ).map(({ id, label, icon: Icon }) => (
                  <Button
                    key={id}
                    type="button"
                    variant="ghost"
                    size="sm"
                    role="tab"
                    aria-selected={mode === id}
                    onClick={() => setMode(id)}
                    className={cn(
                      "h-10 min-w-0 gap-2 rounded-full px-2 text-xs font-medium transition-all sm:px-4 sm:text-sm",
                      mode === id
                        ? "bg-navy text-navy-foreground shadow-soft hover:bg-navy-soft hover:text-navy-foreground"
                        : "text-foreground hover:bg-muted",
                    )}
                  >
                    <Icon className="h-4 w-4 shrink-0" />
                    <span className="truncate">{label}</span>
                  </Button>
                ))}
              </div>
            </div>

            <div>
              <h2 className="text-xl font-medium text-foreground">Choose Any Product</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Select your Shopify product and generate ads.
              </p>
            </div>

            {mode === "product" ? (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {products.map((product) => (
                  <button
                    key={product.id}
                    disabled={preparing !== null}
                    onClick={() => void pickProduct(product.id)}
                    className={productCardClasses(subject?.id === product.id)}
                  >
                    <ProductCardBody
                      image={product.image}
                      name={product.name}
                      price={product.price}
                      note={product.bestSellerNote}
                      badge={`#${product.rank} Best Seller`}
                      imageOverlay={
                        preparing === product.id ? (
                          <span className="absolute inset-0 flex items-center justify-center bg-navy/40">
                            <Loader2 className="h-6 w-6 animate-spin text-navy-foreground" />
                          </span>
                        ) : null
                      }
                    />
                  </button>
                ))}
              </div>
            ) : mode === "upload" ? (
              <UploadPanel onReady={startUpload} />
            ) : (
              <ProductUrlPanel onReady={startUpload} />
            )}
          </section>
        ) : null}

        {step === 2 && subject ? (
          <section className="space-y-6">
            <div>
              <p className="text-sm text-muted-foreground">
                Select a product from your store inventory to begin.
              </p>
              <h2 className="font-display text-2xl font-semibold">Create a new ad</h2>
            </div>

            <div className="grid gap-6 lg:grid-cols-[minmax(0,2fr)_auto_minmax(280px,1fr)]">
              <div className="space-y-3">
                <h3 className="font-display text-lg font-semibold">Product</h3>
                <ProductPanel
                  subject={subject}
                  analysis={analysis}
                  onAnalysed={setAnalysis}
                  onChangeProduct={() => setStep(1)}
                  onDeleteProduct={() => {
                    setSubject(null);
                    setAnalysis(null);
                    setStep(1);
                  }}
                />
              </div>

              <div className="hidden items-center justify-center pt-16 lg:flex"><span className="flex h-12 w-12 items-center justify-center rounded-full border border-border bg-card shadow-soft"><Plus className="h-5 w-5 text-navy" /></span></div>

              <div className="space-y-3">
                <div className="flex items-baseline justify-between">
                  <h3 className="font-display text-lg font-semibold">Creative Themes</h3>
                  <span className="text-xs text-muted-foreground">
                    {themeIds.length} of 3 chosen
                  </span>
                </div>
                <ThemePicker
                  themeIds={themeIds}
                  onToggle={toggleTheme}
                  onClear={() => setThemeIds([])}
                />
              </div>
            </div>

            {/* One combined toolbar: format, batch size, generate */}
            <div className="card-soft flex flex-col gap-4 p-4 lg:flex-row lg:items-center lg:justify-between">
              <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
                <div className="flex items-center gap-2">
                  <span className="text-xs tracking-[0.14em] text-muted-foreground uppercase">
                    Format
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {formats.map((f) => (
                      <button
                        key={f.id}
                        onClick={() => setFormat(f.id)}
                        className={cn(
                          "rounded-full border px-3 py-1 text-xs transition-colors",
                          format === f.id
                            ? "border-primary bg-gold-soft font-semibold text-navy"
                            : "border-border bg-card text-muted-foreground hover:border-primary/50",
                        )}
                      >
                        {f.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs tracking-[0.14em] text-muted-foreground uppercase">
                    Concepts
                  </span>
                  <div className="flex gap-1.5">
                    {[3, 5, 10].map((n) => (
                      <button
                        key={n}
                        onClick={() => setBatch(n)}
                        className={cn(
                          "h-8 w-9 rounded-full border text-xs font-semibold transition-colors",
                          batch === n
                            ? "border-primary bg-gold-soft text-navy"
                            : "border-border bg-card text-muted-foreground hover:border-primary/50",
                        )}
                      >
                        {n}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <Button
                size="lg"
                className="bg-navy text-navy-foreground hover:bg-navy-soft"
                disabled={generating || !analysis || themeIds.length === 0}
                onClick={() => void runGeneration(batch)}
              >
                <Sparkles className="mr-1 h-4 w-4" />
                {generating ? "Generating…" : "Generate Ad"}
              </Button>
            </div>

            {genError ? (
              <p className="flex items-start gap-2 rounded-xl bg-destructive/10 p-3 text-sm text-destructive">
                <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" /> {genError}
              </p>
            ) : null}

            {generating ? (
              <>
                <GenerationProgress count={batch} copyDone={copyDone} imagesDone={imagesDone} />
                <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
                  {Array.from({ length: batch }, (_, i) => (
                    <AdCardSkeleton key={i} />
                  ))}
                </div>
              </>
            ) : null}

            {results.length > 0 && !generating ? (
              <div className="space-y-5">
                <div className="flex flex-wrap items-end justify-between gap-3">
                  <div>
                    <h3 className="font-display text-xl font-semibold">
                      {results.length} concepts ready
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {pending > 0
                        ? `Still painting ${pending} scene${pending === 1 ? "" : "s"} around your product…`
                        : "Star the ones worth running — they'll show up in your gallery either way."}
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    disabled={pending > 0}
                    onClick={() => void runGeneration(5)}
                  >
                    <Plus className="mr-1 h-4 w-4" /> Generate 5 more
                  </Button>
                </div>
                <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
                  {results.map((ad) => (
                    <AdCard key={ad.id} ad={ad} onRegenerate={handleRegenerate} />
                  ))}
                </div>
              </div>
            ) : null}

            <RecentGenerations />
          </section>
        ) : null}
      </div>
    </AppShell>
  );
}

/* ---------- Recent Ads Generations: real past results, horizontally scrolled ---------- */

function RecentGenerations() {
  const { ads, updateAd } = useStudio();
  const scroller = useRef<HTMLDivElement | null>(null);
  const [editing, setEditing] = useState<Ad | null>(null);
  const [headline, setHeadline] = useState("");
  const [caption, setCaption] = useState("");
  const [cta, setCta] = useState("");

  const recent = ads.filter((a) => a.image).slice(0, 12);
  if (!recent.length) return null;

  const startEdit = (ad: Ad) => {
    setHeadline(ad.headline);
    setCaption(ad.caption);
    setCta(ad.cta);
    setEditing(ad);
  };

  const share = async (ad: Ad) => {
    try {
      await navigator.clipboard.writeText(`${ad.headline}\n\n${ad.caption}\n\n${ad.image}`);
      toast.success("Ad copy and link copied — ready to share.");
    } catch {
      toast.error("Could not copy that ad.");
    }
  };

  return (
    <section className="space-y-4 pt-2">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h3 className="font-display text-xl font-semibold">Recent Ads Generations</h3>
          <p className="text-sm text-muted-foreground">
            The most recent results generated through the app.
          </p>
        </div>
        <Button variant="outline" size="sm" asChild>
          <Link to="/gallery">View All</Link>
        </Button>
      </div>

      <div className="relative">
        <div
          ref={scroller}
          className="flex gap-4 overflow-x-auto scroll-smooth pb-2"
          role="list"
          aria-label="Recent ad generations"
        >
          {recent.map((ad) => (
            <div
              key={ad.id}
              role="listitem"
              className="group card-soft relative w-44 shrink-0 overflow-hidden"
            >
              <img
                src={ad.image}
                alt={ad.headline}
                loading="lazy"
                className="aspect-square w-full object-cover"
              />
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-navy/70 opacity-0 transition-opacity group-hover:opacity-100">
                <div className="flex gap-2">
                  <button
                    aria-label="Edit copy"
                    onClick={() => startEdit(ad)}
                    className="rounded-full bg-card/90 p-2 text-navy transition-colors hover:bg-card"
                  >
                    <Pencil className="h-3.5 w-3.5" />
                  </button>
                  <button
                    aria-label="Download"
                    onClick={() =>
                      void downloadImage(
                        ad.image,
                        `${ad.productName.replace(/\s+/g, "-").toLowerCase()}-ad.png`,
                      ).catch(() => toast.error("Could not download that image."))
                    }
                    className="rounded-full bg-card/90 p-2 text-navy transition-colors hover:bg-card"
                  >
                    <Download className="h-3.5 w-3.5" />
                  </button>
                </div>
                <Button size="sm" onClick={() => void share(ad)}>
                  <Share2 className="mr-1 h-3.5 w-3.5" /> Share
                </Button>
              </div>
              <div className="p-3">
                <p className="truncate text-xs font-semibold">{ad.headline}</p>
                <p className="truncate text-[0.7rem] text-muted-foreground">{ad.productName}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Fade-out edge plus a nudge control */}
        <div className="pointer-events-none absolute top-0 right-0 bottom-2 w-20 bg-gradient-to-l from-background to-transparent" />
        <button
          aria-label="Scroll right"
          onClick={() => scroller.current?.scrollBy({ left: 400, behavior: "smooth" })}
          className="absolute top-1/2 right-2 -translate-y-1/2 rounded-full bg-navy p-2 text-navy-foreground shadow-lift transition-colors hover:bg-navy-soft"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>

      <Dialog open={editing !== null} onOpenChange={(v) => !v && setEditing(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="font-display">Edit ad copy</DialogTitle>
            <DialogDescription>Rewrite the hook, caption or button text.</DialogDescription>
          </DialogHeader>
          <div className="space-y-3">
            <Input value={headline} onChange={(e) => setHeadline(e.target.value)} />
            <Textarea value={caption} rows={4} onChange={(e) => setCaption(e.target.value)} />
            <Input value={cta} onChange={(e) => setCta(e.target.value)} />
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="ghost" onClick={() => setEditing(null)}>
              Cancel
            </Button>
            <Button
              onClick={() => {
                if (editing) updateAd(editing.id, { headline, caption, cta });
                setEditing(null);
                toast.success("Copy updated");
              }}
            >
              Save copy
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </section>
  );
}

