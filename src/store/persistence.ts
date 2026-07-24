import AsyncStorage from "@react-native-async-storage/async-storage";
import { CartLine } from "@/src/store/ShopContext";
import { Plant } from "@/src/types/catalog";
import { Order } from "@/src/types/orders";
import { GardenPlant } from "@/src/types/garden";

const CART_KEY = "rizoma.cart.v1";
const WISHLIST_KEY = "rizoma.wishlist.v1";
const ORDERS_KEY = "rizoma.orders.v1";
const GARDEN_KEY = "rizoma.garden.v1";
const ONBOARDING_KEY = "rizoma.onboarding.v1";
const PROFILE_NAME_KEY = "rizoma.profileName.v1";

export async function loadShopState(): Promise<{ cart: CartLine[]; wishlist: Plant[] }> {
  try {
    const [cartRaw, wishlistRaw] = await Promise.all([
      AsyncStorage.getItem(CART_KEY),
      AsyncStorage.getItem(WISHLIST_KEY),
    ]);
    return {
      cart: cartRaw ? (JSON.parse(cartRaw) as CartLine[]) : [],
      wishlist: wishlistRaw ? (JSON.parse(wishlistRaw) as Plant[]) : [],
    };
  } catch {
    return { cart: [], wishlist: [] };
  }
}

export async function saveCart(cart: CartLine[]) {
  await AsyncStorage.setItem(CART_KEY, JSON.stringify(cart));
}

export async function saveWishlist(wishlist: Plant[]) {
  await AsyncStorage.setItem(WISHLIST_KEY, JSON.stringify(wishlist));
}

export async function loadOrders(): Promise<Order[]> {
  try {
    const raw = await AsyncStorage.getItem(ORDERS_KEY);
    return raw ? (JSON.parse(raw) as Order[]) : [];
  } catch {
    return [];
  }
}

export async function saveOrders(orders: Order[]) {
  await AsyncStorage.setItem(ORDERS_KEY, JSON.stringify(orders));
}

export async function loadGarden(): Promise<GardenPlant[]> {
  try {
    const raw = await AsyncStorage.getItem(GARDEN_KEY);
    return raw ? (JSON.parse(raw) as GardenPlant[]) : [];
  } catch {
    return [];
  }
}

export async function saveGarden(garden: GardenPlant[]) {
  await AsyncStorage.setItem(GARDEN_KEY, JSON.stringify(garden));
}

export async function hasCompletedOnboarding(): Promise<boolean> {
  try {
    return (await AsyncStorage.getItem(ONBOARDING_KEY)) === "done";
  } catch {
    return false;
  }
}

export async function markOnboardingDone() {
  await AsyncStorage.setItem(ONBOARDING_KEY, "done");
}

export async function loadProfileName(): Promise<string> {
  try {
    return (await AsyncStorage.getItem(PROFILE_NAME_KEY)) ?? "Amante de plantas";
  } catch {
    return "Amante de plantas";
  }
}

export async function saveProfileName(name: string) {
  await AsyncStorage.setItem(PROFILE_NAME_KEY, name);
}
