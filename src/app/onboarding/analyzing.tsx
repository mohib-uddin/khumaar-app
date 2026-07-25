import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';

import { Button, Screen, Text } from '@/components/ui';
import {
  OnboardingProgress,
  OnboardingShell,
  WELLNESS_DISCLAIMER,
  invokeOnboardingAnalyze,
  updateOnboardingStep,
  useAuth,
} from '@/features/onboarding';
import { palette, spacing } from '@/theme';

export default function AnalyzingScreen() {
  const router = useRouter();
  const { batchId } = useLocalSearchParams<{ batchId: string }>();
  const { user, refreshProfile } = useAuth();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    const run = async () => {
      if (!batchId || !user) {
        setError('Missing scan batch. Go back and scan again.');
        return;
      }
      try {
        await invokeOnboardingAnalyze(batchId);
        if (cancelled) return;
        await updateOnboardingStep(user.id, 'results');
        await refreshProfile();
        router.replace('/onboarding/results');
      } catch (e) {
        if (!cancelled) {
          setError(e instanceof Error ? e.message : 'Analysis failed');
        }
      }
    };

    void run();
    return () => {
      cancelled = true;
    };
  }, [batchId, user, refreshProfile, router]);

  return (
    <Screen>
      <OnboardingShell
        title="Reading your scan"
        subtitle="Cosmetic coaching estimate — this usually takes a few seconds."
        progress={<OnboardingProgress step={6} total={7} label="Analysis" />}
        footer={
          error ? (
            <Button label="Back to scan" onPress={() => router.replace('/onboarding/prep')} />
          ) : null
        }>
        <View style={styles.center}>
          {!error ? <ActivityIndicator size="large" color={palette.brand[700]} /> : null}
          <Text variant="body" color="textSecondary" style={styles.copy}>
            {error ?? 'Finding your top focus…'}
          </Text>
          <Text variant="caption" color="textTertiary" style={styles.disclaimer}>
            {WELLNESS_DISCLAIMER}
          </Text>
        </View>
      </OnboardingShell>
    </Screen>
  );
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.xxl,
  },
  copy: {
    textAlign: 'center',
  },
  disclaimer: {
    textAlign: 'center',
    paddingHorizontal: spacing['4xl'],
  },
});
