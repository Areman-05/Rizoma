import { ReactNode, useEffect, useRef, useState } from "react";
import { Animated, StyleSheet, View } from "react-native";
import {
  useFonts,
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold,
  Inter_800ExtraBold,
} from "@expo-google-fonts/inter";
import * as SplashScreen from "expo-splash-screen";
import { BrandSplash } from "@/src/components/brand/BrandSplash";

const BRAND_SPLASH_MS = 3800;
const EXIT_FADE_MS = 500;

/** Evita re-mostrar el splash en cada Fast Refresh / remount de RootLayout. */
let brandSplashCompleted = false;
let splashStartedAt: number | null = null;

SplashScreen.preventAutoHideAsync().catch(() => {});

/**
 * Splash a pantalla completa; la app no se monta hasta que termina.
 * (Así Home no puede taparlo en Android.)
 */
export function FontProvider({ children }: { children: ReactNode }) {
  useFonts({
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
    Inter_800ExtraBold,
  });

  const [phase, setPhase] = useState<"splash" | "app">(
    brandSplashCompleted ? "app" : "splash",
  );
  const opacity = useRef(new Animated.Value(brandSplashCompleted ? 0 : 1)).current;

  useEffect(() => {
    SplashScreen.hideAsync().catch(() => {});

    if (brandSplashCompleted) {
      setPhase("app");
      return;
    }

    if (splashStartedAt == null) splashStartedAt = Date.now();
    const remaining = Math.max(0, BRAND_SPLASH_MS - (Date.now() - splashStartedAt));

    const timer = setTimeout(() => {
      brandSplashCompleted = true;
      Animated.timing(opacity, {
        toValue: 0,
        duration: EXIT_FADE_MS,
        useNativeDriver: true,
      }).start(() => setPhase("app"));
    }, remaining);

    return () => clearTimeout(timer);
  }, [opacity]);

  if (phase === "splash") {
    return (
      <View style={styles.root}>
        <Animated.View style={[styles.fill, { opacity }]}>
          <BrandSplash animated />
        </Animated.View>
      </View>
    );
  }

  return <View style={styles.root}>{children}</View>;
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  fill: {
    flex: 1,
  },
});
