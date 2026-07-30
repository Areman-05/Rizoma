import { Pressable, Text, View } from "react-native";

interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  actionLabel?: string;
  onActionPress?: () => void;
  /** "link" = texto brand (default); "button" = píldora verde compacta tipo RizomaButton */
  actionVariant?: "link" | "button";
}

export function SectionHeader({
  title,
  subtitle,
  actionLabel,
  onActionPress,
  actionVariant = "link",
}: SectionHeaderProps) {
  return (
    <View className="mb-3 flex-row items-end justify-between">
      <View className="flex-1 pr-3">
        <Text className="text-xl text-rizoma-black" style={{ fontFamily: "Inter_700Bold" }}>
          {title}
        </Text>
        {subtitle ? (
          <Text className="mt-1 text-sm text-rizoma-secondaryText" style={{ fontFamily: "Inter_400Regular" }}>
            {subtitle}
          </Text>
        ) : null}
      </View>
      {actionLabel && onActionPress ? (
        actionVariant === "button" ? (
          <Pressable
            onPress={onActionPress}
            accessibilityRole="button"
            accessibilityLabel={actionLabel}
            className="rounded-full bg-rizoma-brand px-3 py-1.5"
            style={({ pressed }) => ({
              opacity: pressed ? 0.9 : 1,
              transform: [{ scale: pressed ? 0.98 : 1 }],
            })}
          >
            <Text className="text-sm text-white" style={{ fontFamily: "Inter_600SemiBold" }}>
              {actionLabel}
            </Text>
          </Pressable>
        ) : (
          <Pressable onPress={onActionPress} accessibilityRole="button" accessibilityLabel={actionLabel}>
            <Text className="text-sm text-rizoma-brand" style={{ fontFamily: "Inter_600SemiBold" }}>
              {actionLabel}
            </Text>
          </Pressable>
        )
      ) : null}
    </View>
  );
}
