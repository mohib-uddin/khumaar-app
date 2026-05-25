import { LinearGradient } from 'expo-linear-gradient';
import { useEffect, type ReactNode } from 'react';
import { StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';

import { brandGradientToggle, radii, spacing, springs } from '@/theme';

export type SegmentedLayout = { x: number; width: number };

type Props = {
  activeLayout?: SegmentedLayout;
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
  accessibilityRole?: 'tablist' | 'tabbar';
  accessibilityLabel?: string;
};

/**
 * Shared pill track + sliding lime gradient indicator.
 * Used by Routines period toggle and the bottom tab bar.
 */
export function SegmentedTrack({
  activeLayout,
  children,
  style,
  accessibilityRole = 'tablist',
  accessibilityLabel,
}: Props) {
  const indicatorX = useSharedValue(0);
  const indicatorW = useSharedValue(0);

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

  return (
    <View
      style={[segmentedTrackStyles.track, style]}
      accessibilityRole={accessibilityRole}
      accessibilityLabel={accessibilityLabel}>
      <Animated.View pointerEvents="none" style={[segmentedTrackStyles.indicatorWrap, indicatorStyle]}>
        <LinearGradient
          colors={[...brandGradientToggle.colors]}
          locations={[...brandGradientToggle.locations]}
          start={brandGradientToggle.start}
          end={brandGradientToggle.end}
          style={segmentedTrackStyles.indicator}
        />
      </Animated.View>
      {children}
    </View>
  );
}

/** Option/tab slot — same metrics as SegmentedToggle labels. */
export const segmentedTrackStyles = StyleSheet.create({
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
  /** Even icon slots across the tab bar width */
  optionFill: {
    flex: 1,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1,
  },
});
