import { ReactNode } from "react";
import { ScrollView, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

interface ScreenProps {
  children: ReactNode;
  scroll?: boolean;
  className?: string;
}

export function Screen({ children, scroll = false, className = "" }: ScreenProps) {
  if (scroll) {
    return (
      <SafeAreaView className="flex-1 bg-white" edges={["top", "left", "right"]}>
        <ScrollView
          className={`flex-1 bg-white ${className}`}
          contentContainerClassName="px-[13px] pb-10 pt-2"
          showsVerticalScrollIndicator={false}
        >
          {children}
        </ScrollView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-white" edges={["top", "left", "right"]}>
      <View className={`flex-1 bg-white px-[13px] pt-2 ${className}`}>{children}</View>
    </SafeAreaView>
  );
}
