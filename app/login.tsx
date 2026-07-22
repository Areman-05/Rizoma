import { router } from "expo-router";
import { Text, TextInput, View } from "react-native";
import { RizomaLogo } from "@/src/components/brand/RizomaLogo";
import { RizomaButton } from "@/src/components/ui/RizomaButton";
import { Screen } from "@/src/components/ui/Screen";

export default function LoginScreen() {
  return (
    <Screen scroll>
      <View className="mt-8 items-center">
        <RizomaLogo size="lg" />
        <Text className="mt-3 text-center text-rizoma-secondaryText" style={{ fontFamily: "Inter_400Regular" }}>
          Entra para sincronizar wishlist, pedidos y Mi Jardin.
        </Text>
      </View>

      <View className="mt-10 gap-3">
        <TextInput
          placeholder="Email"
          placeholderTextColor="#9CA3AF"
          className="rounded-full border border-rizoma-border bg-white px-4 py-4 text-rizoma-black"
          style={{ fontFamily: "Inter_400Regular" }}
        />
        <TextInput
          placeholder="Contrasena"
          placeholderTextColor="#9CA3AF"
          secureTextEntry
          className="rounded-full border border-rizoma-border bg-white px-4 py-4 text-rizoma-black"
          style={{ fontFamily: "Inter_400Regular" }}
        />
      </View>

      <View className="mt-6">
        <RizomaButton label="Continuar" onPress={() => router.replace("/(tabs)")} />
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
