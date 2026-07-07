import { Link } from "expo-router";
import { Image, Pressable, ScrollView, Text, View } from "react-native";
import { plants } from "@/src/data/plants";
import { RizomaButton } from "@/src/components/ui/RizomaButton";

export default function HomeScreen() {
  return (
    <ScrollView className="flex-1 bg-rizoma-canvas" contentContainerClassName="px-5 pb-12 pt-16">
      <Text className="text-4xl font-bold text-rizoma-primary">Rizoma</Text>
      <Text className="mt-2 text-base text-rizoma-secondaryText">
        Plantas premium para hogares urbanos contemporaneos.
      </Text>

      <View className="mt-6 rounded-3xl bg-white p-5">
        <Text className="text-sm font-semibold uppercase tracking-wide text-rizoma-secondaryText">
          Coleccion de verano
        </Text>
        <Text className="mt-1 text-2xl font-semibold text-rizoma-primary">Green Layers</Text>
        <Text className="mt-2 text-rizoma-secondaryText">
          Curacion editorial de plantas para espacios con alma minimal.
        </Text>
        <View className="mt-4">
          <Link href="/explore" asChild>
            <View>
              <RizomaButton label="Explorar catalogo" />
            </View>
          </Link>
        </View>
      </View>

      <Text className="mt-8 text-xl font-semibold text-rizoma-primary">Destacadas</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mt-3">
        {plants.slice(0, 4).map((plant) => (
          <Link key={plant.id} href={`/plants/${plant.id}`} asChild>
            <Pressable className="mr-4 w-48 rounded-3xl bg-white p-4">
              <Image source={{ uri: plant.image }} className="h-28 w-full rounded-2xl" resizeMode="cover" />
              <Text className="mt-3 text-base font-semibold text-rizoma-primary">{plant.name}</Text>
              <Text className="text-sm text-rizoma-secondaryText">{plant.price.toFixed(2)} EUR</Text>
            </Pressable>
          </Link>
        ))}
      </ScrollView>

      <View className="mt-8 flex-row gap-3">
        <Link href="/scan" asChild>
          <Pressable className="flex-1 rounded-3xl bg-white p-4">
            <Text className="text-center font-semibold text-rizoma-primary">Escanear planta</Text>
          </Pressable>
        </Link>
        <Link href="/wishlist" asChild>
          <Pressable className="flex-1 rounded-3xl bg-white p-4">
            <Text className="text-center font-semibold text-rizoma-primary">Favoritos</Text>
          </Pressable>
        </Link>
      </View>
    </ScrollView>
  );
}
