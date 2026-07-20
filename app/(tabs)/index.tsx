import { Link } from "expo-router";
import { Image, Pressable, ScrollView, Text, View } from "react-native";
import { plants } from "@/src/data/plants";
import { RizomaButton } from "@/src/components/ui/RizomaButton";
import { PressableScale } from "@/src/components/ui/PressableScale";
import { RizomaLogo } from "@/src/components/brand/RizomaLogo";
import { brand } from "@/src/brand/rizoma";

export default function HomeScreen() {
  return (
    <ScrollView className="flex-1 bg-rizoma-canvas" contentContainerClassName="px-5 pb-12 pt-14">
      <RizomaLogo size="lg" />
      <Text className="mt-2 text-base text-rizoma-secondaryText">{brand.tagline}</Text>

      <View className="mt-6 rounded-3xl bg-white p-5">
        <Text className="text-sm font-semibold uppercase tracking-wide text-rizoma-secondaryText">
          Coleccion de temporada
        </Text>
        <Text className="mt-1 text-2xl font-semibold text-rizoma-primary">Raices Urbanas</Text>
        <Text className="mt-2 text-rizoma-secondaryText">
          Curacion editorial de plantas premium para hogares contemporaneos.
        </Text>
        <View className="mt-4">
          <Link href="/(tabs)/explore" asChild>
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
          <PressableScale className="flex-1 rounded-3xl bg-white p-4">
            <Text className="text-center font-semibold text-rizoma-primary">Escanear planta</Text>
          </PressableScale>
        </Link>
        <Link href="/search" asChild>
          <PressableScale className="flex-1 rounded-3xl bg-white p-4">
            <Text className="text-center font-semibold text-rizoma-primary">Buscar</Text>
          </PressableScale>
        </Link>
      </View>
    </ScrollView>
  );
}
