import { useMemo, useState } from "react";
import { FlatList, Text, View } from "react-native";
import { router } from "expo-router";
import { searchPlants } from "@/src/data/plants";
import { PlantCard } from "@/src/components/catalog/PlantCard";
import { Screen } from "@/src/components/ui/Screen";
import { ScreenHeader } from "@/src/components/ui/ScreenHeader";
import { LeafySearchBar } from "@/src/components/ui/LeafySearchBar";
import { EmptyState } from "@/src/components/ui/EmptyState";
import { useShop } from "@/src/store/ShopContext";

export default function SearchScreen() {
  const [query, setQuery] = useState("");
  const results = useMemo(() => searchPlants(query), [query]);
  const { toggleWishlist, isInWishlist } = useShop();

  return (
    <Screen>
      <ScreenHeader title="Buscar" />
      <Text className="mb-3 text-sm text-rizoma-secondaryText" style={{ fontFamily: "Inter_400Regular" }}>
        Nombre común, latín o badge.
      </Text>

      <LeafySearchBar
        value={query}
        onChangeText={setQuery}
        onScanPress={() => router.push("/scan")}
        placeholder="Ej. Costilla de Adán, pet friendly..."
      />

      <FlatList
        data={results}
        keyExtractor={(item) => item.id}
        numColumns={2}
        columnWrapperStyle={{ gap: 12 }}
        className="mt-4"
        renderItem={({ item }) => (
          <View className="flex-1">
            <PlantCard
              plant={item}
              compact
              wishlisted={isInWishlist(item.id)}
              onToggleWishlist={() => toggleWishlist(item)}
              onPress={() => router.push(`/plants/${item.id}`)}
            />
          </View>
        )}
        ListEmptyComponent={
          <EmptyState
            title="Sin resultados"
            description="Prueba otro término o escanea una planta."
            actionLabel="Escanear"
            onActionPress={() => router.push("/scan")}
          />
        }
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 24 }}
      />
    </Screen>
  );
}
