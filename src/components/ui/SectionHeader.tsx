import { Pressable, Text, View } from "react-native";

interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  actionLabel?: string;
  onActionPress?: () => void;
}

export function SectionHeader({ title, subtitle, actionLabel, onActionPress }: SectionHeaderProps) {
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
        <Pressable onPress={onActionPress} accessibilityRole="button" accessibilityLabel={actionLabel}>
          <Text className="text-sm text-rizoma-brand" style={{ fontFamily: "Inter_600SemiBold" }}>
            {actionLabel}
          </Text>
        </Pressable>
      ) : null}
    </View>
  );
}
