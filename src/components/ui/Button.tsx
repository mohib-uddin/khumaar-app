import { LinearGradient } from 'expo-linear-gradient';
import type { ReactNode } from 'react';
import { StyleSheet, View, type ViewStyle } from 'react-native';

import { brandGradient, palette, radii, spacing } from '@/theme';

import { PressableScale } from './PressableScale';
import { Text } from './Text';

type Variant = 'primary' | 'secondary';

type Props = {
  label: string;
  onPress?: () => void;
  variant?: Variant;
  /** Optional leading icon node. */
  icon?: ReactNode;
  /** Stretch to fill the available width. */
  fullWidth?: boolean;
  accessibilityLabel?: string;
  style?: ViewStyle;
};

/**
 * Primary CTA. `primary` uses the lime brand gradient with dark ink text;
 * `secondary` is a soft sunken fill. Shape and motion match the app's pills.
 */
export function Button({
  label,
  onPress,
  variant = 'primary',
  icon,
  fullWidth = true,
  accessibilityLabel,
  style,
}: Props) {
  const content = (
    <View style={styles.inner}>
      {icon ? <View style={styles.icon}>{icon}</View> : null}
      <Text variant="toggleActive" color={palette.ink[900]}>
        {label}
      </Text>
    </View>
  );

  return (
    <PressableScale
      onPress={onPress}
      dim={false}
      pressedScale={0.97}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel ?? label}
      style={[fullWidth ? styles.fullWidth : styles.auto, style]}>
      {variant === 'primary' ? (
        <LinearGradient
          colors={[...brandGradient.colors]}
          locations={[...brandGradient.locations]}
          start={brandGradient.start}
          end={brandGradient.end}
          style={styles.surface}>
          {content}
        </LinearGradient>
      ) : (
        <View style={[styles.surface, styles.secondary]}>{content}</View>
      )}
    </PressableScale>
  );
}

const styles = StyleSheet.create({
  fullWidth: {
    width: '100%',
    borderRadius: radii.pill,
  },
  auto: {
    alignSelf: 'flex-start',
    borderRadius: radii.pill,
  },
  surface: {
    borderRadius: radii.pill,
    paddingVertical: spacing.xl,
    paddingHorizontal: spacing['4xl'],
    alignItems: 'center',
    justifyContent: 'center',
  },
  secondary: {
    backgroundColor: palette.surface.sunken,
  },
  inner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  icon: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
