import { useEffect, useMemo, useRef, useState } from "react";
import {
  Dimensions,
  FlatList,
  Image,
  NativeScrollEvent,
  NativeSyntheticEvent,
  Pressable,
  Text,
  View,
} from "react-native";
import { Link, router } from "expo-router";
import { MapPin, Bell } from "lucide-react-native";
import { plants } from "@/src/data/plants";
import { plantCategories } from "@/src/data/categories";
import { PlantCard } from "@/src/components/catalog/PlantCard";
import { LeafySearchBar } from "@/src/components/ui/LeafySearchBar";
import { FilterChip } from "@/src/components/ui/FilterChip";
import { CircularIconButton } from "@/src/components/ui/CircularIconButton";
import { SectionHeader } from "@/src/components/ui/SectionHeader";
import { SkeletonCard } from "@/src/components/ui/SkeletonCard";
import { Screen } from "@/src/components/ui/Screen";
import { useShop } from "@/src/store/ShopContext";
import { plantsByCategory } from "@/src/utils/catalogFilters";
import { colors } from "@/src/theme/tokens";

const promoWidth = Dimensions.get("window").width - 26;

const promos = [
  { id: "p1", title: "Hasta 60% dto.", subtitle: "Oferta activa en interiores", plantIndex: 0 },
  { id: "p2", title: "Pet-safe week", subtitle: "Plantas seguras para mascotas", plantIndex: 1 },
  { id: "p3", title: "Envio gratis", subtitle: "Pedidos desde 40 EUR", plantIndex: 2 },
];

function formatCountdown(totalSeconds: number) {
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  const pad = (value: number) => String(value).padStart(2, "0");
  return `${pad(hours)} : ${pad(minutes)} : ${pad(seconds)}`;
}

export default function HomeScreen() {
  const [categoryId, setCategoryId] = useState(plantCategories[0].id);
  const [secondsLeft, setSecondsLeft] = useState(2 * 3600 + 12 * 60);
  const [promoIndex, setPromoIndex] = useState(0);
  const promoRef = useRef<FlatList<(typeof promos)[number]>>(null);
  const { toggleWishlist, isInWishlist, hydrated } = useShop();

  useEffect(() => {
    const timer = setInterval(() => {
      setSecondsLeft((prev) => (prev > 0 ? prev - 1 : 2 * 3600 + 12 * 60));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const activeCategory = plantCategories.find((item) => item.id === categoryId) ?? plantCategories[0];
  const featured = useMemo(
    () => plantsByCategory(plants, activeCategory.filter).slice(0, 6),
    [activeCategory.filter],
  );

  const onPromoScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const index = Math.round(event.nativeEvent.contentOffset.x / promoWidth);
    setPromoIndex(index);
  };

  return (
    <Screen scroll>
      <View className="mb-4 flex-row items-center justify-between">
        <View className="flex-row items-center gap-3">
          <Image
            source={{ uri: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=120" }}
            className="h-11 w-11 rounded-full"
            accessibilityLabel="Avatar de perfil"
          />
          <View>
            <Text className="text-base text-rizoma-black" style={{ fontFamily: "Inter_700Bold" }}>
              Hola, amante de las plantas
            </Text>
            <View className="mt-0.5 flex-row items-center gap-1">
              <MapPin size={12} color={colors.grayText} />
              <Text className="text-xs text-rizoma-grayText" style={{ fontFamily: "Inter_400Regular" }}>
                Barcelona, España
              </Text>
            </View>
          </View>
        </View>
        <CircularIconButton accessibilityLabel="Notificaciones" onPress={() => router.push("/notifications")}>
          <Bell size={18} color={colors.black} />
        </CircularIconButton>
      </View>

      <LeafySearchBar
        onFocusPress={() => router.push("/search")}
        onScanPress={() => router.push("/scan")}
      />

      <View className="mt-5 flex-row items-center justify-between">
        <Text className="text-xl text-rizoma-black" style={{ fontFamily: "Inter_700Bold" }}>
          Ofertas top
        </Text>
        <Text className="text-xs text-rizoma-secondaryText" style={{ fontFamily: "Inter_500Medium" }}>
          {formatCountdown(secondsLeft)}
        </Text>
      </View>

      <FlatList
        ref={promoRef}
        data={promos}
        keyExtractor={(item) => item.id}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={onPromoScroll}
        scrollEventThrottle={16}
        className="mt-3"
        renderItem={({ item }) => (
          <View style={{ width: promoWidth }} className="flex-row items-center overflow-hidden rounded-3xl bg-rizoma-brandSoft p-4">
            <View className="flex-1 pr-3">
              <Text className="text-sm text-rizoma-secondaryText" style={{ fontFamily: "Inter_400Regular" }}>
                {item.subtitle}
              </Text>
              <Text className="mt-1 text-3xl text-rizoma-black" style={{ fontFamily: "Inter_700Bold" }}>
                {item.title}
              </Text>
            </View>
            <Image source={{ uri: plants[item.plantIndex].image }} className="h-24 w-24" resizeMode="contain" />
          </View>
        )}
      />
      <View className="mt-3 flex-row items-center gap-2">
        {promos.map((item, index) => (
          <Pressable
            key={item.id}
            accessibilityLabel={`Promo ${index + 1}`}
            onPress={() => {
              promoRef.current?.scrollToIndex({ index, animated: true });
              setPromoIndex(index);
            }}
            className={`h-2 rounded-full ${index === promoIndex ? "w-6 bg-rizoma-brand" : "w-2 bg-rizoma-gray"}`}
          />
        ))}
      </View>

      <View className="mt-6">
        <SectionHeader
          title="Ofertas especiales"
          subtitle={activeCategory.subtitle}
          actionLabel="Ver todo"
          onActionPress={() => router.push("/(tabs)/explore")}
        />
      </View>

      <View className="mt-1 flex-row flex-wrap gap-2">
        {plantCategories.map((item) => (
          <FilterChip
            key={item.id}
            label={item.title}
            active={categoryId === item.id}
            variant="dark"
            onPress={() => setCategoryId(item.id)}
            accessibilityLabel={`Categoría ${item.title}`}
          />
        ))}
      </View>

      {!hydrated ? (
        <View
          className="mt-3 flex-row gap-3"
          accessibilityLabel="Cargando catálogo"
          accessibilityRole="progressbar"
        >
          <View className="flex-1">
            <SkeletonCard />
          </View>
          <View className="flex-1">
            <SkeletonCard />
          </View>
        </View>
      ) : (
        <View className="mt-3 flex-row flex-wrap" style={{ gap: 12 }}>
          {featured.map((item) => (
            <View key={item.id} style={{ width: "48%" }}>
              <Link href={`/plants/${item.id}`} asChild>
                <Pressable>
                  <PlantCard
                    plant={item}
                    wishlisted={isInWishlist(item.id)}
                    onToggleWishlist={() => toggleWishlist(item)}
                  />
                </Pressable>
              </Link>
            </View>
          ))}
        </View>
      )}
    </Screen>
  );
}
