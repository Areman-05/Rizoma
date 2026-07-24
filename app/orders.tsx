import { Image, Pressable, Text, View } from "react-native";
import { Package, MapPin, Truck } from "lucide-react-native";
import { router } from "expo-router";
import { Screen } from "@/src/components/ui/Screen";
import { ScreenHeader } from "@/src/components/ui/ScreenHeader";
import { RizomaButton } from "@/src/components/ui/RizomaButton";
import { EmptyState } from "@/src/components/ui/EmptyState";
import { useShop } from "@/src/store/ShopContext";
import { Order } from "@/src/types/orders";
import { colors } from "@/src/theme/tokens";
import { formatPrice } from "@/src/utils/pricing";

function OrderCard({ order, onCancel }: { order: Order; onCancel: () => void }) {
  const line = order.lines[0];
  const steps = [
    {
      title: "Pedido recibido",
      time: "Confirmado",
      done: true,
      latest: order.status === "received",
    },
    {
      title: "En camino",
      time: order.delivery === "express" ? "24-48h" : "3-5 días",
      done: order.status === "shipping" || order.status === "delivered",
      latest: order.status === "shipping",
    },
    {
      title: order.status === "cancelled" ? "Cancelado" : "Entregado",
      time: order.status === "cancelled" ? "Pedido anulado" : "Pendiente",
      done: order.status === "delivered" || order.status === "cancelled",
      latest: order.status === "cancelled",
    },
  ];

  return (
    <View className="mb-8 rounded-3xl border border-rizoma-border bg-white p-4">
      <Text className="mb-3 text-sm text-rizoma-brand" style={{ fontFamily: "Inter_700Bold" }}>
        {order.id}
      </Text>

      <View className="flex-row items-center gap-3 rounded-3xl bg-rizoma-gray p-3">
        <Image source={{ uri: line.image }} className="h-16 w-16 rounded-2xl bg-white" />
        <View className="flex-1">
          <Text className="text-rizoma-black" style={{ fontFamily: "Inter_700Bold" }}>
            {line.name}
          </Text>
          <Text className="text-sm text-rizoma-secondaryText">
            Cant. {line.quantity} · {formatPrice(order.total)}
          </Text>
        </View>
      </View>

      <View className="mt-6 flex-row items-center justify-between px-4">
        <Package size={22} color={colors.brand} />
        <View className="mx-2 h-1 flex-1 rounded-full bg-rizoma-brand" />
        <Truck size={22} color={order.status === "cancelled" ? colors.grayText : colors.brand} />
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

      {order.status !== "cancelled" && order.status !== "delivered" ? (
        <View className="mt-6">
          <RizomaButton label="Cancelar entrega" variant="danger" onPress={onCancel} />
        </View>
      ) : null}
    </View>
  );
}

export default function OrdersScreen() {
  const { orders, cancelOrder } = useShop();

  if (orders.length === 0) {
    return (
      <Screen>
        <ScreenHeader title="Pedidos" />
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
      <ScreenHeader title="Pedidos" />
      {orders.map((order) => (
        <OrderCard key={order.id} order={order} onCancel={() => cancelOrder(order.id)} />
      ))}
      <Pressable onPress={() => router.push("/(tabs)/explore")} className="mb-4 py-2">
        <Text className="text-center text-sm text-rizoma-brand" style={{ fontFamily: "Inter_600SemiBold" }}>
          Seguir comprando
        </Text>
      </Pressable>
    </Screen>
  );
}
