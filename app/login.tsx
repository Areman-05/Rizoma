import * as AuthSession from "expo-auth-session";
import * as Google from "expo-auth-session/providers/google";
import * as WebBrowser from "expo-web-browser";
import { router } from "expo-router";
import { Lock, Mail } from "lucide-react-native";
import { useEffect, useMemo, useRef, useState } from "react";
import { Alert, Keyboard, Pressable, Text, View } from "react-native";
import { AuthBrandHeader } from "@/src/components/auth/AuthBrandHeader";
import { AuthScreenShell } from "@/src/components/auth/AuthScreenShell";
import { AuthTextField, authIconColor } from "@/src/components/auth/AuthTextField";
import { authStyles } from "@/src/components/auth/authStyles";
import { RizomaButton } from "@/src/components/ui/RizomaButton";
import {
  getGoogleAuthRequestConfig,
  getGoogleRedirectUriOptions,
} from "@/src/config/googleAuth";
import { useAuth, userFromGoogleIdToken } from "@/src/context/AuthContext";
import { login as loginLocal, UserStoreError } from "@/src/services/userStore";
import { saveProfileAvatar, saveProfileName } from "@/src/store/persistence";

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

  const googleConfig = useMemo(() => getGoogleAuthRequestConfig(), []);
  const redirectOptions = useMemo(() => getGoogleRedirectUriOptions(), []);
  const [request, response, promptAsync] = Google.useAuthRequest(
    googleConfig,
    redirectOptions,
  );

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
            // Index + AppGate eligen home u onboarding.
            router.replace("/");
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

  const onSubmit = () => {
    if (busy) return;
    Keyboard.dismiss();
    setBusy(true);
    setError(null);
    void (async () => {
      try {
        const user = await loginLocal(email, password);
        await signIn(user);
        await saveProfileName(user.name);
        router.replace("/");
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
    Keyboard.dismiss();
    setBusy(true);
    setError(null);
    try {
      await promptAsync();
    } catch {
      setBusy(false);
      setError("No se pudo abrir el flujo de Google. Inténtalo de nuevo.");
    }
  };

  return (
    <AuthScreenShell>
      <AuthBrandHeader />

      <View style={authStyles.formBlock}>
        <AuthTextField
          label="Correo electrónico"
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
          autoComplete="email"
          keyboardType="email-address"
          textContentType="emailAddress"
          returnKeyType="next"
          accessibilityLabel="Correo electrónico"
          editable={!busy}
        />

        <AuthTextField
          label="Contraseña"
          spaced
          focused={focused === "password"}
          icon={<Lock size={20} color={authIconColor(focused === "password")} strokeWidth={2.1} />}
          value={password}
          onChangeText={(value) => {
            setPassword(value);
            if (error) setError(null);
          }}
          onFocus={() => setFocused("password")}
          onBlur={() => setFocused((f) => (f === "password" ? null : f))}
          placeholder="Tu contraseña"
          secureTextEntry
          autoComplete="password"
          textContentType="password"
          returnKeyType="done"
          onSubmitEditing={onSubmit}
          accessibilityLabel="Contraseña"
          editable={!busy}
        />

        <Pressable
          onPress={onForgotPassword}
          accessibilityRole="button"
          accessibilityLabel="¿Olvidaste tu contraseña?"
          focusable={false}
          style={({ pressed }) => [authStyles.forgot, { opacity: pressed ? 0.7 : 1 }]}
        >
          <Text style={authStyles.forgotText}>¿Olvidaste tu contraseña?</Text>
        </Pressable>

        {error ? (
          <View style={authStyles.errorBox}>
            <Text style={authStyles.errorText}>{error}</Text>
          </View>
        ) : null}

        <View style={authStyles.ctaStack}>
          <RizomaButton
            label={busy ? "Entrando..." : "Iniciar sesión"}
            onPress={onSubmit}
            disabled={busy}
          />
        </View>
      </View>

      <View style={authStyles.socialPanel}>
        <View style={authStyles.dividerRow}>
          <View style={authStyles.dividerLine} />
          <Text style={authStyles.dividerLabel}>o</Text>
          <View style={authStyles.dividerLine} />
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
        focusable={false}
        hitSlop={8}
        style={({ pressed }) => [
          authStyles.authLinkRow,
          { opacity: pressed || busy ? 0.65 : 1 },
        ]}
      >
        <Text style={authStyles.authLinkLine} numberOfLines={1}>
          <Text style={authStyles.linkMuted}>¿No tienes cuenta? </Text>
          <Text style={authStyles.linkAccent}>Crear cuenta</Text>
        </Text>
      </Pressable>

      <Text style={authStyles.legal}>
        Al continuar aceptas los términos de uso.{"\n"}
        La sesión se guarda en este dispositivo.
      </Text>
    </AuthScreenShell>
  );
}
