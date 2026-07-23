import { Pressable, Text } from "react-native";
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from "react-native-reanimated";
import { colors } from "@/src/theme/tokens";

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

interface RizomaButtonProps {
  label: string;
  onPress?: () => void;
  variant?: "primary" | "danger";
}

export function RizomaButton({ label, onPress, variant = "primary" }: RizomaButtonProps) {
  const backgroundColor = variant === "danger" ? colors.red : colors.brand;
  const scale = useSharedValue(1);
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <AnimatedPressable
      onPress={onPress}
      onPressIn={() => {
        scale.value = withSpring(0.97);
      }}
      onPressOut={() => {
        scale.value = withSpring(1);
      }}
      className="rounded-full px-5 py-4"
      style={[{ backgroundColor }, animatedStyle]}
      accessibilityRole="button"
    >
      <Text className="text-center text-base text-white" style={{ fontFamily: "Inter_700Bold" }}>
        {label}
      </Text>
    </AnimatedPressable>
  );
}
