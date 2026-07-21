import { FlatList, Pressable, Text } from "react-native";
import { Link, router } from "expo-router";
import { PlantCard } from "@/src/components/catalog/PlantCard";
import { useShop } from "@/src/store/ShopContext";
import { Screen } from "@/src/components/ui/Screen";
import { EmptyState } from "@/src/components/ui/EmptyState";

export default function WishlistScreen() {
  const { wishlist } = useShop();

  return (
    <Screen>
      <Text className="text-3xl font-bold text-rizoma-primary">Favoritos</Text>
      <Text className="mt-1 text-rizoma-secondaryText">Tus plantas guardadas para despues.</Text>

      {wishlist.length === 0 ? (
        <EmptyState
          title="Sin favoritos"
          description="Explora el catalogo y guarda las plantas que te enamoren."
          actionLabel="Ir a explorar"
          onActionPress={() => router.push("/(tabs)/explore")}
        />
      ) : (
        <FlatList
          data={wishlist}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <Link href={`/plants/${item.id}`} asChild>
              <Pressable>
                <PlantCard plant={item} />
              </Pressable>
            </Link>
          )}
          showsVerticalScrollIndicator={false}
          className="mt-4"
        />
      )}
    </Screen>
  );
}
