import { createOrderId } from "@/src/types/orders";

describe("createOrderId", () => {
  it("returns RZ order codes", () => {
    expect(createOrderId()).toMatch(/^RZ-\d{4}$/);
  });
});
