import AsyncStorage from "@react-native-async-storage/async-storage";
import { plants } from "@/src/data/plants";
import {
  loadOrders,
  loadShopState,
  saveCart,
  saveOrders,
  saveWishlist,
} from "@/src/store/persistence";
import type { Order } from "@/src/types/orders";

jest.mock("@react-native-async-storage/async-storage", () => {
  let store: Record<string, string> = {};
  return {
    __esModule: true,
    default: {
      getItem: jest.fn(async (key: string) => store[key] ?? null),
      setItem: jest.fn(async (key: string, value: string) => {
        store[key] = value;
      }),
      removeItem: jest.fn(async (key: string) => {
        delete store[key];
      }),
      clear: jest.fn(async () => {
        store = {};
      }),
    },
  };
});

describe("shop/orders persistence", () => {
  beforeEach(async () => {
    await AsyncStorage.clear();
    jest.clearAllMocks();
  });

  it("persiste carrito y wishlist", async () => {
    const cart = [{ plant: plants[0], quantity: 2 }];
    const wishlist = [plants[1]];
    await saveCart(cart);
    await saveWishlist(wishlist);
    const state = await loadShopState();
    expect(state.cart).toEqual(cart);
    expect(state.wishlist).toEqual(wishlist);
  });

  it("persiste pedidos", async () => {
    const order: Order = {
      id: "RZ-TEST",
      createdAt: new Date().toISOString(),
      address: "Calle 1",
      delivery: "standard",
      shipping: 0,
      subtotal: 20,
      total: 20,
      status: "prepared",
      lines: [
        {
          plantId: plants[0].id,
          name: plants[0].name,
          image: plants[0].image,
          price: plants[0].price,
          quantity: 1,
        },
      ],
    };
    await saveOrders([order]);
    await expect(loadOrders()).resolves.toEqual([order]);
  });

  it("devuelve vacío si no hay datos", async () => {
    await expect(loadShopState()).resolves.toEqual({ cart: [], wishlist: [] });
    await expect(loadOrders()).resolves.toEqual([]);
  });
});
