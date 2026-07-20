import { useMemo, useState } from "react";
import { FlatList, Pressable, Text, View } from "react-native";
import { Link } from "expo-router";
import { plants } from "@/src/data/plants";
import { PlantCard } from "@/src/components/catalog/PlantCard";
import { PlantLight } from "@/src/types/catalog";

export default function ExploreScreen() {
  const [filter, setFilter] = useState<PlantLight | "all">("all");

  const filteredPlants = useMemo(() => {
    if (filter === "all") return plants;
    return plants.filter((plant) => plant.light === filter);
  }, [filter]);

  return (
    <View className="flex-1 bg-rizoma-canvas px-5 pt-14">
      <Text className="text-3xl font-bold text-rizoma-primary">Catalogo</Text>
      <Text className="mt-1 text-rizoma-secondaryText">Encuentra plantas por luz y estilo de vida.</Text>

      <View className="mb-4 mt-4 flex-row flex-wrap gap-2">
        {(["all", "low", "medium", "high"] as const).map((item) => (
          <Pressable
            key={item}
            onPress={() => setFilter(item)}
            className={`rounded-2xl px-3 py-2 ${filter === item ? "bg-rizoma-primary" : "bg-white"}`}
          >
            <Text className={filter === item ? "text-white" : "text-rizoma-primary"}>{item}</Text>
          </Pressable>
        ))}
      </View>

      <FlatList
        data={filteredPlants}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <Link href={`/plants/${item.id}`} asChild>
            <Pressable>
              <PlantCard plant={item} />
            </Pressable>
          </Link>
        )}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 24 }}
      />
    </View>
  );
}
