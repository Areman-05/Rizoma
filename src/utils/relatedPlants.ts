import { plants } from "@/src/data/plants";
import { Plant } from "@/src/types/catalog";

export function getRelatedPlants(plant: Plant, limit = 3): Plant[] {
  return plants
    .filter((item) => item.id !== plant.id)
    .map((item) => {
      let score = 0;
      if (item.light === plant.light) score += 2;
      if (item.petFriendly === plant.petFriendly) score += 2;
      if (item.difficulty === plant.difficulty) score += 1;
      return { item, score };
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((entry) => entry.item);
}
