import { Text, View } from "react-native";
import { cartTotal, initialCart } from "@/src/store/shop";
import { RizomaButton } from "@/src/components/ui/RizomaButton";

export default function CartScreen() {
  return (
    <View className="flex-1 bg-rizoma-canvas px-5 pt-14">
      <Text className="text-3xl font-bold text-rizoma-primary">Carrito</Text>
      <Text className="mt-1 text-rizoma-secondaryText">Resumen rapido de tu seleccion.</Text>

      <View className="mt-5 gap-3 rounded-3xl bg-white p-5">
        {initialCart.map((line) => (
          <View key={line.plant.id} className="flex-row items-center justify-between">
            <Text className="text-rizoma-primary">{line.plant.name}</Text>
            <Text className="text-rizoma-secondaryText">
              {line.quantity} x {line.plant.price.toFixed(2)} EUR
            </Text>
          </View>
        ))}
        <View className="mt-3 border-t border-rizoma-border pt-3">
          <Text className="text-lg font-semibold text-rizoma-primary">Total: {cartTotal().toFixed(2)} EUR</Text>
        </View>
      </View>

      <View className="mt-6">
        <RizomaButton label="Ir al checkout" />
      </View>
    </View>
  );
}
