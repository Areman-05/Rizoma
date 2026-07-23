export interface OrderLine {
  plantId: string;
  name: string;
  image: string;
  price: number;
  quantity: number;
}

export interface Order {
  id: string;
  createdAt: string;
  address: string;
  delivery: "standard" | "express";
  shipping: number;
  subtotal: number;
  total: number;
  status: "received" | "shipping" | "delivered";
  lines: OrderLine[];
}

export function createOrderId() {
  const suffix = Math.floor(1000 + Math.random() * 9000);
  return `RZ-${suffix}`;
}
