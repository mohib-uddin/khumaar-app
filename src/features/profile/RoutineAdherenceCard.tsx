import { StyleSheet, View } from 'react-native';

import { ChevronRight } from '@/components/icons';
import { Card, Pill, PressableScale, Text } from '@/components/ui';
import { routineAdherence } from '@/features/skin-profile';
import { palette, radii, spacing } from '@/theme';

type Props = {
  onPress?: () => void;
};

/** Routine consistency summary with the next recommended action. */
export function RoutineAdherenceCard({ onPress }: Props) {
  return (
    <Card style={styles.card}>
      <View style={styles.header}>
        <Text variant="cardTitle" color="textPrimary">
          Routine Consistency
        </Text>
        <Pill paddingX={10} paddingY={5} background={palette.brand[50]}>
          <Text variant="metricSm" color={palette.brand[700]}>
            {`${routineAdherence.consistency}%`}
          </Text>
        </Pill>
      </View>

      <View style={styles.progressTrack}>
        <View style={[styles.progressFill, { width: `${routineAdherence.consistency}%` }]} />
      </View>

      <Text variant="caption" color="textSecondary">
        {`${routineAdherence.completedThisWeek} of ${routineAdherence.totalThisWeek} steps completed this week`}
      </Text>

      <PressableScale
        onPress={onPress}
        dim={false}
        pressedScale={0.98}
        accessibilityRole="button"
        accessibilityLabel={`Next: ${routineAdherence.nextAction}`}
        style={styles.nextRow}>
        <View style={styles.nextCopy}>
          <Text variant="metricSm" color={palette.ink[500]}>
            Next up
          </Text>
          <Text variant="stepTitle" color="textPrimary" numberOfLines={1}>
            {routineAdherence.nextAction}
          </Text>
        </View>
        <ChevronRight size={20} color={palette.ink[400]} />
      </PressableScale>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: spacing.xxl,
    gap: spacing.lg,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  progressTrack: {
    height: 6,
    borderRadius: radii.pill,
    backgroundColor: palette.surface.sunken,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: radii.pill,
    backgroundColor: palette.brand[500],
  },
  nextRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.lg,
    backgroundColor: palette.surface.sunken,
    borderRadius: radii.xl,
    padding: spacing.lg,
    marginTop: spacing.xs,
  },
  nextCopy: {
    flex: 1,
    gap: spacing.xs,
  },
});
