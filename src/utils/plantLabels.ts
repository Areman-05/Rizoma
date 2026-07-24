import { PlantDifficulty, PlantLight } from "@/src/types/catalog";

export function lightLabel(light: PlantLight | string): string {
  switch (light) {
    case "low":
      return "Luz baja";
    case "medium":
      return "Luz media";
    case "high":
      return "Luz alta";
    default:
      return light;
  }
}

export function wateringLabel(watering: string): string {
  switch (watering) {
    case "weekly":
      return "Riego semanal";
    case "biweekly":
      return "Riego quincenal";
    case "2x week":
      return "Riego 2x semana";
    case "monthly":
      return "Riego mensual";
    default:
      return watering;
  }
}

export function difficultyLabel(difficulty: PlantDifficulty | string): string {
  switch (difficulty) {
    case "easy":
      return "Fácil";
    case "medium":
      return "Media";
    case "advanced":
      return "Avanzada";
    default:
      return difficulty;
  }
}

export function experienceLabel(experience: string): string {
  switch (experience) {
    case "beginner":
      return "Principiante";
    case "intermediate":
      return "Intermedio";
    case "advanced":
      return "Avanzado";
    default:
      return experience;
  }
}
