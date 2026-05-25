import { Platform, type ViewStyle } from 'react-native';

import { lightTheme } from './colors';

const shadowColor = `rgb(${lightTheme.shadowRgb})`;

/**
 * Cross-platform elevation tokens. Each entry mirrors the layered drop shadows
 * used throughout the design — soft, low-spread, slightly off-axis.
 */
export const shadows: Record<'none' | 'soft' | 'card' | 'floating' | 'avatar', ViewStyle> = {
  none: Platform.select({
    default: { shadowColor: 'transparent', elevation: 0 },
  }) as ViewStyle,

  soft: Platform.select({
    ios: {
      shadowColor,
      shadowOpacity: 0.04,
      shadowOffset: { width: 0, height: 10 },
      shadowRadius: 30,
    },
    android: { elevation: 1 },
    default: {
      shadowColor,
      shadowOpacity: 0.04,
      shadowOffset: { width: 0, height: 10 },
      shadowRadius: 30,
    },
  }) as ViewStyle,

  card: Platform.select({
    ios: {
      shadowColor,
      shadowOpacity: 0.04,
      shadowOffset: { width: 0, height: 10 },
      shadowRadius: 15,
    },
    android: { elevation: 2 },
    default: {
      shadowColor,
      shadowOpacity: 0.04,
      shadowOffset: { width: 0, height: 10 },
      shadowRadius: 15,
    },
  }) as ViewStyle,

  floating: Platform.select({
    ios: {
      shadowColor,
      shadowOpacity: 0.07,
      shadowOffset: { width: 0, height: 12 },
      shadowRadius: 24,
    },
    android: { elevation: 6 },
    default: {
      shadowColor,
      shadowOpacity: 0.07,
      shadowOffset: { width: 0, height: 12 },
      shadowRadius: 24,
    },
  }) as ViewStyle,

  avatar: Platform.select({
    ios: {
      shadowColor,
      shadowOpacity: 0.06,
      shadowOffset: { width: 2, height: 18 },
      shadowRadius: 18,
    },
    android: { elevation: 4 },
    default: {
      shadowColor,
      shadowOpacity: 0.06,
      shadowOffset: { width: 2, height: 18 },
      shadowRadius: 18,
    },
  }) as ViewStyle,
};

export type ShadowToken = keyof typeof shadows;
