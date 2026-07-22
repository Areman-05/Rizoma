import { Pressable, Text } from "react-native";
import { colors } from "@/src/theme/tokens";

interface FilterChipProps {
  label: string;
  active?: boolean;
  onPress?: () => void;
  variant?: "dark" | "brand";
}

export function FilterChip({ label, active = false, onPress, variant = "dark" }: FilterChipProps) {
  const activeBg = variant === "brand" ? colors.brand : colors.black;

  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityState={{ selected: active }}
      className={`rounded-full px-4 py-2 ${active ? "" : "bg-rizoma-gray"}`}
      style={active ? { backgroundColor: activeBg } : undefined}
    >
      <Text
        className={`text-sm ${active ? "text-white" : "text-rizoma-black"}`}
        style={{ fontFamily: active ? "Inter_600SemiBold" : "Inter_400Regular" }}
      >
        {label}
      </Text>
    </Pressable>
  );
}
