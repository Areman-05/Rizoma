import { formatPrice, salePercent } from "./pricing";

describe("pricing helpers", () => {
  it("formats EUR prices with two decimals", () => {
    expect(formatPrice(49.9)).toBe("49.90 EUR");
  });

  it("calculates sale percent from original price", () => {
    expect(salePercent(1200, 1500)).toBe(20);
    expect(salePercent(100, 100)).toBeUndefined();
  });
});
