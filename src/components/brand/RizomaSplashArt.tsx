import { useEffect, useMemo, useRef } from "react";
import { Animated, Easing, StyleSheet, View } from "react-native";
import Svg, {
  Circle,
  Defs,
  Ellipse,
  LinearGradient as SvgGradient,
  Path,
  RadialGradient,
  Stop,
} from "react-native-svg";
import { LinearGradient } from "expo-linear-gradient";
import { colors } from "@/src/theme/tokens";

const AnimatedPath = Animated.createAnimatedComponent(Path);

interface RizomaSplashArtProps {
  animated?: boolean;
  markOpacity: Animated.Value;
  markScale: Animated.Value;
  ringScale: Animated.Value;
  ringOpacity: Animated.Value;
}

/**
 * Escena editorial: atmósfera + medallón + rizoma orgánico (silueta, no palos) + hojas.
 */
export function RizomaSplashArt({
  animated = true,
  markOpacity,
  markScale,
  ringScale,
  ringOpacity,
}: RizomaSplashArtProps) {
  const atmosphere = useRef(new Animated.Value(animated ? 0 : 1)).current;
  const soilOpacity = useRef(new Animated.Value(animated ? 0 : 1)).current;
  const rootOpacity = useRef(new Animated.Value(animated ? 0 : 1)).current;
  const rootScale = useRef(new Animated.Value(animated ? 0.72 : 1)).current;
  const leafBack = useRef(new Animated.Value(animated ? 0 : 1)).current;
  const leafFront = useRef(new Animated.Value(animated ? 0 : 1)).current;
  const vein = useRef(new Animated.Value(animated ? 0 : 1)).current;

  const ease = useMemo(() => Easing.bezier(0.22, 1, 0.36, 1), []);

  useEffect(() => {
    if (!animated) return;

    Animated.sequence([
      Animated.timing(atmosphere, {
        toValue: 1,
        duration: 700,
        easing: Easing.out(Easing.quad),
        useNativeDriver: true,
      }),
      Animated.parallel([
        Animated.timing(soilOpacity, {
          toValue: 1,
          duration: 520,
          easing: ease,
          useNativeDriver: true,
        }),
        Animated.timing(rootOpacity, {
          toValue: 1,
          duration: 780,
          easing: ease,
          useNativeDriver: true,
        }),
        Animated.spring(rootScale, {
          toValue: 1,
          friction: 7,
          tension: 48,
          useNativeDriver: true,
        }),
      ]),
      Animated.parallel([
        Animated.timing(leafBack, {
          toValue: 1,
          duration: 520,
          easing: ease,
          useNativeDriver: true,
        }),
        Animated.timing(leafFront, {
          toValue: 1,
          duration: 620,
          delay: 80,
          easing: ease,
          useNativeDriver: true,
        }),
        Animated.timing(vein, {
          toValue: 1,
          duration: 500,
          delay: 220,
          easing: ease,
          useNativeDriver: true,
        }),
      ]),
    ]).start();
  }, [
    animated,
    ease,
    atmosphere,
    soilOpacity,
    rootOpacity,
    rootScale,
    leafBack,
    leafFront,
    vein,
  ]);

  return (
    <View style={styles.scene} pointerEvents="none">
      <LinearGradient
        colors={["#D8F5E6", colors.brandSoft, colors.mintMid, "#FBFFFD"]}
        locations={[0, 0.28, 0.62, 1]}
        style={StyleSheet.absoluteFill}
      />

      <Animated.View style={[styles.atmosphere, { opacity: atmosphere }]}>
        <View style={[styles.orb, styles.orbTop]} />
        <View style={[styles.orb, styles.orbLeft]} />
        <View style={[styles.orb, styles.orbRight]} />
      </Animated.View>

      <View style={styles.stage}>
        <Animated.View
          style={{
            opacity: ringOpacity,
            transform: [{ scale: ringScale }],
            ...styles.ringWrap,
          }}
        >
          <Svg width={220} height={220} viewBox="0 0 220 220">
            <Defs>
              <RadialGradient id="halo" cx="50%" cy="45%" r="50%">
                <Stop offset="0%" stopColor={colors.brand} stopOpacity="0.22" />
                <Stop offset="70%" stopColor={colors.brand} stopOpacity="0.06" />
                <Stop offset="100%" stopColor={colors.brand} stopOpacity="0" />
              </RadialGradient>
              <SvgGradient id="ringStroke" x1="0" y1="0" x2="1" y2="1">
                <Stop offset="0%" stopColor={colors.brand} stopOpacity="0.55" />
                <Stop offset="100%" stopColor={colors.leafDeep} stopOpacity="0.2" />
              </SvgGradient>
            </Defs>
            <Circle cx={110} cy={110} r={98} fill="url(#halo)" />
            <Circle
              cx={110}
              cy={110}
              r={78}
              fill={colors.white}
              fillOpacity={0.55}
              stroke="url(#ringStroke)"
              strokeWidth={1.5}
            />
            <Circle cx={110} cy={110} r={68} fill={colors.white} fillOpacity={0.72} />
          </Svg>
        </Animated.View>

        <Animated.View
          style={{
            opacity: markOpacity,
            transform: [{ scale: markScale }],
            zIndex: 3,
          }}
        >
          <Svg width={120} height={120} viewBox="0 0 64 64">
            <AnimatedPath
              d="M38 8c12 10 16 24 12 36-3.5 10-12 14-14 14-1 0-2-.5-2-2 0-14 8-28 4-48z"
              fill={colors.leafDeep}
              opacity={leafBack}
            />
            <AnimatedPath
              d="M28 6C14 16 8 30 12 42c3.5 10 12 15 16 15 1.2 0 2-.6 2-2.2C30 40 22 24 28 6z"
              fill={colors.brand}
              opacity={leafFront}
            />
            <AnimatedPath
              d="M26 18c-2 8-2 16 0 24"
              stroke="rgba(255,255,255,0.4)"
              strokeWidth="2"
              strokeLinecap="round"
              fill="none"
              opacity={vein}
            />
          </Svg>
        </Animated.View>

        <Animated.View style={{ opacity: soilOpacity, marginTop: -2, zIndex: 2 }}>
          <Svg width={210} height={96} viewBox="0 0 210 96">
            <Ellipse cx={105} cy={16} rx={72} ry={11} fill={colors.leafDeep} opacity={0.08} />
            <Path
              d="M38 16 C72 6 138 6 172 16 C158 28 128 34 105 34 C82 34 52 28 38 16Z"
              fill={colors.leafDeep}
              opacity={0.26}
            />
            <Path
              d="M54 14 C78 8 132 8 156 14 C146 23 124 27 105 27 C86 27 64 23 54 14Z"
              fill={colors.wordmark}
              opacity={0.2}
            />
          </Svg>
        </Animated.View>

        {/* Rizoma orgánico tipo logo botánico: silueta con curvas, no 3 palos */}
        <Animated.View
          style={{
            opacity: rootOpacity,
            transform: [{ scaleY: rootScale }, { translateY: -6 }],
            zIndex: 1,
            marginTop: -78,
          }}
        >
          <Svg width={210} height={96} viewBox="0 0 210 96">
            {/* Cuerpo central del rizoma */}
            <Path
              d="M105 30
                 C102 42 100 54 101 68
                 C103 78 106 86 105 92
                 C104 86 107 78 109 68
                 C110 54 108 42 105 30Z"
              fill={colors.leafDeep}
              opacity={0.38}
            />
            {/* Rama izquierda gruesa */}
            <Path
              d="M104 36
                 C92 40 78 48 66 60
                 C58 68 50 78 44 88
                 C52 82 62 74 72 66
                 C84 54 96 44 104 40Z"
              fill={colors.leafDeep}
              opacity={0.32}
            />
            {/* Rama derecha gruesa */}
            <Path
              d="M106 36
                 C118 40 132 48 144 60
                 C152 68 160 78 166 88
                 C158 82 148 74 138 66
                 C126 54 114 44 106 40Z"
              fill={colors.leafDeep}
              opacity={0.32}
            />
            {/* Bifurcaciones finas (estilo fibrous root logo) */}
            <Path
              d="M72 58 C60 62 48 70 40 80 C48 76 58 70 68 64Z"
              fill={colors.leafDeep}
              opacity={0.22}
            />
            <Path
              d="M138 58 C150 62 162 70 170 80 C162 76 152 70 142 64Z"
              fill={colors.leafDeep}
              opacity={0.22}
            />
            <Path
              d="M98 52 C88 58 82 70 78 82 C86 74 94 64 100 56Z"
              fill={colors.leafDeep}
              opacity={0.2}
            />
            <Path
              d="M112 52 C122 58 128 70 132 82 C124 74 116 64 110 56Z"
              fill={colors.leafDeep}
              opacity={0.2}
            />
            {/* Puntas orgánicas */}
            <Path
              d="M44 86 C38 90 34 94 32 96 C38 94 44 90 48 88Z"
              fill={colors.leafDeep}
              opacity={0.18}
            />
            <Path
              d="M166 86 C172 90 176 94 178 96 C172 94 166 90 162 88Z"
              fill={colors.leafDeep}
              opacity={0.18}
            />
            <Path
              d="M105 88 C102 92 101 95 100 96 C104 95 106 92 105 88Z"
              fill={colors.leafDeep}
              opacity={0.2}
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
  atmosphere: {
    ...StyleSheet.absoluteFill,
  },
  orb: {
    position: "absolute",
    borderRadius: 999,
    backgroundColor: colors.brand,
  },
  orbTop: {
    top: -40,
    alignSelf: "center",
    left: "22%",
    width: 220,
    height: 220,
    opacity: 0.1,
  },
  orbLeft: {
    top: "42%",
    left: -70,
    width: 160,
    height: 160,
    opacity: 0.07,
  },
  orbRight: {
    top: "34%",
    right: -50,
    width: 140,
    height: 140,
    backgroundColor: colors.leafDeep,
    opacity: 0.06,
  },
  stage: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingBottom: 100,
  },
  ringWrap: {
    position: "absolute",
    top: "50%",
    marginTop: -150,
  },
});
