import { Pressable, Text } from "react-native";
import { colors } from "@/src/theme/tokens";

interface RizomaButtonProps {
  label: string;
  onPress?: () => void;
  variant?: "primary" | "danger";
}

export function RizomaButton({ label, onPress, variant = "primary" }: RizomaButtonProps) {
  const backgroundColor = variant === "danger" ? colors.red : colors.brand;

  return (
    <Pressable
      onPress={onPress}
      className="rounded-full px-5 py-4 active:opacity-85"
      style={{ backgroundColor }}
      accessibilityRole="button"
    >
      <Text className="text-center text-base text-white" style={{ fontFamily: "Inter_700Bold" }}>
        {label}
      </Text>
    </Pressable>
  );
}
