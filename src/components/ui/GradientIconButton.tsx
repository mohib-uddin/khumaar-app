import { LinearGradient } from 'expo-linear-gradient';
import type { ReactNode } from 'react';
import { StyleSheet, type ViewStyle } from 'react-native';

import { brandGradient, radii } from '@/theme';

import { PressableScale } from './PressableScale';

type Props = {
  children: ReactNode;
  size?: number;
  accessibilityLabel: string;
  onPress?: () => void;
  style?: ViewStyle;
};

/**
 * Circular icon button with the brand lime gradient fill.
 * Used for the AI "enhance" action on the Routines banner.
 */
export function GradientIconButton({
  children,
  size = 48,
  accessibilityLabel,
  onPress,
  style,
}: Props) {
  return (
    <PressableScale
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      hitSlop={8}
      pressedScale={0.92}
      style={[{ width: size, height: size, borderRadius: radii.pill }, style]}>
      <LinearGradient
        colors={[...brandGradient.colors]}
        locations={[...brandGradient.locations]}
        start={brandGradient.start}
        end={brandGradient.end}
        style={[styles.fill, { borderRadius: radii.pill }]}>
        {children}
      </LinearGradient>
    </PressableScale>
  );
}

const styles = StyleSheet.create({
  fill: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
