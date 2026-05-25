import { LinearGradient } from 'expo-linear-gradient';
import type { ReactNode } from 'react';
import { StyleSheet, View, type ViewStyle } from 'react-native';

import { radii } from '@/theme';

type Props = {
  children: ReactNode;
  /**
   * Horizontal padding. Default 10pt.
   */
  paddingX?: number;
  /**
   * Vertical padding. Default 6pt.
   */
  paddingY?: number;
  /**
   * Gradient stops. When omitted the pill renders a solid background.
   */
  gradient?: readonly [string, string, ...string[]];
  /**
   * Optional color stop locations (0–1) for gradient pills.
   */
  gradientLocations?: readonly [number, number, ...number[]];
  /**
   * Solid background. Ignored when `gradient` is provided.
   */
  background?: string;
  style?: ViewStyle;
};

/**
 * Pill-shaped container. The dashboard uses the gradient variant for the
 * "Oiliness" badge and the solid variant elsewhere.
 */
export function Pill({
  children,
  paddingX = 10,
  paddingY = 6,
  gradient,
  gradientLocations,
  background,
  style,
}: Props) {
  const sizing: ViewStyle = {
    paddingHorizontal: paddingX,
    paddingVertical: paddingY,
    borderRadius: radii.pill,
  };

  if (gradient) {
    return (
      <LinearGradient
        colors={gradient}
        locations={gradientLocations}
        start={{ x: 0.08, y: 0.02 }}
        end={{ x: 0.92, y: 0.98 }}
        style={[styles.center, sizing, style]}>
        {children}
      </LinearGradient>
    );
  }

  return (
    <View style={[styles.center, sizing, { backgroundColor: background }, style]}>{children}</View>
  );
}

const styles = StyleSheet.create({
  center: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
