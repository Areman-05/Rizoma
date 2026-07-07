import { Link, useLocalSearchParams } from "expo-router";
import { Image, Pressable, ScrollView, Text, View } from "react-native";
import { plants } from "@/src/data/plants";
import { PlantIndicators } from "@/src/components/catalog/PlantIndicators";
import { RizomaButton } from "@/src/components/ui/RizomaButton";

export default function PlantDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const plant = plants.find((item) => item.id === id);

  if (!plant) {
    return (
      <View className="flex-1 items-center justify-center bg-rizoma-canvas">
        <Text className="text-rizoma-primary">Planta no encontrada.</Text>
      </View>
    );
  }

  return (
    <ScrollView className="flex-1 bg-rizoma-canvas" contentContainerClassName="px-5 pb-10 pt-14">
      <Image source={{ uri: plant.image }} className="h-72 w-full rounded-3xl bg-white" resizeMode="cover" />
      <Text className="mt-4 text-3xl font-bold text-rizoma-primary">{plant.name}</Text>
      <Text className="text-base italic text-rizoma-secondaryText">{plant.latinName}</Text>
      <Text className="mt-3 text-2xl font-semibold text-rizoma-primary">{plant.price.toFixed(2)} EUR</Text>
      <PlantIndicators light={plant.light} watering={plant.watering} petFriendly={plant.petFriendly} />

      <View className="mt-6 rounded-3xl bg-white p-5">
        <Text className="text-lg font-semibold text-rizoma-primary">Descripcion</Text>
        <Text className="mt-2 leading-6 text-rizoma-secondaryText">{plant.description}</Text>
      </View>

      <View className="mt-5 gap-3">
        <RizomaButton label="Anadir al carrito" />
        <Link href="/explore" asChild>
          <Pressable className="rounded-3xl border border-rizoma-border px-5 py-4">
            <Text className="text-center font-medium text-rizoma-primary">Volver al catalogo</Text>
          </Pressable>
        </Link>
      </View>
    </ScrollView>
  );
}
