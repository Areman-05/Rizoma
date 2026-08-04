export type OnboardingSlideId = "boutique" | "criteria" | "ecosystem";

export type OnboardingSlide = {
  id: OnboardingSlideId;
  title: string;
  body: string;
  detail: string;
};

/** Arco: deseo → confianza → retención. */
export const onboardingSlides: OnboardingSlide[] = [
  {
    id: "boutique",
    title: "Plantas premium para tu casa",
    body: "Un catálogo boutique, sin ruido: especies elegidas para hogares urbanos.",
    detail: "Explora con filtros, ratings y precios claros.",
  },
  {
    id: "criteria",
    title: "Elige con criterio",
    body: "Luz, riego y pet-friendly en cada ficha para comprar sin miedo a equivocarte.",
    detail: "Indicadores visibles antes de añadir al carrito.",
  },
  {
    id: "ecosystem",
    title: "Tu jardín, en la app",
    body: "Guarda favoritas en Mi Jardín y descubre especies con el escáner.",
    detail: "Vuelve cuando quieras cuidar o inspirarte.",
  },
];
