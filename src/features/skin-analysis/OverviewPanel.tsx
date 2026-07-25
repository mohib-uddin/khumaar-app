import { StyleSheet, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';

import { EmptyStateCard, Card, Pill, Text } from '@/components/ui';
import { Lightning } from '@/components/icons';
import {
  SkinHealthAnalysis,
  toneColor,
  toneSoft,
  type ScanSummary,
  type SkinMetric,
} from '@/features/skin-profile';
import { palette, radii, spacing } from '@/theme';

import { PanelHeading } from './PanelHeading';

type Props = {
  summary?: ScanSummary | null;
  metrics?: SkinMetric[];
};

/** Overview tab — live summary only; no mock score fallback. */
export function OverviewPanel({ summary, metrics }: Props) {
  if (!summary) {
    return (
      <View style={styles.panel}>
        <PanelHeading title="Your skin today" subtitle="AI summary of your latest scan" />
        <EmptyStateCard
          title="No scan yet"
          caption="Complete a skin scan to see your overview and health metrics."
        />
      </View>
    );
  }

  const data = summary;
  const liveMetrics = metrics?.length ? metrics : [];

  return (
    <View style={styles.panel}>
      <PanelHeading title="Your skin today" subtitle="AI summary of your latest scan" />

      <Animated.View entering={FadeInDown.delay(60).springify()}>
        <Card style={styles.summaryCard}>
          <View style={styles.scoreRow}>
            <View style={styles.scoreValue}>
              <Text variant="displayLg" color="textPrimary">
                {data.score}
              </Text>
              <Text variant="body" color="textTertiary">
                {`/ ${data.total}`}
              </Text>
            </View>
            <View style={styles.statusCol}>
              <View style={styles.deltaRow}>
                <Lightning size={14} color={palette.accent.success} />
                <Text variant="captionMedium" color={palette.accent.success}>
                  {data.deltaLabel}
                </Text>
              </View>
              <Pill paddingX={10} paddingY={5} background={palette.brand[50]}>
                <Text variant="metricSm" color={palette.brand[700]}>
                  {data.statusLabel}
                </Text>
              </Pill>
            </View>
          </View>

          <Text variant="body" color="textSecondary" style={styles.headline}>
            {data.headline}
          </Text>

          <View style={styles.chipsRow}>
            <View style={[styles.insightChip, { backgroundColor: toneSoft.good }]}>
              <Text variant="metricSm" color={palette.ink[500]}>
                Improving
              </Text>
              <Text variant="captionMedium" color={toneColor.good}>
                {data.topImprovement}
              </Text>
            </View>
            <View style={[styles.insightChip, { backgroundColor: toneSoft.improve }]}>
              <Text variant="metricSm" color={palette.ink[500]}>
                Focus
              </Text>
              <Text variant="captionMedium" color={toneColor.improve}>
                {data.topConcern}
              </Text>
            </View>
          </View>
        </Card>
      </Animated.View>

      <Animated.View entering={FadeInDown.delay(160).springify()} style={styles.section}>
        <Text variant="stepTitle" color="textPrimary">
          Skin health
        </Text>
        {liveMetrics.length ? (
          <SkinHealthAnalysis metrics={liveMetrics} />
        ) : (
          <EmptyStateCard
            title="Metrics pending"
            caption="Your next scan will fill in detailed skin health rows."
          />
        )}
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  panel: {
    gap: spacing['4xl'],
  },
  summaryCard: {
    padding: spacing.xxl,
    gap: spacing.xl,
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
  statusCol: {
    alignItems: 'flex-end',
    gap: spacing.sm,
  },
  deltaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  headline: {
    lineHeight: 20,
  },
  chipsRow: {
    flexDirection: 'row',
    gap: spacing.base,
  },
  insightChip: {
    flex: 1,
    gap: spacing.xs,
    paddingVertical: spacing.lg,
    paddingHorizontal: spacing.xl,
    borderRadius: radii.lg,
  },
  section: {
    gap: spacing.lg,
  },
});
