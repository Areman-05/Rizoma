import { useEffect, useRef } from "react";
import { Animated, Easing, StyleSheet, Text, View } from "react-native";
import { brand } from "@/src/brand/rizoma";
import { RizomaSplashArt } from "@/src/components/brand/RizomaSplashArt";
import { leafyLogoColors } from "@/src/components/brand/RizomaLogo";
import { colors } from "@/src/theme/tokens";

interface BrandSplashProps {
  animated?: boolean;
}

/**
 * Splash botánica: tierra → raíz → hoja → wordmark → tagline.
 */
export function BrandSplash({ animated = true }: BrandSplashProps) {
  const markOpacity = useRef(new Animated.Value(animated ? 0 : 1)).current;
  const markScale = useRef(new Animated.Value(animated ? 0.72 : 1)).current;
  const titleOpacity = useRef(new Animated.Value(animated ? 0 : 1)).current;
  const titleY = useRef(new Animated.Value(animated ? 14 : 0)).current;
  const lineWidth = useRef(new Animated.Value(animated ? 0 : 44)).current;
  const tagOpacity = useRef(new Animated.Value(animated ? 0 : 1)).current;
  const tagY = useRef(new Animated.Value(animated ? 8 : 0)).current;

  useEffect(() => {
    if (!animated) return;

    const ease = Easing.bezier(0.22, 1, 0.36, 1);

    // Mark aparece tras tierra + raíces (~1.5s)
    Animated.sequence([
      Animated.delay(1450),
      Animated.parallel([
        Animated.timing(markOpacity, {
          toValue: 1,
          duration: 900,
          easing: ease,
          useNativeDriver: true,
        }),
        Animated.spring(markScale, {
          toValue: 1,
          friction: 7,
          tension: 58,
          useNativeDriver: true,
        }),
      ]),
      Animated.parallel([
        Animated.timing(titleOpacity, {
          toValue: 1,
          duration: 780,
          easing: ease,
          useNativeDriver: true,
        }),
        Animated.timing(titleY, {
          toValue: 0,
          duration: 780,
          easing: ease,
          useNativeDriver: true,
        }),
      ]),
      Animated.parallel([
        Animated.timing(tagOpacity, {
          toValue: 1,
          duration: 700,
          easing: Easing.out(Easing.quad),
          useNativeDriver: true,
        }),
        Animated.timing(tagY, {
          toValue: 0,
          duration: 700,
          easing: ease,
          useNativeDriver: true,
        }),
      ]),
    ]).start();

    Animated.timing(lineWidth, {
      toValue: 44,
      duration: 900,
      delay: 2900,
      easing: ease,
      useNativeDriver: false,
    }).start();
  }, [animated, markOpacity, markScale, titleOpacity, titleY, lineWidth, tagOpacity, tagY]);

  return (
    <View style={styles.root} accessibilityLabel="Cargando Rizoma">
      <RizomaSplashArt animated={animated} markOpacity={markOpacity} markScale={markScale} />

      <View style={styles.copyBlock} pointerEvents="none">
        <Animated.View
          style={{
            opacity: titleOpacity,
            transform: [{ translateY: titleY }],
            alignItems: "center",
            width: "100%",
          }}
        >
          <Text style={styles.wordmark} numberOfLines={1} allowFontScaling={false}>
            {brand.name}
          </Text>
        </Animated.View>

        <Animated.View style={[styles.line, { width: lineWidth }]} />

        <Animated.View
          style={{
            opacity: tagOpacity,
            transform: [{ translateY: tagY }],
            marginTop: 16,
          }}
        >
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
    backgroundColor: colors.white,
  },
  copyBlock: {
    position: "absolute",
    left: 24,
    right: 24,
    bottom: "18%",
    alignItems: "center",
    zIndex: 3,
  },
  wordmark: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 48,
    fontWeight: "600",
    color: leafyLogoColors.wordmark,
    letterSpacing: -0.5,
    textAlign: "center",
    includeFontPadding: false,
  },
  line: {
    marginTop: 16,
    height: 2,
    borderRadius: 1,
    backgroundColor: leafyLogoColors.leaf,
    alignSelf: "center",
  },
  tagline: {
    fontFamily: "Inter_400Regular",
    fontSize: 15,
    lineHeight: 22,
    color: colors.secondaryText,
    textAlign: "center",
    maxWidth: 280,
  },
});
