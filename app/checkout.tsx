import { router } from "expo-router";
import { useMemo, useState } from "react";
import { Platform, Pressable, Text, TextInput, View } from "react-native";
import { CreditCard, Banknote, Smartphone, MapPin, Wallet } from "lucide-react-native";
import { RizomaButton } from "@/src/components/ui/RizomaButton";
import { Screen } from "@/src/components/ui/Screen";
import { ScreenHeader } from "@/src/components/ui/ScreenHeader";
import { EmptyState } from "@/src/components/ui/EmptyState";
import { useShop } from "@/src/store/ShopContext";
import { createOrderId, PaymentMethod } from "@/src/types/orders";
import { formatPrice } from "@/src/utils/pricing";
import { calculateShipping } from "@/src/utils/shipping";
import { colors } from "@/src/theme/tokens";

type Step = "delivery" | "payment";
type Delivery = "standard" | "express";

const stepLabels = ["Entrega", "Pago"] as const;

const paymentOptions: Array<{
  id: PaymentMethod;
  title: string;
  subtitle: string;
  icon: "card" | "apple" | "google" | "cod";
}> = [
  {
    id: "card",
    title: "Tarjeta",
    subtitle: "Visa / Mastercard · simulado",
    icon: "card",
  },
  {
    id: "apple_pay",
    title: "Apple Pay",
    subtitle: "Pago simulado con Apple Pay",
    icon: "apple",
  },
  {
    id: "google_pay",
    title: "Google Pay",
    subtitle: "Pago simulado con Google Pay",
    icon: "google",
  },
  {
    id: "cod",
    title: "Contra reembolso",
    subtitle: "Pagas al recibir el pedido",
    icon: "cod",
  },
];

export default function CheckoutScreen() {
  const { cart, cartTotal, placeOrder } = useShop();
  const [step, setStep] = useState<Step>("delivery");
  const [address, setAddress] = useState("Calle Verde 12, Barcelona");
  const [addressError, setAddressError] = useState<string | null>(null);
  const [delivery, setDelivery] = useState<Delivery>("standard");
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("card");
  const [cardNumber, setCardNumber] = useState("**** **** **** 4242");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCvc, setCardCvc] = useState("");
  const [paying, setPaying] = useState(false);

  const shipping = calculateShipping(cartTotal, delivery);
  const total = cartTotal + shipping;
  const stepIndex = step === "delivery" ? 0 : 1;

  const visiblePayments = useMemo(
    () =>
      paymentOptions.filter((option) => {
        if (option.id === "apple_pay") return Platform.OS === "ios" || Platform.OS === "web";
        if (option.id === "google_pay") return Platform.OS === "android" || Platform.OS === "web";
        return true;
      }),
    [],
  );

  const onExpiryChange = (raw: string) => {
    const digits = raw.replace(/\D/g, "").slice(0, 4);
    if (digits.length <= 2) {
      setCardExpiry(digits);
      return;
    }
    setCardExpiry(`${digits.slice(0, 2)}/${digits.slice(2)}`);
  };

  const confirmOrder = () => {
    if (paying) return;
    setPaying(true);
    const id = createOrderId();
    placeOrder({
      id,
      createdAt: new Date().toISOString(),
      address: address.trim(),
      delivery,
      shipping,
      subtotal: cartTotal,
      total,
      status: "prepared",
      paymentMethod,
      lines: cart.map((line) => ({
        plantId: line.plant.id,
        name: line.plant.name,
        image: line.plant.image,
        price: line.plant.price,
        quantity: line.quantity,
      })),
    });
    router.replace(`/orders/${id}`);
  };

  if (cart.length === 0) {
    return (
      <Screen>
        <ScreenHeader title="Finalizar pedido" />
        <EmptyState
          title="Nada que pagar"
          description="Añade plantas al carrito y pulsa «Finalizar pedido» para continuar."
          actionLabel="Volver al catálogo"
          onActionPress={() => router.replace("/(tabs)/explore")}
        />
      </Screen>
    );
  }

  return (
    <Screen scroll>
      <ScreenHeader title="Finalizar pedido" />

      <View className="mt-1 flex-row items-center gap-2">
        {stepLabels.map((label, index) => {
          const active = index <= stepIndex;
          return (
            <View key={label} className="flex-1">
              <View
                className={`h-1.5 rounded-full ${active ? "bg-rizoma-brand" : "bg-rizoma-gray"}`}
              />
              <Text
                className={`mt-2 text-center text-xs ${active ? "text-rizoma-brand" : "text-rizoma-secondaryText"}`}
                style={{ fontFamily: active ? "Inter_600SemiBold" : "Inter_500Medium" }}
              >
                {index + 1}. {label}
              </Text>
            </View>
          );
        })}
      </View>

      <View className="mt-5 rounded-3xl border border-rizoma-border bg-rizoma-brandSoft p-5">
        <View className="flex-row items-center gap-2">
          <Wallet size={18} color={colors.brand} />
          <Text className="text-sm text-rizoma-brand" style={{ fontFamily: "Inter_600SemiBold" }}>
            Resumen
          </Text>
        </View>
        <Text className="mt-2 text-2xl text-rizoma-black" style={{ fontFamily: "Inter_700Bold" }}>
          {formatPrice(total)}
        </Text>
        <Text className="mt-1 text-sm text-rizoma-secondaryText" style={{ fontFamily: "Inter_400Regular" }}>
          {cart.length} {cart.length === 1 ? "planta" : "plantas"} · envío{" "}
          {shipping === 0 ? "gratis" : formatPrice(shipping)}
        </Text>
      </View>

      {step === "delivery" ? (
        <View className="mt-5 gap-4">
          <View className="rounded-3xl border border-rizoma-border bg-white p-5">
            <View className="mb-2 flex-row items-center gap-2">
              <MapPin size={16} color={colors.brand} />
              <Text className="text-rizoma-black" style={{ fontFamily: "Inter_600SemiBold" }}>
                Dirección de entrega
              </Text>
            </View>
            <TextInput
              value={address}
              onChangeText={(value) => {
                setAddress(value);
                setAddressError(null);
              }}
              className="rounded-2xl border border-rizoma-border px-4 py-3 text-rizoma-black"
              style={{ fontFamily: "Inter_400Regular" }}
              placeholder="Calle, número, ciudad"
              placeholderTextColor={colors.grayText}
            />
            {addressError ? (
              <Text className="mt-2 text-sm text-rizoma-red" style={{ fontFamily: "Inter_500Medium" }}>
                {addressError}
              </Text>
            ) : null}
          </View>

          <View className="gap-3">
            <Text className="text-rizoma-black" style={{ fontFamily: "Inter_600SemiBold" }}>
              Método de envío
            </Text>
            {(
              [
                {
                  id: "standard" as const,
                  title: "Estándar (3-5 días)",
                  subtitle: cartTotal >= 40 ? "Gratis" : "+4.90 EUR",
                },
                {
                  id: "express" as const,
                  title: "Express (24-48h)",
                  subtitle: "+6.90 EUR",
                },
              ] as const
            ).map((option) => {
              const active = delivery === option.id;
              return (
                <Pressable
                  key={option.id}
                  onPress={() => setDelivery(option.id)}
                  className={`rounded-3xl border p-5 ${
                    active ? "border-rizoma-brand bg-rizoma-brandSoft" : "border-rizoma-border bg-white"
                  }`}
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
          </View>

          <RizomaButton
            label="Continuar al pago"
            onPress={() => {
              if (address.trim().length < 8) {
                setAddressError("Introduce una dirección válida.");
                return;
              }
              setStep("payment");
            }}
          />
        </View>
      ) : null}

      {step === "payment" ? (
        <View className="mt-5 gap-3">
          <Text className="text-rizoma-black" style={{ fontFamily: "Inter_600SemiBold" }}>
            Método de pago
          </Text>
          {visiblePayments.map((option) => {
            const active = paymentMethod === option.id;
            const Icon =
              option.icon === "cod" ? Banknote : option.icon === "card" ? CreditCard : Smartphone;
            return (
              <Pressable
                key={option.id}
                onPress={() => setPaymentMethod(option.id)}
                className={`rounded-3xl border p-4 ${
                  active ? "border-rizoma-brand bg-rizoma-brandSoft" : "border-rizoma-border bg-white"
                }`}
              >
                <View className="flex-row items-center gap-3">
                  <View className="h-10 w-10 items-center justify-center rounded-full bg-white">
                    <Icon size={18} color={colors.brand} />
                  </View>
                  <View className="flex-1">
                    <Text className="text-rizoma-black" style={{ fontFamily: "Inter_700Bold" }}>
                      {option.title}
                    </Text>
                    <Text
                      className="mt-0.5 text-sm text-rizoma-secondaryText"
                      style={{ fontFamily: "Inter_400Regular" }}
                    >
                      {option.subtitle}
                    </Text>
                  </View>
                </View>
              </Pressable>
            );
          })}

          {paymentMethod === "card" ? (
            <View className="mt-2 rounded-3xl border border-rizoma-border bg-white p-5">
              <Text className="mb-2 text-xs text-rizoma-secondaryText" style={{ fontFamily: "Inter_400Regular" }}>
                Datos de tarjeta (demo · sin cargo real)
              </Text>
              <TextInput
                value={cardNumber}
                onChangeText={setCardNumber}
                className="rounded-2xl border border-rizoma-border px-4 py-3 text-rizoma-black"
                style={{ fontFamily: "Inter_500Medium" }}
              />
              <View className="mt-3 flex-row gap-3">
                <TextInput
                  value={cardExpiry}
                  onChangeText={onExpiryChange}
                  placeholder="MM/AA"
                  placeholderTextColor={colors.grayText}
                  keyboardType="number-pad"
                  maxLength={5}
                  accessibilityLabel="Fecha de caducidad MM barra AA"
                  className="flex-1 rounded-2xl border border-rizoma-border px-4 py-3 text-rizoma-black"
                  style={{ fontFamily: "Inter_400Regular" }}
                />
                <TextInput
                  value={cardCvc}
                  onChangeText={(value) => setCardCvc(value.replace(/\D/g, "").slice(0, 4))}
                  placeholder="CVC"
                  placeholderTextColor={colors.grayText}
                  keyboardType="number-pad"
                  maxLength={4}
                  secureTextEntry
                  accessibilityLabel="Código CVC"
                  className="flex-1 rounded-2xl border border-rizoma-border px-4 py-3 text-rizoma-black"
                  style={{ fontFamily: "Inter_400Regular" }}
                />
              </View>
            </View>
          ) : null}

          <View className="mt-2 gap-3">
            <RizomaButton
              label={
                paying
                  ? "Confirmando…"
                  : paymentMethod === "cod"
                    ? `Confirmar pedido · ${formatPrice(total)}`
                    : `Pagar · ${formatPrice(total)}`
              }
              disabled={paying}
              onPress={confirmOrder}
            />
            <Pressable
              onPress={() => setStep("delivery")}
              accessibilityRole="button"
              accessibilityLabel="Volver al paso anterior"
              disabled={paying}
            >
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
