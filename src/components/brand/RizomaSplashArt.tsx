import { useEffect, useMemo, useRef } from "react";
import { Animated, Easing, StyleSheet, View } from "react-native";
import Svg, { Ellipse, Path } from "react-native-svg";
import { LinearGradient } from "expo-linear-gradient";
import { RizomaMark } from "@/src/components/brand/RizomaLogo";
import { colors } from "@/src/theme/tokens";

const AnimatedPath = Animated.createAnimatedComponent(Path);

const ROOT_LEN = 118;
const ROOT_SIDE_LEN = 52;

interface RizomaSplashArtProps {
  animated?: boolean;
  markOpacity: Animated.Value;
  markScale: Animated.Value;
}

/**
 * Escena botánica: tierra → raíces → (el mark se compone fuera).
 */
export function RizomaSplashArt({ animated = true, markOpacity, markScale }: RizomaSplashArtProps) {
  const soilOpacity = useRef(new Animated.Value(animated ? 0 : 1)).current;
  const soilScale = useRef(new Animated.Value(animated ? 0.86 : 1)).current;
  const mainRoot = useRef(new Animated.Value(animated ? ROOT_LEN : 0)).current;
  const leftRoot = useRef(new Animated.Value(animated ? ROOT_SIDE_LEN : 0)).current;
  const rightRoot = useRef(new Animated.Value(animated ? ROOT_SIDE_LEN : 0)).current;
  const glowOpacity = useRef(new Animated.Value(animated ? 0 : 0.55)).current;

  const ease = useMemo(() => Easing.bezier(0.22, 1, 0.36, 1), []);

  useEffect(() => {
    if (!animated) return;

    Animated.sequence([
      Animated.parallel([
        Animated.timing(soilOpacity, {
          toValue: 1,
          duration: 700,
          easing: ease,
          useNativeDriver: true,
        }),
        Animated.timing(soilScale, {
          toValue: 1,
          duration: 700,
          easing: ease,
          useNativeDriver: true,
        }),
        Animated.timing(glowOpacity, {
          toValue: 0.55,
          duration: 900,
          easing: Easing.out(Easing.quad),
          useNativeDriver: true,
        }),
      ]),
      Animated.parallel([
        Animated.timing(mainRoot, {
          toValue: 0,
          duration: 900,
          easing: ease,
          useNativeDriver: false,
        }),
        Animated.timing(leftRoot, {
          toValue: 0,
          duration: 720,
          delay: 120,
          easing: ease,
          useNativeDriver: false,
        }),
        Animated.timing(rightRoot, {
          toValue: 0,
          duration: 720,
          delay: 180,
          easing: ease,
          useNativeDriver: false,
        }),
      ]),
    ]).start();
  }, [animated, ease, soilOpacity, soilScale, mainRoot, leftRoot, rightRoot, glowOpacity]);

  return (
    <View style={styles.scene} pointerEvents="none">
      <LinearGradient
        colors={[colors.brandSoft, colors.mintMid, colors.white]}
        locations={[0, 0.42, 1]}
        style={StyleSheet.absoluteFill}
      />

      <Animated.View style={[styles.glow, { opacity: glowOpacity }]} />

      <View style={styles.plantStage}>
        <Animated.View
          style={{
            opacity: markOpacity,
            transform: [{ scale: markScale }],
            marginBottom: -6,
            zIndex: 2,
          }}
        >
          <RizomaMark size={112} />
        </Animated.View>

        <Animated.View
          style={{
            opacity: soilOpacity,
            transform: [{ scale: soilScale }],
            alignItems: "center",
          }}
        >
          <Svg width={220} height={120} viewBox="0 0 220 120">
            <Ellipse
              cx={110}
              cy={28}
              rx={78}
              ry={18}
              fill={colors.leafDeep}
              opacity={0.18}
            />
            <Ellipse cx={110} cy={26} rx={64} ry={14} fill={colors.leafDeep} opacity={0.35} />
            <Ellipse cx={110} cy={24} rx={48} ry={10} fill={colors.wordmark} opacity={0.45} />

            <AnimatedPath
              d="M110 28 C108 48 106 68 110 96"
              stroke={colors.leafDeep}
              strokeWidth={2.4}
              strokeLinecap="round"
              fill="none"
              strokeDasharray={`${ROOT_LEN} ${ROOT_LEN}`}
              strokeDashoffset={mainRoot}
              opacity={0.85}
            />
            <AnimatedPath
              d="M110 44 C92 52 78 64 70 78"
              stroke={colors.leafDeep}
              strokeWidth={1.8}
              strokeLinecap="round"
              fill="none"
              strokeDasharray={`${ROOT_SIDE_LEN} ${ROOT_SIDE_LEN}`}
              strokeDashoffset={leftRoot}
              opacity={0.55}
            />
            <AnimatedPath
              d="M110 50 C126 58 142 70 150 84"
              stroke={colors.leafDeep}
              strokeWidth={1.8}
              strokeLinecap="round"
              fill="none"
              strokeDasharray={`${ROOT_SIDE_LEN} ${ROOT_SIDE_LEN}`}
              strokeDashoffset={rightRoot}
              opacity={0.55}
            />
          </Svg>
        </Animated.View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  scene: {
    ...StyleSheet.absoluteFill,
    overflow: "hidden",
  },
  glow: {
    position: "absolute",
    top: "28%",
    alignSelf: "center",
    width: 220,
    height: 220,
    borderRadius: 110,
    backgroundColor: "rgba(1, 183, 99, 0.12)",
  },
  plantStage: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingBottom: 72,
  },
});
