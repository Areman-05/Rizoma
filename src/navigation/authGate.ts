const AUTH_ROUTES = new Set(["login", "register"]);

export type AuthGateInput = {
  hydrated: boolean;
  hasUser: boolean;
  needsOnboarding: boolean;
  /** Primer segmento de expo-router (`useSegments()[0]`). */
  root: string | undefined;
};

export type AuthGateRedirect = "/login" | "/onboarding" | "/(tabs)";

export type AuthGateResult = {
  /** La ruta actual ya es la correcta → se puede mostrar la UI. */
  routeReady: boolean;
  redirectTo: AuthGateRedirect | null;
};

/**
 * Destino post-splash:
 * sin sesión → login | register
 * sesión + bienvenida pendiente → onboarding
 * sesión lista → home
 */
export function resolveAuthGate({
  hydrated,
  hasUser,
  needsOnboarding,
  root,
}: AuthGateInput): AuthGateResult {
  if (!hydrated) {
    return { routeReady: false, redirectTo: null };
  }

  const onOnboarding = root === "onboarding";
  const onAuthRoute = AUTH_ROUTES.has(root ?? "");
  const onIndex = !root || root === "index";

  if (!hasUser) {
    return {
      routeReady: onAuthRoute,
      redirectTo: onAuthRoute ? null : "/login",
    };
  }

  if (needsOnboarding) {
    return {
      routeReady: onOnboarding,
      redirectTo: onOnboarding ? null : "/onboarding",
    };
  }

  return {
    routeReady: !onAuthRoute && !onIndex,
    redirectTo: onAuthRoute || onIndex ? "/(tabs)" : null,
  };
}
