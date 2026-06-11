import { StyleSheet, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

import { PressableScale, Text } from '@/components/ui';
import { brandGradientToggle, palette, radii, shadows, spacing } from '@/theme';

type Option<T extends string> = {
  value: T;
  label: string;
};

type Props<T extends string> = {
  options: readonly Option<T>[];
  value: T;
  onChange: (value: T) => void;
  accessibilityLabel?: string;
};

/**
 * Full-width light segmented tabs — matches dashboard cards, not analysis chip pills.
 */
export function ProfileSegmentTabs<T extends string>({
  options,
  value,
  onChange,
  accessibilityLabel = 'Analysis sections',
}: Props<T>) {
  return (
    <View
      style={styles.track}
      accessibilityRole="tablist"
      accessibilityLabel={accessibilityLabel}>
      {options.map((option) => {
        const selected = option.value === value;

        return (
          <PressableScale
            key={option.value}
            onPress={() => onChange(option.value)}
            dim={false}
            pressedScale={0.98}
            accessibilityRole="tab"
            accessibilityState={{ selected }}
            accessibilityLabel={option.label}
            style={styles.slot}>
            {selected ? (
              <LinearGradient
                colors={[...brandGradientToggle.colors]}
                locations={[...brandGradientToggle.locations]}
                start={brandGradientToggle.start}
                end={brandGradientToggle.end}
                style={styles.activeFill}>
                <Text variant="toggleActive" color={palette.ink[900]} numberOfLines={1}>
                  {option.label}
                </Text>
              </LinearGradient>
            ) : (
              <View style={styles.inactiveFill}>
                <Text variant="toggleInactive" color={palette.ink[400]} numberOfLines={1}>
                  {option.label}
                </Text>
              </View>
            )}
          </PressableScale>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  track: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: palette.surface.sunken,
    borderRadius: radii.pill,
    padding: spacing.xs,
    gap: spacing.xs,
  },
  slot: {
    flex: 1,
  },
  activeFill: {
    borderRadius: radii.pill,
    paddingVertical: spacing.base,
    paddingHorizontal: spacing.lg,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.soft,
  },
  inactiveFill: {
    borderRadius: radii.pill,
    paddingVertical: spacing.base,
    paddingHorizontal: spacing.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
