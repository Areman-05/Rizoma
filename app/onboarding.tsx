import { router } from "expo-router";
import { Text, View } from "react-native";
import { RizomaLogo } from "@/src/components/brand/RizomaLogo";
import { RizomaButton } from "@/src/components/ui/RizomaButton";
import { brand } from "@/src/brand/rizoma";

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
    body: "Identifica especies y encuentra alternativas similares en el catalogo.",
  },
];

export default function OnboardingScreen() {
  return (
    <View className="flex-1 justify-between bg-rizoma-canvas px-6 pb-12 pt-16">
      <View>
        <RizomaLogo size="lg" />
        <Text className="mt-3 text-rizoma-secondaryText">{brand.description}</Text>
      </View>

      <View className="gap-4">
        {slides.map((slide) => (
          <View key={slide.title} className="rounded-3xl bg-white p-5">
            <Text className="text-xl font-semibold text-rizoma-primary">{slide.title}</Text>
            <Text className="mt-2 leading-6 text-rizoma-secondaryText">{slide.body}</Text>
          </View>
        ))}
      </View>

      <RizomaButton label="Entrar en Rizoma" onPress={() => router.replace("/(tabs)")} />
    </View>
  );
}
