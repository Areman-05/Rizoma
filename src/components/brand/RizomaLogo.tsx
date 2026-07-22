import { Text, View } from "react-native";
import Svg, { Circle, Path } from "react-native-svg";
import { brand } from "@/src/brand/rizoma";

interface RizomaLogoProps {
  size?: "sm" | "md" | "lg";
  showWordmark?: boolean;
}

const sizeMap = {
  sm: { icon: 28, text: 18 },
  md: { icon: 36, text: 22 },
  lg: { icon: 48, text: 28 },
};

export function RizomaLogo({ size = "md", showWordmark = true }: RizomaLogoProps) {
  const dims = sizeMap[size];

  return (
    <View className="flex-row items-center gap-2">
      <Svg width={dims.icon} height={dims.icon} viewBox="0 0 64 64">
        <Circle cx="32" cy="32" r="30" fill={brand.colors.brand} />
        <Path
          d="M32 12c1 12-10 18-10 28a10 10 0 0 0 20 0c0-10-11-16-10-28z"
          fill={brand.colors.white}
          opacity={0.95}
        />
        <Path
          d="M22 38c5 3 10 4 10 4s5-1 10-4"
          stroke={brand.colors.brandSoft}
          strokeWidth="2.5"
          strokeLinecap="round"
          fill="none"
        />
      </Svg>
      {showWordmark ? (
        <Text style={{ fontFamily: "Inter_700Bold", fontSize: dims.text, color: brand.colors.black }}>
          {brand.name}
        </Text>
      ) : null}
    </View>
  );
}
