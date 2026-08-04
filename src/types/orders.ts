export interface OrderLine {
  plantId: string;
  name: string;
  image: string;
  price: number;
  quantity: number;
}

/** Flujo de seguimiento Leafy-style. Legacy `received`/`shipping` se normalizan en UI. */
export type OrderStatus =
  | "prepared"
  | "shipped"
  | "in_transit"
  | "delivered"
  | "cancelled"
  | "received"
  | "shipping";

export type PaymentMethod = "card" | "apple_pay" | "google_pay" | "cod";

export interface Order {
  id: string;
  createdAt: string;
  address: string;
  delivery: "standard" | "express";
  shipping: number;
  subtotal: number;
  total: number;
  status: OrderStatus;
  paymentMethod?: PaymentMethod;
  lines: OrderLine[];
}

export const trackingSteps = [
  { id: "prepared" as const, title: "Preparado" },
  { id: "shipped" as const, title: "Enviado" },
  { id: "in_transit" as const, title: "En camino" },
  { id: "delivered" as const, title: "Entregado" },
];

export function normalizeOrderStatus(
  status: OrderStatus,
): "prepared" | "shipped" | "in_transit" | "delivered" | "cancelled" {
  if (status === "received") return "prepared";
  if (status === "shipping") return "in_transit";
  return status;
}

export function trackingStepIndex(status: OrderStatus): number {
  const normalized = normalizeOrderStatus(status);
  if (normalized === "cancelled") return -1;
  return trackingSteps.findIndex((step) => step.id === normalized);
}

export function createOrderId() {
  const time = Date.now().toString(36).toUpperCase();
  const rand = Math.floor(Math.random() * 36 ** 2)
    .toString(36)
    .toUpperCase()
    .padStart(2, "0");
  return `RZ-${time}${rand}`;
}
