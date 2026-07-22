import { ReactNode } from "react";
import { ActivityIndicator, View } from "react-native";
import {
  useFonts,
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold,
} from "@expo-google-fonts/inter";
import { colors } from "@/src/theme/tokens";

export function FontProvider({ children }: { children: ReactNode }) {
  const [loaded] = useFonts({
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
  });

  if (!loaded) {
    return (
      <View className="flex-1 items-center justify-center bg-white">
        <ActivityIndicator color={colors.brand} />
      </View>
    );
  }

  return <>{children}</>;
}
