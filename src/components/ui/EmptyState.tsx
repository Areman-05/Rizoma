import { ReactNode } from "react";
import { Text, View } from "react-native";
import { RizomaButton } from "./RizomaButton";
import { colors } from "@/src/theme/tokens";

interface EmptyStateProps {
  title: string;
  description: string;
  actionLabel?: string;
  onActionPress?: () => void;
  icon?: ReactNode;
}

export function EmptyState({ title, description, actionLabel, onActionPress, icon }: EmptyStateProps) {
  return (
    <View className="mt-10 items-center rounded-3xl border border-rizoma-border bg-rizoma-brandSoft px-6 py-8">
      {icon ? (
        <View className="mb-4 h-14 w-14 items-center justify-center rounded-full bg-white">{icon}</View>
      ) : null}
      <Text className="text-center text-xl text-rizoma-black" style={{ fontFamily: "Inter_700Bold" }}>
        {title}
      </Text>
      <Text
        className="mt-2 text-center leading-6 text-rizoma-secondaryText"
        style={{ fontFamily: "Inter_400Regular" }}
      >
        {description}
      </Text>
      {actionLabel && onActionPress ? (
        <View className="mt-5 w-full">
          <RizomaButton label={actionLabel} onPress={onActionPress} />
        </View>
      ) : null}
    </View>
  );
}

export const emptyIconTone = colors.brand;
