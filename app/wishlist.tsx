import { FlatList, Text, View } from "react-native";
import { initialWishlist } from "@/src/store/shop";
import { PlantCard } from "@/src/components/catalog/PlantCard";

export default function WishlistScreen() {
  return (
    <View className="flex-1 bg-rizoma-canvas px-5 pt-14">
      <Text className="text-3xl font-bold text-rizoma-primary">Favoritos</Text>
      <Text className="mt-1 text-rizoma-secondaryText">Tus plantas guardadas para despues.</Text>
      <FlatList
        data={initialWishlist}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <PlantCard plant={item} />}
        showsVerticalScrollIndicator={false}
        className="mt-4"
      />
    </View>
  );
}
