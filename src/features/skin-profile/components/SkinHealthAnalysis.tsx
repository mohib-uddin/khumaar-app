import { StyleSheet } from 'react-native';

import { Card } from '@/components/ui';
import { spacing } from '@/theme';

import type { SkinMetric } from '../data';
import { MetricRow } from './MetricRow';

type Props = {
  metrics: SkinMetric[];
};

/** Card listing detailed skin-health metrics with guidance bars. */
export function SkinHealthAnalysis({ metrics }: Props) {
  return (
    <Card style={styles.card}>
      {metrics.map((metric, index) => (
        <MetricRow
          key={metric.id}
          label={metric.label}
          helper={metric.helper}
          value={metric.value}
          position={metric.position}
          tone={metric.tone}
          index={index}
        />
      ))}
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: spacing.xxl,
    gap: spacing.xxl,
  },
});
