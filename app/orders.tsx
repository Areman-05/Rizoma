import { Image, Text, View } from "react-native";
import { Package, MapPin, Truck } from "lucide-react-native";
import { router } from "expo-router";
import { Screen } from "@/src/components/ui/Screen";
import { ScreenHeader } from "@/src/components/ui/ScreenHeader";
import { RizomaButton } from "@/src/components/ui/RizomaButton";
import { EmptyState } from "@/src/components/ui/EmptyState";
import { useShop } from "@/src/store/ShopContext";
import { colors } from "@/src/theme/tokens";
import { formatPrice } from "@/src/utils/pricing";

export default function OrdersScreen() {
  const { orders } = useShop();
  const latest = orders[0];

  if (!latest) {
    return (
      <Screen>
        <ScreenHeader title="Pedidos" />
        <EmptyState
          title="Sin pedidos todavia"
          description="Cuando confirmes un checkout, veras el seguimiento aqui."
          actionLabel="Ir al catalogo"
          onActionPress={() => router.push("/(tabs)/explore")}
        />
      </Screen>
    );
  }

  const line = latest.lines[0];
  const steps = [
    { title: "Pedido recibido", time: "Confirmado", done: true, latest: latest.status === "received" },
    {
      title: "En camino",
      time: latest.delivery === "express" ? "24-48h" : "3-5 dias",
      done: latest.status === "shipping" || latest.status === "delivered",
      latest: latest.status === "shipping",
    },
    { title: "Entregado", time: "Pendiente", done: latest.status === "delivered", latest: false },
  ];

  return (
    <Screen scroll>
      <ScreenHeader title="Pedidos" />

      <Text className="mb-3 text-sm text-rizoma-brand" style={{ fontFamily: "Inter_700Bold" }}>
        {latest.id}
      </Text>

      <View className="flex-row items-center gap-3 rounded-3xl bg-rizoma-gray p-3">
        <Image source={{ uri: line.image }} className="h-16 w-16 rounded-2xl bg-white" />
        <View className="flex-1">
          <Text className="text-rizoma-black" style={{ fontFamily: "Inter_700Bold" }}>
            {line.name}
          </Text>
          <Text className="text-sm text-rizoma-secondaryText">
            Qty - {line.quantity} · {formatPrice(latest.total)}
          </Text>
        </View>
      </View>

      <View className="mt-6 flex-row items-center justify-between px-4">
        <Package size={22} color={colors.brand} />
        <View className="mx-2 h-1 flex-1 rounded-full bg-rizoma-brand" />
        <Truck size={22} color={colors.brand} />
        <View className="mx-2 h-1 flex-1 rounded-full bg-rizoma-gray" />
        <MapPin size={22} color={colors.grayText} />
      </View>

      <View className="mt-6 gap-4">
        {steps.map((step) => (
          <View key={step.title} className="flex-row gap-3">
            <View
              className={`mt-1 h-4 w-4 rounded-full ${step.done ? "bg-rizoma-brand" : "border border-rizoma-border bg-white"}`}
            />
            <View className="flex-1">
              <View className="flex-row items-center gap-2">
                <Text className="text-rizoma-black" style={{ fontFamily: "Inter_700Bold" }}>
                  {step.title}
                </Text>
                {step.latest ? (
                  <View className="rounded-full bg-rizoma-yellow px-2 py-0.5">
                    <Text className="text-[10px] text-rizoma-black" style={{ fontFamily: "Inter_600SemiBold" }}>
                      Actual
                    </Text>
                  </View>
                ) : null}
              </View>
              <Text className="text-xs text-rizoma-secondaryText">{step.time}</Text>
            </View>
          </View>
        ))}
      </View>

      <View className="mt-8">
        <RizomaButton label="Cancelar entrega" variant="primary" onPress={() => {}} />
      </View>
    </Screen>
  );
}
