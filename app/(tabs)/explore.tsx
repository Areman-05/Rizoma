import { useMemo, useState } from "react";
import { FlatList, Pressable, Text, View } from "react-native";
import { Link } from "expo-router";
import { plants } from "@/src/data/plants";
import { PlantCard } from "@/src/components/catalog/PlantCard";
import { FilterChip } from "@/src/components/ui/FilterChip";
import { Screen } from "@/src/components/ui/Screen";
import { EmptyState } from "@/src/components/ui/EmptyState";
import { CatalogFilters, defaultCatalogFilters, filterPlants } from "@/src/utils/catalogFilters";

export default function ExploreScreen() {
  const [filters, setFilters] = useState<CatalogFilters>(defaultCatalogFilters);

  const filteredPlants = useMemo(() => filterPlants(plants, filters), [filters]);

  return (
    <Screen>
      <Text className="text-3xl font-bold text-rizoma-primary">Catalogo</Text>
      <Text className="mt-1 text-rizoma-secondaryText">Filtra por luz, dificultad y mascotas.</Text>

      <View className="mb-3 mt-4 flex-row flex-wrap gap-2">
        {(["all", "low", "medium", "high"] as const).map((item) => (
          <FilterChip
            key={`light-${item}`}
            label={`luz:${item}`}
            active={filters.light === item}
            onPress={() => setFilters((prev) => ({ ...prev, light: item }))}
          />
        ))}
      </View>

      <View className="mb-3 flex-row flex-wrap gap-2">
        {(["all", "easy", "medium", "advanced"] as const).map((item) => (
          <FilterChip
            key={`diff-${item}`}
            label={item}
            active={filters.difficulty === item}
            onPress={() => setFilters((prev) => ({ ...prev, difficulty: item }))}
          />
        ))}
      </View>

      <View className="mb-4 flex-row flex-wrap gap-2">
        {(["all", "yes", "no"] as const).map((item) => (
          <FilterChip
            key={`pet-${item}`}
            label={item === "all" ? "pets:all" : item === "yes" ? "pet-safe" : "no pets"}
            active={filters.petFriendly === item}
            onPress={() => setFilters((prev) => ({ ...prev, petFriendly: item }))}
          />
        ))}
      </View>

      <FlatList
        data={filteredPlants}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <Link href={`/plants/${item.id}`} asChild>
            <Pressable>
              <PlantCard plant={item} />
            </Pressable>
          </Link>
        )}
        ListEmptyComponent={
          <EmptyState
            title="Sin coincidencias"
            description="Prueba otra combinacion de filtros para descubrir plantas Rizoma."
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
