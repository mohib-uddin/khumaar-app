/**
 * Motion tokens. Keep durations and easings centralised so all micro-interactions
 * share a consistent rhythm — spring-driven where springs feel natural, timing
 * curves where mass-spring physics aren't needed.
 */
import { Easing } from 'react-native-reanimated';

export const durations = {
  fast: 160,
  base: 240,
  slow: 360,
  slower: 520,
} as const;

export const easings = {
  standard: Easing.bezier(0.32, 0.72, 0, 1),
  emphasized: Easing.bezier(0.2, 0.9, 0.1, 1),
  decel: Easing.out(Easing.cubic),
  accel: Easing.in(Easing.cubic),
} as const;

export const springs = {
  press: { damping: 18, stiffness: 320, mass: 0.6 },
  enter: { damping: 16, stiffness: 180, mass: 0.9 },
  bounce: { damping: 10, stiffness: 220, mass: 0.7 },
} as const;

export type DurationToken = keyof typeof durations;
export type EasingToken = keyof typeof easings;
export type SpringToken = keyof typeof springs;
