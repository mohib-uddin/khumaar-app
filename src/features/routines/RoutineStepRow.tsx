import { StyleSheet, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import { useEffect } from 'react';

import { Check } from '@/components/icons';
import { Text } from '@/components/ui';
import { palette, radii, spacing, springs } from '@/theme';

import type { RoutineStepStatus } from './data';

type Props = {
  title: string;
  description: string;
  status: RoutineStepStatus;
  onToggle?: () => void;
};

const STEP_ICON = 48;

/**
 * Compact routine step row — completed or pending pill states.
 * Figma nodes 0:467 (completed) and 0:492 (pending).
 */
export function RoutineStepRow({ title, description, status, onToggle }: Props) {
  const scale = useSharedValue(status === 'completed' ? 1 : 0.85);

  useEffect(() => {
    if (status === 'completed') {
      scale.value = withSpring(1, springs.bounce);
    }
  }, [status, scale]);

  const iconAnim = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const isCompleted = status === 'completed';

  return (
    <View style={styles.row}>
      <Animated.View
        style={[
          styles.iconWrap,
          isCompleted ? styles.iconCompleted : styles.iconPending,
          iconAnim,
        ]}>
        {isCompleted ? <Check size={24} color={palette.ink[900]} /> : null}
      </Animated.View>

      <View style={styles.copy}>
        <Text variant="stepTitle" color="textPrimary" numberOfLines={1}>
          {title}
        </Text>
        <Text variant="caption" color="textTertiary" numberOfLines={1}>
          {description}
        </Text>
      </View>
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
  iconWrap: {
    width: STEP_ICON,
    height: STEP_ICON,
    borderRadius: radii.pill,
    alignItems: 'center',
    justifyContent: 'center',
    opacity: 0.9,
  },
  iconCompleted: {
    backgroundColor: palette.brand[300],
  },
  iconPending: {
    backgroundColor: palette.white,
  },
  copy: {
    flex: 1,
    gap: spacing.xs,
  },
});
