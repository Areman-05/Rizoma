import { useCallback, useEffect, useMemo, useRef, useState } from "react";
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
import { MapPin, Bell, SlidersHorizontal } from "lucide-react-native";
import { plants } from "@/src/data/plants";
import { plantCategories } from "@/src/data/categories";
import { shopCategories, ShopCategoryId } from "@/src/data/shopCategories";
import { PlantCard } from "@/src/components/catalog/PlantCard";
import { LeafySearchBar } from "@/src/components/ui/LeafySearchBar";
import { FilterChip } from "@/src/components/ui/FilterChip";
import { CircularIconButton } from "@/src/components/ui/CircularIconButton";
import { CategoryIconButton } from "@/src/components/ui/CategoryIconButton";
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
  const [pageWidth, setPageWidth] = useState(0);
  const [profileName, setProfileName] = useState("amante de las plantas");
  const [autoTick, setAutoTick] = useState(0);
  const { toggleWishlist, isInWishlist, hydrated } = useShop();

  const promoScrollRef = useRef<ScrollView>(null);
  const promoIndexRef = useRef(0);
  const pageWidthRef = useRef(0);
  const draggingRef = useRef(false);
  const isAutoScrollingRef = useRef(false);
  const scrollingRef = useRef(false);
  const mountedRef = useRef(true);
  const autoTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const releaseTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  promoIndexRef.current = promoIndex;

  const clearAutoTimer = useCallback(() => {
    if (autoTimerRef.current) {
      clearInterval(autoTimerRef.current);
      autoTimerRef.current = null;
    }
  }, []);

  const clearReleaseTimer = useCallback(() => {
    if (releaseTimerRef.current) {
      clearTimeout(releaseTimerRef.current);
      releaseTimerRef.current = null;
    }
  }, []);

  const syncPromoFromOffset = useCallback((offsetX: number, width: number) => {
    if (!mountedRef.current || width <= 0) return;
    if (scrollingRef.current || isAutoScrollingRef.current) return;
    const next = Math.round(offsetX / width);
    const clamped = Math.max(0, Math.min(promos.length - 1, next));
    if (clamped !== promoIndexRef.current) {
      promoIndexRef.current = clamped;
      setPromoIndex(clamped);
    }
  }, []);

  const scrollToPromo = useCallback((index: number, animated = true) => {
    if (!mountedRef.current) return;
    const width = pageWidthRef.current;
    if (width <= 0) return;
    const normalized = ((index % promos.length) + promos.length) % promos.length;
    scrollingRef.current = true;
    isAutoScrollingRef.current = true;
    promoIndexRef.current = normalized;
    setPromoIndex(normalized);
    promoScrollRef.current?.scrollTo({ x: normalized * width, animated });
    // Liberar flags tras la animación (o al instante si no hay animación)
    clearReleaseTimer();
    const releaseMs = animated ? 420 : 0;
    releaseTimerRef.current = setTimeout(() => {
      releaseTimerRef.current = null;
      if (!mountedRef.current) return;
      scrollingRef.current = false;
      isAutoScrollingRef.current = false;
    }, releaseMs);
  }, [clearReleaseTimer]);

  const restartAutoAdvance = useCallback(() => {
    if (!mountedRef.current) return;
    setAutoTick((n) => n + 1);
  }, []);

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
      clearAutoTimer();
      clearReleaseTimer();
      scrollingRef.current = false;
      isAutoScrollingRef.current = false;
      draggingRef.current = false;
    };
  }, [clearAutoTimer, clearReleaseTimer]);

  useEffect(() => {
    let cancelled = false;
    loadProfileName().then((name) => {
      if (!cancelled && mountedRef.current) setProfileName(name.toLowerCase());
    });
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      if (!mountedRef.current) return;
      setSecondsLeft((prev) => (prev > 0 ? prev - 1 : 2 * 3600 + 12 * 60));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (pageWidth <= 0) return;
    clearAutoTimer();
    autoTimerRef.current = setInterval(() => {
      if (!mountedRef.current) return;
      if (draggingRef.current || scrollingRef.current || isAutoScrollingRef.current) return;
      if (pageWidthRef.current <= 0) return;
      const next = (promoIndexRef.current + 1) % promos.length;
      scrollToPromo(next, true);
    }, PROMO_AUTO_MS);
    return () => clearAutoTimer();
  }, [pageWidth, autoTick, clearAutoTimer, scrollToPromo]);

  const onPromoMomentumEnd = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    draggingRef.current = false;
    scrollingRef.current = false;
    isAutoScrollingRef.current = false;
    syncPromoFromOffset(event.nativeEvent.contentOffset.x, pageWidthRef.current);
    restartAutoAdvance();
  };

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
          if (width > 0 && width !== pageWidthRef.current) {
            pageWidthRef.current = width;
            setPageWidth(width);
            requestAnimationFrame(() => {
              if (!mountedRef.current || pageWidthRef.current <= 0) return;
              promoScrollRef.current?.scrollTo({
                x: promoIndexRef.current * width,
                animated: false,
              });
            });
          }
        }}
      >
        {pageWidth > 0 ? (
          <ScrollView
            ref={promoScrollRef}
            horizontal
            pagingEnabled
            decelerationRate="fast"
            showsHorizontalScrollIndicator={false}
            disableIntervalMomentum
            onScrollBeginDrag={() => {
              draggingRef.current = true;
              clearAutoTimer();
            }}
            onScrollEndDrag={() => {
              // El índice definitivo se fija en onMomentumScrollEnd
            }}
            onMomentumScrollEnd={onPromoMomentumEnd}
            scrollEventThrottle={32}
          >
            {promos.map((promo) => (
              <Pressable
                key={promo.id}
                style={{ width: pageWidth }}
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
            accessibilityRole="button"
            hitSlop={8}
            onPress={() => {
              if (index === promoIndexRef.current) return;
              clearAutoTimer();
              scrollToPromo(index, true);
              restartAutoAdvance();
            }}
            className={`h-2 rounded-full ${index === promoIndex ? "w-6 bg-rizoma-brand" : "w-2 bg-rizoma-gray"}`}
          />
        ))}
      </View>

      <View className="mt-6">
        <SectionHeader title="Comprar por categoría" subtitle="Encuentra tu estilo de planta" />
      </View>
      <View className="mt-1 flex-row justify-between">
        {shopCategories.map((item) => (
          <View key={item.id} style={{ width: "23%" }}>
            <CategoryIconButton category={item} onPress={openShopCategory} />
          </View>
        ))}
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
        <SectionHeader title="Recomendadas para ti" subtitle="Selección según valoraciones" />
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
