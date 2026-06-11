import { StyleSheet, View } from 'react-native';

import { ChevronRight, Lightning } from '@/components/icons';
import { Card, Pill, PressableScale, Text } from '@/components/ui';
import { scanSummary, toneColor, toneSoft } from '@/features/skin-profile';
import { palette, radii, spacing } from '@/theme';

type Props = {
  onPress?: () => void;
};

/** Snapshot of the latest scan with a link to scan history/details. */
export function CurrentAnalysisCard({ onPress }: Props) {
  return (
    <PressableScale
      onPress={onPress}
      dim={false}
      pressedScale={0.98}
      accessibilityRole="button"
      accessibilityLabel="View scans">
      <Card style={styles.card}>
        <View style={styles.header}>
          <Text variant="cardTitle" color="textPrimary">
            Latest Scan
          </Text>
          <Text variant="caption" color={palette.ink[300]}>
            {scanSummary.capturedLabel}
          </Text>
        </View>

        <View style={styles.scoreRow}>
          <View style={styles.scoreValue}>
            <Text variant="displayLg" color="textPrimary">
              {scanSummary.score}
            </Text>
            <Text variant="body" color="textTertiary">
              {`/ ${scanSummary.total}`}
            </Text>
          </View>
          <View style={styles.deltaCol}>
            <View style={styles.deltaRow}>
              <Lightning size={14} color={palette.accent.success} />
              <Text variant="captionMedium" color={palette.accent.success}>
                {scanSummary.deltaLabel}
              </Text>
            </View>
            <Text variant="caption" color="textTertiary">
              since last scan
            </Text>
          </View>
        </View>

        <View style={styles.chipsRow}>
          <View style={[styles.chip, { backgroundColor: toneSoft.good }]}>
            <Text variant="metricSm" color={palette.ink[500]}>
              Improving
            </Text>
            <Text variant="captionMedium" color={toneColor.good}>
              {scanSummary.topImprovement}
            </Text>
          </View>
          <View style={[styles.chip, { backgroundColor: toneSoft.improve }]}>
            <Text variant="metricSm" color={palette.ink[500]}>
              Focus
            </Text>
            <Text variant="captionMedium" color={toneColor.improve}>
              {scanSummary.topConcern}
            </Text>
          </View>
        </View>

        <View style={styles.footer}>
          <Pill paddingX={10} paddingY={5} background={palette.brand[50]}>
            <Text variant="metricSm" color={palette.brand[700]}>
              {scanSummary.statusLabel}
            </Text>
          </Pill>
          <View style={styles.viewFull}>
            <Text variant="captionMedium" color={palette.brand[700]}>
              View scans
            </Text>
            <ChevronRight size={16} color={palette.brand[700]} />
          </View>
        </View>
      </Card>
    </PressableScale>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: spacing.xxl,
    gap: spacing.xl,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  scoreRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  scoreValue: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: spacing.sm,
  },
  deltaCol: {
    alignItems: 'flex-end',
    gap: spacing.xs,
  },
  deltaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  chipsRow: {
    flexDirection: 'row',
    gap: spacing.base,
  },
  chip: {
    flex: 1,
    gap: spacing.xs,
    paddingVertical: spacing.lg,
    paddingHorizontal: spacing.xl,
    borderRadius: radii.lg,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  viewFull: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
});
