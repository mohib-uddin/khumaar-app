/**
 * Spacing scale, in points. Following a 4-pt grid.
 * Aliases mirror common semantic uses to keep call sites readable.
 */
export const spacing = {
  none: 0,
  xxs: 2,
  xs: 4,
  sm: 6,
  md: 8,
  base: 10,
  lg: 12,
  xl: 14,
  xxl: 16,
  xxxl: 20,
  '4xl': 24,
  '5xl': 30,
  '6xl': 40,
  '7xl': 56,
} as const;

export type SpacingToken = keyof typeof spacing;

export const layout = {
  screenPaddingX: 20,
  screenContentMaxWidth: 720,
  tabBarHeight: 84,
} as const;
