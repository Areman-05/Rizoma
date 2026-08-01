import { Text, View } from "react-native";
import Svg, { Path } from "react-native-svg";
import { brand } from "@/src/brand/rizoma";

interface RizomaLogoProps {
  size?: "sm" | "md" | "lg" | "hero";
  showWordmark?: boolean;
}

const sizeMap = {
  sm: { icon: 28, text: 18 },
  md: { icon: 36, text: 22 },
  lg: { icon: 48, text: 28 },
  hero: { icon: 96, text: 40 },
};

/** Verdes tipo Leafy (captura Behance). */
export const leafyLogoColors = {
  leaf: "#01B763",
  leafDeep: "#0A5C3A",
  wordmark: "#0D3D2A",
} as const;

/**
 * Icono Leafy: dos hojas solapadas, sin círculo detrás.
 */
export function RizomaMark({ size = 64 }: { size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 64 64">
      {/* Hoja trasera (más oscura, a la derecha) */}
      <Path
        d="M38 8c12 10 16 24 12 36-3.5 10-12 14-14 14-1 0-2-.5-2-2 0-14 8-28 4-48z"
        fill={leafyLogoColors.leafDeep}
      />
      {/* Hoja delantera (verde vivo) */}
      <Path
        d="M28 6C14 16 8 30 12 42c3.5 10 12 15 16 15 1.2 0 2-.6 2-2.2C30 40 22 24 28 6z"
        fill={leafyLogoColors.leaf}
      />
      {/* Nervio suave hoja frontal */}
      <Path
        d="M26 18c-2 8-2 16 0 24"
        stroke="rgba(255,255,255,0.35)"
        strokeWidth="2"
        strokeLinecap="round"
        fill="none"
      />
    </Svg>
  );
}

export function RizomaLogo({ size = "md", showWordmark = true }: RizomaLogoProps) {
  const dims = sizeMap[size];

  return (
    <View className="flex-row items-center gap-2.5">
      <RizomaMark size={dims.icon} />
      {showWordmark ? (
        <Text
          style={{
            fontFamily: "Inter_600SemiBold",
            fontSize: dims.text,
            color: leafyLogoColors.wordmark,
            letterSpacing: -0.3,
          }}
        >
          {brand.name}
        </Text>
      ) : null}
    </View>
  );
}
