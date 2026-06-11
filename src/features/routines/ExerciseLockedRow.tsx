import { StyleSheet, View } from 'react-native';

import { Lock } from '@/components/icons';
import { Pill, Text } from '@/components/ui';
import { palette, radii, spacing } from '@/theme';

type Props = {
  title: string;
  unlockReason: string;
};

const STEP_ICON = 48;

/** A locked facial-exercise step with its unlock requirement. */
export function ExerciseLockedRow({ title, unlockReason }: Props) {
  return (
    <View style={styles.row} accessibilityRole="summary" accessibilityLabel={`${title}. Locked. ${unlockReason}`}>
      <View style={styles.iconWrap}>
        <Lock size={22} color={palette.ink[400]} />
      </View>

      <View style={styles.copy}>
        <Text variant="stepTitle" color={palette.ink[400]} numberOfLines={1}>
          {title}
        </Text>
        <Text variant="caption" color="textTertiary" numberOfLines={1}>
          {unlockReason}
        </Text>
      </View>

      <Pill paddingX={10} paddingY={5} background={palette.white}>
        <Text variant="metricSm" color={palette.ink[400]}>
          Locked
        </Text>
      </Pill>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.lg,
    backgroundColor: palette.surface.sunken,
    borderRadius: radii.pill,
    padding: spacing.sm,
    opacity: 0.85,
  },
  iconWrap: {
    width: STEP_ICON,
    height: STEP_ICON,
    borderRadius: radii.pill,
    backgroundColor: palette.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  copy: {
    flex: 1,
    gap: spacing.xs,
  },
});
