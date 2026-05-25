import type { TextStyle } from 'react-native';

/**
 * Font family names as registered with `expo-font`. The Plus Jakarta Sans family
 * is used as a high-quality, free alternative to Lufga (the font used in the
 * source design) — the proportions and italic variants align very closely.
 */
export const fontFamilies = {
  light: 'PlusJakarta_300Light',
  lightItalic: 'PlusJakarta_300Light_Italic',
  regular: 'PlusJakarta_400Regular',
  italic: 'PlusJakarta_400Regular_Italic',
  medium: 'PlusJakarta_500Medium',
  mediumItalic: 'PlusJakarta_500Medium_Italic',
  semibold: 'PlusJakarta_600SemiBold',
  semiboldItalic: 'PlusJakarta_600SemiBold_Italic',
  bold: 'PlusJakarta_700Bold',
} as const;

export type FontFamilyToken = keyof typeof fontFamilies;

type Variant = TextStyle & { fontFamily: string };

/**
 * Semantic typography tokens. Sizes mirror the Figma source. The `letterSpacing`
 * values are minor optical refinements that match the original art board.
 */
export const typography = {
  displayLg: {
    fontFamily: fontFamilies.medium,
    fontSize: 30,
    lineHeight: 42,
    letterSpacing: -0.4,
  },
  displaySm: {
    fontFamily: fontFamilies.lightItalic,
    fontSize: 22,
    lineHeight: 26,
    letterSpacing: -0.2,
  },
  emphasizedItalic: {
    fontFamily: fontFamilies.mediumItalic,
    fontSize: 22,
    lineHeight: 26,
  },
  sectionTitle: {
    fontFamily: fontFamilies.medium,
    fontSize: 18,
    lineHeight: 22,
  },
  cardTitle: {
    fontFamily: fontFamilies.mediumItalic,
    fontSize: 14,
    lineHeight: 16,
  },
  bodyLarge: {
    fontFamily: fontFamilies.regular,
    fontSize: 16,
    lineHeight: 22,
  },
  body: {
    fontFamily: fontFamilies.regular,
    fontSize: 14,
    lineHeight: 18,
  },
  bodyEmphasis: {
    fontFamily: fontFamilies.semibold,
    fontSize: 19,
    lineHeight: 22,
  },
  caption: {
    fontFamily: fontFamilies.regular,
    fontSize: 12,
    lineHeight: 14,
  },
  captionMedium: {
    fontFamily: fontFamilies.medium,
    fontSize: 12,
    lineHeight: 16,
  },
  overline: {
    fontFamily: fontFamilies.light,
    fontSize: 12,
    lineHeight: 16,
    letterSpacing: 0.6,
  },
  metric: {
    fontFamily: fontFamilies.semibold,
    fontSize: 14,
    lineHeight: 14,
  },
  metricSm: {
    fontFamily: fontFamilies.medium,
    fontSize: 10,
    lineHeight: 12,
  },
  metricLg: {
    fontFamily: fontFamilies.medium,
    fontSize: 16,
    lineHeight: 16,
  },
} as const satisfies Record<string, Variant>;

export type TypographyToken = keyof typeof typography;
