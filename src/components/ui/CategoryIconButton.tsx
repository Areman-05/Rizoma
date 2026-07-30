import { Pressable, Text, View } from "react-native";
import { Home, Sun, Trees, Leaf } from "lucide-react-native";
import { ShopCategory, ShopCategoryId } from "@/src/data/shopCategories";
import { colors } from "@/src/theme/tokens";

const iconMap = {
  Home,
  Sun,
  Trees,
  Leaf,
} as const;

interface CategoryIconButtonProps {
  category: ShopCategory;
  active?: boolean;
  compact?: boolean;
  onPress: (id: ShopCategoryId) => void;
}

export function CategoryIconButton({
  category,
  active = false,
  compact = false,
  onPress,
}: CategoryIconButtonProps) {
  const Icon = iconMap[category.icon];
  const size = compact ? 44 : 64;
  const iconSize = compact ? 18 : 24;

  return (
    <Pressable
      onPress={() => onPress(category.id)}
      accessibilityRole="button"
      accessibilityState={{ selected: active }}
      accessibilityLabel={`Categoría ${category.label}`}
      className="items-center"
      style={({ pressed }) => ({
        opacity: pressed ? 0.85 : 1,
        width: compact ? 72 : undefined,
      })}
    >
      <View
        className={`items-center justify-center rounded-full ${
          active ? "bg-rizoma-brand" : "bg-rizoma-brandSoft"
        }`}
        style={{ height: size, width: size }}
      >
        <Icon size={iconSize} color={active ? colors.white : colors.brand} />
      </View>
      <Text
        className={`mt-1.5 text-center ${active ? "text-rizoma-brand" : "text-rizoma-black"} ${
          compact ? "text-[11px]" : "text-xs"
        }`}
        style={{ fontFamily: active ? "Inter_700Bold" : "Inter_600SemiBold" }}
        numberOfLines={1}
      >
        {category.label}
      </Text>
    </Pressable>
  );
}
