import { useMemo, useState } from "react";
import { FlatList, Pressable, Text, View } from "react-native";
import { Link, router } from "expo-router";
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
        Nombre comun, latin o badge.
      </Text>

      <LeafySearchBar
        value={query}
        onChangeText={setQuery}
        onScanPress={() => router.push("/scan")}
        placeholder="Ej. Monstera, pet friendly..."
      />

      <FlatList
        data={results}
        keyExtractor={(item) => item.id}
        numColumns={2}
        columnWrapperStyle={{ gap: 12 }}
        className="mt-4"
        renderItem={({ item }) => (
          <View className="flex-1">
            <Link href={`/plants/${item.id}`} asChild>
              <Pressable>
                <PlantCard
                  plant={item}
                  compact
                  wishlisted={isInWishlist(item.id)}
                  onToggleWishlist={() => toggleWishlist(item)}
                />
              </Pressable>
            </Link>
          </View>
        )}
        ListEmptyComponent={
          <EmptyState
            title="Sin resultados"
            description="Prueba otro termino o escanea una planta."
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
