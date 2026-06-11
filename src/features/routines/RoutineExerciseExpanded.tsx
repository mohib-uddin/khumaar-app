import { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, {
  interpolate,
  interpolateColor,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';

import { Check, Clock, Play } from '@/components/icons';
import { Button, Pill, PressableScale, Text } from '@/components/ui';
import { palette, radii, spacing, springs } from '@/theme';

import type { FacialExercise } from './data';

type Props = {
  title: string;
  description: string;
  exercise: FacialExercise;
  completed?: boolean;
  onMarkComplete?: () => void;
  onStartExercise?: () => void;
};

/** Expanded active facial-exercise step — instructions, timing and a start CTA. */
export function RoutineExerciseExpanded({
  title,
  description,
  exercise,
  completed = false,
  onMarkComplete,
  onStartExercise,
}: Props) {
  const progress = useSharedValue(completed ? 1 : 0);

  useEffect(() => {
    progress.value = withSpring(completed ? 1 : 0, springs.bounce);
  }, [completed, progress]);

  const toggleStyle = useAnimatedStyle(() => ({
    backgroundColor: interpolateColor(progress.value, [0, 1], [palette.white, palette.brand[300]]),
    transform: [{ scale: interpolate(progress.value, [0, 0.6, 1], [1, 1.1, 1]) }],
  }));

  const playStyle = useAnimatedStyle(() => ({
    opacity: interpolate(progress.value, [0, 0.35], [1, 0]),
  }));

  const checkStyle = useAnimatedStyle(() => ({
    opacity: progress.value,
    transform: [{ scale: interpolate(progress.value, [0, 1], [0.3, 1]) }],
  }));

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        {onMarkComplete ? (
          <PressableScale
            onPress={() => {
              if (completed) {
                onStartExercise?.();
                return;
              }
              onMarkComplete();
            }}
            pressedScale={0.88}
            dim={false}
            accessibilityRole={completed ? 'button' : 'checkbox'}
            accessibilityState={completed ? undefined : { checked: completed }}
            accessibilityLabel={
              completed ? `View ${title}` : `Complete ${title}`
            }
            style={styles.iconHit}>
            <Animated.View style={[styles.icon, toggleStyle]}>
              <Animated.View style={[styles.iconLayer, playStyle]}>
                <Play size={20} color={palette.ink[900]} />
              </Animated.View>
              <Animated.View style={[styles.iconLayer, checkStyle]}>
                <Check size={24} color={palette.ink[900]} />
              </Animated.View>
            </Animated.View>
          </PressableScale>
        ) : (
          <View style={styles.icon}>
            <Play size={20} color={palette.ink[900]} />
          </View>
        )}

        <PressableScale
          onPress={onStartExercise}
          dim={false}
          pressedScale={0.99}
          accessibilityRole="button"
          accessibilityLabel={`${completed ? 'View' : 'Start'} ${title}`}
          style={styles.copyHit}>
          <View style={styles.copy}>
            <Text variant="stepTitle" color="textPrimary">
              {title}
            </Text>
            <Text variant="caption" color="textTertiary">
              {description}
            </Text>
          </View>
        </PressableScale>
      </View>

      <View style={styles.chips}>
        <Pill paddingX={10} paddingY={6} background={palette.white}>
          <View style={styles.chipInner}>
            <Clock size={14} color={palette.ink[700]} />
            <Text variant="metricSm" color={palette.ink[700]}>
              {exercise.durationLabel}
            </Text>
          </View>
        </Pill>
        <Pill paddingX={10} paddingY={6} background={palette.white}>
          <Text variant="metricSm" color={palette.ink[700]}>
            {exercise.targetArea}
          </Text>
        </Pill>
      </View>

      <View style={styles.divider} />

      <View style={styles.instructions}>
        {exercise.instructions.map((step, index) => (
          <View key={step} style={styles.instructionRow}>
            <View style={styles.stepNumber}>
              <Text variant="metricSm" color={palette.ink[700]}>
                {index + 1}
              </Text>
            </View>
            <Text variant="caption" color="textSecondary" style={styles.instructionText}>
              {step}
            </Text>
          </View>
        ))}
      </View>

      <Button
        label={completed ? 'View exercise' : 'Start exercise'}
        icon={<Play size={16} color={palette.ink[900]} />}
        onPress={onStartExercise}
        accessibilityLabel={`${completed ? 'View' : 'Start'} ${title}`}
      />
    </View>
  );
}

const ICON = 48;

const styles = StyleSheet.create({
  container: {
    backgroundColor: palette.surface.sunken,
    borderRadius: radii['2xl'],
    padding: spacing.lg,
    gap: spacing.lg,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.lg,
  },
  iconHit: {
    borderRadius: radii.pill,
  },
  icon: {
    width: ICON,
    height: ICON,
    borderRadius: radii.pill,
    backgroundColor: palette.white,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  iconLayer: {
    ...StyleSheet.absoluteFill,
    alignItems: 'center',
    justifyContent: 'center',
  },
  copyHit: {
    flex: 1,
  },
  copy: {
    gap: spacing.xs,
    paddingTop: spacing.xxs,
  },
  chips: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  chipInner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  divider: {
    height: 1,
    backgroundColor: palette.ink[100],
    opacity: 0.6,
  },
  instructions: {
    gap: spacing.lg,
  },
  instructionRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.lg,
  },
  stepNumber: {
    width: 22,
    height: 22,
    borderRadius: radii.pill,
    backgroundColor: palette.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  instructionText: {
    flex: 1,
    lineHeight: 18,
    paddingTop: 3,
  },
});
