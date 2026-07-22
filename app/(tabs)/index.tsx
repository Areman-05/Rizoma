import { useState } from "react";
import { FlatList, Image, Pressable, Text, View } from "react-native";
import { Link, router } from "expo-router";
import { MapPin } from "lucide-react-native";
import { plants } from "@/src/data/plants";
import { PlantCard } from "@/src/components/catalog/PlantCard";
import { LeafySearchBar } from "@/src/components/ui/LeafySearchBar";
import { FilterChip } from "@/src/components/ui/FilterChip";
import { CircularIconButton } from "@/src/components/ui/CircularIconButton";
import { Bell } from "lucide-react-native";
import { Screen } from "@/src/components/ui/Screen";
import { useShop } from "@/src/store/ShopContext";
import { colors } from "@/src/theme/tokens";

const categories = ["Interior", "Exterior", "Ambas", "Paisaje"] as const;

export default function HomeScreen() {
  const [category, setCategory] = useState<(typeof categories)[number]>("Interior");
  const { toggleWishlist, isInWishlist } = useShop();
  const featured = plants.slice(0, 6);

  return (
    <Screen>
      <View className="mb-4 flex-row items-center justify-between">
        <View className="flex-row items-center gap-3">
          <Image
            source={{ uri: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=120" }}
            className="h-11 w-11 rounded-full"
          />
          <View>
            <Text className="text-base text-rizoma-black" style={{ fontFamily: "Inter_700Bold" }}>
              Hola, plant lover
            </Text>
            <View className="mt-0.5 flex-row items-center gap-1">
              <MapPin size={12} color={colors.grayText} />
              <Text className="text-xs text-rizoma-grayText" style={{ fontFamily: "Inter_400Regular" }}>
                Barcelona, Espana
              </Text>
            </View>
          </View>
        </View>
        <CircularIconButton accessibilityLabel="Notificaciones" onPress={() => router.push("/notifications")}>
          <Bell size={18} color={colors.black} />
        </CircularIconButton>
      </View>

      <LeafySearchBar
        onFocusPress={() => router.push("/search")}
        onScanPress={() => router.push("/scan")}
      />

      <View className="mt-5 flex-row items-center justify-between">
        <Text className="text-xl text-rizoma-black" style={{ fontFamily: "Inter_700Bold" }}>
          Ofertas top
        </Text>
        <Text className="text-xs text-rizoma-secondaryText" style={{ fontFamily: "Inter_500Medium" }}>
          02 : 12 : 00
        </Text>
      </View>

      <View className="mt-3 flex-row items-center overflow-hidden rounded-3xl bg-rizoma-brandSoft p-4">
        <View className="flex-1 pr-3">
          <Text className="text-sm text-rizoma-secondaryText" style={{ fontFamily: "Inter_400Regular" }}>
            Oferta activa hasta
          </Text>
          <Text className="mt-1 text-3xl text-rizoma-black" style={{ fontFamily: "Inter_700Bold" }}>
            60% off
          </Text>
        </View>
        <Image source={{ uri: plants[0].image }} className="h-24 w-24" resizeMode="contain" />
      </View>
      <View className="mt-3 flex-row items-center gap-2">
        <View className="h-2 w-6 rounded-full bg-rizoma-brand" />
        <View className="h-2 w-2 rounded-full bg-rizoma-gray" />
        <View className="h-2 w-2 rounded-full bg-rizoma-gray" />
        <View className="h-2 w-2 rounded-full bg-rizoma-gray" />
      </View>

      <View className="mt-6 flex-row items-center justify-between">
        <Text className="text-xl text-rizoma-black" style={{ fontFamily: "Inter_700Bold" }}>
          Ofertas especiales
        </Text>
        <Pressable onPress={() => router.push("/(tabs)/explore")}>
          <Text className="text-sm text-rizoma-brand" style={{ fontFamily: "Inter_600SemiBold" }}>
            Ver todo
          </Text>
        </Pressable>
      </View>

      <View className="mt-3 flex-row flex-wrap gap-2">
        {categories.map((item) => (
          <FilterChip
            key={item}
            label={item}
            active={category === item}
            variant="dark"
            onPress={() => setCategory(item)}
          />
        ))}
      </View>

      <FlatList
        data={featured}
        keyExtractor={(item) => item.id}
        numColumns={2}
        scrollEnabled={false}
        columnWrapperStyle={{ gap: 12 }}
        contentContainerStyle={{ paddingTop: 12, paddingBottom: 24 }}
        renderItem={({ item }) => (
          <View className="flex-1">
            <Link href={`/plants/${item.id}`} asChild>
              <Pressable>
                <PlantCard
                  plant={item}
                  wishlisted={isInWishlist(item.id)}
                  onToggleWishlist={() => toggleWishlist(item)}
                />
              </Pressable>
            </Link>
          </View>
        )}
      />
    </Screen>
  );
}
