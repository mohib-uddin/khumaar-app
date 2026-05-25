import type { TextStyle } from 'react-native';

/**
 * Lufga family names as registered with expo-font (see src/theme/fonts.ts).
 * Weights map 1:1 to the Figma text styles on the Home screen.
 */
export const fontFamilies = {
  light: 'Lufga-Light',
  lightItalic: 'Lufga-LightItalic',
  regular: 'Lufga-Regular',
  italic: 'Lufga-Italic',
  medium: 'Lufga-Medium',
  mediumItalic: 'Lufga-MediumItalic',
  semibold: 'Lufga-SemiBold',
} as const;

export type FontFamilyToken = keyof typeof fontFamilies;

type Variant = TextStyle & { fontFamily: string };

/**
 * Semantic typography tokens. Sizes and line heights mirror the Figma Home frame.
 */
export const typography = {
  displayLg: {
    fontFamily: fontFamilies.medium,
    fontSize: 30,
    lineHeight: 42,
  },
  displaySm: {
    fontFamily: fontFamilies.lightItalic,
    fontSize: 22,
    lineHeight: 26,
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
