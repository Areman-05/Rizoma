import { useEffect, useRef } from "react";
import { Animated, Easing, StyleSheet, View } from "react-native";
import Svg, { Circle, Ellipse, Path, Rect } from "react-native-svg";
import { type OnboardingSlideId } from "@/src/data/onboarding";
import { colors } from "@/src/theme/tokens";

interface OnboardingArtProps {
  id: OnboardingSlideId;
}

/** Ilustraciones editoriales por slide (sin reutilizar el isotipo como planta). */
export function OnboardingArt({ id }: OnboardingArtProps) {
  const scale = useRef(new Animated.Value(0.94)).current;
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    scale.setValue(0.94);
    opacity.setValue(0);
    Animated.parallel([
      Animated.timing(opacity, {
        toValue: 1,
        duration: 380,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.spring(scale, {
        toValue: 1,
        friction: 8,
        tension: 68,
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

function Pot({ x, y, w, h, leafTone }: { x: number; y: number; w: number; h: number; leafTone: string }) {
  const potTop = y + h * 0.55;
  return (
    <>
      <Ellipse cx={x + w / 2} cy={y + 10} rx={w * 0.28} ry={6} fill={leafTone} opacity={0.35} />
      <Path
        d={`M${x + w * 0.42} ${y + 8} C${x + w * 0.2} ${y + 28} ${x + w * 0.22} ${y + 48} ${x + w * 0.48} ${y + 54}`}
        stroke={leafTone}
        strokeWidth={3.2}
        strokeLinecap="round"
        fill="none"
      />
      <Path
        d={`M${x + w * 0.52} ${y + 6} C${x + w * 0.78} ${y + 24} ${x + w * 0.74} ${y + 46} ${x + w * 0.5} ${y + 54}`}
        stroke={colors.brand}
        strokeWidth={3.2}
        strokeLinecap="round"
        fill="none"
      />
      <Path
        d={`M${x + w * 0.18} ${potTop} H${x + w * 0.82} L${x + w * 0.72} ${y + h} H${x + w * 0.28} Z`}
        fill="#C4A484"
      />
      <Rect x={x + w * 0.14} y={potTop - 6} width={w * 0.72} height={8} rx={3} fill="#A67C52" />
    </>
  );
}

function BoutiqueArt() {
  return (
    <Svg width="100%" height="100%" viewBox="0 0 280 200">
      <Ellipse cx={140} cy={176} rx={110} ry={12} fill={colors.brand} opacity={0.08} />
      <Rect x={28} y={132} width={224} height={14} rx={4} fill={colors.leafDeep} opacity={0.12} />
      <Rect x={36} y={128} width={208} height={8} rx={3} fill={colors.white} opacity={0.7} />

      <Pot x={42} y={48} w={70} h={90} leafTone={colors.leafDeep} />
      <Pot x={105} y={36} w={70} h={102} leafTone={colors.brand} />
      <Pot x={168} y={54} w={70} h={84} leafTone={colors.leafDeep} />

      <Rect x={58} y={158} width={36} height={12} rx={6} fill={colors.white} />
      <Rect x={122} y={158} width={36} height={12} rx={6} fill={colors.white} />
      <Rect x={186} y={158} width={36} height={12} rx={6} fill={colors.white} />
      <Circle cx={66} cy={164} r={2.5} fill={colors.brand} />
      <Circle cx={130} cy={164} r={2.5} fill={colors.brand} />
      <Circle cx={194} cy={164} r={2.5} fill={colors.brand} />
    </Svg>
  );
}

function CriteriaArt() {
  return (
    <Svg width="100%" height="100%" viewBox="0 0 280 200">
      <Ellipse cx={140} cy={178} rx={100} ry={10} fill={colors.brand} opacity={0.07} />
      <Rect x={58} y={28} width={164} height={140} rx={26} fill={colors.white} />
      <Rect x={58} y={28} width={164} height={140} rx={26} fill="none" stroke={colors.border} strokeWidth={1.2} />

      <Rect x={78} y={46} width={124} height={58} rx={16} fill={colors.brandSoft} />
      <Path
        d="M140 54 C128 66 124 84 132 98 C136 104 144 106 148 100 C152 88 148 68 140 54Z"
        fill={colors.brand}
      />
      <Path
        d="M140 56 C150 68 154 86 146 98 C142 104 136 104 134 98 C128 86 132 68 140 56Z"
        fill={colors.leafDeep}
        opacity={0.85}
      />

      <Rect x={78} y={118} width={52} height={18} rx={9} fill={colors.mintWash} />
      <Circle cx={88} cy={127} r={3.5} fill={colors.yellow} />
      <Rect x={96} y={124} width={24} height={6} rx={3} fill={colors.leafDeep} opacity={0.35} />

      <Rect x={138} y={118} width={52} height={18} rx={9} fill={colors.mintWash} />
      <Circle cx={148} cy={127} r={3.5} fill={colors.brand} />
      <Rect x={156} y={124} width={24} height={6} rx={3} fill={colors.leafDeep} opacity={0.35} />

      <Rect x={98} y={144} width={84} height={12} rx={6} fill={colors.brandSoft} />
      <Circle cx={110} cy={150} r={3} fill={colors.leafDeep} />
      <Rect x={118} y={147} width={50} height={6} rx={3} fill={colors.leafDeep} opacity={0.28} />
    </Svg>
  );
}

function EcosystemArt() {
  return (
    <Svg width="100%" height="100%" viewBox="0 0 280 200">
      <Ellipse cx={140} cy={176} rx={108} ry={11} fill={colors.brand} opacity={0.08} />

      {/* Tarjetas jardín */}
      <Rect x={36} y={58} width={64} height={78} rx={16} fill={colors.white} stroke={colors.border} strokeWidth={1.2} />
      <Rect x={46} y={68} width={44} height={36} rx={10} fill={colors.brandSoft} />
      <Path d="M68 74 C60 84 60 96 68 102 C76 96 76 84 68 74Z" fill={colors.brand} />
      <Rect x={48} y={112} width={40} height={6} rx={3} fill={colors.leafDeep} opacity={0.2} />
      <Rect x={48} y={122} width={28} height={5} rx={2.5} fill={colors.leafDeep} opacity={0.12} />

      <Rect x={108} y={48} width={64} height={88} rx={16} fill={colors.white} stroke={colors.border} strokeWidth={1.2} />
      <Rect x={118} y={58} width={44} height={42} rx={10} fill={colors.brandSoft} />
      <Path d="M140 64 C130 76 130 92 140 100 C150 92 150 76 140 64Z" fill={colors.brand} />
      <Rect x={120} y={110} width={40} height={6} rx={3} fill={colors.leafDeep} opacity={0.2} />
      <Rect x={120} y={120} width={28} height={5} rx={2.5} fill={colors.leafDeep} opacity={0.12} />

      {/* Marco de escaneo (viewfinder), no lupa */}
      <Rect x={188} y={52} width={72} height={92} rx={18} fill={colors.white} stroke={colors.brand} strokeWidth={2} />
      <Rect x={200} y={66} width={48} height={48} rx={12} fill={colors.brandSoft} />
      <Path d="M224 74 C216 84 216 96 224 104 C232 96 232 84 224 74Z" fill={colors.brand} />

      <Path d="M198 64 H210" stroke={colors.brand} strokeWidth={3} strokeLinecap="round" />
      <Path d="M198 64 V76" stroke={colors.brand} strokeWidth={3} strokeLinecap="round" />
      <Path d="M250 64 H238" stroke={colors.brand} strokeWidth={3} strokeLinecap="round" />
      <Path d="M250 64 V76" stroke={colors.brand} strokeWidth={3} strokeLinecap="round" />
      <Path d="M198 132 H210" stroke={colors.brand} strokeWidth={3} strokeLinecap="round" />
      <Path d="M198 132 V120" stroke={colors.brand} strokeWidth={3} strokeLinecap="round" />
      <Path d="M250 132 H238" stroke={colors.brand} strokeWidth={3} strokeLinecap="round" />
      <Path d="M250 132 V120" stroke={colors.brand} strokeWidth={3} strokeLinecap="round" />

      <Rect x={206} y={124} width={36} height={6} rx={3} fill={colors.brand} opacity={0.35} />
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
    height: 210,
    borderRadius: 28,
    backgroundColor: "rgba(232, 248, 240, 0.85)",
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "rgba(1, 183, 99, 0.1)",
  },
});
