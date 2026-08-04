import { CartLine } from "@/src/types/shop";

/** Totales puros del carrito (fáciles de testear). */
export function calculateCartTotal(cart: CartLine[]) {
  return cart.reduce((acc, line) => acc + line.plant.price * line.quantity, 0);
}

export function calculateCartCount(cart: CartLine[]) {
  return cart.reduce((acc, line) => acc + line.quantity, 0);
}
