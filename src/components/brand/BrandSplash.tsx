import { useEffect, useRef } from "react";
import { Animated, Easing, StyleSheet, Text, View } from "react-native";
import { brand } from "@/src/brand/rizoma";
import { RizomaMark, leafyLogoColors } from "@/src/components/brand/RizomaLogo";

interface BrandSplashProps {
  animated?: boolean;
}

/**
 * Splash vertical Leafy: marca → wordmark → tagline.
 * Motion editorial (opacidades + línea), sin slides cutres.
 */
export function BrandSplash({ animated = true }: BrandSplashProps) {
  const markOpacity = useRef(new Animated.Value(animated ? 0 : 1)).current;
  const markY = useRef(new Animated.Value(animated ? 8 : 0)).current;
  const titleOpacity = useRef(new Animated.Value(animated ? 0 : 1)).current;
  const titleY = useRef(new Animated.Value(animated ? 6 : 0)).current;
  const lineWidth = useRef(new Animated.Value(animated ? 0 : 40)).current;
  const tagOpacity = useRef(new Animated.Value(animated ? 0 : 1)).current;

  useEffect(() => {
    if (!animated) return;

    const ease = Easing.bezier(0.22, 1, 0.36, 1);

    Animated.sequence([
      // 1. Icono
      Animated.parallel([
        Animated.timing(markOpacity, {
          toValue: 1,
          duration: 1100,
          easing: ease,
          useNativeDriver: true,
        }),
        Animated.timing(markY, {
          toValue: 0,
          duration: 1100,
          easing: ease,
          useNativeDriver: true,
        }),
      ]),
      // 2. Wordmark
      Animated.parallel([
        Animated.timing(titleOpacity, {
          toValue: 1,
          duration: 900,
          easing: ease,
          useNativeDriver: true,
        }),
        Animated.timing(titleY, {
          toValue: 0,
          duration: 900,
          easing: ease,
          useNativeDriver: true,
        }),
      ]),
      // 3. Tagline (más suave, al final)
      Animated.timing(tagOpacity, {
        toValue: 1,
        duration: 900,
        easing: Easing.out(Easing.quad),
        useNativeDriver: true,
      }),
    ]).start();

    // Línea brand entre título y tagline (detail premium)
    Animated.timing(lineWidth, {
      toValue: 40,
      duration: 1000,
      delay: 1600,
      easing: ease,
      useNativeDriver: false,
    }).start();
  }, [animated, markOpacity, markY, titleOpacity, titleY, lineWidth, tagOpacity]);

  return (
    <View style={styles.root} accessibilityLabel="Cargando Rizoma">
      <View style={styles.guides} pointerEvents="none">
        {Array.from({ length: 14 }).map((_, i) => (
          <View key={i} style={styles.guideLine} />
        ))}
      </View>

      <View style={styles.centerBlock}>
        <Animated.View
          style={{
            opacity: markOpacity,
            transform: [{ translateY: markY }],
            marginBottom: 28,
          }}
        >
          <RizomaMark size={120} />
        </Animated.View>

        <Animated.View
          style={{
            opacity: titleOpacity,
            transform: [{ translateY: titleY }],
            alignItems: "center",
            width: "100%",
            paddingHorizontal: 8,
          }}
        >
          <Text style={styles.wordmark} numberOfLines={1} allowFontScaling={false}>
            Rizoma
          </Text>
        </Animated.View>

        <Animated.View style={[styles.line, { width: lineWidth }]} />

        <Animated.View style={{ opacity: tagOpacity, marginTop: 18 }}>
          <Text style={styles.tagline}>{brand.tagline}</Text>
        </Animated.View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    width: "100%",
    backgroundColor: "#FFFFFF",
  },
  guides: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "space-evenly",
    paddingVertical: 48,
    opacity: 0.4,
  },
  guideLine: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: "#E5E7EB",
    marginHorizontal: 24,
  },
  centerBlock: {
    flex: 1,
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 24,
    zIndex: 2,
  },
  wordmark: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 52,
    fontWeight: "600",
    color: leafyLogoColors.wordmark,
    letterSpacing: -0.4,
    textAlign: "center",
    includeFontPadding: false,
  },
  line: {
    marginTop: 20,
    height: 2,
    borderRadius: 1,
    backgroundColor: leafyLogoColors.leaf,
    alignSelf: "center",
  },
  tagline: {
    fontFamily: "Inter_400Regular",
    fontSize: 16,
    lineHeight: 24,
    color: "#6B7280",
    textAlign: "center",
    maxWidth: 280,
  },
});
