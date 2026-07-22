import { useState } from "react";
import { Image, Pressable, ScrollView, Text, View } from "react-native";
import { useLocalSearchParams, router } from "expo-router";
import { Heart, Star } from "lucide-react-native";
import { getPlantById } from "@/src/data/plants";
import { PlantIndicators } from "@/src/components/catalog/PlantIndicators";
import { RizomaButton } from "@/src/components/ui/RizomaButton";
import { CircularIconButton } from "@/src/components/ui/CircularIconButton";
import { useShop } from "@/src/store/ShopContext";
import { useGarden } from "@/src/store/GardenContext";
import { getRelatedPlants } from "@/src/utils/relatedPlants";
import { formatPrice } from "@/src/utils/pricing";
import { colors } from "@/src/theme/tokens";
import { SafeAreaView } from "react-native-safe-area-context";
import { ChevronLeft } from "lucide-react-native";

export default function PlantDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const plant = getPlantById(id);
  const { addToCart, toggleWishlist, isInWishlist } = useShop();
  const { addToGarden } = useGarden();
  const [qty, setQty] = useState(1);

  if (!plant) {
    return (
      <View className="flex-1 items-center justify-center bg-white">
        <Text className="text-rizoma-black">Planta no encontrada.</Text>
      </View>
    );
  }

  const saved = isInWishlist(plant.id);
  const related = getRelatedPlants(plant);

  return (
    <SafeAreaView className="flex-1 bg-white" edges={["top", "left", "right"]}>
      <ScrollView className="flex-1" contentContainerClassName="px-4 pb-36" showsVerticalScrollIndicator={false}>
        <View className="mt-2 flex-row items-center justify-between">
          <CircularIconButton onPress={() => router.back()} accessibilityLabel="Volver">
            <ChevronLeft size={20} color={colors.black} />
          </CircularIconButton>
          <CircularIconButton onPress={() => toggleWishlist(plant)} accessibilityLabel="Favorito">
            <Heart size={18} color={saved ? colors.brand : colors.black} fill={saved ? colors.brand : "transparent"} />
          </CircularIconButton>
        </View>

        <View className="mt-4 items-center rounded-3xl bg-rizoma-gray px-4 py-6">
          <Image source={{ uri: plant.image }} className="h-72 w-full" resizeMode="contain" />
        </View>

        <Text className="mt-5 text-2xl text-rizoma-black" style={{ fontFamily: "Inter_700Bold" }}>
          {plant.name}
        </Text>
        <Text className="mt-1 text-sm italic text-rizoma-secondaryText">{plant.latinName}</Text>

        <View className="mt-2 flex-row items-center gap-1">
          <Star size={14} color={colors.yellow} fill={colors.yellow} />
          <Text className="text-sm text-rizoma-secondaryText">
            {plant.rating.toFixed(1)} ({plant.reviewCount})
          </Text>
        </View>

        <View className="mt-3 flex-row items-center gap-2">
          <Text className="text-xl text-rizoma-black" style={{ fontFamily: "Inter_700Bold" }}>
            {formatPrice(plant.price)}
          </Text>
          {plant.originalPrice && plant.originalPrice > plant.price ? (
            <Text className="text-base text-rizoma-red line-through">{formatPrice(plant.originalPrice)}</Text>
          ) : null}
        </View>

        <PlantIndicators light={plant.light} watering={plant.watering} petFriendly={plant.petFriendly} />

        <Text className="mt-6 text-lg text-rizoma-black" style={{ fontFamily: "Inter_700Bold" }}>
          Descripcion
        </Text>
        <Text className="mt-2 leading-6 text-rizoma-secondaryText" style={{ fontFamily: "Inter_400Regular" }}>
          {plant.description}
        </Text>

        <Text className="mb-3 mt-8 text-lg text-rizoma-black" style={{ fontFamily: "Inter_700Bold" }}>
          Relacionadas
        </Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {related.map((item) => (
            <Pressable
              key={item.id}
              onPress={() => router.push(`/plants/${item.id}`)}
              className="mr-3 w-36 rounded-3xl bg-rizoma-gray p-3"
            >
              <Image source={{ uri: item.image }} className="h-24 w-full" resizeMode="contain" />
              <Text className="mt-2 text-sm text-rizoma-black" style={{ fontFamily: "Inter_600SemiBold" }} numberOfLines={1}>
                {item.name}
              </Text>
            </Pressable>
          ))}
        </ScrollView>
      </ScrollView>

      <View className="absolute bottom-0 left-0 right-0 border-t border-rizoma-border bg-white px-4 pb-6 pt-3">
        <View className="mb-3 flex-row items-center justify-between">
          <Text className="text-rizoma-black" style={{ fontFamily: "Inter_600SemiBold" }}>
            Comprar
          </Text>
          <View className="flex-row items-center gap-3">
            <Pressable onPress={() => setQty((q) => Math.max(1, q - 1))} className="h-9 w-9 items-center justify-center rounded-full bg-rizoma-gray">
              <Text>-</Text>
            </Pressable>
            <Text style={{ fontFamily: "Inter_700Bold" }}>{qty}</Text>
            <Pressable onPress={() => setQty((q) => q + 1)} className="h-9 w-9 items-center justify-center rounded-full bg-rizoma-gray">
              <Text>+</Text>
            </Pressable>
          </View>
        </View>
        <RizomaButton
          label="Comprar ahora"
          onPress={() => {
            for (let i = 0; i < qty; i += 1) addToCart(plant);
            router.push("/(tabs)/cart");
          }}
        />
        <Pressable onPress={() => addToGarden(plant)} className="mt-2 py-2">
          <Text className="text-center text-sm text-rizoma-brand" style={{ fontFamily: "Inter_600SemiBold" }}>
            Guardar en Mi Jardin
          </Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}
