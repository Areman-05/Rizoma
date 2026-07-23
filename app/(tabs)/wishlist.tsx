import { FlatList, Pressable, Text, View } from "react-native";
import { Link, router } from "expo-router";
import { PlantCard } from "@/src/components/catalog/PlantCard";
import { useShop } from "@/src/store/ShopContext";
import { Screen } from "@/src/components/ui/Screen";
import { ScreenHeader } from "@/src/components/ui/ScreenHeader";
import { EmptyState } from "@/src/components/ui/EmptyState";
import { RizomaButton } from "@/src/components/ui/RizomaButton";

export default function WishlistScreen() {
  const { wishlist, toggleWishlist, isInWishlist, addToCart } = useShop();

  return (
    <Screen>
      <ScreenHeader title="Favoritos" showBack={false} />
      <Text className="mb-3 text-sm text-rizoma-secondaryText" style={{ fontFamily: "Inter_400Regular" }}>
        Tus plantas guardadas para despues.
      </Text>

      {wishlist.length === 0 ? (
        <EmptyState
          title="Sin favoritos"
          description="Explora el catalogo y guarda las plantas que te enamoren."
          actionLabel="Ir a inicio"
          onActionPress={() => router.push("/(tabs)")}
        />
      ) : (
        <>
          <View className="mb-3">
            <RizomaButton
              label="Anadir todos al carrito"
              onPress={() => wishlist.forEach((plant) => addToCart(plant))}
            />
          </View>
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
        </>
      )}
    </Screen>
  );
}
