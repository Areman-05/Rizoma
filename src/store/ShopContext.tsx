import { createContext, ReactNode, useContext, useEffect, useMemo, useState } from "react";
import { Plant } from "@/src/types/catalog";
import { loadShopState, saveCart, saveWishlist } from "@/src/store/persistence";

export interface CartLine {
  plant: Plant;
  quantity: number;
}

interface ShopContextValue {
  cart: CartLine[];
  wishlist: Plant[];
  cartCount: number;
  cartTotal: number;
  hydrated: boolean;
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
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    loadShopState().then((state) => {
      setCart(state.cart);
      setWishlist(state.wishlist);
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

  const value = useMemo<ShopContextValue>(() => {
    const cartCount = cart.reduce((sum, line) => sum + line.quantity, 0);
    const cartTotal = cart.reduce((sum, line) => sum + line.plant.price * line.quantity, 0);

    return {
      cart,
      wishlist,
      cartCount,
      cartTotal,
      hydrated,
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
  }, [cart, wishlist, hydrated]);

  return <ShopContext.Provider value={value}>{children}</ShopContext.Provider>;
}

export function useShop() {
  const context = useContext(ShopContext);
  if (!context) {
    throw new Error("useShop must be used within ShopProvider");
  }
  return context;
}
