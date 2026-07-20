import { Link } from "expo-router";
import { Pressable, Text, View } from "react-native";

const demoOrders = [
  { id: "RZ-1042", status: "Preparando", total: "128.80 EUR", date: "20 Jul 2026" },
  { id: "RZ-1031", status: "Enviado", total: "64.40 EUR", date: "12 Jul 2026" },
  { id: "RZ-1018", status: "Entregado", total: "49.90 EUR", date: "28 Jun 2026" },
];

export default function OrdersScreen() {
  return (
    <View className="flex-1 bg-rizoma-canvas px-5 pt-14">
      <Text className="text-3xl font-bold text-rizoma-primary">Pedidos</Text>
      <Text className="mt-1 text-rizoma-secondaryText">Historial y estado de tus compras Rizoma.</Text>

      <View className="mt-6 gap-3">
        {demoOrders.map((order) => (
          <View key={order.id} className="rounded-3xl bg-white p-5">
            <View className="flex-row items-center justify-between">
              <Text className="font-semibold text-rizoma-primary">{order.id}</Text>
              <Text className="text-sm text-rizoma-accent">{order.status}</Text>
            </View>
            <Text className="mt-2 text-rizoma-secondaryText">{order.date}</Text>
            <Text className="mt-1 text-rizoma-primary">{order.total}</Text>
          </View>
        ))}
      </View>

      <Link href="/(tabs)/profile" asChild>
        <Pressable className="mt-6 rounded-3xl border border-rizoma-border px-5 py-4">
          <Text className="text-center font-medium text-rizoma-primary">Volver al perfil</Text>
        </Pressable>
      </Link>
    </View>
  );
}
