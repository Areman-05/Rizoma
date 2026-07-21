import { Plant } from "@/src/types/catalog";
import { plants } from "@/src/data/plants";

export interface HomeProfile {
  light: "low" | "medium" | "high";
  hasPets: boolean;
  experience: "beginner" | "intermediate" | "advanced";
}

export interface PlantMatchResult {
  plant: Plant;
  score: number;
  reasons: string[];
}

export function scorePlantMatch(plant: Plant, profile: HomeProfile): PlantMatchResult {
  let score = 40;
  const reasons: string[] = [];

  if (plant.light === profile.light) {
    score += 25;
    reasons.push("Encaja con tu nivel de luz");
  } else if (
    (profile.light === "low" && plant.light === "medium") ||
    (profile.light === "high" && plant.light === "medium")
  ) {
    score += 10;
    reasons.push("Tolerancia de luz flexible");
  }

  if (profile.hasPets) {
    if (plant.petFriendly) {
      score += 20;
      reasons.push("Segura con mascotas");
    } else {
      score -= 15;
      reasons.push("Requiere cuidado con mascotas");
    }
  }

  if (profile.experience === "beginner" && plant.difficulty === "easy") {
    score += 15;
    reasons.push("Ideal para empezar");
  }
  if (profile.experience === "intermediate" && plant.difficulty !== "advanced") {
    score += 10;
    reasons.push("Nivel de cuidado asumible");
  }
  if (profile.experience === "advanced") {
    score += 8;
    reasons.push("Encaja con experiencia alta");
  }

  return {
    plant,
    score: Math.max(0, Math.min(100, score)),
    reasons,
  };
}

export function rankPlantMatches(profile: HomeProfile, limit = 5): PlantMatchResult[] {
  return plants
    .map((plant) => scorePlantMatch(plant, profile))
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);
}
