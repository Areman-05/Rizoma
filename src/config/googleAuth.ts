import Constants from "expo-constants";
import { ResponseType } from "expo-auth-session";
import type { GoogleAuthRequestConfig } from "expo-auth-session/providers/google";

/**
 * Google OAuth (Rizoma).
 * Preferir EXPO_PUBLIC_* en `.env`; si faltan, cae a IDs de desarrollo del proyecto.
 * NUNCA pongas el client_secret aquí.
 */
const FALLBACK_ANDROID =
  "298341869130-av0f1qsohv1i19gj6duab01j1utan7ka.apps.googleusercontent.com";
const FALLBACK_WEB =
  "298341869130-u2slof1pffpm9i02htkfstcogkb83ro8.apps.googleusercontent.com";

export const googleAuth = {
  androidClientId:
    process.env.EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID?.trim() || FALLBACK_ANDROID,
  webClientId: process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID?.trim() || FALLBACK_WEB,
  iosClientId: (process.env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID?.trim() || "") as string,
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
