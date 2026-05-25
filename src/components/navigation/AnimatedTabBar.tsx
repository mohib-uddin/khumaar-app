import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Pressable, StyleSheet, View, type LayoutChangeEvent } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { SegmentedTrack, segmentedTrackStyles } from '@/components/ui/SegmentedTrack';
import { palette, shadows, spacing } from '@/theme';
import { tabBarDock } from '@/theme/tabBar';

import { AgentOrb } from './AgentOrb';

import type { BottomTabBarProps } from 'expo-router/js-tabs';
import type { SegmentedLayout } from '@/components/ui/SegmentedTrack';

type TabIconRenderer = (props: { color: string; focused: boolean; size: number }) => React.ReactNode;

/** Same as SegmentedToggle option row: padding sm + height 44 */
const TAB_TRACK_HEIGHT = spacing.sm * 2 + 44;

/**
 * Bottom dock: Routines-style segmented pill (icons) + agent orb.
 */
const HIDDEN_TAB_BAR_ROUTES = new Set(['rituals']);

export function AnimatedTabBar({ state, descriptors, navigation }: BottomTabBarProps) {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [layouts, setLayouts] = useState<Record<number, SegmentedLayout>>({});

  const activeRouteName = state.routes[state.index]?.name;
  if (activeRouteName && HIDDEN_TAB_BAR_ROUTES.has(activeRouteName)) {
    return null;
  }

  const onTabLayout = (index: number) => (e: LayoutChangeEvent) => {
    const { x, width } = e.nativeEvent.layout;
    setLayouts((prev) => ({ ...prev, [index]: { x, width } }));
  };

  const openAgent = () => {
    router.push('/analyze');
  };

  return (
    <View
      pointerEvents="box-none"
      style={[styles.host, { paddingBottom: Math.max(insets.bottom, 10) }]}>
      <View style={styles.dock}>
        <SegmentedTrack
          activeLayout={layouts[state.index]}
          accessibilityRole="tabbar"
          accessibilityLabel="Main navigation"
          style={styles.track}>
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

            const iconColor = focused ? palette.ink[900] : palette.white;

            return (
              <Pressable
                key={route.key}
                onPress={onPress}
                onLayout={onTabLayout(index)}
                accessibilityRole="tab"
                accessibilityState={focused ? { selected: true } : {}}
                accessibilityLabel={options.tabBarAccessibilityLabel ?? label}
                hitSlop={4}
                style={segmentedTrackStyles.optionFill}>
                {renderIcon
                  ? renderIcon({ color: iconColor, focused, size: tabBarDock.iconSize })
                  : null}
              </Pressable>
            );
          })}
        </SegmentedTrack>

        <AgentOrb onPress={openAgent} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  host: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    paddingHorizontal: tabBarDock.hostPaddingX,
    zIndex: 100,
    elevation: 24,
  },
  dock: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: tabBarDock.barAgentGap,
  },
  track: {
    flex: 1,
    minHeight: TAB_TRACK_HEIGHT,
    ...shadows.floating,
  },
});
