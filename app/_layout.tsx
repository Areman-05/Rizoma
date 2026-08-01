import { useEffect } from "react";
import { View } from "react-native";
import { Stack, router, useSegments } from "expo-router";
import { StatusBar } from "expo-status-bar";
import "@/src/polyfills/colorScheme";
import { FontProvider } from "@/src/theme/FontProvider";
import { ShopProvider } from "@/src/store/ShopContext";
import { GardenProvider } from "@/src/store/GardenContext";
import { ChatProvider } from "@/src/store/ChatContext";
import { OnboardingProvider, useOnboarding } from "@/src/store/OnboardingContext";
import "../global.css";

function OnboardingGate({ children }: { children: React.ReactNode }) {
  const { ready, needsOnboarding } = useOnboarding();
  const segments = useSegments();

  useEffect(() => {
    if (!ready) return;
    const onOnboarding = segments[0] === "onboarding";
    if (needsOnboarding && !onOnboarding) {
      router.replace("/onboarding");
      return;
    }
    if (!needsOnboarding && onOnboarding) {
      router.replace("/(tabs)");
    }
  }, [ready, needsOnboarding, segments]);

  // Fondo blanco neutro (mismo que splash) — sin BrandSplash para evitar el doble flash.
  if (!ready) {
    return <View style={{ flex: 1, backgroundColor: "#FFFFFF" }} />;
  }

  return <>{children}</>;
}

export default function RootLayout() {
  return (
    <FontProvider>
      <ShopProvider>
        <GardenProvider>
          <ChatProvider>
            <OnboardingProvider>
              <StatusBar style="dark" />
              <OnboardingGate>
                <Stack screenOptions={{ headerShown: false }}>
                  <Stack.Screen name="(tabs)" />
                  <Stack.Screen name="plants/[id]" />
                  <Stack.Screen name="scan" />
                  <Stack.Screen name="checkout" />
                  <Stack.Screen name="orders" />
                  <Stack.Screen name="search" />
                  <Stack.Screen name="onboarding" />
                  <Stack.Screen name="login" />
                  <Stack.Screen name="match" />
                  <Stack.Screen name="garden" />
                  <Stack.Screen name="notifications" />
                  <Stack.Screen name="notification-settings" />
                  <Stack.Screen name="chat/[id]" />
                </Stack>
              </OnboardingGate>
            </OnboardingProvider>
          </ChatProvider>
        </GardenProvider>
      </ShopProvider>
    </FontProvider>
  );
}
