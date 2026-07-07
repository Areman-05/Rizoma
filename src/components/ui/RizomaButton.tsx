import { Pressable, Text } from "react-native";

interface RizomaButtonProps {
  label: string;
  onPress?: () => void;
}

export function RizomaButton({ label, onPress }: RizomaButtonProps) {
  return (
    <Pressable
      onPress={onPress}
      className="rounded-3xl bg-rizoma-primary px-5 py-4 active:opacity-80"
      accessibilityRole="button"
    >
      <Text className="text-center text-base font-semibold text-white">{label}</Text>
    </Pressable>
  );
}
