import { StyleSheet, View } from 'react-native';

import { Text } from '@/components/ui';
import { spacing } from '@/theme';

import { toneColor, toneSoft } from '../tones';

type Props = {
  counts: { strengths: number; average: number; improve: number };
};

/** Three soft tiles summarising strengths / average / improvement counts. */
export function SummaryCounts({ counts }: Props) {
  return (
    <View style={styles.row}>
      <Tile value={counts.strengths} label="Strengths" tone="good" />
      <Tile value={counts.average} label="Average" tone="average" />
      <Tile value={counts.improve} label="To improve" tone="improve" />
    </View>
  );
}

function Tile({ value, label, tone }: { value: number; label: string; tone: 'good' | 'average' | 'improve' }) {
  return (
    <View style={[styles.tile, { backgroundColor: toneSoft[tone] }]}>
      <Text variant="metricLg" color={toneColor[tone]}>
        {value}
      </Text>
      <Text variant="caption" color="textSecondary">
        {label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    gap: spacing.base,
  },
  tile: {
    flex: 1,
    alignItems: 'center',
    gap: spacing.xs,
    paddingVertical: spacing.xl,
    borderRadius: 16,
  },
});
