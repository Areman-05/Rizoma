import { router } from "expo-router";
import { useEffect, useRef, useState } from "react";
import { Animated, Pressable, Text, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { RizomaLogo } from "@/src/components/brand/RizomaLogo";
import { OnboardingArt } from "@/src/components/onboarding/OnboardingArt";
import { RizomaButton } from "@/src/components/ui/RizomaButton";
import { Screen } from "@/src/components/ui/Screen";
import { onboardingSlides } from "@/src/data/onboarding";
import { useOnboarding } from "@/src/store/OnboardingContext";
import { colors } from "@/src/theme/tokens";

const SLIDE_FADE_MS = 280;

export default function OnboardingScreen() {
  const [index, setIndex] = useState(0);
  const [busy, setBusy] = useState(false);
  const { completeOnboarding } = useOnboarding();
  const slide = onboardingSlides[index];
  const isLast = index === onboardingSlides.length - 1;

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
        toValue: -10,
        duration: SLIDE_FADE_MS,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setIndex(next);
      contentTranslate.setValue(12);
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
    contentTranslate.setValue(14);
    Animated.parallel([
      Animated.timing(contentOpacity, {
        toValue: 1,
        duration: 380,
        useNativeDriver: true,
      }),
      Animated.timing(contentTranslate, {
        toValue: 0,
        duration: 380,
        useNativeDriver: true,
      }),
    ]).start();
  }, [contentOpacity, contentTranslate]);

  const finish = async () => {
    if (busy) return;
    setBusy(true);
    try {
      await completeOnboarding();
      router.replace("/(tabs)/explore");
    } finally {
      setBusy(false);
    }
  };

  return (
    <Screen padded={false} backgroundColor={colors.white}>
      <LinearGradient
        colors={[colors.brandSoft, colors.mintMid, colors.white]}
        locations={[0, 0.35, 1]}
        style={{ flex: 1 }}
      >
        <View className="flex-1 justify-between px-[13px] pb-5 pt-3">
          <View className="flex-row items-center justify-between pt-1">
            <RizomaLogo size="md" />
            <Pressable
              onPress={finish}
              disabled={busy}
              accessibilityRole="button"
              accessibilityLabel="Saltar onboarding"
              hitSlop={8}
              style={({ pressed }) => ({ opacity: pressed || busy ? 0.55 : 1 })}
            >
              <Text className="text-sm text-rizoma-brand" style={{ fontFamily: "Inter_600SemiBold" }}>
                {busy ? "Saliendo…" : "Saltar"}
              </Text>
            </Pressable>
          </View>

          <Animated.View
            style={{
              opacity: contentOpacity,
              transform: [{ translateY: contentTranslate }],
              flex: 1,
              justifyContent: "center",
              paddingVertical: 12,
            }}
          >
            <OnboardingArt id={slide.id} />

            <Text
              className="mt-7 text-center text-[28px] leading-9 text-rizoma-wordmark"
              style={{ fontFamily: "Inter_700Bold", color: colors.wordmark }}
            >
              {slide.title}
            </Text>
            <Text
              className="mt-3 text-center text-[16px] leading-6 text-rizoma-secondaryText"
              style={{ fontFamily: "Inter_400Regular" }}
            >
              {slide.body}
            </Text>
            <View className="mt-4 self-center rounded-full bg-white/80 px-3.5 py-2">
              <Text
                className="text-center text-[12px] text-rizoma-leafDeep"
                style={{ fontFamily: "Inter_500Medium", color: colors.leafDeep }}
              >
                {slide.detail}
              </Text>
            </View>
          </Animated.View>

          <View>
            <View className="mb-5 flex-row items-center justify-center gap-2">
              {onboardingSlides.map((item, dotIndex) => (
                <View
                  key={item.id}
                  className={`h-2 rounded-full ${
                    dotIndex === index ? "w-7 bg-rizoma-brand" : "w-2 bg-rizoma-border"
                  }`}
                />
              ))}
            </View>
            <RizomaButton
              label={
                busy
                  ? "Continuando…"
                  : isLast
                    ? "Explorar plantas"
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
      </LinearGradient>
    </Screen>
  );
}
