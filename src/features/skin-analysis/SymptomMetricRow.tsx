import { StyleSheet, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';

import { SegmentedProgressBar, Text } from '@/components/ui';
import { spacing } from '@/theme';

import type { SymptomMetric } from './data';

type Props = {
  metric: SymptomMetric;
  index: number;
};

/** Single symptom row — label, severity tag, segmented bar. */
export function SymptomMetricRow({ metric, index }: Props) {
  return (
    <Animated.View entering={FadeInDown.delay(120 + index * 80).springify()} style={styles.row}>
      <View style={styles.header}>
        <Text variant="stepTitle" color="textPrimary">
          {metric.label}
        </Text>
        <Text variant="captionMedium" color={metric.severityColor}>
          {metric.severityLabel}
        </Text>
      </View>
      <SegmentedProgressBar
        segments={metric.segments}
        color={metric.severityColor}
        index={index}
      />
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  row: {
    gap: spacing.md,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
});
