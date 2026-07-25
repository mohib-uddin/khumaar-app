import { useRouter } from 'expo-router';
import { useMemo, useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Screen } from '@/components/ui';
import { HeaderBlur } from '@/features/dashboard';
import { useLatestAnalysis } from '@/features/dashboard/hooks/useLatestAnalysis';
import { useAuth } from '@/features/onboarding';
import {
  PeriodToggle,
  RoutineCard,
  RoutineProductSheet,
  RoutinesHeader,
  applyStepOverrides,
  type Period,
  type RoutineStep,
} from '@/features/routines';
import { useRoutineCompletions } from '@/features/routines/hooks/useRoutineCompletions';
import { routinesFromPlan } from '@/features/routines/mapRoutinePlan';
import { layout, spacing } from '@/theme';

const STAGGER = 90;

const enter = (index: number) =>
  FadeInDown.delay(STAGGER * index)
    .duration(420)
    .springify()
    .damping(16);

export default function RoutinesScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { profile } = useAuth();
  const { analysis } = useLatestAnalysis();
  const { overrides, toggleStep } = useRoutineCompletions();
  const [period, setPeriod] = useState<Period>('today');
  const [expandedId, setExpandedId] = useState<string | null>(
    profile?.starter_ritual_id ?? 'morning',
  );
  const [productStep, setProductStep] = useState<Pick<RoutineStep, 'id' | 'title'> | null>(null);

  const baseRoutines = useMemo(
    () => routinesFromPlan(analysis?.routine_plan),
    [analysis?.routine_plan],
  );

  const routines = useMemo(() => {
    const filtered =
      period === 'week' ? baseRoutines : baseRoutines.filter((r) => r.id !== 'weekly');
    return filtered.map((routine) => applyStepOverrides(routine, overrides[routine.id]));
  }, [period, baseRoutines, overrides]);

  const onToggleStep = (routineId: string, stepId: string) => {
    const current = overrides[routineId]?.[stepId];
    const template = baseRoutines.find((r) => r.id === routineId);
    const baseStatus = template?.steps.find((s) => s.id === stepId)?.status;
    const isCompleted = (current ?? baseStatus) === 'completed';
    void toggleStep(routineId, stepId, isCompleted);
  };

  const startExercise = (stepId: string) => {
    router.push({ pathname: '/rituals/exercise/[id]', params: { id: stepId } });
  };

  const bottomInset = insets.bottom + spacing['6xl'];

  return (
    <Screen edges={['top', 'left', 'right']}>
      <HeaderBlur />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[styles.content, { paddingBottom: bottomInset + 80 }]}>
        <Animated.View entering={enter(0)}>
          <RoutinesHeader />
        </Animated.View>

        <View style={styles.afterHeader}>
          <View style={styles.routineList}>
            {routines.map((routine, index) => (
              <Animated.View key={routine.id} entering={enter(1 + index)}>
                <RoutineCard
                  routine={routine}
                  expanded={expandedId === routine.id}
                  onToggle={() =>
                    setExpandedId((current) => (current === routine.id ? null : routine.id))
                  }
                  onToggleStep={(stepId) => onToggleStep(routine.id, stepId)}
                  onStartExercise={startExercise}
                  onOpenProducts={(step) => setProductStep({ id: step.id, title: step.title })}
                />
              </Animated.View>
            ))}
          </View>
        </View>
      </ScrollView>

      <View
        pointerEvents="box-none"
        style={[styles.bottomDock, { paddingBottom: insets.bottom + spacing.lg }]}>
        <Animated.View entering={enter(1 + routines.length)} style={styles.toggleWrap}>
          <PeriodToggle
            value={period}
            onChange={(next) => {
              setPeriod(next);
              setExpandedId(profile?.starter_ritual_id ?? 'morning');
            }}
          />
        </Animated.View>
      </View>

      <RoutineProductSheet
        visible={Boolean(productStep)}
        step={productStep}
        onClose={() => setProductStep(null)}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingHorizontal: layout.screenPaddingX,
    paddingTop: spacing.md,
  },
  afterHeader: {
    marginTop: spacing['5xl'],
    gap: spacing.lg,
  },
  routineList: {
    gap: spacing.lg,
  },
  bottomDock: {
    position: 'absolute',
    left: layout.screenPaddingX,
    right: layout.screenPaddingX,
    bottom: 0,
    alignItems: 'center',
  },
  toggleWrap: {
    alignSelf: 'center',
  },
});
