import { calculateCartCount, calculateCartTotal } from "./shop";
import { plants, searchPlants } from "@/src/data/plants";

describe("shop store helpers", () => {
  it("calculates totals and counts from cart lines", () => {
    const cart = [
      { plant: plants[0], quantity: 2 },
      { plant: plants[1], quantity: 1 },
    ];
    expect(calculateCartCount(cart)).toBe(3);
    expect(calculateCartTotal(cart)).toBeCloseTo(plants[0].price * 2 + plants[1].price);
    expect(calculateCartCount([])).toBe(0);
    expect(calculateCartTotal([])).toBe(0);
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
