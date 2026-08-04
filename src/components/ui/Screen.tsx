import { ReactNode } from "react";
import { ScrollView, View, ViewStyle } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { colors, spacing } from "@/src/theme/tokens";

interface ScreenProps {
  children: ReactNode;
  scroll?: boolean;
  /** Reserved for callers that still pass Tailwind; layout uses inline styles. */
  className?: string;
  contentContainerStyle?: ViewStyle;
}

/**
 * Contenedor de pantalla con estilos inline (no depende de NativeWind para flex/padding).
 * Con scroll: ScrollView flex:1; el contenido puede crecer y scrollear.
 */
export function Screen({
  children,
  scroll = false,
  contentContainerStyle,
}: ScreenProps) {
  if (scroll) {
    return (
      <SafeAreaView
        style={{ flex: 1, backgroundColor: colors.white }}
        edges={["top", "left", "right"]}
      >
        <ScrollView
          style={{ flex: 1, minHeight: 0, backgroundColor: colors.white }}
          contentContainerStyle={{
            paddingHorizontal: spacing.screenMargin,
            paddingBottom: 40,
            paddingTop: 8,
            flexGrow: 1,
            ...contentContainerStyle,
          }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {children}
        </ScrollView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: colors.white }}
      edges={["top", "left", "right"]}
    >
      <View
        style={{
          flex: 1,
          backgroundColor: colors.white,
          paddingHorizontal: spacing.screenMargin,
          paddingTop: 8,
        }}
      >
        {children}
      </View>
    </SafeAreaView>
  );
}
