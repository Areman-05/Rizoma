import { Text, View } from "react-native";

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
        <Text className="text-xl font-semibold text-rizoma-primary">{title}</Text>
        {subtitle ? <Text className="mt-1 text-sm text-rizoma-secondaryText">{subtitle}</Text> : null}
      </View>
      {actionLabel && onActionPress ? (
        <Text onPress={onActionPress} className="text-sm font-semibold text-rizoma-primary">
          {actionLabel}
        </Text>
      ) : null}
    </View>
  );
}
