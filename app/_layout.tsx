import { useEffect, useState } from "react";
import { Stack, router, useSegments } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { ActivityIndicator, View } from "react-native";
import "@/src/polyfills/colorScheme";
import { FontProvider } from "@/src/theme/FontProvider";
import { ShopProvider } from "@/src/store/ShopContext";
import { GardenProvider } from "@/src/store/GardenContext";
import { hasCompletedOnboarding } from "@/src/store/persistence";
import { RizomaLogo } from "@/src/components/brand/RizomaLogo";
import { colors } from "@/src/theme/tokens";
import "../global.css";

function OnboardingGate({ children }: { children: React.ReactNode }) {
  const [ready, setReady] = useState(false);
  const [needsOnboarding, setNeedsOnboarding] = useState(false);
  const segments = useSegments();

  useEffect(() => {
    hasCompletedOnboarding().then((done) => {
      setNeedsOnboarding(!done);
      setReady(true);
    });
  }, []);

  useEffect(() => {
    if (!ready) return;
    const onOnboarding = segments[0] === "onboarding";
    if (needsOnboarding && !onOnboarding) {
      router.replace("/onboarding");
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
        </GardenProvider>
      </ShopProvider>
    </FontProvider>
  );
}
