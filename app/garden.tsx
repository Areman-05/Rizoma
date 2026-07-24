import { Link, router } from "expo-router";
import { Image, Pressable, Text, View } from "react-native";
import { Screen } from "@/src/components/ui/Screen";
import { ScreenHeader } from "@/src/components/ui/ScreenHeader";
import { EmptyState } from "@/src/components/ui/EmptyState";
import { SkeletonCard } from "@/src/components/ui/SkeletonCard";
import { useGarden } from "@/src/store/GardenContext";
import { elevation } from "@/src/theme/tokens";

function daysSince(iso?: string) {
  if (!iso) return 99;
  const diff = Date.now() - new Date(iso).getTime();
  return Math.floor(diff / (1000 * 60 * 60 * 24));
}

function wateringCopy(days: number) {
  if (days <= 0) return "Regada hoy";
  if (days === 1) return "Riego en breve · hace 1 día";
  if (days < 5) return `Próximo riego · hace ${days} días`;
  return `Necesita riego · hace ${days} días`;
}

function wateringProgress(days: number) {
  return Math.max(0.15, Math.min(1, 1 - days / 7));
}

export default function GardenScreen() {
  const { garden, markWatered, removeFromGarden, hydrated } = useGarden();

  return (
    <Screen scroll>
      <ScreenHeader title="Mi Jardín" />
      <Text className="text-rizoma-secondaryText" style={{ fontFamily: "Inter_400Regular" }}>
        Tu colección personal y recordatorios suaves de riego.
      </Text>

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
        <View className="mt-6 gap-3">
          {garden.map((item) => {
            const days = daysSince(item.wateredAt);
            const progress = wateringProgress(days);
            return (
              <View key={item.plant.id} className="flex-row gap-3 rounded-3xl bg-white p-4" style={elevation.soft}>
                <Image source={{ uri: item.plant.image }} className="h-16 w-16 rounded-2xl bg-rizoma-gray" />
                <View className="flex-1">
                  <Text className="text-lg text-rizoma-black" style={{ fontFamily: "Inter_700Bold" }}>
                    {item.nickname ?? item.plant.name}
                  </Text>
                  <Text className="text-sm text-rizoma-secondaryText" style={{ fontFamily: "Inter_400Regular" }}>
                    {item.plant.latinName}
                  </Text>
                  <Text className="mt-2 text-sm text-rizoma-secondaryText" style={{ fontFamily: "Inter_400Regular" }}>
                    {wateringCopy(days)}
                  </Text>
                  <View className="mt-2 h-2 overflow-hidden rounded-full bg-rizoma-gray">
                    <View className="h-full rounded-full bg-rizoma-brand" style={{ width: `${progress * 100}%` }} />
                  </View>
                  <View className="mt-3 flex-row gap-3">
                    <Pressable
                      accessibilityLabel="Marcar como regada"
                      onPress={() => markWatered(item.plant.id)}
                      className="rounded-2xl bg-rizoma-brand px-3 py-2"
                    >
                      <Text className="text-sm text-white" style={{ fontFamily: "Inter_600SemiBold" }}>
                        Regada
                      </Text>
                    </Pressable>
                    <Pressable
                      accessibilityLabel="Quitar del jardín"
                      onPress={() => removeFromGarden(item.plant.id)}
                      className="rounded-2xl bg-rizoma-gray px-3 py-2"
                    >
                      <Text className="text-sm text-rizoma-black" style={{ fontFamily: "Inter_500Medium" }}>
                        Quitar
                      </Text>
                    </Pressable>
                    <Link href={`/plants/${item.plant.id}`} asChild>
                      <Pressable className="rounded-2xl bg-rizoma-gray px-3 py-2">
                        <Text className="text-sm text-rizoma-black" style={{ fontFamily: "Inter_500Medium" }}>
                          Ver ficha
                        </Text>
                      </Pressable>
                    </Link>
                  </View>
                </View>
              </View>
            );
          })}
        </View>
      )}
    </Screen>
  );
}
