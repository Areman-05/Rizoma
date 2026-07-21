import { Plant, PlantDifficulty, PlantLight } from "@/src/types/catalog";

export interface CatalogFilters {
  light: PlantLight | "all";
  difficulty: PlantDifficulty | "all";
  petFriendly: "all" | "yes" | "no";
  query?: string;
}

export const defaultCatalogFilters: CatalogFilters = {
  light: "all",
  difficulty: "all",
  petFriendly: "all",
};

export function filterPlants(plants: Plant[], filters: CatalogFilters): Plant[] {
  return plants.filter((plant) => {
    if (filters.light !== "all" && plant.light !== filters.light) return false;
    if (filters.difficulty !== "all" && plant.difficulty !== filters.difficulty) return false;
    if (filters.petFriendly === "yes" && !plant.petFriendly) return false;
    if (filters.petFriendly === "no" && plant.petFriendly) return false;
    if (filters.query) {
      const q = filters.query.toLowerCase();
      const haystack = `${plant.name} ${plant.latinName} ${plant.badge ?? ""}`.toLowerCase();
      if (!haystack.includes(q)) return false;
    }
    return true;
  });
}

export function plantsByCategory(plants: Plant[], categoryFilter: string): Plant[] {
  switch (categoryFilter) {
    case "petFriendly":
      return plants.filter((plant) => plant.petFriendly);
    case "lowLight":
      return plants.filter((plant) => plant.light === "low");
    case "easy":
      return plants.filter((plant) => plant.difficulty === "easy");
    case "premium":
      return plants.filter((plant) => plant.badge === "Premium" || plant.price >= 70);
    default:
      return plants;
  }
}
