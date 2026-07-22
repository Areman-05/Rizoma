import { Image, Text, View } from "react-native";
import { Package, MapPin, Truck } from "lucide-react-native";
import { Screen } from "@/src/components/ui/Screen";
import { ScreenHeader } from "@/src/components/ui/ScreenHeader";
import { RizomaButton } from "@/src/components/ui/RizomaButton";
import { colors } from "@/src/theme/tokens";
import { plants } from "@/src/data/plants";

const steps = [
  { title: "Pedido recibido", time: "Hoy, 09:20", done: true, latest: false },
  { title: "En camino", time: "Hoy, 11:05", done: true, latest: true },
  { title: "Entregado", time: "Pendiente", done: false, latest: false },
];

export default function OrdersScreen() {
  const plant = plants[0];

  return (
    <Screen scroll>
      <ScreenHeader title="Pedidos" />

      <View className="flex-row items-center gap-3 rounded-3xl bg-rizoma-gray p-3">
        <Image source={{ uri: plant.image }} className="h-16 w-16 rounded-2xl bg-white" />
        <View className="flex-1">
          <Text className="text-rizoma-black" style={{ fontFamily: "Inter_700Bold" }}>
            {plant.name}
          </Text>
          <Text className="text-sm text-rizoma-secondaryText">Qty - 1 · {plant.price.toFixed(2)} EUR</Text>
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
                      Latest
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
