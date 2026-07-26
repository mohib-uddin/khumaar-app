import { useRouter } from 'expo-router';
import { useCallback, useState } from 'react';
import { Alert, ScrollView, StyleSheet, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { EmptyStateCard, Screen, Text } from '@/components/ui';
import {
  openProPaywall,
  restorePurchases,
  useOpenWeeklyScan,
  usePurchases,
} from '@/features/billing';
import { HeaderBlur, SkinHealthCard } from '@/features/dashboard';
import { useLatestAnalysis } from '@/features/dashboard/hooks/useLatestAnalysis';
import {
  relativeUpdatedLabel,
  scoreStatus,
} from '@/features/dashboard/hooks/useWeeklyActivityData';
import { signOut, useAuth } from '@/features/onboarding';
import { isStylePalette } from '@/lib/database.types';
import { layout, spacing } from '@/theme';

import { useCanUseColorStylist } from './canUseColorStylist';
import { FashionCompatibilitySheet } from './FashionCompatibilitySheet';
import { FitzpatrickScaleCard } from './FitzpatrickScaleCard';
import { ProfileActions } from './ProfileActions';
import { ProfileAnalysisSection } from './ProfileAnalysisSection';
import { ProfileGreeting } from './ProfileGreeting';
import { ProfileHeader } from './ProfileHeader';

/** Hidden until facial-ratio analysis ships — section module kept. */
const SHOW_PROFILE_ANALYSIS = false;

const STAGGER = 90;

const enter = (index: number) =>
  FadeInDown.delay(STAGGER * index)
    .duration(420)
    .springify()
    .damping(16);

/** Profile — dashboard-aligned skin metrics; analysis section gated off. */
export function ProfileScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { profile, refreshProfile, user } = useAuth();
  const { analysis } = useLatestAnalysis();
  const { isPro, refresh: refreshPurchases } = usePurchases();
  const canColorEdit = useCanUseColorStylist();
  const openScan = useOpenWeeklyScan();
  const [signingOut, setSigningOut] = useState(false);
  const [colorsOpen, setColorsOpen] = useState(false);
  const [restoring, setRestoring] = useState(false);

  const openScans = () => router.push('/scans');
  const displayName =
    profile?.display_name?.split(' ')[0] || profile?.display_name || 'there';

  const handleRestore = useCallback(() => {
    if (restoring) return;
    void (async () => {
      setRestoring(true);
      const ok = await restorePurchases();
      await refreshPurchases();
      setRestoring(false);
      Alert.alert(
        ok ? 'Restored' : 'Nothing to restore',
        ok
          ? 'Your purchases were restored.'
          : 'No active purchases found for this account.',
      );
    })();
  }, [restoring, refreshPurchases]);

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
                  caption="Complete a scan to see your metrics."
                />
              )}
              <EmptyStateCard
                compact
                title="Facial harmony"
                caption="Coming soon after face-ratio analysis ships."
              />
            </Animated.View>
          </View>

          <Animated.View entering={enter(4)}>
            <FitzpatrickScaleCard
              type={profile?.fitzpatrick_type ?? null}
              onScan={!profile?.fitzpatrick_type ? openScan : undefined}
              onPressColors={
                profile?.fitzpatrick_type
                  ? () => {
                      if (!canColorEdit) {
                        openProPaywall('color');
                        return;
                      }
                      setColorsOpen(true);
                    }
                  : undefined
              }
            />
          </Animated.View>

          {SHOW_PROFILE_ANALYSIS ? (
            <Animated.View entering={enter(5)}>
              <ProfileAnalysisSection onViewScans={openScans} />
            </Animated.View>
          ) : !analysis ? (
            <Animated.View entering={enter(5)}>
              <EmptyStateCard
                title="Ready when you are"
                caption="Complete a scan to unlock personalized metrics on your profile."
                actionLabel="Start scan"
                onAction={openScan}
              />
            </Animated.View>
          ) : null}

          <Animated.View entering={enter(6)}>
            <ProfileActions
              actions={[
                ...(isPro
                  ? []
                  : [
                      {
                        id: 'upgrade',
                        label: 'Khumaar Pro',
                        caption: 'Weekly scans, Color Edit, unlimited chat',
                        onPress: () => openProPaywall('generic'),
                      },
                    ]),
                {
                  id: 'restore',
                  label: restoring ? 'Restoring…' : 'Restore purchases',
                  caption: 'Recover Pro access from this store account',
                  onPress: restoring ? undefined : handleRestore,
                },
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

      <FashionCompatibilitySheet
        visible={colorsOpen}
        userId={user?.id ?? profile?.id}
        gender={profile?.gender ?? null}
        undertone={profile?.skin_undertone ?? null}
        fitzpatrickType={profile?.fitzpatrick_type ?? null}
        savedPalette={
          profile?.style_palette && isStylePalette(profile.style_palette)
            ? profile.style_palette
            : null
        }
        onClose={() => setColorsOpen(false)}
        onScan={!profile?.fitzpatrick_type ? openScan : undefined}
        onPaletteSaved={refreshProfile}
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
