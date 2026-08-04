import { createContext, ReactNode, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { useAuth } from "@/src/context/AuthContext";
import {
  hasCompletedOnboarding,
  markOnboardingDone,
  withStorageTimeout,
} from "@/src/store/persistence";

interface OnboardingContextValue {
  ready: boolean;
  needsOnboarding: boolean;
  completeOnboarding: () => Promise<void>;
}

const OnboardingContext = createContext<OnboardingContextValue | null>(null);

export function OnboardingProvider({ children }: { children: ReactNode }) {
  const { user, isReady: authReady } = useAuth();
  const [ready, setReady] = useState(false);
  const [needsOnboarding, setNeedsOnboarding] = useState(false);

  useEffect(() => {
    if (!authReady) return;

    let cancelled = false;

    if (!user) {
      setNeedsOnboarding(false);
      setReady(true);
      return;
    }

    setReady(false);
    withStorageTimeout(hasCompletedOnboarding(user.id), false)
      .then((done) => {
        if (cancelled) return;
        setNeedsOnboarding(!done);
        setReady(true);
      })
      .catch(() => {
        if (cancelled) return;
        setNeedsOnboarding(true);
        setReady(true);
      });

    return () => {
      cancelled = true;
    };
  }, [user, authReady]);

  const completeOnboarding = useCallback(async () => {
    if (user) {
      await markOnboardingDone(user.id);
    }
    setNeedsOnboarding(false);
  }, [user]);

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
