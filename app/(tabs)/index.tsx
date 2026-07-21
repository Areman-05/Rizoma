import { Link, router } from "expo-router";
import { Image, Pressable, ScrollView, Text, View } from "react-native";
import { plants } from "@/src/data/plants";
import { plantCategories } from "@/src/data/categories";
import { RizomaButton } from "@/src/components/ui/RizomaButton";
import { PressableScale } from "@/src/components/ui/PressableScale";
import { RizomaLogo } from "@/src/components/brand/RizomaLogo";
import { SectionHeader } from "@/src/components/ui/SectionHeader";
import { Screen } from "@/src/components/ui/Screen";
import { brand } from "@/src/brand/rizoma";
import { elevation } from "@/src/theme/tokens";

export default function HomeScreen() {
  const featured = plants.slice(0, 4);
  const hero = plants[0];

  return (
    <Screen scroll>
      <RizomaLogo size="lg" />
      <Text className="mt-2 text-base text-rizoma-secondaryText">{brand.tagline}</Text>

      <View className="mt-6 overflow-hidden rounded-3xl bg-white" style={elevation.soft}>
        <Image source={{ uri: hero.image }} className="h-44 w-full" resizeMode="cover" />
        <View className="p-5">
          <Text className="text-sm font-semibold uppercase tracking-wide text-rizoma-secondaryText">
            Coleccion editorial
          </Text>
          <Text className="mt-1 text-2xl font-semibold text-rizoma-primary">Raices Urbanas</Text>
          <Text className="mt-2 text-rizoma-secondaryText">
            Plantas premium curadas para hogares contemporaneos con alma minimal.
          </Text>
          <View className="mt-4">
            <Link href="/(tabs)/explore" asChild>
              <View>
                <RizomaButton label="Explorar catalogo" />
              </View>
            </Link>
          </View>
        </View>
      </View>

      <View className="mt-8">
        <SectionHeader title="Colecciones" subtitle="Atajos visuales por estilo de vida" />
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {plantCategories.map((category) => (
            <Pressable
              key={category.id}
              onPress={() => router.push("/(tabs)/explore")}
              className="mr-3 w-40 rounded-3xl bg-white p-4"
              style={elevation.soft}
            >
              <Text className="text-base font-semibold text-rizoma-primary">{category.title}</Text>
              <Text className="mt-1 text-sm text-rizoma-secondaryText">{category.subtitle}</Text>
            </Pressable>
          ))}
        </ScrollView>
      </View>

      <View className="mt-8">
        <SectionHeader
          title="Destacadas"
          subtitle="Seleccion de la semana"
          actionLabel="Ver todas"
          onActionPress={() => router.push("/(tabs)/explore")}
        />
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {featured.map((plant) => (
            <Link key={plant.id} href={`/plants/${plant.id}`} asChild>
              <Pressable className="mr-4 w-48 rounded-3xl bg-white p-4" style={elevation.soft}>
                <Image
                  source={{ uri: plant.image }}
                  className="h-28 w-full rounded-2xl"
                  resizeMode="cover"
                  style={{ marginTop: -8 }}
                />
                <Text className="mt-3 text-base font-semibold text-rizoma-primary">{plant.name}</Text>
                <Text className="text-sm text-rizoma-secondaryText">{plant.price.toFixed(2)} EUR</Text>
              </Pressable>
            </Link>
          ))}
        </ScrollView>
      </View>

      <View className="mt-8 flex-row gap-3">
        <Link href="/scan" asChild>
          <PressableScale className="flex-1 rounded-3xl bg-white p-4">
            <Text className="text-center font-semibold text-rizoma-primary">Escanear</Text>
          </PressableScale>
        </Link>
        <Link href="/match" asChild>
          <PressableScale className="flex-1 rounded-3xl bg-white p-4">
            <Text className="text-center font-semibold text-rizoma-primary">Plant Match</Text>
          </PressableScale>
        </Link>
      </View>
    </Screen>
  );
}
