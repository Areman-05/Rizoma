import { plants } from "@/src/data/plants";

export const initialWishlist = [plants[0], plants[1]];
export const initialCart = [{ plant: plants[2], quantity: 1 }, { plant: plants[4], quantity: 2 }];

export function cartTotal() {
  return initialCart.reduce((acc, line) => acc + line.plant.price * line.quantity, 0);
}
