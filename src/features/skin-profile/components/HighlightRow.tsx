import { StyleSheet, View } from 'react-native';

import { Text } from '@/components/ui';
import { palette, spacing } from '@/theme';

import type { RatioHighlight } from '../data';
import { toneColor } from '../tones';
import { ScoreBar } from './ScoreBar';

type Props = {
  highlight: RatioHighlight;
  index?: number;
};

/** A strength or improvement item — value, bar, and an optional next step. */
export function HighlightRow({ highlight, index = 0 }: Props) {
  return (
    <View style={styles.row}>
      <View style={styles.topRow}>
        <Text variant="stepTitle" color="textPrimary" numberOfLines={1} style={styles.label}>
          {highlight.label}
        </Text>
        <Text variant="captionMedium" color={toneColor[highlight.tone]}>
          {highlight.value}
        </Text>
      </View>

      <ScoreBar position={highlight.position} tone={highlight.tone} index={index} />

      {highlight.suggestion ? (
        <View style={styles.suggestion}>
          <View style={styles.dot} />
          <Text variant="caption" color="textSecondary" style={styles.suggestionText}>
            {highlight.suggestion}
          </Text>
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    gap: spacing.sm,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.md,
  },
  label: {
    flexShrink: 1,
  },
  suggestion: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginTop: spacing.xxs,
  },
  dot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: palette.brand[500],
  },
  suggestionText: {
    flex: 1,
  },
});
