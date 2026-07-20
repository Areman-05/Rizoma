import { Image, Pressable, Text, View } from "react-native";
import { Plant } from "@/src/types/catalog";
import { PlantIndicators } from "./PlantIndicators";

interface PlantCardProps {
  plant: Plant;
  onPress?: () => void;
}

export function PlantCard({ plant, onPress }: PlantCardProps) {
  return (
    <Pressable
      onPress={onPress}
      className="mb-5 overflow-visible rounded-3xl bg-white px-4 pb-4 pt-2"
      style={{
        shadowColor: "#1E3B2B",
        shadowOpacity: 0.08,
        shadowRadius: 16,
        shadowOffset: { width: 0, height: 8 },
        elevation: 4,
      }}
    >
      {plant.badge ? (
        <View className="absolute right-3 top-3 z-10 rounded-2xl bg-rizoma-accent/30 px-2 py-1">
          <Text className="text-xs font-semibold text-rizoma-primary">{plant.badge}</Text>
        </View>
      ) : null}

      <View className="items-center" style={{ marginTop: -18 }}>
        <Image
          source={{ uri: plant.image }}
          className="h-40 w-40"
          resizeMode="contain"
          style={{
            shadowColor: "#000",
            shadowOpacity: 0.18,
            shadowRadius: 10,
            shadowOffset: { width: 0, height: 6 },
          }}
        />
      </View>

      <Text className="mt-1 text-lg font-semibold text-rizoma-primary">{plant.name}</Text>
      <Text className="text-sm text-rizoma-secondaryText">{plant.latinName}</Text>
      <Text className="mt-2 text-base font-semibold text-rizoma-primary">{plant.price.toFixed(2)} EUR</Text>
      <PlantIndicators light={plant.light} watering={plant.watering} petFriendly={plant.petFriendly} />
    </Pressable>
  );
}
