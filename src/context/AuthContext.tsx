import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { withStorageTimeout } from "@/src/store/persistence";

const AUTH_SESSION_KEY = "rizoma.auth.session.v1";

export type AuthProviderKind = "google" | "email";

export type AuthUser = {
  id: string;
  email: string;
  name: string;
  picture?: string;
  provider: AuthProviderKind;
};

type AuthContextValue = {
  user: AuthUser | null;
  isReady: boolean;
  signIn: (user: AuthUser) => Promise<void>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

function isAuthUser(value: unknown): value is AuthUser {
  if (!value || typeof value !== "object") return false;
  const u = value as Record<string, unknown>;
  return (
    typeof u.id === "string" &&
    typeof u.email === "string" &&
    typeof u.name === "string" &&
    (u.provider === "google" || u.provider === "email") &&
    (u.picture === undefined || typeof u.picture === "string")
  );
}

/** Decodifica el payload de un JWT (id_token) sin verificar firma (solo UI local). */
export function decodeJwtPayload(idToken: string): Record<string, unknown> {
  const parts = idToken.split(".");
  if (parts.length < 2) {
    throw new Error("id_token inválido");
  }
  const base64 = parts[1].replace(/-/g, "+").replace(/_/g, "/");
  const padded = base64 + "=".repeat((4 - (base64.length % 4)) % 4);
  if (typeof globalThis.atob !== "function") {
    throw new Error("atob no disponible para decodificar el token");
  }
  const json = globalThis.atob(padded);
  return JSON.parse(json) as Record<string, unknown>;
}

export function userFromGoogleIdToken(idToken: string): AuthUser {
  const payload = decodeJwtPayload(idToken);
  const sub = typeof payload.sub === "string" ? payload.sub : "";
  const email = typeof payload.email === "string" ? payload.email : "";
  const name =
    (typeof payload.name === "string" && payload.name) ||
    (typeof payload.given_name === "string" && payload.given_name) ||
    (email ? email.split("@")[0] : "Usuario Google");
  const picture = typeof payload.picture === "string" ? payload.picture : undefined;

  if (!sub) {
    throw new Error("El token de Google no incluye un identificador de usuario.");
  }

  return {
    id: `google:${sub}`,
    email,
    name,
    picture,
    provider: "google",
  };
}

async function loadStoredUser(): Promise<AuthUser | null> {
  try {
    const raw = await AsyncStorage.getItem(AUTH_SESSION_KEY);
    if (!raw) return null;
    const parsed: unknown = JSON.parse(raw);
    return isAuthUser(parsed) ? parsed : null;
  } catch {
    return null;
  }
}

async function persistUser(user: AuthUser | null): Promise<void> {
  if (!user) {
    await AsyncStorage.removeItem(AUTH_SESSION_KEY);
    return;
  }
  await AsyncStorage.setItem(AUTH_SESSION_KEY, JSON.stringify(user));
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    let cancelled = false;
    withStorageTimeout(loadStoredUser(), null)
      .then((stored) => {
        if (cancelled) return;
        setUser(stored);
        setIsReady(true);
      })
      .catch(() => {
        if (cancelled) return;
        setUser(null);
        setIsReady(true);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const signIn = useCallback(async (next: AuthUser) => {
    await persistUser(next);
    setUser(next);
  }, []);

  const signOut = useCallback(async () => {
    await persistUser(null);
    setUser(null);
  }, []);

  const value = useMemo(
    () => ({ user, isReady, signIn, signOut }),
    [user, isReady, signIn, signOut],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}
