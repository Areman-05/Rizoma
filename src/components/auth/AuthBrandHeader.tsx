import { Text, View } from "react-native";
import { authStyles } from "@/src/components/auth/authStyles";
import { RizomaMark } from "@/src/components/brand/RizomaLogo";

type AuthBrandHeaderProps = {
  compact?: boolean;
  hint?: string;
};

export function AuthBrandHeader({ compact = false, hint }: AuthBrandHeaderProps) {
  return (
    <View style={authStyles.brandBlock}>
      <View style={compact ? authStyles.medallionOuterCompact : authStyles.medallionOuter}>
        <View style={compact ? authStyles.logoDiscCompact : authStyles.logoDisc}>
          <RizomaMark size={compact ? 52 : 56} />
        </View>
      </View>
      <Text
        style={compact ? authStyles.wordmarkCompact : authStyles.wordmark}
        allowFontScaling={false}
      >
        Rizoma
      </Text>
      <Text style={authStyles.tagline}>Tu jardín, en orden.</Text>
      {hint ? <Text style={authStyles.screenHint}>{hint}</Text> : null}
    </View>
  );
}
