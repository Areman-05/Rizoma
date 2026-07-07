import { cartTotal } from "./shop";

describe("shop store helpers", () => {
  it("computes a positive cart total", () => {
    expect(cartTotal()).toBeGreaterThan(0);
  });
});
