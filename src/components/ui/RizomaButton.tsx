import { Pressable, Text } from "react-native";
import { colors } from "@/src/theme/tokens";

interface RizomaButtonProps {
  label: string;
  onPress?: () => void;
  variant?: "primary" | "danger";
}

/** CTA estable sin Reanimated (más fiable en Expo Go / emulador). */
export function RizomaButton({ label, onPress, variant = "primary" }: RizomaButtonProps) {
  const backgroundColor = variant === "danger" ? colors.red : colors.brand;

  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      className="rounded-full px-5 py-4"
      style={({ pressed }) => ({
        backgroundColor,
        opacity: pressed ? 0.9 : 1,
        transform: [{ scale: pressed ? 0.98 : 1 }],
      })}
    >
      <Text className="text-center text-base text-white" style={{ fontFamily: "Inter_700Bold" }}>
        {label}
      </Text>
    </Pressable>
  );
}
