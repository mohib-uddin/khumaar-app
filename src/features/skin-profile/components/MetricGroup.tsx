import { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, {
  FadeIn,
  FadeOut,
  LinearTransition,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';

import { ChevronDown } from '@/components/icons';
import { PressableScale, Text } from '@/components/ui';
import { palette, spacing, springs } from '@/theme';

import type { RatioGroup } from '../data';
import { MetricRow } from './MetricRow';
import { ToneTag } from './ToneTag';

type Props = {
  group: RatioGroup;
  defaultOpen?: boolean;
};

/** Collapsible group of ratio rows with a title and average tone chip. */
export function MetricGroup({ group, defaultOpen = false }: Props) {
  const [open, setOpen] = useState(defaultOpen);
  const rotation = useSharedValue(defaultOpen ? 0 : -90);

  useEffect(() => {
    rotation.value = withSpring(open ? 0 : -90, springs.enter);
  }, [open, rotation]);

  const chevronStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${rotation.value}deg` }],
  }));

  return (
    <Animated.View layout={LinearTransition.springify()} style={styles.group}>
      <PressableScale
        onPress={() => setOpen((prev) => !prev)}
        dim={false}
        pressedScale={0.99}
        accessibilityRole="button"
        accessibilityState={{ expanded: open }}
        accessibilityLabel={`${group.title}. ${open ? 'Collapse' : 'Expand'}`}
        style={styles.header}>
        <View style={styles.headerLeft}>
          <Animated.View style={chevronStyle}>
            <ChevronDown size={18} color={palette.ink[500]} />
          </Animated.View>
          <Text variant="stepTitle" color="textPrimary">
            {group.title}
          </Text>
        </View>
        {group.averageLabel ? (
          <ToneTag tone={group.averageTone ?? 'average'} label={group.averageLabel} />
        ) : null}
      </PressableScale>

      {open ? (
        <Animated.View
          entering={FadeIn.duration(220)}
          exiting={FadeOut.duration(160)}
          layout={LinearTransition.springify()}
          style={styles.rows}>
          {group.metrics.map((metric, index) => (
            <MetricRow
              key={metric.id}
              label={metric.label}
              helper={metric.helper}
              value={metric.value}
              position={metric.position}
              tone={metric.tone}
              badge={metric.badge}
              index={index}
            />
          ))}
        </Animated.View>
      ) : null}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  group: {
    gap: spacing.lg,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.md,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    flexShrink: 1,
  },
  rows: {
    gap: spacing.xxl,
    paddingLeft: spacing.lg + 18,
  },
});
