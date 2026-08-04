import { useEffect, useRef } from "react";
import { Animated, Easing, StyleSheet, View } from "react-native";
import Svg, { Circle, Ellipse, Path, Rect } from "react-native-svg";
import { type OnboardingSlideId } from "@/src/data/onboarding";
import { colors } from "@/src/theme/tokens";

interface OnboardingArtProps {
  id: OnboardingSlideId;
}

/** Ilustración SVG ligera por slide — sin fotos stock. */
export function OnboardingArt({ id }: OnboardingArtProps) {
  const scale = useRef(new Animated.Value(0.92)).current;
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    scale.setValue(0.92);
    opacity.setValue(0);
    Animated.parallel([
      Animated.timing(opacity, {
        toValue: 1,
        duration: 420,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.spring(scale, {
        toValue: 1,
        friction: 7,
        tension: 70,
        useNativeDriver: true,
      }),
    ]).start();
  }, [id, opacity, scale]);

  return (
    <Animated.View style={[styles.wrap, { opacity, transform: [{ scale }] }]}>
      <View style={styles.canvas}>
        {id === "boutique" ? <BoutiqueArt /> : null}
        {id === "criteria" ? <CriteriaArt /> : null}
        {id === "ecosystem" ? <EcosystemArt /> : null}
      </View>
    </Animated.View>
  );
}

function BoutiqueArt() {
  return (
    <Svg width="100%" height="100%" viewBox="0 0 280 200">
      <Ellipse cx={140} cy={168} rx={96} ry={14} fill={colors.brand} opacity={0.1} />
      <Rect x={48} y={58} width={72} height={96} rx={18} fill={colors.white} stroke={colors.border} strokeWidth={1.5} />
      <Path d="M84 78c-10 12-12 28-6 40 4 8 12 12 14 12s4-1 4-3c0-12-6-24-4-40z" fill={colors.leafDeep} />
      <Path d="M84 74c10 12 12 28 6 40-4 8-12 12-14 12s-4-1-4-3c0-12 6-24 4-40z" fill={colors.brand} />
      <Rect x={160} y={42} width={72} height={112} rx={18} fill={colors.white} stroke={colors.border} strokeWidth={1.5} />
      <Path d="M196 64c-12 14-14 32-7 46 5 9 14 14 16 14s5-1 5-3c0-14-7-28-5-46z" fill={colors.leafDeep} />
      <Path d="M196 60c12 14 14 32 7 46-5 9-14 14-16 14s-5-1-5-3c0-14 7-28 5-46z" fill={colors.brand} />
      <Circle cx={84} cy={168} r={4} fill={colors.brand} opacity={0.45} />
      <Circle cx={196} cy={168} r={4} fill={colors.brand} opacity={0.45} />
    </Svg>
  );
}

function CriteriaArt() {
  return (
    <Svg width="100%" height="100%" viewBox="0 0 280 200">
      <Ellipse cx={140} cy={170} rx={100} ry={12} fill={colors.brand} opacity={0.08} />
      <Rect x={70} y={36} width={140} height={128} rx={24} fill={colors.white} stroke={colors.border} strokeWidth={1.5} />
      <Path
        d="M140 58c-16 16-20 38-10 56 7 12 20 18 24 18s7-2 7-5c0-18-10-36-7-56z"
        fill={colors.leafDeep}
      />
      <Path
        d="M140 54c16 16 20 38 10 56-7 12-20 18-24 18s-7-2-7-5c0-18 10-36 7-56z"
        fill={colors.brand}
      />
      <Rect x={92} y={128} width={36} height={10} rx={5} fill={colors.brandSoft} />
      <Rect x={136} y={128} width={36} height={10} rx={5} fill={colors.brandSoft} />
      <Circle cx={100} cy={133} r={3} fill={colors.brand} />
      <Circle cx={144} cy={133} r={3} fill={colors.yellow} />
      <Rect x={110} y={146} width={60} height={8} rx={4} fill={colors.mintWash} />
      <Circle cx={118} cy={150} r={2.5} fill={colors.leafDeep} />
    </Svg>
  );
}

function EcosystemArt() {
  return (
    <Svg width="100%" height="100%" viewBox="0 0 280 200">
      <Ellipse cx={140} cy={168} rx={108} ry={14} fill={colors.brand} opacity={0.1} />
      <Path
        d="M70 150 C90 110 110 96 140 92 C170 96 190 110 210 150 Z"
        fill={colors.leafDeep}
        opacity={0.2}
      />
      <Path d="M140 92 C136 112 134 130 140 152" stroke={colors.leafDeep} strokeWidth={2} fill="none" opacity={0.5} />
      <Path
        d="M140 70c-14 14-18 34-9 50 6 11 18 16 21 16s6-2 6-4c0-16-9-32-6-50z"
        fill={colors.leafDeep}
      />
      <Path
        d="M140 66c14 14 18 34 9 50-6 11-18 16-21 16s-6-2-6-4c0-16 9-32 6-50z"
        fill={colors.brand}
      />
      <Circle cx={198} cy={78} r={28} fill={colors.white} stroke={colors.brand} strokeWidth={2.5} />
      <Circle cx={198} cy={78} r={10} fill="none" stroke={colors.brand} strokeWidth={2} />
      <Path d="M216 96 L228 108" stroke={colors.brand} strokeWidth={3} strokeLinecap="round" />
    </Svg>
  );
}

const styles = StyleSheet.create({
  wrap: {
    width: "100%",
    alignItems: "center",
  },
  canvas: {
    width: "100%",
    height: 200,
    borderRadius: 28,
    backgroundColor: colors.brandSoft,
    overflow: "hidden",
    paddingHorizontal: 8,
    paddingTop: 8,
  },
});
