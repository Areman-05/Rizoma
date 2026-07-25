import { createContext, ReactNode, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { hasCompletedOnboarding, markOnboardingDone } from "@/src/store/persistence";

interface OnboardingContextValue {
  ready: boolean;
  needsOnboarding: boolean;
  completeOnboarding: () => Promise<void>;
}

const OnboardingContext = createContext<OnboardingContextValue | null>(null);

export function OnboardingProvider({ children }: { children: ReactNode }) {
  const [ready, setReady] = useState(false);
  const [needsOnboarding, setNeedsOnboarding] = useState(true);

  useEffect(() => {
    hasCompletedOnboarding()
      .then((done) => setNeedsOnboarding(!done))
      .finally(() => setReady(true));
  }, []);

  const completeOnboarding = useCallback(async () => {
    await markOnboardingDone();
    setNeedsOnboarding(false);
  }, []);

  const value = useMemo(
    () => ({ ready, needsOnboarding, completeOnboarding }),
    [ready, needsOnboarding, completeOnboarding],
  );

  return <OnboardingContext.Provider value={value}>{children}</OnboardingContext.Provider>;
}

export function useOnboarding() {
  const context = useContext(OnboardingContext);
  if (!context) {
    throw new Error("useOnboarding must be used within OnboardingProvider");
  }
  return context;
}
