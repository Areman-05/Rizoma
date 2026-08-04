import { router } from "expo-router";
import { ChevronLeft, Lock, Mail, User } from "lucide-react-native";
import { useEffect, useRef, useState } from "react";
import {
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
import { CircularIconButton } from "@/src/components/ui/CircularIconButton";
import { RizomaButton } from "@/src/components/ui/RizomaButton";
import { useAuth } from "@/src/context/AuthContext";
import {
  PASSWORD_HINT,
  register as registerLocal,
  UserStoreError,
} from "@/src/services/userStore";
import { saveProfileName } from "@/src/store/persistence";
import { colors, radii, spacing, typography } from "@/src/theme/tokens";

type FieldKey = "name" | "email" | "password" | "confirm";

export default function RegisterScreen() {
  const { signIn } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [focused, setFocused] = useState<FieldKey | null>(null);

  const brandOpacity = useRef(new Animated.Value(0)).current;
  const brandTranslate = useRef(new Animated.Value(18)).current;
  const formOpacity = useRef(new Animated.Value(0)).current;
  const formTranslate = useRef(new Animated.Value(22)).current;

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

  const clearError = () => setError(null);

  const onSubmit = () => {
    if (busy) return;
    setBusy(true);
    setError(null);
    void (async () => {
      try {
        const user = await registerLocal({
          name,
          email,
          password,
          confirmPassword,
        });
        await signIn(user);
        await saveProfileName(user.name);
        router.replace("/(tabs)");
      } catch (err) {
        const message =
          err instanceof UserStoreError
            ? err.message
            : "No se pudo crear la cuenta. Inténtalo de nuevo.";
        setError(message);
      } finally {
        setBusy(false);
      }
    })();
  };

  const iconColor = (key: FieldKey) =>
    focused === key ? colors.brand : leafyLogoColors.leafDeep;

  return (
    <SafeAreaView style={styles.safe} edges={["top", "left", "right", "bottom"]}>
      <AuthGreenhouseDecor />
      <View style={styles.topBar}>
        <CircularIconButton
          onPress={() => router.back()}
          accessibilityLabel="Volver a iniciar sesión"
          size={44}
        >
          <ChevronLeft size={22} color={leafyLogoColors.wordmark} strokeWidth={2.2} />
        </CircularIconButton>
      </View>
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
                  <RizomaMark size={52} />
                </View>
              </View>
              <Text style={styles.wordmark} allowFontScaling={false}>
                Rizoma
              </Text>
              <Text style={styles.tagline}>Tu jardín, en orden.</Text>
              <Text style={styles.screenHint}>Crea tu cuenta para empezar</Text>
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
                <Text style={styles.label}>Nombre</Text>
                <View
                  style={[
                    styles.inputShell,
                    focused === "name" ? styles.inputShellFocused : null,
                  ]}
                >
                  <User size={20} color={iconColor("name")} strokeWidth={2.1} />
                  <TextInput
                    value={name}
                    onChangeText={(value) => {
                      setName(value);
                      clearError();
                    }}
                    onFocus={() => setFocused("name")}
                    onBlur={() => setFocused(null)}
                    placeholder="Tu nombre"
                    autoCapitalize="words"
                    textContentType="name"
                    placeholderTextColor={colors.grayText}
                    accessibilityLabel="Nombre"
                    style={styles.input}
                  />
                </View>
              </View>

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
                    placeholder="Crea una contraseña segura"
                    placeholderTextColor={colors.grayText}
                    secureTextEntry
                    textContentType="newPassword"
                    accessibilityLabel="Contraseña"
                    style={styles.input}
                  />
                </View>
                <Text style={styles.hint}>{PASSWORD_HINT}</Text>
              </View>

              <View style={styles.field}>
                <Text style={styles.label}>Confirmar contraseña</Text>
                <View
                  style={[
                    styles.inputShell,
                    focused === "confirm" ? styles.inputShellFocused : null,
                  ]}
                >
                  <Lock size={20} color={iconColor("confirm")} strokeWidth={2.1} />
                  <TextInput
                    value={confirmPassword}
                    onChangeText={(value) => {
                      setConfirmPassword(value);
                      clearError();
                    }}
                    onFocus={() => setFocused("confirm")}
                    onBlur={() => setFocused(null)}
                    placeholder="Repite la contraseña"
                    placeholderTextColor={colors.grayText}
                    secureTextEntry
                    textContentType="newPassword"
                    accessibilityLabel="Confirmar contraseña"
                    style={styles.input}
                  />
                </View>
              </View>

              {error ? (
                <View style={styles.errorBox}>
                  <Text style={styles.errorText}>{error}</Text>
                </View>
              ) : null}

              <View style={styles.ctaStack}>
                <RizomaButton
                  label={busy ? "Creando cuenta..." : "Crear cuenta"}
                  onPress={onSubmit}
                  disabled={busy}
                />
              </View>
            </View>

            <Pressable
              onPress={() => router.back()}
              disabled={busy}
              accessibilityRole="button"
              accessibilityLabel="Ya tengo cuenta, iniciar sesión"
              hitSlop={8}
              style={({ pressed }) => [
                styles.authLinkRow,
                { opacity: pressed || busy ? 0.65 : 1 },
              ]}
            >
              <Text style={styles.authLinkLine} numberOfLines={1}>
                <Text style={styles.linkMuted}>¿Ya tienes cuenta? </Text>
                <Text style={styles.linkAccent}>Iniciar sesión</Text>
              </Text>
            </Pressable>

            <Text style={styles.legal}>
              Al crear la cuenta aceptas los términos de uso.{"\n"}
              Los datos se guardan solo en este dispositivo.
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
  topBar: {
    zIndex: 2,
    paddingHorizontal: spacing.screenMargin + 6,
    paddingTop: 4,
    paddingBottom: 4,
    alignItems: "flex-start",
  },
  scroll: {
    flex: 1,
    backgroundColor: "transparent",
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: spacing.screenMargin + 10,
    paddingTop: 8,
    paddingBottom: 44,
  },
  brandBlock: {
    alignItems: "center",
    marginBottom: 4,
    zIndex: 1,
  },
  medallionOuter: {
    marginBottom: 16,
    padding: 6,
    borderRadius: radii.pill,
    backgroundColor: "rgba(255, 255, 255, 0.55)",
  },
  logoDisc: {
    height: 86,
    width: 86,
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
    fontSize: typography.hero + 4,
    lineHeight: typography.hero + 8,
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
  screenHint: {
    marginTop: 6,
    textAlign: "center",
    fontSize: 14,
    lineHeight: 20,
    color: colors.secondaryText,
    fontFamily: "Inter_400Regular",
  },
  formBlock: {
    marginTop: 28,
    gap: 16,
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
  hint: {
    marginTop: 8,
    marginLeft: 4,
    fontSize: 12,
    lineHeight: 17,
    color: colors.grayText,
    fontFamily: "Inter_400Regular",
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
