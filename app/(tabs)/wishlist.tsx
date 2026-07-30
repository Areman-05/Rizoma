import { useState } from "react";
import { FlatList, Text, useWindowDimensions, View } from "react-native";
import { router } from "expo-router";
import { Heart } from "lucide-react-native";
import { PlantCard } from "@/src/components/catalog/PlantCard";
import { useShop } from "@/src/store/ShopContext";
import { Screen } from "@/src/components/ui/Screen";
import { ScreenHeader } from "@/src/components/ui/ScreenHeader";
import { EmptyState, emptyIconTone } from "@/src/components/ui/EmptyState";
import { RizomaButton } from "@/src/components/ui/RizomaButton";
import { getPlantById } from "@/src/data/plants";

const COLUMN_GAP = 16;
/** Coincide con `px-[13px]` de Screen (ambos lados). */
const SCREEN_H_PADDING = 26;

export default function WishlistScreen() {
  const { wishlist, toggleWishlist, isInWishlist, addToCart } = useShop();
  const [toast, setToast] = useState<string | null>(null);
  const { width: screenWidth } = useWindowDimensions();
  const columnWidth = (screenWidth - SCREEN_H_PADDING - COLUMN_GAP) / 2;

  // Preferir datos frescos del catálogo (nombres en español) sobre el snapshot persistido
  const items = wishlist.map((item) => getPlantById(item.id) ?? item);

  return (
    <Screen>
      <ScreenHeader title="Favoritos" showBack={false} showNotificationBadge />

      {toast ? (
        <View className="mb-3 rounded-2xl bg-rizoma-brandSoft px-4 py-3">
          <Text className="text-sm text-rizoma-brand" style={{ fontFamily: "Inter_600SemiBold" }}>
            {toast}
          </Text>
        </View>
      ) : null}

      {items.length === 0 ? (
        <EmptyState
          title="Sin favoritos"
          description="Explora el catálogo y guarda las plantas que te enamoren."
          actionLabel="Ir a inicio"
          onActionPress={() => router.push("/(tabs)")}
          icon={<Heart size={24} color={emptyIconTone} />}
        />
      ) : (
        <>
          <View className="mb-4">
            <RizomaButton
              label="Añadir todos al carrito"
              onPress={() => {
                const count = items.length;
                items.forEach((plant) => addToCart(plant));
                setToast(`${count} planta${count === 1 ? "" : "s"} añadida${count === 1 ? "" : "s"} al carrito`);
                setTimeout(() => setToast(null), 2500);
              }}
            />
          </View>
          <FlatList
            data={items}
            keyExtractor={(item) => item.id}
            numColumns={2}
            columnWrapperStyle={{ gap: COLUMN_GAP }}
            contentContainerStyle={{ gap: 4, paddingBottom: 24 }}
            showsVerticalScrollIndicator={false}
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
        </>
      )}
    </Screen>
  );
}
