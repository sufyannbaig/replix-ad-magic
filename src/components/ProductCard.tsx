import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type ProductCardProps = {
  image: string;
  name: string;
  price: number;
  note?: string;
  badge?: string;
  selected?: boolean;
  /** Rendered on top of the image, e.g. a loading spinner overlay. */
  imageOverlay?: ReactNode;
  className?: string;
};

/**
 * Shared product layout card: soft grey frame around the product photo with a
 * navy rank pill, and a white detail card beneath. Used on the dashboard and in
 * the Create Ad product picker so every product looks identical.
 */
export function ProductCardBody({
  image,
  name,
  price,
  note,
  badge,
  imageOverlay,
}: Omit<ProductCardProps, "selected" | "className">) {
  return (
    <div className="p-2.5">
      <div className="relative overflow-hidden rounded-2xl bg-muted">
        <img
          src={image}
          alt={name}
          loading="lazy"
          className="aspect-square w-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
        />
        {badge ? (
          <span className="absolute left-4 top-4 rounded-full bg-navy px-3.5 py-1.5 text-xs font-semibold text-navy-foreground shadow-soft">
            {badge}
          </span>
        ) : null}
        {imageOverlay}
      </div>
      <div className="mt-2.5 rounded-2xl bg-card px-5 py-5">
        <p className="text-lg font-medium leading-snug text-foreground">{name}</p>
        <p className="mt-2 text-lg font-medium text-foreground">${price.toFixed(2)}</p>
        {note ? <p className="mt-2 text-sm text-muted-foreground">{note}</p> : null}
      </div>
    </div>
  );
}

export const productCardFrame =
  "group block overflow-hidden rounded-3xl bg-secondary/60 text-left transition-all hover:-translate-y-0.5 hover:shadow-lift";

export function productCardClasses(selected?: boolean, className?: string) {
  return cn(productCardFrame, selected && "ring-2 ring-primary", className);
}
