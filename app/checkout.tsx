import { router } from "expo-router";
import { useMemo, useState } from "react";
import { Pressable, Text, TextInput, View } from "react-native";
import { CreditCard } from "lucide-react-native";
import { RizomaButton } from "@/src/components/ui/RizomaButton";
import { Screen } from "@/src/components/ui/Screen";
import { ScreenHeader } from "@/src/components/ui/ScreenHeader";
import { useShop } from "@/src/store/ShopContext";
import { createOrderId } from "@/src/types/orders";
import { formatPrice } from "@/src/utils/pricing";
import { colors } from "@/src/theme/tokens";

type Step = "address" | "delivery" | "payment" | "success";
type Delivery = "standard" | "express";

const steps: Step[] = ["address", "delivery", "payment"];

export default function CheckoutScreen() {
  const { cart, cartTotal, placeOrder } = useShop();
  const [step, setStep] = useState<Step>("address");
  const [address, setAddress] = useState("Calle Verde 12, Madrid");
  const [delivery, setDelivery] = useState<Delivery>("standard");
  const [cardNumber, setCardNumber] = useState("**** **** **** 4242");
  const [orderId, setOrderId] = useState<string | null>(null);

  const shipping = delivery === "express" ? 6.9 : cartTotal >= 40 ? 0 : 4.9;
  const total = cartTotal + shipping;
  const stepIndex = steps.indexOf(step === "success" ? "payment" : step);

  const stepTitle = useMemo(() => {
    if (step === "address") return "1/3 Direccion";
    if (step === "delivery") return "2/3 Entrega";
    if (step === "payment") return "3/3 Pago";
    return "Confirmado";
  }, [step]);

  if (cart.length === 0 && step !== "success") {
    return (
      <Screen>
        <ScreenHeader title="Checkout" />
        <Text className="mb-4 text-center text-rizoma-secondaryText" style={{ fontFamily: "Inter_400Regular" }}>
          No hay productos para pagar.
        </Text>
        <RizomaButton label="Volver al catalogo" onPress={() => router.replace("/(tabs)/explore")} />
      </Screen>
    );
  }

  if (step === "success") {
    return (
      <Screen>
        <View className="flex-1 items-center justify-center px-2">
          <View className="mb-4 h-16 w-16 items-center justify-center rounded-full bg-rizoma-brandSoft">
            <Text className="text-3xl text-rizoma-brand">✓</Text>
          </View>
          <Text className="text-3xl text-rizoma-black" style={{ fontFamily: "Inter_700Bold" }}>
            Pedido confirmado
          </Text>
          <Text className="mt-2 text-base text-rizoma-brand" style={{ fontFamily: "Inter_700Bold" }}>
            {orderId}
          </Text>
          <Text
            className="mt-3 text-center text-rizoma-secondaryText"
            style={{ fontFamily: "Inter_400Regular" }}
          >
            Gracias por comprar en Rizoma. Tu pedido esta en preparacion.
          </Text>
          <View className="mt-6 w-full">
            <RizomaButton label="Ver pedidos" onPress={() => router.replace("/orders")} />
          </View>
        </View>
      </Screen>
    );
  }

  return (
    <Screen scroll>
      <ScreenHeader title="Checkout" />
      <Text className="text-sm text-rizoma-secondaryText" style={{ fontFamily: "Inter_500Medium" }}>
        {stepTitle}
      </Text>

      <View className="mt-4 flex-row gap-2">
        {steps.map((item, index) => (
          <View
            key={item}
            className={`h-1.5 flex-1 rounded-full ${index <= stepIndex ? "bg-rizoma-brand" : "bg-rizoma-gray"}`}
          />
        ))}
      </View>

      <View className="mt-5 rounded-3xl border border-rizoma-border bg-white p-5">
        <Text className="text-rizoma-black" style={{ fontFamily: "Inter_700Bold" }}>
          Total: {formatPrice(total)}
        </Text>
        <Text className="mt-1 text-rizoma-secondaryText" style={{ fontFamily: "Inter_400Regular" }}>
          {cart.length} lineas · envio {shipping === 0 ? "gratis" : formatPrice(shipping)}
        </Text>
      </View>

      {step === "address" ? (
        <View className="mt-5 rounded-3xl border border-rizoma-border bg-white p-5">
          <Text className="mb-2 text-rizoma-black" style={{ fontFamily: "Inter_600SemiBold" }}>
            Direccion de entrega
          </Text>
          <TextInput
            value={address}
            onChangeText={setAddress}
            className="rounded-2xl border border-rizoma-border px-4 py-3 text-rizoma-black"
            style={{ fontFamily: "Inter_400Regular" }}
          />
          <View className="mt-4">
            <RizomaButton label="Continuar" onPress={() => setStep("delivery")} />
          </View>
        </View>
      ) : null}

      {step === "delivery" ? (
        <View className="mt-5 gap-3">
          {(
            [
              {
                id: "standard" as const,
                title: "Entrega estandar (3-5 dias)",
                subtitle: cartTotal >= 40 ? "Gratis" : "+4.90 EUR",
              },
              {
                id: "express" as const,
                title: "Entrega express (24-48h)",
                subtitle: "+6.90 EUR",
              },
            ] as const
          ).map((option) => {
            const active = delivery === option.id;
            return (
              <Pressable
                key={option.id}
                onPress={() => setDelivery(option.id)}
                className={`rounded-3xl border p-5 ${active ? "border-rizoma-brand bg-rizoma-brandSoft" : "border-rizoma-border bg-white"}`}
              >
                <Text className="text-rizoma-black" style={{ fontFamily: "Inter_700Bold" }}>
                  {option.title}
                </Text>
                <Text className="mt-1 text-rizoma-secondaryText" style={{ fontFamily: "Inter_400Regular" }}>
                  {option.subtitle}
                </Text>
              </Pressable>
            );
          })}
          <RizomaButton label="Continuar al pago" onPress={() => setStep("payment")} />
        </View>
      ) : null}

      {step === "payment" ? (
        <View className="mt-5 rounded-3xl border border-rizoma-border bg-white p-5">
          <View className="mb-3 flex-row items-center gap-2">
            <CreditCard size={18} color={colors.brand} />
            <Text className="text-rizoma-black" style={{ fontFamily: "Inter_700Bold" }}>
              Tarjeta (simulado)
            </Text>
          </View>
          <Text className="mb-2 text-xs text-rizoma-secondaryText" style={{ fontFamily: "Inter_400Regular" }}>
            Visa / Mastercard · sin cargo real
          </Text>
          <TextInput
            value={cardNumber}
            onChangeText={setCardNumber}
            className="rounded-2xl border border-rizoma-border px-4 py-3 text-rizoma-black"
            style={{ fontFamily: "Inter_500Medium" }}
          />
          <View className="mt-3 flex-row gap-3">
            <TextInput
              placeholder="MM/AA"
              placeholderTextColor="#9CA3AF"
              className="flex-1 rounded-2xl border border-rizoma-border px-4 py-3"
              style={{ fontFamily: "Inter_400Regular" }}
            />
            <TextInput
              placeholder="CVC"
              placeholderTextColor="#9CA3AF"
              className="flex-1 rounded-2xl border border-rizoma-border px-4 py-3"
              style={{ fontFamily: "Inter_400Regular" }}
            />
          </View>
          <View className="mt-4">
            <RizomaButton
              label="Confirmar pedido"
              onPress={() => {
                const id = createOrderId();
                placeOrder({
                  id,
                  createdAt: new Date().toISOString(),
                  address,
                  delivery,
                  shipping,
                  subtotal: cartTotal,
                  total,
                  status: "shipping",
                  lines: cart.map((line) => ({
                    plantId: line.plant.id,
                    name: line.plant.name,
                    image: line.plant.image,
                    price: line.plant.price,
                    quantity: line.quantity,
                  })),
                });
                setOrderId(id);
                setStep("success");
              }}
            />
          </View>
        </View>
      ) : null}
    </Screen>
  );
}
