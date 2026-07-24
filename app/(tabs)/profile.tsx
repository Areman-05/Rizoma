import { Link } from "expo-router";
import { useEffect, useState } from "react";
import { Image, Pressable, Text, TextInput, View } from "react-native";
import { Bell, ChevronRight, HelpCircle, Leaf, ScanLine, Settings, Shield } from "lucide-react-native";
import { Screen } from "@/src/components/ui/Screen";
import { RizomaLogo } from "@/src/components/brand/RizomaLogo";
import { useShop } from "@/src/store/ShopContext";
import { useGarden } from "@/src/store/GardenContext";
import { loadProfileName, saveProfileName } from "@/src/store/persistence";
import { colors } from "@/src/theme/tokens";
import type { Href } from "expo-router";

const links: { href: Href; label: string; icon: typeof Settings }[] = [
  { href: "/orders", label: "Mis pedidos", icon: Leaf },
  { href: "/notifications", label: "Notificaciones", icon: Bell },
  { href: "/garden", label: "Mi Jardín", icon: Leaf },
  { href: "/match", label: "Plant Match", icon: ScanLine },
  { href: "/scan", label: "Escanear planta", icon: ScanLine },
  { href: "/onboarding", label: "Ayuda / Onboarding", icon: HelpCircle },
  { href: "/login", label: "Cuenta / Login", icon: Settings },
];

export default function ProfileScreen() {
  const { cartCount, wishlist } = useShop();
  const { garden } = useGarden();
  const [name, setName] = useState("Amante de plantas");
  const [editing, setEditing] = useState(false);

  useEffect(() => {
    loadProfileName().then(setName);
  }, []);

  return (
    <Screen scroll>
      <RizomaLogo size="md" />

      <View className="mt-5 flex-row items-center gap-4">
        <Image
          source={{ uri: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=160" }}
          className="h-16 w-16 rounded-full"
          accessibilityLabel="Avatar de perfil"
        />
        <View className="flex-1">
          {editing ? (
            <TextInput
              value={name}
              onChangeText={setName}
              onBlur={async () => {
                setEditing(false);
                await saveProfileName(name.trim() || "Amante de plantas");
              }}
              autoFocus
              className="rounded-2xl border border-rizoma-border px-3 py-2 text-rizoma-black"
              style={{ fontFamily: "Inter_700Bold", fontSize: 20 }}
            />
          ) : (
            <Pressable onPress={() => setEditing(true)} accessibilityRole="button" accessibilityLabel="Editar nombre">
              <Text className="text-2xl text-rizoma-black" style={{ fontFamily: "Inter_700Bold" }}>
                {name}
              </Text>
              <Text className="mt-1 text-xs text-rizoma-brand" style={{ fontFamily: "Inter_500Medium" }}>
                Toca para editar nombre
              </Text>
            </Pressable>
          )}
        </View>
      </View>

      <Text className="mt-4 text-sm text-rizoma-secondaryText" style={{ fontFamily: "Inter_400Regular" }}>
        Gestiona pedidos, preferencias y tu colección.
      </Text>

      <View className="mt-5 rounded-3xl bg-rizoma-gray p-4">
        <Text className="text-sm text-rizoma-black" style={{ fontFamily: "Inter_500Medium" }}>
          Carrito: {cartCount} · Favoritos: {wishlist.length} · Jardín: {garden.length}
        </Text>
      </View>

      <View className="mt-5 overflow-hidden rounded-3xl border border-rizoma-border bg-white">
        {links.map((item, index) => {
          const Icon = item.icon;
          return (
            <Link key={String(item.href)} href={item.href} asChild>
              <Pressable
                accessibilityRole="button"
                accessibilityLabel={item.label}
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
        <Text className="text-xs text-rizoma-grayText">Privacidad y términos (demo portfolio)</Text>
      </View>
    </Screen>
  );
}
