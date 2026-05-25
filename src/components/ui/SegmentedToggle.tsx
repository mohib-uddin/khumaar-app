import { useState } from 'react';
import { Pressable, type LayoutChangeEvent } from 'react-native';

import { Text } from '@/components/ui';
import { palette } from '@/theme';

import { SegmentedTrack, type SegmentedLayout } from './SegmentedTrack';
import { segmentedTrackStyles } from './SegmentedTrack';

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
  const [layouts, setLayouts] = useState<Record<string, SegmentedLayout>>({});

  const onOptionLayout = (optionValue: string) => (e: LayoutChangeEvent) => {
    const { x, width } = e.nativeEvent.layout;
    setLayouts((prev) => ({ ...prev, [optionValue]: { x, width } }));
  };

  return (
    <SegmentedTrack
      activeLayout={layouts[value]}
      accessibilityLabel={accessibilityLabel}>
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
            style={segmentedTrackStyles.option}>
            <Text
              variant={selected ? 'toggleActive' : 'toggleInactive'}
              color={selected ? palette.ink[900] : palette.white}
              numberOfLines={1}>
              {option.label}
            </Text>
          </Pressable>
        );
      })}
    </SegmentedTrack>
  );
}
