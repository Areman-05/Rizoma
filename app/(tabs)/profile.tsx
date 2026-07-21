import { Link, type Href } from "expo-router";
import { Pressable, Text, View } from "react-native";
import { RizomaLogo } from "@/src/components/brand/RizomaLogo";
import { Screen } from "@/src/components/ui/Screen";
import { useShop } from "@/src/store/ShopContext";
import { useGarden } from "@/src/store/GardenContext";
import { elevation } from "@/src/theme/tokens";

const profileLinks: { href: Href; label: string }[] = [
  { href: "/garden", label: "Mi Jardin" },
  { href: "/match", label: "Plant Match" },
  { href: "/orders", label: "Mis pedidos" },
  { href: "/scan", label: "Escanear planta" },
  { href: "/search", label: "Buscar" },
  { href: "/onboarding", label: "Ver onboarding" },
];

export default function ProfileScreen() {
  const { cartCount, wishlist } = useShop();
  const { garden } = useGarden();

  return (
    <Screen scroll>
      <RizomaLogo size="md" />
      <Text className="mt-6 text-3xl font-bold text-rizoma-primary">Tu espacio</Text>
      <Text className="mt-1 text-rizoma-secondaryText">Gestiona pedidos, jardin y preferencias.</Text>

      <View className="mt-6 gap-2 rounded-3xl bg-white p-5" style={elevation.soft}>
        <Text className="text-rizoma-primary">Plantas en carrito: {cartCount}</Text>
        <Text className="text-rizoma-primary">Favoritos guardados: {wishlist.length}</Text>
        <Text className="text-rizoma-primary">En Mi Jardin: {garden.length}</Text>
      </View>

      <View className="mt-5 gap-3">
        {profileLinks.map((item) => (
          <Link key={String(item.href)} href={item.href} asChild>
            <Pressable className="rounded-3xl bg-white px-5 py-4" style={elevation.soft}>
              <Text className="font-semibold text-rizoma-primary">{item.label}</Text>
            </Pressable>
          </Link>
        ))}
      </View>
    </Screen>
  );
}
