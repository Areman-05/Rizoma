import { Pressable, Text } from "react-native";
import { colors } from "@/src/theme/tokens";

interface RizomaButtonProps {
  label: string;
  onPress?: () => void;
  variant?: "primary" | "danger";
  disabled?: boolean;
}

/** CTA estable con estilos inline (fiable en Expo Go / emulador; NativeWind a veces colapsa padding). */
export function RizomaButton({
  label,
  onPress,
  variant = "primary",
  disabled = false,
}: RizomaButtonProps) {
  const backgroundColor = variant === "danger" ? colors.red : colors.brand;

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      accessibilityRole="button"
      accessibilityLabel={label}
      style={({ pressed }) => ({
        backgroundColor,
        borderRadius: 999,
        minHeight: 56,
        paddingVertical: 16,
        paddingHorizontal: 20,
        alignItems: "center",
        justifyContent: "center",
        opacity: disabled ? 0.6 : pressed ? 0.9 : 1,
        transform: [{ scale: pressed && !disabled ? 0.98 : 1 }],
      })}
    >
      <Text
        style={{
          color: colors.white,
          fontFamily: "Inter_700Bold",
          fontSize: 16,
          textAlign: "center",
        }}
      >
        {label}
      </Text>
    </Pressable>
  );
}
