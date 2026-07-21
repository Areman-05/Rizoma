import { Link } from "expo-router";
import { Pressable, Text, View } from "react-native";
import { Screen } from "@/src/components/ui/Screen";
import { EmptyState } from "@/src/components/ui/EmptyState";
import { useGarden } from "@/src/store/GardenContext";
import { elevation } from "@/src/theme/tokens";

export default function GardenScreen() {
  const { garden, markWatered, removeFromGarden } = useGarden();

  return (
    <Screen scroll>
      <Text className="text-3xl font-bold text-rizoma-primary">Mi Jardin</Text>
      <Text className="mt-2 text-rizoma-secondaryText">
        Tu coleccion personal y recordatorios suaves de riego.
      </Text>

      {garden.length === 0 ? (
        <EmptyState
          title="Jardin vacio"
          description="Anade plantas desde el detalle o compra para empezar tu coleccion Rizoma."
          actionLabel="Explorar catalogo"
          onActionPress={() => {}}
        />
      ) : (
        <View className="mt-6 gap-3">
          {garden.map((item) => (
            <View key={item.plant.id} className="rounded-3xl bg-white p-4" style={elevation.soft}>
              <Text className="text-lg font-semibold text-rizoma-primary">
                {item.nickname ?? item.plant.name}
              </Text>
              <Text className="text-sm text-rizoma-secondaryText">{item.plant.latinName}</Text>
              <Text className="mt-2 text-sm text-rizoma-secondaryText">
                Ultimo riego: {item.wateredAt ? new Date(item.wateredAt).toLocaleDateString() : "—"}
              </Text>
              <View className="mt-3 flex-row gap-3">
                <Pressable
                  onPress={() => markWatered(item.plant.id)}
                  className="rounded-2xl bg-rizoma-primary px-3 py-2"
                >
                  <Text className="text-sm font-semibold text-white">Regada</Text>
                </Pressable>
                <Pressable onPress={() => removeFromGarden(item.plant.id)} className="rounded-2xl bg-rizoma-canvas px-3 py-2">
                  <Text className="text-sm text-rizoma-primary">Quitar</Text>
                </Pressable>
                <Link href={`/plants/${item.plant.id}`} asChild>
                  <Pressable className="rounded-2xl bg-rizoma-canvas px-3 py-2">
                    <Text className="text-sm text-rizoma-primary">Ver ficha</Text>
                  </Pressable>
                </Link>
              </View>
            </View>
          ))}
        </View>
      )}
    </Screen>
  );
}
