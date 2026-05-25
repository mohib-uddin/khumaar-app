import { LinearGradient } from 'expo-linear-gradient';
import { ScrollView, StyleSheet, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import { useEffect } from 'react';

import { PressableScale, Text } from '@/components/ui';
import { chipGradientActive, palette, radii, spacing, springs } from '@/theme';

export type ChipTabOption<T extends string> = {
  value: T;
  label: string;
};

type Props<T extends string> = {
  options: readonly ChipTabOption<T>[];
  value: T;
  onChange: (value: T) => void;
};

/**
 * Horizontally scrollable pill tabs — Overview / Symptoms / Treatments / Special.
 * Active chip uses the lighter lime gradient from the Skin Analysis screen.
 */
export function ChipTabs<T extends string>({ options, value, onChange }: Props<T>) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.row}
      accessibilityRole="tablist">
      {options.map((option) => {
        const selected = option.value === value;
        return (
          <ChipTab
            key={option.value}
            label={option.label}
            selected={selected}
            onPress={() => onChange(option.value)}
          />
        );
      })}
    </ScrollView>
  );
}

type ChipProps = {
  label: string;
  selected: boolean;
  onPress: () => void;
};

function ChipTab({ label, selected, onPress }: ChipProps) {
  const scale = useSharedValue(selected ? 1 : 0.98);

  useEffect(() => {
    scale.value = withSpring(selected ? 1 : 0.98, springs.press);
  }, [selected, scale]);

  const animStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  if (selected) {
    return (
      <Animated.View style={animStyle}>
        <PressableScale
          onPress={onPress}
          accessibilityRole="tab"
          accessibilityState={{ selected: true }}
          pressedScale={0.96}
          dim={false}>
          <LinearGradient
            colors={[...chipGradientActive.colors]}
            locations={[...chipGradientActive.locations]}
            start={chipGradientActive.start}
            end={chipGradientActive.end}
            style={styles.chipActive}>
            <Text variant="stepTitle" color={palette.ink[700]}>
              {label}
            </Text>
          </LinearGradient>
        </PressableScale>
      </Animated.View>
    );
  }

  return (
    <Animated.View style={animStyle}>
      <PressableScale
        onPress={onPress}
        accessibilityRole="tab"
        accessibilityState={{ selected: false }}
        pressedScale={0.96}
        style={styles.chip}>
        <Text variant="body" color={palette.ink[400]}>
          {label}
        </Text>
      </PressableScale>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    gap: spacing.base,
    paddingRight: spacing.xxxl,
  },
  chip: {
    borderWidth: 1,
    borderColor: palette.border.light,
    borderRadius: radii.pill,
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.base,
  },
  chipActive: {
    borderRadius: radii.pill,
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.base,
  },
});
