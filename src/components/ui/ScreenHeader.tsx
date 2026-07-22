import { Text, View } from "react-native";
import { ChevronLeft, Bell } from "lucide-react-native";
import { router } from "expo-router";
import { CircularIconButton, iconTone } from "./CircularIconButton";

interface ScreenHeaderProps {
  title: string;
  showBack?: boolean;
  showBell?: boolean;
  onBellPress?: () => void;
}

export function ScreenHeader({ title, showBack = true, showBell = true, onBellPress }: ScreenHeaderProps) {
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
        <CircularIconButton
          accessibilityLabel="Notificaciones"
          onPress={onBellPress ?? (() => router.push("/notifications"))}
        >
          <Bell size={18} color={iconTone.dark} />
        </CircularIconButton>
      ) : (
        <View className="h-10 w-10" />
      )}
    </View>
  );
}
