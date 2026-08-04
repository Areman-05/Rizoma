/** @jsxImportSource react */
import { useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import Svg, { Path } from "react-native-svg";

interface RizomaButtonProps {
  label: string;
  onPress?: () => void;
  variant?: "primary" | "danger" | "secondary" | "google";
  disabled?: boolean;
}

/** G multicolor aproximada al logo de Google (no es el asset oficial). */
function GoogleGMark({ size = 20 }: { size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 48 48" accessibilityElementsHidden>
      <Path
        fill="#EA4335"
        d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"
      />
      <Path
        fill="#4285F4"
        d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"
      />
      <Path
        fill="#FBBC05"
        d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"
      />
      <Path
        fill="#34A853"
        d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"
      />
    </Svg>
  );
}

/**
 * CTA estable sin NativeWind jsx runtime (`@jsxImportSource react`).
 * Shell fija 56dp; Pressable llena y centra con justify/align (sin absoluteFill,
 * sin fila vacía, sin children-as-function que NativeWind rompe).
 */
export function RizomaButton({
  label,
  onPress,
  variant = "primary",
  disabled = false,
}: RizomaButtonProps) {
  const [pressed, setPressed] = useState(false);
  const isSecondary = variant === "secondary";
  const isDanger = variant === "danger";
  const isGoogle = variant === "google";

  const shellStyle = [
    styles.shell,
    isGoogle
      ? styles.shellGoogle
      : isSecondary
        ? styles.shellSecondary
        : isDanger
          ? styles.shellDanger
          : styles.shellPrimary,
    disabled ? styles.shellDisabled : null,
    pressed && !disabled ? styles.shellPressed : null,
  ];

  return (
    <View style={shellStyle}>
      <Pressable
        onPress={onPress}
        disabled={disabled}
        onPressIn={() => setPressed(true)}
        onPressOut={() => setPressed(false)}
        accessibilityRole="button"
        accessibilityLabel={label}
        hitSlop={4}
        style={styles.hit}
      >
        {isGoogle ? (
          <View style={styles.googleCluster}>
            <View style={styles.googleIcon}>
              <GoogleGMark size={20} />
            </View>
            <Text style={[styles.label, styles.labelGoogle]} numberOfLines={1}>
              {label}
            </Text>
          </View>
        ) : (
          <Text
            style={[
              styles.label,
              isSecondary ? styles.labelSecondary : styles.labelOnColor,
            ]}
            numberOfLines={1}
          >
            {label}
          </Text>
        )}
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  shell: {
    width: "100%",
    height: 56,
    minHeight: 56,
    borderRadius: 999,
    overflow: "hidden",
    flexShrink: 0,
  },
  shellPrimary: {
    backgroundColor: "#01B763",
  },
  shellDanger: {
    backgroundColor: "#EF4444",
  },
  shellSecondary: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1.5,
    borderColor: "#01B763",
  },
  shellGoogle: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#DADCE0",
  },
  shellDisabled: {
    opacity: 0.6,
  },
  shellPressed: {
    opacity: 0.88,
  },
  hit: {
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  googleCluster: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
  },
  googleIcon: {
    width: 20,
    height: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  label: {
    fontFamily: "Inter_700Bold",
    fontSize: 16,
    textAlign: "center",
    includeFontPadding: false,
  },
  labelOnColor: {
    color: "#FFFFFF",
  },
  labelSecondary: {
    color: "#01B763",
  },
  labelGoogle: {
    color: "#3C4043",
    fontFamily: "Inter_600SemiBold",
  },
});
