import { Pressable, ScrollView, StyleSheet, View } from 'react-native';

import { Text } from '@/components/ui';
import { layout, radii, spacing } from '@/theme';

import { briefChips } from '../../sessions';

type Props = {
  onMetricPress: (prompt: string) => void;
};

const CHIP_WIDTH = 118;

/** Horizontal skin-brief metrics — compact, tinted, swipeable. */
export function BriefMetricsStrip({ onMetricPress }: Props) {
  return (
    <View style={styles.wrap}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        decelerationRate="fast"
        snapToInterval={CHIP_WIDTH + spacing.md}
        snapToAlignment="start"
        contentContainerStyle={styles.scroll}>
        {briefChips.map((chip) => (
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
              <Text variant="metric" style={[styles.value, { color: chip.valueColor }]} numberOfLines={1}>
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
