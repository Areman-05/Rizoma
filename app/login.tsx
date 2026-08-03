import * as AuthSession from "expo-auth-session";
import * as Google from "expo-auth-session/providers/google";
import * as WebBrowser from "expo-web-browser";
import { router } from "expo-router";
import { useEffect, useMemo, useRef, useState } from "react";
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
import {
  getGoogleAuthRequestConfig,
  getGoogleRedirectUriOptions,
} from "@/src/config/googleAuth";
import { useAuth, userFromGoogleIdToken } from "@/src/context/AuthContext";
import { saveProfileAvatar, saveProfileName } from "@/src/store/persistence";
import { colors } from "@/src/theme/tokens";

WebBrowser.maybeCompleteAuthSession();

export default function LoginScreen() {
  const { signIn } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const handledResponseKey = useRef<string | null>(null);

  const formOpacity = useRef(new Animated.Value(0)).current;
  const formTranslate = useRef(new Animated.Value(12)).current;

  const googleConfig = useMemo(() => getGoogleAuthRequestConfig(), []);
  const redirectOptions = useMemo(() => getGoogleRedirectUriOptions(), []);
  const [request, response, promptAsync] = Google.useAuthRequest(
    googleConfig,
    redirectOptions,
  );

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

  useEffect(() => {
    if (!__DEV__) return;
    const redirectUri =
      request?.redirectUri ??
      AuthSession.makeRedirectUri({
        scheme: "rizoma",
        path: "oauthredirect",
      });
    console.log(
      "[Rizoma Google Auth] Añade este redirect URI en Google Cloud Console (Web client → Authorized redirect URIs):",
      redirectUri,
    );
    console.log(
      "[Rizoma Google Auth] También autoriza: rizoma://  y  rizoma://oauthredirect",
    );
  }, [request?.redirectUri]);

  useEffect(() => {
    if (!response) return;

    const responseKey =
      response.type === "success"
        ? `success:${response.params.id_token ?? response.params.code ?? ""}`
        : response.type === "error"
          ? `error:${response.errorCode ?? response.params.error ?? ""}`
          : response.type;
    if (handledResponseKey.current === responseKey) return;
    handledResponseKey.current = responseKey;

    const finish = () => setBusy(false);

    if (response.type === "success") {
      const idToken = response.params.id_token;
      if (!idToken) {
        setError(
          "Google no devolvió un id_token. Revisa que el Web client tenga el redirect URI correcto.",
        );
        finish();
        return;
      }

      try {
        const user = userFromGoogleIdToken(idToken);
        void (async () => {
          try {
            await signIn(user);
            if (user.name) await saveProfileName(user.name);
            if (user.picture) await saveProfileAvatar(user.picture);
            router.replace("/(tabs)");
          } catch {
            setError("No se pudo guardar la sesión. Inténtalo de nuevo.");
          } finally {
            finish();
          }
        })();
      } catch {
        setError("No se pudo leer el perfil de Google. Inténtalo de nuevo.");
        finish();
      }
      return;
    }

    if (response.type === "dismiss" || response.type === "cancel") {
      setError("Inicio de sesión con Google cancelado.");
      finish();
      return;
    }

    if (response.type === "error") {
      const detail =
        response.error?.message ||
        response.params.error_description ||
        response.params.error ||
        response.errorCode ||
        "Error desconocido";
      setError(`No se pudo iniciar sesión con Google: ${detail}`);
      finish();
      return;
    }

    finish();
  }, [response, signIn]);

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
    const mockName = trimmed.split("@")[0] || "Usuario";
    void (async () => {
      try {
        await signIn({
          id: `email:${trimmed.toLowerCase()}`,
          email: trimmed,
          name: mockName,
          provider: "email",
        });
        await saveProfileName(mockName);
        enterApp();
      } catch {
        setError("No se pudo guardar la sesión. Inténtalo de nuevo.");
      } finally {
        setBusy(false);
      }
    })();
  };

  const onGoogle = async () => {
    if (busy) return;
    if (!request) {
      setError("Google Sign-In aún se está preparando. Espera un segundo.");
      return;
    }
    setBusy(true);
    setError(null);
    try {
      await promptAsync();
      // El resultado se procesa en el effect de `response`.
    } catch {
      setBusy(false);
      setError("No se pudo abrir el flujo de Google. Inténtalo de nuevo.");
    }
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
              disabled={busy || !request}
              accessibilityRole="button"
              accessibilityLabel="Continuar con Google"
              className="items-center rounded-full border border-rizoma-border bg-white px-5 py-4"
              style={({ pressed }) => ({
                opacity: pressed || busy || !request ? 0.75 : 1,
              })}
            >
              <Text
                className="text-base text-rizoma-black"
                style={{ fontFamily: "Inter_600SemiBold" }}
              >
                {busy ? "Conectando con Google..." : "Continuar con Google"}
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
            Google Sign-In es real; el acceso por email/contraseña es simulado.
          </Text>
        </Animated.View>
      </KeyboardAvoidingView>
    </Screen>
  );
}
