import { Link } from "expo-router";
import { Pressable, Text, View } from "react-native";
import { RizomaLogo } from "@/src/components/brand/RizomaLogo";
import { useShop } from "@/src/store/ShopContext";

export default function ProfileScreen() {
  const { cartCount, wishlist } = useShop();

  return (
    <View className="flex-1 bg-rizoma-canvas px-5 pt-14">
      <RizomaLogo size="md" />
      <Text className="mt-6 text-3xl font-bold text-rizoma-primary">Tu espacio</Text>
      <Text className="mt-1 text-rizoma-secondaryText">Gestiona pedidos, favoritos y preferencias.</Text>

      <View className="mt-6 gap-3 rounded-3xl bg-white p-5">
        <Text className="text-rizoma-primary">Plantas en carrito: {cartCount}</Text>
        <Text className="text-rizoma-primary">Favoritos guardados: {wishlist.length}</Text>
      </View>

      <View className="mt-5 gap-3">
        <Link href="/orders" asChild>
          <Pressable className="rounded-3xl bg-white px-5 py-4">
            <Text className="font-semibold text-rizoma-primary">Mis pedidos</Text>
          </Pressable>
        </Link>
        <Link href="/onboarding" asChild>
          <Pressable className="rounded-3xl bg-white px-5 py-4">
            <Text className="font-semibold text-rizoma-primary">Ver onboarding</Text>
          </Pressable>
        </Link>
        <Link href="/scan" asChild>
          <Pressable className="rounded-3xl bg-white px-5 py-4">
            <Text className="font-semibold text-rizoma-primary">Escanear planta</Text>
          </Pressable>
        </Link>
      </View>
    </View>
  );
}
