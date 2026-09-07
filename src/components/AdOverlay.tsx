import type { Ad, AdOverlay as AdOverlayCopy, ThemeId } from "@/data/studio";
import { cn } from "@/lib/utils";

/**
 * Sell copy rendered as a real HTML/CSS layer on top of the generated image,
 * so it always stays sharp. Each creative theme gets its own layout treatment.
 */

/** Fallback treatment for older ads saved before on-image copy existed. */
function fallbackOverlay(ad: Ad): AdOverlayCopy {
  const theme = ad.theme;
  if (theme === "testimonial") {
    const quoted = ad.headline.trim().startsWith('"') ? ad.headline : `"${ad.headline}"`;
    return { hero: quoted, attribution: "Verified Buyer" };
  }
  if (theme === "stats") {
    const number = ad.headline.match(/\d[\d.,%/]*(\s?out of\s?\d+)?/i)?.[0];
    return number
      ? { hero: number, support: ad.headline.replace(number, "").trim().slice(0, 34), badge: ad.cta }
      : { hero: ad.headline, badge: ad.cta };
  }
  return { hero: ad.headline, badge: ad.cta };
}

const Badge = ({ text, className }: { text: string; className?: string }) => (
  <span
    className={cn(
      "inline-flex items-center rounded-full bg-gold px-2.5 py-1 text-[0.6rem] font-extrabold tracking-[0.14em] text-navy uppercase",
      className,
    )}
  >
    {text}
  </span>
);

export function AdOverlay({ ad }: { ad: Ad }) {
  const copy = ad.overlay?.hero ? ad.overlay : fallbackOverlay(ad);
  const theme: ThemeId = ad.theme;

  if (theme === "stats") {
    return (
      <div className="pointer-events-none absolute inset-x-0 top-0 flex flex-col items-center gap-1 bg-gradient-to-b from-navy/92 via-navy/70 to-transparent px-4 pt-4 pb-10 text-center">
        <span className="font-display text-4xl leading-none font-extrabold text-gold drop-shadow-sm sm:text-5xl">
          {copy.hero}
        </span>
        {copy.support ? (
          <span className="font-display text-[0.72rem] font-bold tracking-[0.16em] text-navy-foreground uppercase">
            {copy.support}
          </span>
        ) : null}
        {copy.badge ? <Badge text={copy.badge} className="mt-1.5" /> : null}
      </div>
    );
  }

  if (theme === "testimonial") {
    return (
      <div className="pointer-events-none absolute inset-x-0 bottom-0 space-y-1.5 bg-gradient-to-t from-navy/95 via-navy/75 to-transparent px-4 pt-12 pb-4">
        <span className="block h-0.5 w-8 bg-gold" />
        <p className="font-display text-[0.95rem] leading-snug font-semibold text-navy-foreground italic">
          {copy.hero}
        </p>
        {copy.attribution ? (
          <p className="text-[0.65rem] font-bold tracking-[0.14em] text-gold uppercase">
            — {copy.attribution}
          </p>
        ) : null}
      </div>
    );
  }

  if (theme === "us-vs-them") {
    return (
      <div className="pointer-events-none absolute inset-x-0 bottom-0">
        <div className="flex items-end justify-between gap-3 bg-gradient-to-t from-navy/95 via-navy/78 to-transparent px-4 pt-12 pb-4">
          <div className="space-y-1">
            <p className="font-display text-lg leading-tight font-extrabold text-navy-foreground uppercase">
              {copy.hero}
            </p>
            {copy.support ? (
              <p className="text-[0.7rem] font-semibold text-gold">{copy.support}</p>
            ) : null}
          </div>
          {copy.badge ? <Badge text={copy.badge} className="shrink-0" /> : null}
        </div>
      </div>
    );
  }

  // showcase
  return (
    <div className="pointer-events-none absolute inset-x-0 bottom-0 space-y-2 bg-gradient-to-t from-navy/95 via-navy/70 to-transparent px-4 pt-12 pb-4">
      <p className="font-display text-xl leading-tight font-extrabold text-navy-foreground uppercase">
        {copy.hero}
      </p>
      {copy.badge ? <Badge text={copy.badge} /> : null}
    </div>
  );
}
