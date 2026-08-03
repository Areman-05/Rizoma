import { Flower2, Leaf, Sprout, TreeDeciduous, TreePine } from "lucide-react-native";

export const AVATAR_PRESET_PREFIX = "preset:";

export type AvatarPreset = {
  id: string;
  label: string;
  backgroundColor: string;
  iconColor: string;
  Icon: typeof Leaf;
};

/** 10 presets locales (sin red) — se persisten por id `preset:…`. */
export const AVATAR_PRESETS: AvatarPreset[] = [
  { id: "preset:leaf-1", label: "Hoja", backgroundColor: "#01B763", iconColor: "#FFFFFF", Icon: Leaf },
  { id: "preset:leaf-2", label: "Menta", backgroundColor: "#0D9488", iconColor: "#FFFFFF", Icon: Leaf },
  { id: "preset:sprout-1", label: "Brote", backgroundColor: "#16A34A", iconColor: "#FFFFFF", Icon: Sprout },
  { id: "preset:sprout-2", label: "Verde suave", backgroundColor: "#E8F8F0", iconColor: "#01B763", Icon: Sprout },
  { id: "preset:flower-1", label: "Flor", backgroundColor: "#059669", iconColor: "#FFFFFF", Icon: Flower2 },
  { id: "preset:flower-2", label: "Pétalo", backgroundColor: "#A7F3D0", iconColor: "#047857", Icon: Flower2 },
  { id: "preset:pine-1", label: "Pino", backgroundColor: "#166534", iconColor: "#FFFFFF", Icon: TreePine },
  { id: "preset:tree-1", label: "Árbol", backgroundColor: "#2E7D32", iconColor: "#FFFFFF", Icon: TreeDeciduous },
  { id: "preset:leaf-3", label: "Oliva", backgroundColor: "#65A30D", iconColor: "#FFFFFF", Icon: Leaf },
  { id: "preset:leaf-4", label: "Bosque", backgroundColor: "#14532D", iconColor: "#BBF7D0", Icon: Leaf },
];

export const DEFAULT_AVATAR_PRESET_ID = AVATAR_PRESETS[0].id;

export function isAvatarPresetId(value: string): boolean {
  return value.startsWith(AVATAR_PRESET_PREFIX);
}

export function getAvatarPreset(id: string): AvatarPreset | undefined {
  return AVATAR_PRESETS.find((preset) => preset.id === id);
}

/** Normaliza valores guardados. Presets locales, URIs de galería y fotos remotas (p. ej. Google). */
export function normalizeAvatarValue(value: string | null | undefined): string {
  if (!value) return DEFAULT_AVATAR_PRESET_ID;
  if (isAvatarPresetId(value) && getAvatarPreset(value)) return value;
  if (
    value.startsWith("file:") ||
    value.startsWith("content:") ||
    value.startsWith("ph://") ||
    value.startsWith("http://") ||
    value.startsWith("https://")
  ) {
    return value;
  }
  return DEFAULT_AVATAR_PRESET_ID;
}
