import { Link } from "expo-router";
import { Pressable, Text, View } from "react-native";
import { Bell, ChevronRight, HelpCircle, Leaf, ScanLine, Settings, Shield } from "lucide-react-native";
import { Screen } from "@/src/components/ui/Screen";
import { RizomaLogo } from "@/src/components/brand/RizomaLogo";
import { useShop } from "@/src/store/ShopContext";
import { useGarden } from "@/src/store/GardenContext";
import { colors } from "@/src/theme/tokens";
import type { Href } from "expo-router";

const links: { href: Href; label: string; icon: typeof Settings }[] = [
  { href: "/orders", label: "Mis pedidos", icon: Leaf },
  { href: "/notifications", label: "Notificaciones", icon: Bell },
  { href: "/garden", label: "Mi Jardin", icon: Leaf },
  { href: "/match", label: "Plant Match", icon: ScanLine },
  { href: "/scan", label: "Escanear planta", icon: ScanLine },
  { href: "/onboarding", label: "Ayuda / Onboarding", icon: HelpCircle },
  { href: "/login", label: "Cuenta / Login", icon: Settings },
];

export default function ProfileScreen() {
  const { cartCount, wishlist } = useShop();
  const { garden } = useGarden();

  return (
    <Screen scroll>
      <RizomaLogo size="md" />
      <Text className="mt-5 text-2xl text-rizoma-black" style={{ fontFamily: "Inter_700Bold" }}>
        Perfil
      </Text>
      <Text className="mt-1 text-sm text-rizoma-secondaryText" style={{ fontFamily: "Inter_400Regular" }}>
        Gestiona pedidos, preferencias y tu coleccion.
      </Text>

      <View className="mt-5 rounded-3xl bg-rizoma-gray p-4">
        <Text className="text-sm text-rizoma-black" style={{ fontFamily: "Inter_500Medium" }}>
          Carrito: {cartCount} · Wishlist: {wishlist.length} · Jardin: {garden.length}
        </Text>
      </View>

      <View className="mt-5 overflow-hidden rounded-3xl border border-rizoma-border bg-white">
        {links.map((item, index) => {
          const Icon = item.icon;
          return (
            <Link key={String(item.href)} href={item.href} asChild>
              <Pressable
                className={`flex-row items-center px-4 py-4 ${
                  index < links.length - 1 ? "border-b border-rizoma-border" : ""
                }`}
              >
                <Icon size={18} color={colors.brand} />
                <Text className="ml-3 flex-1 text-base text-rizoma-black" style={{ fontFamily: "Inter_500Medium" }}>
                  {item.label}
                </Text>
                <ChevronRight size={18} color={colors.grayText} />
              </Pressable>
            </Link>
          );
        })}
      </View>

      <View className="mt-4 flex-row items-center gap-2 px-1">
        <Shield size={14} color={colors.grayText} />
        <Text className="text-xs text-rizoma-grayText">Privacidad y terminos (demo portfolio)</Text>
      </View>
    </Screen>
  );
}
