import { Camera, Sparkles } from "lucide-react-native";
import { Text, View } from "react-native";
import { RizomaButton } from "@/src/components/ui/RizomaButton";

export default function ScanScreen() {
  return (
    <View className="flex-1 bg-rizoma-canvas px-5 pt-14">
      <Text className="text-3xl font-bold text-rizoma-primary">Escaneo de planta</Text>
      <Text className="mt-2 leading-6 text-rizoma-secondaryText">
        Captura hoja, planta completa y detalle para obtener 3 posibles coincidencias con nivel de confianza.
      </Text>

      <View className="mt-8 items-center rounded-3xl border border-dashed border-rizoma-border bg-white px-5 py-10">
        <Camera size={36} color="#1E3B2B" />
        <Text className="mt-3 text-rizoma-primary">Camara lista para identificar</Text>
      </View>

      <View className="mt-6 rounded-3xl bg-white p-5">
        <View className="flex-row items-center gap-2">
          <Sparkles size={16} color="#1E3B2B" />
          <Text className="font-semibold text-rizoma-primary">Resultado demo</Text>
        </View>
        <Text className="mt-2 text-rizoma-secondaryText">1. Monstera deliciosa - confianza alta</Text>
        <Text className="text-rizoma-secondaryText">2. Rhaphidophora tetrasperma - confianza media</Text>
        <Text className="text-rizoma-secondaryText">3. Philodendron selloum - confianza media</Text>
      </View>

      <View className="mt-6">
        <RizomaButton label="Iniciar escaneo" />
      </View>
    </View>
  );
}
