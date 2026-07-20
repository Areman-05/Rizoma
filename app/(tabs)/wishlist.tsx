import { FlatList, Pressable, Text, View } from "react-native";
import { Link } from "expo-router";
import { PlantCard } from "@/src/components/catalog/PlantCard";
import { useShop } from "@/src/store/ShopContext";

export default function WishlistScreen() {
  const { wishlist } = useShop();

  return (
    <View className="flex-1 bg-rizoma-canvas px-5 pt-14">
      <Text className="text-3xl font-bold text-rizoma-primary">Favoritos</Text>
      <Text className="mt-1 text-rizoma-secondaryText">Tus plantas guardadas para despues.</Text>

      {wishlist.length === 0 ? (
        <View className="mt-10 rounded-3xl bg-white p-6">
          <Text className="text-center text-rizoma-secondaryText">
            Aun no tienes favoritos. Explora el catalogo y guarda las que te enamoren.
          </Text>
          <Link href="/(tabs)/explore" asChild>
            <Pressable className="mt-4 rounded-3xl bg-rizoma-primary px-5 py-4">
              <Text className="text-center font-semibold text-white">Ir a explorar</Text>
            </Pressable>
          </Link>
        </View>
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
    </View>
  );
}
