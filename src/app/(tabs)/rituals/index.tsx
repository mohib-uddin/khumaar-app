import { useMemo, useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Screen } from '@/components/ui';
import { HeaderBlur } from '@/features/dashboard';
import {
  AIBanner,
  PeriodToggle,
  RoutineCard,
  RoutinesHeader,
  routinesForPeriod,
  type Period,
} from '@/features/routines';
import { layout, spacing } from '@/theme';

const STAGGER = 90;

const enter = (index: number) =>
  FadeInDown.delay(STAGGER * index)
    .duration(420)
    .springify()
    .damping(16);

export default function RoutinesScreen() {
  const insets = useSafeAreaInsets();
  const [bannerVisible, setBannerVisible] = useState(true);
  const [period, setPeriod] = useState<Period>('today');
  const [expandedId, setExpandedId] = useState<string | null>('morning');

  const routines = useMemo(() => routinesForPeriod(period), [period]);

  const toggleRoutine = (id: string) => {
    setExpandedId((current) => (current === id ? null : id));
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
          <Animated.View entering={enter(1)}>
            <AIBanner visible={bannerVisible} onDismiss={() => setBannerVisible(false)} />
          </Animated.View>

          <View style={styles.routineList}>
            {routines.map((routine, index) => (
              <Animated.View key={routine.id} entering={enter(2 + index)}>
                <RoutineCard
                  routine={routine}
                  expanded={expandedId === routine.id}
                  onToggle={() => toggleRoutine(routine.id)}
                />
              </Animated.View>
            ))}
          </View>
        </View>
      </ScrollView>

      <View
        pointerEvents="box-none"
        style={[styles.bottomDock, { paddingBottom: insets.bottom + spacing.lg }]}>
        <Animated.View entering={enter(2 + routines.length)} style={styles.toggleWrap}>
          <PeriodToggle
            value={period}
            onChange={(next) => {
              setPeriod(next);
              setExpandedId('morning');
            }}
          />
        </Animated.View>
      </View>
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
