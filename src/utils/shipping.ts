export type DeliveryMethod = "standard" | "express";

export const FREE_SHIPPING_FROM = 40;
export const STANDARD_SHIPPING = 4.9;
export const EXPRESS_SHIPPING = 6.9;

export function calculateShipping(subtotal: number, delivery: DeliveryMethod) {
  if (delivery === "express") return EXPRESS_SHIPPING;
  if (subtotal >= FREE_SHIPPING_FROM) return 0;
  return STANDARD_SHIPPING;
}
