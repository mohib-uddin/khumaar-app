import { StyleSheet, View } from 'react-native';

import { Text } from '@/components/ui';
import { palette, radii, spacing } from '@/theme';

import type { ScanRecord } from './types';

type Props = {
  label: string;
  beforeValue: string;
  afterValue: string;
  delta: number;
};

function formatDelta(delta: number) {
  const percent = Math.round(Math.abs(delta) * 100);
  if (percent === 0) return 'Stable';
  return `${delta > 0 ? '+' : '-'}${percent}%`;
}

export function metricDeltas(before: ScanRecord, after: ScanRecord) {
  return after.skinMetrics
    .map((afterMetric) => {
      const beforeMetric = before.skinMetrics.find((metric) => metric.id === afterMetric.id);
      if (!beforeMetric) return null;

      return {
        id: afterMetric.id,
        label: afterMetric.label,
        beforeValue: beforeMetric.value,
        afterValue: afterMetric.value,
        delta: afterMetric.position - beforeMetric.position,
      };
    })
    .filter((metric): metric is NonNullable<typeof metric> => Boolean(metric))
    .sort((a, b) => Math.abs(b.delta) - Math.abs(a.delta));
}

/** Before -> after metric row with a compact delta badge. */
export function MetricDeltaRow({ label, beforeValue, afterValue, delta }: Props) {
  const improved = delta > 0.02;
  const declined = delta < -0.02;
  const deltaColor = improved
    ? palette.accent.success
    : declined
      ? palette.accent.warning
      : palette.ink[400];

  return (
    <View style={styles.row}>
      <View style={styles.copy}>
        <Text variant="stepTitle" color="textPrimary">
          {label}
        </Text>
        <Text variant="caption" color="textTertiary">
          {`${beforeValue} -> ${afterValue}`}
        </Text>
      </View>

      <View style={[styles.deltaBadge, { borderColor: deltaColor }]}>
        <Text variant="captionMedium" color={deltaColor}>
          {formatDelta(delta)}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.lg,
  },
  copy: {
    flex: 1,
    gap: spacing.xs,
  },
  deltaBadge: {
    borderWidth: 1,
    borderRadius: radii.pill,
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.base,
  },
});
