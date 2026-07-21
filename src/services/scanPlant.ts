import { plants } from "@/src/data/plants";
import { Plant } from "@/src/types/catalog";

export type ConfidenceLevel = "alta" | "media" | "baja";

export interface ScanMatch {
  plant: Plant;
  confidence: number;
  level: ConfidenceLevel;
  reason: string;
}

function toLevel(confidence: number): ConfidenceLevel {
  if (confidence >= 0.8) return "alta";
  if (confidence >= 0.6) return "media";
  return "baja";
}

/** Demo scan engine: returns top-3 catalog matches with transparent confidence. */
export function runPlantScan(seed = Date.now()): ScanMatch[] {
  const offset = seed % plants.length;
  const ranked = [0, 1, 2].map((index) => {
    const plant = plants[(offset + index) % plants.length];
    const confidence = Math.max(0.52, 0.92 - index * 0.14 - ((seed + index) % 7) * 0.01);
    return {
      plant,
      confidence: Number(confidence.toFixed(2)),
      level: toLevel(confidence),
      reason: index === 0 ? "Forma de hoja y venacion cercanas" : "Silueta y porte similares",
    };
  });

  return ranked.sort((a, b) => b.confidence - a.confidence);
}
