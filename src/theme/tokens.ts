import palette from "./palette";

export const colors = {
  brand: palette.brand,
  brandSoft: palette.brandSoft,
  leafDeep: palette.leafDeep,
  wordmark: palette.wordmark,
  mintWash: palette.mintWash,
  mintMid: palette.mintMid,
  dangerSoft: palette.dangerSoft,
  red: palette.red,
  yellow: palette.yellow,
  black: palette.black,
  white: palette.white,
  gray: palette.gray,
  grayText: palette.grayText,
  border: palette.border,
  // legacy aliases used across older screens during migration
  canvas: palette.canvas,
  canvasSoft: palette.canvasSoft,
  primary: palette.primary,
  secondaryText: palette.secondaryText,
  accent: palette.accent,
  accentSoft: palette.accentSoft,
  card: palette.card,
  danger: palette.danger,
  success: palette.success,
} as const;

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
};

export const elevation = {
  soft: {
    shadowColor: colors.black,
    shadowOpacity: 0.06,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
  },
};
