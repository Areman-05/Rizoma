import { useEffect, useMemo, useState } from "react";
import { FlatList, Text, View } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { SearchX } from "lucide-react-native";
import { plants } from "@/src/data/plants";
import {
  isShopCategoryId,
  plantIdsForShopCategory,
  shopCategories,
  ShopCategoryId,
} from "@/src/data/shopCategories";
import { PlantCard } from "@/src/components/catalog/PlantCard";
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

  const shopLabel = shopFilter
    ? shopCategories.find((item) => item.id === shopFilter)?.label
    : null;

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
              Filtra por luz, dificultad y mascotas.
            </Text>

            <View className="mb-3 flex-row flex-wrap gap-2">
              <FilterChip
                label="Todas"
                active={shopFilter === null}
                variant="brand"
                onPress={() => setShopFilter(null)}
              />
              {shopCategories.map((item) => (
                <FilterChip
                  key={item.id}
                  label={item.label}
                  active={shopFilter === item.id}
                  variant="brand"
                  onPress={() => setShopFilter(item.id)}
                />
              ))}
            </View>

            {shopLabel ? (
              <Text className="mb-3 text-xs text-rizoma-brand" style={{ fontFamily: "Inter_500Medium" }}>
                Mostrando: {shopLabel}
              </Text>
            ) : null}

            <View className="mb-3 flex-row flex-wrap gap-2">
              {(["all", "low", "medium", "high"] as const).map((item) => (
                <FilterChip
                  key={`light-${item}`}
                  label={item === "all" ? "Toda la luz" : lightLabel(item)}
                  active={filters.light === item}
                  onPress={() => setFilters((prev) => ({ ...prev, light: item }))}
                />
              ))}
            </View>

            <View className="mb-3 flex-row flex-wrap gap-2">
              {(["all", "easy", "medium", "advanced"] as const).map((item) => (
                <FilterChip
                  key={`diff-${item}`}
                  label={item === "all" ? "Toda dificultad" : difficultyLabel(item)}
                  active={filters.difficulty === item}
                  variant="brand"
                  onPress={() => setFilters((prev) => ({ ...prev, difficulty: item }))}
                />
              ))}
            </View>

            <View className="mb-3 flex-row flex-wrap gap-2">
              {(["all", "yes", "no"] as const).map((item) => (
                <FilterChip
                  key={`pet-${item}`}
                  label={item === "all" ? "Todas mascotas" : item === "yes" ? "Segura mascotas" : "No apta mascotas"}
                  active={filters.petFriendly === item}
                  onPress={() => setFilters((prev) => ({ ...prev, petFriendly: item }))}
                />
              ))}
            </View>

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
