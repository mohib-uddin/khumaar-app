import { BlurView } from 'expo-blur';
import { useEffect, useState } from 'react';
import { Pressable, StyleSheet, View, type LayoutChangeEvent } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Text } from '@/components/ui';
import { palette, radii, shadows, springs } from '@/theme';
import { useTheme } from '@/theme/ThemeProvider';

import type { BottomTabBarProps } from 'expo-router/js-tabs';

type TabIconRenderer = (props: { color: string; focused: boolean; size: number }) => React.ReactNode;

type Layout = { x: number; width: number };

export function AnimatedTabBar({ state, descriptors, navigation }: BottomTabBarProps) {
  const { name } = useTheme();
  const insets = useSafeAreaInsets();
  const [layouts, setLayouts] = useState<Record<number, Layout>>({});

  const indicatorX = useSharedValue(0);
  const indicatorW = useSharedValue(0);

  const focusedLayout = layouts[state.index];

  useEffect(() => {
    if (focusedLayout) {
      indicatorX.value = withSpring(focusedLayout.x, springs.enter);
      indicatorW.value = withSpring(focusedLayout.width, springs.enter);
    }
  }, [focusedLayout, indicatorX, indicatorW]);

  const indicatorStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: indicatorX.value }],
    width: indicatorW.value,
  }));

  const onTabLayout = (index: number) => (e: LayoutChangeEvent) => {
    const { x, width } = e.nativeEvent.layout;
    setLayouts((prev) => ({ ...prev, [index]: { x, width } }));
  };

  return (
    <View
      pointerEvents="box-none"
      style={[styles.host, { paddingBottom: Math.max(insets.bottom, 12) }]}>
      <BlurView
        tint={name === 'dark' ? 'dark' : 'light'}
        intensity={70}
        style={styles.bar}>
        <Animated.View
          pointerEvents="none"
          style={[styles.indicator, indicatorStyle, { backgroundColor: palette.ink[900] }]}
        />

        {state.routes.map((route, index) => {
          const { options } = descriptors[route.key];
          const focused = state.index === index;

          const onPress = () => {
            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true,
            });
            if (!focused && !event.defaultPrevented) {
              navigation.navigate(route.name, route.params);
            }
          };

          const renderIcon = options.tabBarIcon as TabIconRenderer | undefined;
          const label =
            typeof options.tabBarLabel === 'string'
              ? options.tabBarLabel
              : (options.title ?? route.name);

          const color = focused ? '#FFFFFF' : palette.ink[700];

          return (
            <Pressable
              key={route.key}
              onPress={onPress}
              onLayout={onTabLayout(index)}
              accessibilityRole="button"
              accessibilityState={focused ? { selected: true } : {}}
              accessibilityLabel={options.tabBarAccessibilityLabel ?? label}
              hitSlop={4}
              style={styles.tab}>
              {renderIcon ? renderIcon({ color, focused, size: 22 }) : null}
              <Text
                variant="captionMedium"
                style={[styles.label, { color }]}
                numberOfLines={1}>
                {label}
              </Text>
            </Pressable>
          );
        })}
      </BlurView>
    </View>
  );
}

const styles = StyleSheet.create({
  host: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  bar: {
    flexDirection: 'row',
    width: '100%',
    paddingHorizontal: 6,
    paddingVertical: 6,
    borderRadius: radii.pill,
    alignItems: 'center',
    overflow: 'hidden',
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    ...shadows.floating,
  },
  indicator: {
    position: 'absolute',
    top: 6,
    bottom: 6,
    left: 0,
    borderRadius: radii.pill,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 8,
    paddingVertical: 12,
    paddingHorizontal: 12,
  },
  label: {
    fontSize: 13,
  },
});
