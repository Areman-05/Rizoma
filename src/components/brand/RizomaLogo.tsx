import { Text, View } from "react-native";
import Svg, { Circle, Path } from "react-native-svg";
import { brand } from "@/src/brand/rizoma";

interface RizomaLogoProps {
  size?: "sm" | "md" | "lg";
  showWordmark?: boolean;
}

const sizeMap = {
  sm: { icon: 28, text: "text-lg" },
  md: { icon: 40, text: "text-2xl" },
  lg: { icon: 56, text: "text-4xl" },
};

export function RizomaLogo({ size = "md", showWordmark = true }: RizomaLogoProps) {
  const dims = sizeMap[size];

  return (
    <View className="flex-row items-center gap-2">
      <Svg width={dims.icon} height={dims.icon} viewBox="0 0 64 64">
        <Circle cx="32" cy="32" r="30" fill={brand.colors.primary} />
        <Path
          d="M32 14c0 10-8 16-8 26 0 6 3.5 10 8 10s8-4 8-10c0-10-8-16-8-26z"
          fill={brand.colors.accent}
        />
        <Path d="M24 40c4 2 8 3 8 3s4-1 8-3" stroke={brand.colors.canvas} strokeWidth="2" fill="none" />
      </Svg>
      {showWordmark ? (
        <Text className={`${dims.text} font-bold text-rizoma-primary`}>{brand.name}</Text>
      ) : null}
    </View>
  );
}
