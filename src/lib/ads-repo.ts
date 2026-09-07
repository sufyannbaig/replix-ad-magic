import { supabase } from "@/integrations/supabase/client";
import { signAdImages } from "@/lib/ai.functions";
import type { Ad, AdFormat, AdOverlay, ObjectiveId, Platform, ThemeId } from "@/data/studio";

type Row = {
  id: string;
  created_at: string;
  source: string;
  product_id: string;
  product_name: string;
  platform: string;
  format: string;
  theme: string;
  objective: string;
  image_url: string;
  audience: string;
  core_idea: string;
  headline: string;
  caption: string;
  cta: string;
  overlay: AdOverlay | null;
  favorite: boolean;
  collection_ids: string[];
};

const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });

function toAd(row: Row, signedUrl: string): Ad {
  return {
    id: row.id,
    productId: row.product_id,
    productName: row.product_name,
    platform: row.platform as Platform,
    format: row.format as AdFormat,
    theme: row.theme as ThemeId,
    objective: row.objective as ObjectiveId,
    image: signedUrl,
    imagePath: row.image_url,
    source: row.source,
    audience: row.audience,
    coreIdea: row.core_idea,
    headline: row.headline,
    caption: row.caption,
    cta: row.cta,
    ...(row.overlay ? { overlay: row.overlay } : {}),
    favorite: row.favorite,
    createdAt: formatDate(row.created_at),
    collectionIds: row.collection_ids ?? [],
  };
}

/** Load every persisted generated ad, with fresh signed image links. */
export async function fetchStoredAds(): Promise<Ad[]> {
  const { data, error } = await supabase
    .from("generated_ads")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw new Error(error.message);

  const rows = (data ?? []) as Row[];
  if (!rows.length) return [];

  const urls = await signAdImages({ data: { paths: rows.map((r) => r.image_url) } });
  return rows.map((row) => toAd(row, urls[row.image_url] ?? ""));
}

/** Persist a freshly generated ad and return it with its real database id. */
export async function saveAd(ad: Ad): Promise<Ad> {
  const { data, error } = await supabase
    .from("generated_ads")
    .insert({
      source: ad.source ?? "shopify",
      product_id: ad.productId,
      product_name: ad.productName,
      platform: ad.platform,
      format: ad.format,
      theme: ad.theme,
      objective: ad.objective,
      image_url: ad.imagePath ?? "",
      audience: ad.audience,
      core_idea: ad.coreIdea,
      headline: ad.headline,
      caption: ad.caption,
      cta: ad.cta,
      overlay: ad.overlay ?? null,
      favorite: ad.favorite,
      collection_ids: ad.collectionIds,
    })
    .select("*")
    .single();
  if (error) throw new Error(error.message);
  return { ...toAd(data as Row, ad.image), createdAt: "Just now" };
}

const isStored = (id: string) =>
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);

/** Push copy edits, favourites and collection changes back to the database. */
export async function patchStoredAd(id: string, patch: Partial<Ad>): Promise<void> {
  if (!isStored(id)) return;
  const row: {
    headline?: string;
    caption?: string;
    cta?: string;
    favorite?: boolean;
    collection_ids?: string[];
    image_url?: string;
  } = {};
  if (patch.headline !== undefined) row.headline = patch.headline;
  if (patch.caption !== undefined) row.caption = patch.caption;
  if (patch.cta !== undefined) row.cta = patch.cta;
  if (patch.favorite !== undefined) row.favorite = patch.favorite;
  if (patch.collectionIds !== undefined) row.collection_ids = patch.collectionIds;
  if (patch.imagePath !== undefined) row.image_url = patch.imagePath;
  if (!Object.keys(row).length) return;
  await supabase.from("generated_ads").update(row).eq("id", id);
}
