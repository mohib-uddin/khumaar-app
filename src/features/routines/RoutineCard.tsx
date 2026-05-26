import { StyleSheet, View } from 'react-native';
import Animated, {
  FadeInDown,
  FadeOutUp,
  LinearTransition,
} from 'react-native-reanimated';

import { Card } from '@/components/ui';
import { spacing } from '@/theme';

import { RoutineStepExpanded } from './RoutineStepExpanded';
import { RoutineStepRow } from './RoutineStepRow';
import { RoutineSummaryRow } from './RoutineSummaryRow';
import type { Routine, RoutineStep } from './data';

type Props = {
  routine: Routine;
  expanded: boolean;
  onToggle: () => void;
  onToggleStep: (stepId: string) => void;
};

function renderStep(step: RoutineStep, onToggleStep: (stepId: string) => void) {
  if (step.status === 'active' && step.howTo) {
    return (
      <Animated.View key={step.id} layout={LinearTransition.springify()}>
        <RoutineStepExpanded
          title={step.title}
          description={step.description}
          howToLabel={step.howTo.label}
          steps={step.howTo.steps}
          completed={false}
          onMarkComplete={() => onToggleStep(step.id)}
        />
      </Animated.View>
    );
  }

  return (
    <Animated.View key={step.id} layout={LinearTransition.springify()}>
      <RoutineStepRow
        title={step.title}
        description={step.description}
        status={step.status}
        onToggle={() => onToggleStep(step.id)}
      />
    </Animated.View>
  );
}

/**
 * Expandable routine card — collapsed pill or expanded card with step list.
 */
export function RoutineCard({ routine, expanded, onToggle, onToggleStep }: Props) {
  return (
    <Animated.View layout={LinearTransition.springify()}>
      <Card
        radius={expanded ? '2xl' : 'pill'}
        elevation={expanded ? 'card' : 'floating'}
        style={[styles.card, !expanded && styles.collapsed]}>
        <RoutineSummaryRow
          title={routine.title}
          subtitle={routine.subtitle}
          avatar={routine.avatar}
          expanded={expanded}
          onPress={onToggle}
        />

        {expanded ? (
          <Animated.View
            entering={FadeInDown.duration(300).springify().damping(18)}
            exiting={FadeOutUp.duration(220)}
            layout={LinearTransition.springify()}
            style={styles.steps}>
            {routine.steps.map((step) => renderStep(step, onToggleStep))}
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
