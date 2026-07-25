import { Text, View } from "react-native";
import { ChevronLeft, Bell } from "lucide-react-native";
import { router } from "expo-router";
import { CircularIconButton, iconTone } from "./CircularIconButton";

interface ScreenHeaderProps {
  title: string;
  showBack?: boolean;
  showBell?: boolean;
  showNotificationBadge?: boolean;
  onBellPress?: () => void;
}

export function ScreenHeader({
  title,
  showBack = true,
  showBell = true,
  showNotificationBadge = false,
  onBellPress,
}: ScreenHeaderProps) {
  return (
    <View className="mb-4 flex-row items-center justify-between">
      {showBack ? (
        <CircularIconButton accessibilityLabel="Volver" onPress={() => router.back()}>
          <ChevronLeft size={20} color={iconTone.dark} />
        </CircularIconButton>
      ) : (
        <View className="h-10 w-10" />
      )}
      <Text className="text-lg text-rizoma-black" style={{ fontFamily: "Inter_700Bold" }}>
        {title}
      </Text>
      {showBell ? (
        <View>
          <CircularIconButton
            accessibilityLabel="Notificaciones"
            onPress={onBellPress ?? (() => router.push("/notifications"))}
          >
            <Bell size={18} color={iconTone.dark} />
          </CircularIconButton>
          {showNotificationBadge ? (
            <View className="absolute right-1 top-1 h-2.5 w-2.5 rounded-full bg-rizoma-red" />
          ) : null}
        </View>
      ) : (
        <View className="h-10 w-10" />
      )}
    </View>
  );
}
