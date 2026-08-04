import { useEffect, useRef } from "react";
import { Animated, Text, View } from "react-native";
import { colors } from "@/src/theme/tokens";

interface InAppToastProps {
  message: string;
  subtitle?: string;
  visible: boolean;
  /** Distancia desde el borde inferior del contenedor padre. */
  bottom?: number;
  durationMs?: number;
  onHide?: () => void;
}

/** Toast no bloqueante, encima del chrome inferior. */
export function InAppToast({
  message,
  subtitle,
  visible,
  bottom = 24,
  durationMs = 2000,
  onHide,
}: InAppToastProps) {
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (!visible) {
      opacity.setValue(0);
      return;
    }

    opacity.setValue(0);
    Animated.sequence([
      Animated.timing(opacity, { toValue: 1, duration: 180, useNativeDriver: true }),
      Animated.delay(Math.max(400, durationMs - 360)),
      Animated.timing(opacity, { toValue: 0, duration: 180, useNativeDriver: true }),
    ]).start(({ finished }) => {
      if (finished) onHide?.();
    });
  }, [visible, message, subtitle, durationMs, opacity, onHide]);

  if (!visible) return null;

  return (
    <Animated.View
      pointerEvents="none"
      style={{
        position: "absolute",
        left: 13,
        right: 13,
        bottom,
        zIndex: 50,
        elevation: 8,
        opacity,
        transform: [
          {
            translateY: opacity.interpolate({
              inputRange: [0, 1],
              outputRange: [8, 0],
            }),
          },
        ],
      }}
    >
      <View
        style={{
          backgroundColor: colors.black,
          borderRadius: 16,
          paddingHorizontal: 16,
          paddingVertical: 12,
        }}
      >
        <Text
          style={{
            color: colors.white,
            fontFamily: "Inter_600SemiBold",
            fontSize: 14,
            textAlign: "center",
          }}
        >
          {message}
        </Text>
        {subtitle ? (
          <Text
            style={{
              marginTop: 2,
              color: "rgba(255,255,255,0.75)",
              fontFamily: "Inter_400Regular",
              fontSize: 12,
              textAlign: "center",
            }}
            numberOfLines={1}
          >
            {subtitle}
          </Text>
        ) : null}
      </View>
    </Animated.View>
  );
}
