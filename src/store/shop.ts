import { plants } from "@/src/data/plants";
import { CartLine } from "@/src/store/ShopContext";

/** Pure helpers for totals and catalog math (easy to unit test). */

export function calculateCartTotal(cart: CartLine[]) {
  return cart.reduce((acc, line) => acc + line.plant.price * line.quantity, 0);
}

export function calculateCartCount(cart: CartLine[]) {
  return cart.reduce((acc, line) => acc + line.quantity, 0);
}

/** Legacy seed used by older screens/tests during the migration. */
export const initialWishlist = [plants[0], plants[1]];
export const initialCart: CartLine[] = [
  { plant: plants[2], quantity: 1 },
  { plant: plants[4], quantity: 2 },
];

export function cartTotal() {
  return calculateCartTotal(initialCart);
}
