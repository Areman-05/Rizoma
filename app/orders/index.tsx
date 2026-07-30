import { Image, Pressable, Text, View } from "react-native";
import { Package } from "lucide-react-native";
import { router } from "expo-router";
import { Screen } from "@/src/components/ui/Screen";
import { ScreenHeader } from "@/src/components/ui/ScreenHeader";
import { EmptyState } from "@/src/components/ui/EmptyState";
import { useShop } from "@/src/store/ShopContext";
import {
  normalizeOrderStatus,
  Order,
  trackingStepIndex,
  trackingSteps,
} from "@/src/types/orders";
import { formatPrice } from "@/src/utils/pricing";
import { colors } from "@/src/theme/tokens";

function statusLabel(order: Order) {
  const status = normalizeOrderStatus(order.status);
  if (status === "cancelled") return "Cancelado";
  const step = trackingSteps.find((item) => item.id === status);
  return step?.title ?? "En proceso";
}

function OrderCard({ order }: { order: Order }) {
  const line = order.lines[0];
  const status = normalizeOrderStatus(order.status);
  const stepIndex = trackingStepIndex(order.status);
  const extraCount = order.lines.length - 1;

  return (
    <Pressable
      onPress={() => router.push(`/orders/${order.id}`)}
      className="mb-4 rounded-3xl border border-rizoma-border bg-white p-4"
      accessibilityRole="button"
      accessibilityLabel={`Pedido ${order.id}`}
    >
      <View className="mb-3 flex-row items-center justify-between">
        <Text className="text-sm text-rizoma-brand" style={{ fontFamily: "Inter_700Bold" }}>
          {order.id}
        </Text>
        <View
          className={`rounded-full px-2.5 py-1 ${status === "cancelled" ? "bg-rizoma-gray" : "bg-rizoma-brandSoft"}`}
        >
          <Text
            className={`text-[11px] ${status === "cancelled" ? "text-rizoma-secondaryText" : "text-rizoma-brand"}`}
            style={{ fontFamily: "Inter_600SemiBold" }}
          >
            {statusLabel(order)}
          </Text>
        </View>
      </View>

      <View className="flex-row items-center gap-3 rounded-3xl bg-rizoma-gray p-3">
        <Image source={{ uri: line.image }} className="h-16 w-16 rounded-2xl bg-white" />
        <View className="flex-1">
          <Text className="text-rizoma-black" style={{ fontFamily: "Inter_700Bold" }} numberOfLines={1}>
            {line.name}
            {extraCount > 0 ? ` +${extraCount}` : ""}
          </Text>
          <Text className="mt-0.5 text-sm text-rizoma-secondaryText" style={{ fontFamily: "Inter_400Regular" }}>
            {formatPrice(order.total)} · {order.delivery === "express" ? "Express" : "Estándar"}
          </Text>
        </View>
        <Package size={18} color={colors.brand} />
      </View>

      {status !== "cancelled" ? (
        <View className="mt-4 flex-row gap-1.5">
          {trackingSteps.map((step, index) => (
            <View
              key={step.id}
              className={`h-1.5 flex-1 rounded-full ${index <= stepIndex ? "bg-rizoma-brand" : "bg-rizoma-gray"}`}
            />
          ))}
        </View>
      ) : null}
    </Pressable>
  );
}

export default function OrdersScreen() {
  const { orders } = useShop();

  if (orders.length === 0) {
    return (
      <Screen>
        <ScreenHeader title="Mis pedidos" />
        <EmptyState
          title="Sin pedidos todavía"
          description="Cuando confirmes un checkout, verás el seguimiento aquí."
          actionLabel="Ir al catálogo"
          onActionPress={() => router.push("/(tabs)/explore")}
        />
      </Screen>
    );
  }

  return (
    <Screen scroll>
      <ScreenHeader title="Mis pedidos" />
      {orders.map((order) => (
        <OrderCard key={order.id} order={order} />
      ))}
      <Pressable onPress={() => router.push("/(tabs)/explore")} className="mb-4 py-2">
        <Text className="text-center text-sm text-rizoma-brand" style={{ fontFamily: "Inter_600SemiBold" }}>
          Seguir comprando
        </Text>
      </Pressable>
    </Screen>
  );
}
