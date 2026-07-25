import { useEffect } from "react";
import { Stack, router, useSegments } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { ActivityIndicator, View } from "react-native";
import "@/src/polyfills/colorScheme";
import { FontProvider } from "@/src/theme/FontProvider";
import { ShopProvider } from "@/src/store/ShopContext";
import { GardenProvider } from "@/src/store/GardenContext";
import { OnboardingProvider, useOnboarding } from "@/src/store/OnboardingContext";
import { RizomaLogo } from "@/src/components/brand/RizomaLogo";
import { colors } from "@/src/theme/tokens";
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

  if (!ready) {
    return (
      <View className="flex-1 items-center justify-center bg-white" accessibilityLabel="Cargando Rizoma">
        <RizomaLogo size="lg" />
        <ActivityIndicator className="mt-6" color={colors.brand} />
      </View>
    );
  }

  return <>{children}</>;
}

export default function RootLayout() {
  return (
    <FontProvider>
      <ShopProvider>
        <GardenProvider>
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
                <Stack.Screen name="chat/[id]" />
              </Stack>
            </OnboardingGate>
          </OnboardingProvider>
        </GardenProvider>
      </ShopProvider>
    </FontProvider>
  );
}
