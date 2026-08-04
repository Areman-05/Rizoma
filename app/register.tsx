import { router } from "expo-router";
import { ChevronLeft, Lock, Mail, User } from "lucide-react-native";
import { useState } from "react";
import { Keyboard, Pressable, Text, View } from "react-native";
import { AuthBrandHeader } from "@/src/components/auth/AuthBrandHeader";
import { AuthScreenShell } from "@/src/components/auth/AuthScreenShell";
import { AuthTextField, authIconColor } from "@/src/components/auth/AuthTextField";
import { authStyles } from "@/src/components/auth/authStyles";
import { leafyLogoColors } from "@/src/components/brand/RizomaLogo";
import { CircularIconButton } from "@/src/components/ui/CircularIconButton";
import { RizomaButton } from "@/src/components/ui/RizomaButton";
import { useAuth } from "@/src/context/AuthContext";
import {
  PASSWORD_HINT,
  register as registerLocal,
  UserStoreError,
} from "@/src/services/userStore";
import { saveProfileName } from "@/src/store/persistence";

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

  const onSubmit = () => {
    if (busy) return;
    Keyboard.dismiss();
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
        router.replace("/");
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

  return (
    <AuthScreenShell
      contentContainerStyle={authStyles.scrollContentRegister}
      header={
        <View style={authStyles.topBar}>
          <CircularIconButton
            onPress={() => router.back()}
            accessibilityLabel="Volver a iniciar sesión"
            size={44}
          >
            <ChevronLeft size={22} color={leafyLogoColors.wordmark} strokeWidth={2.2} />
          </CircularIconButton>
        </View>
      }
    >
      <AuthBrandHeader compact hint="Crea tu cuenta para empezar" />

      <View style={authStyles.formBlockCompact}>
        <AuthTextField
          label="Nombre"
          compactSpacing
          focused={focused === "name"}
          icon={<User size={20} color={authIconColor(focused === "name")} strokeWidth={2.1} />}
          value={name}
          onChangeText={(value) => {
            setName(value);
            if (error) setError(null);
          }}
          onFocus={() => setFocused("name")}
          onBlur={() => setFocused((f) => (f === "name" ? null : f))}
          placeholder="Tu nombre"
          autoCapitalize="words"
          textContentType="name"
          accessibilityLabel="Nombre"
          editable={!busy}
        />

        <AuthTextField
          label="Correo electrónico"
          spaced
          compactSpacing
          focused={focused === "email"}
          icon={<Mail size={20} color={authIconColor(focused === "email")} strokeWidth={2.1} />}
          value={email}
          onChangeText={(value) => {
            setEmail(value);
            if (error) setError(null);
          }}
          onFocus={() => setFocused("email")}
          onBlur={() => setFocused((f) => (f === "email" ? null : f))}
          placeholder="tu@email.com"
          autoCapitalize="none"
          autoCorrect={false}
          keyboardType="email-address"
          textContentType="emailAddress"
          accessibilityLabel="Correo electrónico"
          editable={!busy}
        />

        <AuthTextField
          label="Contraseña"
          spaced
          compactSpacing
          focused={focused === "password"}
          icon={<Lock size={20} color={authIconColor(focused === "password")} strokeWidth={2.1} />}
          value={password}
          onChangeText={(value) => {
            setPassword(value);
            if (error) setError(null);
          }}
          onFocus={() => setFocused("password")}
          onBlur={() => setFocused((f) => (f === "password" ? null : f))}
          placeholder="Crea una contraseña segura"
          secureTextEntry
          textContentType="newPassword"
          accessibilityLabel="Contraseña"
          editable={!busy}
        />
        <Text style={authStyles.hint}>{PASSWORD_HINT}</Text>

        <AuthTextField
          label="Confirmar contraseña"
          spaced
          compactSpacing
          focused={focused === "confirm"}
          icon={<Lock size={20} color={authIconColor(focused === "confirm")} strokeWidth={2.1} />}
          value={confirmPassword}
          onChangeText={(value) => {
            setConfirmPassword(value);
            if (error) setError(null);
          }}
          onFocus={() => setFocused("confirm")}
          onBlur={() => setFocused((f) => (f === "confirm" ? null : f))}
          placeholder="Repite la contraseña"
          secureTextEntry
          textContentType="newPassword"
          accessibilityLabel="Confirmar contraseña"
          editable={!busy}
        />

        {error ? (
          <View style={authStyles.errorBox}>
            <Text style={authStyles.errorText}>{error}</Text>
          </View>
        ) : null}

        <View style={authStyles.ctaStack}>
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
        focusable={false}
        hitSlop={8}
        style={({ pressed }) => [
          authStyles.authLinkRow,
          { opacity: pressed || busy ? 0.65 : 1 },
        ]}
      >
        <Text style={authStyles.authLinkLine} numberOfLines={1}>
          <Text style={authStyles.linkMuted}>¿Ya tienes cuenta? </Text>
          <Text style={authStyles.linkAccent}>Iniciar sesión</Text>
        </Text>
      </Pressable>

      <Text style={authStyles.legal}>
        Al crear la cuenta aceptas los términos de uso.{"\n"}
        Los datos se guardan solo en este dispositivo.
      </Text>
    </AuthScreenShell>
  );
}
