import { useMemo, useState } from "react";
import { FlatList, Pressable, Text, TextInput, View } from "react-native";
import { Link } from "expo-router";
import { searchPlants } from "@/src/data/plants";
import { PlantCard } from "@/src/components/catalog/PlantCard";

export default function SearchScreen() {
  const [query, setQuery] = useState("");
  const results = useMemo(() => searchPlants(query), [query]);

  return (
    <View className="flex-1 bg-rizoma-canvas px-5 pt-14">
      <Text className="text-3xl font-bold text-rizoma-primary">Buscar</Text>
      <Text className="mt-1 text-rizoma-secondaryText">Nombre comun, latin o badge.</Text>

      <TextInput
        value={query}
        onChangeText={setQuery}
        placeholder="Ej. Monstera, pet friendly..."
        placeholderTextColor="#60756A"
        className="mt-4 rounded-3xl border border-rizoma-border bg-white px-4 py-3 text-rizoma-primary"
      />

      <FlatList
        data={results}
        keyExtractor={(item) => item.id}
        className="mt-4"
        renderItem={({ item }) => (
          <Link href={`/plants/${item.id}`} asChild>
            <Pressable>
              <PlantCard plant={item} />
            </Pressable>
          </Link>
        )}
        ListEmptyComponent={
          <Text className="mt-8 text-center text-rizoma-secondaryText">Sin resultados para tu busqueda.</Text>
        }
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}
