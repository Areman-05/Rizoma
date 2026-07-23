import { Text, TextProps } from "react-native";
import { typography } from "@/src/theme/tokens";

type Variant = "hero" | "title" | "subtitle" | "body" | "caption" | "micro";

const fontByWeight = {
  regular: "Inter_400Regular",
  medium: "Inter_500Medium",
  semibold: "Inter_600SemiBold",
  bold: "Inter_700Bold",
} as const;

interface AppTextProps extends TextProps {
  variant?: Variant;
  weight?: keyof typeof fontByWeight;
  className?: string;
}

const sizeByVariant: Record<Variant, number> = {
  hero: typography.hero,
  title: typography.title,
  subtitle: typography.subtitle,
  body: typography.body,
  caption: typography.caption,
  micro: typography.micro,
};

export function AppText({
  variant = "body",
  weight = "regular",
  style,
  className,
  children,
  ...rest
}: AppTextProps) {
  return (
    <Text
      {...rest}
      className={className}
      style={[
        {
          fontFamily: fontByWeight[weight],
          fontSize: sizeByVariant[variant],
        },
        style,
      ]}
    >
      {children}
    </Text>
  );
}
