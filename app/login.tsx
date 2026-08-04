import * as AuthSession from "expo-auth-session";
import * as Google from "expo-auth-session/providers/google";
import * as WebBrowser from "expo-web-browser";
import { router } from "expo-router";
import { Lock, Mail } from "lucide-react-native";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  Alert,
  Animated,
  Easing,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { AuthGreenhouseDecor } from "@/src/components/auth/AuthGreenhouseDecor";
import { RizomaMark, leafyLogoColors } from "@/src/components/brand/RizomaLogo";
import { RizomaButton } from "@/src/components/ui/RizomaButton";
import {
  getGoogleAuthRequestConfig,
  getGoogleRedirectUriOptions,
} from "@/src/config/googleAuth";
import { useAuth, userFromGoogleIdToken } from "@/src/context/AuthContext";
import { login as loginLocal, UserStoreError } from "@/src/services/userStore";
import { saveProfileAvatar, saveProfileName } from "@/src/store/persistence";
import { colors, radii, spacing, typography } from "@/src/theme/tokens";

WebBrowser.maybeCompleteAuthSession();

type FieldKey = "email" | "password";

export default function LoginScreen() {
  const { signIn } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [focused, setFocused] = useState<FieldKey | null>(null);
  const handledResponseKey = useRef<string | null>(null);

  const brandOpacity = useRef(new Animated.Value(0)).current;
  const brandTranslate = useRef(new Animated.Value(18)).current;
  const formOpacity = useRef(new Animated.Value(0)).current;
  const formTranslate = useRef(new Animated.Value(22)).current;

  const googleConfig = useMemo(() => getGoogleAuthRequestConfig(), []);
  const redirectOptions = useMemo(() => getGoogleRedirectUriOptions(), []);
  const [request, response, promptAsync] = Google.useAuthRequest(
    googleConfig,
    redirectOptions,
  );

  useEffect(() => {
    const ease = Easing.bezier(0.22, 1, 0.36, 1);
    Animated.stagger(90, [
      Animated.parallel([
        Animated.timing(brandOpacity, {
          toValue: 1,
          duration: 480,
          easing: ease,
          useNativeDriver: true,
        }),
        Animated.timing(brandTranslate, {
          toValue: 0,
          duration: 480,
          easing: ease,
          useNativeDriver: true,
        }),
      ]),
      Animated.parallel([
        Animated.timing(formOpacity, {
          toValue: 1,
          duration: 440,
          easing: ease,
          useNativeDriver: true,
        }),
        Animated.timing(formTranslate, {
          toValue: 0,
          duration: 440,
          easing: ease,
          useNativeDriver: true,
        }),
      ]),
    ]).start();
  }, [brandOpacity, brandTranslate, formOpacity, formTranslate]);

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

  const onSubmit = () => {
    if (busy) return;
    setBusy(true);
    setError(null);
    void (async () => {
      try {
        const user = await loginLocal(email, password);
        await signIn(user);
        await saveProfileName(user.name);
        router.replace("/(tabs)");
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
      "La recuperación aún no está disponible. Crea una cuenta nueva o inicia sesión con Google.",
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

  const iconColor = (key: FieldKey) =>
    focused === key ? colors.brand : leafyLogoColors.leafDeep;

  return (
    <SafeAreaView style={styles.safe} edges={["top", "left", "right", "bottom"]}>
      <AuthGreenhouseDecor />
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={styles.flex}
      >
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          bounces
        >
          <Animated.View
            style={{
              opacity: brandOpacity,
              transform: [{ translateY: brandTranslate }],
            }}
          >
            <View style={styles.brandBlock}>
              <View style={styles.medallionOuter}>
                <View style={styles.logoDisc}>
                  <RizomaMark size={56} />
                </View>
              </View>
              <Text style={styles.wordmark} allowFontScaling={false}>
                Rizoma
              </Text>
              <Text style={styles.tagline}>Tu jardín, en orden.</Text>
            </View>
          </Animated.View>

          <Animated.View
            style={{
              opacity: formOpacity,
              transform: [{ translateY: formTranslate }],
            }}
          >
            <View style={styles.formBlock}>
              <View style={styles.field}>
                <Text style={styles.label}>Correo electrónico</Text>
                <View
                  style={[
                    styles.inputShell,
                    focused === "email" ? styles.inputShellFocused : null,
                  ]}
                >
                  <Mail size={20} color={iconColor("email")} strokeWidth={2.1} />
                  <TextInput
                    value={email}
                    onChangeText={(value) => {
                      setEmail(value);
                      clearError();
                    }}
                    onFocus={() => setFocused("email")}
                    onBlur={() => setFocused(null)}
                    placeholder="tu@email.com"
                    autoCapitalize="none"
                    autoCorrect={false}
                    keyboardType="email-address"
                    textContentType="emailAddress"
                    placeholderTextColor={colors.grayText}
                    accessibilityLabel="Correo electrónico"
                    style={styles.input}
                  />
                </View>
              </View>

              <View style={styles.field}>
                <Text style={styles.label}>Contraseña</Text>
                <View
                  style={[
                    styles.inputShell,
                    focused === "password" ? styles.inputShellFocused : null,
                  ]}
                >
                  <Lock size={20} color={iconColor("password")} strokeWidth={2.1} />
                  <TextInput
                    value={password}
                    onChangeText={(value) => {
                      setPassword(value);
                      clearError();
                    }}
                    onFocus={() => setFocused("password")}
                    onBlur={() => setFocused(null)}
                    placeholder="Tu contraseña"
                    placeholderTextColor={colors.grayText}
                    secureTextEntry
                    textContentType="password"
                    accessibilityLabel="Contraseña"
                    style={styles.input}
                  />
                </View>
              </View>

              <Pressable
                onPress={onForgotPassword}
                accessibilityRole="button"
                accessibilityLabel="¿Olvidaste tu contraseña?"
                style={({ pressed }) => [
                  styles.forgot,
                  { opacity: pressed ? 0.7 : 1 },
                ]}
              >
                <Text style={styles.forgotText}>¿Olvidaste tu contraseña?</Text>
              </Pressable>

              {error ? (
                <View style={styles.errorBox}>
                  <Text style={styles.errorText}>{error}</Text>
                </View>
              ) : null}

              <View style={styles.ctaStack}>
                <RizomaButton
                  label={busy ? "Entrando..." : "Iniciar sesión"}
                  onPress={onSubmit}
                  disabled={busy}
                />
              </View>
            </View>

            <View style={styles.socialPanel}>
              <View style={styles.dividerRow}>
                <View style={styles.dividerLine} />
                <Text style={styles.dividerLabel}>o</Text>
                <View style={styles.dividerLine} />
              </View>

              <RizomaButton
                label={busy ? "Conectando..." : "Continuar con Google"}
                onPress={onGoogle}
                variant="google"
                disabled={busy || !request}
              />
            </View>

            <Pressable
              onPress={() => router.push("/register")}
              disabled={busy}
              accessibilityRole="button"
              accessibilityLabel="No tengo cuenta, crear cuenta"
              hitSlop={8}
              style={({ pressed }) => [
                styles.authLinkRow,
                { opacity: pressed || busy ? 0.65 : 1 },
              ]}
            >
              <Text style={styles.authLinkLine} numberOfLines={1}>
                <Text style={styles.linkMuted}>¿No tienes cuenta? </Text>
                <Text style={styles.linkAccent}>Crear cuenta</Text>
              </Text>
            </Pressable>

            <Text style={styles.legal}>
              Al continuar aceptas los términos de uso.{"\n"}
              La sesión se guarda en este dispositivo.
            </Text>
          </Animated.View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: "#E8F8EF",
  },
  flex: {
    flex: 1,
    zIndex: 1,
  },
  scroll: {
    flex: 1,
    backgroundColor: "transparent",
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: spacing.screenMargin + 10,
    paddingTop: 28,
    paddingBottom: 44,
  },
  brandBlock: {
    alignItems: "center",
    marginBottom: 4,
    zIndex: 1,
  },
  medallionOuter: {
    marginBottom: 18,
    padding: 6,
    borderRadius: radii.pill,
    backgroundColor: "rgba(255, 255, 255, 0.55)",
  },
  logoDisc: {
    height: 92,
    width: 92,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: radii.pill,
    backgroundColor: colors.white,
    borderWidth: 1.5,
    borderColor: colors.brandSoft,
    shadowColor: colors.brand,
    shadowOpacity: 0.22,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 10 },
    elevation: 6,
  },
  wordmark: {
    fontSize: typography.hero + 6,
    lineHeight: typography.hero + 10,
    color: leafyLogoColors.wordmark,
    fontFamily: "Inter_800ExtraBold",
    letterSpacing: -1.2,
    textAlign: "center",
  },
  tagline: {
    marginTop: 8,
    textAlign: "center",
    fontSize: 16,
    lineHeight: 22,
    color: leafyLogoColors.leafDeep,
    fontFamily: "Inter_500Medium",
    letterSpacing: 0.2,
  },
  formBlock: {
    marginTop: 32,
    gap: 18,
    zIndex: 1,
  },
  field: {
    gap: 0,
  },
  label: {
    marginBottom: 8,
    marginLeft: 4,
    fontSize: 12,
    lineHeight: 16,
    color: leafyLogoColors.wordmark,
    fontFamily: "Inter_600SemiBold",
    letterSpacing: 0.8,
    textTransform: "uppercase",
  },
  inputShell: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    borderRadius: radii.xl,
    borderWidth: 1.5,
    borderColor: "rgba(229, 231, 235, 0.95)",
    backgroundColor: "rgba(255, 255, 255, 0.88)",
    paddingHorizontal: 16,
    paddingVertical: Platform.OS === "ios" ? 15 : 4,
    minHeight: 56,
  },
  inputShellFocused: {
    borderColor: colors.brand,
    backgroundColor: colors.white,
    shadowColor: colors.brand,
    shadowOpacity: 0.18,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 0 },
    elevation: 3,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: colors.black,
    fontFamily: "Inter_500Medium",
    paddingVertical: Platform.OS === "ios" ? 0 : 12,
    includeFontPadding: false,
  },
  forgot: {
    alignSelf: "flex-end",
    paddingHorizontal: 2,
    paddingVertical: 2,
    marginTop: -6,
  },
  forgotText: {
    fontSize: 13,
    color: colors.brand,
    fontFamily: "Inter_600SemiBold",
  },
  errorBox: {
    borderRadius: radii.lg,
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "#FEF2F2",
    borderWidth: 1,
    borderColor: "rgba(239, 68, 68, 0.2)",
  },
  errorText: {
    fontSize: 14,
    lineHeight: 20,
    color: colors.red,
    fontFamily: "Inter_500Medium",
  },
  ctaStack: {
    marginTop: 6,
  },
  socialPanel: {
    marginTop: 28,
    gap: 16,
    padding: 18,
    borderRadius: radii.xxl,
    backgroundColor: "#F2FBF6",
    borderWidth: 1,
    borderColor: "rgba(1, 183, 99, 0.08)",
    zIndex: 1,
  },
  dividerRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    paddingHorizontal: 4,
  },
  dividerLine: {
    height: StyleSheet.hairlineWidth,
    flex: 1,
    backgroundColor: "rgba(10, 92, 58, 0.18)",
  },
  dividerLabel: {
    fontSize: 13,
    color: leafyLogoColors.leafDeep,
    fontFamily: "Inter_500Medium",
    letterSpacing: 0.4,
  },
  authLinkRow: {
    marginTop: 36,
    minHeight: 48,
    paddingVertical: 14,
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1,
  },
  authLinkLine: {
    textAlign: "center",
    fontSize: 15,
    lineHeight: 22,
  },
  linkMuted: {
    color: colors.secondaryText,
    fontFamily: "Inter_400Regular",
  },
  linkAccent: {
    color: colors.brand,
    fontFamily: "Inter_700Bold",
  },
  legal: {
    marginTop: 8,
    textAlign: "center",
    fontSize: 12,
    lineHeight: 18,
    color: colors.grayText,
    fontFamily: "Inter_400Regular",
    paddingHorizontal: spacing.md,
    zIndex: 1,
  },
});
