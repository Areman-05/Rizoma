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
 * Splash botánica premium: atmósfera → rizoma → hojas → wordmark «Rizoma».
 */
export function BrandSplash({ animated = true }: BrandSplashProps) {
  const markOpacity = useRef(new Animated.Value(animated ? 0 : 1)).current;
  const markScale = useRef(new Animated.Value(animated ? 0.84 : 1)).current;
  const ringScale = useRef(new Animated.Value(animated ? 0.9 : 1)).current;
  const ringOpacity = useRef(new Animated.Value(animated ? 0 : 1)).current;
  const titleOpacity = useRef(new Animated.Value(animated ? 0 : 1)).current;
  const titleY = useRef(new Animated.Value(animated ? 14 : 0)).current;
  const lineWidth = useRef(new Animated.Value(animated ? 0 : 56)).current;
  const tagOpacity = useRef(new Animated.Value(animated ? 0 : 1)).current;
  const tagY = useRef(new Animated.Value(animated ? 8 : 0)).current;

  useEffect(() => {
    if (!animated) return;

    const ease = Easing.bezier(0.22, 1, 0.36, 1);

    Animated.sequence([
      Animated.delay(1100),
      Animated.parallel([
        Animated.timing(ringOpacity, {
          toValue: 1,
          duration: 720,
          easing: ease,
          useNativeDriver: true,
        }),
        Animated.spring(ringScale, {
          toValue: 1,
          friction: 8,
          tension: 50,
          useNativeDriver: true,
        }),
        Animated.timing(markOpacity, {
          toValue: 1,
          duration: 800,
          easing: ease,
          useNativeDriver: true,
        }),
        Animated.spring(markScale, {
          toValue: 1,
          friction: 7,
          tension: 54,
          useNativeDriver: true,
        }),
      ]),
      Animated.parallel([
        Animated.timing(titleOpacity, {
          toValue: 1,
          duration: 740,
          easing: ease,
          useNativeDriver: true,
        }),
        Animated.timing(titleY, {
          toValue: 0,
          duration: 740,
          easing: ease,
          useNativeDriver: true,
        }),
      ]),
      Animated.parallel([
        Animated.timing(tagOpacity, {
          toValue: 1,
          duration: 680,
          easing: Easing.out(Easing.quad),
          useNativeDriver: true,
        }),
        Animated.timing(tagY, {
          toValue: 0,
          duration: 680,
          easing: ease,
          useNativeDriver: true,
        }),
      ]),
    ]).start();

    Animated.timing(lineWidth, {
      toValue: 56,
      duration: 900,
      delay: 2700,
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

      {/* Bloque tipográfico debajo de la escena, sin solapar el logo */}
      <View style={styles.copyBlock} pointerEvents="none">
        <Animated.View
          style={{
            opacity: titleOpacity,
            transform: [{ translateY: titleY }],
            alignItems: "center",
            width: "100%",
          }}
        >
          <Text style={styles.wordmark} allowFontScaling={false}>
            Rizoma
          </Text>
        </Animated.View>

        <View style={styles.lineRow}>
          <View style={styles.lineCap} />
          <Animated.View style={[styles.line, { width: lineWidth }]} />
          <View style={styles.lineCap} />
        </View>

        <Animated.View
          style={{
            opacity: tagOpacity,
            transform: [{ translateY: tagY }],
            marginTop: 12,
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
    left: 20,
    right: 20,
    bottom: "10%",
    alignItems: "center",
    zIndex: 10,
    elevation: 10,
  },
  wordmark: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 44,
    fontWeight: "600",
    color: leafyLogoColors.wordmark,
    letterSpacing: -0.5,
    textAlign: "center",
    includeFontPadding: false,
    width: "100%",
  },
  lineRow: {
    marginTop: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  lineCap: {
    width: 5,
    height: 5,
    borderRadius: 3,
    backgroundColor: leafyLogoColors.leaf,
    opacity: 0.55,
  },
  line: {
    height: 2,
    borderRadius: 2,
    backgroundColor: leafyLogoColors.leaf,
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
