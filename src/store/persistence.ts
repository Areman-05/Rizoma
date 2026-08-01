import AsyncStorage from "@react-native-async-storage/async-storage";
import { CartLine } from "@/src/store/ShopContext";
import { Plant } from "@/src/types/catalog";
import { Order } from "@/src/types/orders";
import { GardenPlant } from "@/src/types/garden";
import type { ChatPersistedState } from "@/src/data/chat";

const CART_KEY = "rizoma.cart.v1";
const WISHLIST_KEY = "rizoma.wishlist.v1";
const ORDERS_KEY = "rizoma.orders.v1";
const GARDEN_KEY = "rizoma.garden.v1";
const ONBOARDING_KEY = "rizoma.onboarding.v1";
const PROFILE_NAME_KEY = "rizoma.profileName.v1";
const PROFILE_AVATAR_KEY = "rizoma.profileAvatar.v1";
const CHAT_KEY = "@rizoma/chat-threads";

/** Avatar por defecto (Unsplash) hasta que el usuario elija otro. */
export const DEFAULT_PROFILE_AVATAR_URI =
  "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=240";

/** Evita pantallas de carga eternas si AsyncStorage cuelga tras reiniciar el emulador. */
export const STORAGE_LOAD_TIMEOUT_MS = 2500;

export function withStorageTimeout<T>(promise: Promise<T>, fallback: T, ms = STORAGE_LOAD_TIMEOUT_MS): Promise<T> {
  return new Promise((resolve) => {
    let settled = false;
    const finish = (value: T) => {
      if (settled) return;
      settled = true;
      clearTimeout(timer);
      resolve(value);
    };
    const timer = setTimeout(() => finish(fallback), ms);
    promise.then(finish, () => finish(fallback));
  });
}

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

export async function loadProfileAvatar(): Promise<string> {
  try {
    return (await AsyncStorage.getItem(PROFILE_AVATAR_KEY)) ?? DEFAULT_PROFILE_AVATAR_URI;
  } catch {
    return DEFAULT_PROFILE_AVATAR_URI;
  }
}

export async function saveProfileAvatar(uri: string) {
  await AsyncStorage.setItem(PROFILE_AVATAR_KEY, uri);
}

/** Returns null when there is no saved chat data (caller should seed). Empty threads = user cleared history. */
export async function loadChatState(): Promise<ChatPersistedState | null> {
  try {
    const raw = await AsyncStorage.getItem(CHAT_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as ChatPersistedState;
    if (!parsed || !Array.isArray(parsed.threads) || !parsed.messagesByThread || typeof parsed.messagesByThread !== "object") {
      return null;
    }
    return parsed;
  } catch {
    return null;
  }
}

export async function saveChatState(state: ChatPersistedState) {
  await AsyncStorage.setItem(CHAT_KEY, JSON.stringify(state));
}
