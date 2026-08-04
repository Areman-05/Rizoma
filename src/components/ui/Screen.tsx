import { ReactNode } from "react";
import { ScrollView, View, ViewStyle } from "react-native";
import { SafeAreaView, type Edges } from "react-native-safe-area-context";
import { colors, spacing } from "@/src/theme/tokens";

interface ScreenProps {
  children: ReactNode;
  scroll?: boolean;
  /** When false, skips horizontal/top padding (full-bleed heroes). Default true. */
  padded?: boolean;
  backgroundColor?: string;
  edges?: Edges;
  contentContainerStyle?: ViewStyle;
  style?: ViewStyle;
}

/**
 * Contenedor de pantalla con estilos inline (no depende de NativeWind para flex/padding).
 * Con scroll: ScrollView flex:1; el contenido puede crecer y scrollear.
 */
export function Screen({
  children,
  scroll = false,
  padded = true,
  backgroundColor = colors.white,
  edges = ["top", "left", "right"],
  contentContainerStyle,
  style,
}: ScreenProps) {
  const padStyle: ViewStyle = padded
    ? {
        paddingHorizontal: spacing.screenMargin,
        paddingTop: 8,
      }
    : {};

  if (scroll) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor }} edges={edges}>
        <ScrollView
          style={{ flex: 1, minHeight: 0, backgroundColor }}
          contentContainerStyle={{
            ...padStyle,
            paddingBottom: 40,
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
    <SafeAreaView style={{ flex: 1, backgroundColor }} edges={edges}>
      <View
        style={{
          flex: 1,
          backgroundColor,
          ...padStyle,
          ...style,
        }}
      >
        {children}
      </View>
    </SafeAreaView>
  );
}
