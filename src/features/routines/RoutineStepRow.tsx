import { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, {
    interpolate,
    interpolateColor,
    useAnimatedStyle,
    useSharedValue,
    withSequence,
    withSpring,
    withTiming,
} from 'react-native-reanimated';

import { Check } from '@/components/icons';
import { PressableScale, Text } from '@/components/ui';
import { palette, radii, spacing, springs } from '@/theme';

import type { RoutineStepStatus } from './data';
import { RoutineProductCta } from './RoutineProductCta';

type Props = {
  title: string;
  description: string;
  status: RoutineStepStatus;
  onToggle: () => void;
  productCategory?: string;
  productPickCount?: number;
  onOpenProducts?: () => void;
};

const STEP_ICON = 48;

/**
 * Compact routine step row — tappable check with spring + color morph.
 */
export function RoutineStepRow({
  title,
  description,
  status,
  onToggle,
  productCategory,
  productPickCount,
  onOpenProducts,
}: Props) {
  const isCompleted = status === 'completed';
  const progress = useSharedValue(isCompleted ? 1 : 0);
  const burst = useSharedValue(0);

  useEffect(() => {
    progress.value = withSpring(isCompleted ? 1 : 0, springs.bounce);
    if (isCompleted) {
      burst.value = 0;
      burst.value = withSequence(
        withTiming(1, { duration: 220 }),
        withTiming(0, { duration: 280 }),
      );
    } else {
      burst.value = 0;
    }
  }, [isCompleted, progress, burst]);

  const circleStyle = useAnimatedStyle(() => ({
    backgroundColor: interpolateColor(
      progress.value,
      [0, 1],
      [palette.white, palette.brand[300]],
    ),
    transform: [
      {
        scale: interpolate(progress.value, [0, 0.55, 1], [1, 1.12, 1]),
      },
    ],
  }));

  const checkStyle = useAnimatedStyle(() => ({
    opacity: progress.value,
    transform: [
      { scale: interpolate(progress.value, [0, 0.4, 1], [0.2, 1.15, 1]) },
      { rotate: `${interpolate(progress.value, [0, 1], [-14, 0])}deg` },
    ],
  }));

  const burstStyle = useAnimatedStyle(() => ({
    opacity: interpolate(burst.value, [0, 0.35, 1], [0, 0.5, 0]),
    transform: [{ scale: interpolate(burst.value, [0, 1], [0.85, 1.45]) }],
  }));

  return (
    <View style={styles.row}>
      <PressableScale
        onPress={onToggle}
        pressedScale={0.88}
        dim={false}
        accessibilityRole="checkbox"
        accessibilityState={{ checked: isCompleted }}
        accessibilityLabel={`${isCompleted ? 'Uncheck' : 'Complete'} ${title}`}
        style={styles.iconHit}>
        <View style={styles.iconStack}>
          <Animated.View
            pointerEvents="none"
            style={[styles.burst, burstStyle, { backgroundColor: palette.brand[300] }]}
          />
          <Animated.View style={[styles.iconWrap, circleStyle]}>
            <Animated.View style={checkStyle}>
              <Check size={24} color={palette.ink[900]} />
            </Animated.View>
          </Animated.View>
        </View>
      </PressableScale>

      <View style={styles.copy}>
        <Text variant="stepTitle" color="textPrimary" numberOfLines={1}>
          {title}
        </Text>
        <Text variant="caption" color="textTertiary" numberOfLines={1}>
          {description}
        </Text>
      </View>

      {productCategory && onOpenProducts ? (
        <RoutineProductCta
          category={productCategory}
          pickCount={productPickCount}
          variant="compact"
          onPress={onOpenProducts}
        />
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.lg,
    backgroundColor: palette.surface.sunken,
    borderRadius: radii.pill,
    padding: spacing.sm,
  },
  iconHit: {
    borderRadius: radii.pill,
  },
  iconStack: {
    width: STEP_ICON,
    height: STEP_ICON,
    alignItems: 'center',
    justifyContent: 'center',
  },
  burst: {
    ...StyleSheet.absoluteFill,
    borderRadius: radii.pill,
  },
  iconWrap: {
    width: STEP_ICON,
    height: STEP_ICON,
    borderRadius: radii.pill,
    alignItems: 'center',
    justifyContent: 'center',
  },
  copy: {
    flex: 1,
    gap: spacing.xs,
    minWidth: 0,
  },
});
