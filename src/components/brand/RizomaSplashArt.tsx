import { useEffect, useMemo, useRef } from "react";
import { Animated, Easing, StyleSheet, View } from "react-native";
import Svg, {
  Circle,
  Defs,
  Ellipse,
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
 * Escena botánica premium: atmósfera, motas, hojas fantasma, rizoma y mark.
 */
export function RizomaSplashArt({
  animated = true,
  markOpacity,
  markScale,
  ringScale,
  ringOpacity,
}: RizomaSplashArtProps) {
  const atmosphere = useRef(new Animated.Value(animated ? 0 : 1)).current;
  const motes = useRef(new Animated.Value(animated ? 0 : 1)).current;
  const ghosts = useRef(new Animated.Value(animated ? 0 : 0.35)).current;
  const soilOpacity = useRef(new Animated.Value(animated ? 0 : 1)).current;
  const rootOpacity = useRef(new Animated.Value(animated ? 0 : 1)).current;
  const rootScale = useRef(new Animated.Value(animated ? 0.78 : 1)).current;
  const leafBack = useRef(new Animated.Value(animated ? 0 : 1)).current;
  const leafFront = useRef(new Animated.Value(animated ? 0 : 1)).current;
  const vein = useRef(new Animated.Value(animated ? 0 : 1)).current;
  const floatY = useRef(new Animated.Value(0)).current;

  const ease = useMemo(() => Easing.bezier(0.22, 1, 0.36, 1), []);

  useEffect(() => {
    if (!animated) return;

    Animated.sequence([
      Animated.parallel([
        Animated.timing(atmosphere, {
          toValue: 1,
          duration: 800,
          easing: Easing.out(Easing.quad),
          useNativeDriver: true,
        }),
        Animated.timing(ghosts, {
          toValue: 0.38,
          duration: 1100,
          easing: ease,
          useNativeDriver: true,
        }),
        Animated.timing(motes, {
          toValue: 1,
          duration: 1200,
          delay: 200,
          easing: ease,
          useNativeDriver: true,
        }),
      ]),
      Animated.parallel([
        Animated.timing(soilOpacity, {
          toValue: 1,
          duration: 560,
          easing: ease,
          useNativeDriver: true,
        }),
        Animated.timing(rootOpacity, {
          toValue: 1,
          duration: 820,
          easing: ease,
          useNativeDriver: true,
        }),
        Animated.spring(rootScale, {
          toValue: 1,
          friction: 8,
          tension: 46,
          useNativeDriver: true,
        }),
      ]),
      Animated.parallel([
        Animated.timing(leafBack, {
          toValue: 1,
          duration: 540,
          easing: ease,
          useNativeDriver: true,
        }),
        Animated.timing(leafFront, {
          toValue: 1,
          duration: 640,
          delay: 70,
          easing: ease,
          useNativeDriver: true,
        }),
        Animated.timing(vein, {
          toValue: 1,
          duration: 520,
          delay: 200,
          easing: ease,
          useNativeDriver: true,
        }),
      ]),
    ]).start(() => {
      Animated.loop(
        Animated.sequence([
          Animated.timing(floatY, {
            toValue: -4,
            duration: 1600,
            easing: Easing.inOut(Easing.sin),
            useNativeDriver: true,
          }),
          Animated.timing(floatY, {
            toValue: 0,
            duration: 1600,
            easing: Easing.inOut(Easing.sin),
            useNativeDriver: true,
          }),
        ]),
      ).start();
    });
  }, [
    animated,
    ease,
    atmosphere,
    motes,
    ghosts,
    soilOpacity,
    rootOpacity,
    rootScale,
    leafBack,
    leafFront,
    vein,
    floatY,
  ]);

  return (
    <View style={styles.scene} pointerEvents="none">
      <LinearGradient
        colors={["#CFF0DC", colors.brandSoft, colors.mintMid, colors.mintWash, "#FAFFFC"]}
        locations={[0, 0.22, 0.48, 0.72, 1]}
        style={StyleSheet.absoluteFill}
      />

      {/* Vignette suave para profundidad */}
      <LinearGradient
        colors={["rgba(13,61,42,0.06)", "transparent", "transparent", "rgba(13,61,42,0.04)"]}
        locations={[0, 0.22, 0.75, 1]}
        style={StyleSheet.absoluteFill}
      />

      <Animated.View style={[styles.atmosphere, { opacity: atmosphere }]}>
        <View style={[styles.orb, styles.orbTop]} />
        <View style={[styles.orb, styles.orbLeft]} />
        <View style={[styles.orb, styles.orbRight]} />
        <View style={[styles.orb, styles.orbBottom]} />
      </Animated.View>

      {/* Hojas fantasma de fondo (armonía con el isotipo) */}
      <Animated.View style={[styles.ghostLayer, { opacity: ghosts }]}>
        <Svg width="100%" height="100%" viewBox="0 0 390 844" preserveAspectRatio="xMidYMid slice">
          <Path
            d="M52 210c28 22 38 54 28 82-8 22-28 32-32 32-2 0-4-1-4-4 0-32 18-64 8-110z"
            fill={colors.leafDeep}
            opacity={0.07}
          />
          <Path
            d="M48 200c-26 24-34 56-22 84 8 22 28 32 34 32 2 0 4-1 4-4 0-32-18-64-8-110z"
            fill={colors.brand}
            opacity={0.09}
          />
          <Path
            d="M330 260c-30 24-40 58-28 88 8 24 30 34 34 34 2 0 4-1 4-4 0-34-18-66-10-118z"
            fill={colors.leafDeep}
            opacity={0.08}
          />
          <Path
            d="M336 248c28 26 36 60 22 90-8 24-28 34-34 34-2 0-4-1-4-4 0-34 18-66 10-118z"
            fill={colors.brand}
            opacity={0.1}
          />
          <Path
            d="M70 620c22 18 30 44 22 66-6 18-22 26-26 26-2 0-3-1-3-3 0-26 14-52 6-88z"
            fill={colors.brand}
            opacity={0.07}
          />
          <Path
            d="M320 640c-24 18-32 46-22 70 6 18 24 28 28 28 2 0 3-1 3-3 0-28-14-54-6-94z"
            fill={colors.leafDeep}
            opacity={0.07}
          />
        </Svg>
      </Animated.View>

      {/* Motas / polen */}
      <Animated.View style={[styles.motes, { opacity: motes }]}>
        <Svg width="100%" height="100%" viewBox="0 0 390 844" preserveAspectRatio="xMidYMid slice">
          {[
            [64, 180, 2.2],
            [110, 240, 1.6],
            [300, 200, 2],
            [340, 280, 1.4],
            [48, 480, 1.8],
            [86, 540, 1.3],
            [310, 520, 1.7],
            [350, 460, 1.5],
            [180, 160, 1.2],
            [220, 700, 1.6],
          ].map(([cx, cy, r], i) => (
            <Circle
              key={i}
              cx={cx}
              cy={cy}
              r={r}
              fill={i % 2 === 0 ? colors.brand : colors.leafDeep}
              opacity={0.22}
            />
          ))}
        </Svg>
      </Animated.View>

      <View style={styles.stage}>
        <Animated.View
          style={{
            opacity: ringOpacity,
            transform: [{ scale: ringScale }],
            ...styles.ringWrap,
          }}
        >
          <Svg width={260} height={260} viewBox="0 0 260 260">
            <Defs>
              <RadialGradient id="halo" cx="50%" cy="46%" r="50%">
                <Stop offset="0%" stopColor={colors.brand} stopOpacity="0.2" />
                <Stop offset="45%" stopColor={colors.brand} stopOpacity="0.08" />
                <Stop offset="100%" stopColor={colors.brand} stopOpacity="0" />
              </RadialGradient>
            </Defs>
            <Circle cx={130} cy={130} r={118} fill="url(#halo)" />
            {/* Anillo editorial sutil (sin relleno blanco) */}
            <Circle
              cx={130}
              cy={130}
              r={92}
              fill="none"
              stroke={colors.brand}
              strokeOpacity={0.14}
              strokeWidth={1}
            />
            <Circle
              cx={130}
              cy={130}
              r={78}
              fill="none"
              stroke={colors.leafDeep}
              strokeOpacity={0.08}
              strokeWidth={1}
            />
          </Svg>
        </Animated.View>

        <Animated.View
          style={{
            opacity: markOpacity,
            transform: [{ scale: markScale }, { translateY: floatY }],
            zIndex: 3,
          }}
        >
          <Svg width={124} height={124} viewBox="0 0 64 64">
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
              stroke="rgba(255,255,255,0.42)"
              strokeWidth="2"
              strokeLinecap="round"
              fill="none"
              opacity={vein}
            />
          </Svg>
        </Animated.View>

        <Animated.View style={{ opacity: soilOpacity, marginTop: 2, zIndex: 2 }}>
          <Svg width={240} height={40} viewBox="0 0 240 40">
            <Ellipse cx={120} cy={14} rx={88} ry={10} fill={colors.leafDeep} opacity={0.06} />
            <Path
              d="M28 12 C70 2 170 2 212 12 C194 24 156 30 120 30 C84 30 46 24 28 12Z"
              fill={colors.leafDeep}
              opacity={0.22}
            />
            <Path
              d="M48 10 C82 3 158 3 192 10 C176 20 148 24 120 24 C92 24 64 20 48 10Z"
              fill={colors.wordmark}
              opacity={0.16}
            />
            {/* Brillo de tierra */}
            <Path
              d="M70 11 C100 6 140 6 170 11"
              stroke={colors.brand}
              strokeOpacity={0.25}
              strokeWidth={1.2}
              strokeLinecap="round"
              fill="none"
            />
          </Svg>
        </Animated.View>

        <Animated.View
          style={{
            opacity: rootOpacity,
            transform: [{ scaleY: rootScale }, { translateY: -10 }],
            zIndex: 1,
            marginTop: -8,
          }}
        >
          <Svg width={240} height={88} viewBox="0 0 240 88">
            <Path
              d="M120 8 C116 22 114 36 116 52 C118 64 122 74 120 82 C118 74 122 64 124 52 C126 36 124 22 120 8Z"
              fill={colors.leafDeep}
              opacity={0.34}
            />
            <Path
              d="M118 14 C100 20 82 30 66 44 C54 54 44 66 36 78 C48 70 62 60 76 50 C94 36 110 22 118 18Z"
              fill={colors.leafDeep}
              opacity={0.28}
            />
            <Path
              d="M122 14 C140 20 158 30 174 44 C186 54 196 66 204 78 C192 70 178 60 164 50 C146 36 130 22 122 18Z"
              fill={colors.leafDeep}
              opacity={0.28}
            />
            <Path
              d="M78 40 C62 46 48 56 38 68 C50 62 64 54 76 46Z"
              fill={colors.leafDeep}
              opacity={0.18}
            />
            <Path
              d="M162 40 C178 46 192 56 202 68 C190 62 176 54 164 46Z"
              fill={colors.leafDeep}
              opacity={0.18}
            />
            <Path
              d="M110 28 C98 36 90 50 84 64 C94 54 104 42 112 32Z"
              fill={colors.leafDeep}
              opacity={0.16}
            />
            <Path
              d="M130 28 C142 36 150 50 156 64 C146 54 136 42 128 32Z"
              fill={colors.leafDeep}
              opacity={0.16}
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
  ghostLayer: {
    ...StyleSheet.absoluteFill,
  },
  motes: {
    ...StyleSheet.absoluteFill,
  },
  orb: {
    position: "absolute",
    borderRadius: 999,
    backgroundColor: colors.brand,
  },
  orbTop: {
    top: -60,
    left: "18%",
    width: 260,
    height: 260,
    opacity: 0.11,
  },
  orbLeft: {
    top: "38%",
    left: -90,
    width: 190,
    height: 190,
    opacity: 0.07,
  },
  orbRight: {
    top: "28%",
    right: -70,
    width: 170,
    height: 170,
    backgroundColor: colors.leafDeep,
    opacity: 0.06,
  },
  orbBottom: {
    bottom: "8%",
    alignSelf: "center",
    left: "30%",
    width: 180,
    height: 180,
    opacity: 0.05,
  },
  stage: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    // Deja aire abajo para el wordmark «Rizoma» (no se solapa)
    paddingBottom: 168,
  },
  ringWrap: {
    position: "absolute",
    top: "46%",
    marginTop: -168,
  },
});
