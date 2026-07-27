import { ReactNode } from "react";
import { Pressable, StyleProp, ViewStyle } from "react-native";

interface PressableScaleProps {
  children: ReactNode;
  onPress?: () => void;
  className?: string;
  style?: StyleProp<ViewStyle>;
}

/** Pressable estable (sin Reanimated) para evitar freezes/SIGSEGV en Expo Go. */
export function PressableScale({ children, onPress, className, style }: PressableScaleProps) {
  return (
    <Pressable
      className={className}
      onPress={onPress}
      disabled={!onPress}
      style={({ pressed }) => [
        style,
        {
          opacity: pressed && onPress ? 0.92 : 1,
          transform: [{ scale: pressed && onPress ? 0.98 : 1 }],
        },
      ]}
    >
      {children}
    </Pressable>
  );
}
