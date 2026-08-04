import { useCallback, useState } from "react";
import { Image, Pressable, ScrollView, Text, View } from "react-native";
import { useLocalSearchParams, router } from "expo-router";
import { ChevronLeft, Heart, Home, Leaf, Minus, Plus, Star } from "lucide-react-native";
import { getPlantById } from "@/src/data/plants";
import { PlantIndicators } from "@/src/components/catalog/PlantIndicators";
import { CircularIconButton } from "@/src/components/ui/CircularIconButton";
import { EmptyState } from "@/src/components/ui/EmptyState";
import { InAppToast } from "@/src/components/ui/InAppToast";
import { Screen } from "@/src/components/ui/Screen";
import { useShop } from "@/src/store/ShopContext";
import { useGarden } from "@/src/store/GardenContext";
import { getRelatedPlants } from "@/src/utils/relatedPlants";
import { formatPrice } from "@/src/utils/pricing";
import { difficultyLabel } from "@/src/utils/plantLabels";
import { colors } from "@/src/theme/tokens";
import { useSafeAreaInsets } from "react-native-safe-area-context";

/** Altura del chrome sticky (sin safe-area): fila Jardín + dock CTA. */
const BOTTOM_BAR_CONTENT_HEIGHT = 96;

export default function PlantDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const insets = useSafeAreaInsets();
  const plant = getPlantById(Array.isArray(id) ? id[0] : id);
  const { addToCart, toggleWishlist, isInWishlist } = useShop();
  const { addToGarden, removeFromGarden, isInGarden } = useGarden();
  const [qty, setQty] = useState(1);
  const [toast, setToast] = useState<{ message: string; subtitle?: string } | null>(null);
  const bottomBarPadding = Math.max(insets.bottom, 12);
  const bottomBarHeight = BOTTOM_BAR_CONTENT_HEIGHT + bottomBarPadding;
  const hideToast = useCallback(() => setToast(null), []);

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
  const inGarden = isInGarden(plant.id);
  const related = getRelatedPlants(plant);
  const lineTotal = formatPrice(plant.price * qty);

  const showToast = (message: string, subtitle?: string) => {
    setToast({ message, subtitle });
  };

  return (
    <Screen padded={false}>
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingBottom: bottomBarHeight + 20 }}
        showsVerticalScrollIndicator={false}
      >
        <View className="relative">
          <Image source={{ uri: plant.image }} style={{ width: "100%", height: 360 }} resizeMode="cover" />
          <View className="absolute left-[13px] right-[13px] top-3 flex-row items-center justify-between">
            <View className="flex-row items-center gap-2">
              <CircularIconButton onPress={() => router.back()} accessibilityLabel="Volver">
                <ChevronLeft size={20} color={colors.black} />
              </CircularIconButton>
              <CircularIconButton
                onPress={() => router.replace("/(tabs)")}
                accessibilityLabel="Ir al inicio"
              >
                <Home size={18} color={colors.brand} />
              </CircularIconButton>
            </View>
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
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ gap: 12, paddingRight: 4 }}
          >
            {related.map((item) => (
              <Pressable
                key={item.id}
                onPress={() => router.push(`/plants/${item.id}`)}
                className="overflow-hidden rounded-3xl bg-rizoma-gray"
                style={{ width: 148 }}
              >
                <Image source={{ uri: item.image }} style={{ width: "100%", height: 110 }} resizeMode="cover" />
                <Text
                  className="px-2.5 py-2.5 text-sm text-rizoma-black"
                  style={{ fontFamily: "Inter_600SemiBold" }}
                  numberOfLines={2}
                >
                  {item.name}
                </Text>
              </Pressable>
            ))}
          </ScrollView>
        </View>
      </ScrollView>

      <InAppToast
        visible={!!toast}
        message={toast?.message ?? ""}
        subtitle={toast?.subtitle}
        bottom={bottomBarHeight + 12}
        durationMs={2000}
        onHide={hideToast}
      />

      <View
        className="absolute bottom-0 left-0 right-0 border-t border-rizoma-border bg-white px-[13px] pt-2.5"
        style={{ paddingBottom: bottomBarPadding }}
      >
        <View className="mb-2.5 flex-row items-center justify-end px-0.5">
          <Pressable
            accessibilityLabel={inGarden ? "Quitar de Mi Jardín" : "Guardar en Mi Jardín"}
            onPress={() => {
              if (inGarden) {
                removeFromGarden(plant.id);
                showToast("Quitada de Mi Jardín", plant.name);
                return;
              }
              const added = addToGarden(plant);
              showToast(added ? "Guardada en Mi Jardín" : "Ya está en Mi Jardín", plant.name);
            }}
            className="flex-row items-center gap-1.5 py-1"
            hitSlop={4}
            style={({ pressed }) => ({ opacity: pressed ? 0.75 : 1 })}
          >
            <Leaf size={15} color={colors.brand} fill={inGarden ? colors.brand : "transparent"} />
            <Text
              className={`text-[11px] ${inGarden ? "text-rizoma-brand" : "text-rizoma-secondaryText"}`}
              style={{ fontFamily: "Inter_500Medium" }}
            >
              {inGarden ? "En Mi Jardín" : "Mi Jardín"}
            </Text>
          </Pressable>
        </View>

        <View className="flex-row items-center gap-2.5">
          <View className="h-12 flex-row items-center rounded-full bg-rizoma-brandSoft px-1">
            <Pressable
              accessibilityLabel="Reducir cantidad"
              onPress={() => setQty((q) => Math.max(1, q - 1))}
              className="h-10 w-10 items-center justify-center"
              hitSlop={6}
            >
              <Minus size={16} color={colors.brand} />
            </Pressable>
            <Text
              className="min-w-[22px] text-center text-base text-rizoma-black"
              style={{ fontFamily: "Inter_700Bold" }}
            >
              {qty}
            </Text>
            <Pressable
              accessibilityLabel="Aumentar cantidad"
              onPress={() => setQty((q) => q + 1)}
              className="h-10 w-10 items-center justify-center"
              hitSlop={6}
            >
              <Plus size={16} color={colors.brand} />
            </Pressable>
          </View>

          <Pressable
            accessibilityLabel="Añadir al carrito"
            onPress={() => {
              addToCart(plant, qty);
              showToast(
                qty > 1 ? `Añadido al carrito · ${qty} ud.` : "Añadido al carrito",
                plant.name,
              );
            }}
            className="h-12 flex-1 items-center justify-center rounded-full bg-rizoma-brand px-4"
            style={({ pressed }) => ({ opacity: pressed ? 0.9 : 1 })}
          >
            <Text className="text-base text-white" style={{ fontFamily: "Inter_700Bold" }}>
              Añadir · {lineTotal}
            </Text>
          </Pressable>
        </View>
      </View>
    </Screen>
  );
}
