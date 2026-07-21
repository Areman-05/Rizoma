import { useState } from "react";
import { Link } from "expo-router";
import { Camera, Sparkles } from "lucide-react-native";
import { Pressable, Text, View } from "react-native";
import { RizomaButton } from "@/src/components/ui/RizomaButton";
import { Screen } from "@/src/components/ui/Screen";
import { runPlantScan, ScanMatch } from "@/src/services/scanPlant";
import { elevation } from "@/src/theme/tokens";

export default function ScanScreen() {
  const [matches, setMatches] = useState<ScanMatch[] | null>(null);
  const [scanning, setScanning] = useState(false);

  const onScan = () => {
    setScanning(true);
    setTimeout(() => {
      setMatches(runPlantScan());
      setScanning(false);
    }, 700);
  };

  return (
    <Screen scroll>
      <Text className="text-3xl font-bold text-rizoma-primary">Escaneo Rizoma</Text>
      <Text className="mt-2 leading-6 text-rizoma-secondaryText">
        Orientativo: devolvemos top-3 coincidencias con nivel de confianza. Verifica siempre antes de decisiones
        criticas.
      </Text>

      <View
        className="mt-8 items-center rounded-3xl border border-dashed border-rizoma-border bg-white px-5 py-10"
        style={elevation.soft}
      >
        <Camera size={36} color="#1E3B2B" />
        <Text className="mt-3 text-rizoma-primary">
          {scanning ? "Analizando hoja y porte..." : "Camara lista para identificar"}
        </Text>
      </View>

      <View className="mt-6">
        <RizomaButton label={scanning ? "Escaneando..." : "Iniciar escaneo"} onPress={onScan} />
      </View>

      {matches ? (
        <View className="mt-6 rounded-3xl bg-white p-5" style={elevation.soft}>
          <View className="mb-3 flex-row items-center gap-2">
            <Sparkles size={16} color="#1E3B2B" />
            <Text className="font-semibold text-rizoma-primary">Top 3 resultados</Text>
          </View>
          {matches.map((match, index) => (
            <Link key={match.plant.id} href={`/plants/${match.plant.id}`} asChild>
              <Pressable className="mb-3 rounded-2xl bg-rizoma-canvas px-3 py-3">
                <Text className="font-semibold text-rizoma-primary">
                  {index + 1}. {match.plant.name}
                </Text>
                <Text className="text-sm text-rizoma-secondaryText">
                  Confianza {match.level} ({Math.round(match.confidence * 100)}%) · {match.reason}
                </Text>
              </Pressable>
            </Link>
          ))}
        </View>
      ) : null}
    </Screen>
  );
}
