import { router } from "expo-router";
import { useState } from "react";
import { Pressable, Text, View } from "react-native";
import { Leaf, ScanLine, Sun } from "lucide-react-native";
import { RizomaLogo } from "@/src/components/brand/RizomaLogo";
import { RizomaButton } from "@/src/components/ui/RizomaButton";
import { Screen } from "@/src/components/ui/Screen";
import { useOnboarding } from "@/src/store/OnboardingContext";
import { colors } from "@/src/theme/tokens";

const slides = [
  {
    title: "Bienvenido a Rizoma",
    body: "Un boutique digital de plantas premium pensado para hogares urbanos.",
    Icon: Leaf,
  },
  {
    title: "Cuidado con criterio",
    body: "Luz, riego y pet-friendly claros en cada ficha para comprar con confianza.",
    Icon: Sun,
  },
  {
    title: "Escanea y descubre",
    body: "Identifica especies y encuentra alternativas similares en el catálogo.",
    Icon: ScanLine,
  },
];

export default function OnboardingScreen() {
  const [index, setIndex] = useState(0);
  const [busy, setBusy] = useState(false);
  const { completeOnboarding } = useOnboarding();
  const slide = slides[index];
  const isLast = index === slides.length - 1;
  const Icon = slide.Icon;

  const finish = async () => {
    if (busy) return;
    setBusy(true);
    try {
      await completeOnboarding();
      router.replace("/(tabs)");
    } finally {
      setBusy(false);
    }
  };

  return (
    <Screen>
      <View className="flex-1 justify-between pb-4 pt-6">
        <View className="flex-row items-center justify-between">
          <RizomaLogo size="lg" />
          <Pressable
            onPress={finish}
            disabled={busy}
            accessibilityRole="button"
            accessibilityLabel="Saltar onboarding"
          >
            <Text className="text-sm text-rizoma-brand" style={{ fontFamily: "Inter_600SemiBold" }}>
              {busy ? "Entrando..." : "Saltar"}
            </Text>
          </Pressable>
        </View>

        <View className="items-center rounded-3xl bg-rizoma-gray p-6">
          <View className="mb-5 h-20 w-20 items-center justify-center rounded-full bg-white">
            <Icon size={36} color={colors.brand} />
          </View>
          <Text className="text-center text-3xl text-rizoma-black" style={{ fontFamily: "Inter_700Bold" }}>
            {slide.title}
          </Text>
          <Text
            className="mt-3 text-center text-base leading-6 text-rizoma-secondaryText"
            style={{ fontFamily: "Inter_400Regular" }}
          >
            {slide.body}
          </Text>
        </View>

        <View>
          <View className="mb-6 flex-row items-center justify-center gap-2">
            {slides.map((item, dotIndex) => (
              <View
                key={item.title}
                className={`h-2 rounded-full ${dotIndex === index ? "w-6 bg-rizoma-brand" : "w-2 bg-rizoma-gray"}`}
              />
            ))}
          </View>
          <RizomaButton
            label={busy ? "Entrando..." : isLast ? "Entrar en Rizoma" : "Siguiente"}
            onPress={async () => {
              if (busy) return;
              if (!isLast) {
                setIndex((prev) => prev + 1);
                return;
              }
              await finish();
            }}
          />
        </View>
      </View>
    </Screen>
  );
}
