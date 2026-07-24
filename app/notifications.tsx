import { useState } from "react";
import { Pressable, Text, View } from "react-native";
import { CreditCard, Percent, Star } from "lucide-react-native";
import { router } from "expo-router";
import { Screen } from "@/src/components/ui/Screen";
import { ScreenHeader } from "@/src/components/ui/ScreenHeader";
import { EmptyState } from "@/src/components/ui/EmptyState";
import { colors } from "@/src/theme/tokens";

type Notif = {
  id: string;
  icon: typeof Percent;
  title: string;
  body: string;
  href?: "/(tabs)/explore" | "/orders" | "/(tabs)";
  read: boolean;
};

const initialGroups: { day: string; items: Notif[] }[] = [
  {
    day: "Hoy",
    items: [
      {
        id: "n1",
        icon: Percent,
        title: "Oferta 60% en interiores",
        body: "Ofertas top activas por tiempo limitado.",
        href: "/(tabs)/explore",
        read: false,
      },
      {
        id: "n2",
        icon: CreditCard,
        title: "Pago confirmado",
        body: "Tu pedido RZ-1042 se está preparando.",
        href: "/orders",
        read: false,
      },
    ],
  },
  {
    day: "Ayer",
    items: [
      {
        id: "n3",
        icon: Star,
        title: "Nueva colección",
        body: "Descubre plantas statement premium.",
        href: "/(tabs)",
        read: true,
      },
    ],
  },
];

export default function NotificationsScreen() {
  const [groups, setGroups] = useState(initialGroups);
  const hasItems = groups.some((group) => group.items.length > 0);

  if (!hasItems) {
    return (
      <Screen>
        <ScreenHeader title="Notificaciones" showBell={false} />
        <EmptyState
          title="Sin notificaciones"
          description="Aquí verás ofertas, pedidos y novedades del catálogo."
          actionLabel="Ir a inicio"
          onActionPress={() => router.push("/(tabs)")}
        />
      </Screen>
    );
  }

  return (
    <Screen scroll>
      <ScreenHeader title="Notificaciones" showBell={false} />
      <Pressable
        onPress={() =>
          setGroups((prev) =>
            prev.map((group) => ({
              ...group,
              items: group.items.map((item) => ({ ...item, read: true })),
            })),
          )
        }
        className="mb-4 self-end"
        accessibilityRole="button"
        accessibilityLabel="Marcar todas como leídas"
      >
        <Text className="text-sm text-rizoma-brand" style={{ fontFamily: "Inter_600SemiBold" }}>
          Marcar leídas
        </Text>
      </Pressable>

      {groups.map((group) => (
        <View key={group.day} className="mb-5">
          <Text className="mb-3 text-sm text-rizoma-secondaryText" style={{ fontFamily: "Inter_600SemiBold" }}>
            {group.day}
          </Text>
          <View className="gap-3">
            {group.items.map((item) => {
              const Icon = item.icon;
              return (
                <Pressable
                  key={item.id}
                  accessibilityRole="button"
                  accessibilityLabel={item.title}
                  onPress={() => {
                    setGroups((prev) =>
                      prev.map((g) => ({
                        ...g,
                        items: g.items.map((n) => (n.id === item.id ? { ...n, read: true } : n)),
                      })),
                    );
                    if (item.href) router.push(item.href);
                  }}
                  className={`flex-row gap-3 rounded-3xl border p-4 ${item.read ? "border-rizoma-border bg-white" : "border-rizoma-brandSoft bg-rizoma-brandSoft"}`}
                >
                  <View className="h-10 w-10 items-center justify-center rounded-full bg-white">
                    <Icon size={18} color={colors.brand} />
                  </View>
                  <View className="flex-1">
                    <Text className="text-rizoma-black" style={{ fontFamily: "Inter_700Bold" }}>
                      {item.title}
                    </Text>
                    <Text className="mt-1 text-sm text-rizoma-secondaryText">{item.body}</Text>
                  </View>
                </Pressable>
              );
            })}
          </View>
        </View>
      ))}
    </Screen>
  );
}
