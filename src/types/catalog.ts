export type PlantDifficulty = "easy" | "medium" | "advanced";

export type PlantLight = "low" | "medium" | "high";

export interface Plant {
  id: string;
  name: string;
  latinName: string;
  price: number;
  originalPrice?: number;
  rating: number;
  reviewCount: number;
  image: string;
  light: PlantLight;
  watering: string;
  petFriendly: boolean;
  difficulty: PlantDifficulty;
  description: string;
  badge?: string;
  salePercent?: number;
}
