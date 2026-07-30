import { Plant, PlantReview } from "@/src/types/catalog";

/**
 * Fotos Unsplash verificadas (una distinta por planta).
 * Crop estable + calidad fija para cards y detalle.
 */
function cover(id: string) {
  const photo = id.startsWith("photo-") ? id : `photo-${id}`;
  return `https://images.unsplash.com/${photo}?auto=format&fit=crop&w=800&h=800&q=80`;
}

const catalogSeed: Array<
  Omit<Plant, "rating" | "reviewCount" | "originalPrice" | "salePercent" | "reviews"> & {
    rating?: number;
    reviewCount?: number;
    originalPrice?: number;
  }
> = [
  {
    id: "monstera-deliciosa",
    name: "Costilla de Adán",
    latinName: "Monstera deliciosa",
    price: 49.9,
    image: cover("photo-1614594975525-e45190c55d0b"),
    light: "medium",
    watering: "weekly",
    petFriendly: false,
    difficulty: "easy",
    description: "Planta tropical icónica de hoja abierta, perfecta para salones luminosos.",
    badge: "Más vendida",
  },
  {
    id: "calathea-orbifolia",
    name: "Calatea orbifolia",
    latinName: "Goeppertia orbifolia",
    price: 59.9,
    image: cover("photo-1602879946327-8b4a148c367d"),
    light: "low",
    watering: "2x week",
    petFriendly: true,
    difficulty: "medium",
    description: "Texturas elegantes y segura con mascotas para espacios serenos.",
    badge: "Segura mascotas",
  },
  {
    id: "ficus-lyrata",
    name: "Higuera de hoja de violín",
    latinName: "Ficus lyrata",
    price: 79.9,
    image: cover("photo-1459411552884-841db9b3cc2a"),
    light: "high",
    watering: "weekly",
    petFriendly: false,
    difficulty: "advanced",
    description: "Pieza escultórica premium para rincones amplios y muy luminosos.",
    badge: "Premium",
  },
  {
    id: "pilea-peperomioides",
    name: "Planta del dinero chino",
    latinName: "Pilea peperomioides",
    price: 39.9,
    image: cover("photo-1604762524889-3e2fcc145683"),
    light: "medium",
    watering: "weekly",
    petFriendly: true,
    difficulty: "easy",
    description: "Silueta redonda y minimalista, ideal para estanterías urbanas.",
  },
  {
    id: "sansevieria",
    name: "Lengua de suegra",
    latinName: "Dracaena trifasciata",
    price: 34.9,
    image: cover("photo-1654608904829-3e856604383d"),
    light: "low",
    watering: "biweekly",
    petFriendly: false,
    difficulty: "easy",
    description: "Muy resistente y perfecta si empiezas en el mundo plant lover.",
    badge: "Fácil cuidado",
  },
  {
    id: "zamioculca",
    name: "Zamioculca raven",
    latinName: "Zamioculcas zamiifolia",
    price: 44.9,
    image: cover("photo-1584589167171-541ce45f1eea"),
    light: "low",
    watering: "biweekly",
    petFriendly: false,
    difficulty: "easy",
    description: "Follaje oscuro sofisticado que eleva interiores contemporáneos.",
  },
  {
    id: "alocasia-polly",
    name: "Oreja de elefante",
    latinName: "Alocasia amazonica",
    price: 42.5,
    image: cover("photo-1687682377416-52068eaef061"),
    light: "medium",
    watering: "weekly",
    petFriendly: false,
    difficulty: "medium",
    description: "Hojas esculturales con venas claras: una pieza statement.",
    badge: "Editorial",
  },
  {
    id: "string-of-pearls",
    name: "Collar de perlas",
    latinName: "Senecio rowleyanus",
    price: 28.9,
    image: cover("photo-1694781022851-257e9a963ffe"),
    light: "high",
    watering: "biweekly",
    petFriendly: false,
    difficulty: "medium",
    description: "Cascada de perlas verdes ideal para maceteros suspendidos.",
  },
  {
    id: "peace-lily",
    name: "Lirio de la paz",
    latinName: "Spathiphyllum wallisii",
    price: 36.0,
    image: cover("photo-1770771759998-193f7023faee"),
    light: "low",
    watering: "weekly",
    petFriendly: false,
    difficulty: "easy",
    description: "Floración blanca elegante y gran tolerancia a luz suave.",
  },
  {
    id: "boston-fern",
    name: "Helecho de Boston",
    latinName: "Nephrolepis exaltata",
    price: 31.5,
    image: cover("photo-1512428813834-c702c7702b78"),
    light: "medium",
    watering: "2x week",
    petFriendly: true,
    difficulty: "medium",
    description: "Volumen exuberante y seguro con mascotas para baños húmedos.",
    badge: "Segura mascotas",
  },
  {
    id: "rubber-plant",
    name: "Árbol del caucho",
    latinName: "Ficus elastica",
    price: 54.0,
    image: cover("photo-1501004318641-b39e6451bec6"),
    light: "medium",
    watering: "weekly",
    petFriendly: false,
    difficulty: "easy",
    description: "Hojas brillantes y estructura limpia para loft modernos.",
  },
  {
    id: "prayer-plant",
    name: "Planta de la oración",
    latinName: "Maranta leuconeura",
    price: 33.9,
    image: cover("photo-1485955900006-10f4d324d411"),
    light: "low",
    watering: "2x week",
    petFriendly: true,
    difficulty: "medium",
    description: "Movimiento diario de hojas y patrón gráfico muy fotogénico.",
  },
  {
    id: "bird-of-paradise",
    name: "Ave del paraíso",
    latinName: "Strelitzia nicolai",
    price: 89.0,
    image: cover("photo-1416879595882-3373a0480b5b"),
    light: "high",
    watering: "weekly",
    petFriendly: false,
    difficulty: "advanced",
    description: "Presencia tropical de gran formato para salones abiertos.",
    badge: "Premium",
  },
  {
    id: "chinese-money-plant",
    name: "Pilea mini",
    latinName: "Pilea peperomioides Mini",
    price: 27.5,
    image: cover("photo-1600411832986-5a4477b64a1c"),
    light: "medium",
    watering: "weekly",
    petFriendly: true,
    difficulty: "easy",
    description: "Versión compacta, ideal para escritorios y regalo editorial.",
  },
  {
    id: "spider-plant",
    name: "Cinta o malamadre",
    latinName: "Chlorophytum comosum",
    price: 24.9,
    image: cover("photo-1463936575829-25148e1db1b8"),
    light: "medium",
    watering: "weekly",
    petFriendly: true,
    difficulty: "easy",
    description: "Clásico fresquito, fácil de multiplicar y seguro con mascotas.",
    badge: "Fácil cuidado",
  },
  {
    id: "philodendron-brasil",
    name: "Filodendro Brasil",
    latinName: "Philodendron hederaceum",
    price: 37.0,
    image: cover("photo-1491147334573-44cbb4602074"),
    light: "medium",
    watering: "weekly",
    petFriendly: false,
    difficulty: "easy",
    description: "Enredadera variegada con energía verde lima y crecimiento rápido.",
  },
  {
    id: "aglaonema-silver",
    name: "Aglaonema plateada",
    latinName: "Aglaonema commutatum",
    price: 41.0,
    image: cover("photo-1520412099551-62b6bafeb5bb"),
    light: "low",
    watering: "weekly",
    petFriendly: false,
    difficulty: "easy",
    description: "Follaje plateado que aguanta rincones con poca luz natural.",
  },
  {
    id: "dracaena-marginata",
    name: "Drácena marginata",
    latinName: "Dracaena marginata",
    price: 46.5,
    image: cover("photo-1525279844598-52fd0d3fecc2"),
    light: "medium",
    watering: "biweekly",
    petFriendly: false,
    difficulty: "easy",
    description: "Silueta vertical escultural para esquinas y entradas.",
  },
  {
    id: "hoya-carnosa",
    name: "Flor de cera",
    latinName: "Hoya carnosa",
    price: 35.5,
    image: cover("photo-1751741833089-2586bbe86a58"),
    light: "high",
    watering: "biweekly",
    petFriendly: true,
    difficulty: "medium",
    description: "Hojas cerosas y flores perfumadas para amantes del detalle.",
  },
  {
    id: "calathea-medallion",
    name: "Calatea medallón",
    latinName: "Goeppertia veitchiana",
    price: 48.0,
    image: cover("photo-1466781783364-36c955e42a7f"),
    light: "low",
    watering: "2x week",
    petFriendly: true,
    difficulty: "medium",
    description: "Patrón medallón dramatizado, segura con mascotas y muy visual.",
    badge: "Segura mascotas",
  },
  {
    id: "parlor-palm",
    name: "Palmera de salón",
    latinName: "Chamaedorea elegans",
    price: 38.5,
    image: cover("photo-1608975347712-4c1721c51502"),
    light: "low",
    watering: "weekly",
    petFriendly: true,
    difficulty: "easy",
    description: "Palmera compacta y segura con mascotas para luz suave.",
    badge: "Segura mascotas",
  },
  {
    id: "zz-plant",
    name: "ZZ glamour",
    latinName: "Zamioculcas zamiifolia",
    price: 42.0,
    image: cover("photo-1614594895304-fe7116ac3b58"),
    light: "low",
    watering: "biweekly",
    petFriendly: false,
    difficulty: "easy",
    description: "Arquitectura limpia y altísima tolerancia al olvido de riego.",
    badge: "Fácil cuidado",
  },
  {
    id: "croton-petra",
    name: "Crotón Petra",
    latinName: "Codiaeum variegatum",
    price: 45.5,
    image: cover("photo-1748344640456-e1d2e21a4169"),
    light: "high",
    watering: "weekly",
    petFriendly: false,
    difficulty: "medium",
    description: "Color tropical intenso para espacios muy luminosos.",
  },
  {
    id: "anthurium-red",
    name: "Anturio rojo",
    latinName: "Anthurium andraeanum",
    price: 52.0,
    image: cover("photo-1773809407796-475cb516d7ec"),
    light: "medium",
    watering: "weekly",
    petFriendly: false,
    difficulty: "medium",
    description: "Floración lacada y presencia boutique durante todo el año.",
    badge: "Editorial",
  },
  {
    id: "jade-plant",
    name: "Árbol de jade",
    latinName: "Crassula ovata",
    price: 29.9,
    image: cover("photo-1487530811176-3780de880c2d"),
    light: "high",
    watering: "biweekly",
    petFriendly: false,
    difficulty: "easy",
    description: "Suculenta escultórica de crecimiento lento y gran personalidad.",
  },
  {
    id: "nerve-plant",
    name: "Planta nervio",
    latinName: "Fittonia albivenis",
    price: 22.5,
    image: cover("photo-1518531933037-91b2f5f229cc"),
    light: "low",
    watering: "2x week",
    petFriendly: true,
    difficulty: "medium",
    description: "Venación gráfica y tamaño perfecto para mesitas y estantes.",
  },
  {
    id: "areca-palm",
    name: "Palmera areca",
    latinName: "Dypsis lutescens",
    price: 69.0,
    image: cover("photo-1592150621744-aca64f48394a"),
    light: "high",
    watering: "weekly",
    petFriendly: true,
    difficulty: "medium",
    description: "Volumen tropical seguro con mascotas para salones amplios.",
    badge: "Premium",
  },
  {
    id: "pothos-neon",
    name: "Poto neón",
    latinName: "Epipremnum aureum Neon",
    price: 26.9,
    image: cover("photo-1598880940080-ff9a29891b85"),
    light: "medium",
    watering: "weekly",
    petFriendly: false,
    difficulty: "easy",
    description: "Verde lima eléctrico, ideal para cascadas y principiantes.",
    badge: "Fácil cuidado",
  },
  {
    id: "oxalis-triangularis",
    name: "Trébol púrpura",
    latinName: "Oxalis triangularis",
    price: 27.0,
    image: cover("photo-1722823107288-83d56e4c9853"),
    light: "medium",
    watering: "weekly",
    petFriendly: true,
    difficulty: "easy",
    description: "Hojas geométricas que se pliegan al atardecer, muy fotogénica.",
  },
  {
    id: "dieffenbachia",
    name: "Difenbaquia Camille",
    latinName: "Dieffenbachia seguine",
    price: 40.0,
    image: cover("photo-1470058869958-2a77ade41c02"),
    light: "medium",
    watering: "weekly",
    petFriendly: false,
    difficulty: "easy",
    description: "Variegado crema y verde con presencia suave y crecimiento generoso.",
  },
];

const reviewAuthors = [
  "Laura M.",
  "Carlos R.",
  "Elena P.",
  "Diego S.",
  "María V.",
  "Javier T.",
  "Nuria G.",
  "Álvaro C.",
  "Sofía H.",
  "Pablo N.",
  "Inés L.",
  "Hugo B.",
  "Carmen D.",
  "Mateo F.",
  "Lucía Q.",
  "Andrés W.",
  "Paula K.",
  "Raúl E.",
  "Beatriz O.",
  "Iván Z.",
  "Clara Y.",
  "Sergio U.",
  "Aitana J.",
  "Bruno X.",
  "Valeria I.",
  "Óscar A.",
  "Marta S.",
  "Nicolás P.",
  "Rocío T.",
  "Guillermo V.",
  "Iris C.",
  "Felipe M.",
  "Noelia R.",
  "Tomás G.",
];

const reviewDates = [
  "Hace 1 día",
  "Hace 2 días",
  "Hace 4 días",
  "Hace 1 semana",
  "Hace 10 días",
  "Hace 2 semanas",
  "Hace 3 semanas",
  "Hace 1 mes",
  "Hace 5 semanas",
  "Hace 2 meses",
];

const reviewRatings = [5, 4, 5, 3, 5, 4, 5, 4, 3, 5, 4, 5, 2, 5, 4];

function plantComments(name: string): string[] {
  return [
    `${name}: llegó impecable y se veía exactamente como en la foto.`,
    `Muy contenta con mi ${name}. Ya está aclimatada en el salón.`,
    `Embalaje cuidadoso y planta sana. ${name} venía sin hojas dañadas.`,
    `Bonita, sí, pero esperaba un poco más de tamaño por el precio.`,
    `Fácil de cuidar. ${name} queda genial junto a la ventana.`,
    `Hojas firmes y color vivo. Recomiendo Rizoma sin dudarlo.`,
    `Tardó un día más de lo previsto, pero ${name} llegó perfecta.`,
    `Ideal para principiantes. Riego suave y listo.`,
    `La usé para regalar y fue un acierto total.`,
    `Buen porte, aunque una hoja llegó un poco doblada. Nada grave.`,
    `Calidad boutique de verdad. Se nota en las raíces y el sustrato.`,
    `En dos semanas ya empuja hoja nueva. Muy viva.`,
    `No es la más barata, pero ${name} justifica el precio.`,
    `Perfecta para un rincón con poca luz. Sin drama.`,
    `Detalle: venía con guía de cuidados clara. Se agradece.`,
  ];
}

function buildReviews(plantId: string, plantName: string, index: number, count: number): PlantReview[] {
  const reviews: PlantReview[] = [];
  const comments = plantComments(plantName);
  const shown = Math.min(3, Math.max(2, Math.floor(count / 80)));
  for (let i = 0; i < shown; i += 1) {
    const slot = index * 3 + i * 7;
    reviews.push({
      id: `${plantId}-r${i}`,
      author: reviewAuthors[(slot + plantId.length) % reviewAuthors.length],
      rating: reviewRatings[(slot + i) % reviewRatings.length],
      comment: comments[(slot + i * 2) % comments.length],
      date: reviewDates[(slot + i * 3) % reviewDates.length],
    });
  }
  return reviews;
}

export const plants: Plant[] = catalogSeed.map((item, index) => {
  const originalPrice =
    item.originalPrice ?? (index % 3 === 0 ? Number((item.price * 1.35).toFixed(2)) : undefined);
  const rating = item.rating ?? Number((3.8 + (index % 7) * 0.15).toFixed(1));
  const reviewCount = item.reviewCount ?? 180 + index * 23;
  const salePercent =
    originalPrice && originalPrice > item.price
      ? Math.round(((originalPrice - item.price) / originalPrice) * 100)
      : undefined;

  return {
    ...item,
    originalPrice,
    rating,
    reviewCount,
    salePercent,
    reviews: buildReviews(item.id, item.name, index, reviewCount),
  };
});

export function getPlantById(id?: string) {
  if (!id) return undefined;
  return plants.find((plant) => plant.id === id);
}

export function searchPlants(query: string) {
  const normalized = query.trim().toLowerCase();
  if (!normalized) return plants;
  return plants.filter(
    (plant) =>
      plant.name.toLowerCase().includes(normalized) ||
      plant.latinName.toLowerCase().includes(normalized) ||
      plant.badge?.toLowerCase().includes(normalized),
  );
}
