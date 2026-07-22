import { Text, View } from "react-native";
import { CreditCard, Percent, Star } from "lucide-react-native";
import { Screen } from "@/src/components/ui/Screen";
import { ScreenHeader } from "@/src/components/ui/ScreenHeader";
import { colors } from "@/src/theme/tokens";

const groups = [
  {
    day: "Hoy",
    items: [
      { icon: Percent, title: "Oferta 60% en interiores", body: "Hot deals activas por tiempo limitado." },
      { icon: CreditCard, title: "Pago confirmado", body: "Tu pedido RZ-1042 se esta preparando." },
    ],
  },
  {
    day: "Ayer",
    items: [{ icon: Star, title: "Nueva coleccion", body: "Descubre plantas statement premium." }],
  },
];

export default function NotificationsScreen() {
  return (
    <Screen scroll>
      <ScreenHeader title="Notificaciones" showBell={false} />
      {groups.map((group) => (
        <View key={group.day} className="mb-5">
          <Text className="mb-3 text-sm text-rizoma-secondaryText" style={{ fontFamily: "Inter_600SemiBold" }}>
            {group.day}
          </Text>
          <View className="gap-3">
            {group.items.map((item) => {
              const Icon = item.icon;
              return (
                <View key={item.title} className="flex-row gap-3 rounded-3xl border border-rizoma-border bg-white p-4">
                  <View className="h-10 w-10 items-center justify-center rounded-full bg-rizoma-brandSoft">
                    <Icon size={18} color={colors.brand} />
                  </View>
                  <View className="flex-1">
                    <Text className="text-rizoma-black" style={{ fontFamily: "Inter_700Bold" }}>
                      {item.title}
                    </Text>
                    <Text className="mt-1 text-sm text-rizoma-secondaryText">{item.body}</Text>
                  </View>
                </View>
              );
            })}
          </View>
        </View>
      ))}
    </Screen>
  );
}
