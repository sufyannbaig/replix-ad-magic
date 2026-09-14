import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  collections as seedCollections,
  credits as seedCredits,
  seededAds,
  type Ad,
  type Collection,
} from "@/data/studio";
import { fetchStoredAds, patchStoredAd } from "@/lib/ads-repo";

type StudioState = {
  ads: Ad[];
  collections: Collection[];
  creditsUsed: number;
  creditsTotal: number;
  creditsRemaining: number;
  addAds: (ads: Ad[]) => void;
  replaceAd: (id: string, next: Ad) => void;
  removeAd: (id: string) => void;
  updateAd: (id: string, patch: Partial<Ad>) => void;
  toggleFavorite: (id: string) => void;
  addToCollection: (adId: string, collectionId: string) => void;
  addCollection: (input: Omit<Collection, "id">) => string;
  updateCollection: (id: string, patch: Partial<Omit<Collection, "id">>) => void;
  removeCollection: (id: string) => void;
  setCollectionAds: (collectionId: string, adIds: string[]) => void;
  spendCredits: (n: number) => void;
};

// Keep one context instance across hot-reloads / duplicate module evaluations,
// otherwise the provider and the consumers can end up on different contexts.
const globalScope = globalThis as typeof globalThis & {
  __replixStudioContext?: React.Context<StudioState | null>;
};
const StudioContext: React.Context<StudioState | null> =
  globalScope.__replixStudioContext ?? createContext<StudioState | null>(null);
globalScope.__replixStudioContext = StudioContext;

export function StudioProvider({ children }: { children: ReactNode }) {
  const [ads, setAds] = useState<Ad[]>(seededAds);
  const [creditsUsed, setCreditsUsed] = useState(seedCredits.used);

  // Pull every real generated ad out of the database on first load.
  useEffect(() => {
    let active = true;
    void fetchStoredAds()
      .then((stored) => {
        if (!active || !stored.length) return;
        setAds((prev) => {
          const known = new Set(prev.map((a) => a.id));
          const fresh = stored.filter((a) => !known.has(a.id));
          return [...fresh, ...prev];
        });
      })
      .catch((error) => console.error("[studio] could not load saved ads", error));
    return () => {
      active = false;
    };
  }, []);

  const addAds = useCallback((next: Ad[]) => setAds((prev) => [...next, ...prev]), []);

  const replaceAd = useCallback(
    (id: string, next: Ad) => setAds((prev) => prev.map((a) => (a.id === id ? next : a))),
    [],
  );

  const removeAd = useCallback(
    (id: string) => setAds((prev) => prev.filter((a) => a.id !== id)),
    [],
  );

  const updateAd = useCallback((id: string, patch: Partial<Ad>) => {
    setAds((prev) => prev.map((a) => (a.id === id ? { ...a, ...patch } : a)));
    void patchStoredAd(id, patch);
  }, []);

  const toggleFavorite = useCallback((id: string) => {
    setAds((prev) => {
      const next = prev.map((a) => (a.id === id ? { ...a, favorite: !a.favorite } : a));
      const updated = next.find((a) => a.id === id);
      if (updated) void patchStoredAd(id, { favorite: updated.favorite });
      return next;
    });
  }, []);

  const addToCollection = useCallback((adId: string, collectionId: string) => {
    setAds((prev) => {
      const next = prev.map((a) =>
        a.id === adId && !a.collectionIds.includes(collectionId)
          ? { ...a, collectionIds: [...a.collectionIds, collectionId] }
          : a,
      );
      const updated = next.find((a) => a.id === adId);
      if (updated) void patchStoredAd(adId, { collectionIds: updated.collectionIds });
      return next;
    });
  }, []);

  const spendCredits = useCallback(
    (n: number) => setCreditsUsed((prev) => Math.min(seedCredits.total, prev + n)),
    [],
  );

  const value = useMemo<StudioState>(
    () => ({
      ads,
      collections: seedCollections,
      creditsUsed,
      creditsTotal: seedCredits.total,
      creditsRemaining: seedCredits.total - creditsUsed,
      addAds,
      replaceAd,
      removeAd,
      updateAd,
      toggleFavorite,
      addToCollection,
      spendCredits,
    }),
    [ads, creditsUsed, addAds, replaceAd, removeAd, updateAd, toggleFavorite, addToCollection, spendCredits],
  );

  return <StudioContext.Provider value={value}>{children}</StudioContext.Provider>;
}

export function useStudio() {
  const ctx = useContext(StudioContext);
  if (!ctx) throw new Error("useStudio must be used inside StudioProvider");
  return ctx;
}
