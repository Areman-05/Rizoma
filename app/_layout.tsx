import { useEffect } from "react";
import { StyleSheet, View } from "react-native";
import { Stack, router, useSegments } from "expo-router";
import { StatusBar } from "expo-status-bar";
import "@/src/polyfills/colorScheme";
import { AuthProvider, useAuth } from "@/src/context/AuthContext";
import { resolveAuthGate } from "@/src/navigation/authGate";
import { FontProvider } from "@/src/theme/FontProvider";
import { ShopProvider } from "@/src/store/ShopContext";
import { GardenProvider } from "@/src/store/GardenContext";
import { ChatProvider } from "@/src/store/ChatContext";
import { OnboardingProvider, useOnboarding } from "@/src/store/OnboardingContext";
import "../global.css";

const GATE_BG = "#FFFFFF";

function AppGate({ children }: { children: React.ReactNode }) {
  const { ready, needsOnboarding } = useOnboarding();
  const { user, isReady: authReady } = useAuth();
  const segments = useSegments();

  const { routeReady, redirectTo } = resolveAuthGate({
    hydrated: ready && authReady,
    hasUser: Boolean(user),
    needsOnboarding,
    root: segments[0],
  });

  useEffect(() => {
    if (redirectTo) router.replace(redirectTo);
  }, [redirectTo]);

  return (
    <View style={styles.root} collapsable={false}>
      {children}
      {!routeReady ? <View style={styles.blocker} pointerEvents="auto" /> : null}
    </View>
  );
}

export default function RootLayout() {
  return (
    <AuthProvider>
      <OnboardingProvider>
        <FontProvider>
          <ShopProvider>
            <GardenProvider>
              <ChatProvider>
                <StatusBar style="dark" />
                <AppGate>
                  <Stack
                    screenOptions={{
                      headerShown: false,
                      animation: "fade",
                      freezeOnBlur: true,
                    }}
                  >
                    <Stack.Screen name="index" />
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
              </ChatProvider>
            </GardenProvider>
          </ShopProvider>
        </FontProvider>
      </OnboardingProvider>
    </AuthProvider>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: GATE_BG,
  },
  blocker: {
    ...StyleSheet.absoluteFill,
    backgroundColor: GATE_BG,
    zIndex: 1000,
    elevation: 1000,
  },
});
