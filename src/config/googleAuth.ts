import Constants from "expo-constants";
import { ResponseType } from "expo-auth-session";
import type { GoogleAuthRequestConfig } from "expo-auth-session/providers/google";

/**
 * Google OAuth (Rizoma).
 * Client IDs de apps/móviles se consideran públicos (van en el binario).
 * NUNCA pongas el client_secret aquí ni en el repo: solo backend / .env local.
 *
 * Redirect URIs a autorizar en Google Cloud Console → cliente tipo Web:
 * - `rizoma://`
 * - el valor de `AuthSession.makeRedirectUri({ scheme: 'rizoma' })`
 *   (en __DEV__ se imprime al montar login; en Expo Go suele ser `exp://IP:puerto`)
 * - en builds nativos también puede aparecer `rizoma://oauthredirect`
 *
 * Si Expo Go falla por redirect_uri_mismatch, pega exactamente el URI del log
 * en "Authorized redirect URIs" del Web client.
 */
export const googleAuth = {
  androidClientId:
    "298341869130-av0f1qsohv1i19gj6duab01j1utan7ka.apps.googleusercontent.com",
  webClientId:
    "298341869130-u2slof1pffpm9i02htkfstcogkb83ro8.apps.googleusercontent.com",
  iosClientId: "" as string,
};

/** True dentro de Expo Go (package host.exp.exponent ≠ com.rizoma.app). */
export function isExpoGo(): boolean {
  return Constants.appOwnership === "expo";
}

/**
 * Config para `Google.useAuthRequest`.
 * En Expo Go el Android client ID (ligado a com.rizoma.app + SHA-1) no vale:
 * usamos webClientId + IdToken (sin code exchange / sin secret).
 */
export function getGoogleAuthRequestConfig(): Partial<GoogleAuthRequestConfig> {
  const expoGo = isExpoGo();
  const webId = googleAuth.webClientId;
  const androidId = expoGo ? webId : googleAuth.androidClientId;
  const iosId = googleAuth.iosClientId || webId;

  return {
    androidClientId: androidId,
    iosClientId: iosId,
    webClientId: webId,
    clientId: expoGo ? webId : undefined,
    responseType: ResponseType.IdToken,
    shouldAutoExchangeCode: false,
    selectAccount: true,
    scopes: ["openid", "profile", "email"],
  };
}

/** Opciones de redirect alineadas con scheme `rizoma` en app.json. */
export function getGoogleRedirectUriOptions() {
  return {
    scheme: "rizoma" as const,
    path: "oauthredirect",
  };
}
