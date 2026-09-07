import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { ArrowLeft, ArrowRight, Check, Loader2, Sparkles, Lightbulb, Plus } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { AdCard } from "@/components/AdCard";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  formats,
  generateConcepts,
  generationSteps,
  objectives,
  products,
  productById,
  themes,
  understandingSteps,
  type Ad,
  type AdFormat,
  type ObjectiveId,
  type ThemeId,
} from "@/data/studio";
import { useStudio } from "@/lib/studio-store";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/create")({
  head: () => ({
    meta: [
      { title: "Create Ad — Replix AI Ad Studio" },
      {
        name: "description",
        content:
          "A four-step ad builder: pick a product, let Replix study it, choose your angle, then generate a batch of creative concepts.",
      },
      { property: "og:title", content: "Create Ad — Replix AI Ad Studio" },
      {
        property: "og:description",
        content: "Study the product, choose an angle, generate a batch of ad concepts.",
      },
    ],
  }),
  component: CreateAd;
});

const stepLabels = [
  "Pick a product",
  "Understanding your product",
  "Choose your angle",
  "Generate",
];

function StepRail({ step }: { step: number }) {
  return (
    <div className="card-soft flex flex-col gap-4 p-5 sm:flex-row sm:items-center">
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
                  ? "bg-success text-navy-foreground"
                  : active
                    ? "bg-gold text-primary-foreground"
                    : "bg-muted text-muted-foreground",
              )}
            >
              {done ? <Check className="h-4 w-4" /> : n}
            </span>
            <span
              className={cn(
                "text-sm",
                active ? "font-semibold text-foreground" : "text-muted-foreground",
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

/* ---------- Step 2: the study moment ---------- */

function UnderstandingStep({
  productId,
  onDone,
  done,
}: {
  productId: string;
  onDone: () => void;
  done: boolean;
}) {
  const product = productById(productId)!;
  const [completed, setCompleted] = useState(done ? understandingSteps.length : 0);
  const [revealed, setRevealed] = useState(done);

  useEffect(() => {
    if (done) return;
    setCompleted(0);
    setRevealed(false);
    const timers: ReturnType<typeof setTimeout>[] = [];
    understandingSteps.forEach((_, i) => {
      timers.push(setTimeout(() => setCompleted(i + 1), 1250 * (i + 1)));
    });
    timers.push(
      setTimeout(
        () => {
          setRevealed(true);
          onDone();
        },
        1250 * understandingSteps.length + 700,
      ),
    );
    return () => timers.forEach(clearTimeout);
  }, [productId, done, onDone]);

  return (
    <div className="grid gap-6 lg:grid-cols-[320px_1fr]">
      <div className="card-soft overflow-hidden">
        <img
          src={product.image}
          alt={product.name}
          className="aspect-square w-full object-cover"
          loading="lazy"
        />
        <div className="p-4">
          <p className="font-display font-semibold">{product.name}</p>
          <p className="text-sm text-muted-foreground">${product.price.toFixed(2)}</p>
        </div>
      </div>

      <div className="space-y-5">
        <div className="rounded-xl bg-navy p-6 text-navy-foreground shadow-lift">
          <p className="text-xs tracking-[0.16em] text-navy-foreground/50 uppercase">
            Studying your product
          </p>
          <ul className="mt-4 space-y-3">
            {understandingSteps.map((label, i) => {
              const isDone = completed > i;
              const isActive = completed === i;
              return (
                <li key={label} className="flex items-center gap-3">
                  <span
                    className={cn(
                      "flex h-7 w-7 items-center justify-center rounded-full transition-all duration-500",
                      isDone
                        ? "scale-100 bg-success text-navy-foreground"
                        : "bg-navy-soft text-navy-foreground/60",
                    )}
                  >
                    {isDone ? (
                      <Check className="h-4 w-4 animate-scale-in" />
                    ) : isActive ? (
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    ) : (
                      <span className="h-1.5 w-1.5 rounded-full bg-current" />
                    )}
                  </span>
                  <span
                    className={cn(
                      "text-sm transition-colors",
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
            className="mt-5 h-1.5 bg-navy-foreground/15"
          />
        </div>

        {revealed ? (
          <div className="card-soft animate-fade-in p-6">
            <div className="flex items-center gap-2">
              <span className="rounded-lg bg-gold-soft p-2 text-navy">
                <Lightbulb className="h-4 w-4" />
              </span>
              <h3 className="font-display text-lg font-semibold">Here's what we found</h3>
            </div>
            <ul className="mt-4 space-y-3">
              {product.insights.map((insight) => (
                <li key={insight} className="flex gap-3 rounded-xl bg-muted/70 p-3">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-success" />
                  <p className="text-sm leading-relaxed">{insight}</p>
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">
            Give us a few seconds — we read the photo, the copy and the review language before we
            write anything.
          </p>
        )}
      </div>
    </div>
  );
}

/* ---------- Step 4: generation ---------- */

function GenerationProgress({ count }: { count: number }) {
  const [stage, setStage] = useState(0);
  useEffect(() => {
    const timers = generationSteps.map((_, i) =>
      setTimeout(() => setStage(i + 1), 900 * (i + 1)),
    );
    return () => timers.forEach(clearTimeout);
  }, []);

  return (
    <div className="card-soft mx-auto max-w-xl p-8 text-center">
      <Loader2 className="mx-auto h-7 w-7 animate-spin text-primary" />
      <h3 className="mt-4 font-display text-lg font-semibold">
        Generating {count} concepts for you
      </h3>
      <ul className="mt-6 space-y-2.5 text-left">
        {generationSteps.map((label, i) => (
          <li key={label} className="flex items-center gap-3 text-sm">
            <span
              className={cn(
                "flex h-6 w-6 items-center justify-center rounded-full",
                stage > i ? "bg-success text-navy-foreground" : "bg-muted text-muted-foreground",
              )}
            >
              {stage > i ? (
                <Check className="h-3.5 w-3.5" />
              ) : (
                <span className="h-1.5 w-1.5 rounded-full bg-current" />
              )}
            </span>
            <span className={stage > i ? "text-foreground" : "text-muted-foreground"}>{label}</span>
          </li>
        ))}
      </ul>
      <Progress value={(stage / generationSteps.length) * 100} className="mt-6 h-2" />
    </div>
  );
}

function CreateAd() {
  const { addAds, replaceAd, spendCredits } = useStudio();
  const [step, setStep] = useState(1);
  const [productId, setProductId] = useState<string | null>(null);
  const [studyDone, setStudyDone] = useState(false);
  const [objective, setObjective] = useState<ObjectiveId | null>(null);
  const [themeIds, setThemeIds] = useState<ThemeId[]>([]);
  const [format, setFormat] = useState<AdFormat>("1:1");
  const [batch, setBatch] = useState(5);
  const [generating, setGenerating] = useState(false);
  const [results, setResults] = useState<Ad[]>([]);
  const generatedCount = useRef(0);

  const pickProduct = (id: string) => {
    setProductId(id);
    setStudyDone(false);
    setStep(2);
  };

  const toggleTheme = (id: ThemeId) =>
    setThemeIds((prev) =>
      prev.includes(id) ? prev.filter((t) => t !== id) : prev.length >= 3 ? prev : [...prev, id],
    );

  const runGeneration = (count: number) => {
    if (!productId || !objective) return;
    setGenerating(true);
    const offset = generatedCount.current;
    setTimeout(() => {
      const batchResults = generateConcepts({
        productId,
        objective,
        themeIds,
        format,
        count,
        offset,
      });
      generatedCount.current = offset + count;
      setResults((prev) => [...prev, ...batchResults]);
      addAds(batchResults);
      spendCredits(count);
      setGenerating(false);
    }, 900 * generationSteps.length + 600);
  };

  const handleRegenerate = (ad: Ad) => {
    if (!productId || !objective) return;
    const offset = generatedCount.current;
    const [next] = generateConcepts({
      productId,
      objective,
      themeIds,
      format,
      count: 1,
      offset: offset + 1,
    });
    if (!next) return;
    generatedCount.current = offset + 1;
    setResults((prev) => prev.map((r) => (r.id === ad.id ? next : r)));
    replaceAd(ad.id, next);
  };

  return (
    <AppShell
      title="Create Ad"
      subtitle="Four steps from product to a batch of ready-to-run creatives"
    >
      <div className="space-y-7">
        <StepRail step={step} />

        {step === 1 ? (
          <section className="space-y-5">
            <div>
              <h2 className="font-display text-xl font-semibold">Pick a product</h2>
              <p className="text-sm text-muted-foreground">
                Pulled live from your store, ranked by best seller.
              </p>
            </div>
            <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
              {products.map((product) => (
                <button
                  key={product.id}
                  onClick={() => pickProduct(product.id)}
                  className={cn(
                    "card-soft overflow-hidden text-left transition-all hover:-translate-y-0.5 hover:shadow-lift",
                    productId === product.id && "ring-2 ring-primary",
                  )}
                >
                  <div className="relative">
                    <img
                      src={product.image}
                      alt={product.name}
                      loading="lazy"
                      className="aspect-square w-full object-cover"
                    />
                    <Badge className="absolute top-3 left-3 bg-navy/85 text-[0.65rem] text-navy-foreground hover:bg-navy">
                      #{product.rank} best seller
                    </Badge>
                  </div>
                  <div className="space-y-1 p-4">
                    <p className="font-display font-semibold">{product.name}</p>
                    <p className="text-sm text-muted-foreground">${product.price.toFixed(2)}</p>
                    <p className="pt-1 text-xs text-muted-foreground">{product.bestSellerNote}</p>
                  </div>
                </button>
              ))}
            </div>
          </section>
        ) : null}

        {step === 2 && productId ? (
          <section className="space-y-5">
            <div>
              <h2 className="font-display text-xl font-semibold">Understanding your product</h2>
              <p className="text-sm text-muted-foreground">
                Before we write a single hook, we look at what you're actually selling.
              </p>
            </div>
            <UnderstandingStep
              productId={productId}
              done={studyDone}
              onDone={() => setStudyDone(true)}
            />
            <div className="flex items-center justify-between">
              <Button variant="ghost" onClick={() => setStep(1)}>
                <ArrowLeft className="mr-1 h-4 w-4" /> Change product
              </Button>
              <Button disabled={!studyDone} onClick={() => setStep(3)}>
                {studyDone ? "Choose your angle" : "Studying…"}
                <ArrowRight className="ml-1 h-4 w-4" />
              </Button>
            </div>
          </section>
        ) : null}

        {step === 3 ? (
          <section className="space-y-7">
            <div>
              <h2 className="font-display text-xl font-semibold">Choose your angle</h2>
              <p className="text-sm text-muted-foreground">
                One campaign objective, up to three creative themes.
              </p>
            </div>

            <div className="space-y-3">
              <p className="text-xs tracking-[0.14em] text-muted-foreground uppercase">
                Campaign objective
              </p>
              <div className="flex flex-wrap gap-3">
                {objectives.map((o) => (
                  <button
                    key={o.id}
                    onClick={() => setObjective(o.id)}
                    className={cn(
                      "rounded-xl border px-4 py-3 text-left transition-colors",
                      objective === o.id
                        ? "border-primary bg-gold-soft"
                        : "border-border bg-card hover:border-primary/50",
                    )}
                  >
                    <p className="text-sm font-semibold">{o.label}</p>
                    <p className="text-xs text-muted-foreground">{o.blurb}</p>
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <p className="text-xs tracking-[0.14em] text-muted-foreground uppercase">
                  Creative themes
                </p>
                <span className="text-xs text-muted-foreground">{themeIds.length} of 3 chosen</span>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                {themes.map((t) => {
                  const selected = themeIds.includes(t.id);
                  return (
                    <button
                      key={t.id}
                      onClick={() => toggleTheme(t.id)}
                      className={cn(
                        "card-soft flex items-start gap-3 p-5 text-left transition-all hover:shadow-lift",
                        selected && "ring-2 ring-primary",
                      )}
                    >
                      <span
                        className={cn(
                          "mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full",
                          selected
                            ? "bg-success text-navy-foreground"
                            : "bg-muted text-muted-foreground",
                        )}
                      >
                        {selected ? <Check className="h-3.5 w-3.5" /> : <Plus className="h-3.5 w-3.5" />}
                      </span>
                      <span>
                        <span className="block font-display font-semibold">{t.label}</span>
                        <span className="text-sm text-muted-foreground">{t.logic}</span>
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="space-y-3">
              <p className="text-xs tracking-[0.14em] text-muted-foreground uppercase">Format</p>
              <div className="flex flex-wrap gap-2">
                {formats.map((f) => (
                  <button
                    key={f.id}
                    onClick={() => setFormat(f.id)}
                    className={cn(
                      "rounded-full border px-4 py-1.5 text-sm transition-colors",
                      format === f.id
                        ? "border-primary bg-gold-soft font-semibold"
                        : "border-border bg-card text-muted-foreground hover:border-primary/50",
                    )}
                  >
                    {f.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-between">
              <Button variant="ghost" onClick={() => setStep(2)}>
                <ArrowLeft className="mr-1 h-4 w-4" /> Back
              </Button>
              <Button disabled={!objective || themeIds.length === 0} onClick={() => setStep(4)}>
                Continue to generate <ArrowRight className="ml-1 h-4 w-4" />
              </Button>
            </div>
          </section>
        ) : null}

        {step === 4 ? (
          <section className="space-y-6">
            {results.length === 0 && !generating ? (
              <div className="card-soft mx-auto max-w-2xl p-7">
                <h2 className="font-display text-xl font-semibold">How many concepts?</h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  We generate more than you need, because the first couple are always warm-ups —
                  pick your favourites and bin the rest.
                </p>
                <div className="mt-5 flex gap-3">
                  {[3, 5, 10].map((n) => (
                    <button
                      key={n}
                      onClick={() => setBatch(n)}
                      className={cn(
                        "flex-1 rounded-xl border px-4 py-4 text-center transition-colors",
                        batch === n
                          ? "border-primary bg-gold-soft"
                          : "border-border bg-card hover:border-primary/50",
                      )}
                    >
                      <span className="block font-display text-2xl font-semibold">{n}</span>
                      <span className="text-xs text-muted-foreground">
                        {n === 3 ? "quick test" : n === 5 ? "recommended" : "full sweep"}
                      </span>
                    </button>
                  ))}
                </div>
                <div className="mt-6 flex items-center justify-between">
                  <Button variant="ghost" onClick={() => setStep(3)}>
                    <ArrowLeft className="mr-1 h-4 w-4" /> Back
                  </Button>
                  <Button size="lg" onClick={() => runGeneration(batch)}>
                    <Sparkles className="mr-1 h-4 w-4" /> Generate {batch} concepts
                  </Button>
                </div>
              </div>
            ) : null}

            {generating ? <GenerationProgress count={batch} /> : null}

            {results.length > 0 && !generating ? (
              <>
                <div className="flex flex-wrap items-end justify-between gap-3">
                  <div>
                    <h2 className="font-display text-xl font-semibold">
                      {results.length} concepts ready
                    </h2>
                    <p className="text-sm text-muted-foreground">
                      Star the ones worth running — they'll show up in your gallery either way.
                    </p>
                  </div>
                  <Button variant="ghost" onClick={() => setStep(3)}>
                    <ArrowLeft className="mr-1 h-4 w-4" /> Change the angle
                  </Button>
                </div>
                <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
                  {results.map((ad) => (
                    <AdCard key={ad.id} ad={ad} onRegenerate={handleRegenerate} />
                  ))}
                </div>
                <div className="flex justify-center">
                  <Button variant="outline" size="lg" onClick={() => runGeneration(5)}>
                    <Plus className="mr-1 h-4 w-4" /> Generate 5 more
                  </Button>
                </div>
              </>
            ) : null}
          </section>
        ) : null}
      </div>
    </AppShell>
  );
}
