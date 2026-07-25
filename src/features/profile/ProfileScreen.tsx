import { useRouter } from 'expo-router';
import { useCallback, useState } from 'react';
import { Alert, ScrollView, StyleSheet, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Screen, Text } from '@/components/ui';
import { HeaderBlur, SkinHealthCard } from '@/features/dashboard';
import { signOut, useAuth } from '@/features/onboarding';
import { facialRatios, scanSummary } from '@/features/skin-profile';
import { layout, spacing } from '@/theme';

import { HarmonyScoreCard } from './HarmonyScoreCard';
import { ProfileActions } from './ProfileActions';
import { ProfileAnalysisSection } from './ProfileAnalysisSection';
import { ProfileGreeting } from './ProfileGreeting';
import { ProfileHeader } from './ProfileHeader';

const STAGGER = 90;

const enter = (index: number) =>
  FadeInDown.delay(STAGGER * index)
    .duration(420)
    .springify()
    .damping(16);

/** Profile — dashboard-aligned skin metrics and tabbed analysis. */
export function ProfileScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { profile } = useAuth();
  const [signingOut, setSigningOut] = useState(false);

  const openScans = () => router.push('/scans');
  const displayName =
    profile?.display_name?.split(' ')[0] || profile?.display_name || 'there';

  const handleSignOut = useCallback(() => {
    Alert.alert('Log out', 'Sign out of Khumaar on this device?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Log out',
        style: 'destructive',
        onPress: () => {
          void (async () => {
            if (signingOut) return;
            setSigningOut(true);
            try {
              await signOut();
              router.replace('/onboarding');
            } catch (error) {
              Alert.alert(
                'Could not log out',
                error instanceof Error ? error.message : 'Try again in a moment.',
              );
              setSigningOut(false);
            }
          })();
        },
      },
    ]);
  }, [router, signingOut]);

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
          <ProfileHeader onPressScans={openScans} />
        </Animated.View>

        <View style={styles.afterHeader}>
          <Animated.View entering={enter(1)}>
            <ProfileGreeting name={displayName} />
          </Animated.View>

          <View style={styles.metricsSection}>
            <Animated.View entering={enter(2)}>
              <Text variant="sectionTitle" color="textPrimary">
                Your Metrics
              </Text>
            </Animated.View>

            <Animated.View style={styles.statRow} entering={enter(3)}>
              <SkinHealthCard
                score={scanSummary.score}
                total={scanSummary.total}
                updatedAt={scanSummary.capturedLabel}
                status={scanSummary.statusLabel}
              />
              <HarmonyScoreCard
                score={facialRatios.score.overall}
                total={facialRatios.score.max}
                updatedAt="Front & side"
                status={facialRatios.score.percentileLabel}
              />
            </Animated.View>
          </View>

          <Animated.View entering={enter(4)}>
            <ProfileAnalysisSection onViewScans={openScans} />
          </Animated.View>

          <Animated.View entering={enter(5)}>
            <ProfileActions
              actions={[
                {
                  id: 'logout',
                  label: signingOut ? 'Logging out…' : 'Log out',
                  caption: 'Sign out of your account on this device',
                  onPress: signingOut ? undefined : handleSignOut,
                },
              ]}
            />
          </Animated.View>
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
    gap: spacing['4xl'],
  },
  metricsSection: {
    gap: spacing.xxxl,
  },
  statRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});
