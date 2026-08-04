import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  hasCompletedOnboarding,
  markOnboardingDone,
} from "@/src/store/persistence";

jest.mock("@react-native-async-storage/async-storage", () => {
  let store: Record<string, string> = {};
  return {
    __esModule: true,
    default: {
      getItem: jest.fn(async (key: string) => store[key] ?? null),
      setItem: jest.fn(async (key: string, value: string) => {
        store[key] = value;
      }),
      removeItem: jest.fn(async (key: string) => {
        delete store[key];
      }),
      clear: jest.fn(async () => {
        store = {};
      }),
    },
  };
});

describe("onboarding persistence", () => {
  beforeEach(async () => {
    await AsyncStorage.clear();
    jest.clearAllMocks();
  });

  it("es pendiente por defecto y se marca por usuario", async () => {
    await expect(hasCompletedOnboarding("user-a")).resolves.toBe(false);
    await markOnboardingDone("user-a");
    await expect(hasCompletedOnboarding("user-a")).resolves.toBe(true);
    await expect(hasCompletedOnboarding("user-b")).resolves.toBe(false);
  });
});
