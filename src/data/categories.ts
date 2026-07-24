export interface PlantCategory {
  id: string;
  title: string;
  subtitle: string;
  filter: "petFriendly" | "lowLight" | "easy" | "premium" | "all";
}

export const plantCategories: PlantCategory[] = [
  {
    id: "pet-safe",
    title: "Segura mascotas",
    subtitle: "Convive con mascotas",
    filter: "petFriendly",
  },
  {
    id: "low-light",
    title: "Poca luz",
    subtitle: "Rincones suaves",
    filter: "lowLight",
  },
  {
    id: "easy-care",
    title: "Fácil cuidado",
    subtitle: "Para empezar",
    filter: "easy",
  },
  {
    id: "statement",
    title: "Presencia",
    subtitle: "Piezas premium",
    filter: "premium",
  },
];
