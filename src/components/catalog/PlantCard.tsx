import { Image, Pressable, Text, View } from "react-native";
import { Heart, Star } from "lucide-react-native";
import { Plant } from "@/src/types/catalog";
import { colors } from "@/src/theme/tokens";
import { formatPrice, salePercent } from "@/src/utils/pricing";

interface PlantCardProps {
  plant: Plant;
  onPress?: () => void;
  onToggleWishlist?: () => void;
  wishlisted?: boolean;
  compact?: boolean;
}

export function PlantCard({ plant, onPress, onToggleWishlist, wishlisted = false }: PlantCardProps) {
  const percent = plant.salePercent ?? salePercent(plant.price, plant.originalPrice);

  return (
    <Pressable onPress={onPress} className="mb-4 flex-1">
      <View className="overflow-hidden rounded-3xl bg-rizoma-gray">
        {percent ? (
          <View className="absolute left-3 top-3 z-10 rounded-full bg-rizoma-red px-2 py-1">
            <Text className="text-xs text-white" style={{ fontFamily: "Inter_600SemiBold" }}>
              {percent}% off
            </Text>
          </View>
        ) : null}
        <Pressable
          onPress={onToggleWishlist}
          accessibilityLabel="Favorito"
          className="absolute right-3 top-3 z-10 h-8 w-8 items-center justify-center rounded-full bg-white"
        >
          <Heart
            size={16}
            color={wishlisted ? colors.brand : colors.black}
            fill={wishlisted ? colors.brand : "transparent"}
          />
        </Pressable>
        <Image source={{ uri: plant.image }} className="h-40 w-full" resizeMode="contain" />
      </View>

      <View className="mt-2 flex-row items-center gap-1">
        <Star size={12} color={colors.yellow} fill={colors.yellow} />
        <Text className="text-xs text-rizoma-secondaryText" style={{ fontFamily: "Inter_400Regular" }}>
          {plant.rating.toFixed(1)} ({plant.reviewCount})
        </Text>
      </View>
      <Text className="mt-1 text-base text-rizoma-black" style={{ fontFamily: "Inter_700Bold" }} numberOfLines={1}>
        {plant.name}
      </Text>
      <View className="mt-1 flex-row items-center gap-2">
        <Text className="text-sm text-rizoma-black" style={{ fontFamily: "Inter_700Bold" }}>
          {formatPrice(plant.price)}
        </Text>
        {plant.originalPrice && plant.originalPrice > plant.price ? (
          <Text className="text-sm text-rizoma-red line-through" style={{ fontFamily: "Inter_400Regular" }}>
            {formatPrice(plant.originalPrice)}
          </Text>
        ) : null}
      </View>
    </Pressable>
  );
}
