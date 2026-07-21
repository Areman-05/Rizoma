import { Link, router } from "expo-router";
import { Pressable, Text, View } from "react-native";
import { RizomaButton } from "@/src/components/ui/RizomaButton";
import { useShop } from "@/src/store/ShopContext";
import { Screen } from "@/src/components/ui/Screen";
import { EmptyState } from "@/src/components/ui/EmptyState";
import { elevation } from "@/src/theme/tokens";

export default function CartScreen() {
  const { cart, cartTotal, updateQuantity, removeFromCart } = useShop();

  return (
    <Screen>
      <Text className="text-3xl font-bold text-rizoma-primary">Carrito</Text>
      <Text className="mt-1 text-rizoma-secondaryText">Resumen de tu seleccion Rizoma.</Text>

      {cart.length === 0 ? (
        <EmptyState
          title="Carrito vacio"
          description="Anade plantas desde el catalogo o desde sus fichas de producto."
          actionLabel="Explorar plantas"
          onActionPress={() => router.push("/(tabs)/explore")}
        />
      ) : (
        <>
          <View className="mt-5 gap-3 rounded-3xl bg-white p-5" style={elevation.soft}>
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
    </Screen>
  );
}
