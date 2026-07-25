import { ReactNode } from "react";
import { Pressable } from "react-native";

interface PressableScaleProps {
  children: ReactNode;
  onPress?: () => void;
  className?: string;
}

/** Pressable estable (sin Reanimated) para evitar freezes/SIGSEGV en Expo Go. */
export function PressableScale({ children, onPress, className }: PressableScaleProps) {
  return (
    <Pressable
      className={className}
      onPress={onPress}
      disabled={!onPress}
      style={({ pressed }) => ({ opacity: pressed && onPress ? 0.92 : 1, transform: [{ scale: pressed && onPress ? 0.98 : 1 }] })}
    >
      {children}
    </Pressable>
  );
}
