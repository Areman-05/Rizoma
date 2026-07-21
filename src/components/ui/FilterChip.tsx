import { Pressable, Text } from "react-native";

interface FilterChipProps {
  label: string;
  active?: boolean;
  onPress?: () => void;
}

export function FilterChip({ label, active = false, onPress }: FilterChipProps) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityState={{ selected: active }}
      className={`rounded-2xl px-3 py-2 ${active ? "bg-rizoma-primary" : "bg-white"}`}
    >
      <Text className={`text-sm font-medium ${active ? "text-white" : "text-rizoma-primary"}`}>{label}</Text>
    </Pressable>
  );
}
