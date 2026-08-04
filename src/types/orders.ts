export interface OrderLine {
  plantId: string;
  name: string;
  image: string;
  price: number;
  quantity: number;
}

/** Flujo de seguimiento tipo app de reparto. Legacy `received`/`shipping` se normalizan en UI. */
export type OrderStatus =
  | "prepared"
  | "shipped"
  | "in_transit"
  | "delivered"
  | "cancelled"
  | "received"
  | "shipping";

export type PaymentMethod = "card" | "apple_pay" | "google_pay" | "cod";

export type TrackingStepId = "prepared" | "shipped" | "in_transit" | "delivered";

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

export const trackingSteps: Array<{
  id: TrackingStepId;
  title: string;
  description: string;
}> = [
  {
    id: "prepared",
    title: "Preparando",
    description: "Tu pedido se prepara con cuidado en el vivero Rizoma.",
  },
  {
    id: "shipped",
    title: "Enviado",
    description: "Las plantas ya salieron del almacén hacia tu dirección.",
  },
  {
    id: "in_transit",
    title: "En reparto",
    description: "El repartidor está de camino. ¡Casi listo!",
  },
  {
    id: "delivered",
    title: "Entregado",
    description: "Pedido entregado. ¡Disfruta tu nuevo verde!",
  },
];

/** Intervalos demo entre avances de estado (ms). */
export const ORDER_AUTO_ADVANCE_MS = [8000, 12000, 12000] as const;

export function normalizeOrderStatus(
  status: OrderStatus,
): TrackingStepId | "cancelled" {
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
