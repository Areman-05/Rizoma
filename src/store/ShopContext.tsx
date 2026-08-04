import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { Plant } from "@/src/types/catalog";
import { normalizeOrderStatus, Order } from "@/src/types/orders";
import {
  loadOrders,
  loadShopState,
  saveCart,
  saveOrders,
  saveWishlist,
  STORAGE_LOAD_TIMEOUT_MS,
} from "@/src/store/persistence";
import { getPlantById } from "@/src/data/plants";

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
  advanceOrderStatus: (orderId: string) => void;
}

const ShopContext = createContext<ShopContextValue | null>(null);

function refreshPlant(plant: Plant): Plant {
  return getPlantById(plant.id) ?? plant;
}

export function ShopProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartLine[]>([]);
  const [wishlist, setWishlist] = useState<Plant[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [hydrated, setHydrated] = useState(false);
  const [canPersist, setCanPersist] = useState(false);
  const dirtyRef = useRef(false);

  useEffect(() => {
    let cancelled = false;
    const uiTimer = setTimeout(() => {
      if (!cancelled) setHydrated(true);
    }, STORAGE_LOAD_TIMEOUT_MS);

    Promise.all([loadShopState(), loadOrders()])
      .then(([state, savedOrders]) => {
        if (cancelled) return;
        if (!dirtyRef.current) {
          setCart(
            state.cart.map((line) => ({
              ...line,
              plant: refreshPlant(line.plant),
            })),
          );
          setWishlist(state.wishlist.map(refreshPlant));
          setOrders(savedOrders);
        }
        setCanPersist(true);
        setHydrated(true);
      })
      .catch(() => {
        if (cancelled) return;
        setCanPersist(true);
        setHydrated(true);
      })
      .finally(() => {
        clearTimeout(uiTimer);
      });

    return () => {
      cancelled = true;
      clearTimeout(uiTimer);
    };
  }, []);

  useEffect(() => {
    if (!canPersist) return;
    void saveCart(cart);
  }, [cart, canPersist]);

  useEffect(() => {
    if (!canPersist) return;
    void saveWishlist(wishlist);
  }, [wishlist, canPersist]);

  useEffect(() => {
    if (!canPersist) return;
    void saveOrders(orders);
  }, [orders, canPersist]);

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
        dirtyRef.current = true;
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
        dirtyRef.current = true;
        setCart((prev) => prev.filter((line) => line.plant.id !== plantId));
      },
      updateQuantity: (plantId, quantity) => {
        dirtyRef.current = true;
        setCart((prev) =>
          prev
            .map((line) => (line.plant.id === plantId ? { ...line, quantity } : line))
            .filter((line) => line.quantity > 0),
        );
      },
      toggleWishlist: (plant) => {
        dirtyRef.current = true;
        setWishlist((prev) => {
          const exists = prev.some((item) => item.id === plant.id);
          return exists ? prev.filter((item) => item.id !== plant.id) : [...prev, plant];
        });
      },
      isInWishlist: (plantId) => wishlist.some((item) => item.id === plantId),
      clearCart: () => {
        dirtyRef.current = true;
        setCart([]);
      },
      placeOrder: (order) => {
        dirtyRef.current = true;
        setOrders((prev) => [order, ...prev]);
        setCart([]);
      },
      cancelOrder: (orderId) => {
        dirtyRef.current = true;
        setOrders((prev) =>
          prev.map((order) =>
            order.id === orderId && normalizeOrderStatus(order.status) !== "delivered"
              ? { ...order, status: "cancelled" }
              : order,
          ),
        );
      },
      advanceOrderStatus: (orderId) => {
        dirtyRef.current = true;
        const sequence = ["prepared", "shipped", "in_transit", "delivered"] as const;
        setOrders((prev) =>
          prev.map((order) => {
            if (order.id !== orderId) return order;
            const current = normalizeOrderStatus(order.status);
            if (current === "cancelled" || current === "delivered") return order;
            const index = sequence.indexOf(current);
            const next = sequence[Math.min(index + 1, sequence.length - 1)];
            return { ...order, status: next };
          }),
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
