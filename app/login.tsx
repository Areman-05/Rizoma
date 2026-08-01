import { router } from "expo-router";
import { useEffect, useRef, useState } from "react";
import {
  Animated,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  Text,
  TextInput,
  View,
} from "react-native";
import { RizomaLogo } from "@/src/components/brand/RizomaLogo";
import { RizomaButton } from "@/src/components/ui/RizomaButton";
import { Screen } from "@/src/components/ui/Screen";
import { colors } from "@/src/theme/tokens";

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const formOpacity = useRef(new Animated.Value(0)).current;
  const formTranslate = useRef(new Animated.Value(12)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(formOpacity, {
        toValue: 1,
        duration: 380,
        useNativeDriver: true,
      }),
      Animated.timing(formTranslate, {
        toValue: 0,
        duration: 380,
        useNativeDriver: true,
      }),
    ]).start();
  }, [formOpacity, formTranslate]);

  const clearError = () => setError(null);

  const enterApp = () => {
    router.replace("/(tabs)");
  };

  const onSubmit = () => {
    if (busy) return;
    const trimmed = email.trim();
    if (!trimmed || !trimmed.includes("@")) {
      setError("Introduce un correo electrónico válido.");
      return;
    }
    if (!password.trim()) {
      setError("Introduce tu contraseña.");
      return;
    }
    setBusy(true);
    setError(null);
    // Mock auth: breve feedback y entrar.
    setTimeout(() => {
      setBusy(false);
      enterApp();
    }, 450);
  };

  const onGoogle = () => {
    if (busy) return;
    setBusy(true);
    setError(null);
    setTimeout(() => {
      setBusy(false);
      enterApp();
    }, 400);
  };

  return (
    <Screen scroll>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        className="flex-1"
      >
        <Animated.View
          style={{
            opacity: formOpacity,
            transform: [{ translateY: formTranslate }],
          }}
        >
          <View className="mt-6 items-center">
            <View className="mb-5 h-16 w-16 items-center justify-center rounded-full bg-rizoma-brandSoft">
              <RizomaLogo size="md" showWordmark={false} />
            </View>
            <Text className="text-3xl text-rizoma-black" style={{ fontFamily: "Inter_700Bold" }}>
              Rizoma
            </Text>
            <Text
              className="mt-2 px-4 text-center text-base leading-6 text-rizoma-secondaryText"
              style={{ fontFamily: "Inter_400Regular" }}
            >
              Entra para sincronizar favoritos, pedidos y Mi Jardín.
            </Text>
          </View>

          <View className="mt-10 gap-3.5">
            <View>
              <Text
                className="mb-2 ml-1 text-sm text-rizoma-secondaryText"
                style={{ fontFamily: "Inter_500Medium" }}
              >
                Correo electrónico
              </Text>
              <TextInput
                value={email}
                onChangeText={(value) => {
                  setEmail(value);
                  clearError();
                }}
                placeholder="tu@email.com"
                autoCapitalize="none"
                autoCorrect={false}
                keyboardType="email-address"
                textContentType="emailAddress"
                placeholderTextColor={colors.grayText}
                accessibilityLabel="Correo electrónico"
                className="rounded-2xl border border-rizoma-border bg-white px-4 py-4 text-base text-rizoma-black"
                style={{ fontFamily: "Inter_500Medium" }}
              />
            </View>

            <View>
              <Text
                className="mb-2 ml-1 text-sm text-rizoma-secondaryText"
                style={{ fontFamily: "Inter_500Medium" }}
              >
                Contraseña
              </Text>
              <TextInput
                value={password}
                onChangeText={(value) => {
                  setPassword(value);
                  clearError();
                }}
                placeholder="Tu contraseña"
                placeholderTextColor={colors.grayText}
                secureTextEntry
                textContentType="password"
                accessibilityLabel="Contraseña"
                className="rounded-2xl border border-rizoma-border bg-white px-4 py-4 text-base text-rizoma-black"
                style={{ fontFamily: "Inter_500Medium" }}
              />
            </View>

            <Pressable
              onPress={() =>
                setError("Demo: la recuperación de contraseña no está conectada.")
              }
              accessibilityRole="button"
              accessibilityLabel="¿Olvidaste tu contraseña?"
              className="self-end px-1 py-1"
              style={({ pressed }) => ({ opacity: pressed ? 0.7 : 1 })}
            >
              <Text className="text-sm text-rizoma-brand" style={{ fontFamily: "Inter_600SemiBold" }}>
                ¿Olvidaste tu contraseña?
              </Text>
            </Pressable>

            {error ? (
              <View className="rounded-2xl px-4 py-3" style={{ backgroundColor: "#FEF2F2" }}>
                <Text className="text-sm text-rizoma-red" style={{ fontFamily: "Inter_500Medium" }}>
                  {error}
                </Text>
              </View>
            ) : null}
          </View>

          <View className="mt-6 gap-3">
            <RizomaButton
              label={busy ? "Entrando..." : "Iniciar sesión"}
              onPress={onSubmit}
            />

            <View className="my-1 flex-row items-center gap-3">
              <View className="h-px flex-1 bg-rizoma-border" />
              <Text
                className="text-xs text-rizoma-grayText"
                style={{ fontFamily: "Inter_500Medium" }}
              >
                o continúa con
              </Text>
              <View className="h-px flex-1 bg-rizoma-border" />
            </View>

            <Pressable
              onPress={onGoogle}
              disabled={busy}
              accessibilityRole="button"
              accessibilityLabel="Continuar con Google"
              className="items-center rounded-full border border-rizoma-border bg-white px-5 py-4"
              style={({ pressed }) => ({ opacity: pressed || busy ? 0.75 : 1 })}
            >
              <Text
                className="text-base text-rizoma-black"
                style={{ fontFamily: "Inter_600SemiBold" }}
              >
                Continuar con Google
              </Text>
            </Pressable>
          </View>

          <Pressable
            onPress={enterApp}
            disabled={busy}
            accessibilityRole="button"
            accessibilityLabel="Continuar como invitado"
            className="mt-6 items-center py-2"
            style={({ pressed }) => ({ opacity: pressed ? 0.7 : 1 })}
          >
            <Text className="text-sm text-rizoma-brand" style={{ fontFamily: "Inter_600SemiBold" }}>
              Continuar como invitado
            </Text>
          </Pressable>

          <Text
            className="mt-8 text-center text-xs leading-5 text-rizoma-grayText"
            style={{ fontFamily: "Inter_400Regular" }}
          >
            Al continuar aceptas los términos de la demo Rizoma.{"\n"}
            No hay backend real: el acceso es simulado.
          </Text>
        </Animated.View>
      </KeyboardAvoidingView>
    </Screen>
  );
}
