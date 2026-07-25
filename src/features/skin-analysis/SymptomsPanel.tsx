import { StyleSheet, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';

import { AwarenessTag, EmptyStateCard, Text } from '@/components/ui';
import { spacing } from '@/theme';

import { awarenessTags, type SymptomMetric } from './data';
import { PanelHeading } from './PanelHeading';
import { SymptomMetricRow } from './SymptomMetricRow';

type Props = {
  metrics?: SymptomMetric[];
};

/** Symptoms tab — live metrics only; no mock symptom rows. */
export function SymptomsPanel({ metrics }: Props) {
  const live = metrics?.length ? metrics : [];

  if (!live.length) {
    return (
      <View style={styles.panel}>
        <PanelHeading title="Detailed Analysis" subtitle="Based on AI skin detection" />
        <EmptyStateCard
          title="No symptoms yet"
          caption="Complete a scan to see symptom severity from your analysis."
        />
      </View>
    );
  }

  return (
    <View style={styles.panel}>
      <PanelHeading title="Detailed Analysis" subtitle="Based on AI skin detection" />

      <View style={styles.metrics}>
        {live.map((metric, index) => (
          <SymptomMetricRow key={metric.id} metric={metric} index={index} />
        ))}
      </View>

      <Animated.View entering={FadeInDown.delay(320).springify()} style={styles.awareSection}>
        <Text variant="stepTitle" color="textPrimary">
          Be aware
        </Text>
        <View style={styles.tags}>
          {awarenessTags.map((tag) => (
            <AwarenessTag key={tag} label={tag} />
          ))}
        </View>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  panel: {
    gap: spacing['4xl'],
  },
  metrics: {
    gap: spacing.xxl,
  },
  awareSection: {
    gap: spacing.base,
  },
  tags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.base,
  },
});
