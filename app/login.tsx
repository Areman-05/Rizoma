import { router } from "expo-router";
import { useState } from "react";
import { Text, TextInput, View } from "react-native";
import { RizomaLogo } from "@/src/components/brand/RizomaLogo";
import { RizomaButton } from "@/src/components/ui/RizomaButton";
import { Screen } from "@/src/components/ui/Screen";

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  return (
    <Screen scroll>
      <View className="mt-8 items-center">
        <RizomaLogo size="lg" />
        <Text className="mt-3 text-center text-rizoma-secondaryText" style={{ fontFamily: "Inter_400Regular" }}>
          Entra para sincronizar favoritos, pedidos y Mi Jardín.
        </Text>
      </View>

      <View className="mt-10 gap-3">
        <TextInput
          value={email}
          onChangeText={(value) => {
            setEmail(value);
            setError(null);
          }}
          placeholder="Email"
          autoCapitalize="none"
          keyboardType="email-address"
          placeholderTextColor="#9CA3AF"
          className="rounded-full border border-rizoma-border bg-white px-4 py-4 text-rizoma-black"
          style={{ fontFamily: "Inter_400Regular" }}
        />
        <TextInput
          value={password}
          onChangeText={setPassword}
          placeholder="Contraseña"
          placeholderTextColor="#9CA3AF"
          secureTextEntry
          className="rounded-full border border-rizoma-border bg-white px-4 py-4 text-rizoma-black"
          style={{ fontFamily: "Inter_400Regular" }}
        />
        {error ? (
          <Text className="text-sm text-rizoma-red" style={{ fontFamily: "Inter_500Medium" }}>
            {error}
          </Text>
        ) : null}
      </View>

      <View className="mt-6">
        <RizomaButton
          label="Continuar"
          onPress={() => {
            if (!email.trim() || !email.includes("@")) {
              setError("Introduce un email válido.");
              return;
            }
            if (!password.trim()) {
              setError("Introduce tu contraseña.");
              return;
            }
            router.replace("/(tabs)");
          }}
        />
      </View>
      <Text
        onPress={() => router.replace("/(tabs)")}
        className="mt-4 text-center text-sm text-rizoma-brand"
        style={{ fontFamily: "Inter_600SemiBold" }}
      >
        Continuar como invitado
      </Text>
    </Screen>
  );
}
