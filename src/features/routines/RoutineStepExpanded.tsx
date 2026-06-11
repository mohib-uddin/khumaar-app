import { Image } from 'expo-image';
import { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, {
    interpolate,
    interpolateColor,
    useAnimatedStyle,
    useSharedValue,
    withSpring,
} from 'react-native-reanimated';

import { Check, TonerStepIcon } from '@/components/icons';
import { PressableScale, Text } from '@/components/ui';
import { palette, radii, spacing, springs } from '@/theme';

import type { HowToStep } from './data';
import { RoutineProductCta } from './RoutineProductCta';

type Props = {
  title: string;
  description: string;
  howToLabel: string;
  steps: HowToStep[];
  completed?: boolean;
  onMarkComplete?: () => void;
  productCategory?: string;
  productPickCount?: number;
  onOpenProducts?: () => void;
};

/**
 * Expanded active step with "How to do?" walkthrough — Figma node 0:476.
 */
export function RoutineStepExpanded({
  title,
  description,
  howToLabel,
  steps,
  completed = false,
  onMarkComplete,
  productCategory,
  productPickCount,
  onOpenProducts,
}: Props) {
  const progress = useSharedValue(completed ? 1 : 0);

  useEffect(() => {
    progress.value = withSpring(completed ? 1 : 0, springs.bounce);
  }, [completed, progress]);

  const toggleStyle = useAnimatedStyle(() => ({
    backgroundColor: interpolateColor(
      progress.value,
      [0, 1],
      [palette.white, palette.brand[300]],
    ),
    transform: [{ scale: interpolate(progress.value, [0, 0.6, 1], [1, 1.1, 1]) }],
  }));

  const checkStyle = useAnimatedStyle(() => ({
    opacity: progress.value,
    transform: [{ scale: interpolate(progress.value, [0, 1], [0.3, 1]) }],
  }));

  const tonerStyle = useAnimatedStyle(() => ({
    opacity: interpolate(progress.value, [0, 0.35], [1, 0]),
    transform: [{ scale: interpolate(progress.value, [0, 1], [1, 0.6]) }],
  }));

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        {onMarkComplete ? (
          <PressableScale
            onPress={onMarkComplete}
            pressedScale={0.88}
            dim={false}
            accessibilityRole="checkbox"
            accessibilityState={{ checked: completed }}
            accessibilityLabel={`${completed ? 'Uncheck' : 'Complete'} ${title}`}
            style={styles.activeIconHit}>
            <Animated.View style={[styles.activeIcon, toggleStyle]}>
              <Animated.View style={[styles.activeIconFill, tonerStyle]}>
                <TonerStepIcon size={48} />
              </Animated.View>
              <Animated.View style={[styles.activeIconInner, checkStyle]}>
                <Check size={26} color={palette.ink[900]} />
              </Animated.View>
            </Animated.View>
          </PressableScale>
        ) : (
          <View style={styles.activeIcon}>
            <TonerStepIcon size={48} />
          </View>
        )}

        <View style={styles.copy}>
          <Text variant="stepTitle" color="textPrimary">
            {title}
          </Text>
          <Text variant="caption" color="textTertiary">
            {description}
          </Text>
          {productCategory && onOpenProducts ? (
            <RoutineProductCta
              category={productCategory}
              pickCount={productPickCount}
              variant="expanded"
              onPress={onOpenProducts}
            />
          ) : null}
        </View>
      </View>

      <View style={styles.divider} />

      <Text variant="stepTitle" color="textPrimary" style={styles.howToLabel}>
        {howToLabel}
      </Text>

      <View style={styles.stepsRow}>
        {steps.map((step) => (
          <View key={step.id} style={styles.stepColumn}>
            <View style={styles.stepImageWrap}>
              <Image source={step.image} style={styles.stepImage} contentFit="cover" />
            </View>
            <Text variant="metricSm" color="textTertiary" style={styles.stepCaption}>
              {step.caption}
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
}

const STEP_IMAGE = 54;

const styles = StyleSheet.create({
  container: {
    backgroundColor: palette.surface.sunken,
    borderRadius: radii['2xl'],
    minHeight: 217,
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.lg,
    paddingTop: spacing.base,
    paddingHorizontal: spacing.base,
  },
  activeIconHit: {
    borderRadius: radii.pill,
  },
  activeIcon: {
    width: STEP_IMAGE,
    height: STEP_IMAGE,
    borderRadius: radii.pill,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  activeIconFill: {
    ...StyleSheet.absoluteFill,
    alignItems: 'center',
    justifyContent: 'center',
  },
  activeIconInner: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  copy: {
    flex: 1,
    gap: spacing.xs,
    paddingTop: spacing.xxs,
  },
  divider: {
    height: 1,
    backgroundColor: palette.ink[100],
    marginTop: spacing.lg,
    marginHorizontal: spacing.base,
    opacity: 0.6,
  },
  howToLabel: {
    marginTop: spacing.lg,
    marginLeft: spacing.base,
  },
  stepsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.lg,
    paddingBottom: spacing.xxxl,
  },
  stepColumn: {
    width: 90,
    alignItems: 'center',
    gap: spacing.md,
  },
  stepImageWrap: {
    width: STEP_IMAGE,
    height: STEP_IMAGE,
    borderRadius: radii.pill,
    overflow: 'hidden',
    backgroundColor: palette.surface.sunken,
  },
  stepImage: {
    width: '100%',
    height: '100%',
  },
  stepCaption: {
    textAlign: 'center',
  },
});
