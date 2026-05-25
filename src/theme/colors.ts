/**
 * Design tokens for color. Two surfaces:
 *  - `palette` is the raw scale (referenced by name, not by usage).
 *  - `lightTheme` / `darkTheme` are semantic tokens consumed by components.
 */

export const palette = {
  white: '#FFFFFF',
  black: '#000000',

  ink: {
    900: '#101010',
    700: '#2B2B2B',
    500: '#707070',
    300: '#A0A0A0',
    200: '#CCCCCC',
    100: '#E2E2E2',
  },

  surface: {
    canvas: '#F4F1F2',
    raised: '#FFFFFF',
    sunken: '#F7F5F6',
    sunkenAlt: '#F9F8F8',
  },

  brand: {
    50: '#F2FFCC',
    100: '#E1F5A3',
    300: '#C0FF00',
    500: '#AADF08',
    700: '#7CA905',
  },

  accent: {
    success: '#1D956E',
    warning: '#FD6D2C',
    info: '#5471FF',
  },
} as const;

export type ThemeColors = {
  background: string;
  surface: string;
  surfaceMuted: string;
  surfaceMutedAlt: string;

  textPrimary: string;
  textSecondary: string;
  textTertiary: string;
  textInverted: string;

  borderSubtle: string;
  borderStrong: string;
  borderOnLight: string;

  brand: string;
  brandStrong: string;
  brandSoft: string;

  success: string;
  warning: string;
  info: string;

  shadowRgb: string;
};

export const lightTheme: ThemeColors = {
  background: palette.surface.canvas,
  surface: palette.surface.raised,
  surfaceMuted: palette.surface.sunken,
  surfaceMutedAlt: palette.surface.sunkenAlt,

  textPrimary: palette.ink[900],
  textSecondary: palette.ink[500],
  textTertiary: palette.ink[300],
  textInverted: palette.white,

  borderSubtle: 'rgba(204, 204, 204, 0.8)',
  borderStrong: palette.ink[900],
  borderOnLight: palette.white,

  brand: palette.brand[500],
  brandStrong: palette.brand[300],
  brandSoft: palette.brand[50],

  success: palette.accent.success,
  warning: palette.accent.warning,
  info: palette.accent.info,

  shadowRgb: '16, 16, 16',
};

export const darkTheme: ThemeColors = {
  background: '#0B0B0B',
  surface: '#161616',
  surfaceMuted: '#1C1C1C',
  surfaceMutedAlt: '#222222',

  textPrimary: '#F4F1F2',
  textSecondary: '#A8A8A8',
  textTertiary: '#6E6E6E',
  textInverted: palette.ink[900],

  borderSubtle: 'rgba(255, 255, 255, 0.12)',
  borderStrong: '#F4F1F2',
  borderOnLight: '#262626',

  brand: palette.brand[500],
  brandStrong: palette.brand[300],
  brandSoft: 'rgba(192, 255, 0, 0.18)',

  success: palette.accent.success,
  warning: palette.accent.warning,
  info: palette.accent.info,

  shadowRgb: '0, 0, 0',
};

export type ThemeColorToken = keyof ThemeColors;

export const themes = {
  light: lightTheme,
  dark: darkTheme,
} as const;

export type ThemeName = keyof typeof themes;
