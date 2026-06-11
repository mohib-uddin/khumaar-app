import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import Animated, {
  Easing,
  FadeInDown,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ArrowLeft, Check, Clock, Play } from '@/components/icons';
import { Button, Card, IconButton, Pill, Screen, Text } from '@/components/ui';
import { HeaderBlur } from '@/features/dashboard';
import { layout, palette, radii, spacing } from '@/theme';

import { exerciseStepById } from './data';
import { completeStep } from './progress';

const STAGGER = 90;

const enter = (index: number) =>
  FadeInDown.delay(STAGGER * index)
    .duration(420)
    .springify()
    .damping(16);

/** Full-screen guided tutorial for a facial exercise. */
export function ExerciseScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { id } = useLocalSearchParams<{ id?: string }>();
  const result = id ? exerciseStepById(id) : null;

  const handleBack = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace('/rituals');
    }
  };

  if (!result) {
    return (
      <Screen edges={['top', 'left', 'right']}>
        <HeaderBlur />
        <View style={styles.empty}>
          <Text variant="sectionTitle" color="textPrimary">
            Exercise not found
          </Text>
          <Text variant="body" color="textTertiary" style={styles.emptyCopy}>
            This exercise may still be locked or unavailable.
          </Text>
          <Button label="Back to routines" onPress={() => router.replace('/rituals')} />
        </View>
      </Screen>
    );
  }

  const { routine, step, exercise } = result;

  return (
    <Screen edges={['top', 'left', 'right']}>
      <HeaderBlur />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.content,
          { paddingBottom: insets.bottom + spacing['7xl'] },
        ]}>
        <Animated.View entering={enter(0)} style={styles.header}>
          <IconButton size={50} accessibilityLabel="Go back" onPress={handleBack}>
            <ArrowLeft size={22} />
          </IconButton>
          <Text variant="sectionTitle" color="textPrimary">
            Exercise
          </Text>
          <View style={styles.headerSpacer} />
        </Animated.View>

        <Animated.View entering={enter(1)} style={styles.heroCopy}>
          <Text variant="displaySm" color="textPrimary">
            {'Follow the '}
            <Text variant="emphasizedItalic" color="textPrimary">
              motion guide
            </Text>
          </Text>
          <Text variant="body" color="textTertiary">
            {`${routine.title} · ${exercise.targetArea}`}
          </Text>
        </Animated.View>

        <Animated.View entering={enter(2)}>
          <ExerciseMotionGuide title={step.title} />
        </Animated.View>

        <Animated.View entering={enter(3)}>
          <Card style={styles.detailsCard}>
            <View style={styles.detailsHeader}>
              <View style={styles.titleCopy}>
                <Text variant="routineTitle" color="textPrimary">
                  {step.title}
                </Text>
                <Text variant="body" color="textSecondary">
                  {step.description}
                </Text>
              </View>
              <View style={styles.playBadge}>
                <Play size={20} color={palette.ink[900]} />
              </View>
            </View>

            <View style={styles.chips}>
              <Pill paddingX={10} paddingY={6} background={palette.surface.sunken}>
                <View style={styles.chipInner}>
                  <Clock size={14} color={palette.ink[700]} />
                  <Text variant="metricSm" color={palette.ink[700]}>
                    {exercise.durationLabel}
                  </Text>
                </View>
              </Pill>
              <Pill paddingX={10} paddingY={6} background={palette.surface.sunken}>
                <Text variant="metricSm" color={palette.ink[700]}>
                  {exercise.targetArea}
                </Text>
              </Pill>
            </View>
          </Card>
        </Animated.View>

        <Animated.View entering={enter(4)} style={styles.section}>
          <Text variant="sectionTitle" color="textPrimary">
            Tutorial
          </Text>
          <Card style={styles.tutorialCard}>
            {exercise.instructions.map((instruction, index) => (
              <View key={instruction}>
                {index > 0 ? <View style={styles.divider} /> : null}
                <View style={styles.tutorialRow}>
                  <View style={styles.stepNumber}>
                    <Text variant="metricSm" color={palette.ink[700]}>
                      {index + 1}
                    </Text>
                  </View>
                  <Text variant="body" color="textSecondary" style={styles.instruction}>
                    {instruction}
                  </Text>
                </View>
              </View>
            ))}
          </Card>
        </Animated.View>

        <Animated.View entering={enter(5)} style={styles.section}>
          <Card background={palette.brand[50]} style={styles.safetyCard}>
            <Text variant="stepTitle" color="textPrimary">
              Keep it gentle
            </Text>
            <Text variant="caption" color="textSecondary" style={styles.safetyCopy}>
              Stop if you feel pain, dizziness, or jaw tension. Facial exercises should feel
              controlled, not forced.
            </Text>
          </Card>
        </Animated.View>

        <Animated.View entering={enter(6)}>
          <Button
            label="Mark exercise complete"
            icon={<Check size={18} color={palette.ink[900]} />}
            onPress={() => {
              completeStep(routine.id, step.id);
              handleBack();
            }}
          />
        </Animated.View>
      </ScrollView>
    </Screen>
  );
}

function ExerciseMotionGuide({ title }: { title: string }) {
  const pulse = useSharedValue(0);

  useEffect(() => {
    pulse.value = withRepeat(
      withSequence(
        withTiming(1, { duration: 1200, easing: Easing.inOut(Easing.ease) }),
        withTiming(0, { duration: 1200, easing: Easing.inOut(Easing.ease) }),
      ),
      -1,
      false,
    );
  }, [pulse]);

  const jawStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: pulse.value * 12 }, { scaleX: 1 + pulse.value * 0.08 }],
  }));

  const chinStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: pulse.value * 8 }],
    opacity: 0.72 + pulse.value * 0.28,
  }));

  const cueStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: -pulse.value * 8 }],
  }));

  return (
    <Card style={styles.motionCard}>
      <View style={styles.motionHeader}>
        <Text variant="cardTitle" color="textPrimary">
          Motion guide
        </Text>
        <Pill paddingX={10} paddingY={5} background={palette.brand[50]}>
          <Text variant="metricSm" color={palette.brand[700]}>
            GIF-style
          </Text>
        </Pill>
      </View>

      <View style={styles.motionStage}>
        <View style={styles.face}>
          <View style={styles.hair} />
          <View style={styles.eyeRow}>
            <View style={styles.eye} />
            <View style={styles.eye} />
          </View>
          <View style={styles.nose} />
          <Animated.View style={[styles.jaw, jawStyle]} />
          <Animated.View style={[styles.chinCue, chinStyle]} />
        </View>

        <Animated.View style={[styles.cueBubble, cueStyle]}>
          <Text variant="captionMedium" color={palette.ink[700]}>
            Slow hold · breathe
          </Text>
        </Animated.View>
      </View>

      <Text variant="caption" color="textTertiary" style={styles.motionCaption}>
        {`${title}: copy the movement slowly and keep your face relaxed.`}
      </Text>
    </Card>
  );
}

const FACE_SIZE = 178;

const styles = StyleSheet.create({
  content: {
    paddingHorizontal: layout.screenPaddingX,
    paddingTop: spacing.md,
    gap: spacing['4xl'],
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerSpacer: {
    width: 50,
  },
  heroCopy: {
    gap: spacing.base,
  },
  motionCard: {
    padding: spacing.xxl,
    gap: spacing.xxl,
  },
  motionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  motionStage: {
    height: 260,
    borderRadius: radii['2xl'],
    backgroundColor: palette.surface.sunken,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  face: {
    width: FACE_SIZE,
    height: FACE_SIZE,
    borderRadius: FACE_SIZE / 2,
    backgroundColor: '#E9C0A5',
    alignItems: 'center',
    overflow: 'hidden',
    borderWidth: 6,
    borderColor: palette.white,
  },
  hair: {
    position: 'absolute',
    top: -18,
    width: FACE_SIZE,
    height: 64,
    borderBottomLeftRadius: 54,
    borderBottomRightRadius: 54,
    backgroundColor: palette.ink[900],
  },
  eyeRow: {
    flexDirection: 'row',
    gap: 42,
    marginTop: 68,
  },
  eye: {
    width: 16,
    height: 6,
    borderRadius: radii.pill,
    backgroundColor: palette.ink[700],
  },
  nose: {
    width: 8,
    height: 28,
    marginTop: 16,
    borderRadius: radii.pill,
    backgroundColor: 'rgba(16, 16, 16, 0.18)',
  },
  jaw: {
    position: 'absolute',
    bottom: 30,
    width: 96,
    height: 34,
    borderBottomLeftRadius: 44,
    borderBottomRightRadius: 44,
    borderBottomWidth: 5,
    borderColor: palette.ink[700],
  },
  chinCue: {
    position: 'absolute',
    bottom: 10,
    width: 54,
    height: 16,
    borderRadius: radii.pill,
    backgroundColor: palette.brand[300],
  },
  cueBubble: {
    position: 'absolute',
    right: spacing.xxl,
    top: spacing.xxl,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    borderRadius: radii.pill,
    backgroundColor: palette.white,
  },
  motionCaption: {
    textAlign: 'center',
    lineHeight: 18,
  },
  detailsCard: {
    padding: spacing.xxl,
    gap: spacing.lg,
  },
  detailsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.lg,
  },
  titleCopy: {
    flex: 1,
    gap: spacing.xs,
  },
  playBadge: {
    width: 46,
    height: 46,
    borderRadius: radii.pill,
    backgroundColor: palette.brand[300],
    alignItems: 'center',
    justifyContent: 'center',
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
  section: {
    gap: spacing.lg,
  },
  tutorialCard: {
    padding: spacing.xxl,
  },
  divider: {
    height: 1,
    backgroundColor: palette.ink[100],
    marginVertical: spacing.lg,
  },
  tutorialRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.lg,
  },
  stepNumber: {
    width: 28,
    height: 28,
    borderRadius: radii.pill,
    backgroundColor: palette.surface.sunken,
    alignItems: 'center',
    justifyContent: 'center',
  },
  instruction: {
    flex: 1,
    lineHeight: 20,
    paddingTop: 3,
  },
  safetyCard: {
    padding: spacing.xxl,
    gap: spacing.sm,
  },
  safetyCopy: {
    lineHeight: 18,
  },
  empty: {
    flex: 1,
    paddingHorizontal: layout.screenPaddingX,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.lg,
  },
  emptyCopy: {
    textAlign: 'center',
  },
});
