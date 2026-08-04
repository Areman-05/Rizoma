import { router } from "expo-router";
import { useEffect, useRef, useState } from "react";
import { Animated, Pressable, Text, View } from "react-native";
import { Leaf, ScanLine, Sun } from "lucide-react-native";
import { RizomaLogo } from "@/src/components/brand/RizomaLogo";
import { RizomaButton } from "@/src/components/ui/RizomaButton";
import { Screen } from "@/src/components/ui/Screen";
import { useAuth } from "@/src/context/AuthContext";
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

const SLIDE_FADE_MS = 280;

export default function OnboardingScreen() {
  const [index, setIndex] = useState(0);
  const [busy, setBusy] = useState(false);
  const { completeOnboarding } = useOnboarding();
  const { user } = useAuth();
  const slide = slides[index];
  const isLast = index === slides.length - 1;
  const Icon = slide.Icon;

  const contentOpacity = useRef(new Animated.Value(1)).current;
  const contentTranslate = useRef(new Animated.Value(0)).current;

  const animateToIndex = (next: number) => {
    Animated.parallel([
      Animated.timing(contentOpacity, {
        toValue: 0,
        duration: SLIDE_FADE_MS,
        useNativeDriver: true,
      }),
      Animated.timing(contentTranslate, {
        toValue: -8,
        duration: SLIDE_FADE_MS,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setIndex(next);
      contentTranslate.setValue(10);
      Animated.parallel([
        Animated.timing(contentOpacity, {
          toValue: 1,
          duration: SLIDE_FADE_MS,
          useNativeDriver: true,
        }),
        Animated.timing(contentTranslate, {
          toValue: 0,
          duration: SLIDE_FADE_MS,
          useNativeDriver: true,
        }),
      ]).start();
    });
  };

  useEffect(() => {
    contentOpacity.setValue(0);
    contentTranslate.setValue(12);
    Animated.parallel([
      Animated.timing(contentOpacity, {
        toValue: 1,
        duration: 360,
        useNativeDriver: true,
      }),
      Animated.timing(contentTranslate, {
        toValue: 0,
        duration: 360,
        useNativeDriver: true,
      }),
    ]).start();
  }, [contentOpacity, contentTranslate]);

  const finish = async () => {
    if (busy) return;
    setBusy(true);
    try {
      await completeOnboarding();
      // Sin sesión → login; con sesión (p. ej. guía desde perfil) → tabs.
      router.replace(user ? "/(tabs)" : "/login");
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
            style={({ pressed }) => ({ opacity: pressed || busy ? 0.6 : 1 })}
          >
            <Text className="text-sm text-rizoma-brand" style={{ fontFamily: "Inter_600SemiBold" }}>
              {busy ? "Saliendo..." : "Saltar"}
            </Text>
          </Pressable>
        </View>

        <Animated.View
          className="items-center rounded-3xl bg-rizoma-brandSoft px-6 py-8"
          style={{
            opacity: contentOpacity,
            transform: [{ translateY: contentTranslate }],
          }}
        >
          <View className="mb-6 h-24 w-24 items-center justify-center rounded-full bg-white">
            <Icon size={40} color={colors.brand} />
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
        </Animated.View>

        <View>
          <View className="mb-6 flex-row items-center justify-center gap-2">
            {slides.map((item, dotIndex) => (
              <View
                key={item.title}
                className={`h-2 rounded-full ${
                  dotIndex === index ? "w-6 bg-rizoma-brand" : "w-2 bg-rizoma-gray"
                }`}
              />
            ))}
          </View>
          <RizomaButton
            label={
              busy
                ? "Continuando..."
                : isLast
                  ? user
                    ? "Entrar en Rizoma"
                    : "Crear cuenta o entrar"
                  : "Siguiente"
            }
            onPress={async () => {
              if (busy) return;
              if (!isLast) {
                animateToIndex(index + 1);
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
