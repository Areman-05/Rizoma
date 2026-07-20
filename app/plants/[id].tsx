import { Link, useLocalSearchParams } from "expo-router";
import { Image, Pressable, ScrollView, Text, View } from "react-native";
import { Heart } from "lucide-react-native";
import { getPlantById } from "@/src/data/plants";
import { PlantIndicators } from "@/src/components/catalog/PlantIndicators";
import { RizomaButton } from "@/src/components/ui/RizomaButton";
import { useShop } from "@/src/store/ShopContext";

export default function PlantDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const plant = getPlantById(id);
  const { addToCart, toggleWishlist, isInWishlist } = useShop();

  if (!plant) {
    return (
      <View className="flex-1 items-center justify-center bg-rizoma-canvas">
        <Text className="text-rizoma-primary">Planta no encontrada.</Text>
      </View>
    );
  }

  const saved = isInWishlist(plant.id);

  return (
    <ScrollView className="flex-1 bg-rizoma-canvas" contentContainerClassName="px-5 pb-10 pt-14">
      <View className="overflow-visible rounded-3xl bg-white px-4 pb-2 pt-2">
        <Image
          source={{ uri: plant.image }}
          className="h-72 w-full"
          resizeMode="contain"
          style={{ marginTop: -12 }}
        />
      </View>

      <View className="mt-4 flex-row items-start justify-between">
        <View className="flex-1 pr-3">
          <Text className="text-3xl font-bold text-rizoma-primary">{plant.name}</Text>
          <Text className="text-base italic text-rizoma-secondaryText">{plant.latinName}</Text>
        </View>
        <Pressable
          onPress={() => toggleWishlist(plant)}
          className="rounded-full bg-white p-3"
          accessibilityLabel="Toggle wishlist"
        >
          <Heart size={22} color="#1E3B2B" fill={saved ? "#1E3B2B" : "transparent"} />
        </Pressable>
      </View>

      <Text className="mt-3 text-2xl font-semibold text-rizoma-primary">{plant.price.toFixed(2)} EUR</Text>
      <PlantIndicators light={plant.light} watering={plant.watering} petFriendly={plant.petFriendly} />

      <View className="mt-6 rounded-3xl bg-white p-5">
        <Text className="text-lg font-semibold text-rizoma-primary">Descripcion</Text>
        <Text className="mt-2 leading-6 text-rizoma-secondaryText">{plant.description}</Text>
      </View>

      <View className="mt-5 gap-3">
        <RizomaButton label="Anadir al carrito" onPress={() => addToCart(plant)} />
        <Link href="/(tabs)/explore" asChild>
          <Pressable className="rounded-3xl border border-rizoma-border px-5 py-4">
            <Text className="text-center font-medium text-rizoma-primary">Volver al catalogo</Text>
          </Pressable>
        </Link>
      </View>
    </ScrollView>
  );
}
