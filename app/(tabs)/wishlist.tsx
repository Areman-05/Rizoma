import { useState } from "react";
import { FlatList, Text, View } from "react-native";
import { router } from "expo-router";
import { Heart } from "lucide-react-native";
import { PlantCard } from "@/src/components/catalog/PlantCard";
import { useShop } from "@/src/store/ShopContext";
import { Screen } from "@/src/components/ui/Screen";
import { ScreenHeader } from "@/src/components/ui/ScreenHeader";
import { EmptyState, emptyIconTone } from "@/src/components/ui/EmptyState";
import { RizomaButton } from "@/src/components/ui/RizomaButton";

export default function WishlistScreen() {
  const { wishlist, toggleWishlist, isInWishlist, addToCart } = useShop();
  const [toast, setToast] = useState<string | null>(null);

  return (
    <Screen>
      <ScreenHeader title="Favoritos" showBack={false} showNotificationBadge />
      <Text className="mb-3 text-sm text-rizoma-secondaryText" style={{ fontFamily: "Inter_400Regular" }}>
        Tus plantas guardadas para después.
      </Text>

      {toast ? (
        <View className="mb-3 rounded-2xl bg-rizoma-brandSoft px-4 py-3">
          <Text className="text-sm text-rizoma-brand" style={{ fontFamily: "Inter_600SemiBold" }}>
            {toast}
          </Text>
        </View>
      ) : null}

      {wishlist.length === 0 ? (
        <EmptyState
          title="Sin favoritos"
          description="Explora el catálogo y guarda las plantas que te enamoren."
          actionLabel="Ir a inicio"
          onActionPress={() => router.push("/(tabs)")}
          icon={<Heart size={24} color={emptyIconTone} />}
        />
      ) : (
        <>
          <View className="mb-3">
            <RizomaButton
              label="Añadir todos al carrito"
              onPress={() => {
                const count = wishlist.length;
                wishlist.forEach((plant) => addToCart(plant));
                setToast(`${count} planta${count === 1 ? "" : "s"} añadida${count === 1 ? "" : "s"} al carrito`);
                setTimeout(() => setToast(null), 2500);
              }}
            />
          </View>
          <FlatList
            data={wishlist}
            keyExtractor={(item) => item.id}
            numColumns={2}
            columnWrapperStyle={{ gap: 12 }}
            showsVerticalScrollIndicator={false}
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
          />
        </>
      )}
    </Screen>
  );
}
