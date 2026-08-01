import { Image, View } from "react-native";
import {
  getAvatarPreset,
  isAvatarPresetId,
  normalizeAvatarValue,
} from "@/src/components/profile/avatarPresets";

type ProfileAvatarProps = {
  value: string;
  size: number;
  className?: string;
  accessibilityLabel?: string;
  borderWidth?: number;
  borderColor?: string;
};

/** Renderiza preset local (View + icono) o imagen de galería (file URI). */
export function ProfileAvatar({
  value,
  size,
  className = "",
  accessibilityLabel = "Avatar de perfil",
  borderWidth = 0,
  borderColor = "#FFFFFF",
}: ProfileAvatarProps) {
  const resolved = normalizeAvatarValue(value);
  const radius = size / 2;
  const iconSize = Math.round(size * 0.45);

  if (isAvatarPresetId(resolved)) {
    const preset = getAvatarPreset(resolved);
    if (preset) {
      const { Icon } = preset;
      return (
        <View
          accessibilityLabel={accessibilityLabel}
          className={className}
          style={{
            width: size,
            height: size,
            borderRadius: radius,
            backgroundColor: preset.backgroundColor,
            alignItems: "center",
            justifyContent: "center",
            borderWidth,
            borderColor,
            overflow: "hidden",
          }}
        >
          <Icon size={iconSize} color={preset.iconColor} strokeWidth={2.25} />
        </View>
      );
    }
  }

  return (
    <Image
      source={{ uri: resolved }}
      accessibilityLabel={accessibilityLabel}
      accessibilityIgnoresInvertColors
      className={className}
      style={{
        width: size,
        height: size,
        borderRadius: radius,
        borderWidth,
        borderColor,
      }}
    />
  );
}
