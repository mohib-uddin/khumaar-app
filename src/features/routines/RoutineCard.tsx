import { StyleSheet } from 'react-native';
import Animated, {
    FadeInDown,
    FadeOutUp,
    LinearTransition,
} from 'react-native-reanimated';

import { Card } from '@/components/ui';
import { getRoutineProductEntry } from '@/features/products';
import { spacing } from '@/theme';

import { ExerciseLockedRow } from './ExerciseLockedRow';
import { RoutineExerciseExpanded } from './RoutineExerciseExpanded';
import { RoutineStepExpanded } from './RoutineStepExpanded';
import { RoutineStepRow } from './RoutineStepRow';
import { RoutineSummaryRow } from './RoutineSummaryRow';
import type { Routine, RoutineStep } from './data';

type Props = {
  routine: Routine;
  expanded: boolean;
  onToggle: () => void;
  onToggleStep: (stepId: string) => void;
  onStartExercise?: (stepId: string) => void;
  onOpenProducts?: (step: RoutineStep) => void;
};

function renderStep(
  step: RoutineStep,
  onToggleStep: (stepId: string) => void,
  onStartExercise?: (stepId: string) => void,
  onOpenProducts?: (step: RoutineStep) => void,
) {
  if (step.kind === 'exercise' && step.exercise) {
    const { exercise } = step;

    if (exercise.locked) {
      return (
        <Animated.View key={step.id} layout={LinearTransition.springify()}>
          <ExerciseLockedRow
            title={step.title}
            unlockReason={exercise.unlockReason ?? 'Keep going to unlock'}
          />
        </Animated.View>
      );
    }

    return (
      <Animated.View key={step.id} layout={LinearTransition.springify()}>
        <RoutineExerciseExpanded
          title={step.title}
          description={step.description}
          exercise={exercise}
          completed={step.status === 'completed'}
          onMarkComplete={() => onToggleStep(step.id)}
          onStartExercise={() => onStartExercise?.(step.id)}
        />
      </Animated.View>
    );
  }

  if (step.status === 'active' && step.howTo) {
    const productEntry = getRoutineProductEntry(step.id);

    return (
      <Animated.View key={step.id} layout={LinearTransition.springify()}>
        <RoutineStepExpanded
          title={step.title}
          description={step.description}
          howToLabel={step.howTo.label}
          steps={step.howTo.steps}
          completed={false}
          onMarkComplete={() => onToggleStep(step.id)}
          productCategory={productEntry?.category}
          productPickCount={productEntry?.pickCount}
          onOpenProducts={productEntry ? () => onOpenProducts?.(step) : undefined}
        />
      </Animated.View>
    );
  }

  const productEntry = getRoutineProductEntry(step.id);

  return (
    <Animated.View key={step.id} layout={LinearTransition.springify()}>
      <RoutineStepRow
        title={step.title}
        description={step.description}
        status={step.status}
        onToggle={() => onToggleStep(step.id)}
        productCategory={productEntry?.category}
        productPickCount={productEntry?.pickCount}
        onOpenProducts={productEntry ? () => onOpenProducts?.(step) : undefined}
      />
    </Animated.View>
  );
}

/**
 * Expandable routine card — collapsed pill or expanded card with step list.
 */
export function RoutineCard({
  routine,
  expanded,
  onToggle,
  onToggleStep,
  onStartExercise,
  onOpenProducts,
}: Props) {
  return (
    <Animated.View layout={LinearTransition.springify()}>
      <Card
        radius={expanded ? '2xl' : 'pill'}
        elevation={expanded ? 'card' : 'floating'}
        style={[styles.card, !expanded && styles.collapsed]}>
        <RoutineSummaryRow
          title={routine.title}
          subtitle={routine.subtitle}
          icon={routine.icon}
          expanded={expanded}
          onPress={onToggle}
        />

        {expanded ? (
          <Animated.View
            entering={FadeInDown.duration(300).springify().damping(18)}
            exiting={FadeOutUp.duration(220)}
            layout={LinearTransition.springify()}
            style={styles.steps}>
            {routine.steps.map((step) =>
              renderStep(step, onToggleStep, onStartExercise, onOpenProducts),
            )}
          </Animated.View>
        ) : null}
      </Card>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: spacing.xxl,
    gap: spacing.xxxl,
  },
  collapsed: {
    padding: spacing.base,
    gap: 0,
  },
  steps: {
    gap: spacing.xxl,
  },
});
