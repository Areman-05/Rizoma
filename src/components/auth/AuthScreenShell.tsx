import { ReactNode } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleProp,
  View,
  ViewStyle,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { AuthGreenhouseDecor } from "@/src/components/auth/AuthGreenhouseDecor";
import { authStyles } from "@/src/components/auth/authStyles";

type AuthScreenShellProps = {
  children: ReactNode;
  header?: ReactNode;
  contentContainerStyle?: StyleProp<ViewStyle>;
};

/** Contenedor opaco de auth: evita toques hacia pantallas detrás + teclado. */
export function AuthScreenShell({
  children,
  header,
  contentContainerStyle,
}: AuthScreenShellProps) {
  return (
    <SafeAreaView style={authStyles.safe} edges={["top", "left", "right"]}>
      <View style={authStyles.root} collapsable={false}>
        <View style={authStyles.decor} pointerEvents="none">
          <AuthGreenhouseDecor />
        </View>
        {header}
        <KeyboardAvoidingView
          style={authStyles.flex}
          behavior={Platform.OS === "ios" ? "padding" : undefined}
        >
          <ScrollView
            style={authStyles.scroll}
            contentContainerStyle={contentContainerStyle ?? authStyles.scrollContent}
            keyboardShouldPersistTaps="handled"
            keyboardDismissMode="on-drag"
            showsVerticalScrollIndicator={false}
            bounces={false}
            removeClippedSubviews={false}
            focusable={false}
            accessible={false}
          >
            {children}
          </ScrollView>
        </KeyboardAvoidingView>
      </View>
    </SafeAreaView>
  );
}
