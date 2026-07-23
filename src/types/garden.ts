import { Plant } from "@/src/types/catalog";

export interface GardenPlant {
  plant: Plant;
  nickname?: string;
  wateredAt?: string;
}
