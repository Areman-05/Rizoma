import { useMemo, useState } from "react";
import { FlatList, Text, useWindowDimensions, View } from "react-native";
import { router } from "expo-router";
import { Heart, Search } from "lucide-react-native";
import { PlantCard } from "@/src/components/catalog/PlantCard";
import { useShop } from "@/src/store/ShopContext";
import { Screen } from "@/src/components/ui/Screen";
import { ScreenHeader } from "@/src/components/ui/ScreenHeader";
import { EmptyState, emptyIconTone } from "@/src/components/ui/EmptyState";
import { LeafySearchBar } from "@/src/components/ui/LeafySearchBar";
import { RizomaButton } from "@/src/components/ui/RizomaButton";
import { getPlantById } from "@/src/data/plants";

const COLUMN_GAP = 16;
/** Coincide con `px-[13px]` de Screen (ambos lados). */
const SCREEN_H_PADDING = 26;
/** Espacio search → grid (~8–12px). */
const SEARCH_TO_GRID_GAP = 10;

export default function WishlistScreen() {
  const { wishlist, toggleWishlist, isInWishlist, addToCart } = useShop();
  const [toast, setToast] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const { width: screenWidth } = useWindowDimensions();
  const columnWidth = (screenWidth - SCREEN_H_PADDING - COLUMN_GAP) / 2;

  // Preferir datos frescos del catálogo (nombres en español) sobre el snapshot persistido
  const items = useMemo(
    () => wishlist.map((item) => getPlantById(item.id) ?? item),
    [wishlist],
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return items;
    return items.filter(
      (plant) =>
        plant.name.toLowerCase().includes(q) || plant.latinName.toLowerCase().includes(q),
    );
  }, [items, query]);

  const hasFavorites = items.length > 0;
  const hasFilterMiss = hasFavorites && filtered.length === 0 && query.trim().length > 0;

  return (
    <Screen>
      <ScreenHeader title="Favoritos" showBack={false} showNotificationBadge />

      {toast ? (
        <View className="mb-2 rounded-2xl bg-rizoma-brandSoft px-4 py-3">
          <Text className="text-sm text-rizoma-brand" style={{ fontFamily: "Inter_600SemiBold" }}>
            {toast}
          </Text>
        </View>
      ) : null}

      {!hasFavorites ? (
        <EmptyState
          title="Sin favoritos"
          description="Explora el catálogo y guarda las plantas que te enamoren."
          actionLabel="Ir a inicio"
          onActionPress={() => router.push("/(tabs)")}
          icon={<Heart size={24} color={emptyIconTone} />}
        />
      ) : (
        <>
          {hasFilterMiss ? (
            <>
              <View style={{ marginTop: 20, marginBottom: SEARCH_TO_GRID_GAP }}>
                <LeafySearchBar
                  value={query}
                  onChangeText={setQuery}
                  placeholder="Buscar en favoritos..."
                />
              </View>
              <EmptyState
                title="Ninguna favorita con ese nombre"
                description="Prueba otro término o limpia la búsqueda para ver todas tus favoritas."
                actionLabel="Limpiar búsqueda"
                onActionPress={() => setQuery("")}
                icon={<Search size={24} color={emptyIconTone} />}
              />
            </>
          ) : (
            <FlatList
              data={filtered}
              keyExtractor={(item) => item.id}
              numColumns={2}
              style={{ flex: 1 }}
              columnWrapperStyle={{ gap: COLUMN_GAP }}
              contentContainerStyle={{ paddingTop: 0, paddingBottom: 24 }}
              ListHeaderComponentStyle={{ marginBottom: SEARCH_TO_GRID_GAP }}
              ListHeaderComponent={
                <View>
                  <View style={{ marginTop: 20 }}>
                    <LeafySearchBar
                      value={query}
                      onChangeText={setQuery}
                      placeholder="Buscar en favoritos..."
                    />
                  </View>
                  <View className="mt-2">
                    <RizomaButton
                      label="Añadir todos al carrito"
                      onPress={() => {
                        const count = filtered.length;
                        filtered.forEach((plant) => addToCart(plant));
                        setToast(
                          `${count} planta${count === 1 ? "" : "s"} añadida${count === 1 ? "" : "s"} al carrito`,
                        );
                        setTimeout(() => setToast(null), 2500);
                      }}
                    />
                  </View>
                </View>
              }
              showsVerticalScrollIndicator={false}
              keyboardShouldPersistTaps="handled"
              renderItem={({ item }) => (
                <View style={{ width: columnWidth }}>
                  <PlantCard
                    plant={item}
                    variant="wishlist"
                    wishlisted={isInWishlist(item.id)}
                    onToggleWishlist={() => toggleWishlist(item)}
                    onPress={() => router.push(`/plants/${item.id}`)}
                  />
                </View>
              )}
            />
          )}
        </>
      )}
    </Screen>
  );
}
