import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { ShopProvider } from "@/src/store/ShopContext";
import { GardenProvider } from "@/src/store/GardenContext";
import "../global.css";

export default function RootLayout() {
  return (
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
          <Stack.Screen name="match" />
          <Stack.Screen name="garden" />
        </Stack>
      </GardenProvider>
    </ShopProvider>
  );
}
