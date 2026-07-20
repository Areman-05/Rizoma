import { Link } from "expo-router";
import { Pressable, Text, View } from "react-native";
import { RizomaButton } from "@/src/components/ui/RizomaButton";
import { useShop } from "@/src/store/ShopContext";

export default function CartScreen() {
  const { cart, cartTotal, updateQuantity, removeFromCart } = useShop();

  return (
    <View className="flex-1 bg-rizoma-canvas px-5 pt-14">
      <Text className="text-3xl font-bold text-rizoma-primary">Carrito</Text>
      <Text className="mt-1 text-rizoma-secondaryText">Resumen de tu seleccion Rizoma.</Text>

      {cart.length === 0 ? (
        <View className="mt-10 rounded-3xl bg-white p-6">
          <Text className="text-center text-rizoma-secondaryText">Tu carrito esta vacio.</Text>
          <Link href="/(tabs)/explore" asChild>
            <Pressable className="mt-4 rounded-3xl bg-rizoma-primary px-5 py-4">
              <Text className="text-center font-semibold text-white">Explorar plantas</Text>
            </Pressable>
          </Link>
        </View>
      ) : (
        <>
          <View className="mt-5 gap-3 rounded-3xl bg-white p-5">
            {cart.map((line) => (
              <View key={line.plant.id} className="gap-2 border-b border-rizoma-border pb-3">
                <View className="flex-row items-center justify-between">
                  <Text className="flex-1 font-medium text-rizoma-primary">{line.plant.name}</Text>
                  <Text className="text-rizoma-secondaryText">
                    {(line.plant.price * line.quantity).toFixed(2)} EUR
                  </Text>
                </View>
                <View className="flex-row items-center gap-3">
                  <Pressable
                    onPress={() => updateQuantity(line.plant.id, line.quantity - 1)}
                    className="rounded-xl bg-rizoma-canvas px-3 py-1"
                  >
                    <Text className="text-rizoma-primary">-</Text>
                  </Pressable>
                  <Text className="text-rizoma-primary">{line.quantity}</Text>
                  <Pressable
                    onPress={() => updateQuantity(line.plant.id, line.quantity + 1)}
                    className="rounded-xl bg-rizoma-canvas px-3 py-1"
                  >
                    <Text className="text-rizoma-primary">+</Text>
                  </Pressable>
                  <Pressable onPress={() => removeFromCart(line.plant.id)}>
                    <Text className="text-sm text-rizoma-secondaryText">Eliminar</Text>
                  </Pressable>
                </View>
              </View>
            ))}
            <Text className="mt-2 text-lg font-semibold text-rizoma-primary">
              Total: {cartTotal.toFixed(2)} EUR
            </Text>
          </View>

          <View className="mt-6">
            <Link href="/checkout" asChild>
              <View>
                <RizomaButton label="Ir al checkout" />
              </View>
            </Link>
          </View>
        </>
      )}
    </View>
  );
}
