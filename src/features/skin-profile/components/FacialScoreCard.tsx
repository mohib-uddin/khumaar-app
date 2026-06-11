import { StyleSheet, View } from 'react-native';

import { Card, Pill, Text } from '@/components/ui';
import { palette, spacing } from '@/theme';

import type { FacialScore } from '../data';
import { toneColor, toneSoft } from '../tones';

type Props = {
  score: FacialScore;
};

/** Headline facial-harmony score with front / side / combined breakdown. */
export function FacialScoreCard({ score }: Props) {
  return (
    <Card style={styles.card}>
      <View style={styles.header}>
        <Text variant="cardTitle" color="textPrimary">
          Facial Harmony
        </Text>
        <Pill paddingX={10} paddingY={5} background={palette.surface.sunken}>
          <Text variant="metricSm" color={palette.ink[500]}>
            {score.percentileLabel}
          </Text>
        </Pill>
      </View>

      <View style={styles.scoreRow}>
        <View style={styles.scoreValue}>
          <Text variant="displayLg" color="textPrimary">
            {score.overall.toFixed(1)}
          </Text>
          <Text variant="body" color="textTertiary">
            {`/ ${score.max}`}
          </Text>
        </View>
        <Pill paddingX={12} paddingY={7} background={toneSoft[score.tone]}>
          <Text variant="captionMedium" color={toneColor[score.tone]}>
            {score.category}
          </Text>
        </Pill>
      </View>

      <View style={styles.breakdown}>
        <Stat label="Front" value={score.front} />
        <View style={styles.divider} />
        <Stat label="Side" value={score.side} />
        <View style={styles.divider} />
        <Stat label="Combined" value={score.combined} emphasis />
      </View>
    </Card>
  );
}

function Stat({ label, value, emphasis }: { label: string; value: number; emphasis?: boolean }) {
  return (
    <View style={styles.stat}>
      <Text variant="metricLg" color={emphasis ? palette.brand[700] : 'textPrimary'}>
        {value.toFixed(1)}
      </Text>
      <Text variant="caption" color="textTertiary">
        {label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: spacing.xxl,
    gap: spacing.xxl,
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
  breakdown: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: palette.surface.sunken,
    borderRadius: 16,
    paddingVertical: spacing.lg,
    paddingHorizontal: spacing.xl,
  },
  stat: {
    flex: 1,
    alignItems: 'center',
    gap: spacing.xs,
  },
  divider: {
    width: 1,
    height: 28,
    backgroundColor: palette.ink[100],
  },
});
