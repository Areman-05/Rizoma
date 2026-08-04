import {
  createOrderId,
  normalizeOrderStatus,
  trackingStepIndex,
} from "@/src/types/orders";

describe("orders helpers", () => {
  it("crea ids RZ únicos con prefijo", () => {
    const a = createOrderId();
    const b = createOrderId();
    expect(a).toMatch(/^RZ-[A-Z0-9]+$/i);
    expect(b).toMatch(/^RZ-[A-Z0-9]+$/i);
    expect(a).not.toBe(b);
  });

  it("normaliza estados legacy", () => {
    expect(normalizeOrderStatus("received")).toBe("prepared");
    expect(normalizeOrderStatus("shipping")).toBe("in_transit");
    expect(normalizeOrderStatus("shipped")).toBe("shipped");
  });

  it("calcula índice de tracking", () => {
    expect(trackingStepIndex("prepared")).toBe(0);
    expect(trackingStepIndex("delivered")).toBe(3);
    expect(trackingStepIndex("cancelled")).toBe(-1);
    expect(trackingStepIndex("received")).toBe(0);
  });
});
