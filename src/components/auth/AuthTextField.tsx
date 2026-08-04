import { ReactNode } from "react";
import {
  StyleProp,
  Text,
  TextInput,
  TextInputProps,
  View,
  ViewStyle,
} from "react-native";
import { authStyles } from "@/src/components/auth/authStyles";
import { leafyLogoColors } from "@/src/components/brand/RizomaLogo";
import { colors } from "@/src/theme/tokens";

type AuthTextFieldProps = {
  label: string;
  focused: boolean;
  icon: ReactNode;
  spaced?: boolean;
  compactSpacing?: boolean;
  inputStyle?: StyleProp<ViewStyle>;
} & Omit<TextInputProps, "style">;

export function AuthTextField({
  label,
  focused,
  icon,
  spaced = false,
  compactSpacing = false,
  editable = true,
  placeholderTextColor = colors.grayText,
  inputStyle,
  ...inputProps
}: AuthTextFieldProps) {
  return (
    <>
      <Text
        style={[
          authStyles.label,
          spaced
            ? compactSpacing
              ? authStyles.labelSpacedCompact
              : authStyles.labelSpaced
            : null,
        ]}
      >
        {label}
      </Text>
      <View style={[authStyles.inputShell, focused ? authStyles.inputShellFocused : null]}>
        {icon}
        <TextInput
          {...inputProps}
          editable={editable}
          placeholderTextColor={placeholderTextColor}
          showSoftInputOnFocus
          style={[authStyles.input, inputStyle]}
        />
      </View>
    </>
  );
}

export function authIconColor(focused: boolean) {
  return focused ? colors.brand : leafyLogoColors.leafDeep;
}
