import { router } from "expo-router";
import { useState } from "react";
import { Pressable, Text, View } from "react-native";
import { RizomaLogo } from "@/src/components/brand/RizomaLogo";
import { RizomaButton } from "@/src/components/ui/RizomaButton";
import { Screen } from "@/src/components/ui/Screen";
import { markOnboardingDone } from "@/src/store/persistence";

const slides = [
  {
    title: "Bienvenido a Rizoma",
    body: "Un boutique digital de plantas premium pensado para hogares urbanos.",
  },
  {
    title: "Cuidado con criterio",
    body: "Luz, riego y pet-friendly claros en cada ficha para comprar con confianza.",
  },
  {
    title: "Escanea y descubre",
    body: "Identifica especies y encuentra alternativas similares en el catálogo.",
  },
];

export default function OnboardingScreen() {
  const [index, setIndex] = useState(0);
  const slide = slides[index];
  const isLast = index === slides.length - 1;

  const finish = async () => {
    await markOnboardingDone();
    router.replace("/(tabs)");
  };

  return (
    <Screen>
      <View className="flex-1 justify-between pb-4 pt-6">
        <View className="flex-row items-center justify-between">
          <RizomaLogo size="lg" />
          <Pressable onPress={finish} accessibilityRole="button" accessibilityLabel="Saltar onboarding">
            <Text className="text-sm text-rizoma-brand" style={{ fontFamily: "Inter_600SemiBold" }}>
              Saltar
            </Text>
          </Pressable>
        </View>

        <View className="rounded-3xl bg-rizoma-gray p-6">
          <Text className="text-3xl text-rizoma-black" style={{ fontFamily: "Inter_700Bold" }}>
            {slide.title}
          </Text>
          <Text className="mt-3 text-base leading-6 text-rizoma-secondaryText" style={{ fontFamily: "Inter_400Regular" }}>
            {slide.body}
          </Text>
        </View>

        <View>
          <View className="mb-6 flex-row items-center justify-center gap-2">
            {slides.map((item, dotIndex) => (
              <View
                key={item.title}
                className={`h-2 rounded-full ${dotIndex === index ? "w-6 bg-rizoma-brand" : "w-2 bg-rizoma-border"}`}
              />
            ))}
          </View>
          <RizomaButton
            label={isLast ? "Entrar en Rizoma" : "Siguiente"}
            onPress={async () => {
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
