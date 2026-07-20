import { createContext, ReactNode, useContext, useMemo, useState } from "react";
import { Plant } from "@/src/types/catalog";

export interface CartLine {
  plant: Plant;
  quantity: number;
}

interface ShopContextValue {
  cart: CartLine[];
  wishlist: Plant[];
  cartCount: number;
  cartTotal: number;
  addToCart: (plant: Plant) => void;
  removeFromCart: (plantId: string) => void;
  updateQuantity: (plantId: string, quantity: number) => void;
  toggleWishlist: (plant: Plant) => void;
  isInWishlist: (plantId: string) => boolean;
  clearCart: () => void;
}

const ShopContext = createContext<ShopContextValue | null>(null);

export function ShopProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartLine[]>([]);
  const [wishlist, setWishlist] = useState<Plant[]>([]);

  const value = useMemo<ShopContextValue>(() => {
    const cartCount = cart.reduce((sum, line) => sum + line.quantity, 0);
    const cartTotal = cart.reduce((sum, line) => sum + line.plant.price * line.quantity, 0);

    return {
      cart,
      wishlist,
      cartCount,
      cartTotal,
      addToCart: (plant) => {
        setCart((prev) => {
          const existing = prev.find((line) => line.plant.id === plant.id);
          if (existing) {
            return prev.map((line) =>
              line.plant.id === plant.id ? { ...line, quantity: line.quantity + 1 } : line,
            );
          }
          return [...prev, { plant, quantity: 1 }];
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
    };
  }, [cart, wishlist]);

  return <ShopContext.Provider value={value}>{children}</ShopContext.Provider>;
}

export function useShop() {
  const context = useContext(ShopContext);
  if (!context) {
    throw new Error("useShop must be used within ShopProvider");
  }
  return context;
}
