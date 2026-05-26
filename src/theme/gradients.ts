import { palette } from './colors';

/**
 * Shared gradient tokens from the Figma design system.
 * Stops and angles mirror the lime brand treatment on pills, toggles and badges.
 */
export const brandGradient = {
  colors: [palette.brand[500], palette.brand[100], palette.brand[50]] as const,
  locations: [0.2455, 0.62341, 1] as const,
  /** ~224° — AI banner & primary action chips on the Routines screen. */
  start: { x: 0.15, y: 0.05 },
  end: { x: 0.85, y: 0.95 },
} as const;

/** ~202° — segmented toggle active pill on the Routines screen. */
export const brandGradientToggle = {
  colors: brandGradient.colors,
  locations: brandGradient.locations,
  start: { x: 0.12, y: 0.08 },
  end: { x: 0.88, y: 0.92 },
} as const;

/** ~178° — weekly activity bar highlight on the Dashboard. */
export const brandGradientBar = {
  colors: brandGradient.colors,
  locations: [0.1772, 0.59161, 1] as const,
  start: { x: 0.486, y: 0 },
  end: { x: 0.514, y: 1 },
} as const;

/** Warm canvas → soft lime wash for the Specialist hub hero. */
export const specialistHubGradient = {
  colors: ['#FFF9F0', '#F4F1F2', '#E8F5CC', '#F4F1F2'] as const,
  locations: [0, 0.35, 0.65, 1] as const,
  start: { x: 0.1, y: 0 },
  end: { x: 0.9, y: 1 },
} as const;

/** ~166° — active chip on the Skin Analysis tab row. */
export const chipGradientActive = {
  colors: [palette.brand[300], '#FCFFF4'] as const,
  locations: [0.020345, 0.98348] as const,
  start: { x: 0.04, y: 0.08 },
  end: { x: 0.96, y: 0.92 },
} as const;
