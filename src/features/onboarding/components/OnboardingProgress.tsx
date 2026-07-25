import { StyleSheet, View } from 'react-native';

import { Text } from '@/components/ui';
import { palette, radii, spacing } from '@/theme';

type Props = {
  /** 0-based current step index */
  step: number;
  total: number;
  label?: string;
  /** Lighter label for camera overlays */
  onDark?: boolean;
};

/** Thin brand track used across onboarding screens. */
export function OnboardingProgress({ step, total, label, onDark }: Props) {
  const clamped = Math.min(Math.max(step, 0), total - 1);
  return (
    <View style={styles.wrap}>
      {label ? (
        <Text
          variant="captionMedium"
          color={onDark ? 'rgba(255,255,255,0.78)' : 'textSecondary'}
          style={styles.label}>
          {label}
        </Text>
      ) : null}
      <View style={styles.track}>
        {Array.from({ length: total }).map((_, index) => (
          <View
            key={index}
            style={[
              styles.dot,
              index <= clamped ? styles.dotActive : onDark ? styles.dotIdleDark : styles.dotIdle,
              index < total - 1 ? styles.dotGap : null,
            ]}
          />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    gap: spacing.sm,
  },
  label: {
    textTransform: 'uppercase',
    letterSpacing: 0.6,
  },
  track: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dot: {
    flex: 1,
    height: 4,
    borderRadius: radii.pill,
  },
  dotGap: {
    marginRight: spacing.xs,
  },
  dotActive: {
    backgroundColor: palette.brand[500],
  },
  dotIdle: {
    backgroundColor: palette.track.muted,
  },
  dotIdleDark: {
    backgroundColor: 'rgba(255,255,255,0.28)',
  },
});
