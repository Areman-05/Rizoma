import AsyncStorage from "@react-native-async-storage/async-storage";
import { CartLine } from "@/src/store/ShopContext";
import { Plant } from "@/src/types/catalog";

const CART_KEY = "rizoma.cart.v1";
const WISHLIST_KEY = "rizoma.wishlist.v1";

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
