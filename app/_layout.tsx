import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import "@/src/polyfills/colorScheme";
import { FontProvider } from "@/src/theme/FontProvider";
import { ShopProvider } from "@/src/store/ShopContext";
import { GardenProvider } from "@/src/store/GardenContext";
import "../global.css";

export default function RootLayout() {
  return (
    <FontProvider>
      <ShopProvider>
        <GardenProvider>
          <StatusBar style="dark" />
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
          </Stack>
        </GardenProvider>
      </ShopProvider>
    </FontProvider>
  );
}
