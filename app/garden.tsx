import { Link, router } from "expo-router";
import { Alert, Image, Pressable, Text, View } from "react-native";
import { Droplets, Leaf, Trash2 } from "lucide-react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Screen } from "@/src/components/ui/Screen";
import { ScreenHeader } from "@/src/components/ui/ScreenHeader";
import { EmptyState } from "@/src/components/ui/EmptyState";
import { SkeletonCard } from "@/src/components/ui/SkeletonCard";
import { useGarden } from "@/src/store/GardenContext";
import { colors } from "@/src/theme/tokens";
import { wateringIntervalDays, wateringLabel } from "@/src/utils/plantLabels";

function daysSince(iso?: string) {
  if (!iso) return 99;
  const diff = Date.now() - new Date(iso).getTime();
  return Math.floor(diff / (1000 * 60 * 60 * 24));
}

function wateringCopy(days: number, intervalDays: number) {
  if (days <= 0) return "Regada hoy";
  if (days >= intervalDays) return `Necesita riego · hace ${days} días`;
  const remaining = intervalDays - days;
  if (remaining === 1) return "Próximo riego mañana";
  return `Próximo riego en ~${remaining} días`;
}

function wateringProgress(days: number, intervalDays: number) {
  return Math.max(0.12, Math.min(1, 1 - days / intervalDays));
}

export default function GardenScreen() {
  const { garden, markWatered, removeFromGarden, hydrated } = useGarden();

  const needsWaterCount = garden.filter((item) => {
    const days = daysSince(item.wateredAt);
    const interval = wateringIntervalDays(item.plant.watering);
    return days >= interval;
  }).length;

  const confirmRemove = (plantId: string, name: string) => {
    Alert.alert("Quitar del jardín", `¿Quieres quitar «${name}» de Mi Jardín?`, [
      { text: "Cancelar", style: "cancel" },
      { text: "Quitar", style: "destructive", onPress: () => removeFromGarden(plantId) },
    ]);
  };

  return (
    <Screen scroll>
      <ScreenHeader title="Mi Jardín" />

      <View className="overflow-hidden rounded-3xl">
        <LinearGradient
          colors={[colors.brandSoft, colors.mintWash, colors.white]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={{ paddingHorizontal: 18, paddingVertical: 18 }}
        >
          <View className="flex-row items-center gap-2">
            <View className="h-9 w-9 items-center justify-center rounded-full bg-white">
              <Leaf size={18} color={colors.brand} fill={colors.brand} />
            </View>
            <Text className="flex-1 text-base text-rizoma-wordmark" style={{ fontFamily: "Inter_700Bold", color: colors.wordmark }}>
              Tu colección viva
            </Text>
          </View>
          <Text className="mt-2 text-sm leading-5 text-rizoma-secondaryText" style={{ fontFamily: "Inter_400Regular" }}>
            Cuida el riego en el dispositivo y vuelve cuando tus plantas lo pidan.
          </Text>
          {hydrated && garden.length > 0 ? (
            <View className="mt-4 flex-row gap-2">
              <View className="flex-1 rounded-2xl bg-white/90 px-3 py-2.5">
                <Text className="text-[11px] text-rizoma-secondaryText" style={{ fontFamily: "Inter_500Medium" }}>
                  Plantas
                </Text>
                <Text className="mt-0.5 text-lg text-rizoma-black" style={{ fontFamily: "Inter_700Bold" }}>
                  {garden.length}
                </Text>
              </View>
              <View className="flex-1 rounded-2xl bg-white/90 px-3 py-2.5">
                <Text className="text-[11px] text-rizoma-secondaryText" style={{ fontFamily: "Inter_500Medium" }}>
                  Por regar
                </Text>
                <Text
                  className="mt-0.5 text-lg"
                  style={{
                    fontFamily: "Inter_700Bold",
                    color: needsWaterCount > 0 ? colors.brand : colors.black,
                  }}
                >
                  {needsWaterCount}
                </Text>
              </View>
            </View>
          ) : null}
        </LinearGradient>
      </View>

      {!hydrated ? (
        <View className="mt-6" accessibilityLabel="Cargando jardín">
          <SkeletonCard />
          <SkeletonCard />
        </View>
      ) : garden.length === 0 ? (
        <EmptyState
          title="Jardín vacío"
          description="Añade plantas desde el detalle para empezar tu colección Rizoma."
          actionLabel="Explorar catálogo"
          onActionPress={() => router.push("/(tabs)/explore")}
        />
      ) : (
        <View className="mt-5 gap-3.5">
          {garden.map((item) => {
            const days = daysSince(item.wateredAt);
            const interval = wateringIntervalDays(item.plant.watering);
            const progress = wateringProgress(days, interval);
            const needsWater = days >= interval;
            const displayName = item.nickname ?? item.plant.name;
            return (
              <View
                key={item.plant.id}
                className="overflow-hidden rounded-3xl border border-rizoma-border bg-white"
              >
                <View className="flex-row gap-3 p-3.5">
                  <Pressable
                    onPress={() => router.push(`/plants/${item.plant.id}`)}
                    accessibilityLabel={`Ver ficha de ${displayName}`}
                  >
                    <Image
                      source={{ uri: item.plant.image }}
                      className="h-[88px] w-[88px] rounded-2xl bg-rizoma-gray"
                      resizeMode="cover"
                    />
                  </Pressable>

                  <View className="min-w-0 flex-1">
                    <View className="flex-row items-start justify-between gap-2">
                      <View className="min-w-0 flex-1">
                        <Text
                          className="text-base text-rizoma-black"
                          style={{ fontFamily: "Inter_700Bold" }}
                          numberOfLines={2}
                        >
                          {displayName}
                        </Text>
                        <Text
                          className="mt-0.5 text-xs italic text-rizoma-secondaryText"
                          style={{ fontFamily: "Inter_400Regular" }}
                          numberOfLines={1}
                        >
                          {item.plant.latinName}
                        </Text>
                      </View>
                      <View
                        className={`rounded-full px-2.5 py-1 ${
                          needsWater ? "bg-rizoma-brandSoft" : "bg-rizoma-gray"
                        }`}
                      >
                        <Text
                          className={`text-[10px] ${needsWater ? "text-rizoma-brand" : "text-rizoma-secondaryText"}`}
                          style={{ fontFamily: "Inter_600SemiBold" }}
                        >
                          {needsWater ? "Regar" : "OK"}
                        </Text>
                      </View>
                    </View>

                    <Text className="mt-2 text-xs text-rizoma-brand" style={{ fontFamily: "Inter_500Medium" }}>
                      {wateringLabel(item.plant.watering)}
                    </Text>
                    <Text className="mt-1 text-sm text-rizoma-secondaryText" style={{ fontFamily: "Inter_400Regular" }}>
                      {wateringCopy(days, interval)}
                    </Text>

                    <View className="mt-2.5 h-1.5 overflow-hidden rounded-full bg-rizoma-gray">
                      <View
                        className="h-full rounded-full bg-rizoma-brand"
                        style={{ width: `${progress * 100}%` }}
                      />
                    </View>
                  </View>
                </View>

                <View className="flex-row border-t border-rizoma-border">
                  <Pressable
                    accessibilityLabel="Marcar como regada"
                    onPress={() => markWatered(item.plant.id)}
                    className="flex-1 flex-row items-center justify-center gap-1.5 py-3"
                    style={({ pressed }) => ({ opacity: pressed ? 0.75 : 1 })}
                  >
                    <Droplets size={15} color={colors.brand} />
                    <Text className="text-sm text-rizoma-brand" style={{ fontFamily: "Inter_600SemiBold" }}>
                      Regada
                    </Text>
                  </Pressable>
                  <View className="w-px bg-rizoma-border" />
                  <Link href={`/plants/${item.plant.id}`} asChild>
                    <Pressable
                      className="flex-1 items-center justify-center py-3"
                      style={({ pressed }) => ({ opacity: pressed ? 0.75 : 1 })}
                    >
                      <Text className="text-sm text-rizoma-black" style={{ fontFamily: "Inter_500Medium" }}>
                        Ver ficha
                      </Text>
                    </Pressable>
                  </Link>
                  <View className="w-px bg-rizoma-border" />
                  <Pressable
                    accessibilityLabel="Quitar del jardín"
                    onPress={() => confirmRemove(item.plant.id, displayName)}
                    className="flex-1 flex-row items-center justify-center gap-1.5 py-3"
                    style={({ pressed }) => ({ opacity: pressed ? 0.75 : 1 })}
                  >
                    <Trash2 size={14} color={colors.red} />
                    <Text className="text-sm text-rizoma-red" style={{ fontFamily: "Inter_500Medium" }}>
                      Quitar
                    </Text>
                  </Pressable>
                </View>
              </View>
            );
          })}
        </View>
      )}
    </Screen>
  );
}
