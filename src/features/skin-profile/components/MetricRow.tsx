import { StyleSheet, View } from 'react-native';

import { Pill, Text } from '@/components/ui';
import { palette, spacing } from '@/theme';

import { toneColor, type Tone } from '../tones';
import { ScoreBar } from './ScoreBar';

type Badge = 'key' | 'new';

type Props = {
  label: string;
  helper?: string;
  value: string;
  position: number;
  tone: Tone;
  badge?: Badge;
  index?: number;
};

const BADGE_STYLE: Record<Badge, { bg: string; fg: string; label: string }> = {
  key: { bg: 'rgba(84, 113, 255, 0.12)', fg: palette.accent.info, label: 'KEY' },
  new: { bg: 'rgba(122, 90, 248, 0.12)', fg: '#7A5AF8', label: 'NEW' },
};

/**
 * A single measured row — label (+ optional badge & helper), value, score bar.
 * Used for both skin-health metrics and facial-ratio metrics.
 */
export function MetricRow({ label, helper, value, position, tone, badge, index = 0 }: Props) {
  const badgeStyle = badge ? BADGE_STYLE[badge] : null;

  return (
    <View style={styles.row}>
      <View style={styles.topRow}>
        <View style={styles.labelWrap}>
          <Text variant="stepTitle" color="textPrimary" numberOfLines={1}>
            {label}
          </Text>
          {badgeStyle ? (
            <Pill paddingX={6} paddingY={2} background={badgeStyle.bg}>
              <Text variant="metricSm" color={badgeStyle.fg}>
                {badgeStyle.label}
              </Text>
            </Pill>
          ) : null}
        </View>
        <Text variant="captionMedium" color={toneColor[tone]}>
          {value}
        </Text>
      </View>

      {helper ? (
        <Text variant="caption" color="textTertiary">
          {helper}
        </Text>
      ) : null}

      <ScoreBar position={position} tone={tone} index={index} />
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
  labelWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    flexShrink: 1,
  },
});
