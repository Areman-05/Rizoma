import { Droplets, Sun, PawPrint } from "lucide-react-native";
import { Text, View } from "react-native";
import { colors } from "@/src/theme/tokens";
import { lightLabel, wateringLabel } from "@/src/utils/plantLabels";

interface PlantIndicatorsProps {
  light: string;
  watering: string;
  petFriendly: boolean;
}

export function PlantIndicators({ light, watering, petFriendly }: PlantIndicatorsProps) {
  return (
    <View className="mt-3 flex-row flex-wrap gap-2">
      <View className="flex-row items-center gap-1 rounded-full bg-rizoma-gray px-3 py-1.5">
        <Sun size={14} color={colors.brand} />
        <Text className="text-xs text-rizoma-black" style={{ fontFamily: "Inter_500Medium" }}>
          {lightLabel(light)}
        </Text>
      </View>
      <View className="flex-row items-center gap-1 rounded-full bg-rizoma-gray px-3 py-1.5">
        <Droplets size={14} color={colors.brand} />
        <Text className="text-xs text-rizoma-black" style={{ fontFamily: "Inter_500Medium" }}>
          {wateringLabel(watering)}
        </Text>
      </View>
      <View className="flex-row items-center gap-1 rounded-full bg-rizoma-gray px-3 py-1.5">
        <PawPrint size={14} color={colors.brand} />
        <Text className="text-xs text-rizoma-black" style={{ fontFamily: "Inter_500Medium" }}>
          {petFriendly ? "Segura mascotas" : "No apta mascotas"}
        </Text>
      </View>
    </View>
  );
}
