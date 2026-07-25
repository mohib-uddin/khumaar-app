import { useRouter } from 'expo-router';
import { ScrollView, StyleSheet, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { EmptyStateCard, Screen, Text } from '@/components/ui';
import {
  DashboardHeader,
  EnvironmentCard,
  Greeting,
  HeaderBlur,
  SkinHealthCard,
  TargetPointsCard,
  WeeklyActivity,
} from '@/features/dashboard';
import { useEnvironment } from '@/features/dashboard/hooks/useEnvironment';
import { useFrontScanAvatar } from '@/features/dashboard/hooks/useFrontScanAvatar';
import { useLatestAnalysis } from '@/features/dashboard/hooks/useLatestAnalysis';
import {
  relativeUpdatedLabel,
  scoreStatus,
  useWeeklyActivityData,
} from '@/features/dashboard/hooks/useWeeklyActivityData';
import { useAuth } from '@/features/onboarding';
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
  const { profile } = useAuth();
  const { analysis } = useLatestAnalysis();
  const env = useEnvironment();
  const avatarUri = useFrontScanAvatar(analysis?.batch_id);
  const { days, nextScanLabel } = useWeeklyActivityData(analysis?.created_at);
  const focusPoints = analysis?.routine_plan?.focus_points ?? [];

  const displayName =
    profile?.display_name?.split(' ')[0] ||
    profile?.display_name ||
    'there';

  const openScan = () => router.push('/scan/weekly');

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
          <DashboardHeader
            avatarUri={avatarUri}
            onPressScan={openScan}
            onPressMagic={() => router.push('/specialist')}
            onPressAvatar={() => router.navigate('/profile')}
          />
        </Animated.View>

        <View style={styles.afterHeader}>
          <Animated.View entering={enter(1)}>
            <Greeting name={displayName} />
          </Animated.View>

          <View style={styles.afterGreeting}>
            <Animated.View entering={enter(2)}>
              <WeeklyActivity
                days={days}
                nextScanLabel={nextScanLabel}
                avatarUri={avatarUri}
              />
            </Animated.View>

            <View style={styles.progressSection}>
              <Animated.View entering={enter(3)}>
                <Text variant="sectionTitle" color="textPrimary">
                  Your Skin Progress
                </Text>
              </Animated.View>

              <View style={styles.cardsBlock}>
                <Animated.View style={styles.statRow} entering={enter(4)}>
                  {analysis ? (
                    <SkinHealthCard
                      score={analysis.overall_score}
                      updatedAt={relativeUpdatedLabel(analysis.created_at)}
                      status={scoreStatus(analysis.overall_score)}
                    />
                  ) : (
                    <EmptyStateCard
                      compact
                      title="Skin score"
                      caption="Complete a scan to unlock your score."
                    />
                  )}
                  <EnvironmentCard
                    location={env.locationLabel}
                    status={env.status}
                    readings={env.readings}
                    available={env.available}
                    emptyCaption={env.emptyCaption}
                  />
                </Animated.View>

                <Animated.View entering={enter(5)}>
                  {focusPoints.length >= 3 ? (
                    <TargetPointsCard points={focusPoints} />
                  ) : (
                    <EmptyStateCard
                      title="Your target points"
                      caption="Scan your skin to set three focus points for coaching."
                      actionLabel="Start scan"
                      onAction={openScan}
                    />
                  )}
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
