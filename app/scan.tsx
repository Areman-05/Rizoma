import { useState } from "react";
import { ActivityIndicator, Image, Pressable, Text, View } from "react-native";
import { Link } from "expo-router";
import { RizomaButton } from "@/src/components/ui/RizomaButton";
import { Screen } from "@/src/components/ui/Screen";
import { ScreenHeader } from "@/src/components/ui/ScreenHeader";
import { EmptyState, emptyIconTone } from "@/src/components/ui/EmptyState";
import { runPlantScan, ScanMatch } from "@/src/services/scanPlant";
import { colors } from "@/src/theme/tokens";
import { ScanLine } from "lucide-react-native";

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

  const top = matches?.[0];

  return (
    <Screen scroll>
      <ScreenHeader title="Escanear" />
      <Text className="text-sm leading-6 text-rizoma-secondaryText" style={{ fontFamily: "Inter_400Regular" }}>
        Encuadramos la planta y devolvemos top-3 con nivel de confianza. Orientativo, no diagnóstico absoluto.
      </Text>

      <View className="mt-6 overflow-hidden rounded-3xl bg-black">
        <Image
          source={{ uri: "https://images.unsplash.com/photo-1593691509543-c55fb32e5b14?w=1000" }}
          className="h-96 w-full opacity-90"
          resizeMode="cover"
          accessibilityLabel="Vista previa de cámara"
        />
        <View className="absolute inset-0 items-center justify-center">
          <View className="h-56 w-56 border-2 border-white/90" style={{ borderRadius: 8 }} />
          {!top && !scanning ? (
            <Text className="mt-4 text-sm text-white" style={{ fontFamily: "Inter_600SemiBold" }}>
              Encuadra la planta
            </Text>
          ) : null}
        </View>

        {scanning ? (
          <View className="absolute inset-0 items-center justify-center bg-black/45">
            <ActivityIndicator size="large" color={colors.brand} />
            <Text className="mt-3 text-white" style={{ fontFamily: "Inter_600SemiBold" }}>
              Identificando…
            </Text>
          </View>
        ) : null}

        {top && !scanning ? (
          <View className="absolute bottom-4 left-4 right-4 flex-row items-center gap-3 rounded-3xl bg-white p-3">
            <Image source={{ uri: top.plant.image }} className="h-14 w-14 rounded-2xl bg-rizoma-gray" />
            <View className="flex-1">
              <Text className="text-rizoma-black" style={{ fontFamily: "Inter_700Bold" }}>
                {top.plant.name}
              </Text>
              <Text className="text-xs italic text-rizoma-secondaryText">{top.plant.latinName}</Text>
              <Text className="mt-1 text-xs text-rizoma-secondaryText" numberOfLines={2}>
                Confianza {top.level} · {top.reason}
              </Text>
            </View>
          </View>
        ) : null}
      </View>

      <View className="mt-5">
        <RizomaButton label={scanning ? "Escaneando..." : "Identificar planta"} onPress={onScan} />
      </View>

      {matches && matches.length === 0 ? (
        <EmptyState
          title="Sin coincidencias"
          description="Prueba otra toma con más luz o acerca el encuadre."
          actionLabel="Reintentar"
          onActionPress={onScan}
          icon={<ScanLine size={24} color={emptyIconTone} />}
        />
      ) : null}

      {matches && matches.length > 0 ? (
        <View className="mt-5 gap-2">
          {matches.map((match, index) => (
            <Link key={match.plant.id} href={`/plants/${match.plant.id}`} asChild>
              <Pressable
                accessibilityRole="button"
                accessibilityLabel={`Ver ficha de ${match.plant.name}`}
                className="rounded-3xl border border-rizoma-border bg-white px-4 py-3"
              >
                <Text style={{ fontFamily: "Inter_600SemiBold", color: colors.black }}>
                  {index + 1}. {match.plant.name}
                </Text>
                <Text className="text-sm text-rizoma-secondaryText">
                  {Math.round(match.confidence * 100)}% · {match.level}
                </Text>
              </Pressable>
            </Link>
          ))}
        </View>
      ) : null}
    </Screen>
  );
}
