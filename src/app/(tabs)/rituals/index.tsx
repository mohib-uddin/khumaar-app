import { useRouter } from 'expo-router';
import { useMemo, useState, useSyncExternalStore } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Screen } from '@/components/ui';
import { HeaderBlur } from '@/features/dashboard';
import {
    PeriodToggle,
    RoutineCard,
    RoutineProductSheet,
    RoutinesHeader,
    applyStepOverrides,
    nextStepStatus,
    routinesForPeriod,
    type Period,
    type RoutineStep,
    type StepStatusOverrides,
} from '@/features/routines';
import { getStepOverrides, subscribeStepOverrides } from '@/features/routines/progress';
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
  const [period, setPeriod] = useState<Period>('today');
  const [expandedId, setExpandedId] = useState<string | null>('morning');
  const [productStep, setProductStep] = useState<Pick<RoutineStep, 'id' | 'title'> | null>(null);
  const persistedOverrides = useSyncExternalStore(
    subscribeStepOverrides,
    getStepOverrides,
    getStepOverrides,
  );
  const [stepOverrides, setStepOverrides] = useState<Record<string, StepStatusOverrides>>({});

  const mergedOverrides = useMemo(
    () => ({ ...persistedOverrides, ...stepOverrides }),
    [persistedOverrides, stepOverrides],
  );

  const routines = useMemo(
    () =>
      routinesForPeriod(period).map((routine) =>
        applyStepOverrides(routine, mergedOverrides[routine.id]),
      ),
    [period, mergedOverrides],
  );

  const toggleRoutine = (id: string) => {
    setExpandedId((current) => (current === id ? null : id));
  };

  const toggleStep = (routineId: string, stepId: string) => {
    setStepOverrides((prev) => {
      const template = routinesForPeriod(period).find((r) => r.id === routineId);
      const baseStep = template?.steps.find((s) => s.id === stepId);
      const current = prev[routineId]?.[stepId] ?? baseStep?.status ?? 'pending';
      return {
        ...prev,
        [routineId]: {
          ...prev[routineId],
          [stepId]: nextStepStatus(current),
        },
      };
    });
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
          {/* <Animated.View entering={enter(1)}>
            <AIBanner visible={bannerVisible} onDismiss={() => setBannerVisible(false)} />
          </Animated.View> */}

          <View style={styles.routineList}>
            {routines.map((routine, index) => (
              <Animated.View key={routine.id} entering={enter(1 + index)}>
                <RoutineCard
                  routine={routine}
                  expanded={expandedId === routine.id}
                  onToggle={() => toggleRoutine(routine.id)}
                  onToggleStep={(stepId) => toggleStep(routine.id, stepId)}
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
              setExpandedId('morning');
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
