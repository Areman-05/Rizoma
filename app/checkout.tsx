import { router } from "expo-router";
import { useState } from "react";
import { Pressable, Text, TextInput, View } from "react-native";
import { RizomaButton } from "@/src/components/ui/RizomaButton";
import { useShop } from "@/src/store/ShopContext";

type Step = "address" | "delivery" | "payment" | "success";

export default function CheckoutScreen() {
  const { cart, cartTotal, clearCart } = useShop();
  const [step, setStep] = useState<Step>("address");
  const [address, setAddress] = useState("Calle Verde 12, Madrid");

  if (cart.length === 0 && step !== "success") {
    return (
      <View className="flex-1 items-center justify-center bg-rizoma-canvas px-6">
        <Text className="mb-4 text-center text-rizoma-secondaryText">No hay productos para pagar.</Text>
        <RizomaButton label="Volver al catalogo" onPress={() => router.replace("/(tabs)/explore")} />
      </View>
    );
  }

  if (step === "success") {
    return (
      <View className="flex-1 items-center justify-center bg-rizoma-canvas px-6">
        <Text className="text-3xl font-bold text-rizoma-primary">Pedido confirmado</Text>
        <Text className="mt-3 text-center text-rizoma-secondaryText">
          Gracias por comprar en Rizoma. Tu pedido esta en preparacion.
        </Text>
        <View className="mt-6 w-full">
          <RizomaButton label="Ver pedidos" onPress={() => router.replace("/orders")} />
        </View>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-rizoma-canvas px-5 pt-14">
      <Text className="text-3xl font-bold text-rizoma-primary">Checkout</Text>
      <Text className="mt-1 text-rizoma-secondaryText">
        Paso: {step === "address" ? "1/3 Direccion" : step === "delivery" ? "2/3 Entrega" : "3/3 Pago"}
      </Text>

      <View className="mt-6 rounded-3xl bg-white p-5">
        <Text className="font-semibold text-rizoma-primary">Total: {cartTotal.toFixed(2)} EUR</Text>
        <Text className="mt-1 text-rizoma-secondaryText">{cart.length} lineas en el carrito</Text>
      </View>

      {step === "address" ? (
        <View className="mt-5 rounded-3xl bg-white p-5">
          <Text className="mb-2 font-medium text-rizoma-primary">Direccion de entrega</Text>
          <TextInput
            value={address}
            onChangeText={setAddress}
            className="rounded-2xl border border-rizoma-border px-4 py-3 text-rizoma-primary"
          />
          <View className="mt-4">
            <RizomaButton label="Continuar" onPress={() => setStep("delivery")} />
          </View>
        </View>
      ) : null}

      {step === "delivery" ? (
        <View className="mt-5 gap-3">
          <Pressable className="rounded-3xl bg-white p-5" onPress={() => setStep("payment")}>
            <Text className="font-semibold text-rizoma-primary">Entrega estandar (3-5 dias)</Text>
            <Text className="text-rizoma-secondaryText">Gratis en pedidos +40 EUR</Text>
          </Pressable>
          <Pressable className="rounded-3xl bg-white p-5" onPress={() => setStep("payment")}>
            <Text className="font-semibold text-rizoma-primary">Entrega express (24-48h)</Text>
            <Text className="text-rizoma-secondaryText">+6.90 EUR</Text>
          </Pressable>
        </View>
      ) : null}

      {step === "payment" ? (
        <View className="mt-5 rounded-3xl bg-white p-5">
          <Text className="font-semibold text-rizoma-primary">Pago simulado</Text>
          <Text className="mt-2 text-rizoma-secondaryText">
            Demo portfolio: confirmamos el pedido sin cargo real.
          </Text>
          <View className="mt-4">
            <RizomaButton
              label="Confirmar pedido"
              onPress={() => {
                clearCart();
                setStep("success");
              }}
            />
          </View>
        </View>
      ) : null}
    </View>
  );
}
