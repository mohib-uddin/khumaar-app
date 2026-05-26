import { useRouter } from 'expo-router';
import { ScrollView, StyleSheet, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Screen, Text } from '@/components/ui';
import {
  DashboardHeader,
  EnvironmentCard,
  Greeting,
  HeaderBlur,
  SkinHealthCard,
  TargetPointsCard,
  WeeklyActivity,
} from '@/features/dashboard';
import { layout, spacing } from '@/theme';

const STAGGER = 90;

const enter = (index: number) =>
  FadeInDown.delay(STAGGER * index)
    .duration(420)
    .springify()
    .damping(16);

export default function DashboardScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();

  return (
    <Screen edges={['top', 'left', 'right']}>
      <HeaderBlur />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.content,
          { paddingBottom: insets.bottom + layout.tabBarHeight + spacing.xxxl },
        ]}>
        <Animated.View entering={enter(0)}>
          <DashboardHeader onPressScan={() => router.push('/analyze')} />
        </Animated.View>

        <View style={styles.afterHeader}>
          <Animated.View entering={enter(1)}>
            <Greeting name="Micy" />
          </Animated.View>

          <View style={styles.afterGreeting}>
            <Animated.View entering={enter(2)}>
              <WeeklyActivity />
            </Animated.View>

            <View style={styles.progressSection}>
              <Animated.View entering={enter(3)}>
                <Text variant="sectionTitle" color="textPrimary">
                  Your Skin Progress
                </Text>
              </Animated.View>

              <View style={styles.cardsBlock}>
                <Animated.View style={styles.statRow} entering={enter(4)}>
                  <SkinHealthCard />
                  <EnvironmentCard />
                </Animated.View>

                <Animated.View entering={enter(5)}>
                  <TargetPointsCard />
                </Animated.View>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
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
  afterGreeting: {
    gap: spacing['4xl'],
  },
  progressSection: {
    gap: spacing.xxxl,
  },
  cardsBlock: {
    gap: spacing.base,
  },
  statRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});
