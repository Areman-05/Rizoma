import { createContext, ReactNode, useContext, useMemo, useState } from "react";
import { Plant } from "@/src/types/catalog";

export interface GardenPlant {
  plant: Plant;
  nickname?: string;
  wateredAt?: string;
}

interface GardenContextValue {
  garden: GardenPlant[];
  addToGarden: (plant: Plant, nickname?: string) => void;
  removeFromGarden: (plantId: string) => void;
  markWatered: (plantId: string) => void;
}

const GardenContext = createContext<GardenContextValue | null>(null);

export function GardenProvider({ children }: { children: ReactNode }) {
  const [garden, setGarden] = useState<GardenPlant[]>([]);

  const value = useMemo<GardenContextValue>(
    () => ({
      garden,
      addToGarden: (plant, nickname) => {
        setGarden((prev) => {
          if (prev.some((item) => item.plant.id === plant.id)) return prev;
          return [...prev, { plant, nickname, wateredAt: new Date().toISOString() }];
        });
      },
      removeFromGarden: (plantId) => {
        setGarden((prev) => prev.filter((item) => item.plant.id !== plantId));
      },
      markWatered: (plantId) => {
        setGarden((prev) =>
          prev.map((item) =>
            item.plant.id === plantId ? { ...item, wateredAt: new Date().toISOString() } : item,
          ),
        );
      },
    }),
    [garden],
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
