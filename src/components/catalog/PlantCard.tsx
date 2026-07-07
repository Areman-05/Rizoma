import { Image, Pressable, Text, View } from "react-native";
import { Plant } from "@/src/types/catalog";
import { PlantIndicators } from "./PlantIndicators";

interface PlantCardProps {
  plant: Plant;
  onPress?: () => void;
}

export function PlantCard({ plant, onPress }: PlantCardProps) {
  return (
    <Pressable onPress={onPress} className="mb-4 rounded-3xl bg-white p-4">
      <View className="items-center">
        <Image source={{ uri: plant.image }} className="h-36 w-36" resizeMode="contain" />
      </View>
      <Text className="mt-2 text-lg font-semibold text-rizoma-primary">{plant.name}</Text>
      <Text className="text-sm text-rizoma-secondaryText">{plant.latinName}</Text>
      <Text className="mt-2 text-base font-semibold text-rizoma-primary">{plant.price.toFixed(2)} EUR</Text>
      <PlantIndicators light={plant.light} watering={plant.watering} petFriendly={plant.petFriendly} />
    </Pressable>
  );
}
