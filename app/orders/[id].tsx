import { Image, Text, View } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { MapPin, Package, Truck } from "lucide-react-native";
import { Screen } from "@/src/components/ui/Screen";
import { ScreenHeader } from "@/src/components/ui/ScreenHeader";
import { RizomaButton } from "@/src/components/ui/RizomaButton";
import { EmptyState } from "@/src/components/ui/EmptyState";
import { useShop } from "@/src/store/ShopContext";
import {
  normalizeOrderStatus,
  trackingStepIndex,
  trackingSteps,
} from "@/src/types/orders";
import { formatPrice } from "@/src/utils/pricing";
import { colors } from "@/src/theme/tokens";

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

  const status = normalizeOrderStatus(order.status);
  const stepIndex = trackingStepIndex(order.status);
  const canAdvance = status !== "cancelled" && status !== "delivered";
  const canCancel = status !== "cancelled" && status !== "delivered";

  return (
    <Screen scroll>
      <ScreenHeader title={order.id} />

      <View className="rounded-3xl border border-rizoma-border bg-white p-5">
        <Text className="text-sm text-rizoma-secondaryText" style={{ fontFamily: "Inter_500Medium" }}>
          Seguimiento
        </Text>
        <Text className="mt-1 text-2xl text-rizoma-black" style={{ fontFamily: "Inter_700Bold" }}>
          {status === "cancelled"
            ? "Pedido cancelado"
            : trackingSteps[Math.max(0, stepIndex)]?.title ?? "En proceso"}
        </Text>

        <View className="mt-5 flex-row items-center justify-between px-2">
          <Package size={22} color={stepIndex >= 0 ? colors.brand : colors.grayText} />
          <View
            className={`mx-2 h-1 flex-1 rounded-full ${stepIndex >= 1 ? "bg-rizoma-brand" : "bg-rizoma-gray"}`}
          />
          <Truck size={22} color={stepIndex >= 1 ? colors.brand : colors.grayText} />
          <View
            className={`mx-2 h-1 flex-1 rounded-full ${stepIndex >= 2 ? "bg-rizoma-brand" : "bg-rizoma-gray"}`}
          />
          <MapPin size={22} color={stepIndex >= 3 ? colors.brand : colors.grayText} />
        </View>

        <View className="mt-6 gap-4">
          {trackingSteps.map((step, index) => {
            const done = status !== "cancelled" && index <= stepIndex;
            const latest = status !== "cancelled" && index === stepIndex;
            return (
              <View key={step.id} className="flex-row gap-3">
                <View
                  className={`mt-1 h-4 w-4 rounded-full ${done ? "bg-rizoma-brand" : "border border-rizoma-border bg-white"}`}
                />
                <View className="flex-1">
                  <View className="flex-row items-center gap-2">
                    <Text className="text-rizoma-black" style={{ fontFamily: "Inter_700Bold" }}>
                      {step.title}
                    </Text>
                    {latest ? (
                      <View className="rounded-full bg-rizoma-yellow px-2 py-0.5">
                        <Text className="text-[10px] text-rizoma-black" style={{ fontFamily: "Inter_600SemiBold" }}>
                          Actual
                        </Text>
                      </View>
                    ) : null}
                  </View>
                  <Text className="text-xs text-rizoma-secondaryText" style={{ fontFamily: "Inter_400Regular" }}>
                    {index === 0
                      ? "Pedido listo en vivero"
                      : index === 1
                        ? "Salida del almacén"
                        : index === 2
                          ? order.delivery === "express"
                            ? "24-48h restantes"
                            : "3-5 días restantes"
                          : "En tu dirección"}
                  </Text>
                </View>
              </View>
            );
          })}
        </View>
      </View>

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

      <View className="mt-5 gap-3 mb-4">
        {canAdvance ? (
          <RizomaButton
            label="Avanzar estado (demo)"
            onPress={() => advanceOrderStatus(order.id)}
          />
        ) : null}
        {canCancel ? (
          <RizomaButton
            label="Cancelar pedido"
            variant="danger"
            onPress={() => cancelOrder(order.id)}
          />
        ) : null}
        <RizomaButton label="Seguir comprando" onPress={() => router.push("/(tabs)/explore")} />
      </View>
    </Screen>
  );
}
