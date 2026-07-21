import { useMemo, useState } from "react";
import { Link } from "expo-router";
import { Pressable, Text, View } from "react-native";
import { Screen } from "@/src/components/ui/Screen";
import { FilterChip } from "@/src/components/ui/FilterChip";
import { HomeProfile, rankPlantMatches } from "@/src/services/plantMatch";
import { elevation } from "@/src/theme/tokens";

export default function MatchScreen() {
  const [profile, setProfile] = useState<HomeProfile>({
    light: "medium",
    hasPets: true,
    experience: "beginner",
  });

  const matches = useMemo(() => rankPlantMatches(profile), [profile]);

  return (
    <Screen scroll>
      <Text className="text-3xl font-bold text-rizoma-primary">Plant Match</Text>
      <Text className="mt-2 text-rizoma-secondaryText">
        Cuanto encaja cada planta con tu casa y habitos.
      </Text>

      <Text className="mb-2 mt-6 font-semibold text-rizoma-primary">Luz en casa</Text>
      <View className="flex-row flex-wrap gap-2">
        {(["low", "medium", "high"] as const).map((light) => (
          <FilterChip
            key={light}
            label={light}
            active={profile.light === light}
            onPress={() => setProfile((prev) => ({ ...prev, light }))}
          />
        ))}
      </View>

      <Text className="mb-2 mt-5 font-semibold text-rizoma-primary">Mascotas</Text>
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

      <Text className="mb-2 mt-5 font-semibold text-rizoma-primary">Experiencia</Text>
      <View className="flex-row flex-wrap gap-2">
        {(["beginner", "intermediate", "advanced"] as const).map((experience) => (
          <FilterChip
            key={experience}
            label={experience}
            active={profile.experience === experience}
            onPress={() => setProfile((prev) => ({ ...prev, experience }))}
          />
        ))}
      </View>

      <View className="mt-8 gap-3">
        {matches.map((match) => (
          <Link key={match.plant.id} href={`/plants/${match.plant.id}`} asChild>
            <Pressable className="rounded-3xl bg-white p-4" style={elevation.soft}>
              <View className="flex-row items-center justify-between">
                <Text className="flex-1 pr-3 text-lg font-semibold text-rizoma-primary">{match.plant.name}</Text>
                <Text className="font-bold text-rizoma-primary">{match.score}%</Text>
              </View>
              <Text className="mt-2 text-sm text-rizoma-secondaryText">{match.reasons.join(" · ")}</Text>
            </Pressable>
          </Link>
        ))}
      </View>
    </Screen>
  );
}
