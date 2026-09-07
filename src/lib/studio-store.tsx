import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react";
import {
  collections as seedCollections,
  credits as seedCredits,
  seededAds,
  type Ad,
  type Collection,
} from "@/data/studio";

type StudioState = {
  ads: Ad[];
  collections: Collection[];
  creditsUsed: number;
  creditsTotal: number;
  creditsRemaining: number;
  addAds: (ads: Ad[]) => void;
  replaceAd: (id: string, next: Ad) => void;
  updateAd: (id: string, patch: Partial<Ad>) => void;
  toggleFavorite: (id: string) => void;
  addToCollection: (adId: string, collectionId: string) => void;
  spendCredits: (n: number) => void;
};

const StudioContext = createContext<StudioState | null>(null);

export function StudioProvider({ children }: { children: ReactNode }) {
  const [ads, setAds] = useState<Ad[]>(seededAds);
  const [creditsUsed, setCreditsUsed] = useState(seedCredits.used);

  const addAds = useCallback((next: Ad[]) => setAds((prev) => [...next, ...prev]), []);

  const replaceAd = useCallback(
    (id: string, next: Ad) => setAds((prev) => prev.map((a) => (a.id === id ? next : a))),
    [],
  );

  const updateAd = useCallback(
    (id: string, patch: Partial<Ad>) =>
      setAds((prev) => prev.map((a) => (a.id === id ? { ...a, ...patch } : a))),
    [],
  );

  const toggleFavorite = useCallback(
    (id: string) =>
      setAds((prev) => prev.map((a) => (a.id === id ? { ...a, favorite: !a.favorite } : a))),
    [],
  );

  const addToCollection = useCallback(
    (adId: string, collectionId: string) =>
      setAds((prev) =>
        prev.map((a) =>
          a.id === adId && !a.collectionIds.includes(collectionId)
            ? { ...a, collectionIds: [...a.collectionIds, collectionId] }
            : a,
        ),
      ),
    [],
  );

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
      updateAd,
      toggleFavorite,
      addToCollection,
      spendCredits,
    }),
    [ads, creditsUsed, addAds, replaceAd, updateAd, toggleFavorite, addToCollection, spendCredits],
  );

  return <StudioContext.Provider value={value}>{children}</StudioContext.Provider>;
}

export function useStudio() {
  const ctx = useContext(StudioContext);
  if (!ctx) throw new Error("useStudio must be used inside StudioProvider");
  return ctx;
}
