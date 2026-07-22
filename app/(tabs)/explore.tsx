import { useMemo, useState } from "react";
import { FlatList, Pressable, Text, View } from "react-native";
import { Link } from "expo-router";
import { plants } from "@/src/data/plants";
import { PlantCard } from "@/src/components/catalog/PlantCard";
import { FilterChip } from "@/src/components/ui/FilterChip";
import { Screen } from "@/src/components/ui/Screen";
import { ScreenHeader } from "@/src/components/ui/ScreenHeader";
import { EmptyState } from "@/src/components/ui/EmptyState";
import { CatalogFilters, defaultCatalogFilters, filterPlants } from "@/src/utils/catalogFilters";
import { useShop } from "@/src/store/ShopContext";

export default function ExploreScreen() {
  const [filters, setFilters] = useState<CatalogFilters>(defaultCatalogFilters);
  const { toggleWishlist, isInWishlist } = useShop();

  const filteredPlants = useMemo(() => filterPlants(plants, filters), [filters]);

  return (
    <Screen>
      <ScreenHeader title="Catalogo" />
      <Text className="mb-3 text-sm text-rizoma-secondaryText" style={{ fontFamily: "Inter_400Regular" }}>
        Filtra por luz, dificultad y mascotas.
      </Text>

      <View className="mb-3 flex-row flex-wrap gap-2">
        {(["all", "low", "medium", "high"] as const).map((item) => (
          <FilterChip
            key={`light-${item}`}
            label={`luz:${item}`}
            active={filters.light === item}
            onPress={() => setFilters((prev) => ({ ...prev, light: item }))}
          />
        ))}
      </View>

      <View className="mb-4 flex-row flex-wrap gap-2">
        {(["all", "yes", "no"] as const).map((item) => (
          <FilterChip
            key={`pet-${item}`}
            label={item === "all" ? "pets:all" : item === "yes" ? "pet-safe" : "no pets"}
            active={filters.petFriendly === item}
            variant="brand"
            onPress={() => setFilters((prev) => ({ ...prev, petFriendly: item }))}
          />
        ))}
      </View>

      <FlatList
        data={filteredPlants}
        keyExtractor={(item) => item.id}
        numColumns={2}
        columnWrapperStyle={{ gap: 12 }}
        renderItem={({ item }) => (
          <View className="flex-1">
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
        )}
        ListEmptyComponent={
          <EmptyState
            title="Sin coincidencias"
            description="Prueba otra combinacion de filtros."
            actionLabel="Limpiar filtros"
            onActionPress={() => setFilters(defaultCatalogFilters)}
          />
        }
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 24 }}
      />
    </Screen>
  );
}
