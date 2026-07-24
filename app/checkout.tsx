import { router } from "expo-router";
import { useMemo, useState } from "react";
import { Pressable, Text, TextInput, View } from "react-native";
import { CreditCard } from "lucide-react-native";
import { RizomaButton } from "@/src/components/ui/RizomaButton";
import { Screen } from "@/src/components/ui/Screen";
import { ScreenHeader } from "@/src/components/ui/ScreenHeader";
import { EmptyState } from "@/src/components/ui/EmptyState";
import { useShop } from "@/src/store/ShopContext";
import { createOrderId } from "@/src/types/orders";
import { formatPrice } from "@/src/utils/pricing";
import { calculateShipping } from "@/src/utils/shipping";
import { colors } from "@/src/theme/tokens";

type Step = "address" | "delivery" | "payment" | "success";
type Delivery = "standard" | "express";

const steps: Step[] = ["address", "delivery", "payment"];

export default function CheckoutScreen() {
  const { cart, cartTotal, placeOrder } = useShop();
  const [step, setStep] = useState<Step>("address");
  const [address, setAddress] = useState("Calle Verde 12, Madrid");
  const [addressError, setAddressError] = useState<string | null>(null);
  const [delivery, setDelivery] = useState<Delivery>("standard");
  const [cardNumber, setCardNumber] = useState("**** **** **** 4242");
  const [orderId, setOrderId] = useState<string | null>(null);

  const shipping = calculateShipping(cartTotal, delivery);
  const total = cartTotal + shipping;
  const stepIndex = steps.indexOf(step === "success" ? "payment" : step);

  const stepTitle = useMemo(() => {
    if (step === "address") return "1/3 Dirección";
    if (step === "delivery") return "2/3 Entrega";
    if (step === "payment") return "3/3 Pago";
    return "Confirmado";
  }, [step]);

  const goBackStep = () => {
    if (step === "delivery") setStep("address");
    else if (step === "payment") setStep("delivery");
  };

  if (cart.length === 0 && step !== "success") {
    return (
      <Screen>
        <ScreenHeader title="Checkout" />
        <EmptyState
          title="Nada que pagar"
          description="Añade plantas al carrito antes de continuar con el pedido."
          actionLabel="Volver al catálogo"
          onActionPress={() => router.replace("/(tabs)/explore")}
        />
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
            Gracias por comprar en Rizoma. Tu pedido está en preparación.
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
          {cart.length} líneas · envío {shipping === 0 ? "gratis" : formatPrice(shipping)}
        </Text>
      </View>

      {step === "address" ? (
        <View className="mt-5 rounded-3xl border border-rizoma-border bg-white p-5">
          <Text className="mb-2 text-rizoma-black" style={{ fontFamily: "Inter_600SemiBold" }}>
            Dirección de entrega
          </Text>
          <TextInput
            value={address}
            onChangeText={(value) => {
              setAddress(value);
              setAddressError(null);
            }}
            className="rounded-2xl border border-rizoma-border px-4 py-3 text-rizoma-black"
            style={{ fontFamily: "Inter_400Regular" }}
          />
          {addressError ? (
            <Text className="mt-2 text-sm text-rizoma-red" style={{ fontFamily: "Inter_500Medium" }}>
              {addressError}
            </Text>
          ) : null}
          <View className="mt-4">
            <RizomaButton
              label="Continuar"
              onPress={() => {
                if (address.trim().length < 8) {
                  setAddressError("Introduce una dirección válida.");
                  return;
                }
                setStep("delivery");
              }}
            />
          </View>
        </View>
      ) : null}

      {step === "delivery" ? (
        <View className="mt-5 gap-3">
          {(
            [
              {
                id: "standard" as const,
                title: "Entrega estándar (3-5 días)",
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
          <Pressable onPress={goBackStep} accessibilityRole="button" accessibilityLabel="Volver al paso anterior">
            <Text className="text-center text-sm text-rizoma-brand" style={{ fontFamily: "Inter_600SemiBold" }}>
              Anterior
            </Text>
          </Pressable>
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
          <View className="mt-4 gap-3">
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
                  status: "received",
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
            <Pressable onPress={goBackStep} accessibilityRole="button" accessibilityLabel="Volver al paso anterior">
              <Text className="text-center text-sm text-rizoma-brand" style={{ fontFamily: "Inter_600SemiBold" }}>
                Anterior
              </Text>
            </Pressable>
          </View>
        </View>
      ) : null}
    </Screen>
  );
}
