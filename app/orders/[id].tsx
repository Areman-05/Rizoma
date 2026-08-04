import { useEffect, useRef } from "react";
import { Image, Text, View } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { Screen } from "@/src/components/ui/Screen";
import { ScreenHeader } from "@/src/components/ui/ScreenHeader";
import { RizomaButton } from "@/src/components/ui/RizomaButton";
import { EmptyState } from "@/src/components/ui/EmptyState";
import { OrderTrackingTimeline } from "@/src/components/orders/OrderTrackingTimeline";
import { useShop } from "@/src/store/ShopContext";
import {
  ORDER_AUTO_ADVANCE_MS,
  normalizeOrderStatus,
  trackingStepIndex,
} from "@/src/types/orders";
import { formatPrice } from "@/src/utils/pricing";

const paymentLabels = {
  card: "Tarjeta · **** 4242",
  apple_pay: "Apple Pay",
  google_pay: "Google Pay",
  cod: "Contra reembolso",
} as const;

export default function OrderDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const orderId = Array.isArray(id) ? id[0] : id;
  const { orders, cancelOrder, advanceOrderStatus } = useShop();
  const order = orders.find((item) => item.id === orderId);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const status = order ? normalizeOrderStatus(order.status) : null;

  // Auto-avance demo: un paso cada intervalo
  useEffect(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    if (!order) return;

    const current = normalizeOrderStatus(order.status);
    if (current === "cancelled" || current === "delivered") return;

    const idx = trackingStepIndex(order.status);
    const delay = ORDER_AUTO_ADVANCE_MS[idx];
    if (delay == null) return;

    timerRef.current = setTimeout(() => {
      advanceOrderStatus(order.id);
    }, delay);

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [order?.id, order?.status, advanceOrderStatus]);

  if (!order) {
    return (
      <Screen>
        <ScreenHeader title="Pedido" />
        <EmptyState
          title="Pedido no encontrado"
          description="Puede que se haya eliminado o el enlace no sea válido."
          actionLabel="Ver pedidos"
          onActionPress={() => router.replace("/orders")}
        />
      </Screen>
    );
  }

  const canCancel = status !== "cancelled" && status !== "delivered";

  const handleCancel = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    cancelOrder(order.id);
  };

  return (
    <Screen scroll>
      <ScreenHeader title={order.id} />

      <OrderTrackingTimeline status={order.status} express={order.delivery === "express"} />

      <View className="mt-4 rounded-3xl border border-rizoma-border bg-white p-5">
        <Text className="mb-3 text-rizoma-black" style={{ fontFamily: "Inter_700Bold" }}>
          Artículos
        </Text>
        <View className="gap-3">
          {order.lines.map((line) => (
            <View key={line.plantId} className="flex-row items-center gap-3">
              <Image source={{ uri: line.image }} className="h-14 w-14 rounded-2xl bg-rizoma-gray" />
              <View className="flex-1">
                <Text className="text-rizoma-black" style={{ fontFamily: "Inter_600SemiBold" }}>
                  {line.name}
                </Text>
                <Text className="text-sm text-rizoma-secondaryText" style={{ fontFamily: "Inter_400Regular" }}>
                  Cant. {line.quantity} · {formatPrice(line.price * line.quantity)}
                </Text>
              </View>
            </View>
          ))}
        </View>
      </View>

      <View className="mt-4 rounded-3xl border border-rizoma-border bg-rizoma-gray p-5">
        <Text className="text-rizoma-black" style={{ fontFamily: "Inter_700Bold" }}>
          Entrega
        </Text>
        <Text className="mt-2 text-sm text-rizoma-secondaryText" style={{ fontFamily: "Inter_400Regular" }}>
          {order.address}
        </Text>
        <Text className="mt-1 text-sm text-rizoma-secondaryText" style={{ fontFamily: "Inter_400Regular" }}>
          {order.delivery === "express" ? "Express (24-48h)" : "Estándar (3-5 días)"}
        </Text>
        {order.paymentMethod ? (
          <Text className="mt-3 text-sm text-rizoma-black" style={{ fontFamily: "Inter_500Medium" }}>
            Pago: {paymentLabels[order.paymentMethod]}
          </Text>
        ) : null}
        <View className="mt-3 flex-row items-center justify-between border-t border-rizoma-border pt-3">
          <Text className="text-rizoma-black" style={{ fontFamily: "Inter_700Bold" }}>
            Total
          </Text>
          <Text className="text-rizoma-brand" style={{ fontFamily: "Inter_700Bold" }}>
            {formatPrice(order.total)}
          </Text>
        </View>
      </View>

      <View className="mb-4 mt-5 gap-3">
        {canCancel ? (
          <RizomaButton label="Cancelar pedido" variant="danger" onPress={handleCancel} />
        ) : null}
        <RizomaButton label="Seguir comprando" onPress={() => router.push("/(tabs)/explore")} />
        <RizomaButton label="Ver todos los pedidos" variant="secondary" onPress={() => router.push("/orders")} />
      </View>
    </Screen>
  );
}
