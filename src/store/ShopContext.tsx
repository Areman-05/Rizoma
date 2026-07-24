import { createContext, ReactNode, useContext, useEffect, useMemo, useState } from "react";
import { Plant } from "@/src/types/catalog";
import { Order } from "@/src/types/orders";
import { loadOrders, loadShopState, saveCart, saveOrders, saveWishlist } from "@/src/store/persistence";

export interface CartLine {
  plant: Plant;
  quantity: number;
}

interface ShopContextValue {
  cart: CartLine[];
  wishlist: Plant[];
  orders: Order[];
  cartCount: number;
  cartTotal: number;
  hydrated: boolean;
  addToCart: (plant: Plant, quantity?: number) => void;
  removeFromCart: (plantId: string) => void;
  updateQuantity: (plantId: string, quantity: number) => void;
  toggleWishlist: (plant: Plant) => void;
  isInWishlist: (plantId: string) => boolean;
  clearCart: () => void;
  placeOrder: (order: Order) => void;
  cancelOrder: (orderId: string) => void;
}

const ShopContext = createContext<ShopContextValue | null>(null);

export function ShopProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartLine[]>([]);
  const [wishlist, setWishlist] = useState<Plant[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    Promise.all([loadShopState(), loadOrders()]).then(([state, savedOrders]) => {
      setCart(state.cart);
      setWishlist(state.wishlist);
      setOrders(savedOrders);
      setHydrated(true);
    });
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    void saveCart(cart);
  }, [cart, hydrated]);

  useEffect(() => {
    if (!hydrated) return;
    void saveWishlist(wishlist);
  }, [wishlist, hydrated]);

  useEffect(() => {
    if (!hydrated) return;
    void saveOrders(orders);
  }, [orders, hydrated]);

  const value = useMemo<ShopContextValue>(() => {
    const cartCount = cart.reduce((sum, line) => sum + line.quantity, 0);
    const cartTotal = cart.reduce((sum, line) => sum + line.plant.price * line.quantity, 0);

    return {
      cart,
      wishlist,
      orders,
      cartCount,
      cartTotal,
      hydrated,
      addToCart: (plant, quantity = 1) => {
        const amount = Math.max(1, quantity);
        setCart((prev) => {
          const existing = prev.find((line) => line.plant.id === plant.id);
          if (existing) {
            return prev.map((line) =>
              line.plant.id === plant.id ? { ...line, quantity: line.quantity + amount } : line,
            );
          }
          return [...prev, { plant, quantity: amount }];
        });
      },
      removeFromCart: (plantId) => {
        setCart((prev) => prev.filter((line) => line.plant.id !== plantId));
      },
      updateQuantity: (plantId, quantity) => {
        setCart((prev) =>
          prev
            .map((line) => (line.plant.id === plantId ? { ...line, quantity } : line))
            .filter((line) => line.quantity > 0),
        );
      },
      toggleWishlist: (plant) => {
        setWishlist((prev) => {
          const exists = prev.some((item) => item.id === plant.id);
          return exists ? prev.filter((item) => item.id !== plant.id) : [...prev, plant];
        });
      },
      isInWishlist: (plantId) => wishlist.some((item) => item.id === plantId),
      clearCart: () => setCart([]),
      placeOrder: (order) => {
        setOrders((prev) => [order, ...prev]);
        setCart([]);
      },
      cancelOrder: (orderId) => {
        setOrders((prev) =>
          prev.map((order) =>
            order.id === orderId && order.status !== "delivered"
              ? { ...order, status: "cancelled" }
              : order,
          ),
        );
      },
    };
  }, [cart, wishlist, orders, hydrated]);

  return <ShopContext.Provider value={value}>{children}</ShopContext.Provider>;
}

export function useShop() {
  const context = useContext(ShopContext);
  if (!context) {
    throw new Error("useShop must be used within ShopProvider");
  }
  return context;
}
