import { calculateShipping } from "@/src/utils/shipping";

describe("calculateShipping", () => {
  it("makes standard shipping free above threshold", () => {
    expect(calculateShipping(40, "standard")).toBe(0);
    expect(calculateShipping(39.9, "standard")).toBe(4.9);
  });

  it("always charges express shipping", () => {
    expect(calculateShipping(100, "express")).toBe(6.9);
  });
});
