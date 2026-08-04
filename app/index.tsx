import { Redirect } from "expo-router";
import { View } from "react-native";
import { useAuth } from "@/src/context/AuthContext";
import { resolveAuthGate } from "@/src/navigation/authGate";
import { useOnboarding } from "@/src/store/OnboardingContext";

/** Entrada `/`: redirige según sesión sin montar home primero. */
export default function Index() {
  const { user, isReady } = useAuth();
  const { ready, needsOnboarding } = useOnboarding();

  if (!isReady || !ready) {
    return <View style={{ flex: 1, backgroundColor: "#FFFFFF" }} />;
  }

  const { redirectTo } = resolveAuthGate({
    hydrated: true,
    hasUser: Boolean(user),
    needsOnboarding,
    root: "index",
  });

  return <Redirect href={redirectTo ?? "/(tabs)"} />;
}
