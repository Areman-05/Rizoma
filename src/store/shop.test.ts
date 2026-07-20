import { calculateCartCount, calculateCartTotal, cartTotal } from "./shop";
import { plants } from "@/src/data/plants";
import { searchPlants } from "@/src/data/plants";

describe("shop store helpers", () => {
  it("computes a positive cart total from seed data", () => {
    expect(cartTotal()).toBeGreaterThan(0);
  });

  it("calculates totals and counts from cart lines", () => {
    const cart = [
      { plant: plants[0], quantity: 2 },
      { plant: plants[1], quantity: 1 },
    ];
    expect(calculateCartCount(cart)).toBe(3);
    expect(calculateCartTotal(cart)).toBeCloseTo(plants[0].price * 2 + plants[1].price);
  });
});

describe("catalog search", () => {
  it("finds plants by common name", () => {
    const results = searchPlants("monstera");
    expect(results.some((plant) => plant.id === "monstera-deliciosa")).toBe(true);
  });

  it("returns full catalog for empty query", () => {
    expect(searchPlants("").length).toBe(plants.length);
  });
});
