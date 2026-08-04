import { useEffect, useMemo, useState } from "react";
import { FlatList, Pressable, ScrollView, Text, View } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { LayoutGrid, SearchX, SlidersHorizontal } from "lucide-react-native";
import { colors } from "@/src/theme/tokens";
import { plants } from "@/src/data/plants";
import {
  isShopCategoryId,
  plantIdsForShopCategory,
  shopCategories,
  ShopCategoryId,
} from "@/src/data/shopCategories";
import { PlantCard } from "@/src/components/catalog/PlantCard";
import { CategoryIconButton } from "@/src/components/ui/CategoryIconButton";
import { FilterChip } from "@/src/components/ui/FilterChip";
import { Screen } from "@/src/components/ui/Screen";
import { ScreenHeader } from "@/src/components/ui/ScreenHeader";
import { EmptyState, emptyIconTone } from "@/src/components/ui/EmptyState";
import { CatalogFilters, defaultCatalogFilters, filterPlants } from "@/src/utils/catalogFilters";
import { useShop } from "@/src/store/ShopContext";
import { difficultyLabel, lightLabel } from "@/src/utils/plantLabels";

export default function ExploreScreen() {
  const params = useLocalSearchParams<{ shop?: string }>();
  const initialShop = isShopCategoryId(params.shop) ? params.shop : null;
  const [shopFilter, setShopFilter] = useState<ShopCategoryId | null>(initialShop);
  const [filters, setFilters] = useState<CatalogFilters>(defaultCatalogFilters);
  const [showExtraFilters, setShowExtraFilters] = useState(false);
  const { toggleWishlist, isInWishlist } = useShop();

  useEffect(() => {
    setShopFilter(isShopCategoryId(params.shop) ? params.shop : null);
  }, [params.shop]);

  const filteredPlants = useMemo(() => {
    let list = filterPlants(plants, filters);
    if (shopFilter) {
      const allowed = new Set(plantIdsForShopCategory(shopFilter));
      list = list.filter((plant) => allowed.has(plant.id));
    }
    return list;
  }, [filters, shopFilter]);

  const onShopPress = (id: ShopCategoryId) => {
    setShopFilter((prev) => (prev === id ? null : id));
  };

  const extraActive =
    filters.light !== "all" || filters.difficulty !== "all" || filters.petFriendly !== "all";

  return (
    <Screen>
      <ScreenHeader title="Catálogo" showNotificationBadge />

      <FlatList
        data={filteredPlants}
        keyExtractor={(item) => item.id}
        numColumns={2}
        columnWrapperStyle={{ gap: 12 }}
        ListHeaderComponent={
          <View>
            <Text className="mb-3 text-sm text-rizoma-secondaryText" style={{ fontFamily: "Inter_400Regular" }}>
              {plants.length} plantas · filtra por categoría
            </Text>

            <View
              style={{
                flexDirection: "row",
                alignItems: "flex-start",
                justifyContent: "space-between",
                width: "100%",
                marginBottom: 12,
              }}
            >
              <Pressable
                onPress={() => setShopFilter(null)}
                accessibilityRole="button"
                accessibilityState={{ selected: shopFilter === null }}
                accessibilityLabel="Todas las categorías"
                className="items-center"
                style={{ flex: 1, alignItems: "center" }}
              >
                <View
                  className={`h-11 w-11 items-center justify-center rounded-full ${
                    shopFilter === null ? "bg-rizoma-brand" : "bg-rizoma-brandSoft"
                  }`}
                >
                  <LayoutGrid
                    size={18}
                    color={shopFilter === null ? colors.white : colors.brand}
                  />
                </View>
                <Text
                  className={`mt-1.5 text-center text-[11px] ${
                    shopFilter === null ? "text-rizoma-brand" : "text-rizoma-black"
                  }`}
                  style={{ fontFamily: shopFilter === null ? "Inter_700Bold" : "Inter_600SemiBold" }}
                  numberOfLines={1}
                >
                  Todas
                </Text>
              </Pressable>
              {shopCategories.map((item) => (
                <CategoryIconButton
                  key={item.id}
                  category={item}
                  compact
                  distributed
                  active={shopFilter === item.id}
                  onPress={onShopPress}
                />
              ))}
            </View>

            <Pressable
              onPress={() => setShowExtraFilters((v) => !v)}
              accessibilityRole="button"
              accessibilityState={{ expanded: showExtraFilters, selected: extraActive }}
              accessibilityLabel={
                showExtraFilters
                  ? "Ocultar filtros de luz, dificultad y mascotas"
                  : "Filtros de luz, dificultad y mascotas"
              }
              className={`mb-3 min-h-[44px] flex-row items-center gap-2 self-start rounded-full px-3.5 py-2 ${
                showExtraFilters || extraActive ? "bg-rizoma-brand" : "bg-rizoma-brandSoft"
              }`}
              style={({ pressed }) => ({ opacity: pressed ? 0.85 : 1 })}
            >
              <SlidersHorizontal
                size={16}
                color={showExtraFilters || extraActive ? colors.white : colors.brand}
              />
              <Text
                className={`text-sm ${showExtraFilters || extraActive ? "text-white" : "text-rizoma-brand"}`}
                style={{ fontFamily: "Inter_600SemiBold" }}
              >
                {showExtraFilters ? "Ocultar filtros" : "Filtros"}
              </Text>
              {extraActive && !showExtraFilters ? (
                <View className="h-2 w-2 rounded-full bg-white" />
              ) : null}
            </Pressable>

            {showExtraFilters ? (
              <View className="mb-2 gap-2">
                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8 }}>
                  {(["all", "low", "medium", "high"] as const).map((item) => (
                    <FilterChip
                      key={`light-${item}`}
                      label={item === "all" ? "Toda la luz" : lightLabel(item)}
                      active={filters.light === item}
                      onPress={() => setFilters((prev) => ({ ...prev, light: item }))}
                    />
                  ))}
                </ScrollView>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8 }}>
                  {(["all", "easy", "medium", "advanced"] as const).map((item) => (
                    <FilterChip
                      key={`diff-${item}`}
                      label={item === "all" ? "Toda dificultad" : difficultyLabel(item)}
                      active={filters.difficulty === item}
                      variant="brand"
                      onPress={() => setFilters((prev) => ({ ...prev, difficulty: item }))}
                    />
                  ))}
                </ScrollView>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8 }}>
                  {(["all", "yes", "no"] as const).map((item) => (
                    <FilterChip
                      key={`pet-${item}`}
                      label={
                        item === "all" ? "Todas mascotas" : item === "yes" ? "Segura mascotas" : "No apta mascotas"
                      }
                      active={filters.petFriendly === item}
                      onPress={() => setFilters((prev) => ({ ...prev, petFriendly: item }))}
                    />
                  ))}
                </ScrollView>
              </View>
            ) : null}

            <Text className="mb-3 text-xs text-rizoma-secondaryText" style={{ fontFamily: "Inter_500Medium" }}>
              {filteredPlants.length === 0
                ? "Sin coincidencias"
                : `${filteredPlants.length} planta${filteredPlants.length === 1 ? "" : "s"}`}
            </Text>
          </View>
        }
        renderItem={({ item }) => (
          <View style={{ flex: 1 }}>
            <PlantCard
              plant={item}
              wishlisted={isInWishlist(item.id)}
              onToggleWishlist={() => toggleWishlist(item)}
              onPress={() => router.push(`/plants/${item.id}`)}
            />
          </View>
        )}
        ListEmptyComponent={
          <EmptyState
            title="Sin coincidencias"
            description="Prueba otra combinación de filtros."
            actionLabel="Limpiar filtros"
            onActionPress={() => {
              setFilters(defaultCatalogFilters);
              setShopFilter(null);
            }}
            icon={<SearchX size={24} color={emptyIconTone} />}
          />
        }
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 24 }}
      />
    </Screen>
  );
}
