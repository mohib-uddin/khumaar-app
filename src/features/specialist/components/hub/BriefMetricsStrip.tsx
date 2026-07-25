import { Pressable, ScrollView, StyleSheet, View } from 'react-native';

import { EmptyStateCard, Text } from '@/components/ui';
import { layout, radii, spacing } from '@/theme';

import type { BriefChip } from '../../types';

type Props = {
  chips: BriefChip[];
  onMetricPress: (prompt: string) => void;
  emptyTitle?: string;
  emptyCaption?: string;
};

const CHIP_WIDTH = 118;

/** Horizontal skin-brief metrics — live chips only; empty card when none. */
export function BriefMetricsStrip({
  chips,
  onMetricPress,
  emptyTitle = 'Personalized briefs',
  emptyCaption = 'Scan first for personalized briefs.',
}: Props) {
  if (!chips.length) {
    return <EmptyStateCard title={emptyTitle} caption={emptyCaption} />;
  }

  return (
    <View style={styles.wrap}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        decelerationRate="fast"
        snapToInterval={CHIP_WIDTH + spacing.md}
        snapToAlignment="start"
        contentContainerStyle={styles.scroll}>
        {chips.map((chip) => (
          <Pressable
            key={chip.id}
            onPress={() => onMetricPress(chip.prompt)}
            style={({ pressed }) => [pressed && styles.pressed]}>
            <View
              style={[
                styles.chip,
                {
                  backgroundColor: chip.tintBg,
                  borderColor: chip.borderColor,
                },
              ]}>
              <Text variant="caption" style={{ color: chip.labelColor }}>
                {chip.label}
              </Text>
              <Text
                variant="metric"
                style={[styles.value, { color: chip.valueColor }]}
                numberOfLines={1}>
                {chip.value}
              </Text>
            </View>
          </Pressable>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    marginHorizontal: -layout.screenPaddingX,
  },
  scroll: {
    paddingHorizontal: layout.screenPaddingX,
    gap: spacing.md,
  },
  chip: {
    width: CHIP_WIDTH,
    borderRadius: radii.lg,
    borderWidth: 1,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    gap: spacing.xxs,
    justifyContent: 'center',
    minHeight: 64,
  },
  value: {
    fontSize: 18,
    lineHeight: 22,
  },
  pressed: {
    opacity: 0.88,
  },
});
