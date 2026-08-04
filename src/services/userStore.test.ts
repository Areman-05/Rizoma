import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  isStrongPassword,
  login,
  register,
  UserStoreError,
} from "@/src/services/userStore";

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

jest.mock("expo-crypto", () => ({
  CryptoDigestAlgorithm: { SHA256: "SHA-256" },
  digestStringAsync: jest.fn(async (_algo: string, data: string) => `hash:${data}`),
  getRandomBytesAsync: jest.fn(async (size: number) =>
    Uint8Array.from({ length: size }, (_, i) => i + 1),
  ),
}));

const STRONG = "Secreto1!";

describe("userStore", () => {
  beforeEach(async () => {
    await AsyncStorage.clear();
    jest.clearAllMocks();
  });

  it("validates password strength rules", () => {
    expect(isStrongPassword("corta")).toBe(false);
    expect(isStrongPassword("solominus1")).toBe(false);
    expect(isStrongPassword("SOLOMAYUS1")).toBe(false);
    expect(isStrongPassword("SinNumero!")).toBe(false);
    expect(isStrongPassword("SinSimbolo1")).toBe(false);
    expect(isStrongPassword(STRONG)).toBe(true);
  });

  it("registers and logs in with email/password", async () => {
    const created = await register({
      name: "Ana",
      email: "Ana@Example.com",
      password: STRONG,
      confirmPassword: STRONG,
    });

    expect(created).toMatchObject({
      email: "ana@example.com",
      name: "Ana",
      provider: "email",
    });

    const session = await login("ana@example.com", STRONG);
    expect(session.id).toBe(created.id);
    expect(session.name).toBe("Ana");
  });

  it("rejects weak passwords on register", async () => {
    await expect(
      register({
        name: "Ana",
        email: "ana@example.com",
        password: "secreto",
        confirmPassword: "secreto",
      }),
    ).rejects.toBeInstanceOf(UserStoreError);
  });

  it("rejects duplicate email", async () => {
    await register({
      name: "Ana",
      email: "ana@example.com",
      password: STRONG,
      confirmPassword: STRONG,
    });

    await expect(
      register({
        name: "Otra",
        email: "ana@example.com",
        password: "Otra123!",
        confirmPassword: "Otra123!",
      }),
    ).rejects.toBeInstanceOf(UserStoreError);
  });

  it("rejects wrong password", async () => {
    await register({
      name: "Ana",
      email: "ana@example.com",
      password: STRONG,
      confirmPassword: STRONG,
    });

    await expect(login("ana@example.com", "mal")).rejects.toBeInstanceOf(UserStoreError);
  });
});
