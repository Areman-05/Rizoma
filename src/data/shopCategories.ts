export type ShopCategoryId = "indoor" | "outdoor" | "bonsai" | "herbs";

export interface ShopCategory {
  id: ShopCategoryId;
  label: string;
  /** Lucide icon name key used by the home row */
  icon: "Home" | "Sun" | "Trees" | "Leaf";
}

export const shopCategories: ShopCategory[] = [
  { id: "indoor", label: "Interior", icon: "Home" },
  { id: "outdoor", label: "Exterior", icon: "Sun" },
  { id: "bonsai", label: "Bonsai", icon: "Trees" },
  { id: "herbs", label: "Hierbas", icon: "Leaf" },
];

/** Mapeo mock sobre el catálogo actual (sin campo dedicado en Plant). */
const shopCategoryPlantIds: Record<ShopCategoryId, string[]> = {
  indoor: [
    "monstera-deliciosa",
    "calathea-orbifolia",
    "pilea-peperomioides",
    "sansevieria",
    "zamioculca",
    "alocasia-polly",
    "peace-lily",
    "rubber-plant",
    "prayer-plant",
    "chinese-money-plant",
    "philodendron-brasil",
    "aglaonema-silver",
    "calathea-medallion",
    "parlor-palm",
    "zz-plant",
    "anthurium-red",
    "nerve-plant",
    "pothos-neon",
    "dieffenbachia",
  ],
  outdoor: [
    "bird-of-paradise",
    "boston-fern",
    "string-of-pearls",
    "areca-palm",
    "croton-petra",
    "dracaena-marginata",
    "hoya-carnosa",
    "spider-plant",
  ],
  bonsai: ["jade-plant", "ficus-lyrata", "rubber-plant", "dracaena-marginata"],
  herbs: ["oxalis-triangularis", "spider-plant", "peace-lily", "nerve-plant"],
};

export function plantIdsForShopCategory(categoryId: ShopCategoryId): string[] {
  return shopCategoryPlantIds[categoryId] ?? [];
}

export function isShopCategoryId(value: string | undefined): value is ShopCategoryId {
  return value === "indoor" || value === "outdoor" || value === "bonsai" || value === "herbs";
}
