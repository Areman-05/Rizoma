import { Link, router } from "expo-router";
import { Image, Pressable, Text, View } from "react-native";
import { RizomaButton } from "@/src/components/ui/RizomaButton";
import { useShop } from "@/src/store/ShopContext";
import { Screen } from "@/src/components/ui/Screen";
import { ScreenHeader } from "@/src/components/ui/ScreenHeader";
import { EmptyState } from "@/src/components/ui/EmptyState";
import { formatPrice } from "@/src/utils/pricing";
import { calculateShipping, FREE_SHIPPING_FROM } from "@/src/utils/shipping";

export default function CartScreen() {
  const { cart, cartTotal, updateQuantity, removeFromCart } = useShop();
  const shipping = calculateShipping(cartTotal, "standard");
  const payable = cartTotal + shipping;

  return (
    <Screen scroll>
      <ScreenHeader title="Carrito" showBack={false} />

      {cart.length === 0 ? (
        <EmptyState
          title="Carrito vacío"
          description="Añade plantas desde el catálogo o desde sus fichas."
          actionLabel="Explorar plantas"
          onActionPress={() => router.push("/(tabs)")}
        />
      ) : (
        <>
          <View className="gap-3">
            {cart.map((line) => (
              <View key={line.plant.id} className="flex-row gap-3 rounded-3xl bg-rizoma-gray p-3">
                <Image source={{ uri: line.plant.image }} className="h-20 w-20 rounded-2xl bg-white" />
                <View className="flex-1">
                  <Text className="text-base text-rizoma-black" style={{ fontFamily: "Inter_700Bold" }}>
                    {line.plant.name}
                  </Text>
                  <Text className="mt-1 text-sm text-rizoma-black" style={{ fontFamily: "Inter_600SemiBold" }}>
                    {formatPrice(line.plant.price * line.quantity)}
                  </Text>
                  <View className="mt-2 flex-row items-center gap-3">
                    <Pressable
                      accessibilityLabel="Reducir cantidad"
                      onPress={() => updateQuantity(line.plant.id, line.quantity - 1)}
                      className="h-8 w-8 items-center justify-center rounded-full bg-white"
                    >
                      <Text>-</Text>
                    </Pressable>
                    <Text style={{ fontFamily: "Inter_600SemiBold" }}>{line.quantity}</Text>
                    <Pressable
                      accessibilityLabel="Aumentar cantidad"
                      onPress={() => updateQuantity(line.plant.id, line.quantity + 1)}
                      className="h-8 w-8 items-center justify-center rounded-full bg-white"
                    >
                      <Text>+</Text>
                    </Pressable>
                    <Pressable
                      accessibilityLabel="Eliminar del carrito"
                      onPress={() => removeFromCart(line.plant.id)}
                    >
                      <Text className="text-sm text-rizoma-red">Eliminar</Text>
                    </Pressable>
                  </View>
                </View>
              </View>
            ))}
          </View>

          <View className="mt-5 rounded-3xl border border-rizoma-border bg-white p-4">
            <View className="flex-row items-center justify-between">
              <Text className="text-sm text-rizoma-secondaryText" style={{ fontFamily: "Inter_400Regular" }}>
                Subtotal
              </Text>
              <Text style={{ fontFamily: "Inter_600SemiBold" }}>{formatPrice(cartTotal)}</Text>
            </View>
            <View className="mt-2 flex-row items-center justify-between">
              <Text className="text-sm text-rizoma-secondaryText" style={{ fontFamily: "Inter_400Regular" }}>
                Envío
              </Text>
              <Text style={{ fontFamily: "Inter_600SemiBold" }}>
                {shipping === 0 ? "Gratis" : formatPrice(shipping)}
              </Text>
            </View>
            {cartTotal < FREE_SHIPPING_FROM ? (
              <Text className="mt-2 text-xs text-rizoma-brand" style={{ fontFamily: "Inter_500Medium" }}>
                Te faltan {formatPrice(FREE_SHIPPING_FROM - cartTotal)} para envío gratis
              </Text>
            ) : null}
            <View className="mt-3 flex-row items-center justify-between border-t border-rizoma-border pt-3">
              <Text className="text-lg text-rizoma-black" style={{ fontFamily: "Inter_700Bold" }}>
                Total
              </Text>
              <Text className="text-lg text-rizoma-black" style={{ fontFamily: "Inter_700Bold" }}>
                {formatPrice(payable)}
              </Text>
            </View>
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
