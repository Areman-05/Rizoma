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
  const [loaded, error] = useFonts({
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
  });

  // Si falla la carga de fuentes, no bloquear la app con spinner eterno.
  if (!loaded && !error) {
    return (
      <View className="flex-1 items-center justify-center bg-white">
        <ActivityIndicator color={colors.brand} />
      </View>
    );
  }

  return <>{children}</>;
}
