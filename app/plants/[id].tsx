import { Link, useLocalSearchParams } from "expo-router";
import { Image, Pressable, ScrollView, Text, View } from "react-native";
import { Heart } from "lucide-react-native";
import { getPlantById } from "@/src/data/plants";
import { PlantIndicators } from "@/src/components/catalog/PlantIndicators";
import { RizomaButton } from "@/src/components/ui/RizomaButton";
import { SectionHeader } from "@/src/components/ui/SectionHeader";
import { useShop } from "@/src/store/ShopContext";
import { useGarden } from "@/src/store/GardenContext";
import { getRelatedPlants } from "@/src/utils/relatedPlants";
import { elevation } from "@/src/theme/tokens";
import { SafeAreaView } from "react-native-safe-area-context";

export default function PlantDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const plant = getPlantById(id);
  const { addToCart, toggleWishlist, isInWishlist } = useShop();
  const { addToGarden } = useGarden();

  if (!plant) {
    return (
      <View className="flex-1 items-center justify-center bg-rizoma-canvas">
        <Text className="text-rizoma-primary">Planta no encontrada.</Text>
      </View>
    );
  }

  const saved = isInWishlist(plant.id);
  const related = getRelatedPlants(plant);

  return (
    <SafeAreaView className="flex-1 bg-rizoma-canvas" edges={["top", "left", "right"]}>
      <ScrollView className="flex-1" contentContainerClassName="px-5 pb-28 pt-2" showsVerticalScrollIndicator={false}>
        <View className="overflow-visible rounded-3xl bg-white px-4 pb-2 pt-2" style={elevation.soft}>
          <Image
            source={{ uri: plant.image }}
            className="h-72 w-full"
            resizeMode="contain"
            style={{ marginTop: -18, ...elevation.pop }}
          />
        </View>

        <View className="mt-4 flex-row items-start justify-between">
          <View className="flex-1 pr-3">
            {plant.badge ? (
              <Text className="mb-1 text-xs font-semibold uppercase tracking-wide text-rizoma-secondaryText">
                {plant.badge}
              </Text>
            ) : null}
            <Text className="text-3xl font-bold text-rizoma-primary">{plant.name}</Text>
            <Text className="text-base italic text-rizoma-secondaryText">{plant.latinName}</Text>
          </View>
          <Pressable
            onPress={() => toggleWishlist(plant)}
            className="rounded-full bg-white p-3"
            accessibilityLabel="Toggle wishlist"
            style={elevation.soft}
          >
            <Heart size={22} color="#1E3B2B" fill={saved ? "#1E3B2B" : "transparent"} />
          </Pressable>
        </View>

        <Text className="mt-3 text-2xl font-semibold text-rizoma-primary">{plant.price.toFixed(2)} EUR</Text>
        <PlantIndicators light={plant.light} watering={plant.watering} petFriendly={plant.petFriendly} />

        <View className="mt-6 rounded-3xl bg-white p-5" style={elevation.soft}>
          <Text className="text-lg font-semibold text-rizoma-primary">Descripcion</Text>
          <Text className="mt-2 leading-6 text-rizoma-secondaryText">{plant.description}</Text>
          <Text className="mt-3 text-sm text-rizoma-secondaryText">Dificultad: {plant.difficulty}</Text>
        </View>

        <View className="mt-8">
          <SectionHeader title="Tambien te pueden gustar" subtitle="Afinidad por luz y estilo de vida" />
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {related.map((item) => (
              <Link key={item.id} href={`/plants/${item.id}`} asChild>
                <Pressable className="mr-3 w-40 rounded-3xl bg-white p-3" style={elevation.soft}>
                  <Image source={{ uri: item.image }} className="h-24 w-full rounded-2xl" resizeMode="cover" />
                  <Text className="mt-2 font-semibold text-rizoma-primary">{item.name}</Text>
                  <Text className="text-sm text-rizoma-secondaryText">{item.price.toFixed(2)} EUR</Text>
                </Pressable>
              </Link>
            ))}
          </ScrollView>
        </View>
      </ScrollView>

      <View className="absolute bottom-0 left-0 right-0 gap-2 border-t border-rizoma-border bg-rizoma-canvas px-5 pb-6 pt-3">
        <RizomaButton label="Anadir al carrito" onPress={() => addToCart(plant)} />
        <Pressable
          onPress={() => addToGarden(plant)}
          className="rounded-3xl border border-rizoma-border px-5 py-3"
        >
          <Text className="text-center font-medium text-rizoma-primary">Guardar en Mi Jardin</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}
