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
 * Splash botánica premium: atmósfera → raíces → medallón/hojas → wordmark.
 */
export function BrandSplash({ animated = true }: BrandSplashProps) {
  const markOpacity = useRef(new Animated.Value(animated ? 0 : 1)).current;
  const markScale = useRef(new Animated.Value(animated ? 0.82 : 1)).current;
  const ringScale = useRef(new Animated.Value(animated ? 0.88 : 1)).current;
  const ringOpacity = useRef(new Animated.Value(animated ? 0 : 1)).current;
  const titleOpacity = useRef(new Animated.Value(animated ? 0 : 1)).current;
  const titleY = useRef(new Animated.Value(animated ? 12 : 0)).current;
  const lineWidth = useRef(new Animated.Value(animated ? 0 : 48)).current;
  const tagOpacity = useRef(new Animated.Value(animated ? 0 : 1)).current;
  const tagY = useRef(new Animated.Value(animated ? 8 : 0)).current;

  useEffect(() => {
    if (!animated) return;

    const ease = Easing.bezier(0.22, 1, 0.36, 1);

    Animated.sequence([
      Animated.delay(980),
      Animated.parallel([
        Animated.timing(ringOpacity, {
          toValue: 1,
          duration: 700,
          easing: ease,
          useNativeDriver: true,
        }),
        Animated.spring(ringScale, {
          toValue: 1,
          friction: 8,
          tension: 52,
          useNativeDriver: true,
        }),
        Animated.timing(markOpacity, {
          toValue: 1,
          duration: 780,
          easing: ease,
          useNativeDriver: true,
        }),
        Animated.spring(markScale, {
          toValue: 1,
          friction: 7,
          tension: 56,
          useNativeDriver: true,
        }),
      ]),
      Animated.parallel([
        Animated.timing(titleOpacity, {
          toValue: 1,
          duration: 720,
          easing: ease,
          useNativeDriver: true,
        }),
        Animated.timing(titleY, {
          toValue: 0,
          duration: 720,
          easing: ease,
          useNativeDriver: true,
        }),
      ]),
      Animated.parallel([
        Animated.timing(tagOpacity, {
          toValue: 1,
          duration: 640,
          easing: Easing.out(Easing.quad),
          useNativeDriver: true,
        }),
        Animated.timing(tagY, {
          toValue: 0,
          duration: 640,
          easing: ease,
          useNativeDriver: true,
        }),
      ]),
    ]).start();

    Animated.timing(lineWidth, {
      toValue: 48,
      duration: 820,
      delay: 2500,
      easing: ease,
      useNativeDriver: false,
    }).start();
  }, [
    animated,
    markOpacity,
    markScale,
    ringScale,
    ringOpacity,
    titleOpacity,
    titleY,
    lineWidth,
    tagOpacity,
    tagY,
  ]);

  return (
    <View style={styles.root} accessibilityLabel="Cargando Rizoma">
      <RizomaSplashArt
        animated={animated}
        markOpacity={markOpacity}
        markScale={markScale}
        ringScale={ringScale}
        ringOpacity={ringOpacity}
      />

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
            marginTop: 14,
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
    left: 28,
    right: 28,
    bottom: "14%",
    alignItems: "center",
    zIndex: 4,
  },
  wordmark: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 46,
    fontWeight: "600",
    color: leafyLogoColors.wordmark,
    letterSpacing: -0.6,
    textAlign: "center",
    includeFontPadding: false,
  },
  line: {
    marginTop: 14,
    height: 2.5,
    borderRadius: 2,
    backgroundColor: leafyLogoColors.leaf,
    alignSelf: "center",
  },
  tagline: {
    fontFamily: "Inter_400Regular",
    fontSize: 15,
    lineHeight: 22,
    color: colors.secondaryText,
    textAlign: "center",
    maxWidth: 270,
  },
});
