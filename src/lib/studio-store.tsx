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
  findPaidPlan,
  seededAds,
  user,
  type Ad,
  type Collection,
  type PlanId,
} from "@/data/studio";
import { fetchStoredAds, patchStoredAd } from "@/lib/ads-repo";

type StudioState = {
  ads: Ad[];
  collections: Collection[];
  creditsUsed: number;
  creditsTotal: number;
  creditsRemaining: number;
  /** Display name of the plan shown as "Current Plan" across the app. */
  planName: string;
  /** Set once a paid plan is active, null while on the free plan. */
  planId: PlanId | null;
  setPlan: (planId: PlanId | null) => void;
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
  const [collections, setCollections] = useState<Collection[]>(seedCollections);
  const [creditsUsed, setCreditsUsed] = useState(seedCredits.used);
  const [planId, setPlanIdState] = useState<PlanId | null>(null);
  const activePlan = planId ? findPaidPlan(planId) ?? null : null;

  // Remember the demo's active plan across reloads, same session-only spirit
  // as the rest of the prototype state.
  useEffect(() => {
    try {
      const saved = window.localStorage.getItem("replix.plan");
      if (saved && findPaidPlan(saved)) setPlanIdState(saved as PlanId);
    } catch {
      /* storage unavailable */
    }
  }, []);

  const setPlan = useCallback((next: PlanId | null) => {
    setPlanIdState(next);
    try {
      if (next) window.localStorage.setItem("replix.plan", next);
      else window.localStorage.removeItem("replix.plan");
    } catch {
      /* storage unavailable */
    }
  }, []);

  // Pull every real generated ad out of the database on first load.
  useEffect(() => {
    let active = true;
    const load = (attempt = 0): void => {
      void fetchStoredAds()
        .then((stored) => {
          if (!active || !stored.length) return;
          setAds((prev) => {
            const known = new Set(prev.map((a) => a.id));
            const fresh = stored.filter((a) => !known.has(a.id));
            return [...fresh, ...prev];
          });
        })
        .catch((error) => {
          if (!active) return;
          // A page navigation can abort the in-flight request; retry once quietly.
          if (attempt === 0) {
            setTimeout(() => active && load(attempt + 1), 800);
            return;
          }
          console.warn("[studio] could not load saved ads", error);
        });
    };
    load();
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

  const addCollection = useCallback((input: Omit<Collection, "id">) => {
    const id = `collection-${Date.now().toString(36)}`;
    setCollections((prev) => [...prev, { ...input, id }]);
    return id;
  }, []);

  const updateCollection = useCallback((id: string, patch: Partial<Omit<Collection, "id">>) => {
    setCollections((prev) => prev.map((c) => (c.id === id ? { ...c, ...patch } : c)));
  }, []);

  const removeCollection = useCallback((id: string) => {
    setCollections((prev) => prev.filter((c) => c.id !== id));
    setAds((prev) =>
      prev.map((a) => {
        if (!a.collectionIds.includes(id)) return a;
        const collectionIds = a.collectionIds.filter((c) => c !== id);
        void patchStoredAd(a.id, { collectionIds });
        return { ...a, collectionIds };
      }),
    );
  }, []);

  const setCollectionAds = useCallback((collectionId: string, adIds: string[]) => {
    setAds((prev) =>
      prev.map((a) => {
        const shouldHave = adIds.includes(a.id);
        const has = a.collectionIds.includes(collectionId);
        if (shouldHave === has) return a;
        const collectionIds = shouldHave
          ? [...a.collectionIds, collectionId]
          : a.collectionIds.filter((c) => c !== collectionId);
        void patchStoredAd(a.id, { collectionIds });
        return { ...a, collectionIds };
      }),
    );
  }, []);

  const creditsTotal = activePlan ? activePlan.credits : seedCredits.total;

  const spendCredits = useCallback(
    (n: number) => setCreditsUsed((prev) => prev + n),
    [],
  );

  const value = useMemo<StudioState>(
    () => ({
      ads,
      collections,
      creditsUsed,
      creditsTotal,
      creditsRemaining: Math.max(0, creditsTotal - creditsUsed),
      planName: activePlan ? activePlan.name : user.plan,
      planId: planId,
      setPlan,
      addAds,
      replaceAd,
      removeAd,
      updateAd,
      toggleFavorite,
      addToCollection,
      addCollection,
      updateCollection,
      removeCollection,
      setCollectionAds,
      spendCredits,
    }),
    [
      ads,
      collections,
      creditsUsed,
      creditsTotal,
      activePlan,
      planId,
      setPlan,
      addAds,
      replaceAd,
      removeAd,
      updateAd,
      toggleFavorite,
      addToCollection,
      addCollection,
      updateCollection,
      removeCollection,
      setCollectionAds,
      spendCredits,
    ],
  );

  return <StudioContext.Provider value={value}>{children}</StudioContext.Provider>;
}

export function useStudio() {
  const ctx = useContext(StudioContext);
  if (!ctx) throw new Error("useStudio must be used inside StudioProvider");
  return ctx;
}
