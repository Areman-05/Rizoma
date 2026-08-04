import { router } from "expo-router";
import { Alert, Image, Pressable, ScrollView, Text, View } from "react-native";
import { Minus, Plus, ShoppingBag, Trash2 } from "lucide-react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useShop } from "@/src/store/ShopContext";
import { ScreenHeader } from "@/src/components/ui/ScreenHeader";
import { EmptyState, emptyIconTone } from "@/src/components/ui/EmptyState";
import { RizomaButton } from "@/src/components/ui/RizomaButton";
import { formatPrice } from "@/src/utils/pricing";
import { calculateShipping, FREE_SHIPPING_FROM } from "@/src/utils/shipping";
import { colors, spacing } from "@/src/theme/tokens";

export default function CartScreen() {
  const { cart, cartTotal, cartCount, updateQuantity, removeFromCart, clearCart } = useShop();
  const shipping = calculateShipping(cartTotal, "standard");
  const payable = cartTotal + shipping;
  const remainingForFree = FREE_SHIPPING_FROM - cartTotal;

  const confirmClearCart = () => {
    Alert.alert("Vaciar carrito", "¿Quieres quitar todas las plantas del carrito?", [
      { text: "Cancelar", style: "cancel" },
      { text: "Vaciar", style: "destructive", onPress: () => clearCart() },
    ]);
  };

  const goToCheckout = () => {
    router.push("/checkout");
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.white }} edges={["top", "left", "right"]}>
      <View style={{ flex: 1, paddingHorizontal: spacing.screenMargin, paddingTop: 8 }}>
        <ScreenHeader title="Carrito" showBack={false} showBell={false} />

        {cart.length === 0 ? (
          <EmptyState
            icon={<ShoppingBag size={28} color={emptyIconTone} />}
            title="Tu carrito está vacío"
            description="Primero añade plantas desde el catálogo. Cuando haya artículos aquí verás el botón «Finalizar pedido»."
            actionLabel="Explorar plantas"
            onActionPress={() => router.push("/(tabs)")}
          />
        ) : (
          <View style={{ flex: 1 }}>
            <ScrollView
              style={{ flex: 1 }}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{ paddingBottom: 24 }}
              keyboardShouldPersistTaps="handled"
            >
              <View className="mb-3 flex-row items-center justify-between">
                <Text className="text-sm text-rizoma-secondaryText" style={{ fontFamily: "Inter_500Medium" }}>
                  {cartCount} {cartCount === 1 ? "planta" : "plantas"}
                </Text>
                <Pressable
                  accessibilityLabel="Vaciar carrito"
                  onPress={confirmClearCart}
                  className="flex-row items-center gap-1.5 py-1"
                  hitSlop={6}
                  style={({ pressed }) => ({ opacity: pressed ? 0.7 : 1 })}
                >
                  <Trash2 size={14} color={colors.red} />
                  <Text className="text-sm text-rizoma-red" style={{ fontFamily: "Inter_500Medium" }}>
                    Vaciar carrito
                  </Text>
                </Pressable>
              </View>

              <View className="gap-3">
                {cart.map((line) => {
                  const lineSubtotal = line.plant.price * line.quantity;
                  return (
                    <View
                      key={line.plant.id}
                      className="flex-row gap-3 rounded-3xl border border-rizoma-border bg-white p-3"
                    >
                      <Pressable
                        onPress={() => router.push(`/plants/${line.plant.id}`)}
                        accessibilityLabel={`Ver ${line.plant.name}`}
                      >
                        <Image
                          source={{ uri: line.plant.image }}
                          className="h-[88px] w-[88px] rounded-2xl bg-rizoma-gray"
                          resizeMode="cover"
                        />
                      </Pressable>

                      <View className="min-w-0 flex-1 justify-between py-0.5">
                        <View className="flex-row items-start justify-between gap-2">
                          <View className="min-w-0 flex-1">
                            <Text
                              className="text-base text-rizoma-black"
                              style={{ fontFamily: "Inter_700Bold" }}
                              numberOfLines={2}
                            >
                              {line.plant.name}
                            </Text>
                            <Text
                              className="mt-0.5 text-xs text-rizoma-secondaryText"
                              style={{ fontFamily: "Inter_400Regular" }}
                            >
                              {formatPrice(line.plant.price)} ud.
                            </Text>
                          </View>
                          <Pressable
                            accessibilityLabel={`Quitar ${line.plant.name}`}
                            onPress={() => removeFromCart(line.plant.id)}
                            className="h-8 w-8 items-center justify-center rounded-full bg-rizoma-gray"
                            hitSlop={4}
                          >
                            <Trash2 size={14} color={colors.red} />
                          </Pressable>
                        </View>

                        <View className="mt-3 flex-row items-center justify-between">
                          <View className="h-9 flex-row items-center rounded-full bg-rizoma-brandSoft px-0.5">
                            <Pressable
                              accessibilityLabel="Reducir cantidad"
                              onPress={() => updateQuantity(line.plant.id, line.quantity - 1)}
                              className="h-8 w-8 items-center justify-center"
                              hitSlop={4}
                            >
                              <Minus size={14} color={colors.brand} />
                            </Pressable>
                            <Text
                              className="min-w-[22px] text-center text-sm text-rizoma-black"
                              style={{ fontFamily: "Inter_700Bold" }}
                            >
                              {line.quantity}
                            </Text>
                            <Pressable
                              accessibilityLabel="Aumentar cantidad"
                              onPress={() => updateQuantity(line.plant.id, line.quantity + 1)}
                              className="h-8 w-8 items-center justify-center"
                              hitSlop={4}
                            >
                              <Plus size={14} color={colors.brand} />
                            </Pressable>
                          </View>

                          <Text className="text-base text-rizoma-black" style={{ fontFamily: "Inter_700Bold" }}>
                            {formatPrice(lineSubtotal)}
                          </Text>
                        </View>
                      </View>
                    </View>
                  );
                })}
              </View>

              <View className="mt-5 rounded-3xl border border-rizoma-border bg-rizoma-gray px-4 py-4">
                <Text className="mb-3 text-base text-rizoma-black" style={{ fontFamily: "Inter_700Bold" }}>
                  Resumen del pedido
                </Text>
                <View className="flex-row items-center justify-between">
                  <Text className="text-sm text-rizoma-secondaryText" style={{ fontFamily: "Inter_400Regular" }}>
                    Subtotal
                  </Text>
                  <Text className="text-sm text-rizoma-black" style={{ fontFamily: "Inter_600SemiBold" }}>
                    {formatPrice(cartTotal)}
                  </Text>
                </View>
                <View className="mt-2.5 flex-row items-center justify-between">
                  <Text className="text-sm text-rizoma-secondaryText" style={{ fontFamily: "Inter_400Regular" }}>
                    Envío
                  </Text>
                  <Text
                    className={`text-sm ${shipping === 0 ? "text-rizoma-brand" : "text-rizoma-black"}`}
                    style={{ fontFamily: "Inter_600SemiBold" }}
                  >
                    {shipping === 0 ? "Gratis" : formatPrice(shipping)}
                  </Text>
                </View>
                {remainingForFree > 0 ? (
                  <View className="mt-3 overflow-hidden rounded-2xl bg-rizoma-brandSoft px-3 py-2.5">
                    <Text className="text-xs text-rizoma-brand" style={{ fontFamily: "Inter_500Medium" }}>
                      Te faltan {formatPrice(remainingForFree)} para envío gratis
                    </Text>
                    <View className="mt-2 h-1.5 overflow-hidden rounded-full bg-white">
                      <View
                        className="h-full rounded-full bg-rizoma-brand"
                        style={{
                          width: `${Math.min(100, (cartTotal / FREE_SHIPPING_FROM) * 100)}%`,
                        }}
                      />
                    </View>
                  </View>
                ) : (
                  <Text className="mt-3 text-xs text-rizoma-brand" style={{ fontFamily: "Inter_500Medium" }}>
                    ¡Envío gratis aplicado!
                  </Text>
                )}
                <View className="mt-3.5 flex-row items-center justify-between border-t border-rizoma-border pt-3.5">
                  <Text className="text-lg text-rizoma-black" style={{ fontFamily: "Inter_700Bold" }}>
                    Total
                  </Text>
                  <Text className="text-lg text-rizoma-brand" style={{ fontFamily: "Inter_700Bold" }}>
                    {formatPrice(payable)}
                  </Text>
                </View>
              </View>

              {/* CTA en el flujo del scroll: siempre visible bajo el resumen */}
              <View style={{ marginTop: 20, marginBottom: 8 }}>
                <RizomaButton
                  label={`Finalizar pedido · ${formatPrice(payable)}`}
                  onPress={goToCheckout}
                />
              </View>
            </ScrollView>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
}
