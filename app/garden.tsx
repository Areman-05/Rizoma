import { Link, router } from "expo-router";
import { Image, Pressable, Text, View } from "react-native";
import { Screen } from "@/src/components/ui/Screen";
import { ScreenHeader } from "@/src/components/ui/ScreenHeader";
import { EmptyState } from "@/src/components/ui/EmptyState";
import { useGarden } from "@/src/store/GardenContext";
import { elevation } from "@/src/theme/tokens";

export default function GardenScreen() {
  const { garden, markWatered, removeFromGarden } = useGarden();

  return (
    <Screen scroll>
      <ScreenHeader title="Mi Jardin" />
      <Text className="text-rizoma-secondaryText" style={{ fontFamily: "Inter_400Regular" }}>
        Tu coleccion personal y recordatorios suaves de riego.
      </Text>

      {garden.length === 0 ? (
        <EmptyState
          title="Jardin vacio"
          description="Anade plantas desde el detalle para empezar tu coleccion Rizoma."
          actionLabel="Explorar catalogo"
          onActionPress={() => router.push("/(tabs)/explore")}
        />
      ) : (
        <View className="mt-6 gap-3">
          {garden.map((item) => (
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
                  Ultimo riego: {item.wateredAt ? new Date(item.wateredAt).toLocaleDateString() : "—"}
                </Text>
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
                    accessibilityLabel="Quitar del jardin"
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
          ))}
        </View>
      )}
    </Screen>
  );
}
