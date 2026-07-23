import { useMemo, useState } from "react";
import { Link } from "expo-router";
import { Image, Pressable, Text, View } from "react-native";
import { Screen } from "@/src/components/ui/Screen";
import { ScreenHeader } from "@/src/components/ui/ScreenHeader";
import { FilterChip } from "@/src/components/ui/FilterChip";
import { HomeProfile, rankPlantMatches } from "@/src/services/plantMatch";
import { elevation } from "@/src/theme/tokens";
import { experienceLabel, lightLabel } from "@/src/utils/plantLabels";

export default function MatchScreen() {
  const [profile, setProfile] = useState<HomeProfile>({
    light: "medium",
    hasPets: true,
    experience: "beginner",
  });

  const matches = useMemo(() => rankPlantMatches(profile), [profile]);

  return (
    <Screen scroll>
      <ScreenHeader title="Plant Match" />
      <Text className="text-rizoma-secondaryText" style={{ fontFamily: "Inter_400Regular" }}>
        Cuanto encaja cada planta con tu casa y habitos.
      </Text>

      <Text className="mb-2 mt-6 text-rizoma-black" style={{ fontFamily: "Inter_700Bold" }}>
        Luz en casa
      </Text>
      <View className="flex-row flex-wrap gap-2">
        {(["low", "medium", "high"] as const).map((light) => (
          <FilterChip
            key={light}
            label={lightLabel(light)}
            active={profile.light === light}
            onPress={() => setProfile((prev) => ({ ...prev, light }))}
          />
        ))}
      </View>

      <Text className="mb-2 mt-5 text-rizoma-black" style={{ fontFamily: "Inter_700Bold" }}>
        Mascotas
      </Text>
      <View className="flex-row flex-wrap gap-2">
        <FilterChip
          label="Si"
          active={profile.hasPets}
          onPress={() => setProfile((prev) => ({ ...prev, hasPets: true }))}
        />
        <FilterChip
          label="No"
          active={!profile.hasPets}
          onPress={() => setProfile((prev) => ({ ...prev, hasPets: false }))}
        />
      </View>

      <Text className="mb-2 mt-5 text-rizoma-black" style={{ fontFamily: "Inter_700Bold" }}>
        Experiencia
      </Text>
      <View className="flex-row flex-wrap gap-2">
        {(["beginner", "intermediate", "advanced"] as const).map((experience) => (
          <FilterChip
            key={experience}
            label={experienceLabel(experience)}
            active={profile.experience === experience}
            onPress={() => setProfile((prev) => ({ ...prev, experience }))}
          />
        ))}
      </View>

      <View className="mt-8 gap-3">
        {matches.map((match) => (
          <Link key={match.plant.id} href={`/plants/${match.plant.id}`} asChild>
            <Pressable className="flex-row gap-3 rounded-3xl bg-white p-4" style={elevation.soft}>
              <Image source={{ uri: match.plant.image }} className="h-16 w-16 rounded-2xl bg-rizoma-gray" />
              <View className="flex-1">
                <View className="flex-row items-center justify-between">
                  <Text className="flex-1 pr-3 text-lg text-rizoma-black" style={{ fontFamily: "Inter_700Bold" }}>
                    {match.plant.name}
                  </Text>
                  <Text className="text-rizoma-brand" style={{ fontFamily: "Inter_700Bold" }}>
                    {match.score}%
                  </Text>
                </View>
                <Text className="mt-2 text-sm text-rizoma-secondaryText" style={{ fontFamily: "Inter_400Regular" }}>
                  {match.reasons.join(" · ")}
                </Text>
              </View>
            </Pressable>
          </Link>
        ))}
      </View>
    </Screen>
  );
}
