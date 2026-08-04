import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { Plant } from "@/src/types/catalog";
import { GardenPlant } from "@/src/types/garden";
import { loadGarden, saveGarden, STORAGE_LOAD_TIMEOUT_MS } from "@/src/store/persistence";

export type { GardenPlant };

interface GardenContextValue {
  garden: GardenPlant[];
  hydrated: boolean;
  /** `true` si se añadió; `false` si ya estaba. */
  addToGarden: (plant: Plant, nickname?: string) => boolean;
  removeFromGarden: (plantId: string) => void;
  markWatered: (plantId: string) => void;
  isInGarden: (plantId: string) => boolean;
}

const GardenContext = createContext<GardenContextValue | null>(null);

export function GardenProvider({ children }: { children: ReactNode }) {
  const [garden, setGarden] = useState<GardenPlant[]>([]);
  const [hydrated, setHydrated] = useState(false);
  const [canPersist, setCanPersist] = useState(false);
  const dirtyRef = useRef(false);

  useEffect(() => {
    let cancelled = false;
    const uiTimer = setTimeout(() => {
      if (!cancelled) setHydrated(true);
    }, STORAGE_LOAD_TIMEOUT_MS);

    loadGarden()
      .then((saved) => {
        if (cancelled) return;
        if (!dirtyRef.current) setGarden(saved);
        setCanPersist(true);
        setHydrated(true);
      })
      .catch(() => {
        if (cancelled) return;
        setCanPersist(true);
        setHydrated(true);
      })
      .finally(() => {
        clearTimeout(uiTimer);
      });

    return () => {
      cancelled = true;
      clearTimeout(uiTimer);
    };
  }, []);

  useEffect(() => {
    if (!canPersist) return;
    void saveGarden(garden);
  }, [garden, canPersist]);

  const value = useMemo<GardenContextValue>(
    () => ({
      garden,
      hydrated,
      addToGarden: (plant, nickname) => {
        if (garden.some((item) => item.plant.id === plant.id)) return false;
        dirtyRef.current = true;
        setGarden((prev) => {
          if (prev.some((item) => item.plant.id === plant.id)) return prev;
          return [...prev, { plant, nickname, wateredAt: new Date().toISOString() }];
        });
        return true;
      },
      removeFromGarden: (plantId) => {
        dirtyRef.current = true;
        setGarden((prev) => prev.filter((item) => item.plant.id !== plantId));
      },
      markWatered: (plantId) => {
        dirtyRef.current = true;
        setGarden((prev) =>
          prev.map((item) =>
            item.plant.id === plantId ? { ...item, wateredAt: new Date().toISOString() } : item,
          ),
        );
      },
      isInGarden: (plantId) => garden.some((item) => item.plant.id === plantId),
    }),
    [garden, hydrated],
  );

  return <GardenContext.Provider value={value}>{children}</GardenContext.Provider>;
}

export function useGarden() {
  const context = useContext(GardenContext);
  if (!context) {
    throw new Error("useGarden must be used within GardenProvider");
  }
  return context;
}
