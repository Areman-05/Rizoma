import { Pressable } from "react-native";
import { ReactNode } from "react";
import { colors } from "@/src/theme/tokens";

interface CircularIconButtonProps {
  children: ReactNode;
  onPress?: () => void;
  accessibilityLabel?: string;
  size?: number;
}

export function CircularIconButton({
  children,
  onPress,
  accessibilityLabel,
  size = 40,
}: CircularIconButtonProps) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      className="items-center justify-center rounded-full border border-rizoma-border bg-white"
      style={{ width: size, height: size }}
    >
      {children}
    </Pressable>
  );
}

export const iconTone = {
  active: colors.brand,
  inactive: "#6B7280",
  dark: colors.black,
};
