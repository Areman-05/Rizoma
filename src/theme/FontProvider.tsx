import { ReactNode, useEffect, useRef, useState } from "react";
import { Animated, StyleSheet, View } from "react-native";
import {
  useFonts,
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold,
} from "@expo-google-fonts/inter";
import * as SplashScreen from "expo-splash-screen";
import { BrandSplash } from "@/src/components/brand/BrandSplash";

const BRAND_SPLASH_MS = 3800;
const EXIT_FADE_MS = 500;

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
  });

  const [phase, setPhase] = useState<"splash" | "app">("splash");
  const opacity = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    SplashScreen.hideAsync().catch(() => {});

    const timer = setTimeout(() => {
      Animated.timing(opacity, {
        toValue: 0,
        duration: EXIT_FADE_MS,
        useNativeDriver: true,
      }).start(({ finished }) => {
        if (finished) setPhase("app");
      });
    }, BRAND_SPLASH_MS);

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
