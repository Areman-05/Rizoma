import { router } from "expo-router";
import { useRef, useState } from "react";
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
import { useAuth } from "@/src/context/AuthContext";
import { register as registerLocal, UserStoreError } from "@/src/services/userStore";
import { saveProfileName } from "@/src/store/persistence";
import { colors } from "@/src/theme/tokens";

export default function RegisterScreen() {
  const { signIn } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const formOpacity = useRef(new Animated.Value(1)).current;

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

  const fieldLabel = (label: string) => (
    <Text
      style={{
        marginBottom: 8,
        marginLeft: 4,
        fontSize: 14,
        color: colors.secondaryText,
        fontFamily: "Inter_500Medium",
      }}
    >
      {label}
    </Text>
  );

  const inputStyle = {
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.white,
    paddingHorizontal: 16,
    paddingVertical: 16,
    fontSize: 16,
    color: colors.black,
    fontFamily: "Inter_500Medium" as const,
  };

  return (
    <Screen scroll>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={{ flex: 1 }}
      >
        <Animated.View style={{ opacity: formOpacity, paddingBottom: 24 }}>
          <View style={{ marginTop: 16, alignItems: "center" }}>
            <View
              style={{
                marginBottom: 16,
                height: 56,
                width: 56,
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
                fontSize: 28,
                color: colors.black,
                fontFamily: "Inter_700Bold",
              }}
            >
              Crear cuenta
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
              Tu cuenta se guarda en este dispositivo (demo local).
            </Text>
          </View>

          <View style={{ marginTop: 28, gap: 14 }}>
            <View>
              {fieldLabel("Nombre")}
              <TextInput
                value={name}
                onChangeText={(value) => {
                  setName(value);
                  clearError();
                }}
                placeholder="Tu nombre"
                autoCapitalize="words"
                textContentType="name"
                placeholderTextColor={colors.grayText}
                accessibilityLabel="Nombre"
                style={inputStyle}
              />
            </View>

            <View>
              {fieldLabel("Correo electrónico")}
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
                style={inputStyle}
              />
            </View>

            <View>
              {fieldLabel("Contraseña")}
              <TextInput
                value={password}
                onChangeText={(value) => {
                  setPassword(value);
                  clearError();
                }}
                placeholder="Mínimo 6 caracteres"
                placeholderTextColor={colors.grayText}
                secureTextEntry
                textContentType="newPassword"
                accessibilityLabel="Contraseña"
                style={inputStyle}
              />
            </View>

            <View>
              {fieldLabel("Confirmar contraseña")}
              <TextInput
                value={confirmPassword}
                onChangeText={(value) => {
                  setConfirmPassword(value);
                  clearError();
                }}
                placeholder="Repite la contraseña"
                placeholderTextColor={colors.grayText}
                secureTextEntry
                textContentType="newPassword"
                accessibilityLabel="Confirmar contraseña"
                style={inputStyle}
              />
            </View>

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

            <RizomaButton
              label={busy ? "Creando cuenta..." : "Crear cuenta"}
              onPress={onSubmit}
              disabled={busy}
            />
          </View>

          <Pressable
            onPress={() => router.back()}
            disabled={busy}
            accessibilityRole="button"
            accessibilityLabel="Ya tengo cuenta, iniciar sesión"
            style={({ pressed }) => ({
              marginTop: 20,
              alignItems: "center",
              paddingVertical: 8,
              opacity: pressed || busy ? 0.7 : 1,
            })}
          >
            <Text
              style={{
                fontSize: 14,
                color: colors.brand,
                fontFamily: "Inter_600SemiBold",
              }}
            >
              ¿Ya tienes cuenta? Iniciar sesión
            </Text>
          </Pressable>
        </Animated.View>
      </KeyboardAvoidingView>
    </Screen>
  );
}
