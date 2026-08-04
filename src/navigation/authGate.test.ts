import { resolveAuthGate } from "@/src/navigation/authGate";

describe("resolveAuthGate", () => {
  it("bloquea hasta hidratar", () => {
    expect(
      resolveAuthGate({
        hydrated: false,
        hasUser: false,
        needsOnboarding: false,
        root: undefined,
      }),
    ).toEqual({ routeReady: false, redirectTo: null });
  });

  it("sin sesión manda a login salvo que ya esté en auth", () => {
    expect(
      resolveAuthGate({
        hydrated: true,
        hasUser: false,
        needsOnboarding: false,
        root: "index",
      }),
    ).toEqual({ routeReady: false, redirectTo: "/login" });

    expect(
      resolveAuthGate({
        hydrated: true,
        hasUser: false,
        needsOnboarding: false,
        root: "login",
      }),
    ).toEqual({ routeReady: true, redirectTo: null });

    expect(
      resolveAuthGate({
        hydrated: true,
        hasUser: false,
        needsOnboarding: false,
        root: "register",
      }),
    ).toEqual({ routeReady: true, redirectTo: null });
  });

  it("sesión nueva pide onboarding", () => {
    expect(
      resolveAuthGate({
        hydrated: true,
        hasUser: true,
        needsOnboarding: true,
        root: "login",
      }),
    ).toEqual({ routeReady: false, redirectTo: "/onboarding" });

    expect(
      resolveAuthGate({
        hydrated: true,
        hasUser: true,
        needsOnboarding: true,
        root: "onboarding",
      }),
    ).toEqual({ routeReady: true, redirectTo: null });
  });

  it("sesión lista va a home y permite reabrir onboarding", () => {
    expect(
      resolveAuthGate({
        hydrated: true,
        hasUser: true,
        needsOnboarding: false,
        root: "login",
      }),
    ).toEqual({ routeReady: false, redirectTo: "/(tabs)" });

    expect(
      resolveAuthGate({
        hydrated: true,
        hasUser: true,
        needsOnboarding: false,
        root: "(tabs)",
      }),
    ).toEqual({ routeReady: true, redirectTo: null });

    expect(
      resolveAuthGate({
        hydrated: true,
        hasUser: true,
        needsOnboarding: false,
        root: "onboarding",
      }),
    ).toEqual({ routeReady: true, redirectTo: null });
  });
});
