import { Text, View } from "react-native";
import { RizomaButton } from "./RizomaButton";

interface EmptyStateProps {
  title: string;
  description: string;
  actionLabel?: string;
  onActionPress?: () => void;
}

export function EmptyState({ title, description, actionLabel, onActionPress }: EmptyStateProps) {
  return (
    <View className="mt-10 items-center rounded-3xl bg-white px-6 py-8">
      <Text className="text-center text-xl font-semibold text-rizoma-primary">{title}</Text>
      <Text className="mt-2 text-center leading-6 text-rizoma-secondaryText">{description}</Text>
      {actionLabel && onActionPress ? (
        <View className="mt-5 w-full">
          <RizomaButton label={actionLabel} onPress={onActionPress} />
        </View>
      ) : null}
    </View>
  );
}
