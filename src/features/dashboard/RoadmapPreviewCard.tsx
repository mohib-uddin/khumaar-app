import { StyleSheet, View } from 'react-native';

import { ChevronRight } from '@/components/icons';
import { Card, Pill, PressableScale, Text } from '@/components/ui';
import { roadmapPhases } from '@/features/skin-profile';
import { palette, radii, spacing } from '@/theme';

type Props = {
  onPress?: () => void;
};

/** Compact preview of the active transformation phase. */
export function RoadmapPreviewCard({ onPress }: Props) {
  const activeIndex = roadmapPhases.findIndex((phase) => phase.status === 'active');
  const active = roadmapPhases[activeIndex] ?? roadmapPhases[0];
  const next = roadmapPhases[activeIndex + 1];

  return (
    <PressableScale
      onPress={onPress}
      dim={false}
      pressedScale={0.98}
      accessibilityRole="button"
      accessibilityLabel="View your transformation roadmap">
      <Card style={styles.card}>
        <View style={styles.header}>
          <Text variant="cardTitle" color="textPrimary">
            Transformation Roadmap
          </Text>
          <Pill paddingX={10} paddingY={5} background={palette.surface.sunken}>
            <Text variant="metricSm" color={palette.ink[500]}>
              {active.month}
            </Text>
          </Pill>
        </View>

        <View style={styles.titleRow}>
          <Text variant="routineTitle" color="textPrimary">
            {active.title}
          </Text>
          <ChevronRight size={20} color={palette.ink[400]} />
        </View>

        <View style={styles.chips}>
          {active.focus.map((item) => (
            <Pill key={item} paddingX={10} paddingY={5} background={palette.brand[50]}>
              <Text variant="metricSm" color={palette.brand[700]}>
                {item}
              </Text>
            </Pill>
          ))}
        </View>

        <View style={styles.progressTrack}>
          <View style={[styles.progressFill, { width: `${active.progress}%` }]} />
        </View>

        <View style={styles.footer}>
          <Text variant="caption" color="textTertiary" numberOfLines={1} style={styles.footerText}>
            {next ? `Next: ${next.title}` : 'Final phase'}
          </Text>
          <Text variant="captionMedium" color={palette.brand[700]}>
            {`${active.progress}%`}
          </Text>
        </View>
      </Card>
    </PressableScale>
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
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  chips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  progressTrack: {
    height: 6,
    borderRadius: radii.pill,
    backgroundColor: palette.surface.sunken,
    overflow: 'hidden',
    marginTop: spacing.xs,
  },
  progressFill: {
    height: '100%',
    borderRadius: radii.pill,
    backgroundColor: palette.brand[500],
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.md,
  },
  footerText: {
    flex: 1,
  },
});
