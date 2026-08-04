import * as AuthSession from "expo-auth-session";
import * as Google from "expo-auth-session/providers/google";
import * as WebBrowser from "expo-web-browser";
import { router } from "expo-router";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  Alert,
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
import { login as loginLocal, UserStoreError } from "@/src/services/userStore";
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
    setBusy(true);
    setError(null);
    void (async () => {
      try {
        const user = await loginLocal(email, password);
        await signIn(user);
        await saveProfileName(user.name);
        enterApp();
      } catch (err) {
        const message =
          err instanceof UserStoreError
            ? err.message
            : "No se pudo iniciar sesión. Inténtalo de nuevo.";
        setError(message);
      } finally {
        setBusy(false);
      }
    })();
  };

  const onForgotPassword = () => {
    Alert.alert(
      "Recuperar contraseña",
      "En la demo no hay recuperación real. Crea una cuenta nueva o continúa como invitado.",
    );
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
        style={{ flex: 1 }}
      >
        <Animated.View
          style={{
            opacity: formOpacity,
            transform: [{ translateY: formTranslate }],
            paddingBottom: 24,
          }}
        >
          <View style={{ marginTop: 24, alignItems: "center" }}>
            <View
              style={{
                marginBottom: 20,
                height: 64,
                width: 64,
                alignItems: "center",
                justifyContent: "center",
                borderRadius: 999,
                backgroundColor: colors.brandSoft,
              }}
            >
              <RizomaLogo size="md" showWordmark={false} />
            </View>
            <Text
              style={{
                fontSize: 30,
                color: colors.black,
                fontFamily: "Inter_700Bold",
              }}
            >
              Rizoma
            </Text>
            <Text
              style={{
                marginTop: 8,
                paddingHorizontal: 16,
                textAlign: "center",
                fontSize: 15,
                lineHeight: 22,
                color: colors.secondaryText,
                fontFamily: "Inter_400Regular",
              }}
            >
              Entra con tu cuenta o con Google. También puedes continuar como invitado.
            </Text>
          </View>

          <View style={{ marginTop: 32, gap: 14 }}>
            <View>
              <Text
                style={{
                  marginBottom: 8,
                  marginLeft: 4,
                  fontSize: 14,
                  color: colors.secondaryText,
                  fontFamily: "Inter_500Medium",
                }}
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
                style={{
                  borderRadius: 16,
                  borderWidth: 1,
                  borderColor: colors.border,
                  backgroundColor: colors.white,
                  paddingHorizontal: 16,
                  paddingVertical: 16,
                  fontSize: 16,
                  color: colors.black,
                  fontFamily: "Inter_500Medium",
                }}
              />
            </View>

            <View>
              <Text
                style={{
                  marginBottom: 8,
                  marginLeft: 4,
                  fontSize: 14,
                  color: colors.secondaryText,
                  fontFamily: "Inter_500Medium",
                }}
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
                style={{
                  borderRadius: 16,
                  borderWidth: 1,
                  borderColor: colors.border,
                  backgroundColor: colors.white,
                  paddingHorizontal: 16,
                  paddingVertical: 16,
                  fontSize: 16,
                  color: colors.black,
                  fontFamily: "Inter_500Medium",
                }}
              />
            </View>

            <Pressable
              onPress={onForgotPassword}
              accessibilityRole="button"
              accessibilityLabel="¿Olvidaste tu contraseña?"
              style={({ pressed }) => ({
                alignSelf: "flex-end",
                paddingHorizontal: 4,
                paddingVertical: 4,
                opacity: pressed ? 0.7 : 1,
              })}
            >
              <Text
                style={{
                  fontSize: 14,
                  color: colors.brand,
                  fontFamily: "Inter_600SemiBold",
                }}
              >
                ¿Olvidaste tu contraseña?
              </Text>
            </Pressable>

            {error ? (
              <View
                style={{
                  borderRadius: 16,
                  paddingHorizontal: 16,
                  paddingVertical: 12,
                  backgroundColor: "#FEF2F2",
                }}
              >
                <Text
                  style={{
                    fontSize: 14,
                    color: colors.red,
                    fontFamily: "Inter_500Medium",
                  }}
                >
                  {error}
                </Text>
              </View>
            ) : null}

            {/* CTA primario: estilos inline para que no se pierda en el emulador */}
            <RizomaButton
              label={busy ? "Entrando..." : "Iniciar sesión"}
              onPress={onSubmit}
              disabled={busy}
            />

            <Pressable
              onPress={() => router.push("/register")}
              disabled={busy}
              accessibilityRole="button"
              accessibilityLabel="Crear cuenta"
              style={({ pressed }) => ({
                alignItems: "center",
                paddingVertical: 10,
                opacity: pressed || busy ? 0.7 : 1,
              })}
            >
              <Text
                style={{
                  fontSize: 15,
                  color: colors.brand,
                  fontFamily: "Inter_600SemiBold",
                }}
              >
                Crear cuenta
              </Text>
            </Pressable>
          </View>

          <View style={{ marginTop: 20, gap: 12 }}>
            <View
              style={{
                marginVertical: 4,
                flexDirection: "row",
                alignItems: "center",
                gap: 12,
              }}
            >
              <View style={{ height: 1, flex: 1, backgroundColor: colors.border }} />
              <Text
                style={{
                  fontSize: 12,
                  color: colors.grayText,
                  fontFamily: "Inter_500Medium",
                }}
              >
                o continúa con
              </Text>
              <View style={{ height: 1, flex: 1, backgroundColor: colors.border }} />
            </View>

            <Pressable
              onPress={onGoogle}
              disabled={busy || !request}
              accessibilityRole="button"
              accessibilityLabel="Continuar con Google"
              style={({ pressed }) => ({
                alignItems: "center",
                borderRadius: 999,
                borderWidth: 1,
                borderColor: colors.border,
                backgroundColor: colors.white,
                minHeight: 56,
                paddingHorizontal: 20,
                paddingVertical: 16,
                justifyContent: "center",
                opacity: pressed || busy || !request ? 0.75 : 1,
              })}
            >
              <Text
                style={{
                  fontSize: 16,
                  color: colors.black,
                  fontFamily: "Inter_600SemiBold",
                }}
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
            style={({ pressed }) => ({
              marginTop: 20,
              alignItems: "center",
              paddingVertical: 8,
              opacity: pressed ? 0.7 : 1,
            })}
          >
            <Text
              style={{
                fontSize: 14,
                color: colors.brand,
                fontFamily: "Inter_600SemiBold",
              }}
            >
              Continuar como invitado
            </Text>
          </Pressable>

          <Text
            style={{
              marginTop: 24,
              textAlign: "center",
              fontSize: 12,
              lineHeight: 18,
              color: colors.grayText,
              fontFamily: "Inter_400Regular",
            }}
          >
            Al continuar aceptas los términos de la demo Rizoma.{"\n"}
            Google Sign-In es real; las cuentas email se guardan solo en este dispositivo.
          </Text>
        </Animated.View>
      </KeyboardAvoidingView>
    </Screen>
  );
}
