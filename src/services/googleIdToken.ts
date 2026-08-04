import type { AuthUser } from "@/src/context/AuthContext";

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
