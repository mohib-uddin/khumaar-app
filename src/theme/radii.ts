export const radii = {
  none: 0,
  xs: 6,
  sm: 8,
  md: 10,
  lg: 12,
  xl: 15,
  '2xl': 20,
  '3xl': 26,
  pill: 9999,
} as const;

export type RadiusToken = keyof typeof radii;
