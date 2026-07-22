import { FlatList, Pressable, Text, View } from "react-native";
import { Link, router } from "expo-router";
import { PlantCard } from "@/src/components/catalog/PlantCard";
import { useShop } from "@/src/store/ShopContext";
import { Screen } from "@/src/components/ui/Screen";
import { ScreenHeader } from "@/src/components/ui/ScreenHeader";
import { EmptyState } from "@/src/components/ui/EmptyState";

export default function WishlistScreen() {
  const { wishlist, toggleWishlist, isInWishlist } = useShop();

  return (
    <Screen>
      <ScreenHeader title="Wishlist" showBack={false} />
      <Text className="mb-3 text-sm text-rizoma-secondaryText" style={{ fontFamily: "Inter_400Regular" }}>
        Tus plantas guardadas para despues.
      </Text>

      {wishlist.length === 0 ? (
        <EmptyState
          title="Wishlist vacia"
          description="Explora el catalogo y guarda las plantas que te enamoren."
          actionLabel="Ir a inicio"
          onActionPress={() => router.push("/(tabs)")}
        />
      ) : (
        <FlatList
          data={wishlist}
          keyExtractor={(item) => item.id}
          numColumns={2}
          columnWrapperStyle={{ gap: 12 }}
          showsVerticalScrollIndicator={false}
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
        />
      )}
    </Screen>
  );
}
