import { useState } from "react";
import { Image, Pressable, ScrollView, Text, View } from "react-native";
import { useLocalSearchParams, router } from "expo-router";
import { Heart, Minus, Plus, ShoppingBag, Star } from "lucide-react-native";
import { getPlantById } from "@/src/data/plants";
import { PlantIndicators } from "@/src/components/catalog/PlantIndicators";
import { RizomaButton } from "@/src/components/ui/RizomaButton";
import { CircularIconButton } from "@/src/components/ui/CircularIconButton";
import { EmptyState } from "@/src/components/ui/EmptyState";
import { Screen } from "@/src/components/ui/Screen";
import { useShop } from "@/src/store/ShopContext";
import { useGarden } from "@/src/store/GardenContext";
import { getRelatedPlants } from "@/src/utils/relatedPlants";
import { formatPrice } from "@/src/utils/pricing";
import { difficultyLabel } from "@/src/utils/plantLabels";
import { colors } from "@/src/theme/tokens";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { ChevronLeft } from "lucide-react-native";

/** Altura del chrome sticky (sin safe-area): fila única + enlace Mi Jardín. */
const BOTTOM_BAR_CONTENT_HEIGHT = 124;

export default function PlantDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const insets = useSafeAreaInsets();
  const plant = getPlantById(Array.isArray(id) ? id[0] : id);
  const { addToCart, toggleWishlist, isInWishlist } = useShop();
  const { addToGarden } = useGarden();
  const [qty, setQty] = useState(1);
  const [addedToast, setAddedToast] = useState<string | null>(null);
  const bottomBarPadding = Math.max(insets.bottom, 12);
  const bottomBarHeight = BOTTOM_BAR_CONTENT_HEIGHT + bottomBarPadding;

  if (!plant) {
    return (
      <Screen>
        <EmptyState
          title="Planta no encontrada"
          description="Esta ficha ya no está disponible en el catálogo Rizoma."
          actionLabel="Volver al catálogo"
          onActionPress={() => router.replace("/(tabs)/explore")}
        />
      </Screen>
    );
  }

  const saved = isInWishlist(plant.id);
  const related = getRelatedPlants(plant);

  const showToast = (message: string) => {
    setAddedToast(message);
    setTimeout(() => setAddedToast(null), 2200);
  };

  return (
    <SafeAreaView className="flex-1 bg-white" edges={["top", "left", "right"]}>
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingBottom: bottomBarHeight + 20 }}
        showsVerticalScrollIndicator={false}
      >
        <View className="relative">
          <Image source={{ uri: plant.image }} style={{ width: "100%", height: 360 }} resizeMode="cover" />
          <View className="absolute left-[13px] right-[13px] top-3 flex-row items-center justify-between">
            <CircularIconButton onPress={() => router.back()} accessibilityLabel="Volver">
              <ChevronLeft size={20} color={colors.black} />
            </CircularIconButton>
            <CircularIconButton onPress={() => toggleWishlist(plant)} accessibilityLabel="Favorito">
              <Heart
                size={18}
                color={saved ? colors.brand : colors.black}
                fill={saved ? colors.brand : "transparent"}
              />
            </CircularIconButton>
          </View>
          {plant.badge ? (
            <View className="absolute bottom-4 left-[13px] rounded-full bg-rizoma-brand px-3 py-1">
              <Text className="text-xs text-white" style={{ fontFamily: "Inter_600SemiBold" }}>
                {plant.badge}
              </Text>
            </View>
          ) : null}
        </View>

        <View className="px-[13px] pt-5">
          <Text className="text-2xl text-rizoma-black" style={{ fontFamily: "Inter_700Bold" }}>
            {plant.name}
          </Text>
          <Text className="mt-1 text-sm italic text-rizoma-secondaryText">{plant.latinName}</Text>

          <View className="mt-3 flex-row items-center gap-2">
            <View className="flex-row items-center gap-1 rounded-full bg-rizoma-gray px-3 py-1.5">
              <Star size={14} color={colors.yellow} fill={colors.yellow} />
              <Text className="text-sm text-rizoma-black" style={{ fontFamily: "Inter_600SemiBold" }}>
                {plant.rating.toFixed(1)}
              </Text>
              <Text className="text-sm text-rizoma-secondaryText">· {plant.reviewCount} reseñas</Text>
            </View>
            <View className="rounded-full bg-rizoma-gray px-3 py-1.5">
              <Text className="text-sm text-rizoma-black" style={{ fontFamily: "Inter_500Medium" }}>
                {difficultyLabel(plant.difficulty)}
              </Text>
            </View>
          </View>

          <View className="mt-4 flex-row items-end gap-2">
            <Text className="text-2xl text-rizoma-black" style={{ fontFamily: "Inter_700Bold" }}>
              {formatPrice(plant.price)}
            </Text>
            {plant.originalPrice && plant.originalPrice > plant.price ? (
              <Text className="mb-1 text-base text-rizoma-red line-through">
                {formatPrice(plant.originalPrice)}
              </Text>
            ) : null}
          </View>

          <PlantIndicators light={plant.light} watering={plant.watering} petFriendly={plant.petFriendly} />

          <Text className="mt-6 text-lg text-rizoma-black" style={{ fontFamily: "Inter_700Bold" }}>
            Descripción
          </Text>
          <Text className="mt-2 leading-6 text-rizoma-secondaryText" style={{ fontFamily: "Inter_400Regular" }}>
            {plant.description}
          </Text>

          <Text className="mt-8 text-lg text-rizoma-black" style={{ fontFamily: "Inter_700Bold" }}>
            Valoraciones y comentarios
          </Text>
          <View className="mt-3 gap-3">
            {plant.reviews.map((review) => (
              <View key={review.id} className="rounded-3xl border border-rizoma-border bg-white p-4">
                <View className="flex-row items-center justify-between">
                  <Text className="text-rizoma-black" style={{ fontFamily: "Inter_700Bold" }}>
                    {review.author}
                  </Text>
                  <Text className="text-xs text-rizoma-grayText">{review.date}</Text>
                </View>
                <View className="mt-1 flex-row items-center gap-1">
                  {Array.from({ length: 5 }).map((_, starIndex) => (
                    <Star
                      key={starIndex}
                      size={12}
                      color={colors.yellow}
                      fill={starIndex < review.rating ? colors.yellow : "transparent"}
                    />
                  ))}
                </View>
                <Text className="mt-2 text-sm leading-5 text-rizoma-secondaryText" style={{ fontFamily: "Inter_400Regular" }}>
                  {review.comment}
                </Text>
              </View>
            ))}
          </View>

          <Text className="mb-3 mt-8 text-lg text-rizoma-black" style={{ fontFamily: "Inter_700Bold" }}>
            Relacionadas
          </Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {related.map((item) => (
              <Pressable
                key={item.id}
                onPress={() => router.push(`/plants/${item.id}`)}
                className="mr-3 w-36 overflow-hidden rounded-3xl bg-rizoma-gray"
              >
                <Image source={{ uri: item.image }} style={{ width: "100%", height: 96 }} resizeMode="cover" />
                <Text
                  className="px-3 py-2 text-sm text-rizoma-black"
                  style={{ fontFamily: "Inter_600SemiBold" }}
                  numberOfLines={1}
                >
                  {item.name}
                </Text>
              </Pressable>
            ))}
          </ScrollView>
        </View>
      </ScrollView>

      {addedToast ? (
        <View
          className="absolute left-[13px] right-[13px] rounded-2xl bg-rizoma-brandSoft px-4 py-3"
          style={{ bottom: bottomBarHeight + 12 }}
        >
          <Text className="text-center text-sm text-rizoma-brand" style={{ fontFamily: "Inter_600SemiBold" }}>
            {addedToast}
          </Text>
        </View>
      ) : null}

      <View
        className="absolute bottom-0 left-0 right-0 border-t border-rizoma-border bg-white px-[13px] pt-3"
        style={{ paddingBottom: bottomBarPadding }}
      >
        <View className="flex-row items-center gap-2.5">
          <View className="h-14 flex-row items-center rounded-full bg-rizoma-gray px-1.5">
            <Pressable
              accessibilityLabel="Reducir cantidad"
              onPress={() => setQty((q) => Math.max(1, q - 1))}
              className="h-10 w-10 items-center justify-center rounded-full"
              hitSlop={6}
            >
              <Minus size={16} color={colors.black} />
            </Pressable>
            <Text
              className="min-w-[28px] text-center text-base text-rizoma-black"
              style={{ fontFamily: "Inter_700Bold" }}
            >
              {qty}
            </Text>
            <Pressable
              accessibilityLabel="Aumentar cantidad"
              onPress={() => setQty((q) => q + 1)}
              className="h-10 w-10 items-center justify-center rounded-full"
              hitSlop={6}
            >
              <Plus size={16} color={colors.black} />
            </Pressable>
          </View>

          <Pressable
            accessibilityLabel="Añadir a favoritos"
            onPress={() => {
              toggleWishlist(plant);
              showToast(saved ? "Quitada de favoritos" : "Añadida a favoritos");
            }}
            className="h-14 w-14 items-center justify-center rounded-full border border-rizoma-border"
          >
            <Heart size={18} color={saved ? colors.brand : colors.black} fill={saved ? colors.brand : "transparent"} />
          </Pressable>

          <Pressable
            accessibilityLabel="Añadir al carrito"
            onPress={() => {
              addToCart(plant, qty);
              showToast(`${qty} añadida${qty > 1 ? "s" : ""} al carrito`);
            }}
            className="h-14 w-14 items-center justify-center rounded-full border border-rizoma-border"
          >
            <ShoppingBag size={18} color={colors.black} />
          </Pressable>

          <View className="flex-1">
            <RizomaButton
              label="Comprar ahora"
              onPress={() => {
                addToCart(plant, qty);
                router.push("/(tabs)/cart");
              }}
            />
          </View>
        </View>

        <Pressable onPress={() => addToGarden(plant)} className="mt-1.5 py-1.5">
          <Text className="text-center text-sm text-rizoma-brand" style={{ fontFamily: "Inter_600SemiBold" }}>
            Guardar en Mi Jardín
          </Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}
