import { Droplets, Sun, PawPrint } from "lucide-react-native";
import { Text, View } from "react-native";

interface PlantIndicatorsProps {
  light: string;
  watering: string;
  petFriendly: boolean;
}

export function PlantIndicators({ light, watering, petFriendly }: PlantIndicatorsProps) {
  return (
    <View className="mt-2 flex-row gap-3">
      <View className="flex-row items-center gap-1 rounded-2xl bg-rizoma-canvas px-2 py-1">
        <Sun size={14} color="#1E3B2B" />
        <Text className="text-xs text-rizoma-primary">{light}</Text>
      </View>
      <View className="flex-row items-center gap-1 rounded-2xl bg-rizoma-canvas px-2 py-1">
        <Droplets size={14} color="#1E3B2B" />
        <Text className="text-xs text-rizoma-primary">{watering}</Text>
      </View>
      <View className="flex-row items-center gap-1 rounded-2xl bg-rizoma-canvas px-2 py-1">
        <PawPrint size={14} color="#1E3B2B" />
        <Text className="text-xs text-rizoma-primary">{petFriendly ? "Pet-safe" : "No pets"}</Text>
      </View>
    </View>
  );
}
