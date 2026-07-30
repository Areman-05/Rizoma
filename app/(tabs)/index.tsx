import { useEffect, useMemo, useRef, useState } from "react";
import {
  Image,
  NativeScrollEvent,
  NativeSyntheticEvent,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";
import { router } from "expo-router";
import { MapPin, Bell, SlidersHorizontal, Home, Sun, Trees, Leaf } from "lucide-react-native";
import { plants } from "@/src/data/plants";
import { plantCategories } from "@/src/data/categories";
import { shopCategories, ShopCategoryId } from "@/src/data/shopCategories";
import { PlantCard } from "@/src/components/catalog/PlantCard";
import { LeafySearchBar } from "@/src/components/ui/LeafySearchBar";
import { FilterChip } from "@/src/components/ui/FilterChip";
import { CircularIconButton } from "@/src/components/ui/CircularIconButton";
import { SectionHeader } from "@/src/components/ui/SectionHeader";
import { SkeletonCard } from "@/src/components/ui/SkeletonCard";
import { Screen } from "@/src/components/ui/Screen";
import { useShop } from "@/src/store/ShopContext";
import { plantsByCategory } from "@/src/utils/catalogFilters";
import { loadProfileName } from "@/src/store/persistence";
import { colors } from "@/src/theme/tokens";

const promos = [
  { id: "p1", title: "Hasta 60% descuento", subtitle: "Oferta activa en interiores", plantIndex: 0 },
  { id: "p2", title: "Semana pet-safe", subtitle: "Plantas seguras para mascotas", plantIndex: 1 },
  { id: "p3", title: "Envío gratis", subtitle: "Pedidos desde 40 EUR", plantIndex: 2 },
];

const PROMO_AUTO_MS = 4000;

const shopCategoryIcons = {
  Home,
  Sun,
  Trees,
  Leaf,
} as const;

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
  const [promoWidth, setPromoWidth] = useState(0);
  const [profileName, setProfileName] = useState("amante de las plantas");
  const { toggleWishlist, isInWishlist, hydrated } = useShop();

  const promoScrollRef = useRef<ScrollView>(null);
  const promoIndexRef = useRef(0);
  const promoWidthRef = useRef(0);
  const promoDraggingRef = useRef(false);

  promoIndexRef.current = promoIndex;
  promoWidthRef.current = promoWidth;

  const syncPromoFromOffset = (offsetX: number, width: number) => {
    if (width <= 0) return;
    const next = Math.round(offsetX / width);
    const clamped = Math.max(0, Math.min(promos.length - 1, next));
    if (clamped !== promoIndexRef.current) {
      promoIndexRef.current = clamped;
      setPromoIndex(clamped);
    }
  };

  const onPromoScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    syncPromoFromOffset(event.nativeEvent.contentOffset.x, promoWidthRef.current);
  };

  const scrollToPromo = (index: number, animated = true) => {
    const width = promoWidthRef.current;
    if (width <= 0) return;
    const normalized = ((index % promos.length) + promos.length) % promos.length;
    promoScrollRef.current?.scrollTo({ x: normalized * width, animated });
    promoIndexRef.current = normalized;
    setPromoIndex(normalized);
  };

  useEffect(() => {
    loadProfileName().then((name) => setProfileName(name.toLowerCase()));
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setSecondsLeft((prev) => (prev > 0 ? prev - 1 : 2 * 3600 + 12 * 60));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (promoWidth <= 0) return;
    const auto = setInterval(() => {
      if (promoDraggingRef.current) return;
      const next = (promoIndexRef.current + 1) % promos.length;
      scrollToPromo(next, true);
    }, PROMO_AUTO_MS);
    return () => clearInterval(auto);
  }, [promoWidth]);

  const activeCategory = plantCategories.find((item) => item.id === categoryId) ?? plantCategories[0];
  const featured = useMemo(
    () => plantsByCategory(plants, activeCategory.filter).slice(0, 6),
    [activeCategory.filter],
  );

  const recommended = useMemo(
    () => [...plants].sort((a, b) => b.rating - a.rating || b.reviewCount - a.reviewCount).slice(0, 4),
    [],
  );

  const openShopCategory = (id: ShopCategoryId) => {
    router.push({ pathname: "/(tabs)/explore", params: { shop: id } });
  };

  return (
    <Screen scroll>
      <View className="mb-4 flex-row items-center justify-between">
        <Pressable
          className="flex-row items-center gap-3"
          onPress={() => router.push("/(tabs)/profile")}
          accessibilityRole="button"
          accessibilityLabel="Ir al perfil"
        >
          <Image
            source={{ uri: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=120" }}
            className="h-11 w-11 rounded-full"
            accessibilityLabel="Avatar de perfil"
          />
          <View>
            <Text className="text-base text-rizoma-black" style={{ fontFamily: "Inter_700Bold" }}>
              Hola, {profileName}
            </Text>
            <View className="mt-0.5 flex-row items-center gap-1">
              <MapPin size={12} color={colors.grayText} />
              <Text className="text-xs text-rizoma-grayText" style={{ fontFamily: "Inter_400Regular" }}>
                Barcelona, España
              </Text>
            </View>
          </View>
        </Pressable>
        <View>
          <CircularIconButton accessibilityLabel="Notificaciones" onPress={() => router.push("/notifications")}>
            <Bell size={18} color={colors.black} />
          </CircularIconButton>
          <View className="absolute right-1 top-1 h-2.5 w-2.5 rounded-full bg-rizoma-red" />
        </View>
      </View>

      <View className="flex-row items-center gap-2.5">
        <View className="min-w-0 flex-1">
          <LeafySearchBar
            onFocusPress={() => router.push("/search")}
            onScanPress={() => router.push("/scan")}
          />
        </View>
        <CircularIconButton
          accessibilityLabel="Filtros del catálogo"
          onPress={() => router.push("/(tabs)/explore")}
          size={48}
        >
          <SlidersHorizontal size={18} color={colors.black} />
        </CircularIconButton>
      </View>

      <View className="mt-5 flex-row items-center justify-between">
        <Text className="text-xl text-rizoma-black" style={{ fontFamily: "Inter_700Bold" }}>
          Ofertas top
        </Text>
        <Text className="text-xs text-rizoma-secondaryText" style={{ fontFamily: "Inter_500Medium" }}>
          {formatCountdown(secondsLeft)}
        </Text>
      </View>

      <View
        className="mt-3 overflow-hidden rounded-3xl bg-rizoma-brandSoft"
        onLayout={(event) => {
          const width = Math.round(event.nativeEvent.layout.width);
          if (width > 0 && width !== promoWidthRef.current) {
            promoWidthRef.current = width;
            setPromoWidth(width);
            requestAnimationFrame(() => {
              promoScrollRef.current?.scrollTo({
                x: promoIndexRef.current * width,
                animated: false,
              });
            });
          }
        }}
      >
        {promoWidth > 0 ? (
          <ScrollView
            ref={promoScrollRef}
            horizontal
            pagingEnabled
            decelerationRate="fast"
            showsHorizontalScrollIndicator={false}
            snapToInterval={promoWidth}
            snapToAlignment="start"
            disableIntervalMomentum
            onScrollBeginDrag={() => {
              promoDraggingRef.current = true;
            }}
            onScrollEndDrag={() => {
              promoDraggingRef.current = false;
            }}
            onMomentumScrollEnd={(event) => {
              promoDraggingRef.current = false;
              syncPromoFromOffset(event.nativeEvent.contentOffset.x, promoWidth);
            }}
            onScroll={onPromoScroll}
            scrollEventThrottle={16}
          >
            {promos.map((promo) => (
              <Pressable
                key={promo.id}
                style={{ width: promoWidth }}
                onPress={() => router.push(`/plants/${plants[promo.plantIndex].id}`)}
                accessibilityRole="button"
                accessibilityLabel={promo.title}
              >
                <View className="flex-row items-stretch" style={{ height: 128 }}>
                  <View className="flex-1 justify-center p-4 pr-2">
                    <Text
                      className="text-sm text-rizoma-secondaryText"
                      style={{ fontFamily: "Inter_400Regular" }}
                    >
                      {promo.subtitle}
                    </Text>
                    <Text
                      className="mt-1 text-3xl text-rizoma-black"
                      style={{ fontFamily: "Inter_700Bold" }}
                    >
                      {promo.title}
                    </Text>
                  </View>
                  <Image
                    source={{ uri: plants[promo.plantIndex].image }}
                    style={{ width: 128, height: 128 }}
                    resizeMode="cover"
                  />
                </View>
              </Pressable>
            ))}
          </ScrollView>
        ) : (
          <View style={{ height: 128 }} />
        )}
      </View>

      <View className="mt-3 flex-row items-center gap-2">
        {promos.map((item, index) => (
          <Pressable
            key={item.id}
            accessibilityLabel={`Promo ${index + 1}`}
            onPress={() => scrollToPromo(index, true)}
            className={`h-2 rounded-full ${index === promoIndex ? "w-6 bg-rizoma-brand" : "w-2 bg-rizoma-gray"}`}
          />
        ))}
      </View>

      <View className="mt-6">
        <SectionHeader title="Comprar por categoría" subtitle="Encuentra tu estilo de planta" />
      </View>
      <View className="mt-1 flex-row justify-between">
        {shopCategories.map((item) => {
          const Icon = shopCategoryIcons[item.icon];
          return (
            <Pressable
              key={item.id}
              onPress={() => openShopCategory(item.id)}
              accessibilityRole="button"
              accessibilityLabel={`Categoría ${item.label}`}
              className="items-center"
              style={{ width: "23%" }}
            >
              <View className="h-16 w-16 items-center justify-center rounded-full bg-rizoma-brandSoft">
                <Icon size={24} color={colors.brand} />
              </View>
              <Text
                className="mt-2 text-center text-xs text-rizoma-black"
                style={{ fontFamily: "Inter_600SemiBold" }}
                numberOfLines={1}
              >
                {item.label}
              </Text>
            </Pressable>
          );
        })}
      </View>

      <View className="mt-6">
        <SectionHeader
          title="Ofertas especiales"
          subtitle={activeCategory.subtitle}
          actionLabel="Ver todo"
          actionVariant="button"
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
              <PlantCard
                plant={item}
                wishlisted={isInWishlist(item.id)}
                onToggleWishlist={() => toggleWishlist(item)}
                onPress={() => router.push(`/plants/${item.id}`)}
              />
            </View>
          ))}
        </View>
      )}

      <View className="mt-6">
        <SectionHeader
          title="Recomendadas para ti"
          subtitle="Selección según valoraciones"
          actionLabel="Ver todo"
          onActionPress={() => router.push("/(tabs)/explore")}
        />
      </View>

      {!hydrated ? (
        <View className="mt-1 flex-row gap-3">
          <View className="flex-1">
            <SkeletonCard />
          </View>
          <View className="flex-1">
            <SkeletonCard />
          </View>
        </View>
      ) : (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ gap: 12, paddingRight: 4 }}
          className="mt-1"
        >
          {recommended.map((item) => (
            <View key={item.id} style={{ width: 168 }}>
              <PlantCard
                plant={item}
                wishlisted={isInWishlist(item.id)}
                onToggleWishlist={() => toggleWishlist(item)}
                onPress={() => router.push(`/plants/${item.id}`)}
              />
            </View>
          ))}
        </ScrollView>
      )}
    </Screen>
  );
}
