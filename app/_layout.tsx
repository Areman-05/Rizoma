import { useEffect } from "react";
import { View } from "react-native";
import { Stack, router, useSegments } from "expo-router";
import { StatusBar } from "expo-status-bar";
import "@/src/polyfills/colorScheme";
import { AuthProvider, useAuth } from "@/src/context/AuthContext";
import { FontProvider } from "@/src/theme/FontProvider";
import { ShopProvider } from "@/src/store/ShopContext";
import { GardenProvider } from "@/src/store/GardenContext";
import { ChatProvider } from "@/src/store/ChatContext";
import { OnboardingProvider, useOnboarding } from "@/src/store/OnboardingContext";
import "../global.css";

const AUTH_ROUTES = new Set(["login", "register"]);

function AppGate({ children }: { children: React.ReactNode }) {
  const { ready, needsOnboarding } = useOnboarding();
  const { user, isReady: authReady } = useAuth();
  const segments = useSegments();

  useEffect(() => {
    if (!ready || !authReady) return;

    const root = segments[0];
    const onOnboarding = root === "onboarding";
    const onAuthRoute = AUTH_ROUTES.has(root ?? "");

    if (needsOnboarding && !onOnboarding) {
      router.replace("/onboarding");
      return;
    }

    // Onboarding terminado: hace falta sesión para entrar a la app (tabs y resto).
    if (!needsOnboarding && !user && !onAuthRoute) {
      router.replace("/login");
    }
  }, [ready, authReady, needsOnboarding, user, segments]);

  // Fondo blanco neutro (mismo que splash) — sin BrandSplash para evitar el doble flash.
  if (!ready || !authReady) {
    return <View style={{ flex: 1, backgroundColor: "#FFFFFF" }} />;
  }

  return <>{children}</>;
}

export default function RootLayout() {
  return (
    <FontProvider>
      <AuthProvider>
        <ShopProvider>
          <GardenProvider>
            <ChatProvider>
              <OnboardingProvider>
                <StatusBar style="dark" />
                <AppGate>
                  <Stack screenOptions={{ headerShown: false }}>
                    <Stack.Screen name="(tabs)" />
                    <Stack.Screen name="plants/[id]" />
                    <Stack.Screen name="scan" />
                    <Stack.Screen name="checkout" />
                    <Stack.Screen name="orders" />
                    <Stack.Screen name="search" />
                    <Stack.Screen name="onboarding" />
                    <Stack.Screen name="login" />
                    <Stack.Screen name="register" />
                    <Stack.Screen name="match" />
                    <Stack.Screen name="garden" />
                    <Stack.Screen name="notifications" />
                    <Stack.Screen name="notification-settings" />
                    <Stack.Screen name="chat/[id]" />
                  </Stack>
                </AppGate>
              </OnboardingProvider>
            </ChatProvider>
          </GardenProvider>
        </ShopProvider>
      </AuthProvider>
    </FontProvider>
  );
}
