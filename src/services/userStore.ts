import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Crypto from "expo-crypto";
import type { AuthUser } from "@/src/context/AuthContext";

const USERS_KEY = "@rizoma/users";
const MIN_PASSWORD_LENGTH = 6;

export type StoredUser = {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  salt: string;
  createdAt: string;
};

export class UserStoreError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "UserStoreError";
  }
}

function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

function isValidEmail(email: string): boolean {
  // Validación sencilla para demo local (no RFC completo).
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

async function hashPassword(password: string, salt: string): Promise<string> {
  return Crypto.digestStringAsync(
    Crypto.CryptoDigestAlgorithm.SHA256,
    `${salt}:${password}`,
  );
}

async function createSalt(): Promise<string> {
  const bytes = await Crypto.getRandomBytesAsync(16);
  return Array.from(bytes, (b) => b.toString(16).padStart(2, "0")).join("");
}

async function readUsers(): Promise<StoredUser[]> {
  try {
    const raw = await AsyncStorage.getItem(USERS_KEY);
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(isStoredUser);
  } catch {
    return [];
  }
}

function isStoredUser(value: unknown): value is StoredUser {
  if (!value || typeof value !== "object") return false;
  const u = value as Record<string, unknown>;
  return (
    typeof u.id === "string" &&
    typeof u.name === "string" &&
    typeof u.email === "string" &&
    typeof u.passwordHash === "string" &&
    typeof u.salt === "string" &&
    typeof u.createdAt === "string"
  );
}

async function writeUsers(users: StoredUser[]): Promise<void> {
  await AsyncStorage.setItem(USERS_KEY, JSON.stringify(users));
}

function toAuthUser(user: StoredUser): AuthUser {
  return {
    id: user.id,
    email: user.email,
    name: user.name,
    provider: "email",
  };
}

export type RegisterInput = {
  name: string;
  email: string;
  password: string;
  confirmPassword?: string;
};

export async function register(input: RegisterInput): Promise<AuthUser> {
  const name = input.name.trim();
  const email = normalizeEmail(input.email);
  const password = input.password;
  const confirm = input.confirmPassword;

  if (!name) {
    throw new UserStoreError("Introduce tu nombre.");
  }
  if (!isValidEmail(email)) {
    throw new UserStoreError("Introduce un correo electrónico válido.");
  }
  if (password.length < MIN_PASSWORD_LENGTH) {
    throw new UserStoreError(
      `La contraseña debe tener al menos ${MIN_PASSWORD_LENGTH} caracteres.`,
    );
  }
  if (confirm !== undefined && password !== confirm) {
    throw new UserStoreError("Las contraseñas no coinciden.");
  }

  const users = await readUsers();
  if (users.some((u) => u.email === email)) {
    throw new UserStoreError("Ya existe una cuenta con ese correo.");
  }

  const salt = await createSalt();
  const passwordHash = await hashPassword(password, salt);
  const stored: StoredUser = {
    id: `email:${email}`,
    name,
    email,
    passwordHash,
    salt,
    createdAt: new Date().toISOString(),
  };

  users.push(stored);
  await writeUsers(users);
  return toAuthUser(stored);
}

export async function login(emailRaw: string, password: string): Promise<AuthUser> {
  const email = normalizeEmail(emailRaw);

  if (!isValidEmail(email)) {
    throw new UserStoreError("Introduce un correo electrónico válido.");
  }
  if (!password) {
    throw new UserStoreError("Introduce tu contraseña.");
  }

  const users = await readUsers();
  const user = users.find((u) => u.email === email);
  if (!user) {
    throw new UserStoreError("Correo o contraseña incorrectos.");
  }

  const candidate = await hashPassword(password, user.salt);
  if (candidate !== user.passwordHash) {
    throw new UserStoreError("Correo o contraseña incorrectos.");
  }

  return toAuthUser(user);
}
