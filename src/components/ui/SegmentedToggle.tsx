import { LinearGradient } from 'expo-linear-gradient';
import { useEffect, useState } from 'react';
import { Pressable, StyleSheet, View, type LayoutChangeEvent } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';

import { Text } from '@/components/ui';
import { brandGradientToggle, palette, radii, spacing, springs } from '@/theme';

type Option<T extends string> = {
  value: T;
  label: string;
};

type Props<T extends string> = {
  options: readonly [Option<T>, Option<T>, ...Option<T>[]];
  value: T;
  onChange: (value: T) => void;
  accessibilityLabel?: string;
};

type Layout = { x: number; width: number };

/**
 * Pill-shaped segmented control with a sliding gradient indicator.
 * Matches the "Today / This Week" toggle on the Routines screen.
 */
export function SegmentedToggle<T extends string>({
  options,
  value,
  onChange,
  accessibilityLabel = 'Period selector',
}: Props<T>) {
  const [layouts, setLayouts] = useState<Record<string, Layout>>({});
  const indicatorX = useSharedValue(0);
  const indicatorW = useSharedValue(0);

  const activeLayout = layouts[value];

  useEffect(() => {
    if (activeLayout) {
      indicatorX.value = withSpring(activeLayout.x, springs.enter);
      indicatorW.value = withSpring(activeLayout.width, springs.enter);
    }
  }, [activeLayout, indicatorX, indicatorW]);

  const indicatorStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: indicatorX.value }],
    width: indicatorW.value,
  }));

  const onOptionLayout = (optionValue: string) => (e: LayoutChangeEvent) => {
    const { x, width } = e.nativeEvent.layout;
    setLayouts((prev) => ({ ...prev, [optionValue]: { x, width } }));
  };

  return (
    <View style={styles.track} accessibilityRole="tablist" accessibilityLabel={accessibilityLabel}>
      <Animated.View pointerEvents="none" style={[styles.indicatorWrap, indicatorStyle]}>
        <LinearGradient
          colors={[...brandGradientToggle.colors]}
          locations={[...brandGradientToggle.locations]}
          start={brandGradientToggle.start}
          end={brandGradientToggle.end}
          style={styles.indicator}
        />
      </Animated.View>

      {options.map((option) => {
        const selected = option.value === value;
        return (
          <Pressable
            key={option.value}
            onPress={() => onChange(option.value)}
            onLayout={onOptionLayout(option.value)}
            accessibilityRole="tab"
            accessibilityState={{ selected }}
            accessibilityLabel={option.label}
            hitSlop={4}
            style={styles.option}>
            <Text
              variant={selected ? 'toggleActive' : 'toggleInactive'}
              color={selected ? palette.ink[900] : palette.white}
              numberOfLines={1}>
              {option.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  track: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(47, 49, 49, 0.8)',
    borderRadius: radii.pill,
    padding: spacing.sm,
    position: 'relative',
  },
  indicatorWrap: {
    position: 'absolute',
    top: spacing.sm,
    bottom: spacing.sm,
    left: 0,
  },
  indicator: {
    flex: 1,
    borderRadius: radii.pill,
  },
  option: {
    height: 44,
    paddingHorizontal: 32,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1,
  },
});
