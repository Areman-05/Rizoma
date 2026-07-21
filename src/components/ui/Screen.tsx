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
      <SafeAreaView className="flex-1 bg-rizoma-canvas" edges={["top", "left", "right"]}>
        <ScrollView
          className={`flex-1 bg-rizoma-canvas ${className}`}
          contentContainerClassName="px-5 pb-10 pt-2"
          showsVerticalScrollIndicator={false}
        >
          {children}
        </ScrollView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-rizoma-canvas" edges={["top", "left", "right"]}>
      <View className={`flex-1 bg-rizoma-canvas px-5 pt-2 ${className}`}>{children}</View>
    </SafeAreaView>
  );
}
