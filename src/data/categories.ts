export interface PlantCategory {
  id: string;
  title: string;
  subtitle: string;
  filter: "petFriendly" | "lowLight" | "easy" | "premium" | "all";
}

export const plantCategories: PlantCategory[] = [
  {
    id: "pet-safe",
    title: "Pet-safe",
    subtitle: "Convive con mascotas",
    filter: "petFriendly",
  },
  {
    id: "low-light",
    title: "Low light",
    subtitle: "Rincones suaves",
    filter: "lowLight",
  },
  {
    id: "easy-care",
    title: "Easy care",
    subtitle: "Para empezar",
    filter: "easy",
  },
  {
    id: "statement",
    title: "Statement",
    subtitle: "Presencia premium",
    filter: "premium",
  },
];
