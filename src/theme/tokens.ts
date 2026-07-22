export const colors = {
  brand: "#01B763",
  brandSoft: "#E8F8F0",
  red: "#EF4444",
  yellow: "#F1B826",
  black: "#2B2B2B",
  white: "#FFFFFF",
  gray: "#EEF2F6",
  grayText: "#9CA3AF",
  border: "#E5E7EB",
  // legacy aliases used across older screens during migration
  canvas: "#FFFFFF",
  canvasSoft: "#EEF2F6",
  primary: "#01B763",
  secondaryText: "#6B7280",
  accent: "#01B763",
  accentSoft: "#E8F8F0",
  card: "#FFFFFF",
  danger: "#EF4444",
  success: "#01B763",
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
  huge: 48,
  screenMargin: 13,
  gutter: 12,
  column: 82,
};

export const radii = {
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  pill: 999,
};

export const typography = {
  hero: 36,
  title: 28,
  subtitle: 24,
  body: 16,
  caption: 13,
  micro: 11,
  headlineLg: { size: 36, lineHeight: 36 * 1.3 },
  headlineSm: { size: 28, lineHeight: 28 * 1.3 },
  bodyLg: { size: 24, lineHeight: 24 * 1.44 },
  bodySm: { size: 16, lineHeight: 16 * 1.44 },
};

export const elevation = {
  soft: {
    shadowColor: "#2B2B2B",
    shadowOpacity: 0.06,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
  },
  pop: {
    shadowColor: "#000000",
    shadowOpacity: 0.1,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
  },
};

export const motion = {
  pressScale: 0.97,
  spring: { damping: 16, stiffness: 220 },
};
